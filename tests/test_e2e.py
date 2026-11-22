"""Browser smoke test: mount local assets without network/navigation. Requires playwright + Chromium."""
from pathlib import Path
import re
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ('data/competencies.js','data/knowledge.js','data/online-config.js','data/procedures.js','data/first-rules.js','data/demo-scenarios.js','js/assessment.js','js/validation.js','js/workflow.js','js/session.js','js/engine.js','js/state.js','js/demo.js','js/browser-llm.js','js/online-ai.js','js/assistant.js','js/app.js')

def mount(page, previous_state=None):
    # Browser navigation is blocked in this execution sandbox. Mount identical
    # HTML/CSS/JS in about:blank; substitute only sessionStorage origin support.
    source = (ROOT/'index.html').read_text(encoding='utf-8')
    source = re.sub(r'<script[^>]*></script>', '', source)
    source = re.sub(r'<link rel="stylesheet"[^>]*>', '', source)
    page.set_content(source, wait_until='load')
    page.add_style_tag(content=(ROOT/'assets/styles.css').read_text(encoding='utf-8'))
    page.add_style_tag(content=(ROOT/'assets/institutional-ui.css').read_text(encoding='utf-8'))
    page.evaluate("""prior => {
        const data = new Map(prior ? Object.entries(prior) : []);
        window.__demoStore = data;
        Object.defineProperty(window,'sessionStorage',{configurable:true,value:{
            getItem:k=>data.has(k)?data.get(k):null,
            setItem:(k,v)=>data.set(k,String(v)),
            removeItem:k=>data.delete(k),clear:()=>data.clear()
        }});
    }""", previous_state)
    for path in SCRIPTS:
        page.add_script_tag(content=(ROOT/path).read_text(encoding='utf-8'))

