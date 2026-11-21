"""Visual regression smoke tests for the optional CSS override; requires Playwright/Chromium.

The execution sandbox disallows direct file:// browser navigation, so we mount exactly
those local HTML/CSS/JS bytes into an about:blank page (same approach as test_e2e.py).
"""
from pathlib import Path
import importlib.util
from playwright.sync_api import sync_playwright

TEST_DIR = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('kompas_e2e', TEST_DIR / 'test_e2e.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for width in (1600, 1280, 900, 768, 390):
        page = browser.new_page(viewport={'width': width, 'height': 900})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        module.mount(page)
        root_widths = page.evaluate('({scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth})')
        assert root_widths['scroll'] <= root_widths['viewport'] + 3, f'Horizontal page overflow at {width}px: {root_widths}'
        if width > 700:
            assert page.locator('h1').first.inner_text() == 'Rozpocznij ocenę'
            assert page.locator('body').evaluate('(e) => getComputedStyle(e).fontSize') == '16px'
            assert page.locator('.app-header').evaluate('(e) => getComputedStyle(e).backgroundColor') == 'rgb(20, 59, 94)'
            assert page.locator('.main-area').count() == 1
            assert page.locator('a.skip-link[href="#main-content"]').count() == 1
            assert page.locator('main#main-content').count() == 1
            if width == 1600:
                page.screenshot(path=str(TEST_DIR.parent / 'examples' / 'start-screen.png'), full_page=True)
                page.locator('button[data-action="load-demo"]').click()
                page.locator('button[data-action="go-step"][data-step="3"]').click()
                assert page.locator('h1').first.inner_text() == 'Rekomendacja i decyzja'
                page.screenshot(path=str(TEST_DIR.parent / 'examples' / 'result-screen.png'), full_page=True)
        else:
            assert page.locator('.phone-block').is_visible()
            assert not page.locator('#app').is_visible()
        page.emulate_media(media='print')
        assert page.locator('.skip-link').evaluate('(e) => getComputedStyle(e).display') == 'none'
        assert not errors, errors
        page.close()
    browser.close()
print('PASS: 1600/1280/900/768/390 px, styles, navigation, print visibility, no JS errors')
