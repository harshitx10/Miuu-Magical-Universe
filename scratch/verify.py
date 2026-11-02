import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
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
        
        # Wait 5 seconds for full load and animations
        time.sleep(5)
        
        # Screenshot 1: Static Landing Page
        driver.save_screenshot('verification_static.png')
        print("Verification: Saved static screenshot to verification_static.png")
        
        # Find password-card element
        card = driver.find_element("class name", "password-card")
        actions = ActionChains(driver)
        
        # Move to the center of the password card
        print("Moving mouse to password card center...")
        actions.move_to_element(card).perform()
        time.sleep(0.2)
        
        # Move in a line to produce trail (total offset: 150px right, 50px up)
        print("Drawing cursor trail...")
        for _ in range(10):
            actions.move_by_offset(15, -5).perform()
            time.sleep(0.03) # 30ms sleep for fluid trail rendering
            
        # Screenshot 2: Active cursor trail
        driver.save_screenshot('verification_trail.png')
        print("Verification: Saved trail screenshot to verification_trail.png")
        
    except Exception as e:
        print(f"Error during verification: {e}")
    finally:
        driver.quit()

if __name__ == '__main__':
    main()
