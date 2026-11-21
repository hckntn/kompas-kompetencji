/* Normative rules for FIRST assessment. Regulation Dz.U. 2015 poz. 1144 §2, §7, §9–10.
 * This is a transparent calculation helper, not a legally valid assessment form.
 * Partial grades are chosen by the human evaluator; no AI grade can override them. */
window.KOMPAS_FIRST_RULES=(function(){
  'use strict';
  const C=window.KOMPAS_CATALOG;
  const IDS=Object.freeze([...C.firstRequired]);
  const LEVELS=Object.freeze([{value:3,name:'Poniżej oczekiwań'},{value:5,name:'Na poziomie oczekiwań'},{value:7,name:'Powyżej oczekiwań'}]);
  const EXEMPT=Object.freeze(['ksap','replacement','senior']);
  const validGrade=n=>[3,5,7].includes(n);
  function evaluate(form){
    const f=form||{};
    const values=IDS.map(id=>f.grades?.[id]);
    const allGraded=values.every(validGrade);
    const average=allGraded?values.reduce((a,b)=>a+b,0)/IDS.length:null;
    const lowCount=values.filter(v=>v===3).length;
    const examOk=f.examStatus==='passed'||(f.examStatus==='exempt'&&EXEMPT.includes(f.exemptionKind));
    const examKnown=['passed','failed'].includes(f.examStatus)||(f.examStatus==='exempt'&&EXEMPT.includes(f.exemptionKind));
    const reportKnown=['yes','no'].includes(f.reportOnTime);
    const negativeReasons=[];
    if(examKnown&&!examOk)negativeReasons.push('Niezaliczony wymagany egzamin');
    if(reportKnown&&f.reportOnTime!=='yes')negativeReasons.push('Sprawozdanie niezłożone w wyznaczonym terminie');
    if(allGraded&&lowCount>1)negativeReasons.push('Więcej niż jedna ocena cząstkowa = 3 pkt');
    if(allGraded&&average<5)negativeReasons.push('Średnia ocen cząstkowych poniżej 5 pkt');
    const known=allGraded&&examKnown&&reportKnown;
    const result=known?(negativeReasons.length?'negatywna':'pozytywna'):null;
    return {ids:IDS,values,allGraded,average,lowCount,examOk,examKnown,reportKnown,known,result,negativeReasons};
  }
  function checkFormal(state){
    const f=state.firstFormal||{};
    const result=evaluate(f);
    if(!result.allGraded)return {ok:false,message:'W pierwszej ocenie wybierz formalne oceny 3, 5 lub 7 punktów dla wszystkich pięciu elementów.'};
    if(!result.examKnown)return {ok:false,message:'Określ wynik egzaminu ze służby przygotowawczej albo właściwy wyjątek z § 10 ust. 3.'};
    if(!result.reportKnown)return {ok:false,message:'Potwierdź, czy sprawozdanie zostało złożone w wyznaczonym terminie.'};
    if(!f.employmentDate || !f.introMeetingDate || !f.reportDue)
      return {ok:false,message:'Uzupełnij datę zatrudnienia, rozmowy wstępnej i wyznaczony termin sprawozdania (§ 3–4).'};
    if(!f.assessmentMeetingDate)return {ok:false,message:'Podaj datę rozmowy oceniającej (§ 7 i § 8).'};
    if(![f.employmentDate,f.introMeetingDate,f.reportDue,f.assessmentMeetingDate].every(d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')))
      return {ok:false,message:'Daty wymagane w pierwszej ocenie muszą mieć poprawny format RRRR-MM-DD.'};
    if(result.result==='negatywna'&&String(f.negativeReason||'').trim().length<8)return {ok:false,message:'Ocena negatywna wymaga pisemnego uzasadnienia (§ 10 ust. 4).'};
    return {ok:true};
  }
  return Object.freeze({IDS,LEVELS,EXEMPT,validGrade,evaluate,checkFormal});
})();
