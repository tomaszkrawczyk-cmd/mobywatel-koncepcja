# Źródła danych i darmowe API

Prototyp jest statyczną stroną (GitHub Pages), więc dane z rejestrów publicznych pobiera bezpośrednio z przeglądarki użytkownika. Nie ma własnego serwera, kluczy ani kosztów. Ekran „Źródła danych” (`#/zrodla`) sprawdza, co faktycznie działa z danej przeglądarki.

| Źródło | Do czego w prototypie | Klucz | Uwagi |
|---|---|---|---|
| Otwarty API KRS (api-krs.ms.gov.pl) | sprawdzanie spółek, obserwacja zmian wpisu | brak | dokumentacja: prs.ms.gov.pl/krs/openApi; PESEL jest zamaskowany; nazwy pól odczytywane defensywnie |
| Biała lista podatników VAT (wl-api.mf.gov.pl) | status VAT i rachunki kontrahenta po NIP | brak | zapytanie wymaga daty; według opisów API obowiązuje dzienny limit zapytań |
| NBP (api.nbp.pl) | kursy walut przy lotach | brak | tabela A |
| Sejm API (api.sejm.gov.pl) | posiedzenia, akty prawne (ELI) | brak | używane od v3 |

## Czego nie zweryfikowano

- Czy każdy z tych rejestrów zwraca nagłówki CORS dla stron z innej domeny. Z mojego środowiska nie mogłem tego sprawdzić. Gdy przeglądarka zablokuje zapytanie, prototyp pokazuje oznaczony przykład („DANE PRZYKŁADOWE”), a nie fałszywy wynik.
- Dokładnej struktury JSON odpowiedzi KRS i Białej listy. Kod szuka pól po nazwach (np. `nazwa`, `formaPrawna`, `statusVat`) i jeśli ich nie znajdzie, pokazuje przykład.

## Gdy CORS blokuje zapytania: darmowy pośrednik

Wystarczy Cloudflare Worker (darmowy plan). Adres wpisujesz w „Źródła danych” → „Własny pośrednik”. Przykład:

```js
export default { async fetch(req) {
  const u = new URL(req.url).searchParams.get('url') || decodeURIComponent(new URL(req.url).search.slice(5));
  if (!/^https:\/\/(api-krs\.ms\.gov\.pl|wl-api\.mf\.gov\.pl|api\.nbp\.pl|api\.sejm\.gov\.pl)\//.test(u)) return new Response('forbidden', {status: 403});
  const r = await fetch(u);
  return new Response(r.body, {status: r.status, headers: {'content-type': 'application/json', 'access-control-allow-origin': '*', 'cache-control': 'public, max-age=300'}});
}}
```

Lista dozwolonych hostów w pośredniku jest celowa: bez niej każdy mógłby go używać do dowolnych zapytań.

## Inne źródła do rozważenia (niewdrożone)

- CEIDG – Hurtownia Danych (dane.biznes.gov.pl): wymaga bezpłatnego tokenu, więc token trzeba trzymać w pośredniku, nie w kodzie strony.
- Model językowy: Bielik lub PLLuM przez dowolny punkt zgodny z API OpenAI (adres w ustawieniach aplikacji). Koszt i limity zależą od dostawcy.
