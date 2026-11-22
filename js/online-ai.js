/* Browser adapter; sends ONLY question text, never the evaluation/session state.
   The worker independently validates and retrieves evidence; do not trust client data. */
window.KOMPAS_ONLINE_AI=(function(){
  'use strict';
  const CONFIG=window.KOMPAS_ONLINE_CONFIG||{};
  const MAX_QUERY=350;
  function endpoint(){const url=String(CONFIG.endpoint||'').trim().replace(/\/+$/,'');
    if(!url)return '';
    try{const parsed=new URL(url);if(parsed.protocol!=='https:' || !parsed.hostname || parsed.username || parsed.password || parsed.search || parsed.hash) return '';return parsed.origin+parsed.pathname.replace(/\/+$/,'');}
    catch{return '';}
  }
  function looksPrivate(q){
    return /(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b\d{11}\b|\b(?:\+?48[\s-]?)?(?:\d[\s-]?){9}\b|\b(?:imi[eę]|nazwisk[oa]|PESEL|adres zamieszkania|telefon|paszport|nr dowodu|ocen[aę] pani|ocen[aę] pana|pracownik(?:a|owi|iem|ów)?\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)\b)/i.test(q);
  }
  async function ask(question){
    const url=endpoint(); if(!url) throw new Error('AI Online nie jest skonfigurowane. Użyj Offline.');
    const q=String(question||'').trim();
    if(q.length<4 || q.length>MAX_QUERY) throw new Error('Pytanie musi mieć od 4 do 350 znaków.');
    if(looksPrivate(q))throw new Error('Pytanie może zawierać dane osobowe. Nie przesyłaj ich do AI Online.');
    const abort=new AbortController(), timer=setTimeout(()=>abort.abort(),18000);
    try{
      const response=await fetch(url+'/api/ask',{method:'POST',signal:abort.signal,mode:'cors',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});
      const json=await response.json().catch(()=>null);
      if(!response.ok){const errors={400:'Nieprawidłowe pytanie.',403:'Tryb AI Online niedostępny z tej strony.',413:'Pytanie jest zbyt długie.',422:'Brak wystarczających źródeł lub pytanie zawiera dane wrażliwe.',429:'Osiągnięto limit zapytań.',502:'Usługa AI chwilowo niedostępna.',503:'AI Online nie został jeszcze skonfigurowany.'};throw new Error(errors[response.status]||'Usługa AI: błąd HTTP '+response.status);}
      if(!json || typeof json.answer!=='string'|| !Array.isArray(json.sourceIds) || json.answer.length>2600) throw new Error('Nieprawidłowa odpowiedź usługi AI.');
      const ids=new Set(json.sourceIds.filter(x=>typeof x==='string'));
      const sources=(window.KOMPAS_KNOWLEDGE||[]).filter(s=>ids.has(s.id));
      if(!sources.length)throw new Error('Brak zweryfikowanych źródeł w odpowiedzi AI.');
      return {text:json.answer,sources,supported:true,mode:json.fallback?'offline':'online'};
    }finally{clearTimeout(timer);}
  }
  return {ask,configured:()=>Boolean(endpoint()),looksPrivate};
})();
