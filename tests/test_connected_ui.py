from playwright.sync_api import sync_playwright
from test_e2e import mount

ENDPOINT='https://kompas-kompetencji-ai.hckntn.workers.dev'

def main():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1366,'height':850})
        errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        mount(page)
        assert page.evaluate('window.KOMPAS_ONLINE_AI.configured()') is True
        assert page.evaluate('window.KOMPAS_ONLINE_CONFIG.endpoint') == ENDPOINT
        page.evaluate("""() => {
          window.__calls = [];
          window.fetch = async (url, options) => {
            window.__calls.push({url, method:options.method, credentials:options.credentials, body:JSON.parse(options.body)});
            return {ok:true,json:async()=>({answer:'Pierwsza ocena obejmuje pięć elementów [P1].',sourceIds:['P1'],fallback:false})};
          }
        }""")
        page.locator('.header-assistant-toggle').click()
        page.locator('#assistant-mode-select').select_option('online')
        assert page.locator('button[data-action="enable-online-ai"]').count()==1
        page.locator('button[data-action="enable-online-ai"]').click()
        page.locator('#assistant-question').fill('Jakie elementy pierwszej oceny?')
        page.locator('.send-btn').click()
        page.wait_for_function('document.querySelectorAll(".chat-bot").length===1')
        reqs=page.evaluate('window.__calls')
        assert len(reqs)==1,reqs
        assert reqs[0]=={'url':ENDPOINT+'/api/ask','method':'POST','credentials':'omit','body':{'question':'Jakie elementy pierwszej oceny?'}}
        assert 'Alicja Nowak' not in str(reqs)
        assert 'P1' in page.locator('.source-pill').first.inner_text()
        page.locator('#assistant-question').fill('Pracownik Joanna Kowalska ma trudności.')
        page.locator('.send-btn').click()
        assert len(page.evaluate('window.__calls'))==1
        assert not errors,errors
        browser.close()
        print('PASS connected endpoint, opt-in, exact question-only payload, sources, PII rejection')

if __name__=='__main__':main()
