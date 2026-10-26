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

Asystent jest przygotowany pod polskie modele językowe: pośrednik w Cloudflare jest zgodny z API OpenAI, a w ustawieniach są gotowe profile Bielik 11B (SpeakLeash) i PLLuM (konsorcjum HIVE AI / NASK). Uczciwie: dziś na żywo działa Gemma (Google, otwarte wagi) w Cloudflare Workers AI, a aplikacja pokazuje nazwę modelu podaną przez serwer – Bielik 11B i PLLuM 12B są podłączalne (własny klucz lub wdrożenie suwerenne), ale na prezentacji domyślnie odpowiada Gemma. Za darmo i bez serwera działa mniejszy Bielik 1.5B v3 uruchamiany w przeglądarce (transformers.js, pobranie ok. 1,1 GB) – prostszy, ale całkowicie lokalny: pytania nie wychodzą z urządzenia. Od wersji v15 ten model pobiera się sam w tle po otwarciu aplikacji (na komputerach; na telefonach i wolnych sieciach – tylko na żądanie) i po pobraniu automatycznie przejmuje rozmowę; do tego czasu odpowiada Gemma. Pobieranie jest jawne: karta informuje o rozmiarze (ok. 1,1 GB), celu i zmianach, pokazuje postęp i pozwala wstrzymać pobieranie lub wrócić do Gemmy. Koncepcyjnie opisujemy też basal (modele decyzyjne Remigiusza Kinasa, na bazie Bielika) do rozpoznawania intencji oraz Zeccer (polska sieć samoobsługowych punktów druku) do drukowania pism. Prototyp nie jest powiązany z autorami tych rozwiązań.

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
