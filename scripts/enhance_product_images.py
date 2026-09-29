import os
import io
import pypdf
from PIL import Image, ImageFilter, ImageDraw
import numpy as np

PRODUCTS_DIR = 'public/images/products'

def create_studio_background(canvas_w, canvas_h, theme):
    if theme == 'drops':
        top_color = np.array([244, 248, 246])
        bottom_color = np.array([210, 226, 220])
        halo_color = np.array([255, 255, 252])
    elif theme == 'tablets':
        top_color = np.array([247, 248, 246])
        bottom_color = np.array([218, 226, 222])
        halo_color = np.array([255, 255, 255])
    elif theme == 'ointments':
        top_color = np.array([250, 248, 244])
        bottom_color = np.array([228, 222, 212])
        halo_color = np.array([255, 255, 250])
    elif theme == 'veterinary':
        top_color = np.array([249, 248, 242])
        bottom_color = np.array([226, 220, 202])
        halo_color = np.array([255, 255, 250])
    elif theme == 'olive':
        top_color = np.array([248, 248, 242])
        bottom_color = np.array([220, 222, 196])
        halo_color = np.array([255, 255, 250])
    elif theme == 'protectin':
        top_color = np.array([244, 248, 246])
        bottom_color = np.array([212, 226, 220])
        halo_color = np.array([255, 255, 252])
    else: # botanical / tonics / mother tinctures
        top_color = np.array([246, 248, 244])
        bottom_color = np.array([216, 226, 216])
        halo_color = np.array([255, 255, 250])
        
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

def compose_on_background(prod_crop, prod_mask, theme, canvas_size=(600, 600), target_scale=0.82):
    canvas_w, canvas_h = canvas_size
    bg_img = create_studio_background(canvas_w, canvas_h, theme)
    
    # Calculate scaled dimensions
    max_h = int(canvas_h * target_scale)
    max_w = int(canvas_w * 0.78)
    
    scale = min(max_h / prod_crop.height, max_w / prod_crop.width)
    new_w = max(1, int(prod_crop.width * scale))
    new_h = max(1, int(prod_crop.height * scale))
    
    prod_resized = prod_crop.resize((new_w, new_h), Image.Resampling.LANCZOS)
    mask_resized = prod_mask.resize((new_w, new_h), Image.Resampling.BILINEAR)
    
    # Position
    pad_bottom = int(canvas_h * 0.07)
    pos_x = (canvas_w - new_w) // 2
    pos_y = canvas_h - pad_bottom - new_h
    
    # Create realistic shadow
    shadow_img = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_img)
    
    shadow_w = int(new_w * 0.92)
    shadow_h = max(12, int(new_h * 0.08))
    shadow_cx = canvas_w // 2
    shadow_cy = pos_y + new_h
    
    s_draw.ellipse([shadow_cx - shadow_w // 2, shadow_cy - shadow_h // 2, shadow_cx + shadow_w // 2, shadow_cy + shadow_h // 2], fill=(25, 35, 25, 115))
    s_draw.ellipse([shadow_cx - int(new_w*0.65) // 2, shadow_cy - int(new_h*0.04) // 2, shadow_cx + int(new_w*0.65) // 2, shadow_cy + int(new_h*0.04) // 2], fill=(15, 20, 15, 145))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(11.0))
    
    bg_rgba = bg_img.convert('RGBA')
    bg_rgba.alpha_composite(shadow_img)
    bg_rgba.paste(prod_resized, (pos_x, pos_y), mask_resized)
    
    return bg_rgba.convert('RGB')

def process_file(src_path, dst_path, theme, target_scale=0.82):
    try:
        orig = Image.open(src_path).convert('RGB')
        arr = np.array(orig)
        
        # sample corners
        corners = np.concatenate([
            arr[:12, :12].reshape(-1, 3),
            arr[:12, -12:].reshape(-1, 3),
            arr[-12:, :12].reshape(-1, 3),
            arr[-12:, -12:].reshape(-1, 3)
        ])
        bg_color = np.median(corners, axis=0)
        
        diff = np.linalg.norm(arr.astype(float) - bg_color, axis=-1)
        mask = (diff > 16).astype(np.uint8) * 255
        
        coords = np.argwhere(mask > 0)
        if len(coords) == 0:
            print('No product detected in', src_path)
            return False
            
        y0, x0 = coords.min(axis=0)
        y1, x1 = coords.max(axis=0)
        
        # Add 2px safety
        x0 = max(0, x0 - 2)
        y0 = max(0, y0 - 2)
        x1 = min(orig.width, x1 + 2)
        y1 = min(orig.height, y1 + 2)
        
        prod_crop = orig.crop((x0, y0, x1, y1))
        prod_mask = Image.fromarray(mask[y0:y1, x0:x1]).filter(ImageFilter.GaussianBlur(1.0))
        
        final_img = compose_on_background(prod_crop, prod_mask, theme, target_scale=target_scale)
        final_img.save(dst_path, 'WEBP', quality=92)
        return True
    except Exception as e:
        print(f'Error processing {src_path}: {e}')
        return False

print('Script ready.')
