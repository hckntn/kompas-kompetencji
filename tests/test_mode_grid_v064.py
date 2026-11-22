"""Four visible AI buttons in fixed two-by-two layout; no input shifting."""
from playwright.sync_api import sync_playwright
from test_e2e import mount

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height in [(1600,900),(1280,850),(900,820),(768,760)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        page.on('dialog',lambda d:d.accept())
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        mount(page)
        page.locator('.header-assistant-toggle').click()
        assert page.locator('.assistant-mode-choice').count()==4
        boxes=[page.locator('.assistant-mode-choice').nth(i).bounding_box() for i in range(4)]
        assert all(boxes)
        assert abs(boxes[0]['y']-boxes[1]['y'])<2,boxes
        assert abs(boxes[2]['y']-boxes[3]['y'])<2,boxes
        assert boxes[2]['y']>boxes[0]['y']+25,boxes
        assert abs(boxes[0]['x']-boxes[2]['x'])<2,boxes
        assert abs(boxes[1]['x']-boxes[3]['x'])<2,boxes
        assert boxes[0]['x']<boxes[1]['x'],boxes
        input_y=[]
        for mode in ['offline','online','ollama','browser']:
            page.locator(f'.assistant-mode-choice[data-mode="{mode}"]').click()
            if page.locator('.assistant-modal').count():page.locator('button[data-action="close-assistant-dialog"]').last.click()
            assert page.locator(f'.assistant-mode-choice[data-mode="{mode}"]').get_attribute('aria-pressed')=='true'
            assert page.locator('.assistant-mode-choice[aria-pressed="true"]').count()==1
            input_y.append(page.locator('#assistant-question').bounding_box()['y'])
        assert max(input_y)-min(input_y)<3,(width,input_y)
        assert not errors,errors
        page.close()
    browser.close()
print('PASS: 2x2 four always-visible modes, modal and stationary editor at four widths')
