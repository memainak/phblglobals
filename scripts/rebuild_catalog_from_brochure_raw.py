import os
import glob
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import scipy.ndimage as ndi
from scripts.batch_enhance_all import THEMES, create_studio_background

RAW_DIR = 'scripts/raw_brochure_images'
OUT_DIR = 'public/images/products'

def extract_clean_packshot(im):
    orig = im.convert('RGB')
    arr = np.array(orig)
    h, w, _ = arr.shape
    
    corners = np.concatenate([
        arr[:8, :8].reshape(-1, 3),
        arr[:8, -8:].reshape(-1, 3),
        arr[-8:, :8].reshape(-1, 3),
        arr[-8:, -8:].reshape(-1, 3)
    ])
    bg_color = np.median(corners, axis=0)
    
    diff = np.linalg.norm(arr.astype(float) - bg_color, axis=-1)
    raw_mask = (diff > 16)
    
    labeled, num_features = ndi.label(raw_mask)
    if num_features == 0:
        return orig, Image.new('L', orig.size, 255)
        
    sizes = ndi.sum(raw_mask, labeled, range(1, num_features + 1))
    largest_label = np.argmax(sizes) + 1
    
    keep_mask = (labeled == largest_label)
    max_size = sizes[largest_label - 1]
    for idx, s in enumerate(sizes):
        if idx + 1 != largest_label and s > max_size * 0.05:
            keep_mask = keep_mask | (labeled == idx + 1)
            
    struct = np.ones((5, 5), dtype=bool)
    closed_mask = ndi.binary_closing(keep_mask, structure=struct)
    
    coords = np.argwhere(closed_mask)
    if len(coords) == 0:
        return orig, Image.new('L', orig.size, 255)
        
    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0)
    
    crop = orig.crop((x0, y0, x1+1, y1+1))
    sub_mask = (closed_mask[y0:y1+1, x0:x1+1]).astype(np.uint8) * 255
    mask_img = Image.fromarray(sub_mask).filter(ImageFilter.GaussianBlur(1.0))
    
    return crop, mask_img

