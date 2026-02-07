from playwright.sync_api import sync_playwright
import os

def test_chapter1_map():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Open Chapter 1
        # Using absolute file path since we don't have a server running
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/chapters/01-introduction/index.html")

        # Wait for map to load (Leaflet adds leaflet-container class)
        page.wait_for_selector(".leaflet-container")

        # Scroll to map
        map_element = page.locator("#regions-map")
        map_element.scroll_into_view_if_needed()

        # Take screenshot of the map area
        page.screenshot(path="verification/chapter1_map.png")

        browser.close()

def test_author_panel():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Open Index
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/index.html")

        # Scroll to author section
        author_section = page.locator(".author-profile")
        author_section.scroll_into_view_if_needed()

        # Take screenshot
        page.screenshot(path="verification/author_panel_index.png")

        browser.close()

if __name__ == "__main__":
    try:
        test_chapter1_map()
        print("Chapter 1 map screenshot taken.")
        test_author_panel()
        print("Author panel screenshot taken.")
    except Exception as e:
        print(f"Error: {e}")
