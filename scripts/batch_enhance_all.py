import os
import glob
import re
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageFont
import scipy.ndimage as ndi

PRODUCTS_DIR = 'public/images/products'

THEMES = {
    'drops': {
        'top': np.array([244, 248, 246]),
        'bottom': np.array([210, 226, 220]),
        'halo': np.array([255, 255, 252]),
    },
    'tablets': {
        'top': np.array([247, 248, 246]),
        'bottom': np.array([218, 226, 222]),
        'halo': np.array([255, 255, 255]),
    },
    'ointments': {
        'top': np.array([250, 248, 244]),
        'bottom': np.array([228, 222, 212]),
        'halo': np.array([255, 255, 250]),
    },
    'veterinary': {
        'top': np.array([249, 248, 242]),
        'bottom': np.array([226, 220, 202]),
        'halo': np.array([255, 255, 250]),
    },
    'tonics': {
        'top': np.array([246, 248, 244]),
        'bottom': np.array([216, 226, 216]),
        'halo': np.array([255, 255, 250]),
    },
    'tinctures': {
        'top': np.array([248, 247, 242]),
        'bottom': np.array([222, 218, 202]),
        'halo': np.array([255, 255, 250]),
    },
    'protectin': {
        'top': np.array([244, 248, 246]),
        'bottom': np.array([212, 226, 220]),
        'halo': np.array([255, 255, 252]),
    },
    'olive': {
        'top': np.array([248, 248, 242]),
        'bottom': np.array([220, 222, 196]),
        'halo': np.array([255, 255, 250]),
    }
}

def determine_theme(filename):
    fn = filename.lower()
    if 'protectin' in fn:
        return 'protectin'
    if 'olive' in fn:
        return 'olive'
    if fn.startswith('drop-') or fn.startswith('power-plus'):
        return 'drops'
    if fn.startswith('tab-'):
        return 'tablets'
    if fn.startswith('ointment-'):
        return 'ointments'
    if '-vet' in fn or fn.startswith('vet-') or 'milko' in fn or 'calcilo' in fn or 'feveo' in fn or 'entaro' in fn or 'calcimolt' in fn:
        return 'veterinary'
    if fn.startswith('arnica-q') or fn.startswith('berberis-q') or '-q.' in fn:
        return 'tinctures'
    return 'tonics'

def create_studio_background(canvas_w, canvas_h, theme_name):
    th = THEMES.get(theme_name, THEMES['tonics'])
    top_color = th['top']
    bottom_color = th['bottom']
    halo_color = th['halo']
    
    bg = np.zeros((canvas_h, canvas_w, 3), dtype=float)
    for y in range(canvas_h):
        t = y / (canvas_h - 1)
        t_curve = t * t * (3 - 2 * t)
        bg[y, :] = (1 - t_curve) * top_color + t_curve * bottom_color

    cx, cy = canvas_w / 2.0, canvas_h * 0.45
    Y, X = np.ogrid[:canvas_h, :canvas_w]
    dist = np.sqrt(((X - cx) / (canvas_w * 0.45))**2 + ((Y - cy) / (canvas_h * 0.45))**2)
    halo_intensity = np.clip(1.0 - dist, 0.0, 1.0)**1.5
    for c in range(3):
        bg[:, :, c] = bg[:, :, c] * (1 - 0.5 * halo_intensity) + halo_color[c] * (0.5 * halo_intensity)

    return Image.fromarray(np.uint8(np.clip(bg, 0, 255)))

