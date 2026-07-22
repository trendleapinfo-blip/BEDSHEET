import os
import shutil
from PIL import Image

new_logo_path = "public/file_00000000d6c0820689755b791dcde5e3 (1).png"

if os.path.exists(new_logo_path):
    print(f"Found new logo file: {new_logo_path}")
    img = Image.open(new_logo_path)
    print(f"Size: {img.size}, Mode: {img.mode}")
    
    # Save directly as logo.png
    shutil.copy(new_logo_path, "public/logo.png")
    
    # Convert RGBA to RGB with dark #032026 background for JPEG version if needed
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        bg = Image.new("RGB", img.size, (3, 32, 38)) # #032026
        img_rgba = img.convert("RGBA")
        bg.paste(img_rgba, (0, 0), img_rgba)
        bg.save("public/logo.jpg", "JPEG", quality=95)
        bg.save("public/7813cb36-0c7c-4471-a56f-6a494050bd6a.jpg", "JPEG", quality=95)
    else:
        rgb_img = img.convert("RGB")
        rgb_img.save("public/logo.jpg", "JPEG", quality=95)
        rgb_img.save("public/7813cb36-0c7c-4471-a56f-6a494050bd6a.jpg", "JPEG", quality=95)
        
    print("New logo processed and copied to logo.png and logo.jpg successfully!")
else:
    print(f"Error: {new_logo_path} not found.")
