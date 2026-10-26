# Asystent AI w prototypie (v10)

Domyślnie model jest **wyłączony**, a asystent działa regułowo, jak w v8 i v9. Włączenie to wybór w menu: **Asystent AI (ustawienia)**, czyli `#/ai`.

## Jak to działa

Rozmowa ma trzy poziomy. Najpierw ścieżki deterministyczne (portfel, OC, pismo, zdarzenie, firma, KRS, NIP) i trwające kreatory, bo tam nie chcemy zgadywania. Potem model, ale tylko dla pytań, które nie pasują do żadnej reguły albo są dłuższe niż sześć słów. Na końcu zwykłe podpowiedzi z katalogu, gdy model jest wyłączony, przekroczono limit albo połączenie zawiodło.

Model nie wykonuje niczego. Dostaje pytanie, kilka ostatnich wypowiedzi, wiek i miasto wybranej osoby oraz listę dozwolonych celów z katalogu i scenariuszy rozmowy. Odpowiada JSON-em `{tekst, akcja}`. Przeglądarka sprawdza, czy proponowana akcja jest na liście, i pokazuje przycisk „Tak, przejdź dalej” albo „Uruchom scenariusz”. Wymyślony adres albo `javascript:` jest odrzucany. Tekst odpowiedzi jest wstawiany jako zwykły tekst, nie jako HTML.

Przed wysłaniem z pytania znikają PESEL, NIP, numer rachunku, telefon i e-mail. Limit to 30 zapytań na sesję (przycisk „Zeruj licznik”).

## Tryb zalecany: pośrednik Cloudflare Worker

Plik `worker/worker.js` trzyma klucz w sekrecie, wpuszcza tylko żądania z jednego adresu (`ALLOWED_ORIGIN`), ogranicza rozmiar i liczbę zapytań, a prompt systemowy ma po swojej stronie. Wdrożenie:

1. `cd worker && npx wrangler deploy` (konto Cloudflare jest darmowe).
2. W `wrangler.toml` ustaw `LLM_BASE` i `LLM_MODEL` według dokumentacji wybranego dostawcy (endpoint zgodny z OpenAI) albo odkomentuj `[ai]` i użyj Workers AI.
3. `npx wrangler secret put LLM_KEY` i wklej klucz.
4. W aplikacji: Asystent AI → „Przez pośrednika” → adres Workera → „Zapisz i sprawdź”.

Worker zwraca 403 dla obcych źródeł, 413 dla zbyt dużych żądań, 429 po przekroczeniu 12 zapytań na minutę z jednego adresu. Licznik jest w pamięci instancji, więc to ochrona orientacyjna. Na poważnie włącz powiązanie Rate Limiting (`env.RL`), kod już je obsługuje.

## Stan wdrożenia (24.10.2026)

Worker `mobywatel-asystent` jest wdrożony na koncie Cloudflare przez konektor i działa na Workers AI (model `@cf/google/gemma-4-26b-a4b-it`, darmowy plan), bez klucza. Mistral Small 3.1 testowany wcześniej dawał zmyślone szczegóły o Syrenie 26; Gemma 4 odpowiada zgodnie z katalogiem, także w testach po polsku (zapytanie testowe przez API konta, nie w aplikacji). **Przejście na Claude:** w panelu Cloudflare (Workers & Pages → mobywatel-asystent → Settings → Variables and Secrets) dodaj sekret `LLM_KEY` z kluczem Anthropic. Worker sam wtedy używa Claude Haiku 5.5. Inny model: zmienna `ANTHROPIC_MODEL` (np. `claude-sonnet-5-5`). Usunięcie sekretu przywraca Workers AI.

## Najkrócej: wdrożenie automatyczne (GitHub Actions, wariant zapasowy)

Jednorazowo, na stronie repozytorium (Settings → Secrets and variables → Actions → New repository secret) dodaj trzy sekrety: `CLOUDFLARE_API_TOKEN` (Cloudflare → My Profile → API Tokens → szablon „Edit Cloudflare Workers”), `CLOUDFLARE_ACCOUNT_ID` (widoczny w panelu Workers po prawej) i `LLM_KEY` (klucz Anthropic). Potem Actions → „Wdróż asystenta AI” → Run workflow. Workflow wdraża Workera, ustawia klucz i zapisuje jego adres w `ai-config.json`, a aplikacja po odświeżeniu sama włącza AI. Dalsze zmiany w `worker/` wdrażają się same. Warunek: konto Cloudflare ma włączoną domenę workers.dev (przy pierwszym Workerze panel o to pyta). Workflow nie był uruchomiony na prawdziwym koncie.

## Claude (Anthropic) krok po kroku (ręcznie)

1. Konto i klucz: console.anthropic.com, doładuj niewielką kwotę, w ustawieniach ustaw niski limit wydatków, utwórz klucz API (to płatne API, osobne od subskrypcji Claude).
2. Cloudflare: załóż darmowe konto na cloudflare.com i zainstaluj Node.js.
3. W terminalu: `git clone https://github.com/tomaszkrawczyk-cmd/mobywatel-koncepcja && cd mobywatel-koncepcja/worker`.
4. `npx wrangler login`, potem `npx wrangler deploy`. Konfiguracja w `wrangler.toml` jest już ustawiona na Claude Haiku 5.5. Na końcu dostajesz adres `https://mobywatel-asystent.<konto>.workers.dev`.
5. `npx wrangler secret put LLM_KEY` i wklej klucz Anthropic (tylko tam).
6. W aplikacji: menu, Asystent AI, „Przez pośrednika”, wklej adres Workera, „Zapisz i sprawdź”. Ma być zielone „Połączono”.
7. Zapytaj w asystencie o coś swobodnego (np. „zepsuł mi się samochód po zakupie, co robić?”).

