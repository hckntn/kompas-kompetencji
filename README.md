# Kompas Kompetencji

**Prototyp konkursowy HackNation 2026 — zadanie „Kompas Kompetencji” (Ministerstwo Cyfryzacji).**

[**Uruchom demonstrację w przeglądarce**](https://hckntn.github.io/kompas-kompetencji/)

Kompas Kompetencji to aplikacja wspierająca przełożonych w prowadzeniu ocen pracowników służby cywilnej. Łączy uporządkowany proces, pomocnicze wskaźniki zachowań, reguły oceny, przygotowanie rozmowy oraz roboczą dokumentację. **Oceny cząstkowe wybiera przełożony — aplikacja nie zastępuje jego decyzji.**

> **Status: v0.4 — działający prototyp demonstracyjny.** Nie jest to oficjalny system administracji publicznej ani narzędzie dopuszczone do oceny rzeczywistych pracowników. Wszystkie dane przykładowe są fikcyjne.

![Widok pierwszej oceny](examples/first-path.png)

## Jak przetestować demo

1. Otwórz [wersję online](https://hckntn.github.io/kompas-kompetencji/) na komputerze.
2. Kliknij **„Wczytaj przykład pierwszej oceny”**.
3. Przejdź przez sześć etapów: **Rozpoczęcie → Kryteria → Obserwacje → Rekomendacja / decyzja → Rozmowa → Dokument**.
4. Sprawdź pięć elementów pierwszej oceny i oceny cząstkowe **3 / 5 / 7**, które wybiera przełożony.
5. Zapoznaj się z wynikiem i warunkami formalnymi, a następnie wygeneruj **raport roboczy** (druk / zapis do PDF albo eksport JSON/TXT).

Przycisk **„Wczytaj przykład okresowy”** uruchamia drugą ścieżkę, która w v0.4 pozostaje **demonstracyjna**.

## Co działa w wersji v0.4

- **Workflow Engine** — prowadzenie przez etapy, walidacja przejść, stan procesu i historia techniczna.
- **Pierwsza ocena** — pięć elementów wskazanych w rozporządzeniu z 23 lipca 2015 r. (Dz.U. 2015 poz. 1144).
- **Formalne oceny 3/5/7** — oddzielne od demonstracyjnej skali obserwacji 1–4; obliczanie średniej i sprawdzanie wybranych warunków wyniku.
- **Decyzja przełożonego** — wybór ocen cząstkowych, informacje dotyczące egzaminu i sprawozdania, uzasadnienie wyniku negatywnego.
- **Wsparcie rozmowy**, roboczy raport PDF oraz eksport JSON i TXT.
- **Demonstracyjny panel HR** i asystent informacyjny oparty na przygotowanych odpowiedziach i źródłach ELI/KPRM.
- **Praca lokalna** — HTML, CSS i JavaScript bez serwera i instalacji zależności w podstawowym scenariuszu.

## Ważne ograniczenia

- Opisy zachowań oraz skala obserwacji 1–4 są **pomocnicze i demonstracyjne**; nie zastępują oficjalnego modelu wskaźników.
- Aplikacja nie tworzy jeszcze oficjalnych wzorów arkusza pierwszej oceny i formularza sprawozdania. PDF jest **raportem roboczym**, nie dokumentem do akt osobowych.
- **Ocena okresowa nie jest jeszcze w pełni zgodna z wymaganiami rozporządzenia z 2016 r.** — służy do demonstracji przebiegu procesu.
- Podstawowy asystent działa w trybie **odpowiedzi źródłowych offline, bez generatywnej LLM**. Integracja z lokalną Ollama jest opcjonalna i nie stanowi zweryfikowanego doradztwa prawnego.
- Nie ma produkcyjnego systemu uprawnień, zabezpieczonej bazy kadrowej, integracji EZD/QNT ani pełnej obsługi wyjątków proceduralnych.
- **Nie należy wprowadzać prawdziwych danych osobowych.** Stan demonstracji jest przechowywany w sesji przeglądarki.

Szczegółowa lista wdrożonych funkcji i braków znajduje się w [docs/DOMAIN-COMPLIANCE.md](docs/DOMAIN-COMPLIANCE.md) (obecnie dokument roboczy w języku rosyjskim).

## Uruchomienie lokalne

1. Wybierz w repozytorium **Code → Download ZIP** i rozpakuj archiwum.
2. Otwórz **index.html** na komputerze w Chrome, Edge lub Firefox.
3. Uruchom przygotowany scenariusz pierwszej lub okresowej oceny.

Podstawowe działanie nie wymaga internetu, konta ani Node.js. Ollama to opcjonalny tryb wymagający osobnej konfiguracji lokalnej.

## Architektura

Projekt używa **vanilla JavaScript, HTML i CSS**, bez frameworka i procesu budowania. Logika domenowa, wykonywanie procedur i interfejs zostały rozdzielone:

| Plik / katalog | Rola |
| --- | --- |
| `data/first-rules.js` | Wybrane formalne reguły pierwszej oceny |
| `data/procedures.js`, `data/competencies.js` | Definicje ścieżek i kryteriów |
| `js/workflow.js`, `js/validation.js`, `js/assessment.js`, `js/session.js` | Silnik procesu |
| `js/assistant.js` | Asystent źródłowy i opcjonalny tryb Ollama |
| `js/app.js`, `assets/` | Interfejs Gov.pl-inspired Institutional UI |

Dokumentacja, scenariusz demo i historia zmian: katalog `docs/` i [CHANGELOG.md](CHANGELOG.md).

## Testy

Repozytorium zawiera testy jednostkowe i przeglądarkowe:

```bash
node tests/core.test.cjs
python tests/test_e2e.py
python tests/test_institutional_ui.py
```

Narzędzia testowe wymagają Node.js oraz środowiska Python/Playwright/Chromium; nie są potrzebne do uruchomienia samej aplikacji.

## Źródła

- [ELI — Dz.U. 2015 poz. 1144, pierwsza ocena](https://eli.gov.pl/api/acts/DU/2015/1144/text.html)
- [KPRM — Pierwsza ocena i służba przygotowawcza](https://www.gov.pl/web/sluzbacywilna/pierwsza-ocena)
- [ELI — Dz.U. 2016 poz. 470, ocena okresowa](https://eli.gov.pl/api/acts/DU/2016/470/text.html)
- [KPRM — Ocena okresowa](https://www.gov.pl/web/sluzbacywilna/ocena-okresowa)

**Kolejne kroki:** integracja oficjalnych wskaźników i formularzy, pełna ścieżka oceny okresowej, weryfikowalny asystent LLM z odwołaniami do źródeł oraz model bezpieczeństwa i uprawnień.

Materiały konkursowe: [opis wyzwania](references/opis-wyzwania.pdf), [regulamin](references/regulamin-zadania.pdf).
