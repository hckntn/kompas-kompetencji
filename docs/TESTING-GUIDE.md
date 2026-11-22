# Scenariusze testowe — przewodnik dla jury

**Kompas Kompetencji · dane fikcyjne · wersja demonstracyjna**

## Jak rozpocząć

1. Otwórz aplikację w przeglądarce na komputerze.
2. W kroku **Rozpoczęcie** naciśnij **Scenariusze testowe** (jeden przycisk, zamiast dwóch dotychczasowych skrótów).
3. Wybierz przykład i potwierdź załadowanie. Poprzednia sesja jest zachowywana **tylko w tej karcie** w `sessionStorage`.
4. Samodzielnie przechodź kroki, zmieniaj oceny i obserwuj działanie walidacji.
5. Naciśnij **Przywróć sesję**; po potwierdzeniu wrócisz do stanu sprzed pierwszego scenariusza.

**Ważne:** Przykłady wprowadzają jedynie **dane wejściowe**. Wynik oblicza aktualny silnik, a blokady wynikają z aktualnych reguł walidacji. Przycisk nie symuluje pomyślnego przejścia testu.

## Pięć scenariuszy

| Scenariusz | Co sprawdzić | Oczekiwane zachowanie |
|---|---|---|
| **Pierwsza ocena — pozytywna** | Wybierz przykład, przejdź do ocen cząstkowych | Pięć ocen; spełnione warunki, wynik pozytywny. Można przejść do raportu roboczego. |
| **Pierwsza ocena — negatywna** | Zwróć uwagę na dwie oceny 3 przy średniej **5,4** | Wynik negatywny mimo średniej ≥ 5. Przejście do następnego kroku blokuje brak uzasadnienia. Wprowadź uzasadnienie, by kontynuować. |
| **Brak wymaganych danych** | Kliknij **Dalej** bez uzupełnienia danych | Komunikat o brakującym pracowniku, stanowisku i osobie oceniającej; proces pozostaje na tym samym etapie. |
| **Ocena okresowa — demo** | Przejdź przez etapy i podgląd wyników | Działa mechanika procedury; skala i model pozostają przykładowe. **Nie są to zgodne z prawem arkusze A/B/C**. |
| **Asystent wiedzy** | Zadaj pytania widoczne w pasku scenariusza | Asystent offline podaje sprawdzony fragment wraz ze źródłem lub odmawia bez wystarczającej podstawy. |

## Przykładowe pytania do asystenta

- `Jakie elementy pierwszej oceny?` — oczekiwana odpowiedź ze wskazaniem § 2 rozporządzenia i źródła ELI.
- `Kiedy pierwsza ocena jest pozytywna?` — oczekiwane warunki § 10.
- `Jaki jest dokładny termin odwołania?` — przy braku odpowiedniego źródła asystent nie powinien zgadywać.

W scenariuszu **Asystent wiedzy** panel otwiera się automatycznie, w bezpiecznym trybie **Offline**. W pozostałych sytuacjach panel można otworzyć przyciskiem **Asystent** w nagłówku. Przejście do trybu AI Online wymaga oddzielnej konfiguracji oraz zgody użytkownika; **nie jest konieczne do sprawdzenia tych przykładów**.

## Prywatność i bezpieczny powrót

- Wszystkie fikcyjne rekordy powstają w przeglądarce, bez wysyłania do serwera aplikacji.
- Zmiana scenariusza **nie nadpisuje** pierwotnej kopii sesji.
- **Przywróć sesję** przywraca dane sprzed wejścia do trybu demonstracyjnego; zmiany dokonane w testowym scenariuszu zostaną zastąpione — pojawia się potwierdzenie.
- Nie wprowadzaj rzeczywistych danych kadrowych. Przeglądarka przechowuje dane sesji lokalnie.

## Granice demonstracji

- Oficjalne opisy elementów/behawioralne wskaźniki z załączników nie są w pełni wdrożone.
- Wydruk PDF jest **raportem roboczym**, a nie urzędowym formularzem pierwszej oceny.
- Ocena okresowa pozostaje demonstracyjna; brak pełnej implementacji kryteriów A/B/C i skali 1/3/5/7/9.
- Online AI nie jest uruchamiane automatycznie, a jego zgodność prawna wymaga odrębnej oceny.
