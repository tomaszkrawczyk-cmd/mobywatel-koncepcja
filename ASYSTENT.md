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

Po otwarciu aplikacji (gdy przeglądarka jest bezczynna) Bielik 1.5B v3 pobiera się w tle w Web Workerze – interfejs pozostaje płynny – i zapisuje w pamięci podręcznej przeglądarki, więc przy kolejnych wizytach ładuje się szybko. Działa automatycznie tylko na komputerach z WebGPU lub co najmniej 4 GB RAM, bez trybu oszczędzania danych, nie na sieci 2G/3G i nie na telefonach. Ustawienie „Automatycznie pobieraj Bielika w tle” (Asystent AI) pozwala to wyłączyć; `?bielik=1` w adresie wymusza pobieranie (tylko do testów – nie wysyłaj jury takiego linku), `?bielik=0` je wyłącza.

Mała pigułka „🦅 Bielik pobiera się w tle …%” prowadzi do ustawień. Gdy model jest gotowy, aplikacja pokazuje komunikat i przełącza asystenta na lokalnego Bielika, chyba że użytkownik sam wybrał inny model. Do tego czasu odpowiada Gemma. Jeśli Bielik nie odpowie w 20 s albo zgłosi błąd, odpowiada Gemma, a potem reguły – z plakietką, kto odpowiedział. Bielik dostaje prompt systemowy z podstawowymi faktami (np. dowód osobisty jest bezpłatny, zastrzeżenie PESEL jest bezpłatne, 112, 828 828 828), a gdy wyszukiwarka usług znajdzie pasującą sprawę, pod odpowiedzią zostaje przycisk przejścia do niej. Pytania pasujące do reguł nadal obsługują reguły.

## v16: przejrzysty komunikat o pobieraniu

Przy pierwszym automatycznym pobieraniu (model nie jest jeszcze w pamięci przeglądarki) pojawia się nieblokująca karta: „Pobieramy w tle polski model Bielik (ok. 1,1 GB, jednorazowo)”, po co (lokalnie, prywatnie, po polsku), co się zmieni po pobraniu (przełączenie z Gemmy na Bielika, oznaczenie przy odpowiedziach, dane nie opuszczają urządzenia), że do tego czasu odpowiada Gemma, pasek postępu z % i MB oraz przyciski „Wstrzymaj / Nie pobieraj” (wybór zapamiętany), „Szczegóły” i „Zwiń” (zostaje mała pigułka). Po pobraniu: „Gotowe – asystent działa teraz na Bielik 1.5B lokalnie” z opcją „Wróć do Gemmy”. Gdy model jest już w pamięci – tylko krótki komunikat. W ustawieniach jest sekcja „Jak to działa”. Zapytania do Bielika idą w kolejce; po przekroczeniu 20 s generowanie jest przerywane (worker zamykany i ładowany ponownie z pamięci podręcznej), a odpowiada Gemma.


## v17: poprawki po przeglądzie kodu

- **Prywatność zależna od trybu.** Przy polu asystenta i w „Moim zdrowiu” widać, dokąd trafia pytanie: Bielik lokalny – nic nie opuszcza urządzenia; Gemma – Cloudflare Workers AI; router HF – Hugging Face i dostawca modelu; własny adres – Twój serwer. Filtr usuwa dodatkowo kody pocztowe, adresy (ul./al./os./pl. + numer) i imiona/nazwiska po zwrotach typu „nazywam się”, „pani”, „syn”. Pytania wyglądające na dotyczące zdrowia (art. 9 RODO) przed wysłaniem do modelu spoza urządzenia wymagają potwierdzenia; domyślny wybór to odpowiedź bez modelu.
- **Zgoda przed transferem.** Zanim zacznie się pobieranie, karta przez 8 s informuje o rozmiarze, celu i zmianach i pozwala wybrać „Nie pobieraj” (wybór zapamiętany) lub „Pobierz teraz”. Dopiero potem rusza pobieranie. Gdy model jest już w pamięci przeglądarki, karty nie ma.
- **Bez ślepej akcji.** Przycisk „przejdź dalej” pojawia się przy odpowiedzi Bielika tylko, gdy wyszukiwarka znalazła dokładnie jedną pasującą sprawę; przy kilku – 2–3 propozycje do wyboru.
- **Bez nadpisywania `window.fetch`.** Nazwę modelu z pola `model` odpowiedzi pośrednika zapisuje miejsce wywołania (v14).
- **Zmiana silnika jest widoczna w czacie** jednym zdaniem, np. „Asystent przełączył się na Bielik 1.5B (lokalnie)”.
- **Łańcuch dostaw.** Model `dx0ne/Bielik-1.5B-v3.0-Instruct-onnx-q4` to **konwersja społecznościowa** (ONNX q4) oficjalnego `speakleash/Bielik-1.5B-v3.0-Instruct`, nie wydanie SpeakLeash; jeśli właściciel konta zmieni plik, aplikacja pobierze zmieniony model. Biblioteka transformers.js jest ładowana z jsdelivr w przypiętej wersji 3.7.6 przez dynamiczny `import()` w Web Workerze – ten mechanizm nie obsługuje SRI (Subresource Integrity), więc integralność nie jest sprawdzana. Docelowo: własna kopia biblioteki i modelu z sumą kontrolną (lub oficjalny model SpeakLeash).
- **Identyfikatory HF sprawdzone 26.10.2026** (`huggingface.co/api/models/...`): `speakleash/Bielik-11B-v3.0-Instruct` istnieje, router HF: dostawca publicai (live); `CYFRAGOVPL/PLLuM-12B-chat-2412` istnieje, router HF: featherless-ai (live; na naszym koncie bez środków nie działał). Nowsza wersja: `CYFRAGOVPL/PLLuM-12B-chat-2512` – można ją wpisać w polu „Nazwa modelu”.
- **Fakty sprawdzone w źródłach** (gov.pl, zastrzegam.pl): dowód osobisty jest bezpłatny; e-dowód można zawiesić w mObywatelu na 14 dni, potem zostaje unieważniony; „Zastrzeż dokument” obejmuje dowód, paszport i prawo jazdy; 828 828 828 działa całodobowo, z zagranicy +48 828 828 828 (przekierowanie do banku, tylko karty płatnicze); mDowód nie jest uznawany za granicą. Teksty aplikacji i prompt Bielika poprawiono zgodnie z tym, a zdanie o dowodzie rejestracyjnym złagodzono („zakres sprawdź w banku”).

