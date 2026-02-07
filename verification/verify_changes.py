from playwright.sync_api import sync_playwright

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Test 1: Load test-main.html
        print("Testing test-main.html...")
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page Error: {err}"))

        try:
            response = page.goto("http://localhost:8000/test-main.html")
            if not response.ok:
                print(f"Failed to load test-main.html: {response.status}")

            page.wait_for_load_state("networkidle")
            page.screenshot(path="verification/test-main.png")
            print("test-main.html loaded successfully. Screenshot saved.")

        except Exception as e:
            print(f"Error testing test-main.html: {e}")

        # Test 2: Load Chapter 1
        print("Testing Chapter 1...")
        try:
            response = page.goto("http://localhost:8000/chapters/01-introduction/index.html")
            if not response.ok:
                 print(f"Failed to load Chapter 1: {response.status}")

            page.wait_for_load_state("networkidle")

            # Check if map is initialized (it has leaflet classes)
            map_element = page.locator("#regions-map")
            if map_element.count() > 0:
                print("Map element found.")
                # Ideally check for leaflet initialization, e.g. class 'leaflet-container'
                if "leaflet-container" in map_element.get_attribute("class"):
                    print("Map initialized successfully (Leaflet container class present).")
                else:
                    print("Map element found but might not be initialized.")
            else:
                print("Map element NOT found.")

            page.screenshot(path="verification/chapter-1.png")
            print("Chapter 1 loaded successfully. Screenshot saved.")

        except Exception as e:
             print(f"Error testing Chapter 1: {e}")

        browser.close()

if __name__ == "__main__":
    run_verification()
