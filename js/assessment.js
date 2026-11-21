/* Czysta, deterministyczna arytmetyka ocen. Skala oraz wzór są DEMONSTRACYJNE. */
window.KOMPAS_ASSESSMENT = (function () {
  'use strict';
  const catalog = window.KOMPAS_CATALOG;
  const getCompetency = id => catalog.competencies.find(c => c.id === id) || null;
  const key = (competencyId, indicatorIndex) => competencyId + ':' + indicatorIndex;
  const isLevel = value => Number.isInteger(value) && catalog.levels.some(l => l.value === value);
  const parseLevel = value => (value === null || value === undefined || value === '') ? null : (isLevel(Number(value)) ? Number(value) : null);

  function summaryFor(state, competencyId) {
    const competency = getCompetency(competencyId);
    if (!competency) return null;
    const values = competency.indicators.map((_, i) => parseLevel(state.observations?.[key(competencyId, i)]?.level));
    const completed = values.length > 0 && values.every(isLevel);
    const average = completed ? values.reduce((a,b) => a + b, 0) / values.length : null;
    const suggestion = completed ? Math.round(average) : null;
    const decision = state.decisions?.[competencyId] || {};
    const final = parseLevel(decision.level);
    const overruled = completed && final !== null && final !== suggestion;
    const validDecision = completed && final !== null && (!overruled || String(decision.reason || '').trim().length >= 8);
    const explanation = completed
      ? `${values.join(' + ')} = ${values.reduce((a,b)=>a+b,0)}; średnia ${average.toFixed(2)}; propozycja ${suggestion}/4 (zaokrąglenie).`
      : 'Uzupełnij wszystkie wskaźniki, aby obliczyć propozycję.';
    return {competency, values, completed, average, suggestion, final, overruled, validDecision, explanation};
  }
  function totals(state) {
    const uniqueIds = [...new Set(Array.isArray(state.selected) ? state.selected : [])];
    const summaries = uniqueIds.map(id => summaryFor(state, id)).filter(Boolean);
    const total = summaries.reduce((n,s) => n + s.values.length, 0);
    const answered = summaries.reduce((n,s) => n + s.values.filter(isLevel).length, 0);
    const decisions = summaries.filter(s => s.validDecision).length;
    return {total, answered, decisions, criteria:summaries.length,
      allObserved:total > 0 && answered === total,
      allDecided:summaries.length > 0 && decisions === summaries.length, summaries};
  }
  function levelName(value) {return catalog.levels.find(l=>l.value===value)?.name || 'Nie wybrano';}
  return Object.freeze({getCompetency, key, isLevel, parseLevel, summaryFor, totals, levelName});
})();
