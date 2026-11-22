# Focused UX — wariant do sprawdzenia przed publikacją

Wprowadzone zmiany ograniczają równoczesną liczbę elementów w obszarze roboczym. Nie zmieniają żadnych reguł oceniania ani danych stanu. Jest to lokalna wersja kandydacka; publiczny serwis nie został przez tę iterację zaktualizowany.

## Co zmieniono

- Asystent wiedzy jest domyślnie zwinięty. Przycisk **Asystent** w prawym górnym rogu otwiera panel, a przycisk `×` lub klawisz Escape zamyka go. W węższych widokach jest wysuwanym panelem, nie rozsuwa całego formularza.
- Zbędne okruszki nawigacyjne usunięto: lewa lista etapów oraz `ETAP 01 / 06` pozostają widoczne.
- Duży komunikat zastąpiono krótkim objaśnieniem **Szczegóły**. Informacja dla pierwszej oceny jest odrębna od komunikatu o demonstracyjnym charakterze oceny okresowej.
- Karty wyboru rodzaju oceny są mniej wysokie; pozostawiono ich opisy i pełne nazwy.
- **Scenariusze testowe** nadal znajdują się w jednym menu. Wybór scenariusza `Asystent wiedzy` automatycznie otwiera panel.
- Tekst pytania wpisany do asystenta pozostaje w polu po zamknięciu i ponownym otwarciu panelu. Nie jest dodawany do danych oceny.

## Wynik porównania, 1600 × 900

| Parametr | Poprzedni interfejs | Focused UX |
| --- | ---: | ---: |
| Szerokość obszaru `main` | 1068 px | 1350 px |
| Początek formularza na ekranie | 712 px | 578 px |
| Wysokość komunikatu o prototypie | 103 px | 57 px |
| Asystent widoczny przy otwarciu | Tak | Nie, otwierany na żądanie |

Wartości pochodzą z pomiaru DOM w Chromium 1600 × 900. **Nie są pomiarem szybkości pracy ani wynikiem badań użytkowników.**

![Układ po uproszczeniu — panel zamknięty](../examples/ux-focused-closed.png)

![Układ z otwartym asystentem](../examples/ux-focused-open.png)

## Testy regresyjne

```bash
node tests/core.test.cjs
node tests/demo.test.cjs
python tests/test_focused_ux.py
python tests/test_demo_ui.py
python tests/test_institutional_ui.py
python tests/test_e2e.py
```

Sprawdzono w Chromium: otwieranie i zamykanie asystenta, Escape, focus, zachowanie tekstu pytania, obie wersje komunikatu, pięć fikcyjnych scenariuszy oraz rozmiary 1600, 1280, 900 i 768 px. Blokada wersji smartfonowej pozostaje bez zmian.

## Ograniczenia

Wersja nie zmienia zgodności prawnej oceny okresowej, oficjalnych formularzy, modelu wskaźników ani weryfikacji odpowiedzi LLM. Dla produkcyjnych danych kadrowych nadal nie ma uwierzytelniania i izolacji użytkowników. Nie należy używać danych prawdziwych pracowników.