def compose_packshot(crop, mask, theme_name, is_card=False, canvas_size=(600, 600)):
    canvas_w, canvas_h = canvas_size
    bg_img = create_studio_background(canvas_w, canvas_h, theme_name).convert('RGBA')
    crop_w, crop_h = crop.size
    aspect = crop_w / crop_h
    
    if is_card or aspect > 1.15:
        target_w = int(canvas_w * 0.82)
        scale = target_w / crop_w
        new_w = target_w
        new_h = int(crop_h * scale)
        if new_h > int(canvas_h * 0.72):
            new_h = int(canvas_h * 0.72)
            new_w = int(crop_w * (new_h / crop_h))
            
        pos_x = (canvas_w - new_w) // 2
        pos_y = (canvas_h - new_h) // 2
        
        resized = crop.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        if is_card:
            card_mask = Image.new('L', (new_w, new_h), 0)
            draw_m = ImageDraw.Draw(card_mask)
            draw_m.rounded_rectangle([0, 0, new_w-1, new_h-1], radius=8, fill=255)
            
            card_rgba = Image.new('RGBA', (new_w, new_h), (0, 0, 0, 0))
            card_rgba.paste(resized, (0, 0))
            card_rgba.putalpha(card_mask)
            
            draw_c = ImageDraw.Draw(card_rgba)
            draw_c.rounded_rectangle([0, 0, new_w-1, new_h-1], radius=8, outline=(18, 21, 15, 35), width=1)
            
            shadow = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
            s_draw = ImageDraw.Draw(shadow)
            s_draw.rounded_rectangle([pos_x + 6, pos_y + 10, pos_x + new_w - 6, pos_y + new_h + 10], radius=14, fill=(18, 30, 25, 95))
            shadow = shadow.filter(ImageFilter.GaussianBlur(11.0))
            
            bg_img.alpha_composite(shadow)
            bg_img.alpha_composite(card_rgba, (pos_x, pos_y))
            return bg_img.convert('RGB')
        else: # horizontal tube (ointments)
            mask_resized = mask.resize((new_w, new_h), Image.Resampling.BILINEAR)
            shadow = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
            s_draw = ImageDraw.Draw(shadow)
            s_draw.ellipse([pos_x + 10, pos_y + new_h - 10, pos_x + new_w - 10, pos_y + new_h + 20], fill=(20, 30, 20, 110))
            shadow = shadow.filter(ImageFilter.GaussianBlur(11.0))
            
            bg_img.alpha_composite(shadow)
            bg_img.paste(resized, (pos_x, pos_y), mask_resized)
            return bg_img.convert('RGB')
    else:
        # Tall bottles, cartons, jars
        target_h = int(canvas_h * 0.835)
        scale = target_h / crop_h
        new_h = target_h
        new_w = max(1, int(crop_w * scale))
        if new_w > int(canvas_w * 0.78):
            new_w = int(canvas_w * 0.78)
            new_h = int(crop_h * (new_w / crop_w))
            
        pad_bottom = int(canvas_h * 0.065)
        pos_x = (canvas_w - new_w) // 2
        pos_y = canvas_h - pad_bottom - new_h
        
        resized = crop.resize((new_w, new_h), Image.Resampling.LANCZOS)
        mask_resized = mask.resize((new_w, new_h), Image.Resampling.BILINEAR)
        
        shadow = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(shadow)
        shadow_w = int(new_w * 0.90)
        shadow_h = max(12, int(new_h * 0.08))
        shadow_cx = canvas_w // 2
        shadow_cy = pos_y + new_h
        
        s_draw.ellipse([shadow_cx - shadow_w // 2, shadow_cy - shadow_h // 2, shadow_cx + shadow_w // 2, shadow_cy + shadow_h // 2], fill=(20, 30, 20, 110))
        s_draw.ellipse([shadow_cx - int(new_w*0.62) // 2, shadow_cy - int(shadow_h*0.5) // 2, shadow_cx + int(new_w*0.62) // 2, shadow_cy + int(shadow_h*0.5) // 2], fill=(10, 18, 10, 140))
        shadow = shadow.filter(ImageFilter.GaussianBlur(10.0))
        
        bg_img.alpha_composite(shadow)
        bg_img.paste(resized, (pos_x, pos_y), mask_resized)
        return bg_img.convert('RGB')

BROCHURE_MAPPING = {
    # Drops (P-Series)
    'drop-p1': ('p20_X153.jpg', 'drops', False),
    'drop-p2': ('p20_X154.jpg', 'drops', False),
    'drop-p3': ('p20_X155.jpg', 'drops', False),
    'drop-p4': ('p20_X156.jpg', 'drops', False),
    'drop-p5': ('p21_X162.jpg', 'drops', False),
    'drop-p6': ('p21_X163.jpg', 'drops', False),
    'drop-p7': ('p21_X164.jpg', 'drops', False),
    'drop-p8': ('p21_X165.jpg', 'drops', False),
    'drop-p9': ('p22_X171.jpg', 'drops', False),
    'drop-p10': ('p22_X172.jpg', 'drops', False),
    'drop-p11': ('p22_X173.jpg', 'drops', False),
    'drop-p12': ('p22_X174.jpg', 'drops', False),
    'drop-p13': ('p23_X181.jpg', 'drops', False),
    'drop-p14': ('p23_X182.jpg', 'drops', False),
    'drop-p15': ('p23_X179.jpg', 'drops', False),
    'drop-p16': ('p23_X183.jpg', 'drops', False),
    'drop-p17': ('p24_X188.jpg', 'drops', False),
    'drop-p18': ('p24_X189.jpg', 'drops', False),
    'drop-p19': ('p24_X190.jpg', 'drops', False),
    'drop-p20': ('p24_X191.jpg', 'drops', False),
    'drop-p21': ('p24_X192.jpg', 'drops', False),
    
    # Skincare & Oils
    'protectin-hand-care': ('p25_X199.jpg', 'protectin', False),
    'puro-olive-oil': ('p25_X200.jpg', 'olive', False),
    'rheumacure-oil': ('p25_X201.jpg', 'tonics', False),
    
    # Tonics & Combinations (Pages 26-32)
    'd-worm': ('p26_X207.jpg', 'tonics', False),
    'babitone': ('p26_X208.jpg', 'tonics', False),
    'aqua-gripe': ('p26_X209.jpg', 'tonics', False),
    'enteron': ('p27_X215.jpg', 'tonics', False),
    'fevi-cold': ('p27_X216.jpg', 'tonics', False),
    'evesoma': ('p27_X217.jpg', 'tonics', False),
    'gastrin': ('p28_X222.jpg', 'tonics', False),
    'iq-tone': ('p28_X223.jpg', 'tonics', False),
    'hepatone': ('p28_X224.jpg', 'tonics', False),
    'kalmegh': ('p29_X229.jpg', 'tonics', False),
    'moltotex': ('p29_X230.jpg', 'tonics', False),
    'nokaf': ('p29_X231.jpg', 'tonics', False),
    'power-plus-drops': ('p30_X236.jpg', 'drops', False),
    'p-alfalfa': ('p30_X238.jpg', 'tonics', False),
    'purozyme': ('p30_X239.jpg', 'tonics', False),
    'rbc-tone': ('p31_X244.jpg', 'tonics', False),
    'rheumacure': ('p31_X245.jpg', 'tonics', False),
    'rheumacur-plus': ('p31_X246.jpg', 'tonics', False),
    'rheumacur-plus-sugar-free': ('p31_X247.jpg', 'tonics', False),
    'vitovita': ('p32_X252.jpg', 'tonics', False),
    'asthma-forte': ('p32_X253.jpg', 'tonics', False),
    'alfalfa-sugar-free': ('p32_X254.jpg', 'tonics', False),
    'super-alfalfa': ('p32_X255.jpg', 'tonics', False),
    
    # Ointments (Pages 33-36)
    'ointment-arnica': ('p33_X262.jpg', 'ointments', False),
    'ointment-calendula': ('p33_X261.jpg', 'ointments', False),
    'ointment-echinacea': ('p33_X260.jpg', 'ointments', False),
    'ointment-sulphur': ('p33_X263.jpg', 'ointments', False),
    'ointment-graphitis': ('p34_X268.jpg', 'ointments', False),
    'ointment-mover': ('p34_X269.jpg', 'ointments', False),
    'ointment-pilex': ('p34_X270.jpg', 'ointments', False),
    'ointment-ringo': ('p34_X271.jpg', 'ointments', False),
    'ointment-hydrastis': ('p35_X276.jpg', 'ointments', False),
    'ointment-rhus-tox': ('p35_X277.jpg', 'ointments', False),
    'ointment-aesculus': ('p35_X278.jpg', 'ointments', False),
    'ointment-hamamelis': ('p35_X279.jpg', 'ointments', False),
    'ointment-pimplex': ('p36_X284.jpg', 'ointments', False),
    'ointment-protex': ('p36_X285.jpg', 'ointments', False),
    'ointment-thuja': ('p36_X286.jpg', 'ointments', False),
    
    # Tablets (Pages 38-41)
    'tab-rheumacur-plus': ('p38_X301.jpg', 'tablets', True),
    'tab-p22-spon-pain': ('p38_X300.jpg', 'tablets', True),
    'tab-extra-power-plus': ('p38_X302.jpg', 'tablets', True),
    'tab-p5-appetizer': ('p39_X307.jpg', 'tablets', True),
    'tab-p19-pain': ('p39_X308.jpg', 'tablets', True),
    'tab-p14-stone': ('p40_X315.jpg', 'tablets', True),
    'tab-fungon': ('p40_X317.jpg', 'tablets', True),
    'tab-calcilow': ('p40_X318.jpg', 'tablets', True),
    'tab-acidulok': ('p41_X324.jpg', 'tablets', True),
    
    # Veterinary (Pages 42-44)
    'calcimolt-vet': ('p42_X329.jpg', 'veterinary', False),
    'milko-vet': ('p42_X330.jpg', 'veterinary', False),
    'calcilo-vet': ('p42_X331.jpg', 'veterinary', False),
    'worm-vet': ('p43_X336.jpg', 'veterinary', False),
    'feveo-vet': ('p43_X337.jpg', 'veterinary', False),
    'entaro-vet': ('p43_X338.jpg', 'veterinary', False),
    'oro-pedal-vet': ('p44_X347.jpg', 'veterinary', False),
    'puro-mastitis-vet': ('p44_X348.jpg', 'veterinary', False),
}

def rebuild_all():
    print(f'Starting rebuild of {len(BROCHURE_MAPPING)} brochure products...')
    count = 0
    for prod_name, (raw_file, theme, is_card) in BROCHURE_MAPPING.items():
        raw_path = os.path.join(RAW_DIR, raw_file)
        if not os.path.exists(raw_path):
            print(f'Warning: {raw_path} not found!')
            continue
            
        im = Image.open(raw_path)
        if is_card:
            crop = im.convert('RGB')
            mask = None
        else:
            crop, mask = extract_clean_packshot(im)
            
        res = compose_packshot(crop, mask, theme, is_card=is_card)
        dst_webp = os.path.join(OUT_DIR, f'{prod_name}.webp')
        dst_jpg = os.path.join(OUT_DIR, f'{prod_name}.jpg')
        res.save(dst_webp, 'WEBP', quality=94)
        res.save(dst_jpg, 'JPEG', quality=94)
        count += 1
        print(f'[{count}/{len(BROCHURE_MAPPING)}] Rebuilt {prod_name} ({theme})')

    print(f'\nRebuild complete! {count} products rebuilt with pristine brochure graphics.')

if __name__ == '__main__':
    rebuild_all()
