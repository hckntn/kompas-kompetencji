# Test report — Kompas v0.4 (2026-11-21)

- `node tests/core.test.cjs`: **PASS, 58 checks** — obie ścieżki, obowiązkowe pięć elementów, skala 3/5/7, średnia, przypadki pozytywne/negatywne, egzamin i wyjątki, terminowość sprawozdania, uzasadnienie, migracja stanów, regresja okresowej, odpowiedzi źródłowe.
- `python tests/test_e2e.py`: **PASS** — end-to-end okresowa i pierwsza, blokady formalne, eksport JSON/TXT, panel HR, zapis i odzysk sesji, linki źródłowe, renderowanie PDF, brak błędów JS.
- `python tests/test_institutional_ui.py`: **PASS** — szerokości 1600/1280/900/768/390 px, brak poziomego przepełnienia, style, keyboard skip link, wydruk, brak błędów JS.
- `examples/first-sample-report.pdf`: przetestowano renderowanie na **jednej stronie A4**; wydruk wizualnie czytelny z polskimi znakami (źródło: automatyczny Chromium print).

**Granice weryfikacji:** bez testu uruchomienia przez `file://` w sandboxie; brak pełnego audytu WCAG; brak pełnej walidacji prawnej załączników 1/2/3; brak testu prawdziwego Ollama LLM w środowisku użytkownika. Testy stosują dane fikcyjne.
