"""Focused UX smoke test: progressive disclosure, contextual warnings, no domain regression."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from test_e2e import mount

ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for width in (1600, 1280, 900, 768):
        page=browser.new_page(viewport={'width':width,'height':900})
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        mount(page)
        assert page.locator('.breadcrumb').count()==0, 'Redundant breadcrumbs still visible'
        assert page.locator('.info-banner').count()==0, 'Old full-size banner still visible'
        assert page.locator('.prototype-note').count()==1
        assert page.locator('.prototype-extra').is_hidden()
        trigger=page.locator('.header-assistant-toggle')
        assert trigger.is_visible()
        assert trigger.get_attribute('aria-expanded')=='false'
        assert page.locator('.assistant').count()==0
        before=page.locator('.main-area').evaluate('(el)=>el.getBoundingClientRect().width')
        if width==1600:
            page.screenshot(path=str(ROOT/'examples/ux-focused-closed.png'),full_page=False)
        page.locator('.prototype-more-button').click()
        assert page.locator('.prototype-extra').is_visible()
        assert 'Dz.U. 2015' in page.locator('.prototype-extra').inner_text() or 'demonstracyjna' in page.locator('.prototype-extra').inner_text()
        page.locator('.prototype-more-button').click()
        assert page.locator('.prototype-extra').is_hidden()
        page.locator('button[data-action="choose-track"][data-id="periodic"]').click()
        assert 'Ocena okresowa' in page.locator('.prototype-note').inner_text()
        page.locator('.prototype-more-button').click()
        assert 'Dz.U. 2016' in page.locator('.prototype-extra').inner_text()
        page.locator('.prototype-more-button').click()
        trigger.click()
        assert page.locator('.assistant').is_visible()
        assert trigger.get_attribute('aria-expanded')=='true'
        openwidth=page.locator('.main-area').evaluate('(el)=>el.getBoundingClientRect().width')
        if width>1110:
            assert before-openwidth >=250,(width,before,openwidth)
        else:
            assert abs(before-openwidth)<2,(width,before,openwidth)
            assert page.locator('.assistant-backdrop').is_visible()
        if width==1600:
            page.screenshot(path=str(ROOT/'examples/ux-focused-open.png'),full_page=False)
        page.locator('#assistant-question').fill('Czy ocena ma termin?')
        page.locator('.assistant-close').click()
        assert page.locator('.assistant').count()==0
        trigger.click()
        assert page.locator('#assistant-question').input_value()=='Czy ocena ma termin?', 'Draft disappeared on toggle'
        page.keyboard.press('Escape')
        assert page.locator('.assistant').count()==0
        assert page.locator('.header-assistant-toggle').evaluate('(el)=>document.activeElement===el')
        page.locator('button[data-action="toggle-demo-menu"]').click()
        assert page.locator('.demo-menu-item').count()==5
        page.once('dialog',lambda d:d.accept())
        page.locator('button[data-action="start-demo"][data-id="assistant-sources"]').click()
        assert page.locator('.assistant').is_visible(), 'Assistant scenario should automatically reveal assistant'
        assert page.locator('button[data-action="ask-preset"]').count()>=3
        assert not errors,errors
        page.close()
    browser.close()
print('PASS: focused UX across 1600/1280/900/768, progressive disclosure, period notice, assistant toggle, escape, preserved draft, demo assistant')
