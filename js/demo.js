/* Separacja fikcyjnych scenariuszy od Workflow Engine.
   Kopia bieżącej sesji pozostaje wyłącznie w sessionStorage tej samej karty. */
window.KOMPAS_DEMO = (function(){
  'use strict';
  const S=window.KOMPAS_STORE;
  const rules=window.KOMPAS_FIRST_RULES;
  const scenarios=window.KOMPAS_DEMO_SCENARIOS;
  const BACKUP_KEY='kompas-demo-previous-session-v1';
  const get=id=>scenarios.find(x=>x.id===id)||null;
  const current=state=>get(state?.demo?.id);
  function begin(id,previous,storage=sessionStorage){
    const descriptor=get(id);
    if(!descriptor)return {ok:false,message:'Nieznany scenariusz demonstracyjny.'};
    let backup;
    try{
      backup=storage.getItem(BACKUP_KEY);
      if(!backup){
        if(previous?.demo?.id)return {ok:false,message:'Nie znaleziono kopii poprzedniej sesji. Nie nadpisuj bieżących danych.'};
        storage.setItem(BACKUP_KEY,JSON.stringify(previous));
      }
    }catch(e){return {ok:false,message:'Nie można bezpiecznie zachować dotychczasowej sesji. Scenariusz nie został uruchomiony.'};}
    // Tworzymy świeży stan, bez kopiowania historii ani rozmów z asystentem.
    const next=S.initial();
    if(descriptor.track==='periodic')S.fillDemo(next);
    else S.fillFirstDemo(next);
    if(id==='first-negative'){
      // Silnik wyliczy rezultat samodzielnie. Uzasadnienie pozostaje puste celowo.
      next.firstFormal.grades.rzetelnosc=3;
      next.firstFormal.grades.wspolpraca=3;
      next.firstFormal.grades.wiedza=7;
      next.firstFormal.grades.organizacja=7;
      next.firstFormal.grades.komunikacja=7;
      next.firstFormal.negativeReason='';
    }
    if(id==='missing-fields'){
      next.case.employee='';next.case.manager='';next.case.position='';
      next.firstFormal.introMeetingDate='';
      next.firstFormal.grades={};next.observations={};next.decisions={};
      next.meeting={strengths:'',areas:'',questions:'',actions:''};
    }
    // Nie uruchamiamy online AI automatycznie; asystent wymaga świadomej zgody.
    next.assistant.mode='offline';next.assistant.chat=[];next.assistant.busy=false;
    next.demo={id};
    next.notice='Wczytano fikcyjny scenariusz: '+descriptor.label+'. Poprzednia sesja została zachowana w tej karcie.';
    return {ok:true,state:next};
  }
  function restore(currentState,storage=sessionStorage){
    if(!current(currentState))return {ok:false,message:'Brak aktywnego scenariusza.'};
    try{
      const snapshot=storage.getItem(BACKUP_KEY);
      if(!snapshot)return {ok:false,message:'Nie odnaleziono kopii pierwotnej sesji. Nie usunięto danych scenariusza.'};
      const original=S.migrate(JSON.parse(snapshot));
      if(!original || original.demo) return {ok:false,message:'Kopia sesji jest uszkodzona; nie przywrócono jej.'};
      original.notice='Przywrócono sesję sprzed uruchomienia scenariuszy testowych.';
      if(!S.save(original))return {ok:false,message:'Nie udało się zapisać przywróconej sesji; kopia nadal jest dostępna.'};
      storage.removeItem(BACKUP_KEY);
      return {ok:true,state:original};
    }catch(e){return {ok:false,message:'Nie można przywrócić sesji. Zachowano dane scenariusza i kopię bezpieczeństwa.'};}
  }
  function expectedFor(state){
    const id=current(state)?.id;
    if(id==='first-positive'||id==='first-negative')return rules.evaluate(state.firstFormal).result;
    if(id==='missing-fields')return window.KOMPAS_VALIDATION.check(state,['case']).ok;
    return null;
  }
  return Object.freeze({scenarios,get,current,begin,restore,expectedFor});
})();
