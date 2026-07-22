import os
import shutil
from PIL import Image, ImageDraw

# Try multiple candidate paths for original image
candidates = [
    "public/image.png",
    "public/logo.jpg",
    "public/7813cb36-0c7c-4471-a56f-6a494050bd6a.jpg"
]

src_path = None
for cand in candidates:
    if os.path.exists(cand) and os.path.getsize(cand) > 1000:
        try:
            with Image.open(cand) as test_img:
                test_img.verify()
            src_path = cand
            break
        except Exception:
            continue

if not src_path:
    print("Error: No valid source logo image found.")
    exit(1)

print(f"Using valid source image: {src_path}")
img = Image.open(src_path).convert("RGBA")
w, h = img.size
print(f"Original size: {w}x{h}")

# The logo is a dark circle (#032026 or similar dark color) on a lighter canvas.
pixels = img.load()
min_x, min_y = w, h
max_x, max_y = 0, 0

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3
        if brightness < 120:
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y

print(f"Detected circle bounding box: min_x={min_x}, min_y={min_y}, max_x={max_x}, max_y={max_y}")

if max_x > min_x and max_y > min_y:
    # Center crop square on logo circle
    center_x = (min_x + max_x) // 2
    center_y = (min_y + max_y) // 2
    radius = max(max_x - min_x, max_y - min_y) // 2
    
    box = (
        max(0, center_x - radius),
        max(0, center_y - radius),
        min(w, center_x + radius),
        min(h, center_y + radius)
    )
    cropped = img.crop(box)
    
    cw, ch = cropped.size
    mask = Image.new("L", (cw, ch), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, cw, ch), fill=255)
    
    # Save transparent PNG version
    transparent_logo = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    transparent_logo.paste(cropped, (0, 0), mask=mask)
    transparent_logo.save("public/logo.png", "PNG")
    
    # Save RGB JPEG versions with dark background fill (#032026)
    jpeg_logo = Image.new("RGB", (cw, ch), (3, 32, 38))
    jpeg_logo.paste(transparent_logo, (0, 0), mask=mask)
    
    jpeg_logo.save("public/logo.jpg", "JPEG", quality=95)
    jpeg_logo.save("public/7813cb36-0c7c-4471-a56f-6a494050bd6a.jpg", "JPEG", quality=95)
    print("SUCCESS: Logo cropped and saved cleanly to logo.png, logo.jpg, and 7813cb36-0c7c-4471-a56f-6a494050bd6a.jpg")