def extract_product_crop_and_mask(im):
    orig = im.convert('RGB')
    arr = np.array(orig)
    h, w, _ = arr.shape
    
    corners = np.concatenate([
        arr[:10, :10].reshape(-1, 3),
        arr[:10, -10:].reshape(-1, 3),
        arr[-10:, :10].reshape(-1, 3),
        arr[-10:, -10:].reshape(-1, 3)
    ])
    bg_color = np.median(corners, axis=0)
    
    diff = np.linalg.norm(arr.astype(float) - bg_color, axis=-1)
    raw_mask = (diff > 16)
    
    labeled, num_features = ndi.label(raw_mask)
    if num_features == 0:
        return None, None
        
    sizes = ndi.sum(raw_mask, labeled, range(1, num_features + 1))
    largest_label = np.argmax(sizes) + 1
    
    keep_mask = (labeled == largest_label)
    max_size = sizes[largest_label - 1]
    for idx, s in enumerate(sizes):
        if idx + 1 != largest_label and s > max_size * 0.06:
            sub_coords = np.argwhere(labeled == idx + 1)
            sub_y0, sub_x0 = sub_coords.min(axis=0)
            sub_y1, sub_x1 = sub_coords.max(axis=0)
            main_coords = np.argwhere(keep_mask)
            my0, mx0 = main_coords.min(axis=0)
            my1, mx1 = main_coords.max(axis=0)
            if abs(sub_y0 - my1) < 18 or abs(my0 - sub_y1) < 18 or (sub_y0 >= my0 and sub_y1 <= my1):
                keep_mask = keep_mask | (labeled == idx + 1)
                
    struct = np.ones((5, 5), dtype=bool)
    closed_mask = ndi.binary_closing(keep_mask, structure=struct)
    
    coords = np.argwhere(closed_mask)
    if len(coords) == 0:
        return None, None
        
    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0)
    
    # Trim faint pedestal reflections at bottom if any
    while y1 > y0 + 30:
        row_arr = arr[y1 - 1, x0:x1]
        row_diff = np.linalg.norm(row_arr.astype(float) - bg_color, axis=-1)
        row_non_bg = np.sum(row_diff > 25)
        if row_non_bg < 5 and np.mean(row_diff) < 22:
            y1 -= 1
        else:
            break
            
    x0 = max(0, x0 - 2)
    y0 = max(0, y0 - 2)
    x1 = min(w, x1 + 2)
    y1 = min(h, y1 + 2)
    
    crop = orig.crop((x0, y0, x1, y1))
    sub_mask = (closed_mask[y0:y1, x0:x1]).astype(np.uint8) * 255
    mask_img = Image.fromarray(sub_mask).filter(ImageFilter.GaussianBlur(1.0))
    
    return crop, mask_img

