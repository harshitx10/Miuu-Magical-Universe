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

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    try:
        url = 'http://localhost:8000'
        print(f"Navigating to {url}...")
        driver.get(url)
        # Wait 5 seconds for page load, animations, and fireflies/butterflies to spawn
        time.sleep(5)
        
        # Determine output filename
        filename = 'before.png'
        if os.path.exists('before.png'):
            filename = 'after.png'
            
        driver.save_screenshot(filename)
        print(f"Screenshot successfully saved to {filename}")
    except Exception as e:
        print(f"Error capturing screenshot: {e}")
    finally:
        driver.quit()

if __name__ == '__main__':
    main()
