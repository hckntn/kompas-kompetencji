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