## v18: wiarygodność po audycie

- **Ekrany alarmowe (112 tekstem, cichy SOS, dron):** żadnych twierdzeń, że służby zostały powiadomione, lokalizacja przekazana albo pomoc jest w drodze. Na górze czerwony pasek „SYMULACJA – nic nie zostało wysłane… W prawdziwym zagrożeniu dzwoń 112” z prawdziwym linkiem `tel:112`.
- **Symulowane wysyłki:** przyciski wysyłki/podpisu/głosu mają etykietę DEMO, ekran wyniku mówi „Symulacja ukończona – nic nie zostało wysłane”, komunikaty typu „wysłano / złożono / przyjęto / doręczono / przekazano” dostają dopisek „(symulacja) … – nic nie zostało wysłane”, numery mają postać `DEMO-2026-123456` i są opisane jako „numer DEMO (nie jest numerem sprawy)”.
- **Jeden status AI** (`aiStatus()`): w asystencie i w ustawieniach jedna karta – kto odpowiada teraz, gdzie przetwarzane jest pytanie, czy jest przełączenie awaryjne i dlaczego, stan Bielika, kto dał ostatnią odpowiedź. Stare, sprzeczne komunikaty („model wyłączony”, „Bielik dziś nie działa”) są ukryte. Stany Bielika: nie pobrano / pobieranie % / pobrano – uruchamianie (GPU/CPU) / sprawdzam szybkość / gotowy / „pobrany, ale ten komputer nie obsługuje go wystarczająco szybko – odpowiada Gemma” / nie działa na tym urządzeniu. WebGPU wybieramy tylko, gdy `navigator.gpu.requestAdapter()` zwraca adapter; inaczej WASM (CPU). Po uruchomieniu krótki test (16 tokenów ≤ 4 s) – dopiero zdany test oznacza „gotowy”.
- **Model zdalny:** przed pierwszą rozmową jednorazowe ostrzeżenie, że rozmowa opuszcza urządzenie, a maskowanie nie usuwa wszystkich nazwisk ani szczegółów sprawy.
- **Pewność dopasowania:** pytania informacyjne („Czy znasz…”, „Co to jest…”) nigdy nie uruchamiają sprawy; kilka pasujących reguł bez czasownika działania → wybór 2–3 spraw; „zgubiłem” bez dokumentu → wybór zamiast scenariusza portfela. Zestaw 21 sformułowań (w tym „Czy znasz mapy ciszy?”) przechodzi w teście (`v18Route`).
- **Trzy główne sprawy, jedna ścieżka:** `#/sprawa/pismo`, `#/sprawa/zdarzenie`, `#/sprawa/lek` (4 kroki, podsumowanie przed podpisem). Ekrany boczne (Wyjaśnij pismo, Zgłoś, formularze straży/policji, Recepty) pokazują te same 4 kroki i prowadzą do jednej ścieżki.
- **Skrót pliku:** pełny SHA-256, opisany jako „skrót pliku w tym urządzeniu; nie potwierdza czasu ani pochodzenia; plik nie jest zapisywany w demo”.
- **Osoby w pokazie:** historia rozmowy, pisma, zgłoszenia, podpisy, głosy, udostępnienia i inne dane spraw są przechowywane osobno dla każdej osoby (sprawy i recepty były rozdzielone już wcześniej).
