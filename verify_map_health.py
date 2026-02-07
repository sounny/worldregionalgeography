from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the index.html file
        file_path = f"file://{os.path.abspath('index.html')}"
        print(f"Loading {file_path}")
        page.goto(file_path)

        # Wait for the map to initialize (Leaflet adds classes to the container)
        # The container is #global-map
        print("Waiting for map initialization...")
        page.wait_for_selector('#global-map.leaflet-container', timeout=5000)

        # Verify markers are present
        # Leaflet markers are usually img.leaflet-marker-icon or paths (for circle markers)
        # Circle markers are SVG paths with class leaflet-interactive
        print("Checking for markers...")
        markers = page.locator('path.leaflet-interactive')
        count = markers.count()
        print(f"Found {count} markers")

        if count == 0:
            print("Error: No markers found!")
            # Take screenshot anyway to debug
            page.screenshot(path='verification_failure.png')
            browser.close()
            return

        # Click on a marker (e.g., the first one, likely Europe) to open popup
        print("Clicking a marker...")
        markers.first.click()

        # Wait for popup
        page.wait_for_selector('.leaflet-popup-content')
        popup_text = page.locator('.leaflet-popup-content').inner_text()
        print(f"Popup content: {popup_text}")

        # Take screenshot
        output_path = 'verification_map.png'
        page.screenshot(path=output_path)
        print(f"Screenshot saved to {output_path}")

        browser.close()

if __name__ == "__main__":
    run()
