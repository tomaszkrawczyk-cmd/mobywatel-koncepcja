# mObywatel 3.0 – koncepcja konkursowa (DEMO)

Klikalny prototyp na mObywatel Challenge. Autor koncepcji: Tomasz Krawczyk – Supplemental. Nie jest oficjalną aplikacją, wszystkie dane są fikcyjne.

Statyczna strona: `index.html`, `style.css`, `app.js` (v1–v2), `v3.js` (v3), `v4.js` (v4), `v5.js` (v5), `v6.js` (v6).

## Nowe w v3

- **Zgłoś** – zawiadomienie do Policji lub prokuratury, zgłoszenie do straży miejskiej, Krajowa Mapa Zagrożeń Bezpieczeństwa. Zdjęcia, wideo i nagranie dźwięku z aparatu i mikrofonu, każdy plik z odciskiem SHA-256 i znacznikiem czasu.
- **Cichy SOS** – przytrzymanie przycisku przez 3 s, 5 s na anulowanie, lokalizacja do 112 i bliskich (symulacja).
- **112 tekstem** – czat z operatorem dla osób, które nie mogą mówić lub nie słyszą (symulacja).
- **Służba w WOT przez WCR** – wybór formy służby, preferencje, termin komisji lekarskiej.
- **Monitoring** – podgląd kamer publicznych i wniosek o zabezpieczenie nagrania przed nadpisaniem.
- **Mam wpływ** – posiedzenia Sejmu (na żywo z api.sejm.gov.pl, z danymi zastępczymi), komunikaty Rady Ministrów, porównanie „było / będzie” w projektach, uwaga do konkretnego przepisu z eksportem tabeli uwag (CSV), obserwowanie projektu, głosowania posłanki z okręgu, petycja, wniosek o informację publiczną.
- **Kalkulator terminów** – odwołanie, zażalenie, skarga do WSA, sprzeciw od nakazu zapłaty, apelacja, termin organu z u.d.i.p.; przesunięcie na dzień roboczy ze świętami 2026–2027, podstawa prawna, eksport do kalendarza.
- **Kreator pism** – szkic odwołania, zażalenia, skargi, sprzeciwu, apelacji lub ponaglenia; opcjonalnie poprawa języka przez Bielika/PLLuM; wysyłka przez e-Doręczenia (symulacja).
- **Moje płatności** – zobowiązania wobec KAS, gminy, ZUS i mandaty w jednym widoku, płatność BLIK bez przechowywania karty.
- **Wsparcie** – telefony zaufania, Linia Pomocy Pokrzywdzonym, RPO, zapis na nieodpłatną pomoc prawną.

## Nowe w v4

- **Wszystkie usługi** – katalog z wyszukiwarką; **Agent spraw** – plan i wykonanie formalności przy przeprowadzce, śmierci bliskiej osoby, założeniu firmy, sprzedaży auta (każdy krok zatwierdza użytkownik).
- **Syrena 26** – obywatelski test słyszalności syren: zgłoszenie „słyszę / nie słyszę” z lokalizacją zaokrągloną do ok. 500 m, mapa słyszalności, przypomnienie o próbie, link do aplikacji Syrena 26.
- **Rodzina** – dzieci, dokumenty, szkoła, zdrowie, komunikat Policji o nieletnim z prawami rodzica (bez mandatów dla osób poniżej 17 lat – art. 8 k.w.), przejrzystość dla nastolatka; **plan rodzinny** na sytuacje kryzysowe i karta ICE.
- **Zdrowie** – wizyty przez centralną e-rejestrację z poczekalnią, czat z lekarzem POZ ze zdjęciami, e-recepty.
- **Prawo i sądy** – sprawy z portalu informacyjnego, doradca prawny AI z podstawą prawną, pozew i pismo procesowe w kreatorze, baza aktów (API ELI), rejestry (KRS, CEIDG, KW, CEPiK, biała lista, KRZ), „Wyjaśnij pismo” z wykryciem terminu.
- **Płatności** – podłączenie konta przez bank (zgoda PSD2) i karty jako tokenu, płatności automatyczne.
- **Pomoc społeczna** (kalkulator orientacyjny, decyzja zawsze po stronie pracownika socjalnego), **budowa** (e-Budownictwo), **taryfa prądu** G11/G12, **bilet PKP**, **pomoc cyfrowa** (Wi-Fi, senior, wolontariusz), **adres e-Doręczeń i rządowy alias e-mail**, **alerty**, gotowe ustawienia Bielik/PLLuM.

## Nowe w v5

- **Edukacja** – e-Matura z wynikami i deklaracją, rekrutacja na studia, kalkulator punktów (wzory przykładowe), **Polskie technologie** (Bielik, PLLuM, basal, Zeccer – informacyjnie, bez współpracy z twórcami).

## Nowe w v6

- **e-Sąd** – pozew w elektronicznym postępowaniu upominawczym (EPU) z kalkulatorem opłaty (¼ opłaty od pozwu), sprzeciw od nakazu zapłaty z terminem 14 dni, wniosek do komornika.
- **Wybory powszechne** – lokal wyborczy, zmiana miejsca głosowania, głosowanie korespondencyjne, pełnomocnik, zaświadczenie. Głosowanie przez internet w wyborach powszechnych jest tu wyłącznie koncepcją pilotażu: obecny Kodeks wyborczy go nie dopuszcza.
- **Referenda** – podpisanie wniosku, zgłoszenie referendum lokalnego (kreator, kontrola pytania, zbiórka podpisów z QR) i koncepcja komitetu referendum ogólnokrajowego.

### Niepewności prawne (do weryfikacji z aktualnym tekstem aktów)

- Progi poparcia (10% w gminie i powiecie, 5% w województwie) i 60 dni na zbiórkę przyjęto według art. 4 i art. 14 ustawy o referendum lokalnym w brzmieniu, które stosują komisarze wyborczy. Nowelizacja w druku sejmowym 933 przewidywała 5% / 2,5% i 6 miesięcy – nie ustalono, który reżim obowiązuje.
- Wzór opłaty w EPU (¼ opłaty stosunkowej) i stawki są uproszczone; sprawdź ustawę o kosztach sądowych w sprawach cywilnych.
- Zbieranie podpisów pod wnioskiem o referendum ogólnokrajowe w formie elektronicznej to koncepcja de lege ferenda.
