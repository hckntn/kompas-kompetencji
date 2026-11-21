/* API kompatybilności wstecznej dla widoków v0.2.
 * Cała logika merytoryczna znajduje się w assessment/validation/workflow/session. */
window.KOMPAS_ENGINE = (function () {
  'use strict';
  const A=window.KOMPAS_ASSESSMENT, W=window.KOMPAS_WORKFLOW;
  return Object.freeze({
    getCompetency:A.getCompetency, key:A.key, summaryFor:A.summaryFor, totals:A.totals,
    levelName:A.levelName,
    nextGuard:(state,target)=>W.canNavigate(state,Number(target))
  });
})();
