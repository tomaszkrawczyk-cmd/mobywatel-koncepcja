// ===== v32: języki (PL, EN, UK, BE, DE), nic nie jest zwinięte, tryb seniora i łatwa obsługa =====
// Koncepcja: Tomasz Krawczyk. Tłumaczenie interfejsu działa w telefonie (słownik w tym pliku), bez płatnych API.
// Nazwy urzędowe (mObywatel, mDowód, PESEL) zostają po polsku, z krótkim wyjaśnieniem.
// Strony nieprzetłumaczone w całości pokazują krótką informację w wybranym języku.
// Gemma dostaje prośbę o odpowiedź w wybranym języku. Bielik jest modelem polskim, więc odpowiada głównie po polsku.
// Wybór języka: przycisk w górnym pasku, panel pokazu, Ustawienia, przewodnik, pierwsze uruchomienie; ?lang=pl|en|uk|be|de.
// v32 rozwija też wszystkie zwinięte sekcje (bez usuwania czegokolwiek) i porządkuje dawny ekran startowy pod nagłówkami.
(function(){
const DICT=`
Start|Home|Головна|Галоўная|Start
Dokumenty|Documents|Документи|Дакументы|Dokumente
Asystent|Assistant|Асистент|Памочнік|Assistent
Bezpiecz.|Safety|Безпека|Бяспека|Sicherheit
Więcej|More|Більше|Больш|Mehr
Wstecz|Back|Назад|Назад|Zurück
Co chcesz załatwić?|What do you need to get done?|Що потрібно залагодити?|Што трэба зрабіць?|Was möchten Sie erledigen?
Powiedz głosem|Say it out loud|Скажіть голосом|Скажыце голасам|Per Sprache sagen
Wyślij do asystenta|Send to the assistant|Надіслати асистентові|Адправіць памочніку|An den Assistenten senden
Wyślij|Send|Надіслати|Адправіць|Senden
Zmień osobę w pokazie|Change the demo person|Змінити особу в демонстрації|Змяніць асобу ў паказе|Person in der Demo wechseln
Przekaż dane|Share data|Передати дані|Перадаць даныя|Daten weitergeben
Przekaż dane (tylko to, co trzeba)|Share data (only what is needed)|Передати дані (лише необхідне)|Перадаць даныя (толькі патрэбнае)|Daten weitergeben (nur das Nötige)
Skrzynka, nowe pismo|Inbox, new letter|Скринька, новий лист|Скрынка, новы ліст|Postfach, neues Schreiben
Skrzynka|Inbox|Скринька|Скрынка|Postfach
Tryb seniora wyłączony|Senior mode off|Режим для літніх вимкнено|Рэжым для пажылых выключаны|Seniorenmodus aus
Tryb seniora włączony|Senior mode on|Режим для літніх увімкнено|Рэжым для пажылых уключаны|Seniorenmodus an
Tryb seniora|Senior mode|Режим для літніх|Рэжым для пажылых|Seniorenmodus
Dokumenty w telefonie|Documents on this phone|Документи в телефоні|Дакументы ў тэлефоне|Dokumente auf dem Handy
Moje pojazdy|My vehicles|Мої транспортні засоби|Мае транспартныя сродкі|Meine Fahrzeuge
mPrawo jazdy|mPrawo jazdy · licence|mPrawo jazdy · права|mPrawo jazdy · правы|mPrawo jazdy · Führerschein
Karta Dużej Rodziny|Large Family Card|Карта великої родини|Картка вялікай сям'і|Karte für Großfamilien
mDowód|mDowód · ID card|mDowód · посвідчення|mDowód · пасведчанне|mDowód · Ausweis
Legitymacja studencka|Student ID|Студентський квиток|Студэнцкі білет|Studierendenausweis
Upoważnienie: mama|Authorisation: mum|Доручення: мама|Даверанасць: мама|Vollmacht: Mama
Recepty i sprawy w przychodni|Prescriptions and clinic matters|Рецепти і справи в поліклініці|Рэцэпты і справы ў паліклініцы|Rezepte und Praxisangelegenheiten
Rodzina 3+|Family 3+|Родина 3+|Сям'я 3+|Familie 3+
5 osób (DEMO)|5 people (DEMO)|5 осіб (DEMO)|5 асоб (DEMO)|5 Personen (DEMO)
Uniwersytet Gdański (DEMO)|University of Gdańsk (DEMO)|Гданський університет (DEMO)|Гданьскі ўніверсітэт (DEMO)|Universität Gdańsk (DEMO)
Pokaż dane|Show data|Показати дані|Паказаць даныя|Daten zeigen
Pilne|Urgent|Терміново|Тэрмінова|Dringend
Dotknij, żeby zacząć|Tap to start|Торкніться, щоб почати|Дакраніцеся, каб пачаць|Tippen zum Starten
Alarm|Alarm|Тривога|Трывога|Alarm
Co mnie dotyczy|What applies to me|Що мене стосується|Што мяне датычыцца|Was betrifft mich
Co mnie dotyczy?|What applies to me?|Що мене стосується?|Што мяне датычыцца?|Was betrifft mich?
Pokaż tylko to, co trzeba|Show only what's needed|Показати лише необхідне|Паказаць толькі патрэбнае|Nur das Nötige zeigen
Gdzie się ukryć|Where to take shelter|Де сховатися|Дзе схавацца|Wo Schutz suchen
Gdzie się ukryć?|Where can I take shelter?|Де сховатися?|Дзе схавацца?|Wo finde ich Schutz?
OC Corolli kończy się za 12 dni|Corolla's car insurance (OC) ends in 12 days|Поліс OC для Corolla закінчується через 12 днів|Поліс OC для Corolla сканчаецца праз 12 дзён|Kfz-Haftpflicht (OC) der Corolla endet in 12 Tagen
Pismo z urzędu skarbowego – sprawdź termin|Letter from the tax office – check the deadline|Лист із податкової – перевірте строк|Ліст з падатковай – праверце тэрмін|Schreiben vom Finanzamt – Frist prüfen
Wynik LDL powyżej normy – zobacz w Moim zdrowiu|LDL result above normal – see My health|Рівень LDL вище норми – див. «Моє здоров'я»|Узровень LDL вышэй за норму – гл. «Маё здароўе»|LDL-Wert über der Norm – siehe „Meine Gesundheit“
Wezwanie z urzędu skarbowego (VAT) – termin 7 dni|Tax office summons (VAT) – 7-day deadline|Вимога податкової (ПДВ) – строк 7 днів|Патрабаванне падатковай (ПДВ) – тэрмін 7 дзён|Aufforderung des Finanzamts (USt) – Frist 7 Tage
OC busa kończy się 12.11|Van insurance (OC) ends on 12.11|Поліс OC мікроавтобуса закінчується 12.11|Поліс OC мікрааўтобуса сканчаецца 12.11|Haftpflicht des Transporters endet am 12.11.
PESEL zastrzeżony – kredyt na auto|PESEL (ID number) blocked – car loan|PESEL (ідентифікаційний номер) заблоковано – кредит на авто|PESEL (ідэнтыфікацыйны нумар) заблакаваны – крэдыт на аўта|PESEL (Personenkennzahl) gesperrt – Autokredit
Dowód traci ważność za 48 dni|ID card expires in 48 days|Посвідчення особи спливає через 48 днів|Пасведчанне асобы губляе сілу праз 48 дзён|Personalausweis läuft in 48 Tagen ab
Recepty mamy do odebrania|Mum's prescriptions to collect|Рецепти мами треба отримати|Рэцэпты мамы трэба атрымаць|Rezepte der Mutter abholen
Sprawdź prognozę emerytury|Check your pension forecast|Перевірте прогноз пенсії|Праверце прагноз пенсіі|Rentenprognose prüfen
Mandat 200 zł i 3 punkty karne|200 zł fine and 3 penalty points|Штраф 200 зл і 3 штрафні бали|Штраф 200 зл і 3 штрафныя балы|200 zł Bußgeld und 3 Strafpunkte
Głosuję w Gdańsku, nie w Elblągu|I vote in Gdańsk, not in Elbląg|Голосую в Гданську, а не в Ельблонзі|Галасую ў Гданьску, а не ў Эльблонгу|Ich wähle in Gdańsk, nicht in Elbląg
Legitymacja studencka w telefonie|Student ID on your phone|Студентський квиток у телефоні|Студэнцкі білет у тэлефоне|Studierendenausweis auf dem Handy
Sprzeciw od nakazu zapłaty (e-Sąd)|Objection to a payment order (e-Sąd)|Заперечення на наказ про оплату (e-Sąd)|Пярэчанне на загад аб аплаце (e-Sąd)|Einspruch gegen Zahlungsbefehl (e-Sąd)
OC Corolli (WX 12345)|Corolla insurance (WX 12345)|Поліс OC Corolla (WX 12345)|Поліс OC Corolla (WX 12345)|Haftpflicht Corolla (WX 12345)
Rozprawa I C 1234/26|Court hearing I C 1234/26|Судове засідання I C 1234/26|Судовае пасяджэнне I C 1234/26|Gerichtsverhandlung I C 1234/26
Badanie techniczne pojazdu|Vehicle inspection|Техогляд автомобіля|Тэхагляд аўтамабіля|Fahrzeuguntersuchung
Wyjaśnienia VAT dla US|VAT explanation for the tax office|Пояснення щодо ПДВ для податкової|Тлумачэнні па ПДВ для падатковай|USt-Erklärung fürs Finanzamt
Rata kredytu na auto|Car loan instalment|Платіж за автокредитом|Плацёж па аўтакрэдыце|Rate des Autokredits
OC busa (KR 7788A)|Van insurance (KR 7788A)|Поліс OC мікроавтобуса (KR 7788A)|Поліс OC мікрааўтобуса (KR 7788A)|Haftpflicht Transporter (KR 7788A)
Ważność dowodu osobistego|ID card validity|Строк дії посвідчення особи|Тэрмін дзеяння пасведчання асобы|Gültigkeit des Personalausweises
Recepta mamy – Perindopryl|Mum's prescription – perindopril|Рецепт мами – периндоприл|Рэцэпт мамы – перындаприл|Rezept der Mutter – Perindopril
Zapłata mandatu|Pay the fine|Сплата штрафу|Аплата штрафу|Bußgeld bezahlen
Wybory – zmiana miejsca głosowania|Elections – change of voting place|Вибори – зміна місця голосування|Выбары – змена месца галасавання|Wahlen – Wahlort ändern
Kardiolog – Szpital Bielański|Cardiologist – Szpital Bielański|Кардіолог – Szpital Bielański|Кардыёлаг – Szpital Bielański|Kardiologe – Szpital Bielański
Ważność e-recepty: Atorwastatyna 20 mg|E-prescription validity: atorvastatin 20 mg|Строк дії е-рецепта: аторвастатин 20 мг|Тэрмін дзеяння э-рэцэпта: аторвастатын 20 мг|Gültigkeit des E-Rezepts: Atorvastatin 20 mg
Próba syren – zgłoś słyszalność (Syrena 26)|Siren test – report whether you heard it (Syrena 26)|Перевірка сирен – повідомте, чи чути (Syrena 26)|Праверка сірэн – паведаміце, ці чуваць (Syrena 26)|Sirenentest – Hörbarkeit melden (Syrena 26)
Dowód osobisty traci ważność|ID card expires|Посвідчення особи втрачає чинність|Пасведчанне асобы губляе сілу|Personalausweis läuft ab
Do załatwienia|To do|Справи|Справы|Zu erledigen
Dotknij sprawy, a asystent przeprowadzi Cię przez nią do końca.|Tap a matter and the assistant will guide you through to the end.|Торкніться справи, і асистент проведе вас до кінця.|Дакраніцеся да справы, і памочнік правядзе вас да канца.|Tippen Sie auf eine Angelegenheit – der Assistent führt Sie bis zum Ende.
Otwórz sprawę|Open|Відкрити справу|Адкрыць справу|Öffnen
Najbliższe terminy|Upcoming deadlines|Найближчі строки|Бліжэйшыя тэрміны|Nächste Fristen
Nadchodzące terminy|Upcoming deadlines|Найближчі строки|Бліжэйшыя тэрміны|Nächste Fristen
Co mnie dotyczy (profil na telefonie)|What applies to me (profile on this phone)|Що мене стосується (профіль у телефоні)|Што мяне датычыцца (профіль у тэлефоне)|Was betrifft mich (Profil auf dem Handy)
Wszystkie terminy|All deadlines|Усі строки|Усе тэрміны|Alle Fristen
Pełny prototyp z działającym asystentem AI|Full prototype with a working AI assistant|Повний прототип із робочим ШІ-асистентом|Поўны прататып з працоўным памочнікам ШІ|Vollständiger Prototyp mit funktionierendem KI-Assistenten
bez płatnych API|no paid APIs|без платних API|без платных API|ohne kostenpflichtige APIs
mObywatel 3.0: asystent, który doprowadza sprawę do końca|mObywatel 3.0: an assistant that sees each matter through|mObywatel 3.0: асистент, який доводить справу до кінця|mObywatel 3.0: памочнік, які даводзіць справу да канца|mObywatel 3.0: ein Assistent, der jede Sache zu Ende bringt
Klikalny prototyp z prawdziwym asystentem. Powiedz albo napisz, co chcesz załatwić, a asystent przeprowadzi Cię przez sprawę i poprosi o zgodę, zanim cokolwiek wyśle.|A clickable prototype with a real assistant. Say or type what you need, and the assistant guides you through it and asks for consent before sending anything.|Клікабельний прототип зі справжнім асистентом. Скажіть або напишіть, що потрібно залагодити, і асистент проведе вас через справу та попросить згоди, перш ніж щось надіслати.|Клікабельны прататып з сапраўдным памочнікам. Скажыце або напішыце, што трэба зрабіць, і памочнік правядзе вас праз справу і папросіць згоды, перш чым нешта адправіць.|Ein klickbarer Prototyp mit echtem Assistenten. Sagen oder schreiben Sie, was Sie erledigen möchten – der Assistent führt Sie durch und fragt um Zustimmung, bevor er etwas sendet.
Osoba w pokazie|Demo person|Особа в демонстрації|Асоба ў паказе|Person in der Demo
Wysoki kontrast|High contrast|Висока контрастність|Высокі кантраст|Hoher Kontrast
Od nowa|Start over|Почати знову|Пачаць нанова|Neu starten
Co sprawdzić|What to try|Що перевірити|Што праверыць|Was ausprobieren
Napisz albo powiedz na dole ekranu, co chcesz załatwić, np. „zgubiłem portfel”. Odpowiada asystent: Gemma, a gdy nie działa, reguły w telefonie i polski model Bielik w przeglądarce.|Type or say at the bottom of the screen what you need, e.g. "I lost my wallet". The assistant answers: Gemma, and if it is unavailable, rules on the phone and the Polish model Bielik in the browser.|Напишіть або скажіть унизу екрана, що потрібно, напр. «я загубив гаманець». Відповідає асистент: Gemma, а якщо вона недоступна – правила в телефоні й польська модель Bielik у браузері.|Напішыце або скажыце ўнізе экрана, што трэба, напр. «я згубіў кашалёк». Адказвае памочнік: Gemma, а калі яна недаступная – правілы ў тэлефоне і польская мадэль Bielik у браўзеры.|Schreiben oder sagen Sie unten, was Sie erledigen möchten, z. B. „Ich habe meine Geldbörse verloren“. Es antwortet der Assistent: Gemma, sonst Regeln im Handy und das polnische Modell Bielik im Browser.
Dotknij sprawy pod dokumentami. Asystent prowadzi ją do końca, z potwierdzeniem przed wysłaniem.|Tap a matter below the documents. The assistant takes it to the end, with confirmation before sending.|Торкніться справи під документами. Асистент доводить її до кінця з підтвердженням перед надсиланням.|Дакраніцеся да справы пад дакументамі. Памочнік даводзіць яе да канца з пацвярджэннем перад адпраўкай.|Tippen Sie auf eine Angelegenheit unter den Dokumenten. Der Assistent bringt sie zu Ende – mit Bestätigung vor dem Senden.
Włącz tryb seniora przyciskiem Aa w górnym pasku: duże litery, prosty język i czytanie na głos.|Turn on senior mode with the Aa button in the top bar: large text, plain language and reading aloud.|Увімкніть режим для літніх кнопкою Aa вгорі: великі літери, проста мова й читання вголос.|Уключыце рэжым для пажылых кнопкай Aa уверсе: вялікія літары, простая мова і чытанне ўголас.|Schalten Sie den Seniorenmodus mit Aa oben ein: große Schrift, einfache Sprache und Vorlesen.
Zmień osobę. Każda ma inne dokumenty i sprawy, a rodzic widzi sprawy dzieci.|Switch person. Each has different documents and matters, and a parent sees the children's matters.|Змініть особу. Кожна має інші документи та справи, а батьки бачать справи дітей.|Змяніце асобу. Кожная мае іншыя дакументы і справы, а бацькі бачаць справы дзяцей.|Wechseln Sie die Person. Jede hat eigene Dokumente und Angelegenheiten, Eltern sehen die ihrer Kinder.
Dostałeś pismo z urzędu? Asystent wyjaśni je prostymi słowami i przygotuje szkic odpowiedzi.|Got a letter from an office? The assistant explains it in simple words and drafts a reply.|Отримали лист з установи? Асистент пояснить його простими словами й підготує чернетку відповіді.|Атрымалі ліст з установы? Памочнік растлумачыць яго простымі словамі і падрыхтуе чарнавік адказу.|Post vom Amt? Der Assistent erklärt sie in einfachen Worten und entwirft eine Antwort.
Przekaż firmie tylko to, co trzeba: „18+” albo „kat. B”, bez PESEL-u i adresu. Spróbuj ze stroną wypożyczalni na drugim urządzeniu.|Give a company only what it needs: "18+" or "cat. B", without your PESEL or address. Try it with the rental company page on a second device.|Передайте фірмі лише необхідне: «18+» або «кат. B», без PESEL та адреси. Спробуйте зі сторінкою прокату на другому пристрої.|Перадайце фірме толькі патрэбнае: «18+» або «кат. B», без PESEL і адраса. Паспрабуйце са старонкай пракату на другой прыладзе.|Geben Sie einer Firma nur das Nötige: „18+“ oder „Klasse B“, ohne PESEL und Adresse. Probieren Sie es mit der Seite der Autovermietung auf einem zweiten Gerät.
Zanim pytanie trafi do AI, telefon wykrywa PESEL, numer dowodu i IBAN i proponuje je zamaskować.|Before a question goes to the AI, the phone detects PESEL, ID number and IBAN and offers to mask them.|Перш ніж питання потрапить до ШІ, телефон виявляє PESEL, номер документа та IBAN і пропонує їх приховати.|Перш чым пытанне трапіць да ШІ, тэлефон выяўляе PESEL, нумар дакумента і IBAN і прапануе іх схаваць.|Bevor eine Frage an die KI geht, erkennt das Handy PESEL, Ausweisnummer und IBAN und bietet an, sie zu maskieren.
Tryb alarmowy: co robić krok po kroku, najbliższe schrony z aplikacji „Gdzie się ukryć PL” i wiadomość do bliskich.|Alarm mode: what to do step by step, nearest shelters from the "Gdzie się ukryć PL" app and a message to your family.|Режим тривоги: що робити крок за кроком, найближчі укриття із застосунку «Gdzie się ukryć PL» і повідомлення рідним.|Рэжым трывогі: што рабіць крок за крокам, бліжэйшыя сховішчы з праграмы «Gdzie się ukryć PL» і паведамленне блізкім.|Alarmmodus: Schritt für Schritt, nächste Schutzräume aus der App „Gdzie się ukryć PL“ und eine Nachricht an Angehörige.
Konta rodziny|Family accounts|Сімейні акаунти|Сямейныя акаўнты|Familienkonten
Pismo po ludzku|Letters in plain language|Листи простою мовою|Лісты простай мовай|Schreiben in einfacher Sprache
Gdzie trafia pytanie|Where your question goes|Куди потрапляє питання|Куды трапляе пытанне|Wohin Ihre Frage geht
Bezpieczeństwo|Safety|Безпека|Бяспека|Sicherheit
Pokaz na dwóch urządzeniach|Demo on two devices|Демонстрація на двох пристроях|Паказ на дзвюх прыладах|Demo auf zwei Geräten
Zeskanuj kod telefonem, żeby otworzyć prototyp u siebie. Potem otwórz na komputerze|Scan the code with your phone to open the prototype there. Then, on a computer, open the|Відскануйте код телефоном, щоб відкрити прототип у себе. Потім відкрийте на комп'ютері|Адсканіруйце код тэлефонам, каб адкрыць прататып у сябе. Потым адкрыйце на камп'ютары|Scannen Sie den Code mit dem Handy, um den Prototyp dort zu öffnen. Öffnen Sie dann am Computer die
stronę wypożyczalni|rental company page|сторінку прокату|старонку пракату|Seite der Autovermietung
i przekaż jej dane z telefonu.|and send it data from your phone.|і передайте їй дані з телефона.|і перадайце ёй даныя з тэлефона.|und geben Sie ihr Daten vom Handy.
Czym różni się od prototypu wzorcowego|How it differs from the reference prototype|Чим відрізняється від еталонного прототипу|Чым адрозніваецца ад эталоннага прататыпа|Was anders ist als beim Referenzprototyp
Asystent działa w tej wersji przeglądarkowej. Według strony konkursu wersja przeglądarkowa prototypu wzorcowego działa na przygotowanych scenariuszach.|The assistant works in this browser version. According to the contest page, the browser version of the reference prototype runs on prepared scripts.|Асистент працює в цій браузерній версії. За даними сторінки конкурсу, браузерна версія еталонного прототипу працює на підготовлених сценаріях.|Памочнік працуе ў гэтай браўзернай версіі. Паводле старонкі конкурсу, браўзерная версія эталоннага прататыпа працуе на падрыхтаваных сцэнарыях.|Der Assistent funktioniert in dieser Browserversion. Laut Wettbewerbsseite arbeitet die Browserversion des Referenzprototyps mit vorbereiteten Szenarien.
Polski model Bielik może działać w samej przeglądarce, bez płatnych API i bez wysyłania pytań na serwer.|The Polish model Bielik can run in the browser alone, without paid APIs and without sending questions to a server.|Польська модель Bielik може працювати просто в браузері, без платних API і без надсилання питань на сервер.|Польская мадэль Bielik можа працаваць проста ў браўзеры, без платных API і без адпраўкі пытанняў на сервер.|Das polnische Modell Bielik kann allein im Browser laufen, ohne kostenpflichtige APIs und ohne Fragen an einen Server zu senden.
Tryb seniora jednym dotknięciem, wysoki kontrast i czytanie na głos.|Senior mode in one tap, high contrast and reading aloud.|Режим для літніх одним дотиком, висока контрастність і читання вголос.|Рэжым для пажылых адным дотыкам, высокі кантраст і чытанне ўголас.|Seniorenmodus mit einem Tipp, hoher Kontrast und Vorlesen.
Konta rodziny, upoważnienia i lekcje „Wnuk uczy babcię”.|Family accounts, authorisations and "Grandchild teaches Grandma" lessons.|Сімейні акаунти, доручення й уроки «Онук навчає бабусю».|Сямейныя акаўнты, даверанасці і ўрокі «Унук вучыць бабулю».|Familienkonten, Vollmachten und Lektionen „Enkel hilft Oma“.
Przed wysłaniem pytania do AI telefon ukrywa PESEL, numer dowodu i IBAN, jeśli chcesz.|Before sending a question to the AI, the phone hides your PESEL, ID number and IBAN if you want.|Перед надсиланням питання до ШІ телефон приховує PESEL, номер документа та IBAN, якщо ви хочете.|Перад адпраўкай пытання да ШІ тэлефон хавае PESEL, нумар дакумента і IBAN, калі вы хочаце.|Vor dem Senden an die KI verbirgt das Handy auf Wunsch PESEL, Ausweisnummer und IBAN.
Przekazanie danych bez serwera: firma dostaje same potwierdzenia, a kod ma termin ważności i można go cofnąć.|Data sharing without a server: the company gets only confirmations, and the code expires and can be withdrawn.|Передавання даних без сервера: фірма отримує лише підтвердження, а код має строк дії, і його можна відкликати.|Перадача даных без сервера: фірма атрымлівае толькі пацвярджэнні, а код мае тэрмін дзеяння, і яго можна адклікаць.|Datenweitergabe ohne Server: Die Firma erhält nur Bestätigungen, der Code läuft ab und kann widerrufen werden.
Ponad 180 ekranów: od pisma z urzędu i e-recepty po tryb alarmowy i schrony.|Over 180 screens: from official letters and e-prescriptions to alarm mode and shelters.|Понад 180 екранів: від листів з установ і е-рецептів до режиму тривоги та укриттів.|Больш за 180 экранаў: ад лістоў з устаноў і э-рэцэптаў да рэжыму трывогі і сховішчаў.|Über 180 Bildschirme: von Behördenschreiben und E-Rezepten bis Alarmmodus und Schutzräume.
Wszystkie ekrany (pełna lista)|All screens (full list)|Усі екрани (повний список)|Усе экраны (поўны спіс)|Alle Bildschirme (vollständige Liste)
Osoby i dane są fikcyjne (DEMO). To koncepcja konkursowa, nie oficjalna aplikacja mObywatel ani usługa administracji publicznej. Autor: Tomasz Krawczyk ·|People and data are fictional (DEMO). This is a contest concept, not the official mObywatel app or a public administration service. Author: Tomasz Krawczyk ·|Особи й дані вигадані (DEMO). Це конкурсна концепція, а не офіційний застосунок mObywatel чи державна послуга. Автор: Tomasz Krawczyk ·|Асобы і даныя выдуманыя (DEMO). Гэта конкурсная канцэпцыя, а не афіцыйная праграма mObywatel ці дзяржаўная паслуга. Аўтар: Tomasz Krawczyk ·|Personen und Daten sind fiktiv (DEMO). Dies ist ein Wettbewerbskonzept, nicht die offizielle mObywatel-App und kein Dienst der öffentlichen Verwaltung. Autor: Tomasz Krawczyk ·
kod źródłowy|source code|вихідний код|зыходны код|Quellcode
Wyłącz tryb pokazu|Turn off showcase mode|Вимкнути режим показу|Выключыць рэжым паказу|Präsentationsmodus ausschalten
AutoNajem – formularz kierowcy|AutoNajem – driver form|AutoNajem – анкета водія|AutoNajem – анкета вадзіцеля|AutoNajem – Fahrerformular
To jest strona firmy, czyli „druga strona”|This is the company's page – the "other side"|Це сторінка фірми, тобто «друга сторона»|Гэта старонка фірмы, г. зн. «другі бок»|Dies ist die Seite der Firma – die „andere Seite“
Otwórz ją na komputerze albo drugim telefonie. Wypożyczalnia jest fikcyjna.|Open it on a computer or a second phone. The rental company is fictional.|Відкрийте її на комп'ютері або другому телефоні. Прокат вигаданий.|Адкрыйце яе на камп'ютары або другім тэлефоне. Пракат выдуманы.|Öffnen Sie sie am Computer oder auf einem zweiten Handy. Die Vermietung ist fiktiv.
wypożyczalnia aut|car rental|прокат авто|пракат аўто|Autovermietung
Potrzebujemy potwierdzić kierowcę|We need to confirm the driver|Нам потрібно підтвердити водія|Нам трэба пацвердзіць вадзіцеля|Wir müssen den Fahrer bestätigen
Jestem prawdziwą osobą|I am a real person|Я справжня людина|Я сапраўдны чалавек|Ich bin eine echte Person
Mam ukończone 21 lat|I am 21 or older|Мені виповнився 21 рік|Мне споўніўся 21 год|Ich bin mindestens 21
Prawo jazdy kat. B|Driving licence cat. B|Посвідчення водія кат. B|Вадзіцельскае пасведчанне кат. B|Führerschein Klasse B
Imię i nazwisko (do umowy)|Full name (for the contract)|Ім'я та прізвище (для договору)|Імя і прозвішча (для дагавора)|Vor- und Nachname (für den Vertrag)
Nie prosimy o PESEL, adres ani skan dowodu.|We do not ask for your PESEL, address or an ID scan.|Ми не просимо PESEL, адресу чи скан посвідчення.|Мы не просім PESEL, адрас ці скан пасведчання.|Wir fragen nicht nach PESEL, Adresse oder Ausweisscan.
Klient skanuje ten kod w mObywatelu|The customer scans this code in mObywatel|Клієнт сканує цей код у mObywatel|Кліент скануе гэты код у mObywatel|Der Kunde scannt diesen Code in mObywatel
kod nie zawiera żadnych danych|the code contains no data|код не містить жодних даних|код не змяшчае ніякіх даных|der Code enthält keine Daten
Pokaz na jednym urządzeniu: otwórz prośbę jak klient|One-device demo: open the request as the customer|Демонстрація на одному пристрої: відкрийте запит як клієнт|Паказ на адной прыладзе: адкрыйце запыт як кліент|Demo auf einem Gerät: Anfrage als Kunde öffnen
Firma skanuje kod klienta|The company scans the customer's code|Фірма сканує код клієнта|Фірма скануе код кліента|Die Firma scannt den Code des Kunden
Klient pokazuje kod odpowiedzi. Pracownik skanuje go zwykłym aparatem telefonu albo przyciskiem poniżej, a ta strona sama sprawdza, czy kod jest ważny i nie został zmieniony.|The customer shows the reply code. An employee scans it with a normal phone camera or the button below, and this page checks that the code is valid and unchanged.|Клієнт показує код відповіді. Працівник сканує його звичайною камерою телефона або кнопкою нижче, а ця сторінка сама перевіряє, чи код дійсний і не змінений.|Кліент паказвае код адказу. Супрацоўнік скануе яго звычайнай камерай тэлефона або кнопкай ніжэй, а гэтая старонка сама правярае, ці код сапраўдны і не зменены.|Der Kunde zeigt den Antwortcode. Ein Mitarbeiter scannt ihn mit der normalen Handykamera oder dem Knopf unten; diese Seite prüft, ob er gültig und unverändert ist.
Zeskanuj kod klienta|Scan the customer's code|Сканувати код клієнта|Сканаваць код кліента|Code des Kunden scannen
Bez serwera: dane jadą tylko w kodzie, prosto z telefonu klienta do firmy. W prawdziwej usłudze kod podpisywałby wystawca dokumentu, a firma sprawdzałaby też, czy klient go nie cofnął. Tu podpis jest demonstracyjny.|No server: the data travels only inside the code, straight from the customer's phone to the company. In a real service the document issuer would sign the code, and the company would also check that the customer has not withdrawn it. Here the signature is a demo.|Без сервера: дані передаються лише в коді, напряму з телефона клієнта до фірми. У справжній послузі код підписував би видавець документа, а фірма також перевіряла б, чи клієнт його не відкликав. Тут підпис демонстраційний.|Без сервера: даныя перадаюцца толькі ў кодзе, наўпрост з тэлефона кліента да фірмы. У сапраўднай паслузе код падпісваў бы выдавец дакумента, а фірма таксама правярала б, ці кліент яго не адклікаў. Тут подпіс дэманстрацыйны.|Ohne Server: Die Daten reisen nur im Code, direkt vom Handy des Kunden zur Firma. In einem echten Dienst würde der Aussteller des Dokuments den Code signieren, und die Firma würde auch prüfen, ob der Kunde ihn widerrufen hat. Hier ist die Signatur nur eine Demo.
Prośba o dane|Data request|Запит на дані|Запыт на даныя|Datenanfrage
AutoNajem DEMO prosi o potwierdzenie kierowcy.|AutoNajem DEMO asks to confirm the driver.|AutoNajem DEMO просить підтвердити водія.|AutoNajem DEMO просіць пацвердзіць вадзіцеля.|AutoNajem DEMO bittet um Bestätigung des Fahrers.
Czego firma nie zobaczy|What the company will not see|Чого фірма не побачить|Чаго фірма не ўбачыць|Was die Firma nicht sieht
Data urodzenia|Date of birth|Дата народження|Дата нараджэння|Geburtsdatum
Adres|Address|Адреса|Адрас|Adresse
Seria i numer dowodu|ID card series and number|Серія та номер посвідчення|Серыя і нумар пасведчання|Ausweisnummer
Zdjęcie|Photo|Фото|Фота|Foto
Punkty karne i mandaty|Penalty points and fines|Штрафні бали та штрафи|Штрафныя балы і штрафы|Strafpunkte und Bußgelder
W pokazie masz mniej niż 21 lat, więc firma zobaczy odpowiedź „NIE”. Telefon nie podaje przy tym daty urodzenia.|In the demo you are under 21, so the company will see "NO". The phone does not reveal your date of birth.|У демонстрації вам менше 21 року, тож фірма побачить відповідь «НІ». Дату народження телефон при цьому не показує.|У паказе вам менш за 21 год, таму фірма ўбачыць адказ «НЕ». Дату нараджэння тэлефон пры гэтым не паказвае.|In der Demo sind Sie unter 21, die Firma sieht also „NEIN“. Das Geburtsdatum gibt das Handy nicht preis.
Potwierdź i pokaż kod (DEMO)|Confirm and show code (DEMO)|Підтвердити й показати код (DEMO)|Пацвердзіць і паказаць код (DEMO)|Bestätigen und Code zeigen (DEMO)
Odmów|Decline|Відмовити|Адмовіць|Ablehnen
TAK|YES|ТАК|ТАК|JA
NIE|NO|НІ|НЕ|NEIN
Potwierdź przekazanie|Confirm sharing|Підтвердіть передавання|Пацвердзіце перадачу|Weitergabe bestätigen
W prawdziwej aplikacji tu jest Face ID, odcisk palca albo PIN. W pokazie wpisz dowolne 4 cyfry.|In the real app this would be Face ID, a fingerprint or a PIN. In the demo, enter any 4 digits.|У справжньому застосунку тут Face ID, відбиток пальця або PIN. У демонстрації введіть будь-які 4 цифри.|У сапраўднай праграме тут Face ID, адбітак пальца або PIN. У паказе ўвядзіце любыя 4 лічбы.|In der echten App wäre hier Face ID, Fingerabdruck oder PIN. In der Demo beliebige 4 Ziffern eingeben.
Potwierdź|Confirm|Підтвердити|Пацвердзіць|Bestätigen
Anuluj|Cancel|Скасувати|Скасаваць|Abbrechen
Zamknij|Close|Закрити|Закрыць|Schließen
Pokaż kod firmie|Show the code to the company|Покажіть код фірмі|Пакажыце код фірме|Code der Firma zeigen
Kod ważny 15 minut.|Code valid for 15 minutes.|Код дійсний 15 хвилин.|Код сапраўдны 15 хвілін.|Code 15 Minuten gültig.
Kod wygasł.|The code has expired.|Строк дії коду минув.|Тэрмін дзеяння кода скончыўся.|Der Code ist abgelaufen.
Firma skanuje go aparatem. Dane są tylko w kodzie, nie na serwerze|The company scans it with a camera. The data is only in the code, not on a server|Фірма сканує його камерою. Дані є лише в коді, не на сервері|Фірма скануе яго камерай. Даныя ёсць толькі ў кодзе, не на серверы|Die Firma scannt ihn mit der Kamera. Die Daten sind nur im Code, nicht auf einem Server
Pokaz na jednym urządzeniu: zobacz ekran firmy|One-device demo: see the company's screen|Демонстрація на одному пристрої: екран фірми|Паказ на адной прыладзе: экран фірмы|Demo auf einem Gerät: Bildschirm der Firma ansehen
Moje udostępnienia|My shares|Мої передавання даних|Мае перадачы даных|Meine Freigaben
Wynik sprawdzenia|Check result|Результат перевірки|Вынік праверкі|Prüfergebnis
Dane potwierdzone (DEMO).|Data confirmed (DEMO).|Дані підтверджено (DEMO).|Даныя пацверджаны (DEMO).|Daten bestätigt (DEMO).
Podpis demonstracyjny się zgadza, a kod jest ważny.|The demo signature matches and the code is valid.|Демонстраційний підпис збігається, а код дійсний.|Дэманстрацыйны подпіс супадае, а код сапраўдны.|Die Demo-Signatur stimmt und der Code ist gültig.
Nie da się odczytać kodu.|The code cannot be read.|Код неможливо прочитати.|Код немагчыма прачытаць.|Der Code ist nicht lesbar.
Poproś klienta o nowy kod.|Ask the customer for a new code.|Попросіть клієнта про новий код.|Папрасіце кліента пра новы код.|Bitten Sie den Kunden um einen neuen Code.
Kod zmieniony albo uszkodzony.|Code altered or damaged.|Код змінено або пошкоджено.|Код зменены або пашкоджаны.|Code verändert oder beschädigt.
Podpis się nie zgadza. Nie przyjmuj tych danych.|The signature does not match. Do not accept this data.|Підпис не збігається. Не приймайте ці дані.|Подпіс не супадае. Не прымайце гэтыя даныя.|Die Signatur stimmt nicht. Daten nicht annehmen.
Firma widzi tylko to|The company sees only this|Фірма бачить лише це|Фірма бачыць толькі гэта|Die Firma sieht nur das
Firma nie dostała|The company did not get|Фірма не отримала|Фірма не атрымала|Die Firma hat nicht erhalten
To strona demonstracyjna prototypu konkursowego. Kod nie jest ważny w żadnej prawdziwej firmie ani urzędzie. W prawdziwej usłudze kod podpisywałby wystawca dokumentu, a firma sprawdzałaby też, czy klient go nie cofnął.|This is a demo page of a contest prototype. The code is not valid at any real company or office. In a real service the document issuer would sign the code, and the company would also check that the customer has not withdrawn it.|Це демонстраційна сторінка конкурсного прототипу. Код недійсний у жодній справжній фірмі чи установі. У справжній послузі код підписував би видавець документа, а фірма також перевіряла б, чи клієнт його не відкликав.|Гэта дэманстрацыйная старонка конкурснага прататыпа. Код несапраўдны ні ў якой сапраўднай фірме ці ўстанове. У сапраўднай паслузе код падпісваў бы выдавец дакумента, а фірма таксама правярала б, ці кліент яго не адклікаў.|Dies ist eine Demoseite eines Wettbewerbsprototyps. Der Code gilt bei keiner echten Firma oder Behörde. In einem echten Dienst würde der Aussteller den Code signieren, und die Firma würde prüfen, ob er widerrufen wurde.
Nowa prośba wypożyczalni|New rental request|Новий запит прокату|Новы запыт пракату|Neue Anfrage der Vermietung
Zobacz, co zobaczy firma|See what the company will see|Подивіться, що побачить фірма|Паглядзіце, што ўбачыць фірма|Sehen, was die Firma sieht
O prototypie|About the prototype|Про прототип|Пра прататып|Über den Prototyp
O prototypie i co sprawdzić|About the prototype and what to try|Про прототип і що перевірити|Пра прататып і што праверыць|Über den Prototyp und was ausprobieren
Druga strona: wypożyczalnia (DEMO)|Other side: rental company (DEMO)|Друга сторона: прокат (DEMO)|Другі бок: пракат (DEMO)|Andere Seite: Autovermietung (DEMO)
Ustawienia i dostępność|Settings and accessibility|Налаштування та доступність|Налады і даступнасць|Einstellungen und Barrierefreiheit
Dla seniorów i dostępność|For seniors and accessibility|Для літніх людей і доступність|Для пажылых людзей і даступнасць|Für Senioren und Barrierefreiheit
Duży tekst i duże przyciski (+ czytanie na głos 🔊)|Large text and large buttons (+ reading aloud 🔊)|Великий текст і великі кнопки (+ читання вголос 🔊)|Вялікі тэкст і вялікія кнопкі (+ чытанне ўголас 🔊)|Große Schrift und große Tasten (+ Vorlesen 🔊)
Prosty język|Plain language|Проста мова|Простая мова|Einfache Sprache
Włącz wszystko jednym przyciskiem|Turn everything on with one button|Увімкнути все однією кнопкою|Уключыць усё адной кнопкай|Alles mit einem Knopf einschalten
Mój profil życiowy|My life profile|Мій життєвий профіль|Мой жыццёвы профіль|Mein Lebensprofil
Profil nie jest zapisany.|No profile saved.|Профіль не збережено.|Профіль не захаваны.|Kein Profil gespeichert.
Otwórz profil|Open profile|Відкрити профіль|Адкрыць профіль|Profil öffnen
Lekcje ze starszą osobą|Lessons with an older person|Уроки зі старшою людиною|Урокі са старэйшым чалавекам|Lektionen mit einer älteren Person
Wnuk uczy babcię|Grandchild teaches Grandma|Онук навчає бабусю|Унук вучыць бабулю|Enkel hilft Oma
Otwórz tryb alarmowy|Open alarm mode|Відкрити режим тривоги|Адкрыць рэжым трывогі|Alarmmodus öffnen
Zaufana osoba (pełnomocnik cyfrowy)|Trusted person (digital proxy)|Довірена особа (цифровий представник)|Давераная асоба (лічбавы прадстаўнік)|Vertrauensperson (digitale Vollmacht)
Imię i telefon|Name and phone|Ім'я та телефон|Імя і тэлефон|Name und Telefon
Dodaj zaufaną osobę|Add a trusted person|Додати довірену особу|Дадаць давераную асобу|Vertrauensperson hinzufügen
Zapisz|Save|Зберегти|Захаваць|Speichern
Resetuj dane demo|Reset demo data|Скинути демо-дані|Скінуць дэма-даныя|Demodaten zurücksetzen
Resetuj demo|Reset demo|Скинути демо|Скінуць дэма|Demo zurücksetzen
Polskie technologie|Polish technologies|Польські технології|Польскія тэхналогіі|Polnische Technologien
Model językowy – Bielik / PLLuM|Language model – Bielik / PLLuM|Мовна модель – Bielik / PLLuM|Моўная мадэль – Bielik / PLLuM|Sprachmodell – Bielik / PLLuM
Rozpoznawanie intencji|Intent recognition|Розпізнавання намірів|Распазнаванне намераў|Absichtserkennung
Reguły offline (domyślnie)|Offline rules (default)|Офлайн-правила (типово)|Афлайн-правілы (па змаўчанні)|Offline-Regeln (Standard)
Własny model|Own model|Власна модель|Уласная мадэль|Eigenes Modell
Gotowe ustawienia|Presets|Готові налаштування|Гатовыя налады|Voreinstellungen
Model|Model|Модель|Мадэль|Modell
Koncepcja konkursowa mObywatel Challenge, nie jest oficjalną aplikacją. Wszystkie dane są fikcyjne.|mObywatel Challenge contest concept, not an official app. All data is fictional.|Конкурсна концепція mObywatel Challenge, не офіційний застосунок. Усі дані вигадані.|Конкурсная канцэпцыя mObywatel Challenge, не афіцыйная праграма. Усе даныя выдуманыя.|Wettbewerbskonzept mObywatel Challenge, keine offizielle App. Alle Daten sind fiktiv.
Tryb seniora zostaje tu, gdzie był. Obok są lekcje, które młodsza osoba przechodzi razem na tym telefonie.|Senior mode stays where it was. Next to it are lessons a younger person goes through together on this phone.|Режим для літніх лишається на своєму місці. Поруч – уроки, які молодша людина проходить разом на цьому телефоні.|Рэжым для пажылых застаецца на сваім месцы. Побач – урокі, якія малодшы чалавек праходзіць разам на гэтым тэлефоне.|Der Seniorenmodus bleibt, wo er war. Daneben gibt es Lektionen, die eine jüngere Person gemeinsam auf diesem Handy durchgeht.
W trybie seniora przycisk jest duży i jest pierwszy na ekranie głównym. Działa też bez włączonego trybu seniora.|In senior mode the button is large and first on the home screen. It also works without senior mode.|У режимі для літніх кнопка велика й перша на головному екрані. Працює й без цього режиму.|У рэжыме для пажылых кнопка вялікая і першая на галоўным экране. Працуе і без гэтага рэжыму.|Im Seniorenmodus ist der Knopf groß und steht als Erstes auf dem Startbildschirm. Er funktioniert auch ohne Seniorenmodus.
Wzorem duńskiego MitID: bliska osoba może pomóc Ci w sprawach – widzi tylko to, na co pozwolisz, a każda akcja wymaga Twojej zgody.|Modelled on Denmark's MitID: someone close can help with your matters – they see only what you allow, and every action needs your consent.|За зразком данського MitID: близька людина може допомагати у справах – бачить лише те, що ви дозволите, а кожна дія потребує вашої згоди.|Па ўзоры дацкага MitID: блізкі чалавек можа дапамагаць у справах – бачыць толькі тое, што вы дазволіце, а кожнае дзеянне патрабуе вашай згоды.|Nach dem Vorbild des dänischen MitID: Eine nahestehende Person kann helfen – sie sieht nur, was Sie erlauben, und jede Aktion braucht Ihre Zustimmung.
To symulacja (DEMO).|This is a simulation (DEMO).|Це симуляція (DEMO).|Гэта сімуляцыя (DEMO).|Dies ist eine Simulation (DEMO).
W prawdziwym zagrożeniu dzwoń|In a real emergency call|У разі справжньої загрози телефонуйте|Пры сапраўднай пагрозе тэлефануйце|Bei echter Gefahr rufen Sie
i słuchaj służb oraz Alertu RCB. Ten ekran nikogo nie wzywa.|and follow the emergency services and RCB alerts. This screen does not call anyone.|і слухайте служби та сповіщення RCB. Цей екран нікого не викликає.|і слухайце службы і апавяшчэнні RCB. Гэты экран нікога не выклікае.|an und folgen Sie den Diensten und RCB-Warnungen. Dieser Bildschirm ruft niemanden.
Sześć krótkich kroków. Duże litery, bez szukania w menu.|Six short steps. Large text, no searching through menus.|Шість коротких кроків. Великі літери, без пошуку в меню.|Шэсць кароткіх крокаў. Вялікія літары, без пошуку ў меню.|Sechs kurze Schritte. Große Schrift, ohne Suchen im Menü.
Zostań w budynku. Nie wychodź na ulicę i nie stój przy oknie.|Stay inside. Do not go out into the street and do not stand by a window.|Залишайтеся в будівлі. Не виходьте на вулицю й не стійте біля вікна.|Заставайцеся ў будынку. Не выходзьце на вуліцу і не стойце каля акна.|Bleiben Sie im Gebäude. Gehen Sie nicht auf die Straße und stehen Sie nicht am Fenster.
Zejdź niżej albo wejdź do pokoju bez okien, jak najdalej od ściany zewnętrznej.|Go lower or into a room without windows, as far as possible from outside walls.|Спустіться нижче або зайдіть у кімнату без вікон, якомога далі від зовнішньої стіни.|Спусціцеся ніжэй або зайдзіце ў пакой без вокнаў, як мага далей ад знешняй сцяны.|Gehen Sie nach unten oder in einen fensterlosen Raum, möglichst weit weg von Außenwänden.
Weź telefon, wodę, leki i coś ciepłego. Dokumenty masz w tej aplikacji.|Take your phone, water, medicines and something warm. Your documents are in this app.|Візьміть телефон, воду, ліки й щось тепле. Документи є в цьому застосунку.|Вазьміце тэлефон, ваду, лекі і нешта цёплае. Дакументы ёсць у гэтай праграме.|Nehmen Sie Handy, Wasser, Medikamente und etwas Warmes mit. Ihre Dokumente sind in dieser App.
Jeśli ktoś jest ranny, dzwoń pod 112.|If someone is injured, call 112.|Якщо хтось поранений, телефонуйте 112.|Калі хтосьці паранены, тэлефануйце 112.|Wenn jemand verletzt ist, rufen Sie 112.
Nie nagrywaj i nie wysyłaj zdjęć miejsca, w które coś uderzyło.|Do not film or send photos of places that were hit.|Не знімайте й не надсилайте фото місця влучання.|Не здымайце і не адпраўляйце фота месца, куды нешта трапіла.|Filmen Sie keine Einschlagstellen und senden Sie keine Fotos davon.
Czekaj na odwołanie alarmu. Potem naciśnij zielony przycisk – rodzina na tym telefonie zobaczy, że jesteś bezpieczny albo bezpieczna.|Wait for the all-clear. Then press the green button – family on this phone will see that you are safe.|Чекайте на відбій тривоги. Потім натисніть зелену кнопку – родина на цьому телефоні побачить, що ви в безпеці.|Чакайце адбою трывогі. Потым націсніце зялёную кнопку – сям'я на гэтым тэлефоне ўбачыць, што вы ў бяспецы.|Warten Sie auf die Entwarnung. Drücken Sie dann den grünen Knopf – die Familie auf diesem Handy sieht, dass Sie in Sicherheit sind.
Przeczytaj kroki|Read the steps aloud|Прочитати кроки|Прачытаць крокі|Schritte vorlesen
Czytanie używa darmowej mowy przeglądarki (Web Speech API) i nic nie wysyła.|Reading uses the browser's free speech (Web Speech API) and sends nothing.|Читання використовує безплатне мовлення браузера (Web Speech API) і нічого не надсилає.|Чытанне выкарыстоўвае бясплатнае маўленне браўзера (Web Speech API) і нічога не адпраўляе.|Das Vorlesen nutzt die kostenlose Sprachausgabe des Browsers (Web Speech API) und sendet nichts.
DANE WYMYŚLONE|MADE-UP DATA|ВИГАДАНІ ДАНІ|ВЫДУМАНЫЯ ДАНЫЯ|ERFUNDENE DATEN
Najbliższe miejsce schronienia|Nearest shelter|Найближче укриття|Бліжэйшае сховішча|Nächster Schutzort
Nie idź pod ten adres. Taki obiekt nie istnieje.|Do not go to this address. No such place exists.|Не йдіть за цією адресою. Такого об'єкта не існує.|Не ідзіце па гэтым адрасе. Такога аб'екта не існуе.|Gehen Sie nicht zu dieser Adresse. Diesen Ort gibt es nicht.
Odległość nie pochodzi z GPS.|The distance is not from GPS.|Відстань не з GPS.|Адлегласць не з GPS.|Die Entfernung stammt nicht vom GPS.
Nazwa|Name|Назва|Назва|Name
Rodzaj|Type|Тип|Тып|Art
Adres z pokazu|Demo address|Адреса з демонстрації|Адрас з паказу|Demo-Adresse
Odległość w pokazie|Demo distance|Відстань у демонстрації|Адлегласць у паказе|Demo-Entfernung
Prawdziwe mapy prowadzą służby|Real maps are run by the services|Справжні мапи ведуть служби|Сапраўдныя мапы вядуць службы|Echte Karten führen die Behörden
Prawdziwe punkty schronienia|Real shelter points|Справжні пункти укриття|Сапраўдныя пункты сховішча|Echte Schutzpunkte
Schron powyżej jest wymyślony (DEMO). Prawdziwy najbliższy punkt pokaże mapa Państwowej Straży Pożarnej.|The shelter above is made up (DEMO). The real nearest point is shown on the State Fire Service map.|Укриття вище вигадане (DEMO). Справжній найближчий пункт покаже мапа Державної пожежної служби.|Сховішча вышэй выдуманае (DEMO). Сапраўдны бліжэйшы пункт пакажа мапа Дзяржаўнай пажарнай службы.|Der Schutzraum oben ist erfunden (DEMO). Den echten nächsten Punkt zeigt die Karte der Staatlichen Feuerwehr.
Otwórz gdziesieukryc.pl|Open gdziesieukryc.pl|Відкрити gdziesieukryc.pl|Адкрыць gdziesieukryc.pl|gdziesieukryc.pl öffnen
Rodzina na tym telefonie|Family on this phone|Родина на цьому телефоні|Сям'я на гэтым тэлефоне|Familie auf diesem Handy
to Ty|that's you|це ви|гэта вы|das sind Sie
brak potwierdzenia|not confirmed|немає підтвердження|няма пацвярджэння|nicht bestätigt
Jestem bezpieczny/bezpieczna|I am safe|Я в безпеці|Я ў бяспецы|Ich bin in Sicherheit
Jestem bezpieczny/a|I am safe|Я в безпеці|Я ў бяспецы|Ich bin in Sicherheit
Jeszcze nie potwierdzono dla aktualnej osoby.|Not yet confirmed for the current person.|Для поточної особи ще не підтверджено.|Для бягучай асобы яшчэ не пацверджана.|Für die aktuelle Person noch nicht bestätigt.
Plan rodzinny|Family plan|Сімейний план|Сямейны план|Familienplan
Plecak|Go-bag|Тривожна валіза|Трывожная валіза|Notfallrucksack
Alarmy i mapa|Alarms and map|Тривоги й мапа|Трывогі і мапа|Alarme und Karte
Zadzwoń 112|Call 112|Подзвонити 112|Патэлефанаваць 112|112 anrufen
Szkolenie cywilne MON, nie schron. Bezpłatne, dobrowolne, bez przysięgi.|Civil training by the Ministry of Defence, not a shelter. Free, voluntary, no oath.|Цивільне навчання Міноборони, не укриття. Безплатне, добровільне, без присяги.|Грамадзянскае навучанне Міністэрства абароны, не сховішча. Бясплатнае, добраахвотнае, без прысягі.|Zivile Schulung des Verteidigungsministeriums, kein Schutzraum. Kostenlos, freiwillig, ohne Eid.
Szkolenia wGotowości|wGotowości training|Навчання wGotowości|Навучанні wGotowości|Schulungen „wGotowości“
Tryb alarmowy|Alarm mode|Режим тривоги|Рэжым трывогі|Alarmmodus
Cichy alarm|Silent alarm|Тиха тривога|Ціхая трывога|Stiller Alarm
SYMULACJA – nic nie zostało wysłane.|SIMULATION – nothing was sent.|СИМУЛЯЦІЯ – нічого не надіслано.|СІМУЛЯЦЫЯ – нічога не адпраўлена.|SIMULATION – nichts wurde gesendet.
Nikt nie został powiadomiony i nie przekazano lokalizacji. W prawdziwym zagrożeniu dzwoń 112.|Nobody was notified and no location was shared. In a real emergency call 112.|Нікого не сповіщено, і місцезнаходження не передано. У разі справжньої загрози телефонуйте 112.|Нікога не апавешчана, і месцазнаходжанне не перададзена. Пры сапраўднай пагрозе тэлефануйце 112.|Niemand wurde benachrichtigt, kein Standort übermittelt. Bei echter Gefahr 112 anrufen.
Symulacja.|Simulation.|Симуляція.|Сімуляцыя.|Simulation.
W wersji docelowej: lokalizacja (AML) i krótki komunikat trafiają do centrum powiadamiania ratunkowego, a bliscy dostają SMS. Telefon nie wydaje dźwięku.|In the target version: your location (AML) and a short message go to the emergency call centre, and your family gets a text. The phone makes no sound.|У цільовій версії: місцезнаходження (AML) і коротке повідомлення надходять до центру екстреного виклику, а рідні отримують SMS. Телефон не видає звуку.|У мэтавай версіі: месцазнаходжанне (AML) і кароткае паведамленне трапляюць у цэнтр экстранага выкліку, а блізкія атрымліваюць SMS. Тэлефон не выдае гуку.|In der Zielversion gehen Standort (AML) und eine kurze Nachricht an die Notrufzentrale, Angehörige bekommen eine SMS. Das Handy bleibt stumm.
przytrzymaj 3 s|hold for 3 s|утримуйте 3 с|утрымлівайце 3 с|3 s gedrückt halten
Przytrzymaj 3 sekundy|Hold for 3 seconds|Утримуйте 3 секунди|Утрымлівайце 3 секунды|3 Sekunden gedrückt halten
Co zostałoby wysłane w wersji docelowej (w demo – nic)|What would be sent in the target version (in the demo – nothing)|Що було б надіслано в цільовій версії (у демо – нічого)|Што было б адпраўлена ў мэтавай версіі (у дэма – нічога)|Was in der Zielversion gesendet würde (in der Demo – nichts)
Lokalizacja|Location|Місцезнаходження|Месцазнаходжанне|Standort
GPS, co 30 s|GPS, every 30 s|GPS, кожні 30 с|GPS, кожныя 30 с|GPS, alle 30 s
Kto|Who|Хто|Хто|Wer
Bliscy|Family|Рідні|Блізкія|Angehörige
nie ustawiono|not set|не налаштовано|не наладжана|nicht festgelegt
dodaj|add|додати|дадаць|hinzufügen
Dźwięk otoczenia|Ambient sound|Звук довкілля|Гук наваколля|Umgebungsgeräusch
30 s (za zgodą)|30 s (with consent)|30 с (за згодою)|30 с (са згоды)|30 s (mit Zustimmung)
Karta medyczna|Medical card|Медична картка|Медыцынская картка|Notfallpass
edytuj|edit|редагувати|рэдагаваць|bearbeiten
Gdzie się ukryć – mapa PSP|Where to take shelter – fire service map|Де сховатися – мапа PSP|Дзе схавацца – мапа PSP|Wo Schutz suchen – Karte der Feuerwehr
Gdzie zejść w czasie alarmu – mapa Państwowej Straży Pożarnej.|Where to go during an alarm – State Fire Service map.|Куди спуститися під час тривоги – мапа Державної пожежної служби.|Куды спусціцца падчас трывогі – мапа Дзяржаўнай пажарнай службы.|Wohin bei Alarm – Karte der Staatlichen Feuerwehr.
Serwis zewnętrzny|External service|Зовнішній сервіс|Знешні сэрвіс|Externer Dienst
W zagrożeniu dzwoń|In danger, call|У разі загрози телефонуйте|Пры пагрозе тэлефануйце|Bei Gefahr rufen Sie
i słuchaj Alertu RCB oraz poleceń służb. Ten ekran nikogo nie wzywa.|and follow RCB alerts and instructions from the services. This screen does not call anyone.|і слухайте сповіщення RCB та вказівки служб. Цей екран нікого не викликає.|і слухайце апавяшчэнні RCB і ўказанні службаў. Гэты экран нікога не выклікае.|an und folgen Sie RCB-Warnungen und Anweisungen der Dienste. Dieser Bildschirm ruft niemanden.
Mapa ponad 88 tys. punktów schronienia w Polsce. Pokazuje najbliższe punkty, trasę pieszo, odległość i czas dojścia. Ma kompas, komunikaty głosowe, przycisk 112, poradniki i tryb uproszczony bez mapy.|A map of over 88,000 shelter points in Poland. It shows the nearest points, a walking route, distance and time. It has a compass, voice messages, a 112 button, guides and a simple mode without a map.|Мапа понад 88 тис. пунктів укриття в Польщі. Показує найближчі пункти, пішохідний маршрут, відстань і час. Має компас, голосові повідомлення, кнопку 112, поради та спрощений режим без мапи.|Мапа больш за 88 тыс. пунктаў сховішча ў Польшчы. Паказвае бліжэйшыя пункты, пешы маршрут, адлегласць і час. Мае компас, галасавыя паведамленні, кнопку 112, парады і спрошчаны рэжым без мапы.|Karte mit über 88.000 Schutzpunkten in Polen. Zeigt die nächsten Punkte, Fußweg, Entfernung und Zeit. Mit Kompass, Sprachansagen, 112-Taste, Ratgebern und einfachem Modus ohne Karte.
Prowadzi ją Komenda Główna Państwowej Straży Pożarnej.|It is run by the National Headquarters of the State Fire Service.|Її веде Головне управління Державної пожежної служби.|Яе вядзе Галоўнае ўпраўленне Дзяржаўнай пажарнай службы.|Betrieben vom Hauptkommando der Staatlichen Feuerwehr.
To nie jest część mObywatela ani tego prototypu. Prototyp otwiera tylko stronę lub sklep z aplikacją i nie wysyła tam Twoich danych.|This is not part of mObywatel or this prototype. The prototype only opens the website or app store and sends none of your data there.|Це не частина mObywatel чи цього прототипу. Прототип лише відкриває сайт або магазин застосунків і не надсилає туди ваших даних.|Гэта не частка mObywatel ці гэтага прататыпа. Прататып толькі адкрывае сайт або краму праграм і не адпраўляе туды вашых даных.|Das ist nicht Teil von mObywatel oder dieses Prototyps. Der Prototyp öffnet nur die Website oder den App-Store und sendet keine Daten.
Otwórz mapę gdziesieukryc.pl|Open the gdziesieukryc.pl map|Відкрити мапу gdziesieukryc.pl|Адкрыць мапу gdziesieukryc.pl|Karte gdziesieukryc.pl öffnen
Pobierz z Google Play|Get it on Google Play|Завантажити з Google Play|Спампаваць з Google Play|Bei Google Play laden
Przygotuj się zawczasu|Prepare in advance|Підготуйтеся заздалегідь|Падрыхтуйцеся загадзя|Bereiten Sie sich vor
Zainstaluj aplikację albo otwórz stronę, gdy jest spokojnie.|Install the app or open the site while things are calm.|Установіть застосунок або відкрийте сайт, поки спокійно.|Усталюйце праграму або адкрыйце сайт, пакуль спакойна.|Installieren Sie die App oder öffnen Sie die Seite, solange es ruhig ist.
Pobierz dane dla swojej okolicy. Potem mapa działa bez internetu.|Download data for your area. Then the map works offline.|Завантажте дані для своєї місцевості. Тоді мапа працює без інтернету.|Спампуйце даныя для сваёй мясцовасці. Тады мапа працуе без інтэрнэту.|Laden Sie Daten für Ihre Gegend. Dann funktioniert die Karte offline.
Sprawdź najbliższy punkt i przejdź trasę raz z rodziną.|Check the nearest point and walk the route once with your family.|Перевірте найближчий пункт і пройдіть маршрут разом із родиною.|Праверце бліжэйшы пункт і прайдзіце маршрут разам з сям'ёй.|Prüfen Sie den nächsten Punkt und gehen Sie den Weg einmal mit der Familie.
Punkt schronienia to nie zawsze schron. Obiekt musi być udostępniony w razie zagrożenia lub alarmu, więc na co dzień może być zamknięty.|A shelter point is not always a bunker. It must be opened in case of danger or an alarm, so day to day it may be closed.|Пункт укриття – не завжди сховище. Його мають відкрити в разі загрози чи тривоги, тож у звичайні дні він може бути зачинений.|Пункт сховішча – не заўсёды бункер. Яго павінны адкрыць пры пагрозе ці трывозе, таму ў звычайныя дні ён можа быць зачынены.|Ein Schutzpunkt ist nicht immer ein Bunker. Er muss bei Gefahr oder Alarm geöffnet werden und kann sonst geschlossen sein.
Poradniki PSP|Fire service guides|Поради PSP|Парады PSP|Ratgeber der Feuerwehr
Skąd to wiemy|How we know|Звідки ми це знаємо|Адкуль мы гэта ведаем|Woher wir das wissen
Źródło|Source|Джерело|Крыніца|Quelle
Alarmy i schrony|Alarms and shelters|Тривоги й укриття|Трывогі і сховішчы|Alarme und Schutzräume
Firma prosi o potwierdzenie, Ty wybierasz, co zobaczy.|A company asks for confirmation, you choose what it sees.|Фірма просить підтвердження, а ви обираєте, що вона побачить.|Фірма просіць пацвярджэння, а вы выбіраеце, што яна ўбачыць.|Eine Firma bittet um Bestätigung, Sie wählen, was sie sieht.
Zamiast całego dokumentu udostępniasz same odpowiedzi: „prawdziwa osoba”, „18+”, „prawo jazdy kat. B”. PESEL i adres zostają w telefonie.|Instead of the whole document you share only answers: "real person", "18+", "driving licence cat. B". Your PESEL and address stay on the phone.|Замість усього документа ви передаєте лише відповіді: «справжня людина», «18+», «посвідчення водія кат. B». PESEL і адреса лишаються в телефоні.|Замест усяго дакумента вы перадаеце толькі адказы: «сапраўдны чалавек», «18+», «вадзіцельскае пасведчанне кат. B». PESEL і адрас застаюцца ў тэлефоне.|Statt des ganzen Dokuments teilen Sie nur Antworten: „echte Person“, „18+“, „Führerschein Klasse B“. PESEL und Adresse bleiben auf dem Handy.
Kto prosi o potwierdzenie?|Who is asking for confirmation?|Хто просить підтвердження?|Хто просіць пацвярджэння?|Wer bittet um Bestätigung?
Rekruter|Recruiter|Рекрутер|Рэкрутэр|Personalvermittler
Portal z ofertami pracy (DEMO)|Job portal (DEMO)|Портал вакансій (DEMO)|Партал вакансій (DEMO)|Jobportal (DEMO)
Bank – wstępna oferta|Bank – initial offer|Банк – попередня пропозиція|Банк – папярэдняя прапанова|Bank – erstes Angebot
Wynajmujący mieszkanie|Landlord|Орендодавець квартири|Арэндадаўца кватэры|Vermieter
Właściciel mieszkania (DEMO)|Flat owner (DEMO)|Власник квартири (DEMO)|Уладальнік кватэры (DEMO)|Wohnungseigentümer (DEMO)
Sklep z produktem 18+|Shop with an 18+ product|Магазин із товаром 18+|Крама з таварам 18+|Shop mit 18+-Produkt
Sklep internetowy DEMO|Online shop DEMO|Інтернет-магазин DEMO|Інтэрнэт-крама DEMO|Onlineshop DEMO
Przychodnia – zapis online|Clinic – online sign-up|Поліклініка – запис онлайн|Паліклініка – запіс анлайн|Arztpraxis – Online-Anmeldung
Przychodnia DEMO|Clinic DEMO|Поліклініка DEMO|Паліклініка DEMO|Arztpraxis DEMO
Historia na tym telefonie. Każde aktywne możesz cofnąć jednym stuknięciem.|History on this phone. You can withdraw any active one with a tap.|Історія на цьому телефоні. Кожне активне можна відкликати одним дотиком.|Гісторыя на гэтым тэлефоне. Кожную актыўную можна адклікаць адным дотыкам.|Verlauf auf diesem Handy. Jede aktive Freigabe können Sie mit einem Tipp widerrufen.
Jak to działa|How it works|Як це працює|Як гэта працуе|So funktioniert es
Firma pokazuje, o co prosi i po co.|The company shows what it asks for and why.|Фірма показує, що просить і навіщо.|Фірма паказвае, што просіць і навошта.|Die Firma zeigt, was sie will und wozu.
Zaznaczasz tylko te potwierdzenia, które chcesz dać.|You tick only the confirmations you want to give.|Ви позначаєте лише ті підтвердження, які хочете надати.|Вы адзначаеце толькі тыя пацвярджэнні, якія хочаце даць.|Sie wählen nur die Bestätigungen, die Sie geben wollen.
Widzisz obok siebie|You see side by side|Ви бачите поруч|Вы бачыце побач|Sie sehen nebeneinander
co zobaczy firma|what the company will see|що побачить фірма|што ўбачыць фірма|was die Firma sieht
czego nie zobaczy|what it will not see|чого вона не побачить|чаго яна не ўбачыць|was sie nicht sieht
Dostajesz kod ważny 15 minut, 24 godziny albo 7 dni. Możesz go cofnąć wcześniej.|You get a code valid for 15 minutes, 24 hours or 7 days. You can withdraw it earlier.|Ви отримуєте код, дійсний 15 хвилин, 24 години або 7 днів. Його можна відкликати раніше.|Вы атрымліваеце код, сапраўдны 15 хвілін, 24 гадзіны або 7 дзён. Яго можна адклікаць раней.|Sie erhalten einen Code, gültig 15 Minuten, 24 Stunden oder 7 Tage. Sie können ihn früher widerrufen.
Powiązane w prototypie|Related in the prototype|Пов'язане в прототипі|Звязанае ў прататыпе|Verwandtes im Prototyp
Porównaj: cały dowód albo samo „pełnoletni”|Compare: the whole ID or just "adult"|Порівняйте: усе посвідчення чи лише «повнолітній»|Параўнайце: усё пасведчанне ці толькі «паўналетні»|Vergleichen: ganzer Ausweis oder nur „volljährig“
Czy portfel unijny zastąpi mObywatela?|Will the EU wallet replace mObywatel?|Чи замінить гаманець ЄС mObywatel?|Ці заменіць кашалёк ЕС mObywatel?|Ersetzt die EU-Wallet mObywatel?
Kto pyta o moje dane (pełne żądania)|Who asks for my data (full requests)|Хто запитує мої дані (повні запити)|Хто пытаецца пра мае даныя (поўныя запыты)|Wer fragt nach meinen Daten (vollständige Anfragen)
Pierwszy pokaz: tylko 18+|First demo: 18+ only|Перша демонстрація: лише 18+|Першы паказ: толькі 18+|Erste Demo: nur 18+
Fikcyjne żądanie|Fictional request|Вигаданий запит|Выдуманы запыт|Fiktive Anfrage
Nic nie zostanie wysłane. Osoba w pokazie|Nothing will be sent. Demo person|Нічого не буде надіслано. Особа в демонстрації|Нічога не будзе адпраўлена. Асоба ў паказе|Es wird nichts gesendet. Person in der Demo
Po co?|Why?|Навіщо?|Навошта?|Wozu?
Chce wiedzieć, że kandydat jest prawdziwą osobą, a nie fałszywym kontem, i czy ma uprawnienia do pracy kierowcy.|Wants to know the candidate is a real person, not a fake account, and holds a licence to work as a driver.|Хоче знати, що кандидат – справжня людина, а не фейковий акаунт, і чи має право працювати водієм.|Хоча ведаць, што кандыдат – сапраўдны чалавек, а не фальшывы акаўнт, і ці мае права працаваць вадзіцелем.|Möchte wissen, dass der Bewerber eine echte Person und kein Fake-Konto ist und ob er als Fahrer arbeiten darf.
Co chcesz potwierdzić?|What do you want to confirm?|Що ви хочете підтвердити?|Што вы хочаце пацвердзіць?|Was möchten Sie bestätigen?
Firma prosi jako konieczne|Required by the company|Фірма вимагає як обов'язкове|Фірма патрабуе як абавязковае|Von der Firma verlangt
Opcjonalne|Optional|Необов'язково|Неабавязкова|Optional
Mam ukończone 18 lat|I am 18 or older|Мені виповнилося 18 років|Мне споўнілася 18 гадоў|Ich bin mindestens 18
Prawo jazdy – kategorie|Driving licence – categories|Посвідчення водія – категорії|Вадзіцельскае пасведчанне – катэгорыі|Führerschein – Klassen
Wykształcenie / dyplom|Education / diploma|Освіта / диплом|Адукацыя / дыплом|Ausbildung / Abschluss
Status studenta|Student status|Статус студента|Статус студэнта|Studierendenstatus
Mieszkam w gminie|I live in the municipality|Я живу в гміні|Я жыву ў гміне|Ich wohne in der Gemeinde
Brak w tym telefonie (DEMO), więc nie da się tego udostępnić.|Not on this phone (DEMO), so it cannot be shared.|Немає в цьому телефоні (DEMO), тож цим не можна поділитися.|Няма ў гэтым тэлефоне (DEMO), таму гэтым нельга падзяліцца.|Nicht auf diesem Handy (DEMO), kann also nicht geteilt werden.
Imię i nazwisko|Full name|Ім'я та прізвище|Імя і прозвішча|Vor- und Nachname
TAK – tożsamość potwierdzona w telefonie|YES – identity confirmed on the phone|ТАК – особу підтверджено в телефоні|ТАК – асоба пацверджана ў тэлефоне|JA – Identität im Handy bestätigt
profil mObywatel (DEMO)|mObywatel profile (DEMO)|профіль mObywatel (DEMO)|профіль mObywatel (DEMO)|mObywatel-Profil (DEMO)
mDowód – tylko wynik tak/nie|mDowód – yes/no result only|mDowód – лише відповідь так/ні|mDowód – толькі адказ так/не|mDowód – nur Ja/Nein
mPrawo jazdy – same kategorie|mPrawo jazdy – categories only|mPrawo jazdy – лише категорії|mPrawo jazdy – толькі катэгорыі|mPrawo jazdy – nur Klassen
w pokazie: dane przykładowe|in the demo: sample data|у демонстрації: приклад даних|у паказе: прыкладныя даныя|in der Demo: Beispieldaten
legitymacja studencka|student ID|студентський квиток|студэнцкі білет|Studierendenausweis
sama gmina, bez ulicy i numeru|municipality only, no street or number|лише гміна, без вулиці й номера|толькі гміна, без вуліцы і нумара|nur Gemeinde, ohne Straße und Nummer
Jak długo kod ma działać?|How long should the code work?|Скільки має діяти код?|Колькі павінен дзейнічаць код?|Wie lange soll der Code gelten?
15 minut|15 minutes|15 хвилин|15 хвілін|15 Minuten
24 godziny|24 hours|24 години|24 гадзіны|24 Stunden
7 dni|7 days|7 днів|7 дзён|7 Tage
Co zobaczy firma|What the company will see|Що побачить фірма|Што ўбачыць фірма|Was die Firma sieht
Czego nie zobaczy|What it will not see|Чого не побачить|Чаго не ўбачыць|Was sie nicht sieht
Adres: ulica i numer mieszkania|Address: street and flat number|Адреса: вулиця й номер квартири|Адрас: вуліца і нумар кватэры|Adresse: Straße und Wohnungsnummer
Zdjęcie z dokumentu|Photo from the document|Фото з документа|Фота з дакумента|Foto aus dem Dokument
Twoje sprawy, recepty i historia|Your matters, prescriptions and history|Ваші справи, рецепти й історія|Вашы справы, рэцэпты і гісторыя|Ihre Angelegenheiten, Rezepte und Verlauf
Udostępnij tylko zaznaczone (DEMO)|Share only what's ticked (DEMO)|Поділитися лише позначеним (DEMO)|Падзяліцца толькі адзначаным (DEMO)|Nur Ausgewähltes teilen (DEMO)
Gdy firma prosi o więcej, niż potrzeba, możesz odmówić albo zaznaczyć mniej.|If a company asks for more than it needs, you can refuse or tick less.|Якщо фірма просить більше, ніж потрібно, можна відмовити або позначити менше.|Калі фірма просіць больш, чым трэба, можна адмовіць або адзначыць менш.|Verlangt eine Firma mehr als nötig, können Sie ablehnen oder weniger wählen.
Nic nie zaznaczono.|Nothing selected.|Нічого не позначено.|Нічога не адзначана.|Nichts ausgewählt.
Nowe potwierdzenie|New confirmation|Нове підтвердження|Новае пацвярджэнне|Neue Bestätigung
Kod do okazania|Code to show|Код для пред'явлення|Код для прад'яўлення|Code zum Vorzeigen
Cofnij teraz|Withdraw now|Відкликати зараз|Адклікаць зараз|Jetzt widerrufen
Cofnij|Withdraw|Відкликати|Адклікаць|Widerrufen
Pokaż kod|Show code|Показати код|Паказаць код|Code zeigen
Firma zobaczy tylko to|The company will see only this|Фірма побачить лише це|Фірма ўбачыць толькі гэта|Die Firma sieht nur das
Pytania asystenta|Assistant's questions|Запитання асистента|Пытанні памочніка|Fragen des Assistenten
odpowiedzi zostają na telefonie|answers stay on the phone|відповіді лишаються в телефоні|адказы застаюцца ў тэлефоне|Antworten bleiben auf dem Handy
Czy jesteś osobą starszą albo wolisz duże litery?|Are you an older person or do you prefer large text?|Ви людина похилого віку або вам зручніші великі літери?|Вы пажылы чалавек або вам зручней вялікія літары?|Sind Sie älter oder bevorzugen Sie große Schrift?
Czy jesteś na emeryturze albo zbliżasz się do niej?|Are you retired or close to retirement?|Ви на пенсії або скоро на неї вийдете?|Вы на пенсіі або хутка на яе выйдзеце?|Sind Sie in Rente oder kurz davor?
Czy masz dzieci, które są pod Twoją opieką?|Do you have children in your care?|Чи маєте ви дітей під своєю опікою?|Ці ёсць у вас дзеці пад вашай апекай?|Haben Sie Kinder in Ihrer Obhut?
Czy masz samochód?|Do you have a car?|Чи маєте ви автомобіль?|Ці ёсць у вас аўтамабіль?|Haben Sie ein Auto?
Czy prowadzisz firmę?|Do you run a business?|Чи ведете ви власну справу?|Ці вядзеце вы ўласную справу?|Führen Sie ein Unternehmen?
Czy opiekujesz się kimś bliskim, np. mamą albo tatą?|Do you care for someone close, e.g. your mum or dad?|Чи доглядаєте ви когось близького, напр. маму чи тата?|Ці даглядаеце вы кагосьці блізкага, напр. маму ці тату?|Pflegen Sie einen Angehörigen, z. B. Mutter oder Vater?
Czy Ty albo ktoś bliski ma orzeczenie o niepełnosprawności?|Do you or someone close have an official disability certificate?|Чи маєте ви або хтось близький довідку про інвалідність?|Ці маеце вы або хтосьці блізкі даведку пра інваліднасць?|Haben Sie oder ein Angehöriger einen Behindertenausweis?
Czy uczysz się albo studiujesz?|Are you at school or university?|Ви навчаєтеся в школі чи університеті?|Вы вучыцеся ў школе ці ўніверсітэце?|Gehen Sie zur Schule oder studieren Sie?
Czy wynajmujesz mieszkanie albo się przeprowadzasz?|Are you renting a flat or moving house?|Ви орендуєте житло або переїжджаєте?|Вы арандуеце жыллё або пераязджаеце?|Mieten Sie eine Wohnung oder ziehen Sie um?
Czy szukasz pracy?|Are you looking for work?|Ви шукаєте роботу?|Вы шукаеце працу?|Suchen Sie Arbeit?
Tak|Yes|Так|Так|Ja
Nie|No|Ні|Не|Nein
Pomiń|Skip|Пропустити|Прапусціць|Überspringen
Nie pytam o PESEL, adres, zarobki ani choroby. Wystarczy tak albo nie.|I don't ask about your PESEL, address, income or illnesses. Yes or no is enough.|Я не питаю про PESEL, адресу, заробіток чи хвороби. Досить «так» або «ні».|Я не пытаюся пра PESEL, адрас, заробак ці хваробы. Дастаткова «так» або «не».|Ich frage nicht nach PESEL, Adresse, Einkommen oder Krankheiten. Ja oder Nein genügt.
Poprzednie pytanie|Previous question|Попереднє запитання|Папярэдняе пытанне|Vorherige Frage
Profil jest tylko na tym telefonie|The profile is only on this phone|Профіль є лише на цьому телефоні|Профіль ёсць толькі на гэтым тэлефоне|Das Profil ist nur auf diesem Handy
Senior|Senior|Літня людина|Пажылы чалавек|Senior
Emerytura|Retirement|Пенсія|Пенсія|Rente
Rodzic|Parent|Батьки|Бацькі|Elternteil
Mam auto|I have a car|Маю авто|Маю аўта|Ich habe ein Auto
Prowadzę firmę|I run a business|Веду власну справу|Вяду ўласную справу|Ich führe ein Unternehmen
Opiekuję się kimś|I care for someone|Доглядаю когось|Даглядаю кагосьці|Ich pflege jemanden
Niepełnosprawność|Disability|Інвалідність|Інваліднасць|Behinderung
Uczę się / studiuję|At school / university|Навчаюся|Вучуся|Schule / Studium
Wynajem / przeprowadzka|Renting / moving|Оренда / переїзд|Арэнда / пераезд|Miete / Umzug
Szukam pracy|Looking for work|Шукаю роботу|Шукаю працу|Arbeitssuche
Włączyć duże litery?|Turn on large text?|Увімкнути великі літери?|Уключыць вялікія літары?|Große Schrift einschalten?
Zaznaczyłeś, że wolisz duże litery. Tryb seniora możesz wyłączyć w każdej chwili.|You said you prefer large text. You can turn senior mode off at any time.|Ви зазначили, що вам зручніші великі літери. Режим для літніх можна вимкнути будь-коли.|Вы адзначылі, што вам зручней вялікія літары. Рэжым для пажылых можна выключыць у любы час.|Sie bevorzugen große Schrift. Den Seniorenmodus können Sie jederzeit ausschalten.
Włącz tryb seniora|Turn on senior mode|Увімкнути режим для літніх|Уключыць рэжым для пажылых|Seniorenmodus einschalten
Pilnuję dla Ciebie|I keep an eye on this for you|Я стежу за цим для вас|Я сачу за гэтым для вас|Ich behalte das für Sie im Blick
Tryb seniora: duże litery i czytanie na głos|Senior mode: large text and reading aloud|Режим для літніх: великі літери й читання вголос|Рэжым для пажылых: вялікія літары і чытанне ўголас|Seniorenmodus: große Schrift und Vorlesen
Włączasz i wyłączasz jednym przełącznikiem na starcie.|One switch on the home screen turns it on and off.|Вмикається й вимикається одним перемикачем на головному екрані.|Уключаецца і выключаецца адным пераключальнікам на галоўным экране.|Ein Schalter auf dem Startbildschirm schaltet ihn ein und aus.
Uczymy się razem|Learning together|Навчаємося разом|Вучымся разам|Gemeinsam lernen
Lekcje z wnukiem: aktualizacja, dokument, fałszywy SMS.|Lessons with a grandchild: updates, documents, fake texts.|Уроки з онуком: оновлення, документ, фейкова SMS.|Урокі з унукам: абнаўленне, дакумент, фальшывая SMS.|Lektionen mit dem Enkel: Update, Dokument, gefälschte SMS.
Czy aplikacja jest gotowa?|Is the app ready?|Чи готовий застосунок?|Ці гатовая праграма?|Ist die App bereit?
Sprawdzenie aktualizacji krok po kroku.|Step-by-step update check.|Перевірка оновлення крок за кроком.|Праверка абнаўлення крок за крокам.|Update-Prüfung Schritt für Schritt.
Fałszywe SMS-y i telefony|Fake texts and calls|Фейкові SMS і дзвінки|Фальшывыя SMS і званкі|Gefälschte SMS und Anrufe
Jak rozpoznać oszusta, zanim podasz dane.|How to spot a scammer before you give any data.|Як розпізнати шахрая, перш ніж дати дані.|Як распазнаць ашуканца, перш чым даць даныя.|Betrüger erkennen, bevor Sie Daten preisgeben.
Prognoza emerytury|Pension forecast|Прогноз пенсії|Прагноз пенсіі|Rentenprognose
Pokaz z danymi przykładowymi.|Demo with sample data.|Демонстрація з прикладом даних.|Паказ з прыкладнымі данымі.|Demo mit Beispieldaten.
E-recepty|E-prescriptions|Е-рецепти|Э-рэцэпты|E-Rezepte
Recepty i przypomnienia o lekach.|Prescriptions and medicine reminders.|Рецепти й нагадування про ліки.|Рэцэпты і напаміны пра лекі.|Rezepte und Medikamentenerinnerungen.
800 plus|800 plus (child benefit)|800 plus (допомога на дитину)|800 plus (дапамога на дзіця)|800 plus (Kindergeld)
Wniosek na nowy okres i terminy.|Application for the new period and deadlines.|Заява на новий період і строки.|Заява на новы перыяд і тэрміны.|Antrag für den neuen Zeitraum und Fristen.
Karta rowerowa dziecka|Child's cycling card|Велосипедна картка дитини|Веласіпедная картка дзіцяці|Fahrradausweis des Kindes
Kalkulator wieku: prawo dziś i projekt.|Age calculator: current law and draft.|Калькулятор віку: чинне право і проєкт.|Калькулятар узросту: дзейнае права і праект.|Altersrechner: geltendes Recht und Entwurf.
Dokumenty i sprawy dzieci w jednym miejscu.|Children's documents and matters in one place.|Документи й справи дітей в одному місці.|Дакументы і справы дзяцей у адным месцы.|Dokumente und Angelegenheiten der Kinder an einem Ort.
Gdy masz troje lub więcej dzieci.|If you have three or more children.|Якщо маєте трьох або більше дітей.|Калі маеце траіх або больш дзяцей.|Wenn Sie drei oder mehr Kinder haben.
Koniec OC|Car insurance ending|Закінчення OC|Сканчэнне OC|Ende der Haftpflicht
Kiedy kończy się polisa w pokazie.|When the demo policy ends.|Коли закінчується поліс у демонстрації.|Калі сканчаецца поліс у паказе.|Wann die Demo-Police endet.
Kupiłem albo sprzedałem auto|I bought or sold a car|Я купив або продав авто|Я купіў або прадаў аўта|Ich habe ein Auto gekauft oder verkauft
Terminy: rejestracja, zgłoszenie zbycia, PCC-3, OC.|Deadlines: registration, sale notice, PCC-3 tax, insurance.|Строки: реєстрація, повідомлення про продаж, PCC-3, OC.|Тэрміны: рэгістрацыя, паведамленне пра продаж, PCC-3, OC.|Fristen: Zulassung, Verkaufsmeldung, PCC-3, Haftpflicht.
Mandaty i punkty|Fines and points|Штрафи й бали|Штрафы і балы|Bußgelder und Punkte
Sprawdź i opłać.|Check and pay.|Перевірте й сплатіть.|Праверце і аплаціце.|Prüfen und bezahlen.
Moja firma|My business|Моя фірма|Мая фірма|Mein Unternehmen
Sprawy firmy i terminy.|Business matters and deadlines.|Справи фірми й строки.|Справы фірмы і тэрміны.|Firmenangelegenheiten und Fristen.
Zmiana danych firmy|Change business details|Зміна даних фірми|Змена даных фірмы|Firmendaten ändern
CEIDG krok po kroku.|CEIDG step by step.|CEIDG крок за кроком.|CEIDG крок за крокам.|CEIDG Schritt für Schritt.
Zawieszenie działalności|Suspend the business|Призупинення діяльності|Прыпыненне дзейнасці|Gewerbe ruhen lassen
Gdy robisz przerwę.|When you take a break.|Коли робите перерву.|Калі робіце перапынак.|Wenn Sie pausieren.
Upoważnienia|Authorisations|Доручення|Даверанасці|Vollmachten
Odbieranie recept i spraw bliskiej osoby.|Collecting prescriptions and handling matters for a loved one.|Отримання рецептів і справ близької людини.|Атрыманне рэцэптаў і спраў блізкага чалавека.|Rezepte und Angelegenheiten eines Angehörigen.
Pełnomocnictwo|Power of attorney|Довіреність|Даверанасць|Vollmacht
Gdy ktoś ma załatwiać sprawy za bliską osobę.|When someone handles matters for a loved one.|Коли хтось має вирішувати справи за близьку людину.|Калі хтосьці павінен вырашаць справы за блізкага чалавека.|Wenn jemand für einen Angehörigen handelt.
Zapytaj asystenta|Ask the assistant|Запитайте асистента|Спытайце памочніка|Assistenten fragen
Nie podaję tu kwot ani warunków świadczeń. Sprawdź je na gov.pl albo w urzędzie.|I don't give benefit amounts or conditions here. Check them on gov.pl or at the office.|Я не вказую тут сум чи умов виплат. Перевірте їх на gov.pl або в установі.|Я не паказваю тут сум ці ўмоў выплат. Праверце іх на gov.pl або ва ўстанове.|Beträge und Bedingungen nenne ich hier nicht. Prüfen Sie sie auf gov.pl oder beim Amt.
Studia|Studies|Навчання|Навучанне|Studium
Sprawy studenta.|Student matters.|Справи студента.|Справы студэнта.|Studierendenangelegenheiten.
Legitymacja w telefonie|Student ID on your phone|Квиток у телефоні|Білет у тэлефоне|Ausweis auf dem Handy
Dokumenty w portfelu.|Documents in the wallet.|Документи в гаманці.|Дакументы ў кашальку.|Dokumente in der Wallet.
Miejsce głosowania|Voting place|Місце голосування|Месца галасавання|Wahlort
Gdy mieszkasz w innym mieście.|When you live in another city.|Коли живете в іншому місті.|Калі жывяце ў іншым горадзе.|Wenn Sie in einer anderen Stadt wohnen.
Przeprowadzka|Moving house|Переїзд|Пераезд|Umzug
Wszystkie sprawy po kolei.|All matters in order.|Усі справи по черзі.|Усе справы па чарзе.|Alle Angelegenheiten der Reihe nach.
Meldunek|Address registration|Реєстрація місця проживання|Рэгістрацыя месца жыхарства|Wohnsitzanmeldung
Zameldowanie przez internet.|Register your address online.|Реєстрація онлайн.|Рэгістрацыя анлайн.|Anmeldung online.
Potwierdź się wynajmującemu|Confirm yourself to a landlord|Підтвердьте себе орендодавцеві|Пацвердзіце сябе арэндадаўцу|Sich beim Vermieter ausweisen
Prawdziwa osoba i 18+, bez PESEL-u i adresu.|Real person and 18+, without PESEL or address.|Справжня людина і 18+, без PESEL та адреси.|Сапраўдны чалавек і 18+, без PESEL і адраса.|Echte Person und 18+, ohne PESEL und Adresse.
Potwierdź się rekruterowi|Confirm yourself to a recruiter|Підтвердьте себе рекрутерові|Пацвердзіце сябе рэкрутэру|Sich beim Personalvermittler ausweisen
Prawdziwa osoba, prawo jazdy, dyplom – bez PESEL-u.|Real person, driving licence, diploma – no PESEL.|Справжня людина, посвідчення водія, диплом – без PESEL.|Сапраўдны чалавек, вадзіцельскае пасведчанне, дыплом – без PESEL.|Echte Person, Führerschein, Abschluss – ohne PESEL.
Fałszywe oferty pracy|Fake job offers|Фейкові вакансії|Фальшывыя вакансіі|Gefälschte Jobangebote
Oszuści podszywają się pod firmy. Zgłoś podejrzaną wiadomość.|Scammers pose as companies. Report a suspicious message.|Шахраї видають себе за фірми. Повідомте про підозріле повідомлення.|Ашуканцы выдаюць сябе за фірмы. Паведаміце пра падазронае паведамленне.|Betrüger geben sich als Firmen aus. Melden Sie verdächtige Nachrichten.
Gdzie trafia to, co piszesz|Where what you type goes|Куди потрапляє те, що ви пишете|Куды трапляе тое, што вы пішаце|Wohin geht, was Sie schreiben
Zanim wkleisz CV do asystenta.|Before you paste your CV into the assistant.|Перш ніж вставити резюме в асистента.|Перш чым уставіць рэзюмэ ў памочніка.|Bevor Sie Ihren Lebenslauf einfügen.
Dla każdego|For everyone|Для всіх|Для ўсіх|Für alle
Dla każdego, bez pytań|For everyone, no questions|Для всіх, без запитань|Для ўсіх, без пытанняў|Für alle, ohne Fragen
Najbliższe punkty schronienia (aplikacja PSP).|Nearest shelter points (fire service app).|Найближчі пункти укриття (застосунок PSP).|Бліжэйшыя пункты сховішча (праграма PSP).|Nächste Schutzpunkte (App der Feuerwehr).
Bezpłatne szkolenie cywilne MON.|Free civil training by the Ministry of Defence.|Безплатне цивільне навчання Міноборони.|Бясплатнае грамадзянскае навучанне Мінабароны.|Kostenlose zivile Schulung des Verteidigungsministeriums.
Plecak na 72 godziny|72-hour go-bag|Тривожна валіза на 72 години|Трывожная валіза на 72 гадзіны|Notfallrucksack für 72 Stunden
Lista rzeczy na sytuację kryzysową.|Checklist for a crisis.|Список речей на кризову ситуацію.|Спіс рэчаў на крызісную сітуацыю.|Liste für den Krisenfall.
Przypomnienia z tego telefonu.|Reminders from this phone.|Нагадування з цього телефона.|Напаміны з гэтага тэлефона.|Erinnerungen von diesem Handy.
Zmień odpowiedzi|Change answers|Змінити відповіді|Змяніць адказы|Antworten ändern
Usuń mój profil z telefonu|Delete my profile from the phone|Видалити мій профіль з телефона|Выдаліць мой профіль з тэлефона|Mein Profil vom Handy löschen
Lista nie jest decyzją urzędu. Pokazuje sprawy z prototypu, które mogą Cię dotyczyć. Kwoty i warunki świadczeń sprawdź w źródłach na gov.pl.|The list is not an official decision. It shows prototype matters that may apply to you. Check benefit amounts and conditions on gov.pl.|Список не є рішенням установи. Він показує справи з прототипу, які можуть вас стосуватися. Суми й умови виплат перевірте на gov.pl.|Спіс не з'яўляецца рашэннем установы. Ён паказвае справы з прататыпа, якія могуць вас датычыцца. Сумы і ўмовы выплат праверце на gov.pl.|Die Liste ist keine Behördenentscheidung. Sie zeigt Angelegenheiten, die Sie betreffen könnten. Beträge und Bedingungen auf gov.pl prüfen.
Dane zostają na telefonie.|Data stays on the phone.|Дані лишаються в телефоні.|Даныя застаюцца ў тэлефоне.|Die Daten bleiben auf dem Handy.
Nie trafiają do serwera, do Gemmy ani do żadnej firmy. Możesz je usunąć jednym przyciskiem.|They don't go to a server, to Gemma or to any company. You can delete them with one button.|Вони не потрапляють на сервер, до Gemma чи до жодної фірми. Їх можна видалити однією кнопкою.|Яны не трапляюць на сервер, у Gemma ці ў ніякую фірму. Іх можна выдаліць адной кнопкай.|Sie gehen nicht an einen Server, an Gemma oder an Firmen. Sie können sie mit einem Knopf löschen.
Asystent zapyta raz o kilka prostych rzeczy|The assistant asks a few simple questions once|Асистент один раз запитає про кілька простих речей|Памочнік адзін раз спытае пра некалькі простых рэчаў|Der Assistent stellt einmal ein paar einfache Fragen
Na przykład: czy masz auto, dzieci, firmę albo opiekujesz się kimś. Potem sam pokaże, czego pilnować: terminy, świadczenia i sprawy do załatwienia.|For example: whether you have a car, children, a business, or care for someone. Then it shows what to keep an eye on: deadlines, benefits and things to do.|Наприклад: чи маєте авто, дітей, фірму або доглядаєте когось. Потім сам покаже, за чим стежити: строки, виплати й справи.|Напрыклад: ці маеце аўта, дзяцей, фірму або даглядаеце кагосьці. Потым сам пакажа, за чым сачыць: тэрміны, выплаты і справы.|Zum Beispiel: ob Sie ein Auto, Kinder, eine Firma haben oder jemanden pflegen. Dann zeigt er, worauf zu achten ist: Fristen, Leistungen und Aufgaben.
Zacznij (10 pytań, ok. minuty)|Start (10 questions, about a minute)|Почати (10 запитань, близько хвилини)|Пачаць (10 пытанняў, каля хвіліны)|Starten (10 Fragen, ca. eine Minute)
Rodzina: rower i lekcje|Family: bike and lessons|Родина: велосипед і уроки|Сям'я: ровар і ўрокі|Familie: Fahrrad und Lektionen
Karta rowerowa|Cycling card|Велокартка|Велакартка|Fahrradausweis
Razem uczymy|Learning together|Навчаємо разом|Вучым разам|Gemeinsam lernen
Auto i telefon|Car and phone|Авто й телефон|Аўта і тэлефон|Auto und Handy
Auto — co dalej|Car – what next|Авто – що далі|Аўта – што далей|Auto – wie weiter
Czy aplikacja gotowa|App ready?|Чи готовий застосунок|Ці гатовая праграма|App bereit?
Prywatność AI i pisma|AI privacy and letters|Приватність ШІ та листи|Прыватнасць ШІ і лісты|KI-Datenschutz und Schreiben
Pismo krótko|Letter in brief|Лист коротко|Ліст коратка|Schreiben kurz
Dokumenty i żądania danych|Documents and data requests|Документи й запити даних|Дакументы і запыты даных|Dokumente und Datenanfragen
Portfel unijny|EU wallet|Гаманець ЄС|Кашалёк ЕС|EU-Wallet
Portfel unijny?|EU wallet?|Гаманець ЄС?|Кашалёк ЕС?|EU-Wallet?
Dokumenty nie znikną|Documents won't disappear|Документи не зникнуть|Дакументы не знікнуць|Dokumente verschwinden nicht
Kto pyta o moje dane|Who asks for my data|Хто запитує мої дані|Хто пытаецца пра мае даныя|Wer fragt nach meinen Daten
Twoje prawa (EUDI)|Your rights (EUDI)|Ваші права (EUDI)|Вашы правы (EUDI)|Ihre Rechte (EUDI)
Raport problemu z dokumentem|Document problem report|Звіт про проблему з документом|Справаздача пра праблему з дакументам|Problembericht zum Dokument
Ochrona przed podróbkami i oszustwami|Protection from fakes and scams|Захист від підробок і шахрайства|Абарона ад падробак і ашуканства|Schutz vor Fälschungen und Betrug
Zgłoś oszustwo|Report a scam|Повідомити про шахрайство|Паведаміць пра ашуканства|Betrug melden
Sprawdź link|Check a link|Перевірити посилання|Праверыць спасылку|Link prüfen
Po oszustwie|After a scam|Після шахрайства|Пасля ашуканства|Nach einem Betrug
Prawdziwy czy podróbka?|Real or fake?|Справжній чи підробка?|Сапраўдны ці падробка?|Echt oder Fälschung?
Sprawdź dokument|Check a document|Перевірити документ|Праверыць дакумент|Dokument prüfen
Mój dokument – żywy znak|My document – live mark|Мій документ – живий знак|Мой дакумент – жывы знак|Mein Dokument – lebendes Zeichen
Jak rozpoznać podróbkę|How to spot a fake|Як розпізнати підробку|Як распазнаць падробку|Fälschung erkennen
Zgłoś podejrzaną aplikację|Report a suspicious app|Повідомити про підозрілий застосунок|Паведаміць пра падазроную праграму|Verdächtige App melden
Zdrowie|Health|Здоров'я|Здароўе|Gesundheit
Moje zdrowie|My health|Моє здоров'я|Маё здароўе|Meine Gesundheit
Recepty|Prescriptions|Рецепти|Рэцэпты|Rezepte
Auto i transport|Car and transport|Авто й транспорт|Аўта і транспарт|Auto und Verkehr
OC|Car insurance (OC)|Поліс OC|Поліс OC|Kfz-Haftpflicht
Mandaty|Fines|Штрафи|Штрафы|Bußgelder
Bilety|Tickets|Квитки|Білеты|Tickets
Pieniądze|Money|Гроші|Грошы|Geld
Emerytura w telefonie|Pension on the phone|Пенсія в телефоні|Пенсія ў тэлефоне|Rente auf dem Handy
Prąd|Electricity|Електрика|Электрычнасць|Strom
Płatności|Payments|Платежі|Плацяжы|Zahlungen
Rodzina|Family|Родина|Сям'я|Familie
Pełnomocnik|Proxy|Представник|Прадстаўнік|Bevollmächtigter
Kryzys i bezpieczeństwo|Crisis and safety|Криза й безпека|Крызіс і бяспека|Krise und Sicherheit
Alerty|Alerts|Сповіщення|Апавяшчэнні|Warnungen
Monitoring|CCTV|Відеоспостереження|Відэаназіранне|Videoüberwachung
Oszustwo?|Scam?|Шахрайство?|Ашуканства?|Betrug?
Dokumenty i dane|Documents and data|Документи й дані|Дакументы і даныя|Dokumente und Daten
Dane skanem|Data by scan|Дані скануванням|Даныя сканаваннем|Daten per Scan
Zastrzeż PESEL|Block your PESEL|Заблокувати PESEL|Заблакаваць PESEL|PESEL sperren
Prywatność|Privacy|Приватність|Прыватнасць|Datenschutz
Urząd i sprawy|Offices and matters|Установи й справи|Установы і справы|Ämter und Angelegenheiten
Źródła danych|Data sources|Джерела даних|Крыніцы даных|Datenquellen
Prawo i sądy|Law and courts|Право й суди|Права і суды|Recht und Gerichte
Wyjaśnij pismo|Explain a letter|Пояснити лист|Растлумачыць ліст|Schreiben erklären
Budowa|Building|Будівництво|Будаўніцтва|Bauen
Poczta|Mail|Пошта|Пошта|Post
Zgłoś|Report|Повідомити|Паведаміць|Melden
Terminy|Deadlines|Строки|Тэрміны|Fristen
Pisma|Letters|Листи|Лісты|Schreiben
Inf. publiczna|Public info|Публічна інф.|Публічная інф.|Öffentl. Info
Edukacja|Education|Освіта|Адукацыя|Bildung
Demokracja|Democracy|Демократія|Дэмакратыя|Demokratie
Wybory|Elections|Вибори|Выбары|Wahlen
Referenda|Referendums|Референдуми|Рэферэндумы|Volksabstimmungen
Mam wpływ|I have a say|Я маю вплив|Я маю ўплыў|Ich rede mit
Głosowanie|Voting|Голосування|Галасаванне|Abstimmung
Podpisy|Signatures|Підписи|Подпісы|Unterschriften
Inne|Other|Інше|Іншае|Sonstiges
Przewodnik|Guide|Путівник|Даведнік|Leitfaden
Wszystko|Everything|Усе|Усё|Alles
Pomoc społ.|Social help|Соц. допомога|Сац. дапамога|Sozialhilfe
Podróże|Travel|Подорожі|Падарожжы|Reisen
Pomoc cyfrowa|Digital help|Цифрова допомога|Лічбавая дапамога|Digitale Hilfe
Petycja|Petition|Петиція|Петыцыя|Petition
Mapa zagrożeń|Threat map|Мапа загроз|Мапа пагроз|Gefahrenkarte
Wsparcie|Support|Підтримка|Падтрымка|Unterstützung
Inne kraje|Other countries|Інші країни|Іншыя краіны|Andere Länder
Ustawienia|Settings|Налаштування|Налады|Einstellungen
Szukaj usługi, np. OC, recepta, schron…|Search for a service, e.g. insurance, prescription, shelter…|Шукати послугу, напр. OC, рецепт, укриття…|Шукаць паслугу, напр. OC, рэцэпт, сховішча…|Dienst suchen, z. B. Haftpflicht, Rezept, Schutzraum…
Pobierz Bielika offline (1,1 GB)|Download Bielik for offline use (1.1 GB)|Завантажити Bielik офлайн (1,1 ГБ)|Спампаваць Bielik афлайн (1,1 ГБ)|Bielik offline laden (1,1 GB)
Odpowiada teraz|Answering now|Зараз відповідає|Цяпер адказвае|Antwortet jetzt
zmień|change|змінити|змяніць|ändern
Cześć! Jestem asystentem mObywatela. Napisz lub powiedz, co chcesz załatwić. Zanim cokolwiek wyślę, zawsze poproszę o potwierdzenie.|Hi! I'm the mObywatel assistant. Type or say what you need. I always ask for confirmation before sending anything.|Привіт! Я асистент mObywatel. Напишіть або скажіть, що потрібно залагодити. Перш ніж щось надіслати, я завжди попрошу підтвердження.|Вітаю! Я памочнік mObywatel. Напішыце або скажыце, што трэба зрабіць. Перш чым нешта адправіць, я заўсёды папрашу пацвярджэння.|Hallo! Ich bin der mObywatel-Assistent. Schreiben oder sagen Sie, was Sie erledigen möchten. Vor dem Senden frage ich immer nach.
Zgubiłem portfel|I lost my wallet|Я загубив гаманець|Я згубіў кашалёк|Geldbörse verloren
Przeprowadzam się|I'm moving|Я переїжджаю|Я пераязджаю|Ich ziehe um
Kiedy kończy się OC?|When does my car insurance end?|Коли закінчується OC?|Калі сканчаецца OC?|Wann endet die Haftpflicht?
Gdzie najbliższy schron?|Where is the nearest shelter?|Де найближче укриття?|Дзе бліжэйшае сховішча?|Wo ist der nächste Schutzraum?
Chcę złożyć 800 plus|I want to apply for 800 plus|Хочу подати заяву на 800 plus|Хачу падаць заяву на 800 plus|Ich möchte 800 plus beantragen
Kto sprawdzał moje dane?|Who checked my data?|Хто перевіряв мої дані?|Хто правяраў мае даныя?|Wer hat meine Daten abgefragt?
Co robić podczas alarmu|What to do during an alarm|Що робити під час тривоги|Што рабіць падчас трывогі|Was tun bei Alarm
Ile będę mieć emerytury|How much pension will I get|Яка в мене буде пенсія|Якая ў мяне будзе пенсія|Wie hoch wird meine Rente
Czy mObywatel jest prawdziwy?|Is this mObywatel real?|Чи справжній цей mObywatel?|Ці сапраўдны гэты mObywatel?|Ist dieses mObywatel echt?
Dostałem dziwnego SMS-a|I got a strange text|Я отримав дивну SMS|Я атрымаў дзіўную SMS|Ich habe eine seltsame SMS bekommen
Jak zgłosić oszustwo|How to report a scam|Як повідомити про шахрайство|Як паведаміць пра ашуканства|Wie melde ich Betrug
Zniknął mi dowód z aplikacji|My ID vanished from the app|Зникло посвідчення із застосунку|Знікла пасведчанне з праграмы|Mein Ausweis ist aus der App verschwunden
Sklep chce daty urodzenia|A shop wants my date of birth|Магазин хоче дату народження|Крама хоча дату нараджэння|Ein Shop will mein Geburtsdatum
Gdzie trafia moje pytanie?|Where does my question go?|Куди потрапляє моє питання?|Куды трапляе маё пытанне?|Wohin geht meine Frage?
Czy AI widzi mój PESEL?|Can the AI see my PESEL?|Чи бачить ШІ мій PESEL?|Ці бачыць ШІ мой PESEL?|Sieht die KI meine PESEL?
Sprawdź moje pismo|Check my letter|Перевір мій лист|Правер мой ліст|Prüfe mein Schreiben
Kupiłem auto, co teraz?|I bought a car, what now?|Я купив авто, що тепер?|Я купіў аўта, што цяпер?|Auto gekauft, was jetzt?
Od ilu lat karta rowerowa?|From what age is the cycling card?|З якого віку велокартка?|З якога ўзросту велакартка?|Ab welchem Alter Fahrradausweis?
Napisz lub powiedz…|Type or speak…|Напишіть або скажіть…|Напішыце або скажыце…|Schreiben oder sprechen…
Mów|Speak|Говорити|Гаварыць|Sprechen
Załatw sprawę|Get things done|Залагодити справу|Вырашыць справу|Erledigen
Osoba|Person|Особа|Асоба|Person
Powiedz, co chcesz załatwić|Say what you need|Скажіть, що потрібно залагодити|Скажыце, што трэба зрабіць|Sagen Sie, was Sie erledigen möchten
Kończy się OC|Car insurance ending|Закінчується OC|Сканчаецца OC|Haftpflicht läuft ab
Dziecko się urodziło|A baby was born|Народилася дитина|Нарадзілася дзіця|Ein Kind wurde geboren
Dostałem wezwanie z US|I got a tax office summons|Я отримав вимогу з податкової|Я атрымаў патрабаванне з падатковай|Aufforderung vom Finanzamt erhalten
Odnów OC busa|Renew van insurance|Поновити OC мікроавтобуса|Аднавіць OC мікрааўтобуса|Haftpflicht des Transporters erneuern
Chcę założyć firmę|I want to start a business|Хочу заснувати фірму|Хачу заснаваць фірму|Ich möchte ein Unternehmen gründen
Kiedy kończy się mój dowód|When does my ID expire|Коли спливає моє посвідчення|Калі сканчаецца маё пасведчанне|Wann läuft mein Ausweis ab
Recepty mamy|Mum's prescriptions|Рецепти мами|Рэцэпты мамы|Rezepte der Mutter
Dostałem mandat|I got a fine|Я отримав штраф|Я атрымаў штраф|Ich habe ein Bußgeld bekommen
Zmień miejsce głosowania|Change voting place|Змінити місце голосування|Змяніць месца галасавання|Wahlort ändern
Pokaż dane jednym skanem|Show data with one scan|Показати дані одним скануванням|Паказаць даныя адным сканаваннем|Daten mit einem Scan zeigen
Dostałem pismo|I got a letter|Я отримав лист|Я атрымаў ліст|Ich habe ein Schreiben bekommen
Zgłaszam zdarzenie|Report an incident|Повідомити про подію|Паведаміць пра здарэнне|Vorfall melden
Kończy mi się lek|My medicine is running out|Закінчуються ліки|Сканчаюцца лекі|Medikament geht aus
Jadę gdzieś|I'm travelling|Їду кудись|Еду кудысьці|Ich verreise
Wszystkie sprawy|All matters|Усі справи|Усе справы|Alle Angelegenheiten
Skrzynka (1)|Inbox (1)|Скринька (1)|Скрынка (1)|Postfach (1)
Czy to oszustwo?|Is it a scam?|Це шахрайство?|Гэта ашуканства?|Ist das Betrug?
Kolizja|Collision|Зіткнення|Сутыкненне|Unfall
Narodziny dziecka|Birth of a child|Народження дитини|Нараджэнне дзіцяці|Geburt eines Kindes
Ważny|Valid|Дійсний|Сапраўдны|Gültig
Dotknij, aby pokazać / zweryfikować|Tap to show / verify|Торкніться, щоб показати / перевірити|Дакраніцеся, каб паказаць / праверыць|Tippen zum Zeigen / Prüfen
Wszystkie usługi|All services|Усі послуги|Усе паслугі|Alle Dienste
Rodzina i dzieci|Family and children|Родина й діти|Сям'я і дзеці|Familie und Kinder
Upoważnienia i pełnomocnictwa|Authorisations and powers of attorney|Доручення й довіреності|Даверанасці|Vollmachten
Kończy się zapas: Atorwastatyna 20 mg|Running low: atorvastatin 20 mg|Закінчується запас: аторвастатин 20 мг|Заканчваецца запас: аторвастатын 20 мг|Vorrat geht zur Neige: Atorvastatin 20 mg
Poproś o nową receptę|Ask for a new prescription|Попросіть новий рецепт|Папрасіце новы рэцэпт|Neues Rezept anfordern
Pierwszy raz w aplikacji?|First time in the app?|Уперше в застосунку?|Упершыню ў праграме?|Zum ersten Mal in der App?
Przejdź 2-minutową wycieczkę albo zajrzyj do|Take the 2-minute tour or have a look at|Пройдіть 2-хвилинну екскурсію або загляньте до|Прайдзіце 2-хвілінную экскурсію або зазірніце ў|Machen Sie die 2-minütige Tour oder schauen Sie in
Nakaz zapłaty z e-Sądu – 1 260,50 zł|Payment order from e-Sąd (online court) – PLN 1,260.50|Судовий наказ про оплату з e-Sąd (онлайн-суд) – 1 260,50 зл|Судовы загад аб аплаце з e-Sąd (анлайн-суд) – 1 260,50 зл|Zahlungsbefehl vom e-Sąd (Online-Gericht) – 1.260,50 zł
Na sprzeciw masz czas do pt., 30.10.2026|You can object until Fri, 30.10.2026|Заперечення можна подати до пт, 30.10.2026|Пярэчанне можна падаць да пт, 30.10.2026|Widerspruch möglich bis Fr., 30.10.2026
Komunikat Policji dotyczący Jakuba|Police message about Jakub|Повідомлення поліції щодо Якуба|Паведамленне паліцыі пра Якуба|Polizeimitteilung zu Jakub
Jest bezpieczny – dotknij, aby zobaczyć szczegóły i kontakt|He is safe – tap to see details and contact|Він у безпеці – торкніться, щоб побачити подробиці й контакт|Ён у бяспецы – дакраніцеся, каб убачыць падрабязнасці і кантакт|Er ist in Sicherheit – tippen für Details und Kontakt
Konsultacje: schrony w nowych blokach|Consultation: shelters in new blocks of flats|Консультації: укриття в нових багатоквартирних будинках|Кансультацыі: сховішчы ў новых шматкватэрных дамах|Konsultation: Schutzräume in Neubauten
Możesz zgłosić uwagę do 6.11 – dotyczy Twojej dzielnicy|You can comment until 6.11 – it concerns your district|Ви можете подати зауваження до 6.11 – це стосується вашого району|Вы можаце падаць заўвагу да 6.11 – гэта датычыць вашага раёна|Sie können bis 6.11 Stellung nehmen – es betrifft Ihren Bezirk
Pismo z Urzędu Skarbowego|Letter from the tax office|Лист із податкової інспекції|Ліст з падатковай інспекцыі|Schreiben vom Finanzamt
Odpowiedź do 26.10 – asystent przygotuje szkic|Reply by 26.10 – the assistant will prepare a draft|Відповідь до 26.10 – асистент підготує чернетку|Адказ да 26.10 – асістэнт падрыхтуе чарнавік|Antwort bis 26.10 – der Assistent bereitet einen Entwurf vor
RCB (DEMO): Ostrzeżenie meteo – silny wiatr, woj. mazowieckie|RCB (Government Centre for Security, DEMO): weather warning – strong wind, Masovian Voivodeship|RCB (Урядовий центр безпеки, DEMO): метеопопередження – сильний вітер, Мазовецьке воєводство|RCB (Урадавы цэнтр бяспекі, DEMO): метэапапярэджанне – моцны вецер, Мазавецкае ваяводства|RCB (Regierungszentrum für Sicherheit, DEMO): Wetterwarnung – starker Wind, Woiwodschaft Masowien
Dotknij, aby zobaczyć alerty i schrony|Tap to see alerts and shelters|Торкніться, щоб побачити тривоги й укриття|Дакраніцеся, каб убачыць трывогі і сховішчы|Tippen für Warnungen und Schutzräume
Co robić krok po kroku|What to do step by step|Що робити крок за кроком|Што рабіць крок за крокам|Was zu tun ist, Schritt für Schritt
schron DEMO|shelter DEMO|укриття DEMO|сховішча DEMO|Schutzraum DEMO
jestem bezpieczny/bezpieczna|I am safe|я в безпеці|я ў бяспецы|ich bin in Sicherheit
Czy moja aplikacja jest gotowa?|Is my app ready?|Чи готовий мій застосунок?|Ці гатовая мая праграма?|Ist meine App bereit?
Kupiłem lub sprzedałem auto — co dalej?|I bought or sold a car – what next?|Я купив або продав авто – що далі?|Я купіў або прадаў аўта – што далей?|Auto gekauft oder verkauft – was nun?
Lista od daty umowy, terminy z gov.pl, kalendarz w telefonie.|A checklist from the contract date, deadlines from gov.pl, a calendar on your phone.|Список від дати договору, строки з gov.pl, календар у телефоні.|Спіс ад даты дагавора, тэрміны з gov.pl, каляндар у тэлефоне.|Liste ab Vertragsdatum, Fristen von gov.pl, Kalender im Telefon.
Zobacz i wyślij wskazówkę|See and send a tip|Переглянути й надіслати підказку|Паглядзець і адправіць падказку|Ansehen und Hinweis senden
Sprawdź dokument kodem QR|Check a document with a QR code|Перевірте документ QR-кодом|Праверце дакумент QR-кодам|Dokument per QR-Code prüfen
jak rozpoznać fałszywy mObywatel|how to spot a fake mObywatel|як розпізнати підробний mObywatel|як распазнаць падроблены mObywatel|wie man ein gefälschtes mObywatel erkennt
zgłoś|report|повідомте|паведаміце|melden
Odpowiedz raz na kilka pytań tak/nie. Dane zostają na telefonie.|Answer a few yes/no questions once. The data stays on your phone.|Один раз дайте відповідь на кілька запитань «так/ні». Дані лишаються в телефоні.|Адзін раз адкажыце на некалькі пытанняў «так/не». Даныя застаюцца ў тэлефоне.|Beantworten Sie einmal ein paar Ja/Nein-Fragen. Die Daten bleiben auf dem Telefon.
Szukaj usługi, np. „pozew”, „syrena”, „lekarz”|Search for a service, e.g. "lawsuit", "siren", "doctor"|Шукайте послугу, напр. «позов», «сирена», «лікар»|Шукайце паслугу, напр. «пазоў», «сірэна», «лекар»|Dienst suchen, z. B. „Klage“, „Sirene“, „Arzt“
Czego szukasz? Znajdź usługę…|What are you looking for? Find a service…|Що ви шукаєте? Знайдіть послугу…|Што вы шукаеце? Знайдзіце паслугу…|Was suchen Sie? Dienst finden…
Przełączasz się między członkami rodziny – każdy ma swoje dokumenty, OC i recepty.|You switch between family members – each has their own documents, car insurance and prescriptions.|Ви перемикаєтеся між членами родини – кожен має свої документи, автоцивілку й рецепти.|Вы пераключаецеся паміж членамі сям'і – кожны мае свае дакументы, аўтацывілку і рэцэпты.|Sie wechseln zwischen Familienmitgliedern – jedes hat eigene Dokumente, Kfz-Haftpflicht und Rezepte.
np. „zgubiłem portfel”, „przeprowadzam się”|e.g. "I lost my wallet", "I'm moving"|напр. «я загубив гаманець», «я переїжджаю»|напр. «я згубіў кашалёк», «я пераязджаю»|z. B. „Geldbörse verloren“, „ich ziehe um“
Nowość|New|Новинка|Навінка|Neu
Bliska osoba może pomóc Ci w sprawach –|Someone close can help you with your matters –|Близька людина може допомогти вам у справах –|Блізкі чалавек можа дапамагчы вам у справах –|Eine nahestehende Person kann Ihnen bei Angelegenheiten helfen –
ustaw zaufaną osobę|set a trusted person|призначте довірену особу|прызначце давераную асобу|Vertrauensperson festlegen
Dzień dobry, Anna|Good morning, Anna|Добрий день, Анно|Добры дзень, Анна|Guten Tag, Anna
Zapisane w telefonie|Saved on the phone|Збережено в телефоні|Захавана ў тэлефоне|Auf dem Telefon gespeichert
Zostaje też lista, kto nacisnął zielony przycisk i o której.|There is also a list of who pressed the green button and when.|Також лишається список, хто натиснув зелену кнопку і коли.|Застаецца таксама спіс, хто націснуў зялёную кнопку і калі.|Es bleibt auch eine Liste, wer den grünen Knopf wann gedrückt hat.
Schron przykładowy „Dąb”|Sample shelter "Dąb"|Зразкове укриття «Dąb»|Узорнае сховішча «Dąb»|Beispiel-Schutzraum „Dąb“
ukrycie (wymysł)|hiding place (made up)|місце укриття (вигадане)|месца схову (выдуманае)|Versteck (erfunden)
Dane bywają niepełne.|The data may be incomplete.|Дані можуть бути неповними.|Даныя могуць быць няпоўнымі.|Die Daten können unvollständig sein.
Państwowa Straż Pożarna|State Fire Service|Державна пожежна служба|Дзяржаўная пажарная служба|Staatliche Feuerwehr
Aplikacja PSP i poradniki|Fire service (PSP) app and guides|Застосунок PSP (пожежна служба) і поради|Праграма PSP (пажарная служба) і даведнікі|PSP-App (Feuerwehr) und Ratgeber
Te same osoby, co na przełączniku kont (Anna, Piotr, Halina, Kuba). Status widać po zmianie osoby. Nic nie wychodzi z urządzenia.|The same people as on the account switcher (Anna, Piotr, Halina, Kuba). You see the status after switching person. Nothing leaves the device.|Ті самі особи, що й у перемикачі облікових записів (Анна, Пйотр, Галіна, Куба). Статус видно після зміни особи. Ніщо не виходить за межі пристрою.|Тыя ж асобы, што і ў пераключальніку ўліковых запісаў (Анна, Пётр, Галіна, Куба). Статус відаць пасля змены асобы. Нічога не выходзіць з прылады.|Dieselben Personen wie im Kontowechsler (Anna, Piotr, Halina, Kuba). Den Status sehen Sie nach dem Personenwechsel. Nichts verlässt das Gerät.
Powiadomienie do rodziny nie jest wysyłane. W prawdziwej aplikacji status trafiłby tylko do osób, które same dodałaś lub dodałeś.|No message is sent to your family. In the real app the status would only go to people you added yourself.|Сповіщення родині не надсилається. У справжньому застосунку статус отримали б лише ті, кого ви самі додали.|Апавяшчэнне сям'і не адпраўляецца. У сапраўднай праграме статус атрымалі б толькі тыя, каго вы самі дадалі.|Es wird keine Nachricht an die Familie gesendet. In der echten App ginge der Status nur an Personen, die Sie selbst hinzugefügt haben.
Bezpłatne szkolenie cywilne MON do końca listopada 2026 r. (sprawdź aktualny termin).|Free civilian training by the Ministry of National Defence until the end of November 2026 (check the current date).|Безкоштовне цивільне навчання Міністерства національної оборони до кінця листопада 2026 р. (перевірте актуальний строк).|Бясплатнае грамадзянскае навучанне Міністэрства нацыянальнай абароны да канца лістапада 2026 г. (праверце актуальны тэрмін).|Kostenlose Zivilschulung des Verteidigungsministeriums bis Ende November 2026 (aktuelle Frist prüfen).
Gdzie się ukryć PL|Gdzie się ukryć PL ("Where to hide", fire service app)|Gdzie się ukryć PL («Де сховатися», застосунок пожежної служби)|Gdzie się ukryć PL («Дзе схавацца», праграма пажарнай службы)|Gdzie się ukryć PL („Wo verstecken“, App der Feuerwehr)
Na telefonie z Androidem przycisk otworzy Sklep Play. Tu otwiera stronę Google Play. Mapę można też dodać do ekranu głównego z menu przeglądarki.|On an Android phone the button opens the Play Store. Here it opens the Google Play page. You can also add the map to your home screen from the browser menu.|На телефоні з Android кнопка відкриє Play Маркет. Тут вона відкриває сторінку Google Play. Мапу можна також додати на головний екран через меню браузера.|На тэлефоне з Android кнопка адкрые Play Маркет. Тут яна адкрывае старонку Google Play. Мапу можна таксама дадаць на галоўны экран праз меню браўзера.|Auf einem Android-Telefon öffnet die Taste den Play Store. Hier öffnet sie die Google-Play-Seite. Die Karte lässt sich auch über das Browsermenü zum Startbildschirm hinzufügen.
Schronienia – gdzie się ukryć|Shelters – where to hide|Укриття – де сховатися|Сховішчы – дзе схавацца|Schutzorte – wo man sich verstecken kann
Atak z powietrza|Air attack|Атака з повітря|Атака з паветра|Luftangriff
Sygnały alarmowe|Alarm signals|Сигнали тривоги|Сігналы трывогі|Alarmsignale
Punkty w województwie mazowieckie (Warszawa)|Points in Masovian Voivodeship (Warsaw)|Пункти в Мазовецькому воєводстві (Варшава)|Пункты ў Мазавецкім ваяводстве (Варшава)|Orte in der Woiwodschaft Masowien (Warschau)
Pytania i odpowiedzi (FAQ)|Questions and answers (FAQ)|Запитання й відповіді (FAQ)|Пытанні і адказы (FAQ)|Fragen und Antworten (FAQ)
Strona PSP nie pozwala osadzać się w innych serwisach, dlatego nie ma jej w ramce. Nie ma też publicznego API, więc prototyp nie pokazuje punktów na własnej mapie.|The fire service (PSP) site cannot be embedded in other sites, so it is not shown in a frame. It has no public API either, so the prototype does not show the points on its own map.|Сайт PSP (пожежна служба) не дозволяє вбудовувати себе в інші сервіси, тому його немає в рамці. Публічного API теж немає, тож прототип не показує пункти на власній мапі.|Сайт PSP (пажарная служба) не дазваляе ўбудоўваць сябе ў іншыя сэрвісы, таму яго няма ў рамцы. Публічнага API таксама няма, таму прататып не паказвае пункты на ўласнай мапе.|Die PSP-Seite (Feuerwehr) lässt sich nicht in andere Seiten einbetten, daher fehlt der Rahmen. Eine öffentliche API gibt es auch nicht, deshalb zeigt der Prototyp die Orte nicht auf einer eigenen Karte.
Ekran „Pokaż tylko to, co trzeba” to koncepcja prototypu|The "Show only what is needed" screen is a prototype concept|Екран «Покажіть лише те, що потрібно» – це концепція прототипу|Экран «Пакажыце толькі тое, што трэба» – гэта канцэпцыя прататыпа|Der Bildschirm „Nur das Nötige zeigen“ ist ein Konzept des Prototyps
a nie opis działającej usługi mObywatela. Scenariusze, kategorie prawa jazdy i dyplomy są fikcyjne. To nie jest porada prawna.|not a description of a working mObywatel service. The scenarios, driving licence categories and diplomas are fictional. This is not legal advice.|а не опис чинної послуги mObywatel. Сценарії, категорії водійських прав і дипломи вигадані. Це не юридична порада.|а не апісанне дзейнай паслугі mObywatel. Сцэнарыі, катэгорыі правоў кіроўцы і дыпломы выдуманыя. Гэта не юрыдычная парада.|und keine Beschreibung eines bestehenden mObywatel-Dienstes. Szenarien, Führerscheinklassen und Diplome sind fiktiv. Dies ist keine Rechtsberatung.
polskiej ustawy o Europejskim Portfelu Tożsamości Cyfrowej. To jeszcze nie obowiązujące prawo.|of the Polish act on the European Digital Identity Wallet. It is not yet law in force.|польського закону про Європейський гаманець цифрової ідентичності. Це ще не чинне право.|польскага закона аб Еўрапейскім кашальку лічбавай ідэнтычнасці. Гэта яшчэ не дзеючае права.|des polnischen Gesetzes über die Europäische Brieftasche für die Digitale Identität. Es ist noch kein geltendes Recht.
AutoNajem DEMO · wypożyczalnia aut|AutoNajem DEMO · car rental|AutoNajem DEMO · прокат авто|AutoNajem DEMO · пракат аўто|AutoNajem DEMO · Autovermietung
Model językowy przez pośrednika|Language model via a proxy|Мовна модель через посередника|Моўная мадэль праз пасярэдніка|Sprachmodell über einen Vermittler
Nazwę modelu pokażemy po pierwszej odpowiedzi serwera. Odpowiada tylko, gdy żaden scenariusz nie pasuje. Akcje zawsze wymagają potwierdzenia.|We show the model name after the server's first answer. It answers only when no scenario fits. Actions always need confirmation.|Назву моделі покажемо після першої відповіді сервера. Вона відповідає лише тоді, коли жоден сценарій не підходить. Дії завжди потребують підтвердження.|Назву мадэлі пакажам пасля першага адказу сервера. Яна адказвае толькі тады, калі ніводны сцэнарый не падыходзіць. Дзеянні заўсёды патрабуюць пацвярджэння.|Den Modellnamen zeigen wir nach der ersten Serverantwort. Es antwortet nur, wenn kein Szenario passt. Aktionen brauchen immer eine Bestätigung.
Firma i rejestry|Business and registers|Бізнес і реєстри|Бізнес і рэестры|Unternehmen und Register
Założyć, zmienić, zawiesić, zakończyć firmę|Start, change, suspend or close a business|Відкрити, змінити, призупинити, закрити бізнес|Адкрыць, змяніць, прыпыніць, закрыць бізнес|Unternehmen gründen, ändern, ruhen lassen, beenden
KRS – sprawdź spółkę|KRS (court register) – check a company|KRS (судовий реєстр) – перевірте компанію|KRS (судовы рэестр) – праверце кампанію|KRS (Gerichtsregister) – Firma prüfen
Kontrahent po NIP|Business partner by tax number (NIP)|Контрагент за податковим номером (NIP)|Контрагент па падатковым нумары (NIP)|Geschäftspartner nach Steuernummer (NIP)
Osoby w pokazie|People in the demo|Особи в демонстрації|Асобы ў паказе|Personen in der Demo
Mama trójki dzieci, pracuje na etacie.|Mother of three, works full-time.|Мама трьох дітей, працює за трудовим договором.|Мама траіх дзяцей, працуе па працоўным дагаворы.|Mutter von drei Kindern, festangestellt.
Prowadzi firmę transportową, dwa auta i bus.|Runs a transport business, two cars and a van.|Має транспортну фірму, два авто й бус.|Мае транспартную фірму, два аўто і бус.|Führt ein Transportunternehmen, zwei Autos und einen Transporter.
Nauczycielka, opiekuje się mamą.|Teacher, cares for her mother.|Учителька, доглядає маму.|Настаўніца, даглядае маму.|Lehrerin, pflegt ihre Mutter.
Student, prawo jazdy od roku.|Student, has had a driving licence for a year.|Студент, має водійські права рік.|Студэнт, мае правы кіроўцы год.|Student, hat seit einem Jahr den Führerschein.
Nie musisz znać nazw usług. Wybierz, co się u Ciebie dzieje, albo przejdź 2-minutową wycieczkę po aplikacji.|You don't need to know the service names. Choose what is happening in your life, or take the 2-minute tour of the app.|Не потрібно знати назви послуг. Оберіть, що з вами відбувається, або пройдіть 2-хвилинну екскурсію застосунком.|Не трэба ведаць назвы паслуг. Абярыце, што з вамі адбываецца, або прайдзіце 2-хвілінную экскурсію па праграме.|Sie müssen die Dienstnamen nicht kennen. Wählen Sie, was bei Ihnen los ist, oder machen Sie die 2-minütige Tour durch die App.
Wycieczka po aplikacji (2 min)|App tour (2 min)|Екскурсія застосунком (2 хв)|Экскурсія па праграме (2 хв)|App-Tour (2 Min.)
Dostałem pismo i nie wiem, co zrobić|I got a letter and don't know what to do|Я отримав лист і не знаю, що робити|Я атрымаў ліст і не ведаю, што рабіць|Ich habe ein Schreiben bekommen und weiß nicht, was tun
Chcę zgłosić zdarzenie|I want to report an incident|Хочу повідомити про подію|Хачу паведаміць пра здарэнне|Ich möchte einen Vorfall melden
zdjęcie/nagranie → służba → potwierdzenie|photo/video → service → confirmation|фото/запис → служба → підтвердження|фота/запіс → служба → пацвярджэнне|Foto/Video → Dienststelle → Bestätigung
zapas → prośba do lekarza → recepta → apteka|supply → request to the doctor → prescription → pharmacy|запас → запит до лікаря → рецепт → аптека|запас → запыт да лекара → рэцэпт → аптэка|Vorrat → Anfrage an den Arzt → Rezept → Apotheke
plan formalności, każdy krok zatwierdzasz|a plan of formalities, you approve each step|план формальностей, кожен крок ви затверджуєте|план фармальнасцей, кожны крок вы зацвярджаеце|Plan der Formalitäten, jeden Schritt bestätigen Sie
Najczęściej używane przez Ciebie|Your most used|Найчастіше використовуєте ви|Вы карыстаецеся найчасцей|Von Ihnen am häufigsten genutzt
Jestem w niebezpieczeństwie lub widzę przestępstwo|I am in danger or I see a crime|Я в небезпеці або бачу злочин|Я ў небяспецы або бачу злачынства|Ich bin in Gefahr oder sehe eine Straftat
Zgłoś na policję|Report to the police|Повідомте поліцію|Паведаміце ў паліцыю|Bei der Polizei melden
Źle się czuję / potrzebuję leków|I feel unwell / I need medicine|Я погано почуваюся / мені потрібні ліки|Я дрэнна сябе адчуваю / мне патрэбныя лекі|Mir geht es schlecht / ich brauche Medikamente
Lekarz i czat|Doctor and chat|Лікар і чат|Лекар і чат|Arzt und Chat
Sprawy dzieci i rodziny|Children and family matters|Справи дітей і родини|Справы дзяцей і сям'і|Kinder- und Familienangelegenheiten
Pomoc społeczna|Social assistance|Соціальна допомога|Сацыяльная дапамога|Sozialhilfe
Bilety i opłaty|Tickets and fees|Квитки й оплати|Квіткі і аплаты|Tickets und Gebühren
Dokumenty w podróży|Documents when travelling|Документи в подорожі|Дакументы ў падарожжы|Dokumente auf Reisen
Pieniądze, podatki, urząd|Money, taxes, offices|Гроші, податки, установи|Грошы, падаткі, установы|Geld, Steuern, Ämter
Moje płatności|My payments|Мої платежі|Мае плацяжы|Meine Zahlungen
Kalkulator terminów|Deadline calculator|Калькулятор строків|Калькулятар тэрмінаў|Fristenrechner
Chcę mieć wpływ|I want to have a say|Хочу мати вплив|Хачу мець уплыў|Ich möchte mitbestimmen
Konsultacje i Sejm|Consultations and the Sejm (parliament)|Консультації та Сейм (парламент)|Кансультацыі і Сейм (парламент)|Konsultationen und Sejm (Parlament)
Koncepcja: referenda i podpisy online|Concept: referendums and signatures online|Концепція: референдуми й підписи онлайн|Канцэпцыя: рэферэндумы і подпісы анлайн|Konzept: Volksabstimmungen und Unterschriften online
Koncepcja: e-głosowanie|Concept: e-voting|Концепція: електронне голосування|Канцэпцыя: электроннае галасаванне|Konzept: E-Voting
Szkoła i studia|School and university|Школа й навчання|Школа і вучоба|Schule und Studium
Pełnomocnik spraw|Proxy for matters|Уповноважений у справах|Упаўнаважаны ў справах|Bevollmächtigter
Pozwolenie na budowę|Building permit|Дозвіл на будівництво|Дазвол на будаўніцтва|Baugenehmigung
Taryfa prądu|Electricity tariff|Тариф на електроенергію|Тарыф на электраэнергію|Stromtarif
Przewodnik jest uzupełnieniem „Wszystkich usług” – tamten katalog działa jak spis treści, ten jak rozmowa o sytuacji życiowej.|The guide complements "All services" – that catalogue works like a table of contents, this one like a conversation about your life situation.|Путівник доповнює «Усі послуги» – той каталог працює як зміст, а цей як розмова про життєву ситуацію.|Даведнік дапаўняе «Усе паслугі» – той каталог працуе як змест, а гэты як размова пра жыццёвую сітуацыю.|Der Ratgeber ergänzt „Alle Dienste“ – jener Katalog ist wie ein Inhaltsverzeichnis, dieser wie ein Gespräch über die Lebenslage.
Podłącz dowolny endpoint zgodny z OpenAI API (np. Bielik przez vLLM/Ollama, PLLuM). Bez konfiguracji asystent działa na scenariuszach offline.|Connect any endpoint compatible with the OpenAI API format (e.g. Bielik via vLLM/Ollama, PLLuM). Without setup the assistant works on offline scenarios.|Підключіть будь-який endpoint, сумісний з форматом OpenAI API (напр. Bielik через vLLM/Ollama, PLLuM). Без налаштування асистент працює на офлайн-сценаріях.|Падключыце любы endpoint, сумяшчальны з фарматам OpenAI API (напр. Bielik праз vLLM/Ollama, PLLuM). Без наладжвання асістэнт працуе на афлайн-сцэнарыях.|Verbinden Sie einen beliebigen Endpoint im OpenAI-API-Format (z. B. Bielik über vLLM/Ollama, PLLuM). Ohne Einrichtung arbeitet der Assistent mit Offline-Szenarien.
basal wybiera usługę z listy dozwolonych odpowiedzi (API /v1/systemone). Przy niskiej pewności asystent dopyta. W DEMO działa fallback na reguły.|basal picks a service from a list of allowed answers (API /v1/systemone). When confidence is low, the assistant asks a follow-up. In the DEMO the rules fallback works.|basal обирає послугу зі списку дозволених відповідей (API /v1/systemone). Якщо впевненість низька, асистент перепитає. У DEMO працює резервний варіант на правилах.|basal выбірае паслугу са спісу дазволеных адказаў (API /v1/systemone). Калі ўпэўненасць нізкая, асістэнт перапытае. У DEMO працуе рэзервовы варыянт на правілах.|basal wählt einen Dienst aus einer Liste erlaubter Antworten (API /v1/systemone). Bei geringer Sicherheit fragt der Assistent nach. In der DEMO greift die Regel-Ersatzlösung.
basal-2.0-4.5B (serwer, na Bieliku)|basal-2.0-4.5B (server, based on Bielik)|basal-2.0-4.5B (сервер, на основі Bielik)|basal-2.0-4.5B (сервер, на аснове Bielik)|basal-2.0-4.5B (Server, auf Basis von Bielik)
Klucz API (zapisywany tylko lokalnie)|API key (stored only locally)|Ключ API (зберігається лише локально)|Ключ API (захоўваецца толькі лакальна)|API-Schlüssel (nur lokal gespeichert)
Trzeba zaktualizować aplikację.|The app needs updating.|Потрібно оновити застосунок.|Трэба абнавіць праграму.|Die App muss aktualisiert werden.
Aplikacja w pokazie jest aktualna.|The app in the demo is up to date.|Застосунок у демонстрації оновлений.|Праграма ў паказе абноўленая.|Die App in der Demo ist aktuell.
Skrzynka e-Doręczenia|e-Doręczenia inbox (e-delivery)|Скринька e-Doręczenia (е-доставка)|Скрынка e-Doręczenia (э-дастаўка)|Postfach e-Doręczenia (E-Zustellung)
`;
const LANGS=[['pl','Polski','PL'],['en','English','EN'],['uk','Українська','УКР'],['be','Беларуская','БЕЛ'],['de','Deutsch','DE']];
const IDX={en:1,uk:2,be:3,de:4};
const KEY='v32-lang';
function getLang(){let l=null;try{l=localStorage.getItem(KEY)}catch(_){}return LANGS.some(x=>x[0]===l)?l:'pl'}
(function(){const q=new URLSearchParams(location.search).get('lang');if(q&&LANGS.some(x=>x[0]===q)){try{localStorage.setItem(KEY,q)}catch(_){}}})();
let L=getLang();
const UI={
 lang:{pl:'Język',en:'Language',uk:'Мова',be:'Мова',de:'Sprache'},
 choose:{pl:'Wybierz język',en:'Choose language',uk:'Оберіть мову',be:'Абярыце мову',de:'Sprache wählen'},
 chooseHint:{pl:'Nazwy urzędowe, np. mObywatel, mDowód i PESEL, zostają po polsku.',en:'Official names such as mObywatel, mDowód (ID card) and PESEL (personal ID number) stay in Polish.',uk:'Офіційні назви, як-от mObywatel, mDowód (посвідчення особи) і PESEL (ідентифікаційний номер), лишаються польською.',be:'Афіцыйныя назвы, напрыклад mObywatel, mDowód (пасведчанне асобы) і PESEL (ідэнтыфікацыйны нумар), застаюцца па-польску.',de:'Offizielle Namen wie mObywatel, mDowód (Personalausweis) und PESEL (Personenkennzahl) bleiben auf Polnisch.'},
 full:{en:'This page is available in Polish.',uk:'Ця сторінка доступна польською мовою.',be:'Гэтая старонка даступная па-польску.',de:'Diese Seite ist auf Polnisch verfügbar.'},
 part:{en:'Parts of this page are in Polish.',uk:'Частина цієї сторінки польською мовою.',be:'Частка гэтай старонкі па-польску.',de:'Teile dieser Seite sind auf Polnisch.'},
 bielik:{en:'Gemma answers in English. The offline model Bielik is Polish and answers mainly in Polish.',uk:'Gemma відповідає українською. Офлайн-модель Bielik польська й відповідає переважно польською.',be:'Gemma адказвае па-беларуску. Афлайн-мадэль Bielik польская і адказвае пераважна па-польску.',de:'Gemma antwortet auf Deutsch. Das Offline-Modell Bielik ist polnisch und antwortet vor allem auf Polnisch.'},
 all:{pl:'Wszystko z ekranu startowego',en:'Everything from the home screen',uk:'Усе з головного екрана',be:'Усё з галоўнага экрана',de:'Alles vom Startbildschirm'},
 g_notif:{pl:'🔔 Powiadomienia',en:'🔔 Notifications',uk:'🔔 Сповіщення',be:'🔔 Апавяшчэнні',de:'🔔 Benachrichtigungen'},
 g_todo:{pl:'📌 Sprawy i terminy',en:'📌 Matters and deadlines',uk:'📌 Справи та строки',be:'📌 Справы і тэрміны',de:'📌 Angelegenheiten und Fristen'},
 g_top:{pl:'⭐ Polecane',en:'⭐ Recommended',uk:'⭐ Рекомендоване',be:'⭐ Рэкамендаванае',de:'⭐ Empfohlen'},
 g_srv:{pl:'🧭 Usługi i dokumenty',en:'🧭 Services and documents',uk:'🧭 Послуги й документи',be:'🧭 Паслугі і дакументы',de:'🧭 Dienste und Dokumente'},
 g_me:{pl:'👤 Osoba i tryb seniora',en:'👤 Person and senior mode',uk:'👤 Особа й режим для літніх',be:'👤 Асоба і рэжым для пажылых',de:'👤 Person und Seniorenmodus'},
 g_oth:{pl:'ℹ️ Inne',en:'ℹ️ Other',uk:'ℹ️ Інше',be:'ℹ️ Іншае',de:'ℹ️ Sonstiges'},
 list:{pl:'Wszystkie ekrany (pełna lista)',en:'All screens (full list)',uk:'Усі екрани (повний список)',be:'Усе экраны (поўны спіс)',de:'Alle Bildschirme (vollständige Liste)'},
 changed:{pl:'Język: Polski',en:'Language: English',uk:'Мова: українська',be:'Мова: беларуская',de:'Sprache: Deutsch'}
};
function U(k){const o=UI[k]||{};return o[L]||o.pl||o.en||''}
// ---------- słownik ----------
const D=new Map();
DICT.trim().split('\n').forEach(line=>{const p=line.split('|');if(p.length===5)D.set(p[0],p)});
const CITY={'Warszawa':['Warsaw','Варшава','Варшава','Warschau'],'Kraków':['Kraków','Краків','Кракаў','Krakau'],'Lublin':['Lublin','Люблін','Люблін','Lublin'],'Gdańsk':['Gdańsk','Гданськ','Гданьск','Gdańsk']};
function pl3(n,a,b,c){n=Math.abs(n);const t=n%10,h=n%100;if(t===1&&h!==11)return a;if(t>=2&&t<=4&&(h<10||h>=20))return b;return c}
function plPL(n){return n===1?'rok':pl3(n,'rok','lata','lat')}
function age(n){n=+n;const i=IDX[L];if(!i)return n+' '+(n===1?'rok':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?'lata':'lat'));
 return [null,n+' '+(n===1?'year':'years'),n+' '+pl3(n,'рік','роки','років'),n+' '+pl3(n,'год','гады','гадоў'),n+' '+(n===1?'Jahr':'Jahre')][i]}
function days(n){n=+n;const i=IDX[L];return [null,n+' '+(n===1?'day':'days'),n+' '+pl3(n,'день','дні','днів'),n+' '+pl3(n,'дзень','дні','дзён'),n+' '+(n===1?'Tag':'Tage')][i]}
const PAT=[
 [/^(\d+) dni$/,m=>days(m[1])],
 [/^(Warszawa|Kraków|Lublin|Gdańsk), (\d+) (lat|lata|rok)$/,m=>(CITY[m[1]]?CITY[m[1]][IDX[L]-1]:m[1])+', '+age(m[2])],
 [/^(Warszawa|Kraków|Lublin|Gdańsk)$/,m=>CITY[m[1]][IDX[L]-1]],
 [/^Do: (.+)$/,m=>['','Due: ','До: ','Да: ','Bis: '][IDX[L]]+m[1]],
 [/^Termin minął: (.+)$/,m=>['','Deadline passed: ','Строк минув: ','Тэрмін мінуў: ','Frist abgelaufen: '][IDX[L]]+m[1]],
 [/^Pytanie (\d+) z (\d+)$/,m=>[ '',`Question ${m[1]} of ${m[2]}`,`Запитання ${m[1]} з ${m[2]}`,`Пытанне ${m[1]} з ${m[2]}`,`Frage ${m[1]} von ${m[2]}`][IDX[L]]],
 [/^Sprawy osoby: (.+)\.$/,m=>['','Matters of ','Справи особи: ','Справы асобы: ','Angelegenheiten von '][IDX[L]]+m[1]+'.'],
 [/^i (\d+) (inna sprawa|inne sprawy|innych spraw)$/,m=>{const n=+m[1];return [null,`and ${n} more`,`і ще ${n} `+pl3(n,'справа','справи','справ'),`і яшчэ ${n} `+pl3(n,'справа','справы','спраў'),`und ${n} weitere`][IDX[L]]}],
 [/^Kat\. ([A-Z0-9+, ]+)$/,m=>['','Cat. ','Кат. ','Кат. ','Klasse '][IDX[L]]+m[1]],
 [/^od (\d{4})$/,m=>['','since ','з ','з ','seit '][IDX[L]]+m[1]],
 [/^TAK, od (\d{4})$/,m=>['','YES, since ','ТАК, з ','ТАК, з ','JA, seit '][IDX[L]]+m[1]],
 [/^(\d+) pojazdy$/,m=>[ '',m[1]+' vehicles',m[1]+' транспортні засоби',m[1]+' транспартныя сродкі',m[1]+' Fahrzeuge'][IDX[L]]],
 [/^Prośba nr (\S+)$/,m=>['','Request no. ','Запит № ','Запыт № ','Anfrage Nr. '][IDX[L]]+m[1]],
 [/^Prośba nr (\S+)\. Wybierasz, co firma zobaczy\. Osoba w pokazie$/,m=>['',`Request no. ${m[1]}. You choose what the company sees. Demo person`,`Запит № ${m[1]}. Ви обираєте, що побачить фірма. Особа в демонстрації`,`Запыт № ${m[1]}. Вы выбіраеце, што ўбачыць фірма. Асоба ў паказе`,`Anfrage Nr. ${m[1]}. Sie wählen, was die Firma sieht. Person in der Demo`][IDX[L]]],
 [/^Firma zobaczy: (.+)$/,m=>['','The company will see: ','Фірма побачить: ','Фірма ўбачыць: ','Die Firma sieht: '][IDX[L]]+tr(m[1],1)],
 [/^Zobaczy: (.+)$/,m=>['','Will see: ','Побачить: ','Убачыць: ','Sieht: '][IDX[L]]+tr(m[1],1)],
 [/^źródło: (.+)$/,m=>['','source: ','джерело: ','крыніца: ','Quelle: '][IDX[L]]+tr(m[1],1)],
 [/^Ważny do (.+) \(czas polski\)$/,m=>['',`Valid until ${m[1]} (Polish time)`,`Дійсний до ${m[1]} (час у Польщі)`,`Сапраўдны да ${m[1]} (час у Польшчы)`,`Gültig bis ${m[1]} (polnische Zeit)`][IDX[L]]],
 [/^ważny do: (.+) \(czas polski\)$/,m=>['',`valid until: ${m[1]} (Polish time)`,`дійсний до: ${m[1]} (час у Польщі)`,`сапраўдны да: ${m[1]} (час у Польшчы)`,`gültig bis: ${m[1]} (polnische Zeit)`][IDX[L]]],
 [/^Wydano: (.+)$/,m=>['','Issued: ','Видано: ','Выдадзена: ','Ausgestellt: '][IDX[L]]+m[1]],
 [/^Do załatwienia: (\d+)$/,m=>['','To do: ','Справи: ','Справы: ','Zu erledigen: '][IDX[L]]+m[1]],
 [/^Po terminie w pokazie: (\d+)$/,m=>['','Overdue in the demo: ','Прострочено в демонстрації: ','Пратэрмінавана ў паказе: ','Überfällig in der Demo: '][IDX[L]]+m[1]],
 [/^Dokumenty: (\d+) (wymagają|wymaga) uwagi$/,m=>['',`Documents: ${m[1]} need attention`,`Документи: ${m[1]} потребують уваги`,`Дакументы: ${m[1]} патрабуюць увагі`,`Dokumente: ${m[1]} brauchen Aufmerksamkeit`][IDX[L]]],
 [/^\(zapisany (.+), czas polski\)\. Nie wysyłam go do Gemmy ani do serwera\.$/,m=>['',`(saved ${m[1]}, Polish time). I don't send it to Gemma or to a server.`,`(збережено ${m[1]}, час у Польщі). Я не надсилаю його до Gemma чи на сервер.`,`(захавана ${m[1]}, час у Польшчы). Я не адпраўляю яго ў Gemma ці на сервер.`,`(gespeichert ${m[1]}, polnische Zeit). Ich sende es weder an Gemma noch an einen Server.`][IDX[L]]],
 [/^W pokazie osoba (\S+) pasuje do: (.+)\. Nic nie jest zaznaczone, dopóki nie odpowiesz\.$/,m=>{const g=m[2].split(', ').map(x=>tr(x,1)).join(', ');return ['',`In the demo, ${m[1]} matches: ${g}. Nothing is ticked until you answer.`,`У демонстрації особа ${m[1]} відповідає: ${g}. Нічого не позначено, доки ви не відповісте.`,`У паказе асоба ${m[1]} адпавядае: ${g}. Нічога не адзначана, пакуль вы не адкажаце.`,`In der Demo passt ${m[1]} zu: ${g}. Nichts ist ausgewählt, bis Sie antworten.`][IDX[L]]}],
 [/^Do zapłaty: (.+)$/,m=>['','To pay: ','До сплати: ','Да аплаты: ','Zu zahlen: '][IDX[L]]+m[1]],
 [/^(\d+) (pozycje|pozycji|pozycja) – najbliższy termin: (.+?), (\S+)$/,m=>{const n=+m[1];return [null,`${n} items – next deadline: `,`${n} `+pl3(n,'позиція','позиції','позицій')+' – найближчий строк: ',`${n} `+pl3(n,'пазіцыя','пазіцыі','пазіцый')+' – бліжэйшы тэрмін: ',`${n} Posten – nächste Frist: `][IDX[L]]+(tr(m[3],1)||m[3])+', '+m[4]}],
 [/^Dokumenty wymagają uwagi \((\d+)\)\.$/,m=>['',`Documents need attention (${m[1]}).`,`Документи потребують уваги (${m[1]}).`,`Дакументы патрабуюць увагі (${m[1]}).`,`Dokumente brauchen Aufmerksamkeit (${m[1]}).`][IDX[L]]],
 [/^Termin w pokazie: (.+)\.$/,m=>['',`Demo deadline: ${m[1]}.`,`Строк у демонстрації: ${m[1]}.`,`Тэрмін у паказе: ${m[1]}.`,`Frist in der Demo: ${m[1]}.`][IDX[L]]],
 [/^Dzień dobry, (\S+)$/,m=>['','Good morning, ','Добрий день, ','Добры дзень, ','Guten Tag, '][IDX[L]]+m[1]],
 [/^Rodzina: (.+?) — aplikacja w pokazie wymaga aktualizacji\.$/,m=>['',`Family: ${m[1]} – the app in the demo needs updating.`,`Родина: ${m[1]} – застосунок у демонстрації потребує оновлення.`,`Сям'я: ${m[1]} – праграма ў паказе патрабуе абнаўлення.`,`Familie: ${m[1]} – die App in der Demo muss aktualisiert werden.`][IDX[L]]],
 [/^(\d+), (Warszawa|Kraków|Lublin|Gdańsk)$/,m=>m[1]+', '+CITY[m[2]][IDX[L]-1]],
 [/^(\d+) (lat|lata)$/,m=>age(m[1])],
 [/^Zalogowano jako (.+) \(DEMO\)$/,m=>['','Signed in as ','Ви увійшли як ','Вы ўвайшлі як ','Angemeldet als '][IDX[L]]+m[1]+' (DEMO)']
];
const PRE=/^[^\p{L}\p{N}„"“«(]+/u, SUF=/[^\p{L}\p{N}.!?)»\u201d\u201c"%]+$/u;
function look(c){const e=D.get(c);if(e)return e[IDX[L]];for(const [re,f] of PAT){const m=c.match(re);if(m)return f(m)}return null}
// zwraca tłumaczenie albo null
function tr(t,inner){
 if(!t)return null;const s=t.trim();if(!s)return null;
 let r=look(s);if(r!=null)return r;
 const pm=s.match(PRE),pre=pm?pm[0]:'';let core=s.slice(pre.length);const sm=core.match(SUF),suf=sm?sm[0]:'';core=core.slice(0,core.length-suf.length);
 if(core){r=look(core);if(r==null){const n=core.match(/^(\d+\.\s+)(.+)$/);if(n){const x=look(n[2]);if(x!=null)r=n[1]+x}}
  if(r!=null)return pre+r+suf;}
 if(core.includes(' · ')){const parts=core.split(' · ');let ok=true;const out=parts.map(p=>{if(!/\p{L}{2,}/u.test(p)||!/\p{Ll}/u.test(p))return p;const x=tr(p,1);if(x==null){ok=false;return p}return x});if(ok)return pre+out.join(' · ')+suf}
 const ss=core.split(/(?<=[.!?])\s+/);if(ss.length>1){const o=[];for(const x of ss){const y=look(x);if(y==null)return null;o.push(y)}return pre+o.join(' ')+suf}
 return null;
}
// poprawki także po polsku: „43 lat” → „43 lata”, „undefined · ” w profilu (v30)
function fixPL(v){return v.replace(/\bundefined · /g,'').replace(/(Warszawa|Kraków|Lublin|Gdańsk), (\d+) lat\b/g,(a,c,n)=>c+', '+n+' '+plPL(+n))}
const SKIP='script,style,svg,textarea,code,[data-v32skip],.msg.u,.v32lb';
let untr=0,total=0;
function isPolishish(s){return /[a-ząćęłńóśźż]{3,}\s+[a-ząćęłńóśźż]{2,}/i.test(s)&&!/[\u0400-\u04ff]/.test(s)}
function walk(root,count){
 if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){
  const p=n.parentElement;if(!p||p.closest(SKIP))continue;
  const v=n.nodeValue;if(!v||!v.trim())continue;
  if(n.__v32out!==v){n.__v32pl=v}
  const orig=n.__v32pl;let out=fixPL(orig);
  if(L!=='pl'){const x=tr(out);if(x!=null){const lead=out.match(/^\s*/)[0],trail=out.match(/\s*$/)[0];out=lead+x+trail}
   else if(count&&isPolishish(out)){untr+=out.length}
   if(count&&/\p{L}{3,}/u.test(out))total+=out.length}
  if(out!==v){n.nodeValue=out}n.__v32out=out;
 }
 root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{if(el.closest(SKIP))return;['placeholder','aria-label','title'].forEach(a=>{const v=el.getAttribute(a);if(v==null)return;const k='__v32'+a;if(el[k+'o']!==v)el[k]=v;let out=fixPL(el[k]);if(L!=='pl'){const x=tr(out);if(x!=null)out=x}if(out!==v)el.setAttribute(a,out);el[k+'o']=out})});
}
// ---------- informacja „strona po polsku” ----------
function notice(){
 const sc=app&&app.querySelector('.scroll');if(!sc)return;const old=sc.querySelector('.v32note');
 if(L==='pl'){if(old)old.remove();return}
 const ratio=total?untr/total:0;const kind=ratio>.55?'full':ratio>.06?'part':'';
 const ast=top()==='assistant';
 if(!kind&&!ast){if(old)old.remove();return}
 const txt=(kind?U(kind):'')+(ast?(kind?' ':'')+U('bielik'):'');
 if(old&&old.dataset.k===txt)return;if(old)old.remove();
 sc.insertAdjacentHTML('afterbegin',`<p class="v32note" role="note" data-v32skip="1" lang="${L==='be'?'be':L}" data-k="${txt.replace(/"/g,'')}">🌐 ${txt} <button type="button" class="v32nb" onclick="v32Pick()">${U('lang')}</button></p>`);
}
function top(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/)[0]}
// ---------- wybór języka ----------
function langBtns(cls){return `<div class="v32lb ${cls||''}" role="group" aria-label="${U('choose')} / Choose language">${LANGS.map(([k,n])=>`<button type="button" lang="${k}" aria-pressed="${k===L}" class="${k===L?'on':''}" onclick="v32Set('${k}')">${n}</button>`).join('')}</div>`}
window.v32Pick=function(){
 const m=modal(`<h3 data-v32skip="1">🌐 ${U('choose')}${L!=='en'?' · Choose language':''}</h3>${langBtns('big')}<p class="muted" data-v32skip="1">${U('chooseHint')}</p><button class="btn ghost" data-v32skip="1" onclick="closeModal()">${tr('Zamknij')||'Zamknij'}</button>`);
 const f=m.querySelector('.v32lb button.on')||m.querySelector('.v32lb button');if(f)setTimeout(()=>f.focus(),30);
};
window.v32Set=function(k){if(!LANGS.some(x=>x[0]===k))return;L=k;try{localStorage.setItem(KEY,k);localStorage.setItem('v32-asked','1')}catch(_){}
 try{const u=new URL(location.href);if(u.searchParams.has('lang')){u.searchParams.set('lang',k);history.replaceState(null,'',u.toString())}}catch(_){}
 document.documentElement.lang=k;try{closeModal()}catch(_){}
 route();setTimeout(()=>{run(true);try{toast(U('changed'))}catch(_){}},30)};
