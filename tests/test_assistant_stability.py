"""Verify 4 mode layouts, modal settings, chat clearing and preserved assessment data."""
from playwright.sync_api import sync_playwright
from test_e2e import mount
from pathlib import Path

BASE=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height in [(1600,900),(1280,850),(900,820),(768,760)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        page.on('dialog',lambda dialog:dialog.accept())
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        mount(page)
        page.locator('.header-assistant-toggle').click()
        assert page.locator('.assistant').is_visible()
        assert page.locator('#assistant-mode-select').is_visible()
        assert page.locator('.assistant-mode .mode-pill').count()==0
        bounds=[]
        for mode in ['offline','online','ollama','browser']:
            page.locator('#assistant-mode-select').select_option(mode)
            box=page.locator('#assistant-question').bounding_box()
            assert box and box['y']>120, (width,mode,box)
            bounds.append(round(box['y'],2))
            if mode in ('online','browser'):
                assert page.locator('.assistant-modal[role=dialog]').is_visible()
                page.locator('button[data-action="close-assistant-dialog"]').last.click()
            page.locator('.assistant-settings-button').click()
            assert page.locator('.assistant-modal').is_visible()
            page.keyboard.press('Escape')
            assert page.locator('.assistant-modal').count()==0
        assert max(bounds)-min(bounds)<2.5, (width,bounds)
        assert page.locator('#assistant-question').is_visible()
        page.locator('#assistant-mode-select').select_option('offline')
        page.locator('button[data-action="ask-preset"]').first.click()
        page.wait_for_function('document.querySelectorAll(".chat-bot").length>0')
        assert page.locator('.assistant-clear-button').is_enabled()
        original=page.evaluate('window.KOMPAS_DEBUG.getState()')
        assert original['assistant']['chat']
        page.locator('.assistant-clear-button').click()
        assert page.locator('.chat-bot').count()==0
        after=page.evaluate('window.KOMPAS_DEBUG.getState()')
        assert after['assistant']['chat']==[]
        assert after['case']==original['case']
        assert after['observations']==original['observations']
        assert after['firstFormal']==original['firstFormal']
        page.screenshot(path=str(BASE/'examples'/f'ai-v063-{width}.png'),full_page=False)
        assert not errors,(width,errors)
        page.close()
    browser.close()
print('PASS: four modes retain editor position, modal settings and safe clear at 4 sizes')
