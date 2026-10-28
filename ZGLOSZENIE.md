# Zgłoszenie – mObywatel 3.0 (teksty do wklejenia w formularz)

Link do prototypu (działa bez logowania, sprawdzone w oknie prywatnym): https://tomaszkrawczyk-cmd.github.io/mobywatel-koncepcja/

Dodatkowy link (repozytorium): https://github.com/tomaszkrawczyk-cmd/mobywatel-koncepcja

## Pole: Tytuł

mObywatel 3.0 – asystent, który doprowadza sprawę do końca

## Pole: Opis (3018 znaków, limit 4000)

Problem: sprawy urzędowe są rozproszone, a człowiek nie wie, od czego zacząć. Dostaje pismo i nie rozumie terminu, gubi portfel i nie wie, co zastrzec, opiekuje się mamą lub dzieckiem i musi logować się w pięciu miejscach. Dla kogo: dla każdego, ale w szczególności dla osób starszych, rodziców i osób, które boją się urzędu.

Rozwiązanie: mówisz albo piszesz, co chcesz załatwić, a aplikacja prowadzi Cię do końca. Sprawdza dane w rejestrach, pokazuje termin z podstawą prawną, przygotowuje pismo i prosi o jedno potwierdzenie. Nic nie wysyła bez Twojej zgody. Prototyp pokazuje to na czterech fikcyjnych osobach (matka trójki dzieci, przedsiębiorca, nauczycielka opiekująca się mamą, student) – każda ma inny ekran startowy, terminy i sprawy.

Cztery sprawy od początku do końca:
1. Dostałem pismo: wyjaśnienie prostym językiem, termin z przesunięciem na dzień roboczy, szkic odpowiedzi i właściwy kanał.
2. Zgubiłem portfel: w aplikacji zastrzegasz dowód osobisty, paszport i prawo jazdy (System Dokumenty Zastrzeżone); karty, dowód rejestracyjny i legitymację – przekierowanie do banku i numeru 828 828 828.
3. Kończy mi się lek: zapas liczony z dawkowania, prośba o przedłużenie recepty, kod do apteki.
4. Przeprowadzam się: plan formalności, a każdy krok zatwierdzasz osobno.

Moje zdrowie: karta zdrowia jako widok na Internetowe Konto Pacjenta – kod wizyty z zakresem, udostępnienie lekarzowi na 24 h z możliwością cofnięcia i historią dostępu, karta ratunkowa, ukrywanie wpisów wrażliwych. Wyraźnie: AI nie diagnozuje.

Bezpieczeństwo: „Potwierdź umowę w mObywatelu” – pożyczka, abonament czy polisa zawierane online lub przez telefon wymagają potwierdzenia w aplikacji, inaczej są blokowane (rozszerzenie zastrzeżenia PESEL). Do tego Cichy SOS, 112 tekstem, „Czy to oszustwo?” i rejestr „kto sprawdzał moje dane”.

Wpływ obywatela: śledzenie Sejmu, uwagi do konkretnych przepisów, petycje, „Zamrażarka” – wskazujesz, którymi zaległymi projektami Sejm ma zająć się najpierw (sygnał, nie wiąże Marszałka). Głosowanie przez internet pokazane jako pilotaż: tylko dla chętnych, możliwość ponownego głosu, głos w lokalu ma pierwszeństwo.

Dostępność: jedno pole „Co chcesz załatwić?” z głosem, tryb seniora (duży tekst, czytanie na głos), wysoki kontrast, prosty język, katalog usług według sytuacji życiowych.

Uczciwie o granicach: to koncepcja na fikcyjnych danych. Zakupy biletów i polis wymagają umów z firmami, a e-głosowanie, e-podpisy pod referendum i potwierdzanie umów – zmiany prawa. Kody QR są demonstracyjne.

Technologie: strona statyczna bez logowania; asystent działa bez modelu AI na scenariuszach i wyszukiwaniu rozmytym w przeglądarce. Opcjonalnie pytania spoza scenariuszy trafiają do modelu językowego przez nasz serwer pośredniczący – dziś jest to Gemma (Google, otwarte wagi) w Cloudflare Workers AI, a aplikacja pokazuje nazwę modelu podaną przez serwer. Od wersji v14 w ustawieniach „Model AI” można wybrać: Gemma (domyślnie, na prezentacji), Bielik 11B v3 lub PLLuM 12B – przez własny klucz (np. Hugging Face) albo własny, suwerenny serwer zgodny z OpenAI (np. Ollama, vLLM) – oraz Bielik 1.5B działający w całości w przeglądarce, bez klucza i bez opłat. Przy każdej odpowiedzi widać plakietkę, który model odpowiedział; gdy wybrany model nie odpowie, asystent przechodzi na Gemmę, a potem na reguły w telefonie.

