"""12 jury prompts: no false-positive PII, no silent client-side Offline gate, correct error statuses."""
from playwright.sync_api import sync_playwright
from test_e2e import mount

Q=[
 'Co oznaczają oceny 3, 5 i 7 w procedurze pierwszej oceny?',
 'Kiedy pierwsza ocena pracownika służby cywilnej jest pozytywna, a kiedy negatywna?',
 'Czym różni się pierwsza ocena od oceny okresowej w służbie cywilnej?',
 'Zaproponuj pięć konkretnych pytań do rozmowy oceniającej z pracownikiem, który ma trudności ze współpracą w zespole.',
 'Czy mogę przesłać Ci dane osobowe pracownika, w tym PESEL i szczegółowe notatki z jego oceny?'
]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':900})
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    mount(page)
    page.evaluate('''() => {
      window.__requests=[];
      window.__mode='success';
      window.fetch=async(url,options)=>{
        const payload=JSON.parse(options.body);
        window.__requests.push(payload);
        if(window.__mode==='limited')return {ok:false,status:429,json:async()=>({error:'rate_limited'})};
        return {ok:true,status:200,json:async()=>({answer:'Przykładowa odpowiedź na podstawie źródeł [B3].',sourceIds:['B3'],fallback:false})};
      };
    }''')
    page.locator('.header-assistant-toggle').click()
    page.locator('.assistant-mode-choice[data-mode="online"]').click()
    page.locator('button[data-action="enable-online-ai"]').click()
    assert page.evaluate('window.KOMPAS_ONLINE_AI.looksPrivate("Kiedy pierwsza ocena pracownika służby cywilnej jest pozytywna?")') is False
    assert page.evaluate('window.KOMPAS_ONLINE_AI.looksPrivate("Czy mogę wpisać PESEL pracownika?")') is False
    assert page.evaluate('window.KOMPAS_ONLINE_AI.looksPrivate("Ocena pracownika: Joanna Kowalska")') is True
    for q in Q:
        previous=page.evaluate('window.__requests.length')
        page.locator('#assistant-question').fill(q)
        page.locator('#assistant-question').press('Enter')
        page.wait_for_function('(count) => window.__requests.length > count',arg=previous)
        assert page.evaluate('window.__requests.at(-1).question')==q
        page.wait_for_function('document.querySelectorAll(".chat-bot").length===window.__requests.length')
    assert page.locator('.chat-user').count()==5
    page.evaluate("window.__mode='limited'")
    page.locator('#assistant-question').fill('Jakie elementy pierwszej oceny?')
    page.locator('.send-btn').click()
    page.wait_for_function('document.querySelectorAll(".chat-bot").length===6')
    assert 'Limit demonstracyjny' in page.locator('.chat-bot').last.inner_text()
    assert 'Odpowiedź awaryjna Offline' not in page.locator('.chat-bot').last.inner_text()
    requests=page.evaluate('window.__requests.length')
    page.locator('#assistant-question').fill('Ocena pracownika: Joanna Kowalska')
    page.locator('.send-btn').click()
    assert page.evaluate('window.__requests.length')==requests
    assert page.locator('.assistant-inline-feedback').is_visible()
    assert 'Nie zostało wysłane' in page.locator('.assistant-inline-feedback').inner_text()
    assert not errors,errors
    browser.close()
print('PASS: five formerly missing questions sent via Enter, 429 explained, PII blocked with visible status')