function topBtn(){
 const tb=app&&app.querySelector('.top');if(!tb||tb.querySelector('.v32top'))return;
 const cur=LANGS.find(x=>x[0]===L);
 const b=document.createElement('button');b.type='button';b.className='v32top';b.setAttribute('data-v32skip','1');
 b.setAttribute('aria-label',`${U('lang')}: ${cur[1]}. ${U('choose')}${L!=='en'?' / Choose language':''}`);b.innerHTML=`🌐<span>${cur[2]}</span>`;b.onclick=()=>v32Pick();
 const dm=tb.querySelector('.demo');tb.insertBefore(b,dm||null);
}
function cards(){
 const sc=app&&app.querySelector('.scroll');if(!sc)return;const p=top();
 const want=p==='settings'||p==='guide'||(p==='moj-profil-pytania'&&/Pytanie 1 z|Question 1 of|Запитання 1 з|Пытанне 1 з|Frage 1 von/.test(sc.textContent));
 if(want&&!sc.querySelector('#v32card')){
  sc.insertAdjacentHTML('afterbegin',`<div class="card" id="v32card" data-v32skip="1"><h3>🌐 ${U('lang')}${L!=='en'?' · Language':''}</h3>${langBtns('big')}<p class="muted">${U('chooseHint')}</p></div>`);
 }
}
function panel(){
 const pn=document.querySelector('.v31panel:not(.inapp)');if(!pn)return;
 let box=pn.querySelector('#v32panel');
 if(!box){const b=pn.querySelector('.v31badge');if(!b)return;b.insertAdjacentHTML('afterend',`<div id="v32panel" data-v32skip="1"></div>`);box=pn.querySelector('#v32panel')}
 const h=`<div class="v31h">🌐 ${U('lang')}${L!=='en'?' · Language':''}</div>${langBtns('row')}`;if(box.dataset.l!==L){box.innerHTML=h;box.dataset.l=L}
 const ip=document.querySelector('.v31panel.inapp');if(ip&&!ip.querySelector('#v32panel2')){const b=ip.querySelector('.v31badge');if(b)b.insertAdjacentHTML('afterend',`<div id="v32panel2" data-v32skip="1"><div class="v31h">🌐 ${U('lang')}${L!=='en'?' · Language':''}</div>${langBtns('row')}</div>`)}
}
function firstRun(){let asked=null;try{asked=localStorage.getItem('v32-asked')||localStorage.getItem(KEY)}catch(_){}
 if(asked||new URLSearchParams(location.search).has('lang'))return;const nl=(navigator.language||'pl').slice(0,2).toLowerCase();
 if(nl==='pl')return;try{localStorage.setItem('v32-asked','1')}catch(_){}setTimeout(()=>{if(!document.querySelector('.modal'))v32Pick()},600)}
