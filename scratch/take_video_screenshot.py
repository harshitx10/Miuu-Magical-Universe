import subprocess
import os
import time
import shutil

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
screenshot_dir = r"C:\Users\Hp\.gemini\antigravity\brain\0bb8c942-531d-4f5d-9cc0-26a05d07555b"
user_data_dir = os.path.join(screenshot_dir, "temp-chrome-profile")

# Ensure clean user data dir
if os.path.exists(user_data_dir):
    try:
        shutil.rmtree(user_data_dir)
    except Exception as e:
        print(f"Warning removing user data dir: {e}")

screenshot_path = os.path.join(screenshot_dir, "video_section.png")
if os.path.exists(screenshot_path):
    try:
        os.remove(screenshot_path)
    except Exception as e:
        print(f"Error removing {screenshot_path}: {e}")

# We target http://localhost:8000/?dev=1#videos
# The #videos hash will scroll the video section into view
url = "http://localhost:8000/?dev=1#videos"
args = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    f"--user-data-dir={user_data_dir}",
    f"--screenshot={screenshot_path}",
    "--window-size=1280,7000",
    "--virtual-time-budget=6000",
    url
]

print(f"Taking screenshot of {url} -> {screenshot_path}")
result = subprocess.run(args, capture_output=True, text=True, errors="ignore")

# Wait a moment for Chrome to write the file
time.sleep(2.0)

if os.path.exists(screenshot_path):
    print(f"Successfully created screenshot: {screenshot_path}")
    print(f"File size: {os.path.getsize(screenshot_path)} bytes")
else:
    print("Screenshot failed to generate.")
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
