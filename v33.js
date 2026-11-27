// ===== v33: „Dokument działa bez zasięgu” i „Bezpieczeństwo w jednym miejscu” z przyciskiem „Jestem bezpieczny” dla rodziny =====
// Koncepcja własna (Tomasz Krawczyk). Inspiracja (rozwinięta po swojemu, nie skopiowana):
// https://x.com/stell4rrsi/status/2126023063166726547 (błąd aplikacji przy kontroli biletów, nie dało się pokazać legitymacji)
// https://x.com/Sluzby_w_akcji/status/2124192736538673576 (krytyka mnożenia aplikacji rządowych)
// https://x.com/MSWiA_GOV_PL/status/2123741040133734846 (instrukcja na wypadek ataku z powietrza w mObywatelu)
// Wszystkie symulacje są oznaczone DEMO. Nic nie jest wysyłane: status „Jestem bezpieczny” zapisuje się tylko w tym telefonie.
// Kod QR: lokalna biblioteka qrcode.js z repozytorium, podpis: WebCrypto ECDSA P-256 w przeglądarce (klucz DEMO z tego telefonu).
// Bez płatnych API. Łańcuch Gemma → reguły → Bielik i pobieranie Bielika bez zmian.
// Niczego nie usuwamy: nowe ekrany #/offline, #/kontrola/<dokument>, #/bezpieczenstwo + znaczki i skróty na istniejących ekranach.
(function(){
const DEMO='<span class="demo">DEMO</span>';
const SK='v33-state';
const V20K='mob20_alarm_state_v1';
const FEM={anna:1,halina:1};
function top(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/)[0]}
function sub(){return decodeURIComponent((location.hash.split('/')[2]||'').split('?')[0])}
function e(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function per(){try{return S.persona||'anna'}catch(_){return 'anna'}}
function PP(k){try{return PERS[k||per()]||{}}catch(_){return {}}}
function ld(k,d){try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(_){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}
function st(){const s=ld(SK,{});s.sync=s.sync||{};s.rel=s.rel||{};s.sent=s.sent||{};return s}
function put(s){sv(SK,s)}
function senior(){try{return !!S.senior}catch(_){return false}}

// ---------- język (spójny z v32: localStorage „v32-lang”) ----------
const LI={pl:0,en:1,uk:2,be:3,de:4};
const LOC={pl:'pl-PL',en:'en-GB',uk:'uk-UA',be:'be-BY',de:'de-DE'};
function L(){let l='pl';try{l=localStorage.getItem('v32-lang')||'pl'}catch(_){}return LI[l]!=null?l:'pl'}
const TX={
 offTitle:['📴 Dokumenty bez zasięgu','📴 Documents without signal','📴 Документи без зв’язку','📴 Дакументы без сувязі','📴 Dokumente ohne Netz'],
 offLead:['Kontrola biletu, policja, wypożyczalnia – dokument pokażesz także bez internetu.','Ticket check, police, rental desk – you can show the document without internet too.','Контроль квитків, поліція, прокат – документ можна показати і без інтернету.','Кантроль квіткоў, паліцыя, пракат – дакумент можна паказаць і без інтэрнэту.','Fahrkartenkontrolle, Polizei, Vermietung – das Dokument geht auch ohne Internet.'],
 badge:['Dostępny offline · ostatnia weryfikacja: {m} temu','Available offline · last verified: {m} ago','Доступний офлайн · остання перевірка: {m} тому','Даступны афлайн · апошняя праверка: {m} таму','Offline verfügbar · zuletzt geprüft vor {m}'],
 justNow:['Dostępny offline · zweryfikowano przed chwilą','Available offline · verified just now','Доступний офлайн · перевірено щойно','Даступны афлайн · праверана толькі што','Offline verfügbar · gerade geprüft'],
 min:['min','min','хв','хв','Min.'],hr:['godz.','h','год','гадз.','Std.'],
 ctl:['Kontrola bez internetu','Offline check','Перевірка без інтернету','Праверка без інтэрнэту','Kontrolle ohne Internet'],
 sim:['Symuluj brak sieci','Simulate no network','Імітувати відсутність мережі','Імітаваць адсутнасць сеткі','Kein Netz simulieren'],
 netOff:['Brak sieci (symulacja). Dokumenty i kontrola bez internetu działają.','No network (simulation). Documents and the offline check still work.','Немає мережі (імітація). Документи і перевірка без інтернету працюють.','Няма сеткі (імітацыя). Дакументы і праверка без інтэрнэту працуюць.','Kein Netz (Simulation). Dokumente und Offline-Kontrolle funktionieren.'],
 netReal:['Telefon jest bez internetu. Dokumenty działają offline.','This phone has no internet. Documents work offline.','Телефон без інтернету. Документи працюють офлайн.','Тэлефон без інтэрнэту. Дакументы працуюць афлайн.','Kein Internet. Dokumente funktionieren offline.'],
 netBack:['Przywróć sieć','Restore network','Відновити мережу','Аднавіць сетку','Netz wiederherstellen'],
 netOn:['Sieć: jest','Network: on','Мережа: є','Сетка: ёсць','Netz: an'],netNo:['Sieć: brak','Network: off','Мережа: немає','Сетка: няма','Netz: aus'],
 refresh:['Odśwież weryfikację','Refresh verification','Оновити перевірку','Абнавіць праверку','Prüfung aktualisieren'],
 refreshNo:['Bez sieci nie odświeżysz weryfikacji. Dokument nadal działa offline.','You can’t refresh without network. The document still works offline.','Без мережі перевірку не оновити. Документ і далі працює офлайн.','Без сеткі праверку не абнавіць. Дакумент і далей працуе афлайн.','Ohne Netz keine Aktualisierung. Das Dokument funktioniert weiter offline.'],
 refreshed:['Zweryfikowano wszystkie dokumenty (DEMO).','All documents verified (DEMO).','Усі документи перевірено (DEMO).','Усе дакументы правераны (DEMO).','Alle Dokumente geprüft (DEMO).'],
 planB:['Plan B: gdy coś nie działa','Plan B: when something fails','План Б: коли щось не працює','План Б: калі нешта не працуе','Plan B: wenn etwas nicht klappt'],
 pb1:['Włącz „Kontrola bez internetu”. Działa też w trybie samolotowym.','Turn on “Offline check”. It also works in airplane mode.','Увімкніть «Перевірка без інтернету». Працює і в режимі польоту.','Уключыце «Праверка без інтэрнэту». Працуе і ў рэжыме палёту.','„Kontrolle ohne Internet“ öffnen. Geht auch im Flugmodus.'],
 pb2:['Pokaż kod QR kontrolerowi. Czytnik sprawdza podpis bez sieci, a zegar na żywo pokazuje, że to nie zrzut ekranu.','Show the QR code to the inspector. The reader checks the signature offline; the live clock shows it is not a screenshot.','Покажіть QR-код контролеру. Зчитувач перевіряє підпис без мережі, а живий годинник показує, що це не знімок екрана.','Пакажыце QR-код кантралёру. Чытнік правярае подпіс без сеткі, а жывы гадзіннік паказвае, што гэта не здымак экрана.','QR-Code zeigen. Das Lesegerät prüft die Signatur offline; die Live-Uhr zeigt, dass es kein Screenshot ist.'],
 pb3:['Czytnik nie działa? Podaj numer dokumentu do ręcznego sprawdzenia:','Reader not working? Give the document number for a manual check:','Зчитувач не працює? Назвіть номер документа для ручної перевірки:','Чытнік не працуе? Назавіце нумар дакумента для ручной праверкі:','Lesegerät defekt? Dokumentnummer zur manuellen Prüfung nennen:'],
 how:['Jak to działa','How it works','Як це працює','Як гэта працуе','So funktioniert es'],
 howTxt:['Koncepcja: dokument jest zapisany w telefonie razem z podpisem wydawcy. Kod QR zmienia się co 30 s i jest podpisany kluczem z telefonu (w pokazie: ECDSA P-256 w przeglądarce, bez serwera). Kontroler sprawdza podpis kluczem publicznym, także bez internetu. Nic nie jest wysyłane.','Concept: the document is stored on the phone with the issuer’s signature. The QR code changes every 30 s and is signed with a key on the phone (in the demo: ECDSA P-256 in the browser, no server). The inspector checks it with the public key, even offline. Nothing is sent.','Концепція: документ зберігається в телефоні разом із підписом видавця. QR-код змінюється кожні 30 с і підписаний ключем із телефону (у демо: ECDSA P-256 у браузері, без сервера). Контролер перевіряє підпис публічним ключем, навіть без інтернету. Нічого не надсилається.','Канцэпцыя: дакумент захоўваецца ў тэлефоне разам з подпісам выдаўца. QR-код мяняецца кожныя 30 с і падпісаны ключом з тэлефона (у дэма: ECDSA P-256 у браўзеры, без сервера). Кантралёр правярае подпіс публічным ключом, нават без інтэрнэту. Нічога не адпраўляецца.','Konzept: Das Dokument liegt samt Signatur des Ausstellers auf dem Handy. Der QR-Code wechselt alle 30 s und ist mit einem Schlüssel auf dem Handy signiert (Demo: ECDSA P-256 im Browser, ohne Server). Die Kontrolle prüft mit dem öffentlichen Schlüssel, auch offline. Nichts wird gesendet.'],
 ctlT:['Kontrola dokumentu','Document check','Перевірка документа','Праверка дакумента','Dokumentenkontrolle'],
 works:['Działa bez internetu','Works without internet','Працює без інтернету','Працуе без інтэрнэту','Funktioniert ohne Internet'],
 newCode:['Nowy kod za {s} s','New code in {s} s','Новий код через {s} с','Новы код праз {s} с','Neuer Code in {s} s'],
 docNo:['Numer dokumentu','Document number','Номер документа','Нумар дакумента','Dokumentnummer'],
 validTo:['Ważny do','Valid until','Дійсний до','Дзейны да','Gültig bis'],
 verify:['Sprawdź jak kontroler','Check as the inspector','Перевірити як контролер','Праверыць як кантралёр','Als Kontrolle prüfen'],
 verOk:['Podpis poprawny · kod świeży ({s} s) · sprawdzono bez internetu','Signature valid · fresh code ({s} s) · checked offline','Підпис правильний · код свіжий ({s} с) · перевірено без інтернету','Подпіс правільны · код свежы ({s} с) · праверана без інтэрнэту','Signatur gültig · Code frisch ({s} s) · offline geprüft'],
 verBad:['Podpis niepoprawny – kod nieważny','Invalid signature – code rejected','Підпис неправильний – код недійсний','Подпіс няправільны – код несапраўдны','Signatur ungültig – Code abgelehnt'],
 noSign:['Ta przeglądarka nie podpisuje kodu (brak WebCrypto). Kod jest wzorem DEMO.','This browser can’t sign the code (no WebCrypto). The code is a DEMO pattern.','Цей браузер не підписує код (немає WebCrypto). Код – зразок DEMO.','Гэты браўзер не падпісвае код (няма WebCrypto). Код – узор DEMO.','Dieser Browser kann nicht signieren (kein WebCrypto). Der Code ist ein DEMO-Muster.'],
 close:['Zamknij','Close','Закрити','Закрыць','Schließen'],
 live:['Zegar na żywo – zrzut ekranu by się nie ruszał','Live clock – a screenshot would not move','Живий годинник – знімок екрана не рухався б','Жывы гадзіннік – здымак экрана не рухаўся б','Live-Uhr – ein Screenshot würde stehen bleiben'],
 sigLbl:['Podpis','Signature','Підпис','Подпіс','Signatur'],
 hubT:['🛡️ Bezpieczeństwo w jednym miejscu','🛡️ Safety in one place','🛡️ Безпека в одному місці','🛡️ Бяспека ў адным месцы','🛡️ Sicherheit an einem Ort'],
 hubLead:['Alerty, instrukcje, schrony i rodzina – w mObywatelu, bez kolejnej aplikacji.','Alerts, instructions, shelters and family – in mObywatel, no extra app.','Сповіщення, інструкції, укриття і родина – в mObywatel, без ще однієї програми.','Апавяшчэнні, інструкцыі, сховішчы і сям’я – у mObywatel, без яшчэ адной праграмы.','Warnungen, Anleitungen, Schutzräume und Familie – in mObywatel, ohne weitere App.'],
 safeM:['✅ Jestem bezpieczny','✅ I’m safe','✅ Я в безпеці','✅ Я ў бяспецы','✅ Ich bin in Sicherheit'],
 safeF:['✅ Jestem bezpieczna','✅ I’m safe','✅ Я в безпеці','✅ Я ў бяспецы','✅ Ich bin in Sicherheit'],
 safeSub:['Wyślij status rodzinie','Send status to family','Надіслати статус родині','Адправіць статус сям’і','Status an die Familie senden'],
 sentAt:['Wysłano do rodziny o {t}. Nic nie wyszło z telefonu.','Sent to family at {t}. Nothing left the phone.','Надіслано родині о {t}. Нічого не вийшло з телефону.','Адпраўлена сям’і а {t}. Нічога не выйшла з тэлефона.','Um {t} an die Familie gesendet. Nichts hat das Handy verlassen.'],
 famT:['Rodzina – kto jest bezpieczny','Family – who is safe','Родина – хто в безпеці','Сям’я – хто ў бяспецы','Familie – wer ist in Sicherheit'],
 famNote:['Osoby z konta rodzinnego i z przełącznika kont na tym telefonie.','People from the family account and the account switcher on this phone.','Особи з родинного акаунта і з перемикача акаунтів на цьому телефоні.','Асобы з сямейнага акаўнта і з пераключальніка акаўнтаў на гэтым тэлефоне.','Personen aus dem Familienkonto und dem Kontowechsel auf diesem Handy.'],
 safeStM:['bezpieczny','safe','в безпеці','у бяспецы','in Sicherheit'],safeStF:['bezpieczna','safe','в безпеці','у бяспецы','in Sicherheit'],
 none:['brak odpowiedzi','no reply','немає відповіді','няма адказу','keine Antwort'],
 reminded:['przypomnienie wysłane, czekamy','reminder sent, waiting','нагадування надіслано, чекаємо','напамін адпраўлены, чакаем','Erinnerung gesendet, warten'],
 remind:['Przypomnij','Remind','Нагадати','Нагадаць','Erinnern'],
 call:['Zadzwoń','Call','Подзвонити','Патэлефанаваць','Anrufen'],
 askAll:['Zapytaj wszystkich, czy są bezpieczni','Ask everyone if they are safe','Запитати всіх, чи вони в безпеці','Спытаць усіх, ці яны ў бяспецы','Alle fragen, ob sie sicher sind'],
 you:['to Ty','you','це Ви','гэта Вы','Sie'],
 onPhone:['konto na tym telefonie','account on this phone','акаунт на цьому телефоні','акаўнт на гэтым тэлефоне','Konto auf diesem Handy'],
 kSenior:['tryb seniora','senior mode','режим для літніх','рэжым для пажылых','Seniorenmodus'],
 kChild:['konto dziecka','child account','дитячий акаунт','дзіцячы акаўнт','Kinderkonto'],
 kAdult:['konto rodzinne','family account','родинний акаунт','сямейны акаўнт','Familienkonto'],
 yrs:['l.','y','р.','г.','J.'],
 alertsT:['Alerty RSO w Twojej okolicy','RSO alerts near you','Сповіщення RSO поруч із Вами','Апавяшчэнні RSO побач з Вамі','RSO-Warnungen in Ihrer Nähe'],
 simAlarm:['Symuluj alarm','Simulate an alarm','Імітувати тривогу','Імітаваць трывогу','Alarm simulieren'],
 endAlarm:['Zakończ symulację alarmu','End the alarm simulation','Завершити імітацію тривоги','Завяршыць імітацыю трывогі','Alarmsimulation beenden'],
 alarmB:['ALARM POWIETRZNY – SYMULACJA','AIR RAID ALERT – SIMULATION','ПОВІТРЯНА ТРИВОГА – ІМІТАЦІЯ','ПАВЕТРАНАЯ ТРЫВОГА – ІМІТАЦЫЯ','LUFTALARM – SIMULATION'],
 alarmSub:['Najpierw kroki poniżej. Po odwołaniu alarmu naciśnij zielony przycisk.','First the steps below. When the alarm ends, press the green button.','Спершу кроки нижче. Після відбою натисніть зелену кнопку.','Спачатку крокі ніжэй. Пасля адбою націсніце зялёную кнопку.','Zuerst die Schritte unten. Nach Entwarnung den grünen Knopf drücken.'],
 whatT:['Co robić przy alarmie','What to do during an alarm','Що робити під час тривоги','Што рабіць падчас трывогі','Was tun bei Alarm'],
 verS:['Wersja dla seniora','Senior version','Версія для літніх','Версія для пажылых','Seniorenversion'],
 verF:['Pełna wersja','Full version','Повна версія','Поўная версія','Vollversion'],
 read:['🔊 Przeczytaj','🔊 Read aloud','🔊 Прочитати','🔊 Прачытаць','🔊 Vorlesen'],
 shT:['Najbliższe schrony i punkty','Nearest shelters and points','Найближчі укриття і пункти','Бліжэйшыя сховішчы і пункты','Nächste Schutzräume und Punkte'],
 shWarn:['Adresy wymyślone – nie idź pod nie. Prawdziwe punkty pokazuje serwis PSP „Gdzie się ukryć”.','Made-up addresses – do not go there. Real points: the fire service site “Gdzie się ukryć”.','Вигадані адреси – не йдіть туди. Справжні пункти: сервіс ДСНС Польщі «Gdzie się ukryć».','Выдуманыя адрасы – не ідзіце туды. Сапраўдныя пункты: сэрвіс пажарнай службы «Gdzie się ukryć».','Erfundene Adressen – nicht hingehen. Echte Punkte: Feuerwehr-Dienst „Gdzie się ukryć“.'],
 shOpen:['Otwórz „Gdzie się ukryć” (PSP)','Open “Gdzie się ukryć” (fire service)','Відкрити «Gdzie się ukryć» (PSP)','Адкрыць «Gdzie się ukryć» (PSP)','„Gdzie się ukryć“ öffnen (PSP)'],
 moreT:['Więcej narzędzi bezpieczeństwa','More safety tools','Більше інструментів безпеки','Больш інструментаў бяспекі','Weitere Sicherheitswerkzeuge'],
 whyT:['Dlaczego jedno miejsce?','Why one place?','Чому одне місце?','Чаму адно месца?','Warum ein Ort?'],
 whyTxt:['Zamiast kilku osobnych aplikacji: alerty, instrukcje, schrony i status rodziny w mObywatelu, który i tak masz w telefonie. To koncepcja konkursowa. W pokazie nic nie jest wysyłane. W prawdziwej usłudze status trafiłby tylko do osób z konta rodzinnego, które same to zaakceptowały.','Instead of several separate apps: alerts, instructions, shelters and family status in mObywatel, which you already have. This is a competition concept. Nothing is sent in the demo. In a real service the status would only reach family-account members who agreed to it.','Замість кількох окремих програм: сповіщення, інструкції, укриття і статус родини в mObywatel, який і так є у телефоні. Це конкурсна концепція. У демо нічого не надсилається. У справжній послузі статус отримали б лише члени родинного акаунта, які на це погодилися.','Замест некалькіх асобных праграм: апавяшчэнні, інструкцыі, сховішчы і статус сям’і ў mObywatel, які і так ёсць у тэлефоне. Гэта конкурсная канцэпцыя. У дэма нічога не адпраўляецца. У сапраўднай паслузе статус атрымалі б толькі члены сямейнага акаўнта, якія на гэта пагадзіліся.','Statt mehrerer Apps: Warnungen, Anleitungen, Schutzräume und Familienstatus in mObywatel, das Sie ohnehin haben. Wettbewerbskonzept. In der Demo wird nichts gesendet. Echt ginge der Status nur an zustimmende Mitglieder des Familienkontos.'],
 callDemo:['DEMO: w prawdziwej aplikacji zadzwonisz do: {n}. Tutaj nic się nie łączy.','DEMO: the real app would call {n}. Nothing is dialled here.','DEMO: у справжній програмі Ви подзвоните: {n}. Тут нічого не з’єднується.','DEMO: у сапраўднай праграме Вы патэлефануеце: {n}. Тут нічога не злучаецца.','DEMO: Die echte App würde {n} anrufen. Hier wird nichts gewählt.'],
 remDemo:['DEMO: przypomnienie do: {n} (powiadomienie, dla seniora także SMS).','DEMO: reminder to {n} (notification, SMS for seniors).','DEMO: нагадування для: {n} (сповіщення, для літніх ще й SMS).','DEMO: напамін для: {n} (апавяшчэнне, для пажылых яшчэ і SMS).','DEMO: Erinnerung an {n} (Mitteilung, für Senioren auch SMS).'],
 replied:['{n} odpowiada: bezpieczna/y (DEMO)','{n} replies: safe (DEMO)','{n} відповідає: в безпеці (DEMO)','{n} адказвае: у бяспецы (DEMO)','{n} antwortet: in Sicherheit (DEMO)'],
 sentT:['Wysłano status do rodziny (DEMO). Zapisano tylko w tym telefonie.','Status sent to family (DEMO). Saved only on this phone.','Статус надіслано родині (DEMO). Збережено лише на цьому телефоні.','Статус адпраўлены сям’і (DEMO). Захавана толькі на гэтым тэлефоне.','Status an Familie gesendet (DEMO). Nur auf diesem Handy gespeichert.'],
 askedT:['Zapytano rodzinę (DEMO).','Family asked (DEMO).','Родину запитано (DEMO).','Сям’ю спыталі (DEMO).','Familie gefragt (DEMO).'],
 undo:['Cofnij mój status','Undo my status','Скасувати мій статус','Адмяніць мой статус','Meinen Status zurücknehmen'],
 hubCard:['Alerty, co robić, schrony i „Jestem bezpieczny” dla rodziny','Alerts, what to do, shelters and “I’m safe” for family','Сповіщення, що робити, укриття і «Я в безпеці» для родини','Апавяшчэнні, што рабіць, сховішчы і «Я ў бяспецы» для сям’і','Warnungen, Verhalten, Schutzräume und „Ich bin sicher“ für die Familie'],
 offCard:['Każdy dokument pokażesz bez internetu · Plan B','Show any document without internet · Plan B','Будь-який документ без інтернету · План Б','Любы дакумент без інтэрнэту · План Б','Jedes Dokument ohne Internet · Plan B'],
 tip:['Dokument bez zasięgu: włącz „Symuluj brak sieci” i pokaż legitymację do kontroli – hologram, zegar na żywo i podpisany kod QR. W Bezpieczeństwie jednym przyciskiem dasz znać rodzinie, że jesteś bezpieczny.','No signal: turn on “Simulate no network” and show your ID for a check – hologram, live clock and a signed QR code. In Safety, one button tells your family you are safe.','Без зв’язку: увімкніть «Імітувати відсутність мережі» і покажіть документ – голограма, живий годинник і підписаний QR-код. У розділі Безпека одна кнопка повідомить родину, що Ви в безпеці.','Без сувязі: уключыце «Імітаваць адсутнасць сеткі» і пакажыце дакумент – галаграма, жывы гадзіннік і падпісаны QR-код. У раздзеле Бяспека адна кнопка паведаміць сям’і, што Вы ў бяспецы.','Ohne Netz: „Kein Netz simulieren“ einschalten und das Dokument zeigen – Hologramm, Live-Uhr, signierter QR-Code. Unter Sicherheit meldet ein Knopf der Familie, dass Sie sicher sind.'],
 tipA:['Bez zasięgu','No signal','Без зв’язку','Без сувязі','Ohne Netz'],tipB:['Jestem bezpieczny','I’m safe','Я в безпеці','Я ў бяспецы','Ich bin sicher'],
 seeAll:['Pełny tryb alarmowy','Full alarm mode','Повний режим тривоги','Поўны рэжым трывогі','Vollständiger Alarmmodus'],
 stepsN:[
  ['Zostań w budynku, z dala od okien.','Stay indoors, away from windows.','Залишайтеся в будівлі, подалі від вікон.','Заставайцеся ў будынку, далей ад вокнаў.','Im Gebäude bleiben, weg von Fenstern.'],
  ['Zejdź niżej: piwnica, garaż podziemny albo korytarz bez okien.','Go lower: basement, underground garage or a windowless corridor.','Спустіться нижче: підвал, підземний паркінг або коридор без вікон.','Спусціцеся ніжэй: падвал, падземны гараж або калідор без вокнаў.','Nach unten: Keller, Tiefgarage oder fensterloser Flur.'],
  ['Weź telefon, wodę i leki. Dokumenty masz w tej aplikacji – działają bez internetu.','Take your phone, water and medicines. Your documents are in this app and work offline.','Візьміть телефон, воду і ліки. Документи є в цій програмі – працюють без інтернету.','Вазьміце тэлефон, ваду і лекі. Дакументы ёсць у гэтай праграме – працуюць без інтэрнэту.','Handy, Wasser und Medikamente mitnehmen. Dokumente sind in dieser App – auch offline.'],
  ['Ktoś jest ranny? Dzwoń 112.','Someone injured? Call 112.','Хтось поранений? Телефонуйте 112.','Нехта паранены? Тэлефануйце 112.','Jemand verletzt? 112 anrufen.'],
  ['Nie nagrywaj i nie publikuj miejsc uderzeń. Słuchaj komunikatów służb.','Don’t film or post impact sites. Follow official announcements.','Не знімайте і не публікуйте місця влучань. Слухайте повідомлення служб.','Не здымайце і не публікуйце месцы трапленняў. Слухайце паведамленні службаў.','Einschlagstellen nicht filmen oder posten. Behördenhinweise beachten.'],
  ['Po odwołaniu alarmu naciśnij „Jestem bezpieczny” – rodzina dostanie znak.','When the alarm ends, press “I’m safe” – your family gets a sign.','Після відбою натисніть «Я в безпеці» – родина отримає сигнал.','Пасля адбою націсніце «Я ў бяспецы» – сям’я атрымае знак.','Nach der Entwarnung „Ich bin in Sicherheit“ drücken – die Familie bekommt ein Zeichen.']],
 stepsS:[
  ['Zostań w domu. Odejdź od okien.','Stay at home. Move away from windows.','Залишайтеся вдома. Відійдіть від вікон.','Заставайцеся дома. Адыдзіце ад вокнаў.','Zu Hause bleiben. Weg von den Fenstern.'],
  ['Idź do łazienki, korytarza albo piwnicy.','Go to the bathroom, hallway or basement.','Ідіть у ванну, коридор або підвал.','Ідзіце ў ванную, калідор або падвал.','In Bad, Flur oder Keller gehen.'],
  ['Weź telefon i leki.','Take your phone and medicines.','Візьміть телефон і ліки.','Вазьміце тэлефон і лекі.','Handy und Medikamente mitnehmen.'],
  ['Po alarmie naciśnij duży zielony przycisk.','After the alarm, press the big green button.','Після тривоги натисніть велику зелену кнопку.','Пасля трывогі націсніце вялікую зялёную кнопку.','Nach dem Alarm den großen grünen Knopf drücken.']],
 roles:{babcia:['Babcia','Grandma','Бабуся','Бабуля','Oma'],mama:['Mama','Mum','Мама','Мама','Mama'],syn:['syn','son','син','сын','Sohn'],zona:['żona','wife','дружина','жонка','Ehefrau']}
};
function t(k,v){const a=TX[k];if(!a)return k;let s=a[LI[L()]]||a[1]||a[0];if(v)for(const x in v)s=s.split('{'+x+'}').join(v[x]);return s}
function tA(a){return a[LI[L()]]||a[1]||a[0]}
function lang(){const l=L();return `lang="${l}" data-v32skip="1"`}

// ---------- sieć: prawdziwa + symulacja DEMO ----------
function simOff(){return !!st().net}
function realOff(){return typeof navigator!=='undefined'&&navigator.onLine===false}
function online(){return !simOff()&&!realOff()}
window.v33Net=function(off){const s=st();s.net=!!off;put(s);try{toast(off?t('netOff'):t('netOn')+' (DEMO)')}catch(_){}rerender()};

// ---------- dokumenty ----------
const DOCMETA={
 dowod:{t:'mDowód',c:'id',ico:'🇵🇱',valid:'15.01.2027'},
 pj:{t:'mPrawo jazdy',c:'pj',ico:'🚗',valid:'—'},
 leg:{t:{pl:'Legitymacja studencka',en:'Student ID',uk:'Студентський квиток',be:'Студэнцкі білет',de:'Studierendenausweis'},c:'leg',ico:'🎓',valid:'31.03.2027'},
 kdr:{t:'Karta Dużej Rodziny',c:'kdr',ico:'👨‍👩‍👧‍👦',valid:'31.12.2027'},
 ekuz:{t:'Karta EKUZ / NFZ',c:'ekuz',ico:'🩺',valid:'31.12.2027'},
 auto:{t:{pl:'Pojazd (dowód rejestracyjny)',en:'Vehicle (registration)',uk:'Транспорт (техпаспорт)',be:'Транспарт (тэхпашпарт)',de:'Fahrzeug (Zulassung)'},c:'veh',ico:'🚙',valid:'—'}
};
function dname(k){const m=DOCMETA[k]||DOCMETA.dowod;return typeof m.t==='string'?m.t:(m.t[L()]||m.t.pl)}
function hash32(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h}
function docNo(k,p){p=p||per();
 if(k==='dowod'&&p==='anna')return 'ABC 123456';
 const h=hash32(p+'|'+k);const L3='ABCDEFGHJKLMNPRSTUWXYZ';
 if(k==='dowod')return L3[h%22]+L3[(h>>5)%22]+L3[(h>>10)%22]+' '+String(100000+(h%899999)).slice(0,6);
 if(k==='pj')return String(10000+(h%89999))+'/'+String(8+(h%17)).padStart(2,'0')+'/'+String(1000+(h>>8)%8999);
 if(k==='leg')return (p==='kuba'?'UG ':'UW ')+String(100000+(h%899999));
 if(k==='kdr')return 'KDR '+String(1000000+(h%8999999));
 if(k==='auto'){const v=(PP(p).veh||[])[0];return v?v[0]:'—'}
 return 'NFZ '+String(10000000+(h%89999999));
}
function docsFor(p){p=p||per();const out=['dowod','pj'];
 if(p==='anna'||p==='kuba')out.push('leg');if(p==='anna')out.push('kdr','ekuz');if((PP(p).veh||[]).length)out.push('auto');return out}
function lastSync(k){const s=st();const key=per()+':'+k;if(!s.sync[key]){s.sync[key]=Date.now()-(4+hash32(key)%38)*60000;put(s)}return s.sync[key]}
function ago(ts){const m=Math.max(0,Math.round((Date.now()-ts)/60000));if(m<1)return null;if(m<60)return m+' '+t('min');const h=Math.floor(m/60);return h+' '+t('hr')}
function badge(k){const a=ago(lastSync(k));return `<span class="v33badge" ${lang()}><i aria-hidden="true">📴</i>${e(a?t('badge',{m:a}):t('justNow'))} · DEMO</span>`}
window.v33Refresh=function(){if(!online()){try{toast(t('refreshNo'))}catch(_){}return}const s=st();docsFor().forEach(k=>s.sync[per()+':'+k]=Date.now());['dowod','pj','leg','auto','ekuz','kdr'].forEach(k=>s.sync[per()+':'+k]=Date.now());put(s);try{toast(t('refreshed'))}catch(_){}rerender()};

function netBox(){
 const off=!online();
 return `<div class="card v33netcard" ${lang()}>
  <div class="v33netrow"><span class="v33dot ${off?'off':'on'}" aria-hidden="true"></span><b>${off?t('netNo'):t('netOn')}</b>${DEMO}</div>
  <label class="v33sw"><input type="checkbox" ${simOff()?'checked':''} onchange="v33Net(this.checked)"><span class="v33knob" aria-hidden="true"></span><span>${t('sim')} <span class="demo">DEMO</span></span></label>
  ${realOff()?`<p class="muted">${t('netReal')}</p>`:''}
  <button type="button" class="btn ghost v33big" onclick="v33Refresh()" ${off?'aria-disabled="true"':''}>🔄 ${t('refresh')}</button>
 </div>`}
function planB(k){k=k||'dowod';
 return `<div class="card v33planb" ${lang()}><h3>🅱️ ${t('planB')}</h3><ol class="v33steps">
  <li><span>1</span><p>${t('pb1')} <a href="#/kontrola/${k}">${t('ctl')} ›</a></p></li>
  <li><span>2</span><p>${t('pb2')}</p></li>
  <li><span>3</span><p>${t('pb3')}<b class="v33no">${e(docNo(k))}</b></p></li></ol></div>`}
function offPage(){
 const p=PP();const ds=docsFor();
 shell(t('offTitle'),`<div ${lang()}>
 <div class="alert b">📴<div><b>${t('offLead')}</b> ${DEMO}</div></div>
 ${netBox()}
 ${ds.map(k=>{const m=DOCMETA[k];return `<div class="v33doc v33-${m.c}">
   <div class="v33dh"><span class="v33ico" aria-hidden="true">${m.ico}</span><span><b>${e(dname(k))}</b><small>${e(p.full||'')} · ${e(docNo(k))}</small></span></div>
   ${badge(k)}
   <a class="btn v33ctlbtn v33big" href="#/kontrola/${k}">🛂 ${t('ctl')}</a></div>`}).join('')}
 ${planB(ds.includes('leg')?'leg':'dowod')}
 <details class="card v33det" data-v32o="1"><summary>ℹ️ ${t('how')} · DEMO</summary><p class="muted">${t('howTxt')}</p></details>
 </div>`,{tab:'wallet'});
 bar();
}

// ---------- podpis DEMO (WebCrypto ECDSA P-256, klucz tylko w tym telefonie) ----------
let KEYP=null;
async function keys(){
 if(KEYP)return KEYP;if(!(window.crypto&&crypto.subtle))return null;
 try{const j=ld('v33-demo-key',null);
  if(j&&j.priv&&j.pub){KEYP={priv:await crypto.subtle.importKey('jwk',j.priv,{name:'ECDSA',namedCurve:'P-256'},false,['sign']),pub:await crypto.subtle.importKey('jwk',j.pub,{name:'ECDSA',namedCurve:'P-256'},false,['verify'])};return KEYP}
  const kp=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
  sv('v33-demo-key',{priv:await crypto.subtle.exportKey('jwk',kp.privateKey),pub:await crypto.subtle.exportKey('jwk',kp.publicKey)});
  KEYP={priv:kp.privateKey,pub:kp.publicKey};return KEYP}catch(_){return null}}
function b64u(buf){let s='';new Uint8Array(buf).forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function ub64(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const b=atob(s);const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
async function signTxt(txt){const k=await keys();if(!k)return 'DEMO-'+hash32(txt).toString(36);const sig=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},k.priv,new TextEncoder().encode(txt));return b64u(sig)}
async function verifyTxt(txt,sig){const k=await keys();if(!k)return sig==='DEMO-'+hash32(txt).toString(36);try{return await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},k.pub,ub64(sig),new TextEncoder().encode(txt))}catch(_){return false}}
function qrSvg(txt,cell){try{const q=qrcode(0,'M');q.addData(txt);q.make();return q.createSvgTag({cellSize:cell||3,margin:2})}catch(_){return '<div class="v33noqr">QR</div>'}}

// ---------- pełnoekranowa kontrola dokumentu ----------
let CUR=null;const PERIOD=30;let PREV='';
function slot(){return Math.floor(Date.now()/1000/PERIOD)}
async function makeCode(k){const p=per();const s=slot();const ts=s*PERIOD;const pl=['MOBDEMO1',k,docNo(k).replace(/\s/g,''),(PP(p).full||'').split(' ').map(x=>x[0]).join(''),ts].join('|');const sig=await signTxt(pl);return {pl,sig,txt:pl+'|'+sig,slot:s}}
function clockStr(){const d=new Date();const loc=LOC[L()]||'pl-PL';return {t:d.toLocaleTimeString(loc,{hour:'2-digit',minute:'2-digit',second:'2-digit'}),d:d.toLocaleDateString(loc,{day:'2-digit',month:'2-digit',year:'numeric'})}}
function ctlPage(){
 const k=DOCMETA[sub()]?sub():'dowod';const m=DOCMETA[k];const p=PP();const c=clockStr();
 shell(t('ctlT'),`<div class="muted" ${lang()}>${t('ctlT')} · DEMO</div>`,{nav:false});
 const ov=document.createElement('div');ov.className='v33ctl';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label',t('ctlT')+' · '+dname(k));ov.setAttribute('data-v32skip','1');ov.setAttribute('lang',L());
 ov.innerHTML=`<div class="v33ctop"><span class="v33off">📴 ${t('works')}</span><span class="demo">DEMO</span><button type="button" class="v33x" onclick="v33Close()" aria-label="${e(t('close'))}">✕</button></div>
 <div class="v33card v33-${m.c}">
  <div class="v33holo" aria-hidden="true"></div><div class="v33seal" aria-hidden="true">RP</div>
  <div class="v33ch"><b>${e(dname(k))}</b><span class="v33flag" aria-hidden="true"></span></div>
  <div class="v33cb"><span class="v33ph" aria-hidden="true">${e(((p.name||'?')[0]||'?').toUpperCase())}</span>
   <span class="v33cd"><b>${e((p.full||'').toUpperCase())}</b><small>${t('docNo')}</small><b class="v33mono">${e(docNo(k))}</b>${m.valid!=='—'?`<small>${t('validTo')}: ${m.valid}</small>`:''}</span></div>
  <div class="v33ticker" aria-hidden="true"><span>RZECZPOSPOLITA POLSKA · DEMO · RZECZPOSPOLITA POLSKA · DEMO · RZECZPOSPOLITA POLSKA · DEMO · </span></div>
 </div>
 <div class="v33clock" aria-live="off"><b id="v33t">${c.t}</b><small id="v33d">${c.d}</small><em>${t('live')}</em></div>
 <div class="v33qr"><div id="v33qrbox" class="v33qrbox">${qrSvg('MOBDEMO1|…',4)}</div>
  <div class="v33ring"><i id="v33bar"></i></div><small id="v33cnt">${t('newCode',{s:PERIOD})}</small>
  <small class="v33sig" id="v33sig">${t('sigLbl')}: …</small></div>
 <button type="button" class="btn v33ver v33big" onclick="v33Verify()">🔍 ${t('verify')} (DEMO)</button>
 <div id="v33res" role="status"></div>
 <div class="v33manual"><small>${t('pb3')}</small><b class="v33mono">${e(docNo(k))}</b></div>
 <button type="button" class="btn ghost v33big" onclick="v33Close()">${t('close')}</button>`;
 app.appendChild(ov);
 CUR={k,code:null};
 const tick=async()=>{if(!document.body.contains(ov))return;const c=clockStr();const a=ov.querySelector('#v33t'),d=ov.querySelector('#v33d');if(a)a.textContent=c.t;if(d)d.textContent=c.d;
  const left=PERIOD-Math.floor(Date.now()/1000)%PERIOD;const n=ov.querySelector('#v33cnt');if(n)n.textContent=t('newCode',{s:left});const b=ov.querySelector('#v33bar');if(b)b.style.width=(left/PERIOD*100)+'%';
  if(!CUR.code||CUR.code.slot!==slot()){const code=await makeCode(k);if(!document.body.contains(ov))return;CUR.code=code;const q=ov.querySelector('#v33qrbox');if(q)q.innerHTML=qrSvg(code.txt,senior()?4:3);const sg=ov.querySelector('#v33sig');if(sg)sg.textContent=t('sigLbl')+': '+(code.sig.startsWith('DEMO-')?t('noSign'):'ECDSA P-256 · '+code.sig.slice(0,16)+'…');const r=ov.querySelector('#v33res');if(r)r.innerHTML=''}};
 tick();window.v33T=setInterval(tick,1000);
 try{if(navigator.wakeLock&&navigator.wakeLock.request)navigator.wakeLock.request('screen').then(w=>{window.v33WL=w}).catch(()=>{})}catch(_){}
}
window.v33Close=function(){const b=PREV&&!/^#\/kontrola/.test(PREV)?PREV:'#/offline';location.hash=b};
window.v33Verify=async function(){const r=document.getElementById('v33res');if(!r||!CUR||!CUR.code)return;const c=CUR.code;const parts=c.txt.split('|');const sig=parts.pop();const pl=parts.join('|');
 const ok=await verifyTxt(pl,sig);const age=Math.floor(Date.now()/1000)-(+parts[4]);const fresh=age>=0&&age<=PERIOD+5;
 r.innerHTML=ok&&fresh?`<div class="v33ok" lang="${L()}">✅ ${e(t('verOk',{s:age}))} · DEMO</div>`:`<div class="v33bad" lang="${L()}">⛔ ${e(t('verBad'))} · DEMO</div>`};

// ---------- „Bezpieczeństwo w jednym miejscu” ----------
const EXTRA={
 anna:[{id:'babcia',role:'babcia',n:'Krystyna',age:82,kind:'kSenior',fem:1,auto:0},{id:'jakub',role:'syn',n:'Jakub',age:16,kind:'kChild',fem:0,auto:2600}],
 piotr:[{id:'mama',role:'mama',n:'Teresa',age:79,kind:'kSenior',fem:1,auto:0},{id:'ewa',role:'zona',n:'Ewa',age:41,kind:'kAdult',fem:1,auto:2200}],
 halina:[{id:'mama',role:'mama',n:'Stanisława',age:84,kind:'kSenior',fem:1,auto:0},{id:'marek',role:'syn',n:'Marek',age:30,kind:'kAdult',fem:0,auto:2400}],
 kuba:[{id:'babcia',role:'babcia',n:'Zofia',age:80,kind:'kSenior',fem:1,auto:0},{id:'mama',role:'mama',n:'Iwona',age:48,kind:'kAdult',fem:1,auto:2000}]
};
function mName(x){const r=tA(TX.roles[x.role]||['']);return x.role==='babcia'||x.role==='mama'?r+' '+x.n:x.n+' ('+r+')'}
function v20checks(){const j=ld(V20K,null);return (j&&j.checkins)||{}}
function setV20(k,val){const all=v20checks();if(val)all[k]=val;else delete all[k];const j=ld(V20K,{})||{};j.checkins=all;sv(V20K,j)}
function relSt(id){const s=st();return ((s.rel[per()]||{})[id])||null}
function setRel(id,v,pp){const s=st();pp=pp||per();s.rel[pp]=s.rel[pp]||{};s.rel[pp][id]=v;put(s)}
function hm(iso){try{return new Date(iso).toLocaleTimeString(LOC[L()]||'pl-PL',{hour:'2-digit',minute:'2-digit'})}catch(_){return ''}}
let ALARM=false;
const SHL={
 Warszawa:[['Ukrycie „Dąb” (wymyślone)','ul. Demonstracyjna 1','350 m'],['Garaż podziemny „Przykład” (wymyślony)','ul. Testowa 14','600 m'],['Stacja metra „Wzór” (wymyślona)','pl. Pokazowy 2','900 m']],
 Kraków:[['Miejsce doraźne „Przykład” (wymyślone)','ul. Fikcyjna 7','500 m'],['Piwnica szkoły „Wzór” (wymyślona)','ul. Pokazowa 3','750 m'],['Parking podziemny „Demo” (wymyślony)','ul. Próbna 21','1,1 km']],
 Lublin:[['Ukrycie „Lipa” (wymyślone)','ul. Wzorcowa 3','420 m'],['Piwnica urzędu „Demo” (wymyślona)','ul. Przykładowa 9','800 m'],['Garaż „Test” (wymyślony)','ul. Ćwiczebna 5','1,2 km']],
 Gdańsk:[['Schron „Fala” (wymyślony)','ul. Modelowa 9','280 m'],['Tunel „Przykład” (wymyślony)','ul. Pokazowa 12','650 m'],['Piwnica „Demo” (wymyślona)','ul. Próbna 4','1 km']]
};
function alerts(city){return [
 {c:'y',i:'🌬️',h:{pl:'Ostrzeżenie meteo 2. stopnia: silny wiatr',en:'Weather warning level 2: strong wind',uk:'Метеопопередження 2-го ступеня: сильний вітер',be:'Метэапапярэджанне 2-й ступені: моцны вецер',de:'Wetterwarnung Stufe 2: starker Wind'},w:'RCB · '+city},
 {c:'b',i:'📢',h:{pl:'Test syren alarmowych: środa, 12:00',en:'Siren test: Wednesday, 12:00',uk:'Перевірка сирен: середа, 12:00',be:'Праверка сірэн: серада, 12:00',de:'Sirenentest: Mittwoch, 12:00'},w:'RSO · '+city},
 {c:'g',i:'🚰',h:{pl:'Awaria wodociągu usunięta, woda zdatna do picia',en:'Water main repaired, tap water safe to drink',uk:'Аварію водогону усунуто, вода придатна для пиття',be:'Аварыю вадаправода ліквідавана, вада прыдатная для піцця',de:'Wasserrohrbruch behoben, Leitungswasser trinkbar'},w:'RSO · '+city}]}
function famRows(){
 const me=per();const ch=v20checks();const out=[];
 const pr=k=>{const p=PERS[k];const c=ch[k];out.push({id:'p:'+k,name:p.name,meta:k===me?t('you'):t('onPhone'),fem:!!FEM[k],st:c?{st:'safe',at:c.at}:(k===me?null:relSt('p:'+k)),me:k===me})};
 if(PERS[me])pr(me);
 (EXTRA[me]||[]).forEach(x=>{out.push({id:x.id,name:mName(x),meta:x.age+' '+t('yrs')+' · '+t(x.kind),fem:!!x.fem,st:relSt(x.id),x})});
 Object.keys(PERS).filter(k=>k!==me).forEach(pr);
 return out}
function famHTML(){
 return famRows().map(r=>{const s=r.st;const safe=s&&s.st==='safe';const rem=s&&s.st==='reminded';
  const lbl=safe?'✓ '+(r.fem?t('safeStF'):t('safeStM'))+(s.at?' · '+hm(s.at):''):rem?'⏳ '+t('reminded'):'— '+t('none');
  return `<div class="v33fam ${safe?'ok':rem?'wait':'none'} ${r.me?'me':''}"><b class="v33av" aria-hidden="true">${e((r.name||'?').replace(/^(Babcia|Mama|Grandma|Mum|Бабуся|Бабуля|Мама|Oma) /,'')[0])}</b>
   <span class="v33fn"><b>${e(r.name)}</b><small>${e(r.meta)}</small><span class="v33fs">${e(lbl)}</span></span>
   ${!safe&&!r.me?`<span class="v33fa"><button type="button" class="v33mini" onclick="v33Remind('${r.id}')">🔔 ${t('remind')}</button><button type="button" class="v33mini" onclick="v33Call('${r.id}')">📞 ${t('call')}</button></span>`:''}</div>`}).join('')}
function rowName(id){const r=famRows().find(x=>x.id===id);return r?r.name:''}
window.v33Remind=function(id){const n=rowName(id);try{toast(t('remDemo',{n}))}catch(_){}
 const pp=per();setRel(id,{st:'reminded',at:new Date().toISOString()},pp);rerender();
 if(id.startsWith('p:'))return;
 setTimeout(()=>{setRel(id,{st:'safe',at:new Date().toISOString()},pp);if(top()==='bezpieczenstwo'&&per()===pp){rerender();try{toast(t('replied',{n}))}catch(_){}}},4200)};
window.v33Call=function(id){const n=rowName(id);try{toast(t('callDemo',{n}))}catch(_){}};
window.v33Safe=function(){const k=per();const now=new Date().toISOString();setV20(k,{at:now});const s=st();s.sent[k]=now;put(s);ALARM=false;
 try{toast(t('sentT'))}catch(_){}rerender();
 (EXTRA[k]||[]).forEach(x=>{if(x.auto&&!(relSt(x.id)&&relSt(x.id).st==='safe')){setTimeout(()=>{if(per()!==k)return;setRel(x.id,{st:'safe',at:new Date().toISOString()},k);if(top()==='bezpieczenstwo'){rerender();try{toast(t('replied',{n:mName(x)}))}catch(_){}}},x.auto)}})};
window.v33Undo=function(){const k=per();setV20(k,null);const s=st();delete s.sent[k];put(s);rerender()};
window.v33Ask=function(){try{toast(t('askedT'))}catch(_){}const k=per();(EXTRA[k]||[]).forEach(x=>{if(!(relSt(x.id)&&relSt(x.id).st==='safe')&&x.auto)setTimeout(()=>{if(per()!==k)return;setRel(x.id,{st:'safe',at:new Date().toISOString()},k);if(top()==='bezpieczenstwo')rerender()},x.auto)})};
window.v33Alarm=function(on){ALARM=!!on;rerender();if(on){try{const sc=app.querySelector('.scroll');if(sc)sc.scrollTop=0}catch(_){}}};
window.v33Senior=function(){const s=st();s.sv=!(s.sv==null?senior():s.sv);put(s);rerender()};
window.v33Read=function(){const s=st();const sv2=s.sv==null?senior():s.sv;const steps=(sv2?TX.stepsS:TX.stepsN).map((x,i)=>(i+1)+'. '+tA(x)).join(' ');
 if(!('speechSynthesis'in window)){try{toast('🔇')}catch(_){}return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance('DEMO. '+steps);u.lang=LOC[L()]||'pl-PL';speechSynthesis.speak(u)};
function hubPage(){
 const k=per();const p=PP();const city=p.city||'Warszawa';const s=st();const sent=s.sent[k];const mine=v20checks()[k];const sv2=s.sv==null?senior():s.sv;
 const steps=(sv2?TX.stepsS:TX.stepsN);
 const FAM=`<div class="card"><h3>👪 ${t('famT')}</h3><p class="muted">${t('famNote')}</p>${famHTML()}
  <button type="button" class="btn ghost v33big" onclick="v33Ask()">📣 ${t('askAll')} (DEMO)</button></div>`;
 const STEPS=`<div class="card"><div class="v33hrow"><h3>🧭 ${t('whatT')}</h3><button type="button" class="v33mini" onclick="v33Senior()">${sv2?t('verF'):'👴 '+t('verS')}</button></div>
  <ol class="v33steps ${sv2?'big':''}">${steps.map((x,i)=>`<li><span>${i+1}</span><p>${e(tA(x))}</p></li>`).join('')}</ol>
  <div class="v33two"><button type="button" class="btn sec" onclick="v33Read()">${t('read')}</button><a class="btn v33c112" href="tel:112">📞 112</a></div>
  <a class="v33link" href="#/alarm">🚨 ${t('seeAll')} ›</a></div>`;
 shell(t('hubT'),`<div ${lang()}>
 <p class="v33lead">${t('hubLead')} ${DEMO}</p>
 ${ALARM?`<div class="v33siren" role="alert"><b>🚨 ${t('alarmB')}</b><span>${t('alarmSub')}</span><button type="button" class="btn ghost" onclick="v33Alarm(false)">${t('endAlarm')}</button></div>`:''}
 <button type="button" class="v33safe" onclick="v33Safe()"><b>${FEM[k]?t('safeF'):t('safeM')}</b><small>${t('safeSub')} · DEMO</small></button>
 ${sent||mine?`<p class="v33sent">✓ ${e(t('sentAt',{t:hm(sent||mine.at)}))} <button type="button" class="v33link" onclick="v33Undo()">${t('undo')}</button></p>`:''}
 ${ALARM?STEPS+FAM:FAM+STEPS}
 <div class="card"><div class="v33hrow"><h3>📢 ${t('alertsT')}</h3>${DEMO}</div>
  ${alerts(city).map(a=>`<div class="alert ${a.c} v33al">${a.i}<div><b>${e(a.h[L()]||a.h.pl)}</b><br><span class="muted">${e(a.w)} · DEMO</span></div></div>`).join('')}
  ${ALARM?'':`<button type="button" class="btn v33big" onclick="v33Alarm(true)">🚨 ${t('simAlarm')} (DEMO)</button>`}</div>
 <div class="card"><div class="v33hrow"><h3>🛡️ ${t('shT')}</h3>${DEMO}</div><p class="muted">${t('shWarn')}</p>
  ${(SHL[city]||SHL.Warszawa).map(x=>`<div class="v33sh"><span>🛡️</span><span><b>${e(x[0])}</b><small>${e(x[1])}, ${e(city)}</small></span><b>${e(x[2])}</b></div>`).join('')}
  <a class="btn ghost" href="#/schronienie">🗺️ ${t('shOpen')}</a></div>
 <details class="card v33det" data-v32o="1"><summary>🧰 ${t('moreT')}</summary><div class="grid v33grid">${[['🚨','#/alarm','Tryb alarmowy'],['🆘','#/sos','Cichy SOS'],['💬','#/c112','112 tekstem'],['🛡️','#/schronienie','Gdzie się ukryć'],['🧭','#/plan','Plan rodzinny'],['🎒','#/kit','Plecak'],['🎓','#/wgotowosci','wGotowości'],['🚨','#/zglos-oszustwo','Zgłoś oszustwo'],['🪪','#/offline','Dokumenty offline'],['🛡️','#/security','Alarmy i mapa']].map(x=>`<a class="tile" href="${x[1]}"><b>${x[0]}</b>${e(x[2])}</a>`).join('')}</div></details>
 <details class="card v33det" data-v32o="1"><summary>❔ ${t('whyT')}</summary><p class="muted">${t('whyTxt')}</p></details>
 </div>`,{tab:'security'});
 bar();
}

// ---------- pasek „Co chcesz załatwić?” jak w v31 (dla nowych ekranów) ----------
function bar(){try{const nav=app.querySelector('nav.nav');if(!nav||app.querySelector('.v31ask')||typeof window.v31Ask!=='function')return;
 const f=document.createElement('form');f.className='v31ask';f.setAttribute('role','search');
 f.innerHTML=`<label class="v31sr" for="v31q">Co chcesz załatwić?</label><input id="v31q" autocomplete="off" placeholder="Co chcesz załatwić?" enterkeyhint="send"><button type="button" class="v31mic" aria-label="Powiedz głosem" onclick="v31Mic(this)">🎤</button><button type="submit" class="v31go" aria-label="Wyślij do asystenta">↑</button>`;
 f.onsubmit=ev=>{ev.preventDefault();v31Ask(f.querySelector('input').value)};nav.parentNode.insertBefore(f,nav)}catch(_){}}

// ---------- wstawki na istniejących ekranach ----------
function netBanner(sc){
 const old=sc.querySelector('.v33netban');const off=!online();
 if(!off||top()==='kontrola'){if(old)old.remove();return}
 const key=L()+(simOff()?'s':'r');if(old&&old.dataset.k===key)return;if(old)old.remove();
 const h=`<div class="v33netban" data-k="${key}" ${lang()}>📴 <span>${simOff()?t('netOff'):t('netReal')}</span>${simOff()?`<button type="button" onclick="v33Net(false)">${t('netBack')}</button>`:''}</div>`;
 const hero=sc.querySelector('#v31hero');if(top()==='home'&&hero)hero.insertAdjacentHTML('afterbegin',h);else if(top()!=='home')sc.insertAdjacentHTML('afterbegin',h)}
function inject(){
 const sc=app&&app.querySelector('.scroll');if(!sc)return;const p=top();
 try{netBanner(sc)}catch(_){}
 if(p==='wallet'){
  if(!sc.querySelector('#v33wal')){const firstDoc=sc.querySelector('.doc');const h=`<a id="v33wal" class="v33entry dark" href="#/offline" ${lang()}><b>${t('offTitle')}</b><small>${t('offCard')} · DEMO</small></a>`;if(firstDoc)firstDoc.insertAdjacentHTML('beforebegin',h);else sc.insertAdjacentHTML('afterbegin',h)}
  sc.querySelectorAll('.doc').forEach(d=>{if(d.querySelector('.v33dbar'))return;const m=(d.getAttribute('onclick')||'').match(/#\/doc\/([a-z]+)/);if(!m||!DOCMETA[m[1]])return;
   d.insertAdjacentHTML('beforeend',`<div class="v33dbar">${badge(m[1])}<a class="v33ctlmini" href="#/kontrola/${m[1]}" onclick="event.stopPropagation()" ${lang()}>🛂 ${t('ctl')}</a></div>`)});
 }
 if(p==='doc'){const k=sub();if(DOCMETA[k]&&!sc.querySelector('#v33docb')){const d=sc.querySelector('.doc');const h=`<div id="v33docb" ${lang()}>${badge(k)}<a class="btn v33ctlbtn v33big" href="#/kontrola/${k}">🛂 ${t('ctl')}</a></div>`;if(d)d.insertAdjacentHTML('afterend',h);else sc.insertAdjacentHTML('afterbegin',h)}}
 if(p==='home'){const hero=sc.querySelector('#v31hero');if(hero&&!hero.querySelector('#v33home')){const strip=hero.querySelector('.v31strip')||hero.querySelector('.v31stack');const h=`<div id="v33home" ${lang()}><a href="#/offline" class="v33pill"><b>📴</b><span>${t('ctl')}</span></a><a href="#/bezpieczenstwo" class="v33pill ok"><b>✅</b><span>${t('tipB')}</span></a></div>`;if(strip)strip.insertAdjacentHTML('afterend',h);else hero.insertAdjacentHTML('beforeend',h)}}
 if(p==='security'){let c=sc.querySelector('#v33sec');if(!c){sc.insertAdjacentHTML('afterbegin',`<a id="v33sec" class="v33entry dark" href="#/bezpieczenstwo" ${lang()}><b>${t('hubT')}</b><small>${t('hubCard')} · DEMO</small></a>`);c=sc.querySelector('#v33sec')}if(c&&sc.firstElementChild!==c&&!c.dataset.mv){c.dataset.mv='1';sc.insertBefore(c,sc.firstElementChild)}}
 if(p==='family'&&!sc.querySelector('#v33fam')){const a=sc.querySelector('#v20fam');const h=`<a id="v33fam" class="v33entry ok" href="#/bezpieczenstwo" ${lang()}><b>${FEM[per()]?t('safeF'):t('safeM')}</b><small>${t('famT')} · ${t('remind')} / ${t('call')} · DEMO</small></a>`;if(a)a.insertAdjacentHTML('afterend',h);else sc.insertAdjacentHTML('afterbegin',h)}
 if(p==='alarm'&&!sc.querySelector('#v33alm')){sc.insertAdjacentHTML('beforeend',`<a id="v33alm" class="v33entry dark" href="#/bezpieczenstwo" ${lang()}><b>${t('hubT')}</b><small>${t('hubCard')} · DEMO</small></a>`)}
}
function sideAndPanel(){
 const j=document.querySelector('.side ul.jump');if(j&&!document.getElementById('v33side'))j.insertAdjacentHTML('afterbegin',`<li class="sep" id="v33side">Nowe w v33</li><li><a href="#/offline">📴 Dokumenty bez zasięgu (DEMO)</a></li><li><a href="#/kontrola/dowod">🛂 Kontrola bez internetu (DEMO)</a></li><li><a href="#/bezpieczenstwo">🛡️ Bezpieczeństwo w jednym miejscu · Jestem bezpieczny</a></li>`);
 document.querySelectorAll('.v31panel .v31tips').forEach(ol=>{let li=ol.querySelector('.v33tip');const key=L();if(li&&li.dataset.k===key)return;if(li)li.remove();
  const n=ol.querySelectorAll('li').length+1;ol.insertAdjacentHTML('beforeend',`<li class="v33tip" data-k="${key}" ${lang()}><span>${n}</span><div>${e(t('tip'))} <a href="#/offline">${e(t('tipA'))} ›</a> <a href="#/bezpieczenstwo">${e(t('tipB'))} ›</a></div></li>`)});
}
function rerender(){try{route()}catch(_){}}
try{if(typeof ALL!=='undefined'&&ALL.push)ALL.push(
 ['📴','Dokumenty bez zasięgu – kontrola bez internetu','#/offline','offline bez internetu zasięg kontrola biletów legitymacja dowód prawo jazdy plan b kod qr hologram'],
 ['🛡️','Bezpieczeństwo w jednym miejscu – Jestem bezpieczny','#/bezpieczenstwo','bezpieczeństwo jestem bezpieczny bezpieczna rodzina alert rso alarm schron instrukcja senior babcia']
)}catch(_){}

// ---------- router ----------
const R={'offline':offPage,'bez-zasiegu':offPage,'kontrola':ctlPage,'bezpieczenstwo':hubPage,'jestem-bezpieczny':hubPage};
function stopT(){try{clearInterval(window.v33T)}catch(_){}window.v33T=null;try{if(window.v33WL){window.v33WL.release();window.v33WL=null}}catch(_){}}
const _r=route;
route=function(){const p=top();stopT();if(p!=='kontrola')PREV=location.hash||'#/home';if(R[p]){try{clearInterval(threatT)}catch(_){}try{clearInterval(camT)}catch(_){}try{clearInterval(window.v30T)}catch(_){}const o=R[p]();try{inject()}catch(_){}try{sideAndPanel()}catch(_){}return o}
 const out=_r.apply(this,arguments);try{inject()}catch(_){}try{sideAndPanel()}catch(_){}return out};
window.route=route;onhashchange=route;
let busy=false;new MutationObserver(()=>{if(busy)return;busy=true;try{inject()}catch(_){}finally{busy=false}}).observe(app,{childList:true,subtree:true});
addEventListener('online',rerender);addEventListener('offline',rerender);
addEventListener('resize',()=>setTimeout(()=>{try{sideAndPanel()}catch(_){}},200));

const css=document.createElement('style');css.textContent=`
.v33badge{display:inline-flex;align-items:center;gap:6px;background:#e7f6ee;color:#0c6b44;border:1px solid #b9e4cc;border-radius:20px;padding:4px 10px;font-size:.78em;font-weight:700;line-height:1.3}
.doc .v33badge{background:#ffffffe6;border-color:#fff}
.v33dbar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:10px}
.v33ctlmini{display:inline-flex;align-items:center;gap:4px;background:#14213d;color:#fff;border-radius:20px;padding:5px 11px;font-size:.78em;font-weight:800;text-decoration:none}
.v33entry{display:flex;flex-direction:column;gap:2px;border-radius:18px;padding:14px 16px;margin:0 0 12px;text-decoration:none;font-weight:800;color:#fff;background:linear-gradient(135deg,#14213d,#0b3d91);box-shadow:0 8px 22px #0b3d9133}
.v33entry.ok{background:linear-gradient(135deg,#14804a,#0c5c35);box-shadow:0 8px 22px #14804a33}
.v33entry b{font-size:1.18em;line-height:1.2}.v33entry small{font-weight:600;opacity:.95;line-height:1.35}
#v33home{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 10px}
.v33pill{display:flex;align-items:center;gap:8px;background:#fff;border-radius:14px;padding:10px 12px;text-decoration:none;color:var(--txt);font-weight:700;font-size:.86em;box-shadow:0 1px 4px #0001;border:1.5px solid #d6dbe6}
.v33pill.ok{border-color:#9fd9b8;background:#f0fbf5}.v33pill b{font-size:1.2em}
.v33netban{display:flex;flex-wrap:wrap;align-items:center;gap:8px;background:#14213d;color:#fff;border-radius:12px;padding:8px 12px;margin:0 0 10px;font-size:.85em;font-weight:600}
.v33netban span{flex:1;min-width:60%}.v33netban button{margin-left:auto;background:#fff;color:#14213d;border:0;border-radius:14px;padding:4px 10px;font:inherit;font-weight:800;cursor:pointer}
.v33netcard .v33netrow{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.v33dot{width:12px;height:12px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 4px #14804a22}.v33dot.off{background:var(--red);box-shadow:0 0 0 4px #dc143c22}
.v33sw{display:flex;align-items:center;gap:10px;cursor:pointer;font-weight:700;margin:6px 0}
.v33sw input{position:absolute;opacity:0;width:1px;height:1px}
.v33knob{width:46px;height:26px;border-radius:13px;background:#c9d0dc;position:relative;flex-shrink:0;transition:.2s}
.v33knob:after{content:'';position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px #0003;transition:.2s}
.v33sw input:checked+.v33knob{background:var(--red)}.v33sw input:checked+.v33knob:after{left:23px}
.v33sw input:focus-visible+.v33knob{outline:3px solid #14213d;outline-offset:2px}
.v33doc{border-radius:16px;padding:14px;margin-bottom:12px;color:#fff;background:linear-gradient(135deg,#1d5bd8,#0b3d91)}
.v33doc.v33-pj{background:linear-gradient(135deg,#e05a7a,#a3102d)}.v33doc.v33-leg{background:linear-gradient(135deg,#7c4dff,#4a23b5)}.v33doc.v33-kdr{background:linear-gradient(135deg,#8a5cd6,#d673b8)}.v33doc.v33-ekuz{background:linear-gradient(135deg,#1aa36b,#0c6b44)}.v33doc.v33-veh{background:linear-gradient(135deg,#f09b1a,#b85f00)}
.v33dh{display:flex;gap:10px;align-items:center;margin-bottom:8px}.v33dh span:last-child{display:flex;flex-direction:column}.v33dh small{opacity:.9;font-size:.8em}
.v33ico{width:38px;height:38px;border-radius:10px;background:#fff3;display:flex;align-items:center;justify-content:center;font-size:1.2em}
.v33doc .v33badge{background:#ffffffe6}
.btn.v33ctlbtn{background:#14213d}.v33doc .btn.v33ctlbtn{background:#fff;color:#14213d}
#v33docb{margin:-4px 0 12px}#v33docb .v33badge{margin-bottom:2px}
.v33steps{list-style:none;padding:0;margin:6px 0}.v33steps li{display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-bottom:1px solid #eef1f6}
.v33steps li>span{min-width:28px;height:28px;border-radius:9px;background:var(--blue);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center}
.v33steps p{margin:3px 0 0;line-height:1.4}.v33steps.big p{font-size:1.2em;font-weight:700}.v33steps.big li>span{min-width:40px;height:40px;font-size:1.2em}
.v33no,.v33mono{font-family:ui-monospace,Menlo,Consolas,monospace;letter-spacing:1.5px}
.v33planb .v33no{display:block;font-size:1.35em;margin-top:6px;background:#f3f5f9;border-radius:10px;padding:8px 10px;color:var(--txt)}
details.v33det>summary{cursor:pointer;font-weight:700}details.v33det p{margin:8px 0 0}
.v33ctl{position:absolute;inset:0;z-index:60;overflow:auto;background:radial-gradient(circle at 50% 0,#1d2c55,#0a1022 70%);color:#fff;padding:34px 14px 18px;display:flex;flex-direction:column;gap:10px}
.v33ctop{display:flex;align-items:center;gap:8px}.v33off{background:#14804a;border-radius:20px;padding:4px 10px;font-size:.8em;font-weight:800}
.v33x{margin-left:auto;width:40px;height:40px;border-radius:50%;border:0;background:#ffffff22;color:#fff;font-size:1.1em;cursor:pointer}
.v33card{position:relative;overflow:hidden;border-radius:18px;padding:14px;min-height:190px;background:linear-gradient(135deg,#dc143c,#8b0a26);box-shadow:0 12px 30px #0008}
.v33card.v33-pj{background:linear-gradient(135deg,#e05a7a,#a3102d)}.v33card.v33-leg{background:linear-gradient(135deg,#7c4dff,#3a1a99)}.v33card.v33-id{background:linear-gradient(135deg,#2f6fd6,#0b3d91)}.v33card.v33-kdr{background:linear-gradient(135deg,#8a5cd6,#b2479a)}.v33card.v33-ekuz{background:linear-gradient(135deg,#1aa36b,#0c6b44)}.v33card.v33-veh{background:linear-gradient(135deg,#f09b1a,#a35400)}
.v33holo{position:absolute;inset:-40%;background:conic-gradient(from 0deg,#ff00cc33,#00e5ff44,#ffee0033,#00ff9944,#ff00cc33);mix-blend-mode:screen;animation:v33spin 6s linear infinite;pointer-events:none}
.v33card:after{content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,#ffffff55,transparent);animation:v33shine 2.6s ease-in-out infinite;pointer-events:none}
.v33seal{position:absolute;right:14px;bottom:44px;width:58px;height:58px;border-radius:50%;border:2px dashed #ffffffaa;display:flex;align-items:center;justify-content:center;font-weight:900;letter-spacing:1px;animation:v33spin 9s linear infinite reverse;opacity:.85}
.v33ch{position:relative;display:flex;justify-content:space-between;align-items:center;font-size:1.15em}
.v33flag{width:30px;height:20px;border-radius:3px;background:linear-gradient(#fff 50%,#dc143c 50%);box-shadow:0 0 0 1px #fff8;animation:v33wave 1.6s ease-in-out infinite}
.v33cb{position:relative;display:flex;gap:12px;margin-top:14px}
.v33ph{width:72px;height:90px;border-radius:12px;background:linear-gradient(135deg,#fff3,#fff1);border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:2em;font-weight:900}
.v33cd{display:flex;flex-direction:column;gap:2px}.v33cd small{opacity:.85;font-size:.75em;margin-top:4px}
.v33ticker{position:absolute;left:0;right:0;bottom:0;background:#0006;white-space:nowrap;overflow:hidden;font-size:.7em;font-weight:800;letter-spacing:2px;padding:4px 0}
.v33ticker span{display:inline-block;padding-left:100%;animation:v33tick 12s linear infinite}
.v33clock{text-align:center;background:#ffffff12;border-radius:14px;padding:8px}.v33clock b{display:block;font-size:2em;font-variant-numeric:tabular-nums;letter-spacing:1px}
.v33clock small{display:block;opacity:.85}.v33clock em{display:block;font-size:.72em;opacity:.75;font-style:normal;margin-top:2px}
.v33qr{background:#fff;color:var(--txt);border-radius:16px;padding:10px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px}
.v33qrbox svg{display:block;max-width:100%;height:auto}
.v33ring{width:80%;height:6px;background:#e3e7ef;border-radius:3px;overflow:hidden}.v33ring i{display:block;height:100%;background:var(--ok);transition:width .9s linear}
.v33sig{color:var(--mut);font-size:.72em;word-break:break-all}
.v33ok{background:#dff5e8;color:#0c5c35;border-radius:12px;padding:10px;font-weight:800}.v33bad{background:#ffe3e6;color:#a3102d;border-radius:12px;padding:10px;font-weight:800}
.v33manual{background:#ffffff12;border-radius:14px;padding:10px;text-align:center}.v33manual small{display:block;opacity:.85}.v33manual b{font-size:1.5em}
.v33ctl .btn.ghost{background:transparent;color:#fff;border-color:#fff8}.btn.v33ver{background:#fff;color:#14213d}
@keyframes v33spin{to{transform:rotate(360deg)}}@keyframes v33shine{0%{left:-60%}60%,100%{left:130%}}@keyframes v33tick{to{transform:translateX(-100%)}}@keyframes v33wave{50%{transform:skewY(-6deg) scaleX(.94)}}
@media (prefers-reduced-motion:reduce){.v33holo,.v33seal{animation-duration:30s}.v33card:after{animation:none}.v33ticker span{animation-duration:40s}}
.v33lead{color:var(--mut);margin:0 2px 10px;line-height:1.4}
.v33safe{display:flex;flex-direction:column;align-items:center;gap:2px;width:100%;border:0;border-radius:20px;padding:18px 14px;margin:0 0 10px;background:linear-gradient(135deg,#1aa36b,#0c6b44);color:#fff;cursor:pointer;box-shadow:0 10px 24px #14804a44;font:inherit}
.v33safe b{font-size:1.45em}.v33safe small{font-weight:600;opacity:.95}
.v33safe:focus-visible,.v33mini:focus-visible,.v33pill:focus-visible,.v33entry:focus-visible{outline:3px solid #14213d;outline-offset:3px}
.v33sent{background:#dff5e8;border-radius:12px;padding:8px 10px;margin:0 0 12px;font-size:.88em;color:#0c5c35;font-weight:600}
.v33link{background:none;border:0;color:var(--blue);font:inherit;font-weight:700;cursor:pointer;text-decoration:underline;padding:0;display:inline-block;margin-top:8px}
.v33fam{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #eef1f6;flex-wrap:wrap}
.v33av{width:38px;height:38px;border-radius:50%;background:#c9d0dc;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;flex-shrink:0}
.v33fam.ok .v33av{background:var(--ok)}.v33fam.wait .v33av{background:var(--warn)}.v33fam.none .v33av{background:#9aa3b5}
.v33fn{display:flex;flex-direction:column;flex:1;min-width:120px}.v33fn small{color:var(--mut);font-size:.78em}
.v33fs{font-size:.85em;font-weight:700}.v33fam.ok .v33fs{color:var(--ok)}.v33fam.wait .v33fs{color:var(--warn)}.v33fam.none .v33fs{color:var(--red)}
.v33fa{display:flex;gap:6px}
.v33mini{border:1.5px solid var(--blue);background:#fff;color:var(--blue);border-radius:16px;padding:5px 10px;font:inherit;font-size:.8em;font-weight:700;cursor:pointer;white-space:nowrap}
.v33hrow{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}.v33hrow h3{margin:0}
.v33two{display:grid;grid-template-columns:2fr 1fr;gap:8px}.v33two .btn{margin-top:8px}.btn.v33c112{background:var(--red)}
.v33siren{background:linear-gradient(135deg,#dc143c,#8b0a26);color:#fff;border-radius:18px;padding:14px;margin:0 0 12px;display:flex;flex-direction:column;gap:6px;animation:v33pulse 1.4s ease-in-out infinite}
.v33siren b{font-size:1.2em}.v33siren .btn.ghost{background:#fff;color:var(--red);border:0}
@keyframes v33pulse{50%{box-shadow:0 0 0 8px #dc143c33}}
.v33al{margin:8px 0 0}
.v33sh{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #eef1f6}.v33sh span:nth-child(2){display:flex;flex-direction:column;flex:1}.v33sh small{color:var(--mut);font-size:.8em}
.v33grid{margin-top:10px}.v33grid .tile{text-decoration:none;color:inherit}
body.senior .v33big,body.senior .v33safe{min-height:64px;font-size:1.1em}
body.senior .v33safe{padding:26px 14px}body.senior .v33safe b{font-size:1.8em}
body.senior .v33mini{padding:10px 14px;font-size:.95em}body.senior .v33fa{width:100%}body.senior .v33fa .v33mini{flex:1}
body.senior .v33ctlmini{padding:9px 14px;font-size:.95em}body.senior .v33badge{font-size:.9em}
body.senior #v33home{grid-template-columns:1fr}body.senior .v33pill{padding:16px;font-size:1em}
body.senior .v33clock b{font-size:2.4em}body.senior .v33manual b{font-size:1.9em}
body.senior .v33steps p{font-size:1.1em}
body.contrast .v33entry,body.contrast .v33pill,body.contrast .v33doc,body.contrast .v33safe,body.contrast .v33netban{background:#000;color:#fff;border:2px solid #fff}
body.contrast .v33badge{background:#000;color:#ffeb3b;border-color:#ffeb3b}body.contrast .v33mini{background:#000;color:#ffeb3b;border-color:#ffeb3b}
`;document.head.appendChild(css);
try{sideAndPanel()}catch(_){}
[300,1200,2500].forEach(ms=>setTimeout(()=>{try{sideAndPanel()}catch(_){}},ms));
route();
})();
