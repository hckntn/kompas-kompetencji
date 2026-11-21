# Gov.pl-inspired Institutional UI — zastosowanie w Kompas Kompetencji

Źródło: przekazany dokument „Gov.pl-inspired Institutional UI”. Wdrożenie jest niezależnym opracowaniem, bez kopiowania oficjalnych elementów Gov.pl ani kodu Innovation Radar.

## Zakres v0.2
- Zastosowano tokeny wizualne: niebieski `#174A75`, tekst `#202C38`, tekst wtórny `#536374`, tło `#F3F5F7`, białe powierzchnie, granice `#DCE2E8`, akcent `#B71939`.
- Nawigacja i wskazanie aktywnego etapu, kontrast etykiet i pól, kolejność ważności przycisków, spokojny układ kart, czytelne rekomendacje, panel HR i asystent.
- Wykorzystano osobną warstwę stylów CSS, by nie zmieniać logiki oraz umożliwić prosty rollback.
- Dodano focus/skip link, ale nie przeprowadzono pełnego audytu WCAG; nie deklarujemy formalnej zgodności.
- Projekt konkursowy *Kompas Kompetencji* ma działać na komputerze. W przeciwieństwie do Innovation Radar wąskie widoki telefoniczne nie są objęte wsparciem.

## Celowo bez zmian
- Schemat danych, kryteria demonstracyjne, reguła rekomendacji, asystent offline/Ollama, eksporty, formularze i bieżący podział na moduły.

## Co sprawdzić przy kolejnych iteracjach
- Formalny audyt kontrastów i WCAG 2.1 AA.
- Klawiaturowe przechodzenie po rozbudowanych formularzach i widokach tabel.
- Układ przy 125%/150% zoom i szerokościach 768–1440 px.
- Merytoryczna aktualizacja oficjalnych kryteriów w osobnym zadaniu.
