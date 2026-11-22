/* Publiczny katalog scenariuszy. Opisy informują o oczekiwaniach, nie o wykonanych testach. */
window.KOMPAS_DEMO_SCENARIOS = Object.freeze([
  Object.freeze({id:'first-positive',label:'Pierwsza ocena — pozytywna',description:'Pięć ocen cząstkowych, komplet warunków.',expected:'Wynik pozytywny po weryfikacji warunków § 10.',track:'first'}),
  Object.freeze({id:'first-negative',label:'Pierwsza ocena — negatywna',description:'Dwie oceny po 3 pkt, choć średnia wynosi 5,4.',expected:'Wynik negatywny; przed zakończeniem wymagane uzasadnienie.',track:'first'}),
  Object.freeze({id:'missing-fields',label:'Brak wymaganych danych',description:'Niekompletne dane osoby oceniającej i pracownika.',expected:'Walidacja blokuje przejście do kolejnego etapu.',track:'first'}),
  Object.freeze({id:'periodic-demo',label:'Ocena okresowa — demo',description:'Fikcyjna ścieżka okresowa z obserwacjami.',expected:'Demonstracja procesu; algorytm nie jest oficjalną skalą 1/3/5/7/9.',track:'periodic'}),
  Object.freeze({id:'assistant-sources',label:'Asystent wiedzy',description:'Pytania o przepisy i odmowa bez źródła.',expected:'Odpowiedź z linkiem do źródła albo komunikat o braku podstawy.',track:'first',questions:Object.freeze(['Jakie elementy pierwszej oceny?', 'Kiedy pierwsza ocena jest pozytywna?', 'Jaki jest dokładny termin odwołania?'])})
]);
