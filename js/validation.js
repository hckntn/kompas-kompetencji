/* Bramy wejścia do kroków i walidacja decyzji, niezależnie od DOM. */
window.KOMPAS_VALIDATION = (function () {
  'use strict';
  const A = window.KOMPAS_ASSESSMENT;
  const catalog = window.KOMPAS_CATALOG;
  const fail = message => ({ok:false,message});
  const ok = () => ({ok:true});
  const validators = Object.freeze({
    case(state) {
      const c = state.case || {};
      if (!['employee','manager','position','due'].every(k => typeof c[k] === 'string' && c[k].trim()))
        return fail('Uzupełnij pracownika, stanowisko, przełożonego i termin.');
      if (!catalog.tracks[c.track]) return fail('Wybierz właściwy rodzaj oceny.');
      return ok();
    },
    criteria(state) {
      if (!Array.isArray(state.selected) || !state.selected.length ||
          state.selected.some(id => !A.getCompetency(id)) || new Set(state.selected).size !== state.selected.length)
        return fail('Wybierz co najmniej jedną prawidłową kompetencję.');
      if(state.case?.track==='first' && window.KOMPAS_CATALOG.firstRequired.some(id=>!state.selected.includes(id)))return fail('Pierwsza ocena wymaga wszystkich pięciu elementów z § 2 rozporządzenia.');
      return ok();
    },
    observations(state) {
      if (!A.totals(state).allObserved) return fail('Oceń wszystkie wskaźniki w wybranych kompetencjach.');
      return ok();
    },
    decisions(state) {
      if (state.case?.track==='first') {
        if(!A.totals(state).allObserved)return fail('Uzupełnij obserwacje pomocnicze przed wystawieniem ocen.');
        if(!window.KOMPAS_FIRST_RULES.evaluate(state.firstFormal).allGraded)return fail('Wybierz pięć ocen cząstkowych w skali 3/5/7.');
        return ok();
      }
      if (!A.totals(state).allDecided)
        return fail('Potwierdź ostateczne poziomy. Przy zmianie sugestii podaj uzasadnienie (co najmniej 8 znaków).');
      return ok();
    },
    firstFormal(state) {
      return state.case?.track==='first' ? window.KOMPAS_FIRST_RULES.checkFormal(state) : ok();
    },
    developmentPlan(state) {
      if (String(state.meeting?.actions || '').trim().length < 8)
        return fail('Pierwsza ocena (reguła demonstracyjna): uzupełnij plan dalszych działań (minimum 8 znaków).');
      return ok();
    }
  });
  function check(state, ruleIds) {
    for (const id of ruleIds) {
      if (!Object.hasOwn(validators,id)) return fail('Nieznana reguła procesu: ' + id);
      const result = validators[id](state);
      if (!result.ok) return result;
    }
    return ok();
  }
  return Object.freeze({check, validators});
})();
