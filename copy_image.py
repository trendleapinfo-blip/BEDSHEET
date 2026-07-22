import shutil
import os

src = r"i:\closerush_new\public\logo.jpg"
if not os.path.exists(src) or os.path.getsize(src) == 0:
    src = r"i:\closerush_new\public\image.png"

dst1 = r"i:\closerush_new\public\7813cb36-0c7c-4471-a56f-6a494050bd6a.jpg"

try:
    if os.path.exists(src):
        shutil.copy(src, dst1)
        print("LOGO COPY SUCCESS")
    else:
        print("Source logo file not found")
except Exception as e:
    print("ERROR:", e)
