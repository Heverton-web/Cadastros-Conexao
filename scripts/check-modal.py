from playwright.sync_api import sync_playwright

ACCESS_TOKEN = "eyJhbGciOiJFUzI1NiIsImtpZCI6IjA1ZjhmNjZkLTRhYzItNDA2Ny1hMGQ5LTdhYjVkZGZjNThkZCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2NsdXVxemhpemVxdmtndmZkaXN4LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI1MzNmNDFhZC04MjQxLTQ1OTAtYmYyMS01OTk5ZWExZDMyNjciLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzg0NDEyNTk3LCJpYXQiOjE3ODQ0MDg5OTcsImVtYWlsIjoiaGV2ZXJ0b25lZHVhcmRvcGVyZXNAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJub21lIjoiSGV2ZXJ0b24gUGVyZXMifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc4NDQwODk5N31dLCJzZXNzaW9uX2lkIjoiMzdkMThmY2MtZjc5Ny00NGYyLWE3ZGUtNjAwYWNkOTRmN2Q3IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.fACEaLcJXkm3761BtyT9ZDOvuym8Kz5jWTApPl0AmVGsXiFPIIXvhJyhV5RmzF_PxaqPAvp35Wocy1zY_dt4-A"
REFRESH_TOKEN = "7uimtfll3mee"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    
    # Go to the app first
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)
    
    # Inject auth tokens into localStorage with correct key format
    page.evaluate(f"""() => {{
        const key = 'sb-cluuqzhizeqvkgvfdisx.supabase.co';
        localStorage.setItem(key + '/auth-token', JSON.stringify({{
            current_session: {{
                access_token: '{ACCESS_TOKEN}',
                refresh_token: '{REFRESH_TOKEN}',
                expires_at: 1784412597,
                expires_in: 3600,
                token_type: 'bearer',
            }},
            user: {{
                id: '533f41ad-8241-4590-bf21-5999ea1d3267',
                email: 'hevertoneduardoperes@gmail.com',
                role: 'authenticated',
                app_metadata: {{}},
                user_metadata: {{ nome: 'Heverton Peres' }},
            }}
        }}));
        // Also set the session key
        localStorage.setItem(key + '/auth-token', JSON.stringify({{
            access_token: '{ACCESS_TOKEN}',
            refresh_token: '{REFRESH_TOKEN}',
            expires_at: 1784412597,
            expires_in: 3600,
            token_type: 'bearer',
        }}));
    }}""")
    
    # Reload
    page.goto('http://localhost:5173')
    page.wait_for_timeout(8000)
    page.wait_for_load_state('networkidle')
    
    print(f"URL: {page.url}")
    
    # Check localStorage
    keys = page.evaluate("() => Object.keys(localStorage)")
    print(f"localStorage keys: {keys}")
    
    page.screenshot(path='/tmp/after-token2.png', full_page=True)
    
    # Navigate to admin
    page.goto('http://localhost:5173/catalogo/admin/implantes')
    page.wait_for_timeout(5000)
    print(f"URL after nav: {page.url}")
    page.screenshot(path='/tmp/admin-page2.png', full_page=True)
    
    browser.close()