// ---------- nic nie jest zwinięte ----------
function unhide(){
 document.querySelectorAll('details:not([data-v32o])').forEach(d=>{d.setAttribute('data-v32o','1');if(!d.open)d.open=true});
 const more=document.getElementById('moreal');if(more&&!more.dataset.v32){more.dataset.v32='1';try{more.click()}catch(_){}}
 const sc=app&&app.querySelector('.scroll');
 if(sc){sc.querySelectorAll('.alert').forEach(c=>{if(c.style.display==='none')c.style.display=''});const mo=sc.querySelector('#moreal');if(mo)mo.style.display='none'}
 const m=document.getElementById('v31more');
 if(m){m.open=true;m.classList.add('v32flat');if(!m.dataset.v32){m.dataset.v32='1';m.addEventListener('toggle',()=>{if(!m.open)m.open=true});const s=m.querySelector('summary');if(s){s.setAttribute('tabindex','-1');s.setAttribute('role','heading');s.setAttribute('aria-level','2');s.addEventListener('click',e=>e.preventDefault())}}
  const s=m.querySelector('summary');if(s){const lbl=U('all');if(!s.querySelector('.v32h')){s.innerHTML=`<span class="v32h" data-v32skip="1"></span>`}const h=s.querySelector('.v32h');if(h.textContent!==lbl)h.textContent=lbl}
  group(m.querySelector('.v31mb'));
 }
 const lst=document.getElementById('v31list');if(lst){lst.open=true;lst.classList.add('v32flat');if(!lst.dataset.v32){lst.dataset.v32='1';lst.addEventListener('toggle',()=>{if(!lst.open)lst.open=true});const s=lst.querySelector('summary');if(s){s.setAttribute('role','heading');s.setAttribute('aria-level','2');s.setAttribute('tabindex','-1');s.addEventListener('click',e=>e.preventDefault())}}}
}
const GR=['g_notif','g_todo','g_top','g_srv','g_me','g_oth'];
function kind(c){
 if(c.matches('.alert,#moreal'))return 'g_notif';
 if(c.matches('#v20go,#v26homewrap,#v21home,#v29home,#v30home,.v30lead,.v20go,.v21go,.v29lead'))return 'g_top';
 if(c.matches('.chips,#v19h'))return 'g_me';
 if(c.matches('.searchbar,.grid,h3,.doc,#v23pill,.v23pill,.row'))return 'g_srv';
 if(c.matches('.card')){const t=c.textContent||'';if(/Co chcesz załatwić|Do załatwienia|terminy|Nadchodzące|What do you need|To do|deadline/i.test(t))return 'g_todo';return 'g_oth'}
 return 'g_oth';
}
function group(mb){
 if(!mb)return;let G={};mb.querySelectorAll(':scope > .v32g').forEach(g=>G[g.dataset.g]=g);
 GR.forEach(k=>{if(!G[k]){const g=document.createElement('section');g.className='v32g';g.dataset.g=k;g.setAttribute('aria-labelledby','v32g-'+k);g.innerHTML=`<h3 class="v32gh" id="v32g-${k}" data-v32skip="1"></h3>`;mb.appendChild(g);G[k]=g}const h=G[k].querySelector('.v32gh');if(h.textContent!==U(k))h.textContent=U(k)});
 [...mb.children].forEach(c=>{if(c.classList.contains('v32g'))return;G[kind(c)].appendChild(c)});
 GR.forEach(k=>{G[k].hidden=G[k].children.length<=1});
}
// ---------- asystent: język odpowiedzi i reguły dla innych języków ----------
const LNAME={en:'angielskim (English)',uk:'ukraińskim (українською)',be:'białoruskim (па-беларуску)',de:'niemieckim (Deutsch)'};
const _fetch=window.fetch.bind(window);
window.fetch=function(u,o){try{if(L!=='pl'&&o&&typeof o.body==='string'){const url=String(u&&u.url||u);let proxy='';try{proxy=(S.v10&&S.v10.proxy)||''}catch(_){}
  if((/workers\.dev/.test(url)||(proxy&&url.indexOf(proxy.replace(/\/$/,''))===0))&&o.body.indexOf('"task"')>-1){const b=JSON.parse(o.body);if(b&&typeof b.pytanie==='string'&&b.task==='chat'){b.pytanie+=`\n\n[Odpowiedz w języku ${LNAME[L]}. Nazwy urzędowe (mObywatel, mDowód, PESEL) zostaw po polsku.]`;o=Object.assign({},o,{body:JSON.stringify(b)})}}}}catch(_){}return _fetch(u,o)};
