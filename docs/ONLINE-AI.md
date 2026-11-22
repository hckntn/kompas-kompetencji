> **Status 22.11.2026:** Worker wdrożony w Cloudflare, endpoint ustawiony w `data/online-config.js`, dwa rzeczywiste zapytania API otrzymały `HTTP 200` i `fallback: false`. To nie zastępuje testu nowego interfejsu na GitHub Pages ani audytu zgodności prawnej. Repozytorium serwerowe jest osobne i prywatne. Klucz przechowywany jako Cloudflare Secret `GEMINI_API_KEY`.

# Kompas Kompetencji v0.6 — AI Online (wersja konkursowa)

## Co zostało zbudowane

- Przeglądarka: tryb **AI Online** w istniejącym panelu asystenta; osobne, dobrowolne włączenie na czas otwartej karty.
- `js/online-ai.js`: wywołuje wyłącznie wskazany adres proxy HTTPS. Do proxy przekazuje **tylko** obiekt `{ "question": "..." }`, nie pobiera stanu oceny, danych pracowników ani notatek.
- `worker/src/index.mjs`: serwer pośredniczący Cloudflare Worker. Waliduje strukturę żądania i jego długość, blokuje wybrane wzorce danych osobowych, samodzielnie dobiera fragmenty z serwerowej bazy wiedzy, wymusza limit żądań i wywołuje Gemini API.
- `worker/src/knowledge.mjs`: wyselekcjonowane publiczne fragmenty KPRM/ELI i briefu, bez przesyłania dowolnych materiałów przez użytkownika.
- Tryb **Offline** pozostaje w pełni niezależny, a istniejący silnik oceniania nie został zmieniony.

## Istotne ograniczenia i prywatność

**NIE WOLNO używać prototypu do prawdziwej dokumentacji pracowniczej.** To rozwiązanie demonstracyjne z fikcyjnymi danymi.

Treść pytania może być przesłana z przeglądarki do Cloudflare Worker i dalej do Gemini. Zewnętrzny dostawca może przetwarzać dane zgodnie z warunkami swojej usługi. W **darmowym** Gemini API dostawca może używać treści do ulepszania produktów (zob. dokumentację Google). Nie przekazuj żadnych danych osobowych ani poufnych.

Filtry w przeglądarce i Worker są heurystyczne i **nie gwarantują** wykrycia wszystkich danych osobowych. CORS to nie uwierzytelnienie; limity Cloudflare są przybliżone i mogą być obchodzone. Wdrożenie produkcyjne wymaga audytu RODO, uwierzytelnienia, uprawnień, szyfrowania, polityki retencji, oceny dostawcy i ewentualnie infrastruktury instytucjonalnej.

**Źródła pod odpowiedzią wskazują kontekst użyty do wygenerowania wypowiedzi, a nie automatyczną weryfikację każdego jej twierdzenia.** Reguła blokująca niepotwierdzone liczby jest heurystyczna. Model nie modyfikuje ocen pracowników i nie podejmuje decyzji za przełożonego.

## Wdrożenie / konfiguracja bez umieszczania klucza w repozytorium

Do poniższych czynności potrzebne są własne konta Cloudflare i Google AI Studio. Nie udostępniaj klucza w czacie, GitHub, pliku JS ani `wrangler.toml`.

1. W Google AI Studio utwórz klucz Gemini API dla projektu obsługującego darmową kwotę. Sprawdź bieżące limity i dostępność konkretnego modelu na swoim koncie. Nie włączaj płatnego rozliczania, jeśli zamierzasz pozostać przy darmowej wersji.
2. Zainstaluj Node.js 20+ tylko do wdrożenia i uruchom w katalogu `worker/`:

   ```bash
   npx wrangler login
   npx wrangler secret put GEMINI_API_KEY
   npx wrangler deploy
   ```

   Komenda `secret put` pobierze wartość klucza w terminalu; nie należy umieszczać klucza w historii powłoki ani argumentach komendy. `wrangler.toml` zawiera tylko nazwy ustawień i dozwolony origin. Aktualnie wdrożony model to `gemini-3.5-flash-lite`. Przed kolejnym wdrożeniem zweryfikuj aktualną dostępność modelu i kwoty.
3. Skopiuj rzeczywisty URL nowego Workera (bez zgadywania nazwy), np. `https://<name>.<account>.workers.dev`.
4. W głównym projekcie ustaw URL Workera w `data/online-config.js` jako `endpoint`. **Nie wpisuj klucza API.**
5. Przetestuj z lokalnym serwerem HTTP (np. `python -m http.server 8000`) i odpowiednio dostosowanym `ALLOWED_ORIGIN` albo opublikuj kopię testową na HTTPS. Produkcyjny domyślny origin to `https://hckntn.github.io`. Nie ustawiaj `*` ani `null` w konfiguracji CORS.
6. Weryfikuj kolejno: `GET /health`, zgodę, pytanie źródłowe, pytanie bez źródła, pytanie z danymi osobowymi, limit wywołań, brak klucza w kodzie i odpowiedzi.
7. **Dopiero po pomyślnym teście rzeczywistej LLM** opublikuj pakiet aktualizacyjny w głównej gałęzi i sprawdź GitHub Pages. W razie awarii przywróć sprawdzoną wersję v0.4 (lub wcześniejszy commit).

Nie umieszczaj w `worker/` żadnych plików `.dev.vars` ani `.env` podczas publikacji; są ignorowane przez `.gitignore`.

## Wykonane testy

- `node tests/core.test.cjs` — 58 testów istniejącego mechanizmu.
- `node tests/ai.test.cjs` — regresja AI WebGPU (z adapterem testowym).
- `node worker/test.mjs` — ścieżki HTTP, CORS, walidacja schematu, filtrowanie PII, brak źródeł, rate limit, wywołanie Gemini z zamockowanym `fetch`, odmowa przy niepopartych liczbach.
- `python tests/test_online_ui.py` — zgoda użytkownika, izolacja danych procesu, obsługa odpowiedzi, blokowanie wybranych danych osobowych (adapter testowy).
- `python tests/test_e2e.py`, `python tests/test_institutional_ui.py` — regresje procesu i układu.

**Rzeczywisty Gemini API przetestowano 22.11.2026**: dwa ręczne żądania z konsoli przeglądarki zakończyły się HTTP 200, `fallback: false`. Test end-to-end nowego interfejsu na GitHub Pages należy wykonać osobno po publikacji.

## Rollback — zasada Bootstrap Kit zastosowana w konkursowym MVP

1. Nie zastępuj sprawdzonej wersji produkcyjnej nieprzetestowanym kandydatem.
2. Wykonaj test HTTP Workera i end-to-end na osobnym adresie.
3. Zapisz identyfikator commit przed publikacją.
4. Sprawdź opublikowany adres GitHub Pages w prywatnym oknie.
5. W razie problemu przywróć wcześniejszy commit, wyłącz Worker lub zablokuj tryb AI Online, czyszcząc `endpoint` w `data/online-config.js`.

Nie kopiowano kodu ani instrukcji z prywatnego Bootstrap Kit do dystrybuowanego programu. Wybrano ogólne zasady: weryfikacja dowodów, odseparowanie sekretów, bezpieczna odmowa, stan autorytatywny, możliwość wycofania wdrożenia.

## Oficjalna dokumentacja dostawców

- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/docs/text-generation
