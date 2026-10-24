# Opis zgłoszenia – mObywatel 3.0 (do formularza konkursowego)

Tytuł: mObywatel 3.0 – asystent, który doprowadza sprawę do końca

Link do prototypu (działa bez logowania): https://tomaszkrawczyk-cmd.github.io/mobywatel-koncepcja/

Opis:

Pomysł jest prosty. Obywatel mówi lub pisze, co chce załatwić, a aplikacja prowadzi go do końca: sprawdza dane w rejestrach, pokazuje termin z podstawą, przygotowuje pismo i prosi o jedno potwierdzenie. Nic nie wysyła bez zgody. Wszystko jest symulacją na fikcyjnych danych.

Prototyp pokazuje to na czterech osobach z różnymi sprawami: matce trójki dzieci z Warszawy, przedsiębiorcy z Krakowa, nauczycielce z Lublina opiekującej się mamą i studencie z Gdańska. Przełączasz osobę jednym dotknięciem i widzisz inny ekran startowy, inne terminy, inne recepty i inne pisma.

Cztery typowe sprawy, od których warto zacząć:
1. Dostałem pismo i nie wiem, co zrobić. Aplikacja tłumaczy je prostym językiem, liczy termin z przesunięciem na dzień roboczy, układa szkic odpowiedzi i wskazuje właściwy kanał.
2. Zgubiłem portfel. W rozmowie z asystentem jednym potwierdzeniem zastrzegasz dowód, prawo jazdy i karty.
3. Kończy mi się lek. Aplikacja liczy zapas z opakowania i dawkowania, prosi lekarza o przedłużenie leku stałego, pokazuje kod do apteki i dostępność.
4. Przeprowadzam się. Agent układa plan formalności i wykorzystuje wspólne dane, a każdy krok zatwierdzasz osobno.

Co jeszcze jest w środku, w tym samym prostym schemacie „opisz sprawę i potwierdź”: kupno OC z porównaniem ofert, mandat i punkty karne, prognoza emerytury, udostępnianie danych jednym skanem tylko w potrzebnym zakresie (np. samo „18+”), upoważnienia dla bliskich, e-recepty, bilety komunikacji miejskiej, pociągów i lotów, e-Sąd (pozew i sprzeciw w postępowaniu upominawczym), zgłoszenia ze zdjęciem lub nagraniem i odciskiem czasu, Cichy SOS, 112 tekstem, śledzenie prac Sejmu i uwagi do projektów, wybory (lokal, zmiana miejsca, głosowanie korespondencyjne, pełnomocnik) oraz Syrena 26.

Dostępność i prostota: ekran startowy ma jedno pole „Co chcesz załatwić?” z głosem, trzy sprawy osoby i katalog w przewodniku, który pokazuje usługi według sytuacji życiowych. Głos, duże elementy i prosty język są standardem, a nie dodatkiem.

Uczciwie o granicach: to koncepcja. Zakup biletów, polis OC i autostrad wymaga umów z przewoźnikami, ubezpieczycielami i operatorami. Głosowanie przez internet w wyborach powszechnych nie jest dziś dopuszczone, więc występuje jako wyraźnie oznaczony pilotaż. Elektroniczne podpisy pod wnioskiem o referendum wymagają zmiany prawa. Progi i terminy referendum lokalnego oraz skutki sprzeciwu w EPU są oznaczone jako do weryfikacji z aktualnym tekstem ustaw. Ceny, osoby, sygnatury i rozkłady są przykładowe.

Technologie: strona statyczna bez logowania. Asystent działa offline na regułach i wyszukiwaniu rozmytym, a po wpisaniu adresu może korzystać z polskiego modelu zgodnego z API OpenAI (Bielik, PLLuM). Kody QR w prototypie są demonstracyjne i nieważne poza nim.

Autor: Tomasz Krawczyk, Supplemental.
