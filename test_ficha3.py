from playwright.sync_api import sync_playwright

URL = "http://localhost:5173/catalogo/produto/implante/IMP-IH-6687-001?conexao=e475a172-b6a7-47f1-b855-2ffd88128eae&familia=88461f97-7583-4a12-b9d8-0c004ba7d2b7&linha=d15f32d3-bbd2-4eee-ac0b-4b8d9de8022f&empresa=6687e2f0-1ff6-406d-b621-7927764f121a"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})

    # Capturar requisicoes Supabase
    requests_log = []
    def on_response(response):
        url = response.url
        if "supabase" in url or "rest" in url:
            status = response.status
            body = ""
            try:
                body = response.text()[:300]
            except:
                pass
            requests_log.append(f"[{status}] {url[:120]}\n  BODY: {body}")

    page.on("response", on_response)

    page.goto(URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(3000)

    print("=== SUPABASE REQUESTS ===")
    for r in requests_log:
        print(r)
        print()

    browser.close()