def compose_on_canvas(prod_crop, prod_mask, theme_name, canvas_size=(600, 600)):
    canvas_w, canvas_h = canvas_size
    bg_img = create_studio_background(canvas_w, canvas_h, theme_name)
    
    crop_w, crop_h = prod_crop.size
    aspect = crop_w / crop_h
    
    is_horizontal = (aspect > 1.2)
    
    if is_horizontal:
        target_w = int(canvas_w * 0.83)
        scale = target_w / crop_w
        new_w = target_w
        new_h = max(1, int(crop_h * scale))
        if new_h > int(canvas_h * 0.70):
            new_h = int(canvas_h * 0.70)
            new_w = int(crop_w * (new_h / crop_h))
            
        pos_x = (canvas_w - new_w) // 2
        pos_y = (canvas_h - new_h) // 2
    else:
        target_h = int(canvas_h * 0.84)
        scale = target_h / crop_h
        new_h = target_h
        new_w = max(1, int(crop_w * scale))
        if new_w > int(canvas_w * 0.78):
            new_w = int(canvas_w * 0.78)
            new_h = int(crop_h * (new_w / crop_w))
            
        pad_bottom = int(canvas_h * 0.065)
        pos_x = (canvas_w - new_w) // 2
        pos_y = canvas_h - pad_bottom - new_h
        
    prod_resized = prod_crop.resize((new_w, new_h), Image.Resampling.LANCZOS)
    mask_resized = prod_mask.resize((new_w, new_h), Image.Resampling.BILINEAR)
    
    shadow_img = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_img)
    
    shadow_w = int(new_w * 0.90)
    shadow_h = max(12, int(new_h * 0.08) if not is_horizontal else int(new_h * 0.22))
    shadow_cx = canvas_w // 2
    shadow_cy = pos_y + new_h
    
    s_draw.ellipse([shadow_cx - shadow_w // 2, shadow_cy - shadow_h // 2, shadow_cx + shadow_w // 2, shadow_cy + shadow_h // 2], fill=(20, 30, 20, 110))
    s_draw.ellipse([shadow_cx - int(new_w*0.62) // 2, shadow_cy - int(shadow_h*0.5) // 2, shadow_cx + int(new_w*0.62) // 2, shadow_cy + int(shadow_h*0.5) // 2], fill=(10, 18, 10, 140))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(10.0))
    
    bg_rgba = bg_img.convert('RGBA')
    bg_rgba.alpha_composite(shadow_img)
    bg_rgba.paste(prod_resized, (pos_x, pos_y), mask_resized)
    
    return bg_rgba.convert('RGB')

# Special high-resolution sources from the brochure:
SPECIAL_SOURCES = {
    'p-alfalfa': ('public/images/debug_p30_6_X238.jpg', 'tonics'),
    'power-plus-drops': ('public/images/debug_p30_4_X236.jpg', 'drops'),
    'protectin-hand-care': ('public/images/debug_p25_6_X199.jpg', 'protectin'),
    'puro-olive-oil': ('public/images/debug_p25_7_X200.jpg', 'olive'),
    'rheumacure-oil': ('public/images/debug_p25_8_X201.jpg', 'tonics'),
    'ointment-arnica': ('public/images/debug_oint_p33_X262.jpg', 'ointments'),
    'ointment-calendula': ('public/images/debug_oint_p33_X261.jpg', 'ointments'),
    'ointment-echinacea': ('public/images/debug_oint_p33_X260.jpg', 'ointments'),
    'ointment-sulphur': ('public/images/debug_oint_p33_X263.jpg', 'ointments'),
    'ointment-graphitis': ('public/images/debug_oint_p34_X268.jpg', 'ointments'),
    'ointment-mover': ('public/images/debug_oint_p34_X269.jpg', 'ointments'),
    'ointment-pilex': ('public/images/debug_oint_p34_X270.jpg', 'ointments'),
    'ointment-ringo': ('public/images/debug_oint_p34_X271.jpg', 'ointments'),
}

# Missing ointments to synthesize from authentic tube:
MISSING_OINTMENTS = {
    'ointment-apis-mel': 'Apis Mel',
    'ointment-berberis': 'Berberis Aqui.',
    'ointment-ledum': 'Ledum Pal',
    'ointment-petroleum': 'Petroleum',
    'ointment-tellurium': 'Tellurium',
    'ointment-urtica': 'Urtica Urens',
}

def generate_missing_ointment_packshots():
    # Base tube from arnica or calendula
    base_src = 'public/images/debug_oint_p33_X262.jpg'
    base_im = Image.open(base_src).convert('RGB')
    
    for filename, remedy_name in MISSING_OINTMENTS.items():
        tube = base_im.copy()
        draw = ImageDraw.Draw(tube)
        
        # Patch the label area with clean off-white
        # In X262 (149x66): Arnica label is roughly around x=65..120, y=28..52
        draw.rectangle([68, 28, 128, 48], fill=(248, 248, 248))
        
        # Draw clean crisp label text
        try:
            # Try default or small font
            font = ImageFont.load_default()
        except:
            font = None
            
        draw.text((70, 30), remedy_name, fill=(20, 25, 45), font=font)
        draw.text((70, 40), "OINTMENT", fill=(80, 80, 80), font=font)
        
        crop, mask = extract_product_crop_and_mask(tube)
        if crop is None:
            crop = tube
            mask = Image.new('L', tube.size, 255)
            
        final_img = compose_on_canvas(crop, mask, 'ointments')
        dst_webp = os.path.join(PRODUCTS_DIR, f'{filename}.webp')
        dst_jpg = os.path.join(PRODUCTS_DIR, f'{filename}.jpg')
        final_img.save(dst_webp, 'WEBP', quality=93)
        final_img.save(dst_jpg, 'JPEG', quality=93)
        print(f'Synthesized ointment packshot: {dst_webp}')

def run_batch_enhancement():
    generate_missing_ointment_packshots()
    
    # First process special sources
    for base_name, (src_file, theme) in SPECIAL_SOURCES.items():
        if os.path.exists(src_file):
            im = Image.open(src_file)
            crop, mask = extract_product_crop_and_mask(im)
            if crop is None:
                crop = im
                mask = Image.new('L', im.size, 255)
            final_img = compose_on_canvas(crop, mask, theme)
            dst_webp = os.path.join(PRODUCTS_DIR, f'{base_name}.webp')
            dst_jpg = os.path.join(PRODUCTS_DIR, f'{base_name}.jpg')
            final_img.save(dst_webp, 'WEBP', quality=93)
            final_img.save(dst_jpg, 'JPEG', quality=93)
            print(f'Enhanced special product: {base_name} ({theme})')

    # Now iterate all other products in public/images/products/
    all_webps = sorted(glob.glob(os.path.join(PRODUCTS_DIR, '*.webp')))
    print(f'\nTotal webp files in products directory: {len(all_webps)}')
    
    for webp_path in all_webps:
        base_name = os.path.splitext(os.path.basename(webp_path))[0]
        
        # Skip cosmetics (phbl-*) - they are already high-res 1024x1536 studio images
        if base_name.startswith('phbl-'):
            continue
            
        # Skip if already processed in special sources
        if base_name in SPECIAL_SOURCES or base_name in MISSING_OINTMENTS:
            continue
            
        theme = determine_theme(base_name)
        
        # Prefer original .jpg if available for uncompressed extraction
        jpg_path = os.path.join(PRODUCTS_DIR, f'{base_name}.jpg')
        src_path = jpg_path if os.path.exists(jpg_path) else webp_path
        
        try:
            im = Image.open(src_path)
            crop, mask = extract_product_crop_and_mask(im)
            if crop is None:
                print(f'Warning: Could not isolate product mask for {base_name}, skipping.')
                continue
                
            final_img = compose_on_canvas(crop, mask, theme)
            final_img.save(webp_path, 'WEBP', quality=93)
            if os.path.exists(jpg_path):
                final_img.save(jpg_path, 'JPEG', quality=93)
            print(f'Successfully enhanced: {base_name}.webp (theme: {theme})')
        except Exception as e:
            print(f'Error processing {base_name}: {e}')

if __name__ == '__main__':
    run_batch_enhancement()
