"""Smoke check: online consent, fallback, no automatic case data in browser adapter."""
from playwright.sync_api import sync_playwright
from test_e2e import mount

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width':1366,'height':850})
        errors=[]
        page.on('pageerror', lambda e:errors.append(str(e)))
        mount(page)
        page.evaluate('''() => {
          window.KOMPAS_ONLINE_AI.configured = () => true;
          window.KOMPAS_ONLINE_AI.ask = async (q) => {
            window.__onlinePayload={question:q};
            return {text:'Pięć elementów oceny [P1].',sources:window.KOMPAS_KNOWLEDGE.filter(s=>s.id==='P1'),mode:'online',supported:true};
          };
        }''')
        page.locator('.header-assistant-toggle').click()
        page.locator('.assistant-mode-choice[data-mode="online"]').click()
        assert page.locator('.assistant-modal[role="dialog"]').count()==1
        assert page.locator('button[data-action="enable-online-ai"]').count()==1
        page.locator('button[data-action="close-assistant-dialog"]').last.click()
        page.locator('#assistant-question').fill('Jakie elementy pierwszej oceny?')
        page.locator('.send-btn').click()
        assert page.locator('.chat-bot').count()==0
        assert page.locator('.assistant-modal').is_visible()
        page.locator('button[data-action="enable-online-ai"]').click()
        page.locator('#assistant-question').fill('Jakie elementy pierwszej oceny?')
        page.locator('.send-btn').click()
        page.wait_for_function('document.querySelectorAll(".chat-bot").length===1')
        result=page.evaluate('window.__onlinePayload')
        assert result=={'question':'Jakie elementy pierwszej oceny?'}
        assert 'Alicja Nowak' not in str(result)
        assert page.locator('.chat-mode').count()==1
        page.locator('#assistant-question').fill('Dane: pracownika Joanna Kowalska')
        page.locator('.send-btn').click()
        assert page.locator('.chat-bot').count()==1
        assert 'Nie zostało wysłane' in page.locator('.assistant-inline-feedback').inner_text()
        assert not errors, errors
        print('PASS: online opt-in, limited payload, display source links, PII rejection, no JS errors')
        browser.close()
if __name__=='__main__': main()
