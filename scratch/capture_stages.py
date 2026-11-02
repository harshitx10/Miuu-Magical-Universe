import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

def main():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1200,1200')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    try:
        # Disable browser cache
        driver.execute_cdp_cmd('Network.setCacheDisabled', {'cacheDisabled': True})
        
        os.makedirs("scratch", exist_ok=True)
        print("Navigating to http://localhost:8000/?dev ...")
        driver.get("http://localhost:8000/?dev")
        time.sleep(3)

        print("Scrolling to bottom of page...")
        # Remove dev-mode class so other sections are visible in dev mode
        driver.execute_script("document.querySelector('.main-world').classList.remove('dev-mode');")
        time.sleep(1)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)

        print("Clicking DEBUG button to open gates using JS click...")
        debug_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'DEBUG')]")
        driver.execute_script("arguments[0].click();", debug_btn)
        time.sleep(2)  # Wait for gate opening transition

        # Let's take a screenshot before clicking the gift box
        print("Taking screenshot 1: Before opening the gift...")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(0.5)
        driver.save_screenshot("scratch/1_before_opening.png")

        print("Clicking Open Miuu's Final Gift using JS click...")
        gift_box = driver.find_element(By.CLASS_NAME, "glowing-gift-box")
        driver.execute_script("arguments[0].click();", gift_box)

        # Wait a brief moment to capture while opening
        time.sleep(1.8)
        print("Taking screenshot 2: While opening...")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(0.5)
        driver.save_screenshot("scratch/2_while_opening.png")

        # Wait for type-writer animation and letter slide-out to finish
        time.sleep(42)  # The text is very long (around 700 chars). Wait 42 seconds to ensure it is fully typed, quote is visible, and close button is fully faded in
        print("Taking screenshot 3: Fully opened...")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(0.5)
        driver.save_screenshot("scratch/3_fully_opened.png")

        print("Done capturing all screenshots!")
    except Exception as e:
        print("Error during execution:", e)
    finally:
        driver.quit()

if __name__ == '__main__':
    main()
