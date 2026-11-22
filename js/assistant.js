/* Asystent oparty na jawnej bazie źródeł. Opcjonalnie: lokalny Ollama.
   ŻADNE dane oceny pracownika nie są przekazywane do modelu. */
window.KOMPAS_ASSISTANT = (function () {
  const sources=window.KOMPAS_KNOWLEDGE;
  function tokenize(v){return (v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').match(/[a-ząćęłńóśźż0-9]+/gi)||[];}
  function find(query){
    const words=tokenize(query).filter(w=>w.length>=3);
    const results=sources.map(s=>{
      const kws=s.keywords.map(k=>tokenize(k).join(' '));
      const body=tokenize(s.text+' '+s.title+' '+s.answer);
      let score=0;
      words.forEach(w=>{if(kws.some(k=>k.includes(w)))score+=4;if(body.includes(w))score+=1;});
      const normalized=tokenize(query).join(' ');
      kws.forEach(k=>{if(k.includes(' ') && normalized.includes(k))score+=5;});
      return {source:s,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    return results.slice(0,3);
  }
  function lacksLaw(query){return /ile dni|termin|ustawow|art\.|artykuł|rozporządz|rozporzadzen|stawka|przepis|obowiązkow|obowiazkow|odwołan|jak często|jak czesto|kiedy musi|jaki formularz|podstawa prawna|zawsze wymaga/i.test(query);}
  function offline(query){
    const legalMatch=sources.find(item=>item.legal && item.match && new RegExp(item.match,'i').test(query));
    if(legalMatch)return {text:legalMatch.answer,sources:[legalMatch],supported:true,mode:'offline'};
    const picks=find(query);
    if (!picks.length || lacksLaw(query) || picks[0].source.legal)
      return {text:'Brak wystarczającej podstawy w dołączonej bazie wiedzy. Aby odpowiedzieć wiarygodnie, trzeba dodać aktualną ustawę, właściwe rozporządzenia, formularze i materiały KPRM. Nie podaję niezweryfikowanych zasad.',sources:[],supported:false,mode:'offline'};
    return {text:picks[0].source.answer,sources:picks.slice(0,2).map(x=>x.source),supported:true,mode:'offline'};
  }
  async function ask(query,config){
    const baseline=offline(query);
    if(config.mode==='online') {
      // The Worker has its own authoritative retrieval rules and vetted KB.
      // Do NOT suppress an online request based on the weaker local Offline matcher.
      if(!window.KOMPAS_ONLINE_AI) throw new Error('AI Online niedostępny.');
      return window.KOMPAS_ONLINE_AI.ask(query);
    }
    if(config.mode==='browser') {
      // Retrieval gate: never ask the LLM a question we cannot ground.
      if(!baseline.supported || !baseline.sources.length)return baseline;
      if(!window.KOMPAS_BROWSER_LLM?.ready())throw new Error('Najpierw uruchom model AI w przeglądarce.');
      const answer=await window.KOMPAS_BROWSER_LLM.generate(query, baseline.sources);
      if(/brak wystarczając(?:ych|ej) danych|brak danych w bazie wiedzy/i.test(answer))
        return {text:'Brak wystarczających danych w bazie wiedzy, aby odpowiedzieć wiarygodnie.',sources:[],supported:false,mode:'browser'};
      // Legal numerals/sections are not allowed to appear unless in the supplied evidence.
      if(baseline.sources.some(s=>s.legal)) {
        const evidence=baseline.sources.map(s=>s.text+' '+s.answer).join(' ');
        const numbers=(answer.match(/(?:§\s*)?\d+(?:[.,]\d+)?/g)||[]).map(x=>x.replace(/[^0-9.,]/g,''));
        if(numbers.some(n=>!evidence.includes(n)))
          return {text:baseline.text+'\n\nUwaga: wygenerowana odpowiedź zawierała liczby bez potwierdzenia w przywołanym materiale, dlatego pokazano odpowiedź źródłową.',sources:baseline.sources,supported:true,mode:'offline'};
      }
      return {text:answer,sources:baseline.sources,supported:true,mode:'browser'};
    }
    if(config.mode!=='ollama')return baseline;
    if(!baseline.supported)return baseline;
    const evidence=find(query).map(x=>`[${x.source.id}] ${x.source.title}: ${x.source.text}`).join('\n');
    const instruction=`Jesteś asystentem Kompasu Kompetencji. Odpowiadasz po polsku TYLKO na podstawie tekstu ŹRÓDŁA. Nie wymyślaj przepisów, skali prawnej ani terminów. Jeśli brak dowodów odpowiedz: "Brak danych w bazie wiedzy". Rekomendacje nie zastępują decyzji przełożonego. Pytanie: ${query}\n\nŹRÓDŁA:\n${evidence}\n\nOdpowiedź krótka, bez danych osobowych.`;
    const endpoint=(config.endpoint||'http://localhost:11434').trim().replace(/\/+$/,'');
    if(!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(endpoint))throw new Error('Ze względów bezpieczeństwa dozwolony jest wyłącznie lokalny adres Ollama (localhost / 127.0.0.1).');
    const abort=new AbortController();const timer=setTimeout(()=>abort.abort(),25000);
    try {
      const response=await fetch(endpoint+'/api/generate',{method:'POST',signal:abort.signal,
        headers:{'Content-Type':'application/json'},body:JSON.stringify({model:config.model||'llama3.2:3b',prompt:instruction,stream:false,options:{temperature:0.1,num_predict:260}})});
      if(!response.ok)throw new Error('Ollama HTTP '+response.status);
      const data=await response.json();
      if(!data || !data.response || !String(data.response).trim())throw new Error('Model nie zwrócił odpowiedzi.');
      return {text:String(data.response).trim(),sources:baseline.sources,supported:true,mode:'ollama'};
    } finally {clearTimeout(timer);}
  }
  return {ask,offline,find};
})();
