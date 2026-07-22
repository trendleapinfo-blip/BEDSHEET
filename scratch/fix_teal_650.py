import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace bg-teal-650 with bg-[#032026]
    content = content.replace('bg-teal-650', 'bg-[#032026]')
    # Replace text-teal-650 with text-teal-700
    content = content.replace('text-teal-650', 'text-teal-700')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Fixed {filepath}")

fix_file(r'i:\closerush_new\app\admin\page.js')
fix_file(r'i:\closerush_new\app\warehouse\page.js')
