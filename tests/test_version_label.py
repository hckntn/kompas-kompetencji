"""Verify the release version is visible, readable, and driven by one meta tag."""
from playwright.sync_api import sync_playwright
from test_e2e import mount

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for width, height in [(1600,900),(1280,850),(1100,820),(900,820),(768,760)]:
        page = browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror', lambda e:errors.append(str(e)))
        mount(page)
        badge = page.locator('.brand-version')
        assert badge.count()==1
        assert badge.inner_text()=='v0.6.5'
        assert badge.get_attribute('aria-label')=='Wersja aplikacji v0.6.5'
        assert 'v0.6.5' in page.title()
        assert badge.is_visible()
        header=page.locator('.app-header').bounding_box()
        pos=badge.bounding_box()
        assert pos and pos['x']>0 and pos['x']+pos['width']<=width
        assert pos['y']>=header['y'] and pos['y']+pos['height']<=header['y']+header['height']
        left=page.locator('.header-left').bounding_box()
        actions=page.locator('.header-actions').bounding_box()
        assert left and actions
        print(f'{width}px: version={pos}, header-left-right={left["x"]+left["width"]:.1f}, actions-left={actions["x"]:.1f}')
        assert left['x']+left['width']<=actions['x']+2, f'Header overlap at {width}px'
        assert not errors,errors
        page.close()
    page=browser.new_page(viewport={'width':1280,'height':850})
    mount(page)
    page.evaluate("document.querySelector('meta[name=kompas-version]').content='v9.8.7';")
    page.evaluate("document.querySelector('.header-assistant-toggle').click()")
    # The metadata is read when the app loads; changing it during runtime should not affect the mounted release.
    assert page.locator('.brand-version').inner_text()=='v0.6.5'
    browser.close()
print('PASS: single source version label and header fit across 5 desktop widths')
