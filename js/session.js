/* Techniczny dziennik działań (bez danych osobowych/treści obserwacji). */
window.KOMPAS_SESSION = (function () {
  'use strict';
  const A=window.KOMPAS_ASSESSMENT, W=window.KOMPAS_WORKFLOW;
  const MAX_HISTORY=120;
  const permitted=new Set(['migrated','track_selected','criterion_changed','indicator_rated','decision_selected','step_changed','finalized','demo_loaded']);
  function record(state,kind,details={}) {
    if(!permitted.has(kind)) return;
    if(!Array.isArray(state.history)) state.history=[];
    const entry={at:new Date().toISOString(),kind,track:state.case?.track || 'unknown'};
    if(typeof details.stepId==='string') entry.stepId=details.stepId;
    if(typeof details.competencyId==='string' && A.getCompetency(details.competencyId)) entry.competencyId=details.competencyId;
    state.history.push(entry);
    if(state.history.length>MAX_HISTORY) state.history.splice(0,state.history.length-MAX_HISTORY);
  }
  function invalidate(state) {state.finalized=false;state.finalizedAt=null;}
  function changeTrack(state,id) {
    if(!W.getProcedure(id)) return {ok:false,message:'Nieznana ścieżka oceny.'};
    if(state.case.track===id) return {ok:true};
    state.case.track=id;
    state.selected=[...window.KOMPAS_CATALOG.tracks[id].defaultCompetencies];
    state.observations={};state.decisions={};
    state.meeting={strengths:'',areas:'',questions:'',actions:''};
    state.firstFormal=window.KOMPAS_STORE.blankFirstFormal();
    state.step=0;state.history=[];invalidate(state);record(state,'track_selected');
    return {ok:true};
  }
  function toggleCriterion(state,id) {
    if(!A.getCompetency(id)) return {ok:false,message:'Nieznana kompetencja.'};
    if(state.case.track==='first')return {ok:false,message:'W pierwszej ocenie pięć elementów jest obowiązkowych (§ 2 rozporządzenia).'};
    if(state.selected.includes(id)) {
      state.selected=state.selected.filter(x=>x!==id);
      delete state.decisions[id];
      const c=A.getCompetency(id);
      c.indicators.forEach((_,i)=>delete state.observations[A.key(id,i)]);
    } else state.selected.push(id);
    invalidate(state);record(state,'criterion_changed',{competencyId:id});
    return {ok:true};
  }
  function rate(state,id,index,level) {
    const c=A.getCompetency(id);
    if(!c || !state.selected.includes(id) || !Number.isInteger(index) || index<0 || index>=c.indicators.length || !A.isLevel(level))
      return {ok:false,message:'Nieprawidłowa ocena wskaźnika.'};
    const k=A.key(id,index);
    state.observations[k]={...(state.observations[k]||{}),level};
    delete state.decisions[id];
    if(state.case.track==='first' && state.firstFormal?.grades)delete state.firstFormal.grades[id];
    invalidate(state);record(state,'indicator_rated',{competencyId:id});
    return {ok:true};
  }
  function decide(state,id,level) {
    if(!state.selected.includes(id) || !A.isLevel(level) || !A.summaryFor(state,id)?.completed)
      return {ok:false,message:'Najpierw oceń wszystkie wskaźniki tej kompetencji.'};
    state.decisions[id]={...(state.decisions[id]||{}),level};
    invalidate(state);record(state,'decision_selected',{competencyId:id});
    return {ok:true};
  }
  function gradeFirst(state,id,level) {
    if(state.case.track!=='first'||!window.KOMPAS_FIRST_RULES.IDS.includes(id)||!window.KOMPAS_FIRST_RULES.validGrade(level))return {ok:false,message:'Niedozwolona ocena cząstkowa.'};
    const summary=A.summaryFor(state,id);
    if(!summary?.completed)return {ok:false,message:'Najpierw uzupełnij obserwacje elementu oceny.'};
    if(!state.firstFormal)state.firstFormal=window.KOMPAS_STORE.blankFirstFormal();
    state.firstFormal.grades[id]=level;
    invalidate(state);record(state,'decision_selected',{competencyId:id});
    return {ok:true};
  }
  function navigate(state,target) {
    const result=W.canNavigate(state,target);
    if(!result.ok) return result;
    if(state.step!==target){state.step=target;record(state,'step_changed',{stepId:W.current(state)?.id});}
    return {ok:true};
  }
  function finalize(state) {
    const result=W.canComplete(state);
    if(!result.ok) return result;
    state.finalized=true;state.finalizedAt=new Date().toISOString();
    record(state,'finalized',{stepId:W.current(state)?.id});
    return {ok:true};
  }
  return Object.freeze({record,invalidate,changeTrack,toggleCriterion,rate,decide,gradeFirst,navigate,finalize});
})();
