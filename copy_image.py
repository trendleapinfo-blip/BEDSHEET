import shutil
import os

src = r"C:\Users\prasa\.gemini\antigravity-ide\brain\2067b4ba-f2c9-40dc-af8d-95398ab704d8\hero_bedding_1780921028900.png"
dst = r"i:\New folder (3)\closerush_new\public\hero_bedding.png"

try:
    shutil.copy(src, dst)
    print("SUCCESS")
except Exception as e:
    print("ERROR:", e)