## Pole: Polskie modele i technologie

Asystent jest przygotowany pod polskie modele językowe: pośrednik w Cloudflare jest zgodny z API OpenAI, a w ustawieniach są gotowe profile Bielik 11B (SpeakLeash) i PLLuM (konsorcjum HIVE AI / NASK). Uczciwie: dziś na żywo działa Gemma (Google, otwarte wagi) w Cloudflare Workers AI, a aplikacja pokazuje nazwę modelu podaną przez serwer – Bielik 11B i PLLuM 12B są podłączalne (własny klucz lub wdrożenie suwerenne), ale na prezentacji domyślnie odpowiada Gemma. Za darmo i bez serwera działa mniejszy Bielik 1.5B v3 uruchamiany w przeglądarce (transformers.js, pobranie ok. 1,1 GB) – prostszy, ale całkowicie lokalny: pytania nie wychodzą z urządzenia. Od wersji v15 ten model (społecznościowa konwersja ONNX oficjalnego Bielika 1.5B) pobiera się w tle po otwarciu aplikacji – od v17 dopiero po 8-sekundowej zapowiedzi z możliwością odmowy (na komputerach; na telefonach i wolnych sieciach – tylko na żądanie) i po pobraniu automatycznie przejmuje rozmowę; do tego czasu odpowiada Gemma. Pobieranie jest jawne (v18: osobne stany „pobrano”, „uruchamianie”, „gotowy”; na słabszym komputerze uczciwie: „ten komputer nie obsługuje go wystarczająco szybko – odpowiada Gemma”): karta informuje o rozmiarze (ok. 1,1 GB), celu i zmianach, pokazuje postęp i pozwala wstrzymać pobieranie lub wrócić do Gemmy. Przy polu asystenta widać, dokąd trafia pytanie (lokalnie / Cloudflare / Hugging Face / własny serwer), a pytania o zdrowie przed wysłaniem poza urządzenie wymagają potwierdzenia. Koncepcyjnie opisujemy też basal (modele decyzyjne Remigiusza Kinasa, na bazie Bielika) do rozpoznawania intencji oraz Zeccer (polska sieć samoobsługowych punktów druku) do drukowania pism. Prototyp nie jest powiązany z autorami tych rozwiązań.

## Prototyp referencyjny → Nasza wersja

Porównanie dotyczy założeń prototypu referencyjnego opisanych na mobywatel.ai (wersja w przeglądarce: sprawy załatwiane rozmową, rozmowy to przygotowane scenariusze). Nie oceniamy każdego ekranu – pokazujemy, co dodajemy.

| Obszar | Prototyp referencyjny | Nasza wersja |
|---|---|---|
| Sposób załatwiania spraw | Rozmowa z asystentem | Rozmowa albo klasyczne ekrany – do wyboru; każda akcja wymaga potwierdzenia |
| Asystent w przeglądarce | Przygotowane scenariusze | Scenariusze + wyszukiwanie rozmyte offline; opcjonalnie prawdziwy model z jawną nazwą, gotowy na Bielika / PLLuM |
| Różni użytkownicy | Pokaz na przykładowych sprawach | Cztery osoby z różnymi ekranami startowymi, terminami i sprawami (rodzic, przedsiębiorca, opiekunka seniorki, student) |
| Dostępność | – | Tryb seniora, czytanie na głos, wysoki kontrast, prosty język, katalog wg sytuacji życiowych |
| Prywatność | – | Rejestr „kto sprawdzał moje dane”, udostępnianie tylko potrzebnego zakresu (np. „18+”), dostęp lekarza na 24 h z cofnięciem |
| Bezpieczeństwo | – | Zastrzeżenie dokumentów zgodne z usługą „Zastrzeż dokument”, „Potwierdź umowę w mObywatelu”, Cichy SOS, 112 tekstem |
| Wpływ obywatela | – | Sejm na żywo, uwagi do przepisów, petycje, „Zamrażarka”, e-głosowanie jako oznaczony pilotaż z zabezpieczeniami |

(„–” oznacza obszar, którego nie porównywaliśmy szczegółowo.)

Autor: Tomasz Krawczyk, Supplemental.

