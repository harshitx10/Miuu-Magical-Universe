import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def main():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--window-size=1200,800')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    print("Initializing webdriver...")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    artifact_dir = r"C:\Users\Hp\.gemini\antigravity\brain\483107fe-56ea-4aa4-b248-baa6e4e12b56"
    
    try:
        # 1. Landing page screenshot
        url_landing = 'http://localhost:8000'
        print(f"Navigating to {url_landing}...")
        driver.get(url_landing)
        time.sleep(5)
        
        landing_path = os.path.join(artifact_dir, "landing_screen.png")
        driver.save_screenshot(landing_path)
        print(f"Saved landing screen screenshot to {landing_path}")
        
        # 2. Main page screenshot
        url_main = 'http://localhost:8000/?dev=1'
        print(f"Navigating to {url_main}...")
        driver.get(url_main)
        time.sleep(5)
        
        main_path = os.path.join(artifact_dir, "main_website.png")
        driver.save_screenshot(main_path)
        print(f"Saved main website screenshot to {main_path}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        driver.quit()

if __name__ == '__main__':
    main()
