from playwright.sync_api import sync_playwright

URL = "http://localhost:5173/catalogo/produto/implante/IMP-IH-6687-001?conexao=e475a172-b6a7-47f1-b855-2ffd88128eae&familia=88461f97-7583-4a12-b9d8-0c004ba7d2b7&linha=d15f32d3-bbd2-4eee-ac0b-4b8d9de8022f&empresa=6687e2f0-1ff6-406d-b621-7927764f121a"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    page.goto(URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)

    # Screenshot da ficha tecnica principal
    page.screenshot(path="/tmp/ficha_tecnica.png", full_page=True)
    print("Screenshot 1: ficha_tecnica.png")

    # Clicar na tab Chaves
    chaves_btn = page.locator("button", has_text="Chaves").first
    if chaves_btn.is_visible():
        chaves_btn.click()
        page.wait_for_timeout(1500)
        page.screenshot(path="/tmp/tab_chaves.png", full_page=True)
        print("Screenshot 2: tab_chaves.png")
    else:
        print("Tab Chaves nao encontrada")

    # Clicar na tab Kits
    kits_btn = page.locator("button", has_text="Kits").first
    if kits_btn.is_visible():
        kits_btn.click()
        page.wait_for_timeout(1500)
        page.screenshot(path="/tmp/tab_kits.png", full_page=True)
        print("Screenshot 3: tab_kits.png")
    else:
        print("Tab Kits nao encontrada")

    # Clicar na tab Cicatrizadores
    cic_btn = page.locator("button", has_text="Cicatriz").first
    if cic_btn.is_visible():
        cic_btn.click()
        page.wait_for_timeout(1500)
        page.screenshot(path="/tmp/tab_cicatrizadores.png", full_page=True)
        print("Screenshot 4: tab_cicatrizadores.png")
    else:
        print("Tab Cicatrizadores nao encontrada")

    # Clicar na tab Abutments
    ab_btn = page.locator("button", has_text="Abutments").first
    if ab_btn.is_visible():
        ab_btn.click()
        page.wait_for_timeout(1500)
        page.screenshot(path="/tmp/tab_abutments.png", full_page=True)
        print("Screenshot 5: tab_abutments.png")
    else:
        print("Tab Abutments nao encontrada")

    # Verificar conteudo das tabs
    content = page.content()
    for tab_name in ["Chaves", "Kits", "Cicatrizadores", "Abutments"]:
        if tab_name.lower() in content.lower():
            print(f"  [OK] Tab '{tab_name}' encontrada no DOM")
        else:
            print(f"  [!] Tab '{tab_name}' NAO encontrada no DOM")

    browser.close()
    print("Concluido!")
