import os
from playwright.sync_api import sync_playwright

def verify_schengen_map():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get absolute path to the file
        cwd = os.getcwd()
        file_path = f"file://{cwd}/chapters/02-europe/index.html"

        print(f"Navigating to {file_path}")
        page.goto(file_path)

        # Wait for the map image to be visible
        # We look for the image with src ending in schengen_area.svg
        image_locator = page.locator('img[src*="schengen_area.svg"]')
        image_locator.scroll_into_view_if_needed()

        # Wait a bit for layout to settle (e.g. if lazy loading or styles)
        page.wait_for_timeout(1000)

        if image_locator.is_visible():
            print("Schengen map image is visible.")
        else:
            print("Error: Schengen map image is NOT visible.")

        # Take a screenshot of the section containing the map
        # We can try to find the figure element containing it
        figure_locator = page.locator('figure').filter(has=image_locator)

        if figure_locator.count() > 0:
            print("Found figure element.")
            figure_locator.screenshot(path="verification/schengen_map_figure.png")
        else:
            print("Could not isolate figure, taking full viewport screenshot.")
            page.screenshot(path="verification/schengen_map_viewport.png")

        browser.close()

if __name__ == "__main__":
    verify_schengen_map()
