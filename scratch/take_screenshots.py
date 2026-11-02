import subprocess
import os
import time
import shutil

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
screenshot_dir = r"C:\Users\Hp\.gemini\antigravity\brain\ed917f0f-835c-4939-828d-a2dee567dddf"
user_data_dir = os.path.join(screenshot_dir, "temp-chrome-profile")

pages = {
    "story_of_us": 0,
    "dream_you_are_chasing": 1,
    "pure_joy": 2,
    "always_forever": 3
}

def make_safe(s):
    return "".join(c if ord(c) < 128 else f"\\u{ord(c):04x}" for c in s)

# Ensure clean user data dir to avoid old log contamination
if os.path.exists(user_data_dir):
    try:
        shutil.rmtree(user_data_dir)
    except Exception as e:
        print(f"Warning removing user data dir: {e}")

for name, page in pages.items():
    screenshot_path = os.path.join(screenshot_dir, f"{name}.png")
    if os.path.exists(screenshot_path):
        try:
            os.remove(screenshot_path)
        except Exception as e:
            print(f"Error removing {screenshot_path}: {e}")
            
    # Clear old debug log if it exists inside the user data dir
    debug_log_path = os.path.join(user_data_dir, "chrome_debug.log")
    if os.path.exists(debug_log_path):
        try:
            os.remove(debug_log_path)
        except Exception as e:
            pass

    url = f"http://localhost:8000/?dev=1&page={page}"
    args = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        f"--user-data-dir={user_data_dir}",
        f"--screenshot={screenshot_path}",
        "--window-size=1280,800",
        "--virtual-time-budget=5000",
        "--enable-logging",
        "--v=1",
        url
    ]
    print(f"\nTaking screenshot of page {page} ({name}) -> {screenshot_path}")
    result = subprocess.run(args, capture_output=True, text=True, errors="ignore")
    
    # Wait a moment for Chrome to flush logs to disk
    time.sleep(1.5)
    
    # Read the chrome_debug.log from user data dir
    debug_lines = []
    if os.path.exists(debug_log_path):
        try:
            with open(debug_log_path, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    if "DEBUG MEMORY BOOK" in line:
                        debug_lines.append(line.strip())
        except Exception as e:
            print(f"Error reading log file: {e}")
    else:
        # Check standard output streams
        combined = (result.stdout or "") + "\n" + (result.stderr or "")
        for line in combined.splitlines():
            if "DEBUG MEMORY BOOK" in line:
                debug_lines.append(line.strip())
                
    if debug_lines:
        print("Console logs detected:")
        for l in debug_lines:
            idx = l.find("DEBUG MEMORY BOOK")
            if idx != -1:
                print(f"  {make_safe(l[idx:])}")
            else:
                print(f"  {make_safe(l)}")
    else:
        print("No DEBUG MEMORY BOOK logs detected in chrome_debug.log or stdout/stderr.")
        
    if os.path.exists(screenshot_path):
        print(f"Successfully created {screenshot_path} (size: {os.path.getsize(screenshot_path)} bytes)")
    else:
        print(f"File did not exist: {screenshot_path}")
