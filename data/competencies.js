/* Demonstracyjny model kompetencji. NIE jest oficjalnym modelem KPRM. */
window.KOMPAS_CATALOG = Object.freeze({
  schemaVersion: 'hybrid-first-legal-0.4',
  levels: [
    {value:1, name:'Wymaga wsparcia', short:'Rzadko', description:'Zachowanie obserwowane sporadycznie; potrzebne wsparcie.'},
    {value:2, name:'Rozwijający się', short:'Czasami', description:'Zachowanie pojawia się, lecz nie jest jeszcze konsekwentne.'},
    {value:3, name:'Samodzielny', short:'Regularnie', description:'Zachowanie obserwowane regularnie i samodzielnie.'},
    {value:4, name:'Wzorcowy', short:'Konsekwentnie', description:'Zachowanie konsekwentne; pozytywny wpływ na innych.'}
  ],
  competencies: [
    {
      id:'komunikacja', name:'Komunikacja', icon:'message-square', category:'Współpraca',
      description:'Przekazywanie informacji w sposób zrozumiały i adekwatny do odbiorcy.',
      indicators:[
        'Przekazuje istotne informacje jasno i w odpowiednim czasie.',
        'Sprawdza, czy rozmówca prawidłowo zrozumiał ustalenia.',
        'Dostosowuje formę komunikatu do potrzeb odbiorcy.'
      ]
    },
    {
      id:'wspolpraca', name:'Współpraca', icon:'users', category:'Współpraca',
      description:'Koordynacja działań i dzielenie się informacją w zespole.',
      indicators:[
        'Uzgadnia działania z osobami zaangażowanymi w zadanie.',
        'Dzieli się potrzebną wiedzą i materiałami.',
        'Konstruktywnie reaguje na różnice zdań.'
      ]
    },
    {
      id:'analityka', name:'Myślenie analityczne', icon:'chart', category:'Realizacja zadań',
      description:'Analiza informacji, rozpoznawanie zależności i wnioskowanie.',
      indicators:[
        'Rozdziela fakty od założeń przed podjęciem decyzji.',
        'Weryfikuje istotne dane z więcej niż jednego punktu widzenia.',
        'Przedstawia logiczne uzasadnienie rekomendacji.'
      ]
    },
    {
      id:'organizacja', name:'Organizacja pracy i orientacja na osiąganie celów', icon:'calendar', category:'Realizacja zadań',
      description:'Planowanie, priorytetyzacja i terminowa realizacja zobowiązań.',
      indicators:[
        'Wyznacza priorytety z uwzględnieniem terminów.',
        'Sygnalizuje ryzyka i przeszkody z wyprzedzeniem.',
        'Monitoruje postępy i dostosowuje plan pracy.'
      ]
    },
    {
      id:'rzetelnosc', name:'Rzetelność', icon:'shield', category:'Pierwsza ocena',
      description:'Element oceny z § 2 ust. 1 pkt 1 lit. a rozporządzenia z 23.07.2015. Zachowania poniżej są przykładowymi pytaniami pomocniczymi, a nie urzędowym opisem z załącznika.',
      indicators:[
        'Czy wykonuje zadania zgodnie z obowiązującymi standardami i procedurami?',
        'Czy dba o jakość i weryfikuje rezultaty swojej pracy?',
        'Czy dotrzymuje ustaleń i terminów?'
      ]
    },
    {
      id:'wiedza', name:'Wykorzystywanie wiedzy i doskonalenie zawodowe', icon:'book', category:'Pierwsza ocena',
      description:'Element oceny z § 2 ust. 1 pkt 1 lit. b rozporządzenia z 23.07.2015. Poniższe zachowania są pomocnicze, nie stanowią urzędowych wskaźników.',
      indicators:[
        'Czy korzysta z odpowiedniej wiedzy podczas wykonywania zadań?',
        'Czy samodzielnie poszukuje informacji potrzebnych do pracy?',
        'Czy wykorzystuje zdobyte umiejętności do usprawniania pracy?'
      ]
    },
    {
      id:'zarzadzanie', name:'Zarządzanie zespołem', icon:'compass', category:'Kierowanie',
      description:'Delegowanie, wspieranie rozwoju i udzielanie informacji zwrotnej.',
      indicators:[
        'Formułuje jasne oczekiwania i deleguje odpowiedzialność.',
        'Udziela konkretnej informacji zwrotnej o zachowaniach.',
        'Wspiera rozwój samodzielności członków zespołu.'
      ]
    }
  ],
  firstRequired: ['rzetelnosc','wiedza','organizacja','komunikacja','wspolpraca'],
  tracks: {
    periodic:{id:'periodic', name:'Ocena okresowa', short:'Okresowa', description:'Demonstracyjna ścieżka oceny okresowej członka korpusu służby cywilnej.', defaultCompetencies:['komunikacja','wspolpraca','analityka','organizacja']},
    first:{id:'first', name:'Pierwsza ocena', short:'Pierwsza', description:'Pierwsza ocena: pięć elementów i formalna skala 3/5/7 według Dz.U. 2015 poz. 1144; opisy zachowań są pomocnicze.', defaultCompetencies:['rzetelnosc','wiedza','organizacja','komunikacja','wspolpraca']}
  }
});
