# AI Online — QA / regression v0.6.4

Status: **kandydat**. Zmiany nie zostały automatycznie opublikowane.

## Poprzednie defekty (wykryte 22.11.2026)

1. Klient i Worker wykrywały część zwykłych zwrotów typu „pracownika służby cywilnej” jako dane osobowe: dopasowanie nazwisk błędnie używało flagi `i`.
2. Klient wykonywał wyszukiwanie Offline przed każdą próbą Online i nie wysyłał pytania, jeżeli lokalna baza nie dopasowała źródła.
3. Worker nie rozpoznawał zwrotu „Co oznaczają oceny 3, 5 i 7 w procedurze pierwszej oceny?” oraz pytań porównujących obie procedury.
4. Komunikat 422 łączył brak źródła z wykryciem danych osobowych, a odpowiedź zastępcza Offline mogła mylić obie procedury.
5. UI nie informował wyraźnie, że pytanie zostało zablokowane jeszcze przed wysłaniem.

## Przewidziane zachowanie

- P1: pięć elementów pierwszej oceny.
- P2: skala 3/5/7.
- P3: wynik pozytywny / negatywny.
- P2+O2+B2: porównanie pierwszej i okresowej oceny oraz skal.
- B3: pięć praktycznych pytań do rozmowy i plan rozmowy.
- B1: ostateczna decyzja kierownika.
- B4: nie należy wpisywać PESEL ani danych poufnych do demonstracji.
- Bez wskazania rodzaju oceny: odmowa i prośba o sprecyzowanie procedury.
- Brak źródła: brak fikcyjnego przepisu.

## Limity i prywatność

Rate limit jest przybliżony, wbudowany w Cloudflare: 4 zapytania / 60 s / IP i 30 / 60 s ogółem. Testuj pytania pojedynczo i uwzględniaj limit. Zapytania zawierające rzeczywiste nazwiska, e-mail lub PESEL są blokowane best-effort; filtr nie gwarantuje usunięcia wszystkich danych osobowych. Korzystaj wyłącznie z fikcyjnych danych.

## Testy

```sh
node test_regressions.mjs         # w repo Workera
node test.mjs                     # w repo Workera
node tests/core.test.cjs          # w repo aplikacji
node tests/demo.test.cjs
python tests/test_ai_regressions_v064.py
python tests/test_assistant_stability.py
python tests/test_connected_ui.py
python tests/test_e2e.py
```

Po opublikowaniu wykonaj osobny test rzeczywistego Gemini API i sprawdź odpowiedzi merytorycznie. **Poprawność prawna nie jest gwarantowana samym statusem HTTP 200.**
