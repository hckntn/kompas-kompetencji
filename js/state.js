window.KOMPAS_STORE = (function () {
  const KEY='kompas-competencji-mvp-v1'; // zachowujemy klucz przechowywania dla migracji
  const blankFirstFormal=()=>({employmentDate:'',contractEnd:'',introMeetingDate:'',reportDue:'',reportOnTime:'unknown',examStatus:'unknown',exemptionKind:'',assessmentMeetingDate:'',grades:{},negativeReason:''});
  function iso(offset=0){const d=new Date(); d.setDate(d.getDate()+offset);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
  const initial = () => ({
    version:3,history:[],view:'workflow',step:0,notice:'',
    case:{track:'periodic',employee:'Alicja Nowak',position:'Specjalistka ds. usług cyfrowych',manager:'Marek Zieliński',periodStart:iso(-280),periodEnd:iso(-2),due:iso(14),department:'Departament Usług Cyfrowych'},
    selected:['komunikacja','wspolpraca','analityka','organizacja'],
    observations:{},decisions:{},firstFormal:blankFirstFormal(),
    meeting:{strengths:'',areas:'',questions:'',actions:''},
    finalized:false,finalizedAt:null,
    assistant:{mode:'offline',endpoint:'http://localhost:11434',model:'llama3.2:3b',chat:[],busy:false}
  });
  function migrate(value){
    if(!value || typeof value!=='object' || ![1,2,3].includes(value.version) ||
       !value.case || !Array.isArray(value.selected) || !value.observations ||
       !value.decisions || !value.meeting || !value.assistant) return null;
    const state=value;
    const legacy=state.version===1;
    // v0.2 zapisywało tekst obserwacji pod `observation.<id:index>` zamiast
    // `observations.<id:index>.note`. Ocal te notatki podczas migracji.
    if(state.observation && typeof state.observation==='object') {
      for (const [k, note] of Object.entries(state.observation)) {
        const [id, indexText]=k.split(':');
        const comp=window.KOMPAS_ASSESSMENT.getCompetency(id);
        const i=Number(indexText);
        if(comp && Number.isInteger(i) && i>=0 && i<comp.indicators.length &&
           typeof note==='string' && note.trim()) {
          if(!state.observations[k] || typeof state.observations[k]!=='object') state.observations[k]={};
          if(!state.observations[k].note) state.observations[k].note=note;
        }
      }
    }
    const previous=state.version;
    if(!state.firstFormal || typeof state.firstFormal!=='object')state.firstFormal=blankFirstFormal();
    else state.firstFormal={...blankFirstFormal(),...state.firstFormal,grades:{...(state.firstFormal.grades||{})}};
    if(previous<3 && state.case.track==='first') {
      // Pierwsza ocena 0.3 była ścieżką demonstracyjną (3 kryteria / 1–4).
      // Nie wolno zachować dawnego statusu 'finalized' jako oceny formalnej.
      state.selected=[...window.KOMPAS_CATALOG.firstRequired];
      state.finalized=false;state.finalizedAt=null;
      state.notice='Zmieniono zasady pierwszej oceny na § 2, § 9 i § 10 rozporządzenia z 2015 r. Dotychczasowe notatki zachowano; oceny formalne trzeba wybrać ponownie.';
    }
    state.version=3;
    state.history=Array.isArray(state.history)?state.history.slice(-120):[];
    if(!window.KOMPAS_WORKFLOW.getProcedure(state.case.track)) state.case.track='periodic';
    const count=window.KOMPAS_WORKFLOW.getSteps(state.case.track).length;
    if(!Number.isInteger(state.step) || state.step<0 || state.step>=count) state.step=0;
    state.assistant.busy=false;
    if(previous<3) window.KOMPAS_SESSION.record(state,'migrated');
    return state;
  }
  function load(){
    try{const raw=sessionStorage.getItem(KEY);if(!raw)return initial();
      return migrate(JSON.parse(raw))||initial();
    }catch(e){console.warn('Brak dostępu do sessionStorage:',e);return initial();}
  }
  function save(state){try{const copy=JSON.parse(JSON.stringify(state));copy.assistant.busy=false;sessionStorage.setItem(KEY,JSON.stringify(copy));return true;}catch(e){console.warn('Zapisywanie stanu nie powiodło się:',e);return false;}}
  function fillDemo(state){
    state.case.track='periodic';state.selected=['komunikacja','wspolpraca','analityka','organizacja'];
    const seeds={komunikacja:[3,4,3],wspolpraca:[3,3,2],analityka:[4,3,3],organizacja:[2,3,3]};
    const notes={
      komunikacja:['Podsumowania ustaleń po spotkaniach.','Dopytuje o potwierdzenie kluczowych terminów.','Proste instrukcje dla różnych odbiorców.'],
      wspolpraca:['Koordynuje zadania z zespołem wsparcia.','Udostępnia aktualne materiały.','Zdarzały się opóźnienia w rozwiązaniu sporów.'],
      analityka:['Oddziela dane źródłowe od szacunków.','Porównuje raporty przed rekomendacją.','Uzasadnia wybór rozwiązania.'],
      organizacja:['W jednym projekcie priorytety uzgodniono zbyt późno.','Wcześnie zgłasza przeszkody.','Aktualizuje harmonogram przy zmianach.']
    };
    state.observations={};state.decisions={};
    for(const [id,levels] of Object.entries(seeds))levels.forEach((level,i)=>{state.observations[id+':'+i]={level,note:notes[id][i]};});
    for(const id of state.selected){const arr=seeds[id];state.decisions[id]={level:Math.round(arr.reduce((a,b)=>a+b,0)/arr.length),reason:''};}
    state.meeting={strengths:'Jasna komunikacja i analiza danych.',areas:'Wcześniejsze uzgadnianie priorytetów i rozwiązywanie rozbieżności.',questions:'Które zadania sprawiły największą trudność? Jakiego wsparcia potrzebujesz?',actions:'Wspólnie ustalić sposób sygnalizacji ryzyka i datę przeglądu postępów.'};
    state.finalized=false;state.finalizedAt=null;state.step=0;state.view='workflow';
    state.history=[];window.KOMPAS_SESSION.record(state,'demo_loaded');state.notice='Wczytano fikcyjny scenariusz demonstracyjny. Możesz przejść cały proces lub od razu otworzyć wyniki.';
    return state;
  }
  function fillFirstDemo(state){
    state.case={...state.case,track:'first',employee:'Joanna Kowalska',manager:'Piotr Nowak',position:'Specjalistka ds. informacji publicznej',department:'Departament Obsługi Obywateli',periodStart:'2026-02-01',periodEnd:'2026-10-31',due:'2026-11-10'};
    state.firstFormal={...blankFirstFormal(),employmentDate:'2026-02-01',contractEnd:'2027-02-28',introMeetingDate:'2026-02-12',reportDue:'2026-10-08',reportOnTime:'yes',examStatus:'passed',assessmentMeetingDate:'2026-11-03',grades:{rzetelnosc:5,wiedza:5,organizacja:5,komunikacja:7,wspolpraca:5}};
    state.selected=[...window.KOMPAS_CATALOG.firstRequired];
    state.observations={};state.decisions={};
    const scores={rzetelnosc:[3,3,3],wiedza:[3,3,2],organizacja:[3,3,3],komunikacja:[4,4,4],wspolpraca:[3,3,3]};
    for(const [id,levels] of Object.entries(scores))levels.forEach((level,i)=>state.observations[id+':'+i]={level,note:'Przykład fikcyjny — obserwacja pomocnicza '+(i+1)});
    state.meeting={strengths:'Komunikacja i współpraca.',areas:'Dalsze doskonalenie zawodowe.',questions:'Jakie zadania były najtrudniejsze?',actions:'Omówić możliwości rozwoju zawodowego.'};
    state.finalized=false;state.finalizedAt=null;state.step=0;state.view='workflow';state.history=[];
    window.KOMPAS_SESSION.record(state,'demo_loaded');
    state.notice='Wczytano fikcyjny przykład pierwszej oceny oparty na skali 3/5/7. Raport pozostaje nieoficjalny.';
    return state;
  }
  return {initial,load,save,fillDemo,fillFirstDemo,blankFirstFormal,iso,migrate};
})();
