## v0.6.2 — konfiguracja opublikowanego AI Online (22.11.2026)

- Ustawiono zweryfikowany adres Cloudflare Worker w `data/online-config.js`, bez klucza API w kodzie.
- Dwa rzeczywiste testy API (pierwsza ocena i przygotowanie rozmowy) zwróciły 200, `fallback: false`, z identyfikatorami źródeł.
- Zsynchronizowano model archiwalnego Workera do `gemini-3.5-flash-lite` (produkcyjny Worker pozostaje w prywatnym repozytorium).
- Bez zmian w Workflow Engine, formularzach, scenariuszach demo ani logice AI.
- Status: **gotowe do testu przeglądarkowego po wdrożeniu**; nie oznacza to audytu poprawności prawnej. Po publikacji wymagany jest oddzielny test publicznego interfejsu GitHub Pages.

## v0.6.2 — Focused UX (21.11.2026)

- Ukryto panel asystenta przy pierwszym uruchomieniu; dostępny z przycisku w nagłówku, z obsługą klawisza Escape i zachowaniem niewysłanego pytania.
- Usunięto powtarzane okruszki nawigacyjne, pozostawiono lewą nawigację i wskaźnik etapu.
- Zastąpiono rozbudowany baner krótkim komunikatem z rozwijanymi szczegółami; osobne treści dla dwóch procedur.
- Skrócono karty wyboru oceny; menu Scenariusze testowe pozostawiono bez dodatkowych stron.
- Nie zmieniano modułów domenowych, AI API, session storage ani publicznego GitHub Pages.
- W Chromium 1600×900 obszar główny wzrósł z 1068 do 1350 px, a formularz zaczyna się 134 px wyżej. Zob. `docs/UX-FOCUSED.md`.
- Nowe testy UI w `tests/test_focused_ux.py`; dotychczasowe testy dostosowano do panelu otwieranego na żądanie.

## v0.6.1 — Scenariusze testowe (21.11.2026)

- Zastąpiono dwa przyciski przykładów jednym menu **Scenariusze testowe**; bez nowej nawigacji.
- Dodano pięć fikcyjnych scenariuszy: wynik pozytywny, negatywny, brak danych, ścieżka okresowa, asystent źródłowy.
- Zastosowano istniejący silnik ocen i walidacji (bez zmiany reguł kalkulacji).
- Przed demonstracją zachowywana jest kopia sesji w `sessionStorage`; przywracanie po potwierdzeniu użytkownika.
- Dodano testy w `tests/demo.test.cjs` i `tests/test_demo_ui.py`, przewodnik dla jury i zrzut ekranu menu.
- Bez wdrażania usługi AI, bez zmian w publicznym GitHub Pages.

# Changelog

## v0.6 — Online AI candidate (2026-11-21)

- Dodano osobny tryb **AI Online** wymagający wyraźnego włączenia przez użytkownika.
- Dodano `js/online-ai.js` oraz `data/online-config.js` z pustym adresem Workera (brak automatycznych zapytań API).
- Utworzono bezstanowy Cloudflare Worker proxy: Gemini API, tajny klucz, walidacja struktury żądania, ograniczanie danych, kontrola źródeł, CORS oraz limity żądań.
- Do zewnętrznego AI nie wysyłamy automatycznie danych oceny, komentarzy, dokumentów ani HR.
- Dodano testy nowej granicy API, opt-in i mechanizmu fallback; zachowano wszystkie dotychczasowe ścieżki i UI.
- Publiczny projekt GitHub Pages **nie został zaktualizowany**; realny Gemini API wymaga wdrożenia Workera i testu klucza.
- Dokumentacja: `docs/ONLINE-AI.md`, instrukcja rollback.

---

## v0.5 — AI WebGPU (21.11.2026)

- Dodano opcjonalny model generatywny WebLLM / Qwen2.5 0.5B uruchamiany w przeglądarce po aktywacji użytkownika; bez płatnych API lub serwera.
- Dodano jawny status ładowania, informację o wymaganiach sprzętowych i automatyczny powrót do odpowiedzi źródłowej w razie błędu.
- Dodano bramkę źródeł przed generacją, ograniczenie nowych liczb w odpowiedziach prawnych oraz oznaczenia odpowiedzi LLM jako niezweryfikowanych.
- Zachowano tryby Offline i Ollama oraz niezmieniony Workflow Engine i Institutional UI.
- Testy jednostkowe AI i test integracji UI na zastępczym adapterze. Pełne uruchomienie modelu WebGPU na GPU pozostaje do sprawdzenia.

