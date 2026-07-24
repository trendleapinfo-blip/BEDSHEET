import shutil
import os

src = r"i:\closerush_new\public\logo.png"
if not os.path.exists(src) or os.path.getsize(src) == 0:
    src = r"i:\closerush_new\public\image.png"

dst1 = r"i:\closerush_new\public\icon-192x192.png"
dst2 = r"i:\closerush_new\public\icon-512x512.png"

try:
    if os.path.exists(src):
        shutil.copy(src, dst1)
        shutil.copy(src, dst2)
        print("LOGO COPY SUCCESS")
    else:
        print("Source logo file not found")
except Exception as e:
    print("ERROR:", e)
