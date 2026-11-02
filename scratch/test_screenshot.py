import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

def main():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1200,1000')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    try:
        print("Navigating to http://localhost:8000 ...")
        driver.get("http://localhost:8000")
        time.sleep(3)
        print("Taking screenshot of initial screen...")
        driver.save_screenshot("scratch/initial_screen.png")
        print("Done!")
    except Exception as e:
        print("Error:", e)
    finally:
        driver.quit()

if __name__ == '__main__':
    main()