### v19
Pogrupowane „Więcej” z wyszukiwarką; jedna nazwa „Asystent” i „Pełnomocnik”; Gemma domyślnie z rezerwą reguły → Bielik offline; duży mikrofon uruchamiający sprawy; tryb seniora na starcie; „Kto sprawdzał moje dane?” (dane DEMO, zgłoszenie nieuprawnionego dostępu); potwierdzenie PIN-em/biometrią (DEMO); „Przeprowadzam się” krok po kroku; przerwane zgłoszenie w czacie można wznowić lub porzucić.

## v21: „Prawdziwy czy podróbka?” – ochrona przed fałszywym mObywatelem

Problem jest realny: w 2026 r. CBZC zatrzymało sprzedawców fałszywej aplikacji, którą mogło kupić ponad 3000 osób (20.02.2026), a 27.10.2026 kolejne 21 osób, w tym 13 nieletnich. Nieletni używają podróbek i przerobionych grafik, żeby kupić alkohol. Ministerstwo Cyfryzacji przypomina, że za podrabianie dokumentu albo używanie podrobionego grozi kara od 3 miesięcy do 5 lat (art. 270 § 1 k.k.), a najpewniejsza weryfikacja to kod QR.

Co dodaje koncepcja (wszystko DEMO, numery spraw zaczynają się od `DEMO-`):
- `#/podrobki` – centrum: kafel na Start i w Dokumentach, osobna grupa „Ochrona przed podróbkami” w „Więcej”.
- `#/sprawdz-dokument` – weryfikator z kodem QR i jednorazowym kodem 6-cyfrowym, który wygasa po 120 s; **selektywne ujawnianie** (tylko „pełnoletni TAK/NIE”, imię i zdjęcie albo pełne dane); dane znikają po czasie.
- `#/pokaz-dokument` – żywy znak bezpieczeństwa: zegar z sekundami, kolor i „słowo minuty” liczone z godziny, fala od dotyku, hologram reagujący na przechylenie; ostrzeżenie, że zrzut ekranu ani nagranie nie są dokumentem.
- `#/jak-rozpoznac/{sklep|policja|senior}` – poradnik dla trzech grup odbiorców i porównanie „prawdziwy / podejrzany”.
- `#/zglos-podrobke` – formularz zgłoszenia (SYMULACJA, nic nie jest wysyłane) z odesłaniem do incydent.cert.pl i na policję.
- Notka prawna „Udostępnianie dokumentu komuś innemu to przestępstwo”, napisana ostrożnie i ze źródłami (art. 270, 269b, 275 k.k., art. 304 k.p.k.).
- Reguły asystenta w telefonie odpowiadają na pytania typu „jak sprawdzić, czy mObywatel jest prawdziwy”. Kolejność Gemma → reguły → Bielik zostaje bez zmian.

Źródła: gov.pl/web/cyfryzacja (kod-qr--skuteczna-metoda-weryfikacji-mdowodu, mdowod--jak-dziala…, falszowanie-dokumentow-tozsamosci-to-powazne-przestepstwo), cbzc.policja.gov.pl (aktualności 831 i 1048), skierniewice.policja.gov.pl, rmf24.pl.

## v22: „Zgłoś oszustwo” – CERT Polska, bank, policja w jednym miejscu

Ludzie nie wiedzą, gdzie zgłosić oszustwo. Oficjalne kanały są różne dla różnych sytuacji: SMS przekazuje się na **8080** (CERT Polska, bezpłatnie, w oryginalnej formie, maks. 3 zgłoszenia na 4 godziny), strony i e-maile zgłasza się na **incydent.cert.pl** albo cert@cert.pl, a gdy chodzi o pieniądze – najpierw **bank**, potem **policja**, i zastrzeżenie **PESEL**. CERT prowadzi Listę Ostrzeżeń (cert.pl/lista-ostrzezen, hole.cert.pl, test na lista.cert.pl).

