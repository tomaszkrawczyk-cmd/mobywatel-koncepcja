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

## Najkrócej: wdrożenie automatyczne (GitHub Actions)

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
