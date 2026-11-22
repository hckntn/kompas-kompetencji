# Asystent AI w Kompas Kompetencji v0.5

## Zakres

Asystent ma cztery tryby (od v0.6):

1. **AI Online** — opcjonalne połączenie z Gemini API przez Cloudflare Worker. Wymaga świadomego włączenia, konfiguracji własnego Workera i klucza przechowywanego poza przeglądarką; zob. `ONLINE-AI.md`. Nie zostało przetestowane z rzeczywistym API.
2. **Offline** — bez generacji; bazuje na przygotowanych odpowiedziach i jawnych źródłach. Działa bez sieci.
3. **AI WebGPU** — opcjonalny model **Qwen2.5-0.5B-Instruct-q4f32_1-MLC** przez bibliotekę **WebLLM 0.2.88**. Uruchamiany po świadomym kliknięciu. Biblioteka jest pobierana z CDN, a wagi modelu z zasobów WebLLM/Hugging Face. Inferencja zachodzi lokalnie w przeglądarce. Bez serwera, płatnego API i klucza.
4. **Ollama AI** — zachowany lokalny endpoint `localhost` z poprzedniej wersji (wymaga własnej instalacji i uprawnień CORS).

## Bezpieczeństwo i wiarygodność

- Do WebLLM wysyłamy **tylko tekst pytania i odnalezione fragmenty bazy wiedzy** — nie przekazujemy całej oceny, imienia, danych HR ani stanu aplikacji.
- Za dobór dokumentów odpowiada moduł `js/assistant.js`; gdy baza nie potwierdza odpowiedzi, generacja **nie jest uruchamiana**.
- Odpowiedź modelu to tekst generowany i **nie jest prawnie zweryfikowana**. Odnośniki pod odpowiedzią wskazują źródła kontekstu użytego do generacji, nie potwierdzają automatycznie wszystkich tez LLM.
- Reguła bezpieczeństwa odrzuca wygenerowane w odpowiedziach prawnych wartości liczbowe nieobecne w kontekście i wyświetla wersję źródłową.
- Ocena pracownika i końcowe decyzje pozostają po stronie przełożonego. Model nie może modyfikować oceny ani danych procedury.
- Należy używać wyłącznie fikcyjnych danych. System nie jest narzędziem do prawdziwych ocen kadrowych.
- Baza źródłowa jest **ograniczona do wybranych przepisów i briefu**. Nie jest kompletnym korpusem KPRM; stan prawny trzeba dodatkowo zweryfikować.

## Uruchomienie AI na GitHub Pages

1. Otwórz publikację w aktualnym Chrome / Edge na komputerze z WebGPU.
2. W panelu asystenta wybierz **AI WebGPU**.
3. Kliknij **Uruchom AI w przeglądarce**. Stan pobierania i inicjalizacji jest jawny.
4. Gdy pojawi się potwierdzenie załadowania, zadaj pytanie.
5. Po błędzie GPU, sieci albo pamięci użyj trybu **Offline**.

Pierwsze pobranie może obejmować setki MB danych. Wybrany wariant modelu wymaga około **1 GB pamięci GPU**. Nie ma gwarancji dostępności WebGPU i wystarczającej pamięci na komputerze jurora. Nie ustawiamy trybu AI jako domyślnego. Połączenie z CDN służy pobraniu biblioteki i modelu; sam tekst pytań w trybie WebGPU nie jest wysyłany do serwera AI przez nasz kod.

## Co zostało sprawdzone

- `node tests/core.test.cjs` — dotychczasowa logika oceny i odpowiedzi źródłowe.
- `node tests/ai.test.cjs` — dobór źródeł, odmowa, kontrola nieudokumentowanych liczb, wymóg gotowości modelu.
- `python tests/test_e2e.py` — UI i ścieżki oceny, w tym AI WebGPU na **zamockowanym silniku**, bez pobierania modelu.
- `python tests/test_institutional_ui.py` — wygląd na pięciu szerokościach.

**Nie wykonano pełnej generacji tekstu po pobraniu prawdziwego modelu w WebGPU.** Przed zgłoszeniem działającej LLM do konkursu należy przeprowadzić test na rzeczywistym komputerze i udokumentować wynik.

## Źródła / zależności

- WebLLM — https://github.com/mlc-ai/web-llm (Apache-2.0)
- Lista modeli WebLLM — https://webllm.mlc.ai/models/
- Qwen2.5 0.5B Instruct — https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct (Apache-2.0)
- Baza materiałów źródłowych aplikacji: `data/knowledge.js` (linki ELI/KPRM)

Wdrożenie do urzędu wymaga audytu prawa, ochrony danych osobowych, modeli, komponentów, integralności pobieranych zasobów i testowania błędów generacji.
