from playwright.sync_api import sync_playwright

URL = "http://localhost:5173/catalogo/produto/implante/IMP-IH-6687-001?conexao=e475a172-b6a7-47f1-b855-2ffd88128eae&familia=88461f97-7583-4a12-b9d8-0c004ba7d2b7&linha=d15f32d3-bbd2-4eee-ac0b-4b8d9de8022f&empresa=6687e2f0-1ff6-406d-b621-7927764f121a"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})

    # Capturar console
    logs = []
    page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}"))

    # Capturar erros de rede
    errors = []
    page.on("requestfailed", lambda req: errors.append(f"FAILED: {req.url} - {req.failure}"))

    page.goto(URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(3000)

    # Verificar console
    print("=== CONSOLE ===")
    for log in logs:
        if "error" in log.lower() or "warn" in log.lower() or "catalogo" in log.lower() or "empresa" in log.lower():
            print(log)

    print("\n=== NETWORK ERRORS ===")
    for e in errors:
        print(e)

    # Verificar URL atual
    print(f"\n=== URL ===\n{page.url}")

    # Verificar se ha skeleton ou conteudo
    skeletons = page.locator(".animate-pulse").count()
    print(f"\n=== SKELETONS (loading) === {skeletons}")

    # Verificar se ha tabs
    all_buttons = page.locator("button").all()
    print(f"\n=== BUTTONS === {len(all_buttons)}")
    for btn in all_buttons[:20]:
        txt = btn.inner_text()
        if txt.strip():
            print(f"  - {txt.strip()[:50]}")

    # Verificar conteudo visivel
    body_text = page.locator("body").inner_text()
    print(f"\n=== BODY TEXT (first 500 chars) ===\n{body_text[:500]}")

    browser.close()