Zmiana na lepszą polszczyznę: w `wrangler.toml` ustaw `LLM_MODEL = "claude-sonnet-5-5"` i ponów `npx wrangler deploy`.

## Tryb bezpośredni (tylko próby)

Przeglądarka woła dostawcę sama (dla Claude wybierz „Claude (Anthropic)”, adres zostaw pusty; kod wysyła wymagany nagłówek dla wywołań z przeglądarki), a klucz leży w jej pamięci lokalnej. Działa tylko, gdy dostawca dopuszcza CORS. Używaj klucza z niskim limitem.

## Czego nie sprawdziłem

Nie wywołałem żadnego prawdziwego modelu: testy przechodzą na atrapie (Playwright dla przeglądarki, osobny skrypt dla Workera). Nie wiem więc, jak dobrze wybrany darmowy model radzi sobie po polsku ani czy trzyma format JSON. Kod toleruje odpowiedź bez JSON (pokazuje sam tekst, bez akcji). Aktualne limity darmowych planów, nazwy modeli i adresy endpointów trzeba sprawdzić u dostawcy, bo znam je tylko ze źródeł wtórnych. Warunki darmowych planów mogą dopuszczać użycie treści do rozwoju usługi, dlatego w prototypie wolno używać tylko danych fikcyjnych. Działanie Workera w Cloudflare (powiązania `AI`, `RL`) jest napisane według dokumentacji, ale niewdrożone.


## v14: wybór modelu AI (Gemma, Bielik, PLLuM)

Ustawienia: menu → Asystent AI → karta „Model AI”. W panelu asystenta widać, który model jest wybrany, a przy każdej odpowiedzi – plakietkę, kto odpowiedział.

| Opcja | Jak działa | Koszt |
| --- | --- | --- |
| 💎 Gemma (domyślna) | `@cf/google/gemma-4-26b-a4b-it` przez Workera Cloudflare | darmowy plan Workers AI |
| 🦅 Bielik 11B v3 (`speakleash/Bielik-11B-v3.0-Instruct`) | przeglądarka woła endpoint zgodny z OpenAI: router Hugging Face `https://router.huggingface.co/v1/chat/completions` albo własny adres (np. Ollama `http://localhost:11434/v1/chat/completions`, vLLM, serwer suwerenny) | według dostawcy; własny serwer – bez opłat za API |
| 🇵🇱 PLLuM 12B (`CYFRAGOVPL/PLLuM-12B-chat-2412`) | jw. (na routerze HF dostępność zależy od dostawcy) | jw. |
| 💻 Bielik 1.5B v3 w przeglądarce (`dx0ne/Bielik-1.5B-v3.0-Instruct-onnx-q4`) | transformers.js, WebGPU lub WASM; model pobiera się raz (ok. 1,1 GB) | za darmo, bez klucza, dane nie wychodzą z urządzenia |

Klucz API zapisuje się tylko w `localStorage` tej przeglądarki (wpis `mob_ai_key_v14`), nie w repozytorium i nie na serwerze. Kolejność awaryjna: wybrany model → Gemma (Worker) → reguły w telefonie.

Ollama lokalnie: `ollama run SpeakLeash/bielik-11b-v3.0-instruct`, uruchomić serwer z `OLLAMA_ORIGINS=*` (inaczej Ollama odrzuca wywołania ze strony GitHub Pages kodem 403).

Sprawdzone 26.10.2026: Bielik 1.5B (ONNX q4) odpowiada po polsku – w teście na CPU pierwsze uruchomienie ok. 27 s (pobranie i ładowanie), odpowiedź na 80 tokenów ok. 5 s. Darmowe publiczne Space'y z Bielikiem/PLLuM (np. przez Ollamę na HF) działają z serwera, ale blokują wywołania z przeglądarki albo mają wyczerpany limit, więc nie są podłączone. Fabryka AI (`https://fabryka.ai/v1`, `bielik-11b-v3`) ma darmowy plan testowy (10 zapytań dziennie, konto), ale nie obsługuje CORS – wymaga pośrednika.


## v15: Bielik pobiera się sam w tle

Po otwarciu aplikacji (gdy przeglądarka jest bezczynna) Bielik 1.5B v3 pobiera się w tle w Web Workerze – interfejs pozostaje płynny – i zapisuje w pamięci podręcznej przeglądarki, więc przy kolejnych wizytach ładuje się szybko. Działa automatycznie tylko na komputerach z WebGPU lub co najmniej 4 GB RAM, bez trybu oszczędzania danych, nie na sieci 2G/3G i nie na telefonach. Ustawienie „Automatycznie pobieraj Bielika w tle” (Asystent AI) pozwala to wyłączyć; `?bielik=1` w adresie wymusza pobieranie (np. na pokaz dla jury), `?bielik=0` je wyłącza.

Mała pigułka „🦅 Bielik pobiera się w tle …%” prowadzi do ustawień. Gdy model jest gotowy, aplikacja pokazuje komunikat i przełącza asystenta na lokalnego Bielika, chyba że użytkownik sam wybrał inny model. Do tego czasu odpowiada Gemma. Jeśli Bielik nie odpowie w 20 s albo zgłosi błąd, odpowiada Gemma, a potem reguły – z plakietką, kto odpowiedział. Bielik dostaje prompt systemowy z podstawowymi faktami (np. dowód osobisty jest bezpłatny, zastrzeżenie PESEL jest bezpłatne, 112, 828 828 828), a gdy wyszukiwarka usług znajdzie pasującą sprawę, pod odpowiedzią zostaje przycisk przejścia do niej. Pytania pasujące do reguł nadal obsługują reguły.
