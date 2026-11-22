# Wdrożenie v0.6.2 — Kompas Kompetencji (22.11.2026)

**Serwer:** `https://kompas-kompetencji-ai.hckntn.workers.dev` (publiczny URL; nie jest kluczem). Model na serwerze: `gemini-3.5-flash-lite`. Sekret `GEMINI_API_KEY` pozostaje wyłącznie w Cloudflare.

**Przed publikacją:** potwierdzono `GET /health` (`configured: true`) i dwa rzeczywiste `POST /api/ask` wykonane z przeglądarki otwartej na `https://hckntn.github.io` (200, `fallback: false`). Nie testowano jeszcze całości poprzez nowe UI.

## Aktualizacja z publicznej v0.4

1. Przygotuj możliwość rollbacku (zapisz SHA bieżącego commitu `main`); nie usuwaj starego commitu.
2. Z ZIP `Kompas-Kompetencji-v0.6.2-GitHub-ready.zip` umieść zawartość w katalogu głównym repozytorium `hckntn/kompas-kompetencji` (w tym `index.html`, `data/`, `js/`, `assets/` itd.). **Nie umieszczaj ZIP jako pojedynczego pliku, nie twórz dodatkowego katalogu nadrzędnego.**
3. Skontroluj, że `data/online-config.js` wskazuje wyłącznie adres Workera; nie umieszczaj żadnego sekretu w GitHub.
4. Po zakończeniu wdrożenia GitHub Pages otwórz aplikację w nowej prywatnej karcie i przetestuj `Asystent` → `AI Online` → `Rozumiem i włączam AI Online` → pytanie: `Jakie elementy obejmuje pierwsza ocena?`. Sprawdź odpowiedź i źródło P1.
5. Następnie zapytaj: `Jak przygotować rozmowę z pracownikiem, który ma trudności ze współpracą w zespole?` (wyłącznie fikcyjny przypadek); sprawdź źródło B3.
6. Sprawdź scenariusze pozytywny/negatywny i `Przywróć sesję`; druk/eksport; przełączenie na Offline.
7. Przy awarii: powrót do wcześniejszego commitu v0.4 lub wyczyszczenie `endpoint` w `data/online-config.js` (przywróci blokadę Online AI).

**Ważne:** bezpłatny API i publiczny Worker nie są przeznaczone do rzeczywistych danych kadrowych. CORS nie stanowi autoryzacji; zachowaj limity i monitoruj zużycie konta.
