import difflib

with open('style.css.bak', 'r', encoding='utf-8') as f1:
    lines1 = f1.readlines()

with open('style.css', 'r', encoding='utf-8') as f2:
    lines2 = f2.readlines()

diff = difflib.unified_diff(
    lines1, lines2, 
    fromfile='style.css.bak', tofile='style.css', 
    lineterm=''
)

with open('diff_style.txt', 'w', encoding='utf-8') as out:
    out.write('\n'.join(diff))
print("Diff written successfully to diff_style.txt")
