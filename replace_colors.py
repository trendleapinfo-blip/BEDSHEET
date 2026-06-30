import os

target_file = r"i:\New folder (3)\closerush_new\app\value-visualizer\page.js"

if not os.path.exists(target_file):
    print("File not found")
    exit(1)

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# Replace colors
replacements = {
    "#14B8A6": "#245c77",
    "#14b8a6": "#245c77",
    "#0d9488": "#1d4a60",
    "#0D9488": "#1d4a60"
}

modified_content = content
for old, new in replacements.items():
    modified_content = modified_content.replace(old, new)

if modified_content != content:
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(modified_content)
    print("SUCCESS: Colors replaced in page.js")
else:
    print("No changes made (no matching colors found)")