Co dodaje koncepcja (aplikacja sama nic nie wysyła, numery to `DEMO-CERT-…`):
- `#/zglos-oszustwo` – centrum z 6 kategoriami: dziwny SMS, fałszywa strona lub link, telefon „z banku/policji” (spoofing), fałszywy mObywatel lub dokument (łączy się z v21 `#/zglos-podrobke`), fałszywa inwestycja (lista KNF), oszustwo w sklepie, OLX lub mediach społecznościowych.
- `#/zglos-oszustwo/{sms|www|call|doc|inv|shop}` – prowadzony formularz: zbiera tylko potrzebne pola, usuwa z opisu PESEL, numery kont i kart, e-maile i kody, pokazuje podgląd DEMO i **prawdziwe** przyciski: `sms:8080` z wklejoną treścią, incydent.cert.pl z kopiowaniem tekstu, `tel:112`, wskazówkę „zadzwoń do banku numerem z karty”.
- `#/sprawdz-link` – wskazówki z samego adresu (podszywanie się pod markę, nietypowa domena, darmowy hosting, punycode) z wyraźnym zastrzeżeniem, że to **nie werdykt**, oraz wyjaśnienie, jak działa Lista Ostrzeżeń CERT.
- `#/po-oszustwie` – lista kroków z odhaczaniem: bank i zastrzeżenie karty (zasada D+1 według Rzecznika Finansowego), zastrzeżenie PESEL, zmiana haseł, usunięcie aplikacji do zdalnego dostępu, CERT, policja, ostrzeżenie bliskich.
- Wejścia: Bezpieczeństwo, grupa „Ochrona przed podróbkami i oszustwami” w „Więcej”, wyszukiwarka, przyciski podpowiedzi i reguły asystenta („dostałem dziwnego SMS-a”, „jak zgłosić oszustwo”, „straciłem pieniądze”). Kolejność Gemma → reguły → Bielik bez zmian.

Źródła: gov.pl/web/baza-wiedzy (zgłoś SMS do CERT), cert.pl/lista-ostrzezen, wiedza.cert.pl, cbzc.policja.gov.pl (Zgłoś cyberoszustwo), rf.gov.pl, gov.pl (Zastrzeż PESEL), knf.gov.pl.

## v23: „Moje dokumenty nie znikną” i „Kto pyta o moje dane?”

Ludzie skarżą się, że dokument znika z mObywatela bez wyjaśnienia. Ministerstwo Cyfryzacji opisuje realne powody: aktywacja na nowym telefonie unieważnia certyfikat na starym, certyfikat mDowodu jest ważny rok, a do 5.08.2026 trzeba było się zalogować, żeby certyfikaty dokumentów odświeżyły się same. Osobno jest zastrzeżenie dokumentu (System Dokumenty Zastrzeżone) i zawieszenie e-dowodu na 14 dni. Czego MC nie napisało wprost (ciche kasowanie kafelka przy zmianie danych w rejestrze, jedna liczba godzin offline), prototyp nie podaje jako faktu.

Druga sprawa: zanim usługa dostanie dane, człowiek ma widzieć kto pyta, o co i po co, i móc oddać mniej. Rozporządzenie (UE) 2024/1183 mówi, że korzystanie z europejskiego portfela jest dobrowolne (art. 5a ust. 15), a część usług ma go przyjąć tylko na życzenie użytkownika (art. 5f). Strona ufająca nie żąda innych danych niż zgłoszone (art. 5b ust. 3). W portfelu jest historia udostępnień (art. 5a ust. 4 lit. d).

Co dodaje koncepcja (DEMO, nic nie jest wysyłane):
- `#/zdrowie-dokumentow` i `#/stan-dokumentu/{id}` – stan dokumentu (aktywny / wymaga odświeżenia / wygasa wkrótce / zastrzeżony / usunięty z urządzenia), data odświeżenia, kopia offline, przyczyny i duże kroki w trybie seniora. „Przywróć” jest symulacją. Anna widzi dokumenty dzieci.
- `#/raport-problemu` – raport techniczny bez danych osobowych, z prawdziwą infolinią +48 42 253 54 74 i adresem mobywatel-pomoc@coi.gov.pl (otwierane dopiero po dotknięciu).
- `#/kto-pyta` i `#/zadanie/{sklep|bank|hotel|przychodnia}` – karta żądania, pola potrzebne i nadmiarowe (zamiast daty urodzenia: „pełnoletni: tak”; zamiast adresu: miasto). Odmowa albo udostępnienie zapisuje się w rejestrze z v19 (`#/privacy`), zgodę można cofnąć. Okazanie przy ladzie prowadzi do weryfikatora QR z v21 (`#/sprawdz-dokument`), bez drugiej kopii tamtego ekranu.
- `#/prawa-portfela` – skrót praw ze źródłami.
- Mały wskaźnik na starcie: „Dokumenty: wszystko w porządku” albo „wymaga uwagi”. Reguły asystenta prowadzą do tych ekranów. Kolejność Gemma → reguły → Bielik bez zmian.

Źródła: gov.pl/web/cyfryzacja (aktualizacja certyfikatów do 5.08.2026, certyfikat ważny rok, zgubiony telefon, pomoc COI, Zastrzeż dokument), regulamin aplikacji mObywatel, info.mobywatel.gov.pl/kontakt, EUR-Lex 32024R1183, digital-strategy.ec.europa.eu (factpage portfela, Q&A, standardy i pulpit prywatności), gov.pl – europejski portfel w mObywatelu.