# Historia zmian

## v0.4 — First Assessment Domain Rules (2026-11-21)
- Zweryfikowano publiczne przepisy ELI Dz.U. 2015 poz. 1144 (§ 2–4, 6–10) i informację KPRM o formularzach.
- Dodano pięć obowiązkowych elementów pierwszej oceny; ich nazwy pochodzą z § 2, zaś przykładowe wskaźniki nadal są pomocnicze.
- Dodano `data/first-rules.js`: punkty 3/5/7, średnia, warunki oceny pozytywnej / negatywnej, wyjątki egzaminacyjne i wymagane uzasadnienie negatywnej oceny.
- Oddzielono oceny cząstkowe przełożonego od pomocniczej czterostopniowej skali obserwacji.
- Dodano odpowiednie pola formalne, roboczy PDF/JSON/TXT i źródłowe pytania o zasady.
- Przystosowano migrację v2→v3: stare zakończone oceny pierwsze pozostają zapisane jako projekty wymagające ponownego zatwierdzenia.
- Zmieniono krok planu rozwoju na rozmowę; obowiązek wpisania planu nie jest już błędnie przedstawiany jako warunek pierwszej oceny.
- Zachowano okresową ścieżkę jako demonstracyjną, bez przypisywania jej skali prawnej.
- Usunięto poziomy overflow przy dwóch przyciskach demo na wąskim desktopie; zachowano Institutional UI.
- Przeprowadzono 58 testów jednostkowych, 2 scenariusze E2E, testy pięciu szerokości i kontrolę PDF.
- Nie skopiowano kodu Script-mod-flow ani Innovation Radar.

## v0.3 — Workflow Engine (2026-11-21)
- Dodano osobne definicje kroków dla pierwszej i okresowej oceny w `data/procedures.js`.
- Wyodrębniono moduły `assessment.js`, `validation.js`, `workflow.js`, `session.js` z dotychczasowego małego `engine.js`.
- Zachowano dotychczasowy interfejs `window.KOMPAS_ENGINE` jako warstwę kompatybilności.
- Włączono kontrolę wszystkich wymaganych bramek przy przejściu do odległego kroku i zakończeniu procesu.
- W ścieżce pierwszej oceny zastosowano demonstracyjny krok planu rozwoju z walidacją pola działań (nie jest wymogiem KPRM).
- Dodano objaśnienie deterministycznej propozycji, wersjonowanie konfiguracji i ograniczony dziennik zdarzeń technicznych, bez treści danych osobowych.
- Zmieniono wersję stanu na 2 z migracją v1 bez zmiany klucza sesji; zachowano dotychczasowe dane użytkownika.
- Poprawiono zapis notatek obserwacji do właściwego pola `observations`; migracja odzyskuje dawne notatki omyłkowo zapisane w `observation`.
- Dodano testy silnika i rozszerzono E2E o obie ścieżki oraz trwałość notatek.
- Zachowano wygląd Institutional UI v0.2, skale demonstracyjne, asystenta, eksport i możliwość pracy bez serwera.

## v0.2 — Gov.pl-inspired Institutional UI (2026-11-21)
- Dodano osobny plik `assets/institutional-ui.css` wczytywany po istniejącym `styles.css`.
- Zastosowano spokojną, instytucjonalną paletę inspirowaną polskimi serwisami publicznymi.
- Uporządkowano typografię, hierarchię, focus, przyciski, formularze, nawigację, widok HR i panel asystenta.
- Zachowano układ pracy z oceną, sześć etapów, wszystkie algorytmy, źródła i eksporty.
- Dodano skrót klawiaturowy `Przejdź do treści` (link ujawniany przy focus) oraz cel w głównej części aplikacji.
- Zachowano blokadę wersji smartfonowej zgodnie z wymaganiem zadania.

## v0.1 — Lokalny MVP
- Działający demonstracyjny przebieg oceny z lokalną bazą wiedzy oraz eksportem.