const RULES=[
 [/(bought|sold) a car|купив авто|продав авто|купіў аўта|прадаў аўта|auto (gekauft|verkauft)/i,'kupiłem auto'],
 [/lost.*(wallet|purse|id)|(wallet|purse).*(lost|stolen)|загуби|згуби|втратив гаманець|гаманець|кашал[её]к|geldbörse|brieftasche|portemonnaie/i,'zgubiłem portfel'],
 [/shelter|bunker|укритт|сховищ|сховіш|схавац|сховатис|schutzraum/i,'gdzie najbliższy schron'],
 [/alarm|air raid|siren|тривог|трывог|сирен|сірэн/i,'co robić podczas alarmu'],
 [/moving|move house|relocat|переїзд|переїжджа|пераезд|пераязджа|umzug|ziehe um/i,'przeprowadzam się'],
 [/insurance|страхов|поліс|haftpflicht|versicherung/i,'kiedy kończy się OC'],
 [/child benefit|800|допомог.*дит|дапамог.*дзіц|kindergeld/i,'chcę złożyć 800 plus'],
 [/prescription|medicine|рецепт|рэцэпт|ліки|лекі|rezept|medikament/i,'kończy mi się lek'],
 [/\bfine\b|speeding|штраф|bußgeld|strafzettel/i,'dostałem mandat'],
 [/letter|tax office|лист |ліст |податков|падатков|schreiben|finanzamt/i,'dostałem pismo'],
 [/scam|fraud|phishing|strange (text|sms)|шахра|ашукан|betrug/i,'dziwny sms oszustwo'],
 [/pension|пенсі|rente/i,'ile będę mieć emerytury'],
 [/what applies|що мене стосу|што мяне датыч|was betrifft mich/i,'co mnie dotyczy'],
 [/\bid card|identity card|посвідчен|пасведчан|personalausweis/i,'nowy dowód']
];
function wrapAsk(){if(!window.ask||window.ask.__v32)return;const a=window.ask;const w=function(q){try{if(L!=='pl'&&typeof q==='string'&&q.trim()){const hit=RULES.find(r=>r[0].test(q));if(hit&&!q.includes('(PL:'))q=q+' (PL: '+hit[1]+')'}}catch(_){}return a.apply(this,[q].concat([].slice.call(arguments,1)))};w.__v32=1;window.ask=w;try{ask=w}catch(_){}}
// ---------- przebieg ----------
let busy=false,tmr=null;
function run(){if(busy)return;busy=true;try{
 document.documentElement.lang=L;document.body.classList.toggle('v32nonpl',L!=='pl');
 unhide();topBtn();cards();panel();wrapAsk();
 untr=0;total=0;walk(app,true);
 document.querySelectorAll('.v31panel,.side,.foot').forEach(r=>{if(!app.contains(r))walk(r,false)});
 const m=document.querySelector('.modal');if(m&&!app.contains(m))walk(m,false);
 notice();
}catch(e){}finally{busy=false}}
function sched(){if(busy)return;clearTimeout(tmr);tmr=setTimeout(run,20)}
new MutationObserver(sched).observe(document.body,{childList:true,subtree:true,characterData:true});
const _r=route;route=function(){const o=_r.apply(this,arguments);run();return o};window.route=route;onhashchange=route;
const st=document.createElement('style');st.textContent=`
.app,.v31panel{overflow-wrap:break-word}.app h2,.app h3,.app b,.app button,.app a,.v31panel *{overflow-wrap:break-word;hyphens:auto}
.v32top{display:inline-flex;align-items:center;gap:3px;min-width:44px;height:36px;border-radius:18px;border:1.5px solid #d6dbe6;background:#fff;color:var(--txt);font-weight:800;font-size:13px;cursor:pointer;padding:0 8px;flex-shrink:0}
.v32top:focus-visible,.v32lb button:focus-visible,.v32nb:focus-visible{outline:3px solid #ffbf47;outline-offset:2px}
body.senior .v32top{height:44px;font-size:15px;min-width:54px}
.top{min-width:0}body.senior .top{flex-wrap:wrap;row-gap:6px;height:auto}body.senior .top h2{flex:1 0 auto;min-width:auto;overflow:visible;max-width:100%}body.senior .top .v31ic{margin-left:auto}.top h2{min-width:0;overflow:hidden;text-overflow:ellipsis}
.v32lb{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;margin:8px 0}.v32lb button{min-height:48px;border-radius:14px;border:2px solid #d6dbe6;background:#fff;font-family:inherit;font-weight:700;font-size:16px;line-height:1.2;cursor:pointer;color:var(--txt);padding:8px;min-width:0;overflow-wrap:anywhere}
.v32lb button.on{border-color:var(--red);background:#fff1f3;color:#a3102d}.v32lb button.on:after{content:' ✓'}
.v32lb.big button{min-height:56px;font-size:18px}.v32lb.row{grid-template-columns:repeat(auto-fit,minmax(96px,auto))}.v32lb.row button{min-height:40px;padding:4px 12px;font-size:14px;border-radius:20px}body.senior .v32lb.row{grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}body.senior .v32lb.row button{min-height:52px;font-size:17px}
body.senior .v32lb button{min-height:72px;font-size:22px}body.senior .v32lb{grid-template-columns:minmax(0,1fr)}
.v32note{background:#eef4ff;border:1px solid #c9d8f5;color:var(--txt);border-radius:12px;padding:8px 10px;font-size:.85em;margin:0 0 10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.v32nb{border:1.5px solid var(--blue);background:#fff;color:var(--blue);border-radius:14px;padding:3px 10px;font:inherit;font-weight:700;cursor:pointer}
body.senior .v32note{font-size:1.05em}
details.v32flat>summary{list-style:none;cursor:default}details.v32flat>summary::-webkit-details-marker{display:none}details.v32flat>summary:after{content:none!important}
#v31more.v32flat>summary{background:none;box-shadow:none;padding:6px 2px;font-size:1.1em}
.v32g{margin:6px 0 14px}.v32gh{font-size:.8em;text-transform:uppercase;letter-spacing:1px;color:var(--mut);margin:14px 2px 8px}
body.senior .v32gh{font-size:1em}
#v31list.v32flat>summary{font-size:.95em}
body.contrast .v32lb button,body.contrast .v32top,body.contrast .v32note{background:#000;color:#fff;border-color:#fff}body.contrast .v32lb button.on{color:#ffeb3b}
body.v32nonpl .v31name small,body.v32nonpl .v31cs{white-space:normal}
.v31short a{overflow-wrap:anywhere;hyphens:auto}
.scroll b,.scroll em{overflow-wrap:anywhere}body.senior .scroll b,body.senior .scroll em{white-space:normal!important;max-width:100%}
`;document.head.appendChild(st);
document.documentElement.lang=L;
firstRun();route();
})();
