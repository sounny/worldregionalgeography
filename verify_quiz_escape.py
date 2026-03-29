from playwright.sync_api import sync_playwright

def verify_escape_html():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # We just need to load the quiz-engine.js and test escapeHtml in the browser context
        page.set_content("""
        <!DOCTYPE html>
        <html>
        <head>
            <script src="file:///app/js/quiz-engine.js"></script>
        </head>
        <body>
            <div id="result"></div>
            <script>
                setTimeout(() => {
                    const str = '<script>alert("XSS & testing")\\\'</script>';
                    document.getElementById('result').textContent = window.QuizEngine.escapeHtml(str);
                }, 100);
            </script>
        </body>
        </html>
        """)

        page.wait_for_timeout(500)

        result = page.locator('#result').text_content()
        print(f"Escape result: {result}")

        page.screenshot(path="verification.png")
        browser.close()

if __name__ == "__main__":
    verify_escape_html()
