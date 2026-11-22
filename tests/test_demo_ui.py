"""Browser interactions for the compact scenario switcher and session recovery."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from test_e2e import mount

ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=b.new_page(viewport={'width':1400,'height':950})
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    mount(page)
    page.locator('input[name="case.employee"]').fill('Zapisana sesja użytkownika')
    page.locator('button[data-action="toggle-demo-menu"]').click()
    assert page.locator('.demo-menu-item').count()==5
    page.screenshot(path=str(ROOT/'examples/demo-menu.png'),full_page=True)
    # Cancel means nothing changes and no backup is created.
    page.once('dialog',lambda d:d.dismiss())
    page.locator('button[data-action="start-demo"][data-id="first-positive"]').click()
    assert page.evaluate('window.KOMPAS_DEBUG.getState().case.employee')=='Zapisana sesja użytkownika'
    page.locator('button[data-action="start-demo"][data-id="first-positive"]').click()
    # Default Playwright dialog handler auto-dismisses; set explicit accept for subsequent dialogs.
    assert page.evaluate('window.KOMPAS_DEBUG.getDemo()') is None
    page.once('dialog',lambda d:d.accept())
    page.locator('button[data-action="start-demo"][data-id="first-positive"]').click()
    assert page.locator('.demo-active-banner').count()==1
    assert page.evaluate('window.KOMPAS_FIRST_RULES.evaluate(window.KOMPAS_DEBUG.getState().firstFormal).result')=='pozytywna'
    page.screenshot(path=str(ROOT/'examples/demo-positive.png'),full_page=True)
    page.locator('button[data-action="toggle-demo-menu"]').click()
    page.once('dialog',lambda d:d.accept())
    page.locator('button[data-action="start-demo"][data-id="first-negative"]').click()
    assert page.evaluate('window.KOMPAS_FIRST_RULES.evaluate(window.KOMPAS_DEBUG.getState().firstFormal).result')=='negatywna'
    page.locator('button[data-action="go-step"][data-step="3"]').click()
    assert page.locator('h1').first.inner_text()=='Oceny cząstkowe i wynik pierwszej oceny'
    page.get_by_role('button',name='Dalej →').click()
    assert 'uzasadn' in page.locator('.notice').inner_text().lower()
    page.locator('textarea[name="firstFormal.negativeReason"]').fill('Dwie oceny poniżej oczekiwań, opisane w dokumentacji.')
    page.get_by_role('button',name='Dalej →').click()
    assert page.locator('h1').first.inner_text()=='Rozmowa i plan rozwoju'
    page.locator('button[data-action="end-demo"]').first.click() # auto-dismiss
    assert page.evaluate('window.KOMPAS_DEBUG.getDemo().id')=='first-negative'
    page.once('dialog',lambda d:d.accept())
    page.locator('button[data-action="end-demo"]').first.click()
    assert page.locator('.demo-active-banner').count()==0
    assert page.locator('input[name="case.employee"]').input_value()=='Zapisana sesja użytkownika'
    page.locator('button[data-action="toggle-demo-menu"]').click()
    page.once('dialog',lambda d:d.accept())
    page.locator('button[data-action="start-demo"][data-id="missing-fields"]').click()
    page.get_by_role('button',name='Dalej →').click()
    assert 'Uzupełnij pracownika' in page.locator('.notice').inner_text()
    page.locator('button[data-action="toggle-demo-menu"]').click()
    page.once('dialog',lambda d:d.accept())
    page.locator('button[data-action="start-demo"][data-id="assistant-sources"]').click()
    assert 'Pytania do sprawdzenia' in page.locator('.demo-active-banner').inner_text()
    assert page.evaluate('window.KOMPAS_DEBUG.getState().assistant.mode')=='offline'
    page.locator('button[data-action="ask-preset"]').first.click()
    assert page.locator('.chat-bot').count()==1
    page.once('dialog',lambda d:d.accept())
    page.locator('button[data-action="end-demo"]').first.click()
    assert page.locator('input[name="case.employee"]').input_value()=='Zapisana sesja użytkownika'
    assert not errors, errors
    page.close()
    # The dropdown must fit on a narrow desktop width as well.
    narrow=b.new_page(viewport={'width':768,'height':900})
    mount(narrow)
    narrow.locator('button[data-action="toggle-demo-menu"]').click()
    dimensions=narrow.evaluate('({menu:document.querySelector(".demo-menu").getBoundingClientRect().toJSON(),scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})')
    assert dimensions['scroll']<=dimensions['client']+3,dimensions
    assert dimensions['menu']['left']>=0 and dimensions['menu']['right']<=768,dimensions
    narrow.close();b.close()
    print('PASS: menu, cancel, five scenarios, genuine result, mandatory validation, backup/restore, AI fixture, narrow viewport')
