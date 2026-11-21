/* Interpreter sekwencji kroków, nie zależy od HTML ani schowka przeglądarki. */
window.KOMPAS_WORKFLOW = (function () {
  'use strict';
  const procedures = window.KOMPAS_PROCEDURES;
  const V = window.KOMPAS_VALIDATION;
  function getProcedure(track) {return procedures[track] || null;}
  function getSteps(track) {return getProcedure(track)?.steps || [];}
  function current(state) {return getSteps(state.case?.track)[state.step] || null;}
  function canNavigate(state, target) {
    const steps=getSteps(state.case?.track);
    if (!steps.length) return {ok:false,message:'Nieznana ścieżka oceny.'};
    if (!Number.isInteger(target) || target<0 || target>=steps.length)
      return {ok:false,message:'Nieprawidłowy etap oceny.'};
    if (!Number.isInteger(state.step) || state.step<0 || state.step>=steps.length)
      return {ok:false,message:'Stan procesu jest niespójny.'};
    if (target<=state.step) return {ok:true};
    // Każda brama na drodze do celu musi zostać spełniona (także przy skoku).
    for (let i=state.step+1;i<=target;i++) {
      const result=V.check(state,steps[i].requires);
      if(!result.ok) return result;
    }
    return {ok:true};
  }
  function canComplete(state) {
    const steps=getSteps(state.case?.track);
    if(!steps.length) return {ok:false,message:'Nieznana ścieżka oceny.'};
    // Walidacja pełnego procesu, niezależnie od bieżącego kroku.
    for(let i=1;i<steps.length;i++) {
      const result=V.check(state,steps[i].requires);
      if(!result.ok) return result;
    }
    return {ok:true};
  }
  return Object.freeze({getProcedure,getSteps,current,canNavigate,canComplete});
})();