def main():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1600,'height':1000},accept_downloads=True)
        errors=[]
        page.on('pageerror',lambda err:errors.append(str(err)))
        mount(page)
        page.locator('.main-area h1').get_by_text('Rozpocznij ocenę').wait_for()
        assert page.locator('.track-card').count()==2
        page.get_by_role('button',name='Dalej →').click()
        assert page.locator('.main-area h1').inner_text()=='Wybierz kompetencje'
        page.get_by_role('button',name='Dalej →').click()
        assert page.locator('.main-area h1').inner_text()=='Oceń zachowania'
        page.get_by_role('button',name='Dalej →').click()
        assert page.locator('.main-area h1').inner_text()=='Oceń zachowania'
        assert 'Oceń wszystkie wskaźniki' in page.locator('.notice').inner_text()
        # Every response is a real button. Assign all 3 per competency.
        for id in ('komunikacja','wspolpraca','analityka','organizacja'):
            for j in range(3):
                page.locator(f'button[data-action="rate"][data-id="{id}"][data-index="{j}"][data-level="3"]').click()
        totals=page.evaluate('window.KOMPAS_DEBUG.totals()')
        assert totals['total']==12 and totals['answered']==12
        # Observation notes must be saved into observations rather than a stray object.
        page.locator('textarea[name="observations.komunikacja:0.note"]').fill('Konkretna sytuacja testowa.')
        page.get_by_role('button',name='Poprzedni etap').click()
        page.get_by_role('button',name='Dalej →').click()
        assert page.locator('textarea[name="observations.komunikacja:0.note"]').input_value()=='Konkretna sytuacja testowa.'
        state_note=page.evaluate('window.KOMPAS_DEBUG.getState()')
        assert state_note['observations']['komunikacja:0']['note']=='Konkretna sytuacja testowa.'
        page.get_by_role('button',name='Dalej →').click()
        assert page.locator('.main-area h1').inner_text()=='Rekomendacja i decyzja'
        # make one override, leave reason empty to confirm validation
        page.locator('button[data-action="decide"][data-id="komunikacja"][data-level="4"]').click()
        for id in ('wspolpraca','analityka','organizacja'):
            page.locator(f'button[data-action="decide"][data-id="{id}"][data-level="3"]').click()
        page.get_by_role('button',name='Dalej →').click()
        assert page.locator('.main-area h1').inner_text()=='Rekomendacja i decyzja'
        assert 'uzasadnienie' in page.locator('.notice').inner_text().lower()
        page.locator('textarea[name="decisions.komunikacja.reason"]').fill('Zaobserwowany wyraźny wpływ na współpracę zespołu.')
        page.get_by_role('button',name='Dalej →').click()
        assert page.locator('.main-area h1').inner_text()=='Przygotuj rozmowę'
        page.get_by_role('button',name='Zaproponuj pytania').click()
        assert 'Jak oceniasz' in page.locator('textarea[name="meeting.questions"]').input_value()
        page.get_by_role('button',name='Dalej →').click()
        assert page.locator('.main-area h1').inner_text()=='Dokumentacja oceny'
        assert page.locator('.report-table-row').count()==4
        with page.expect_download() as d:
            page.get_by_role('button',name='Eksport JSON').click()
        download=d.value
        assert download.suggested_filename.endswith('.json')
        with page.expect_download() as d:
            page.get_by_role('button',name='Eksport TXT').click()
        assert d.value.suggested_filename.endswith('.txt')
        page.get_by_role('button',name='Zakończ ocenę').click()
        assert page.evaluate('window.KOMPAS_DEBUG.getState().finalized') is True
        page.locator('button[data-action="switch-view"][data-view="hr"]').first.click()
        assert page.locator('.main-area h1').inner_text()=='Monitorowanie procesów'
        assert page.locator('.hr-table tbody tr').count()==3
        snapshot=page.evaluate('Object.fromEntries(window.__demoStore)')
        mount(page,snapshot)
        assert page.evaluate('window.KOMPAS_DEBUG.getState().finalized') is True
        assert page.evaluate('window.KOMPAS_DEBUG.getState().observations["komunikacja:0"].note') == 'Konkretna sytuacja testowa.'
        page.locator('button[data-action="switch-view"][data-view="workflow"]').first.click()
        page.screenshot(path=str(ROOT/'examples'/'workflow-v03.png'),full_page=True)
        # Offline assistant must not claim uncertain legal deadlines.
        page.locator('.header-assistant-toggle').click()  # UX: assistant opens on demand
        page.locator('button[data-action="ask-preset"]').first.click()
        assert page.locator('.chat-bot').count()==1
        assert page.locator('.source-pill').count()>=1
        page.locator('#assistant-question').fill('Jaki jest ustawowy termin oceny?')
        page.locator('.send-btn').click()
        page.wait_for_function('document.querySelectorAll(".chat-bot").length >= 2')
        assert 'Brak wystarczającej podstawy' in page.locator('.chat-bot').last.inner_text()
        # Public static AI mode: explicit opt-in and source-grounded response.
        page.locator('.assistant-mode-choice[data-mode="browser"]').click()
        assert page.locator('.assistant-modal').count()==1
        assert page.locator('button[data-action="enable-browser-ai"]').count()==1
        page.evaluate('''() => {
          const ai = window.KOMPAS_BROWSER_LLM;
          ai.__mockReady = false;
          ai.ready = () => ai.__mockReady;
          ai.prepare = async (notify) => {notify('Test: model wczytany');ai.__mockReady = true;};
          ai.generate = async (q, sources) => {
            window.__llmInput = {question:q, sourceIds:sources.map(s=>s.id)};
            return 'Pierwsza ocena obejmuje pięć elementów [P1].';
          };
        }''')
        page.locator('button[data-action="enable-browser-ai"]').click()
        page.wait_for_function('window.KOMPAS_BROWSER_LLM.ready()')
        page.locator('#assistant-question').fill('Jakie elementy pierwszej oceny?')
        page.locator('.send-btn').click()
        page.wait_for_function('document.querySelectorAll(".chat-bot").length >= 3')
        assert 'pięć elementów' in page.locator('.chat-bot').last.inner_text()
        assert 'P1' in page.evaluate('window.__llmInput.sourceIds')
        assert page.locator('.chat-bot').last.locator('.chat-mode').count() == 1
        # Access to personal case data is never part of the prompt assembled in assistant.js.
        assert 'Alicja Nowak' not in str(page.evaluate('window.__llmInput'))
        # Chromium print emulates save-as-PDF; report print CSS is checked separately.
        page.pdf(path=str(ROOT/'examples'/'sample-report.pdf'),format='A4',print_background=True)
        assert not errors, '\n'.join(errors)
        assert Path(str(ROOT/'examples'/'sample-report.pdf')).stat().st_size>5000
        # Distinct statutory first assessment with all five criteria and formal 3/5/7.
        page2=browser.new_page(viewport={'width':1600,'height':1000},accept_downloads=True)
        second_errors=[]
        page2.on('pageerror',lambda err:second_errors.append(str(err)))
        mount(page2)
        page2.screenshot(path=str(ROOT/'examples'/'start-screen.png'),full_page=True)
        page2.locator('button[data-action="choose-track"][data-id="first"]').click()
        first=page2.evaluate('window.KOMPAS_DEBUG.getState()')
        assert first['case']['track']=='first' and len(first['selected'])==5
        assert 'Rozmowa' in page2.locator('.step-link').nth(4).inner_text()
        page2.locator('input[name="firstFormal.employmentDate"]').fill('2026-02-01')
        page2.locator('input[name="firstFormal.contractEnd"]').fill('2027-02-28')
        page2.locator('input[name="firstFormal.introMeetingDate"]').fill('2026-02-10')
        page2.locator('input[name="firstFormal.reportDue"]').fill('2026-10-09')
        page2.get_by_role('button',name='Dalej →').click()
        assert page2.locator('.main-area h1').inner_text()=='Pięć elementów pierwszej oceny'
        assert page2.locator('.criterion-card').count()==5
        page2.get_by_role('button',name='Dalej →').click()
        for id in first['selected']:
            for j in range(3):
                page2.locator(f'button[data-action="rate"][data-id="{id}"][data-index="{j}"][data-level="3"]').click()
        page2.get_by_role('button',name='Dalej →').click()
        assert page2.locator('.main-area h1').inner_text()=='Oceny cząstkowe i wynik pierwszej oceny'
        assert page2.locator('button[data-action="grade-first"]').count()==15
        for id in first['selected']:
            page2.locator(f'button[data-action="grade-first"][data-id="{id}"][data-level="5"]').click()
        page2.get_by_role('button',name='Dalej →').click()
        assert 'Egzamin' in page2.locator('.notice').inner_text() or 'egzamin' in page2.locator('.notice').inner_text()
        page2.locator('select[name="firstFormal.examStatus"]').select_option('passed')
        page2.locator('select[name="firstFormal.reportOnTime"]').select_option('yes')
        page2.locator('input[name="firstFormal.assessmentMeetingDate"]').fill('2026-11-03')
        assert page2.evaluate('window.KOMPAS_FIRST_RULES.evaluate(window.KOMPAS_DEBUG.getState().firstFormal).result')=='pozytywna'
        page2.get_by_role('button',name='Dalej →').click()
        assert page2.locator('.main-area h1').inner_text()=='Rozmowa i plan rozwoju'
        page2.screenshot(path=str(ROOT/'examples'/'first-path.png'),full_page=True)
        page2.get_by_role('button',name='Dalej →').click()
        assert page2.locator('.main-area h1').inner_text()=='Arkusz roboczy pierwszej oceny'
        assert page2.locator('.report-table-row').count()==5
        with page2.expect_download() as d:
            page2.get_by_role('button',name='Eksport JSON').click()
        assert d.value.suggested_filename.endswith('.json')
        page2.get_by_role('button',name='Zakończ ocenę').click()
        assert page2.evaluate('window.KOMPAS_DEBUG.getState().finalized') is True
        page2.pdf(path=str(ROOT/'examples'/'first-sample-report.pdf'),format='A4',print_background=True)
        assert (ROOT/'examples'/'first-sample-report.pdf').stat().st_size > 5000
        assert not second_errors,'\n'.join(second_errors)
        page2.locator('button[data-action="go-step"][data-step="0"]').click()
        page2.on('dialog', lambda dialog: dialog.accept())
        page2.locator('button[data-action="toggle-demo-menu"]').click()
        page2.locator('button[data-action="start-demo"][data-id="periodic-demo"]').click()
        demo=page2.evaluate('window.KOMPAS_DEBUG.getState()')
        assert demo['case']['track']=='periodic' and len(demo['observations'])==12
        assert page2.evaluate('window.KOMPAS_DEBUG.totals().allObserved') is True
        page2.close()
        browser.close()
        print('PASS: periodic regression + statutory first flow, legal grades/conditions, sources, migrations, exports, browser PDF, no JavaScript errors')

if __name__=='__main__':
    main()
