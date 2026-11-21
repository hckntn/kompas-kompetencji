/* Konfiguracja dwóch ścieżek. Zasady i nazwy kroków są DEMONSTRACYJNE, nie KPRM. */
window.KOMPAS_PROCEDURES = Object.freeze({
  schemaVersion: 'first-legal-0.4',
  periodic: {
    id: 'periodic', title: 'Ocena okresowa',
    steps: [
      {id:'start', title:'Rozpoczęcie', subtitle:'Dane procesu', requires:[]},
      {id:'criteria', title:'Kryteria', subtitle:'Wybór kompetencji', requires:['case']},
      {id:'observations', title:'Obserwacje', subtitle:'Wskaźniki zachowań', requires:['criteria']},
      {id:'decisions', title:'Rekomendacja', subtitle:'Decyzja przełożonego', requires:['observations']},
      {id:'meeting', title:'Rozmowa', subtitle:'Przygotowanie', requires:['decisions']},
      {id:'document', title:'Dokument', subtitle:'Raport i eksport', requires:['decisions']}
    ]
  },
  first: {
    id: 'first', title:'Pierwsza ocena',
    steps: [
      {id:'start', title:'Rozpoczęcie', subtitle:'Dane procesu', requires:[]},
      {id:'criteria', title:'Kryteria', subtitle:'Wybór kompetencji', requires:['case']},
      {id:'observations', title:'Obserwacje', subtitle:'Wskaźniki zachowań', requires:['criteria']},
      {id:'decisions', title:'Rekomendacja', subtitle:'Decyzja przełożonego', requires:['observations']},
      {id:'development', title:'Rozmowa', subtitle:'Ocena i dalsze kroki', requires:['decisions','firstFormal']},
      {id:'document', title:'Dokument', subtitle:'Raport i eksport', requires:['decisions','firstFormal']}
    ]
  }
});
