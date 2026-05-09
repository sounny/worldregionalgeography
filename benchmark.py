from playwright.sync_api import sync_playwright
import os

def run_benchmark():
    html_path = f"file://{os.path.abspath('benchmark.html')}"
    num_markers = 1000
    iterations = 10

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(html_path)

        # Wait for map to be ready
        page.wait_for_selector('.leaflet-container')

        # Run individual addTo benchmark
        individual_times = []
        for _ in range(iterations):
            time_taken = page.evaluate(f"window.runBenchmarkIndividual({num_markers})")
            individual_times.append(time_taken)

        avg_individual = sum(individual_times) / len(individual_times)

        # Run group addTo benchmark
        group_times = []
        for _ in range(iterations):
            time_taken = page.evaluate(f"window.runBenchmarkGroup({num_markers})")
            group_times.append(time_taken)

        avg_group = sum(group_times) / len(group_times)

        print(f"Benchmark Results (Average over {iterations} iterations with {num_markers} markers):")
        print(f"Individual .addTo(map): {avg_individual:.2f} ms")
        print(f"LayerGroup .addTo(map): {avg_group:.2f} ms")
        print(f"Improvement: {(avg_individual - avg_group) / avg_individual * 100:.2f}% faster")

        browser.close()

if __name__ == "__main__":
    run_benchmark()
