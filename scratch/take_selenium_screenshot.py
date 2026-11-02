import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

screenshot_dir = r"C:\Users\Hp\.gemini\antigravity\brain\0bb8c942-531d-4f5d-9cc0-26a05d07555b"
screenshot_path = os.path.join(screenshot_dir, "video_section_element.png")

if os.path.exists(screenshot_path):
    try:
        os.remove(screenshot_path)
    except Exception as e:
        print(f"Error removing old screenshot: {e}")

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1280,1000')

driver = webdriver.Chrome(options=options)
try:
    url = "http://localhost:8000/?dev=1"
    print(f"Navigating to {url}")
    driver.get(url)
    
    # Wait for the main-world element to mount
    print("Waiting for main-world container to mount...")
    wait = WebDriverWait(driver, 10)
    main_world = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "main-world")))
    
    # Remove dev-mode class so other sections are visible
    print("Removing dev-mode class to reveal all sections...")
    driver.execute_script("document.querySelector('.main-world').classList.remove('dev-mode');")
    
    # Wait for the videos section to be present
    print("Locating videos section...")
    videos_sec = wait.until(EC.presence_of_element_located((By.ID, "videos")))
    
    # Scroll videos section into view
    print("Scrolling videos section into view...")
    driver.execute_script("arguments[0].scrollIntoView(true);", videos_sec)
    
    # Wait a bit for layout to settle and content to render
    time.sleep(3)
    
    # Capture screenshot of the element specifically
    print(f"Capturing screenshot of videos section -> {screenshot_path}")
    videos_sec.screenshot(screenshot_path)
    
    if os.path.exists(screenshot_path):
        print(f"Screenshot successfully captured! Size: {os.path.getsize(screenshot_path)} bytes")
    else:
        print("Screenshot file was not created.")

finally:
    driver.quit()
