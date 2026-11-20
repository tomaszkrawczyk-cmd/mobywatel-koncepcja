// ===== v29: Karta rowerowa dziecka i lekcje „Wnuk uczy babcię” =====
// Koncepcja własna (Tomasz Krawczyk). Inspiracja (rozwinięta, nie skopiowana):
// https://x.com/PremierRP/status/2121627755271835942
// https://x.com/K_Galecka/status/2121889229844222399
// https://x.com/CYFRA_GOV_PL/status/2123370704611733532
// https://x.com/bikewithkids/status/2122372991988449491
// Fakty tylko ze stron gov.pl, eli.gov.pl i info.mobywatel.gov.pl.
// Symulacje oznaczone DEMO. Nic nie jest wysyłane.
// Łańcuch Gemma → reguły → Bielik i pobieranie Bielika bez zmian.
(function(){
const DEMO='<span class="demo">DEMO</span>';
const MI='https://www.gov.pl/web/infrastruktura/beda-nowe-zasady-ruchu-rowerowego-dzieci-i-uzyskiwania-karty-rowerowej';
const ELI='https://eli.gov.pl/api/acts/DU/2024/1210/text.html';
const MC_CERT='https://www.gov.pl/web/cyfryzacja/wazna-aktualizacja-w-mobywatelu-zaloguj-sie-do-aplikacji-do-5-sierpnia';
const MC_APP='https://info.mobywatel.gov.pl/aktualnosci/zaktualizuj-aplikacje-aby-nadal-z-niej-korzystac';
const MC_HELP='https://www.gov.pl/web/cyfryzacja/ministerstwo-cyfryzacji-ostrzega-cyberprzestepcy-podszywaja-sie-pod-mobywatela';
const MC_SZK='https://www.gov.pl/web/cyfryzacja/ruszyla-rejestracja-szkol-do-kolejnej-edycji-konkursu-szkola-miedzypokoleniowa';
const MC_WYN='https://www.gov.pl/web/cyfryzacja/pokolenia-polaczone-wiedza-wyniki-konkursu-szkola-miedzypokoleniowa';
const MEN_SZK='https://www.gov.pl/web/edukacja/szkola-miedzypokoleniowa--czas-start';
const REG='https://www.gov.pl/attachment/571d3307-c629-4d8f-afe3-2cc50cebf834';
const PHONE='+48 42 253 54 74';
const DOB0={jan:'2018-04-14',zofia:'2023-06-02',kuba:'2010-09-08'};
const BK='v29-bike';
const LK='v29-razem';
const QUIZ=[
 {q:'Światło dla roweru jest czerwone. Co robisz?',a:['Zatrzymuję się i czekam','Jadę, bo nikogo nie ma','Dzwonię dzwonkiem i jadę'],ok:0,why:'Czerwone światło oznacza stop. Tej zasady dzieci uczą się przed egzaminem na kartę.'},
 {q:'Którą stroną jezdni jedzie rower w Polsce?',a:['Prawą','Lewą','Środkiem, jak wolę'],ok:0,why:'W Polsce jedzie się prawą stroną. To podstawowa zasada ruchu, nie pytanie z urzędowej bazy.'},
 {q:'Pieszy wchodzi na przejście. Co robisz?',a:['Zatrzymuję się i przepuszczam','Omijam tuż obok','Dzwonię i jadę pierwsza'],ok:0,why:'Pieszy na przejściu ma pierwszeństwo. Rowerzysta go przepuszcza.'},
 {q:'Jest ciemno. Co ma być włączone, zanim ruszysz?',a:['Światła roweru, z przodu i z tyłu','Tylko dzwonek','Nic, wystarczy jasna kurtka'],ok:0,why:'Po zmroku rower ma być widoczny. Światła są częścią przygotowania do jazdy. Numeru artykułu tu nie podaję — dokładny przepis potwierdza szkoła.'}
];
const LESSONS=[
 {id:'litery',t:'Duże litery na ekranie',lead:'Włączacie tryb seniora, który już jest w aplikacji. Nic nowego nie budujemy.',
  steps:[
   {ja:'Mówię: „powiększymy litery, żeby było widać bez okularów do czytania”.',ty:'Patrzysz na ekran. Nic nie musisz wpisywać.',btn:'Włącz duże litery',go:'senior'},
   {ja:'Pokazuję przełącznik „Tryb seniora” na starcie. Zostaje tam, gdzie był.',ty:'Sama stukasz przełącznik, gdy chcesz go wyłączyć albo włączyć.',href:'#/home',lab:'Otwórz start z przełącznikiem'},
   {ja:'Czytam na głos, jeśli poprosisz. Przycisk głośnika jest na górze, gdy litery są duże.',ty:'Stukasz 🔊 albo mówisz „przeczytaj”. Hasła nie podajesz.',href:'#/settings',lab:'Ustawienia: duży tekst i kontrast'}
  ]},
 {id:'aktualizacja',t:'Czy aplikacja jest aktualna',lead:'Sprawdzenie gotowości i duże kroki aktualizacji już są w prototypie. Ta lekcja tylko przez nie prowadzi.',
  steps:[
   {ja:'Otwieram „Czy aplikacja jest gotowa?”. Wersja w pokazie jest wymyślona i podpisana DEMO.',ty:'Patrzysz, czy przy Twoim koncie widać „trzeba aktualizacji”.',href:'#/gotowosc',lab:'Czy aplikacja jest gotowa?'},
   {ja:'Czytam duże kroki: sklep, nazwa mObywatel, Aktualizuj, otwórz, zaloguj.',ty:'Powtarzasz te pięć słów. Aktualizację robisz w Sklepie Play albo App Store.',href:'#/wskazowka',lab:'Duże kroki aktualizacji'},
   {ja:'Mówię wprost: aktualizacja w sklepie zostawia aplikację na telefonie. Nie usuwamy jej „na wszelki wypadek”.',ty:'Zapamiętujesz: najpierw sklep i logowanie. Usuwanie zostawiamy na inne sytuacje, opisane niżej.',href:MC_APP,lab:'Komunikat: zaktualizuj w sklepie',ext:1},
   {ja:'Gdy dokument zniknął, idziemy do stanu dokumentów, a nie do kosza aplikacji.',ty:'Mówisz, co widzisz na ekranie. Hasła, BLIK-a i PESEL-u nie dyktujesz.',href:'#/zdrowie-dokumentow',lab:'Dokumenty nie znikną'}
  ]},
 {id:'dokument',t:'Jak dodać dokument',lead:'Ścieżka jest ta sama co w „Moje dokumenty nie znikną”. Tu są tylko duże kroki na dwa głosy.',
  steps:[
   {ja:'Otwieram listę dokumentów w pokazie. Dane są fikcyjne.',ty:'Wskazujesz palcem kafelek, którego brakuje albo który prosi o odświeżenie.',href:'#/zdrowie-dokumentow',lab:'Stan dokumentów'},
   {ja:'Czytam przyczynę z tej listy: inny telefon, certyfikat, zastrzeżenie. Nie zgaduję.',ty:'Swoimi słowami mówisz, co się stało: nowy telefon, dawno nie było logowania, albo dokument został zastrzeżony.',href:'#/wallet',lab:'Ekran dokumentów'},
   {ja:'Przypominam wyjątki z komunikatu MC: legitymacja studencka bywa dodawana kodem QR z dziekanatu, szkolna w mObywatelu Junior — kodem z Zintegrowanej Platformy Edukacyjnej. mDowód po terminie certyfikatu wraca po potwierdzeniu tożsamości.',ty:'Logujesz się sama. Hasło zostaje u Ciebie.',href:MC_CERT,lab:'MC: zaloguj się, certyfikat się odświeży',ext:1}
  ]},
 {id:'pokaz',t:'Pokazać dokument w urzędzie albo aptece',lead:'Pokazanie dokumentu i recepty już jest w prototypie. Kod na tym ekranie jest demonstracyjny.',
  steps:[
   {ja:'Otwieram dokument albo e-receptę. Trzymam telefon tak, żeby było widać ekran, nie zdjęcie z galerii.',ty:'Patrzysz, czy to Twój dokument. W urzędzie i aptece pokazujesz ekran, nie wysyłasz zdjęcia SMS-em.',href:'#/wallet',lab:'Dokumenty'},
   {ja:'Do leku otwieram e-receptę. Kod w tym prototypie nie działa w aptece.',ty:'Farmaceucie pokazujesz ekran. Numeru PESEL nie dyktujesz osobie, która dzwoni.',href:'#/recepty',lab:'e-Recepty'},
   {ja:'Gdy ktoś chce sprawdzić, czy ekran jest prawdziwy, otwieram weryfikator. Widać tam, komu idą dane.',ty:'Zgadzasz się albo odmawiasz. Decyzja jest Twoja.',href:'#/podrobki',lab:'Prawdziwy czy podróbka?'}
  ]},
 {id:'sms',t:'Fałszywy SMS i fałszywa strona',lead:'Poradnik seniora, sprawdzanie linku i zgłoszenie oszustwa już są. Ta lekcja ustawia je w jednej kolejności.',
  steps:[
   {ja:'Czytam SMS na głos. Nie stukam linku.',ty:'Też nie stukasz. Prawdziwy urząd nie prosi w SMS-ie o hasło, kod BLIK ani zdjęcie dowodu.',href:'#/phishing',lab:'Czy to oszustwo?'},
   {ja:'Sprawdzam, czy adres to gov.pl albo info.mobywatel.gov.pl. Inny adres odkładam.',ty:'Aplikację pobierasz tylko ze Sklepu Play albo App Store. Pracownicy COI nie piszą pierwsi.',href:'#/jak-rozpoznac/senior',lab:'Jak rozpoznać podróbkę — senior'},
   {ja:'Gdy coś niepokoi, otwieram zgłoszenie. Formularz w prototypie jest DEMO i czyści dane osobowe przed podglądem.',ty:'Możesz zadzwonić na infolinię. Hasła przez telefon nie podajesz.',href:'#/zglos-oszustwo',lab:'Zgłoś oszustwo'}
  ]},
 {id:'qr',t:'Czy kod QR jest prawdziwy',lead:'Weryfikator z jednorazowym kodem zostaje w „Prawdziwy czy podróbka?”. Tu tylko wspólne spojrzenie.',
  steps:[
   {ja:'Otwieram weryfikator. Tłumaczę: prawdziwy dokument pokazuje, komu i co udostępniasz.',ty:'Patrzysz na duży przycisk. Nie wysyłasz zdjęcia swojego ekranu obcej osobie.',href:'#/podrobki',lab:'Otwórz weryfikator'},
   {ja:'Pokazuję różnicę: cały dowód albo sama potrzebna informacja. To ten sam pokaz co w module podróbek.',ty:'Mówisz „tyle wystarczy” albo „nie pokazuję”.',href:'#/pokaz-dokument',lab:'Mój dokument — żywy znak'},
   {ja:'Gdy kod wygląda podejrzanie, zostawiam zgłoszenie w tamtym module. Jest oznaczone DEMO.',ty:'Nie instalujesz niczego z linku w wiadomości.',href:'#/zglos-podrobke',lab:'Zgłoś podejrzaną aplikację'}
  ]},
 {id:'pomoc',t:'Jak poprosić o pomoc',lead:'Przełącznik rodziny, upoważnienia i infolinia już są. Lekcja uczy z nich skorzystać.',
  steps:[
   {ja:'Siadam obok. Telefonu nie biorę, dopóki nie powiesz „pomóż”.',ty:'Mówisz „pomóż mi” albo podajesz telefon. Możesz też zostać przy swoim haśle i tylko słuchać.',href:'#/family',lab:'Rodzina'},
   {ja:'Pokazuję przełącznik osób na starcie. Każda osoba ma własne dokumenty.',ty:'Sprawdzasz, czy na górze jest Twoje imię, zanim cokolwiek potwierdzisz.',href:'#/home',lab:'Start i przełącznik osób'},
   {ja:'Gdy bliska osoba ma odbierać leki, pokazuję upoważnienie. W pokazie Halina ma tak ułożone recepty mamy.',ty:'Zakres i termin czytasz sama. Cofnięcie zostaje w „Upoważnieniach”.',href:'#/upowaz',lab:'Upoważnienia'},
   {ja:'Zostawiam numer infolinii COI na kartce. Godziny z komunikatu MC: dni robocze 7:00–18:00.',ty:'Dzwonisz, gdy chcesz. Hasła, BLIK-a i skanu dowodu nie podajesz.',href:'tel:+48422535474',lab:'Zadzwoń '+PHONE}
  ]}
];
let Q={i:0,score:0,picked:null,kid:''};

function segs(){return (location.hash.replace(/^#\//,'')||'home').split('?')[0].split('/').filter(Boolean)}
function top(){return decodeURIComponent(segs()[0]||'home')}
function sub(i){return decodeURIComponent(segs()[i]||'')}
function persona(){return (typeof S!=='undefined'&&S.persona)||'anna'}
function P(id){try{return (typeof PERS!=='undefined'&&PERS[id||persona()])||{}}catch(e){return {}}}
function kids(){return (typeof KIDS!=='undefined'&&KIDS)||[]}
function kidBy(id){return kids().find(k=>k.id===id)||null}
function clock(){return (typeof today!=='undefined'&&today instanceof Date)?new Date(today.getTime()):new Date(2026,9,23)}
function parseYmd(s){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');if(!m)return null;const d=new Date(+m[1],+m[2]-1,+m[3]);if(d.getFullYear()!==+m[1]||d.getMonth()!==+m[2]-1||d.getDate()!==+m[3])return null;return d}
function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function pl(d){if(!d)return '—';return String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear()}
function addYears(dob,n){return new Date(dob.getFullYear()+n,dob.getMonth(),dob.getDate())}
function ageOn(dob,on){let a=on.getFullYear()-dob.getFullYear();const m=on.getMonth()-dob.getMonth();if(m<0||(m===0&&on.getDate()<dob.getDate()))a--;return a}
function ext(href,label,cls){return `<a class="btn ${cls||'sec'} v29b" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`}
function storeGet(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}}
function storeSet(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch(e){}}
function dobStr(id){const o=storeGet(BK)||{};const s=o[id]||DOB0[id]||'';return parseYmd(s)?s:''}
function dobOf(id){return parseYmd(dobStr(id))}
function setDob(id,v){const o=storeGet(BK)||{};if(v&&parseYmd(v))o[id]=v;else delete o[id];storeSet(BK,o)}
function learn(){const p=storeGet(LK)||{};return {done:p.done||{},solo:p.solo||{},step:p.step||{}}}
function learnSet(fn){const o=learn();fn(o);storeSet(LK,o);return o}
function lessonBy(id){return LESSONS.find(x=>x.id===id)||null}
function doneCount(o){return LESSONS.filter(x=>o.done[x.id]).length}
function badge(o){
 const n=doneCount(o),solo=LESSONS.filter(x=>o.solo[x.id]).length,all=LESSONS.length;
 if(solo===all)return {t:'Odznaka: Zrobiła to sama',p:'Przy każdej lekcji jest ptaszek „zrobiła to sama”. Zapis jest tylko w tej przeglądarce.'};
 if(n===all)return {t:'Odznaka: Razem przy telefonie',p:'Wszystkie '+all+' lekcji są oznaczone jako przejrzane razem.'};
 if(n>=3)return {t:'Odznaka: Trzy lekcje',p:n+' z '+all+' lekcji zrobione razem.'};
 if(n>=1)return {t:'Pierwszy krok razem',p:n+' z '+all+' lekcji.'};
 return null;
}
function bar(n,all){const p=all?Math.round(n/all*100):0;return `<div class="bar" aria-hidden="true"><i style="width:${p}%"></i></div><p class="muted">${n} z ${all}</p>`}

function oneLine(dob){
 if(!dob)return 'Wpisz datę urodzenia.';
 const a=ageOn(dob,clock());
 if(a<0)return 'Ta data jest po 23.10.2026. Zegar pokazu stoi na tym dniu.';
 if(a<10)return 'Dziś karty jeszcze się nie wydaje (próg 10 lat). W projekcie próg to 9 lat.';
 if(a<14)return 'Dziś może mieć kartę i potrzebuje jej do 18 lat. W projekcie obowiązek kończy się z 14. urodzinami.';
 if(a<18)return 'Dziś karta jest nadal potrzebna do 18 lat. W projekcie od 14 lat już nie.';
 return 'Ukończone 18 lat: dokumentu do kierowania rowerem prawo nie wymaga.';
}
function blocks(dob){
 const on=clock(),a=ageOn(dob,on);
 const d9=addYears(dob,9),d10=addYears(dob,10),d14=addYears(dob,14),d18=addYears(dob,18);
 if(a<0)return {a,now:'Data urodzenia jest późniejsza niż zegar pokazu (23.10.2026).',proj:'Kalkulator ruszy, gdy data będzie wcześniejsza niż ten dzień.',d9,d10,d14,d18};
 let now,proj;
 if(a<10)now='Dziś karty jeszcze nie można wydać. Najwcześniej w dniu 10. urodzin: '+pl(d10)+'. Do 10. roku życia dziecko kierujące rowerem jest w przepisach pieszym. Ministerstwo Infrastruktury opisuje, że nie może wtedy legalnie jechać drogą dla rowerów nawet z rodzicem.';
 else if(a<18)now='Dziś kartę można już mieć (od 10. urodzin, '+pl(d10)+'). Do samodzielnego kierowania rowerem, do 18. urodzin ('+pl(d18)+'), potrzebna jest karta rowerowa albo prawo jazdy kategorii wskazanych w ustawie. Ministerstwo przy hulajnodze wymienia kategorie AM, A1, B1, B i T.';
 else now='Osoba, która ukończyła 18 lat, nie musi mieć dokumentu do kierowania rowerem, wózkiem rowerowym ani pojazdem zaprzęgowym. Tak jest w ustawie o kierujących pojazdami.';
 if(a<9)proj='W projekcie z 5.10.2026 kartę można by uzyskać od 9. urodzin ('+pl(d9)+'). Bez karty, poniżej 14 lat, jazda tylko z opiekunem, który ukończył co najmniej 16 lat. To jeszcze nie obowiązuje.';
 else if(a<14)proj='W projekcie samodzielna jazda byłaby już możliwa z kartą. Bez karty — tylko z opiekunem od 16. roku życia. Obowiązek karty do roweru kończyłby się z 14. urodzinami ('+pl(d14)+').';
 else proj='W projekcie osoba po 14. urodzinach ('+pl(d14)+') kieruje rowerem samodzielnie, bez karty. Dla hulajnogi elektrycznej i urządzenia transportu osobistego Ministerstwo zostawia dotychczasowy wymóg karty albo prawa jazdy w wieku od 13 do 18 lat.';
 return {a,now,proj,d9,d10,d14,d18};
}
function issuer(k){
 if(!k)return 'Uczniowi szkoły podstawowej kartę wydaje dyrektor tej szkoły. Osobie, która nie jest uczniem szkoły podstawowej, wydaje ją dyrektor wojewódzkiego ośrodka ruchu drogowego albo ośrodek szkolenia kierowców z poświadczeniem. Nieodpłatnie, za pisemną zgodą rodzica lub opiekuna.';
 if(k.id==='jan')return 'Jan jest uczniem szkoły podstawowej (SP nr 12). Kartę wydaje dyrektor szkoły, nieodpłatnie, za pisemną zgodą rodzica.';
 if(k.id==='kuba')return 'Jakub w pokazie chodzi do liceum, nie do szkoły podstawowej. Kartę wydaje wtedy dyrektor WORD albo przedsiębiorca prowadzący ośrodek szkolenia kierowców z poświadczeniem. Też nieodpłatnie i za zgodą rodzica. Czy akurat jego liceum coś organizuje, ustawa nie rozstrzyga.';
 return 'Zofia jest w przedszkolu. Egzaminu jeszcze nie składa. Gdy będzie uczennicą szkoły podstawowej, kartę wyda dyrektor szkoły.';
}
function srcBike(){return `<details class="v29more"><summary>Skąd to wiemy</summary>
<p>Dziś: ustawa o kierujących pojazdami, tekst jednolity Dz.U. 2024 poz. 1210 na <a href="${ELI}" target="_blank" rel="noopener">eli.gov.pl</a>. Sprawdzone zdania: kartę wydaje nieodpłatnie dyrektor szkoły (uczeń szkoły podstawowej) albo dyrektor WORD lub OSK z poświadczeniem, za pisemną zgodą rodzica; trzeba osiągnąć minimalny wiek i wykazać się umiejętnościami; osoba po 18. roku życia nie musi mieć dokumentu do roweru. Art. 17 ust. 3 pozwala udostępnić kartę jako dokument mobilny w mObywatelu, ale wchodzi w życie dopiero w dniu wdrożenia rozwiązań technicznych. Minister informatyki ogłasza ten dzień w Monitorze Polskim, w porozumieniu z ministrem transportu i ministrem oświaty.</p>
<p>Projekt, jeszcze nie prawo: <a href="${MI}" target="_blank" rel="noopener">Ministerstwo Infrastruktury, 5.10.2026</a>. Wiceminister Stanisław Bukowiec przedstawił propozycje: karta od 9 lat zamiast 10, obowiązek do 14 lat zamiast 18, dziecko zawsze jako kierujący, bez karty poniżej 14 lat tylko z opiekunem od 16 lat, ogólnopolska baza pytań, cyfrowa karta w mObywatelu gdy Ministerstwo Cyfryzacji ogłosi gotowość. Nie znalazłem na gov.pl informacji, że Sejm to uchwalił.</p>
<p>Zegar kalkulatora to 23.10.2026, jak w reszcie prototypu. Daty urodzenia Jana, Zofii Kowalskiej i Jakuba Kowalskiego są przykładowe i da się je zmienić. To nie są prawdziwe PESEL-e. Wiek w spisie rodziny (8, 3 i 16 lat) zgadza się z tymi datami na dzień zegara.</p>
</details>`}
function srcTogether(){return `<details class="v29more"><summary>Skąd to wiemy i czego nie bierzemy za procedurę</summary>
<p>„Szkoła międzypokoleniowa” to ogólnopolski konkurs dla szkół: uczniowie klas 7–8 i szkół ponadpodstawowych, z nauczycielem, prowadzą warsztaty cyfrowe dla seniorów. Organizują go NASK, Ministerstwo Cyfryzacji, Ministerstwo Edukacji Narodowej i pełnomocnik rządu ds. polityki senioralnej. Rejestracja szkół: 11–22 marca 2026. Warsztaty: 1 kwietnia–30 września 2026. Wyniki: komunikat MC z 2.11.2026 (1042 zgłoszone szkoły, 5705 seniorów). <a href="${MC_SZK}" target="_blank" rel="noopener">MC o rejestracji</a> · <a href="${MEN_SZK}" target="_blank" rel="noopener">MEN</a> · <a href="${MC_WYN}" target="_blank" rel="noopener">wyniki, 2.11.2026</a>. Lekcje na tym telefonie są naszym pokazem w koncie rodzinnym. Nie są zajęciami tego konkursu i nie zgłaszają szkoły.</p>
<p>Aktualizacja aplikacji: <a href="${MC_APP}" target="_blank" rel="noopener">info.mobywatel.gov.pl</a> każe wejść do Sklepu Play albo App Store (albo mieć aktualizacje automatyczne). Komunikat <a href="${MC_CERT}" target="_blank" rel="noopener">MC o certyfikatach</a>: do 5 sierpnia 2026 wystarczyło się zalogować, żeby certyfikaty odświeżyły się same; po terminie mDowód wraca po potwierdzeniu tożsamości, legitymacja studencka bywa dodawana kodem z dziekanatu, a legitymacja szkolna w mObywatelu Junior — kodem z ZPE. W regulaminie aplikacji odinstalowanie jest opisane przed oddaniem telefonu innej osobie, a ponowna instalacja — gdy hasła nie da się odzyskać (<a href="${REG}" target="_blank" rel="noopener">informacja o aplikacji</a>). Nie znalazłem urzędowej instrukcji, która przy zwykłej aktualizacji każe usunąć aplikację i dodać wszystkie dokumenty od nowa. Taki opis pojawia się w relacjach użytkowników. Traktuję go jako sygnał, nie jako procedurę.</p>
<p>Pomoc: infolinia ${PHONE}, dni robocze 7:00–18:00, pracownicy COI nie piszą pierwsi — <a href="${MC_HELP}" target="_blank" rel="noopener">MC, 2.12.2025</a>. Postęp lekcji leży w localStorage tej przeglądarki. Nie ma w nim imion ani dokumentów.</p>
</details>`}

function kidCards(){
 return kids().map(k=>{
  const dob=dobOf(k.id);
  const b=dob?blocks(dob):null;
  return `<a class="v29kid" href="#/karta-rowerowa/${k.id}"><b>${esc(k.n)}</b><small>${esc(k.szk)} · w spisie ${k.w} lat</small><span>${dob?esc(oneLine(dob)):'Uzupełnij datę'}</span>${b?`<em>10. urodziny: ${pl(b.d10)} · 18. urodziny: ${pl(b.d18)}</em>`:''}</a>`;
 }).join('');
}
function dateField(id,label){
 const v=dobStr(id);
 return `<label for="v29d-${id}">${label}</label><input id="v29d-${id}" type="date" value="${esc(v)}" onchange="v29Dob('${id}',this.value)">`;
}
function compare(dob){
 const b=blocks(dob);
 return `<div class="v29pair"><div><b>Dziś obowiązuje</b><p>${esc(b.now)}</p><p class="muted">Wiek na 23.10.2026: <b>${b.a<0?'—':b.a+' lat'}</b></p></div><div><b>Projekt z 5.10.2026</b><p>${esc(b.proj)}</p><p class="muted">9. urodziny: ${pl(b.d9)} · 14. urodziny: ${pl(b.d14)}</p></div></div>`;
}
function stepsHtml(k){
 return `<ol class="v29steps">
  <li><b>Sprawdź wiek.</b> Kalkulator rozdziela dzień, od którego kartę można dostać, i dzień, do którego jest potrzebna. Osobno dla prawa, które obowiązuje, i dla projektu.</li>
  <li><b>Ustal, kto wydaje kartę.</b> ${esc(issuer(k))}</li>
  <li><b>Przygotuj egzamin.</b> Ustawa wymaga wykazania umiejętności kierowania rowerem podczas zajęć. Ministerstwo pisze, że nie ma jeszcze jednej, jawnej, ogólnopolskiej bazy pytań i że praktyka bywa zbyt daleka od prawdziwej drogi. Czego zabrać na plac, zapytaj w szkole albo w WORD. Tej listy tu nie wymyślam.</li>
  <li><b>Po zdaniu.</b> Dziś jest karta wydawana przez szkołę, WORD albo OSK. Wersja w telefonie: ustawa na nią pozwala, a wejdzie w życie po komunikacie o wdrożeniu. Ministerstwo Cyfryzacji ma ogłosić, kiedy cyfrowa karta będzie gotowa. Podgląd w tym prototypie jest ${DEMO} i nie jest dokumentem.</li>
 </ol>`;
}
function parentShort(){return `<div class="v29pair">
 <div><b>Opieka — dziś</b><p>Dziecko do 10 lat jest przy rowerze pieszym i, według opisu MI, nie może jechać drogą dla rowerów nawet z dorosłym. Dziecko, które ma już 10 lat, ale nie ma karty, nie może legalnie kierować rowerem nawet z rodzicem. Dokument jest potrzebny do 18 lat.</p></div>
 <div><b>Opieka — projekt</b><p>Dziecko na rowerze byłoby zawsze kierującym. Poniżej 14 lat: samodzielnie po karcie, bez karty tylko z osobą, która ukończyła co najmniej 16 lat. Od 14 lat: samodzielnie, bez karty. To propozycja z 5.10.2026.</p></div>
</div>`}

function pageBike(){
 const id=sub(1);
 if(id&&(kidBy(id)||id==='wlasna'))return pageChild(id);
 const who=P();
 const custom=dobOf('wlasna');
 shell('🚲 Karta rowerowa dziecka',`${DEMO}
 <div class="alert y">⚖️<div><b>Projekt, jeszcze nie obowiązujące prawo.</b> Propozycje Ministerstwa Infrastruktury z 5 października 2026 r. Kalkulator pokazuje obok siebie dzień dzisiejszy i ten projekt. Nic nie jest wysyłane do szkoły ani do urzędu.</div></div>
 <div class="card v29card">
  <h3>Dzieci w tym pokazie</h3>
  <p class="muted">To ten sam spis co w Rodzinie: dzieci Anny Kowalskiej. ${persona()==='anna'?'Jesteś na koncie Anny.':'Teraz na ekranie jest '+esc(who.full||'inna osoba')+'.'} Daty urodzenia są przykładowe ${DEMO} i możesz je zmienić.</p>
  ${kidCards()}
  ${persona()==='anna'?'':`<button type="button" class="btn sec" onclick="v29As('anna','#/karta-rowerowa')">Otwórz konto Anny</button>`}
 </div>
 <div class="card v29card">
  <h3>Inna data urodzenia</h3>
  ${dateField('wlasna','Data urodzenia')}
  ${custom?compare(custom):'<p class="muted">Wpisz datę, a pokażę progi 9, 10, 14 i 18 lat.</p>'}
  ${custom?`<button type="button" class="btn sec" onclick="v29Ics('wlasna')">Przypomnienie DEMO do kalendarza (.ics)</button>`:''}
 </div>
 <div class="card v29card"><h3>Jak zdobyć kartę</h3>${stepsHtml(null)}
  <a class="btn v29b" href="#/karta-quiz">Quiz dla dziecka — przykład, nie egzamin</a>
  <a class="btn ghost" href="#/karta-podglad">Podgląd karty w mObywatelu Junior ${DEMO}</a>
 </div>
 <div class="card v29card"><h3>Zasady dla rodzica</h3>${parentShort()}
  ${ext(MI,'Komunikat MI z 5.10.2026','sec')}
  <details class="v29more"><summary>Więcej o chodniku, hulajnodze i egzaminie</summary>
   <p>Projekt dopuszcza w szczególnych sytuacjach jazdę po chodniku: dzieci do 14 lat (na przykład w drodze do szkoły), opiekunów dzieci do 14 lat bez karty, a gdy nie ma drogi dla rowerów — także osoby wiozące dziecko do 7 lat albo dziecko w przystosowanej przyczepce. Rowerzysta ma jechać ostrożnie, powoli, ustępować pieszym i nie utrudniać im ruchu. To zdania z komunikatu MI, nie z obowiązującego dziś przepisu o chodniku.</p>
   <p>Hulajnoga elektryczna i urządzenie transportu osobistego: MI pisze, że dla młodzieży od 13 do 18 lat zostaje wymóg karty rowerowej albo prawa jazdy kategorii AM, A1, B1, B lub T. Projekt obniża próg przy rowerze, nie przy hulajnodze.</p>
   <p>Egzamin: MI opisuje brak jednolitych standardów i brak jawnej bazy pytań. W projekcie bazę i założenia programu miałoby opracować Centrum do Spraw Szkolenia i Egzaminowania w Instytucie Transportu Samochodowego. Quiz w tej aplikacji jest naszym przykładem czterech ogólnie znanych zasad. Nie zastępuje egzaminu.</p>
  </details>
 </div>
 ${srcBike()}`,{tab:'more'});
}
function pageChild(id){
 const k=kidBy(id);
 const dob=dobOf(id);
 const name=k?k.n:(id==='wlasna'?'Wpisana data':'Dziecko');
 shell('🚲 '+name,`${DEMO}
 <p class="muted"><a href="#/karta-rowerowa">Wszystkie dzieci</a>${k?` · <a href="#/kid/${k.id}">Karta w Rodzinie</a>`:''}</p>
 <div class="card v29card">
  <h3>${esc(name)}</h3>
  ${k?`<p class="muted">${esc(k.szk)}. W spisie rodziny: ${k.w} lat. Wiek poniżej liczy się z daty.</p>`:''}
  ${dateField(id,'Data urodzenia (przykład, możesz poprawić)')}
  ${dob?compare(dob):'<p>Wpisz pełną datę.</p>'}
  <button type="button" class="btn sec" onclick="v29Ics('${id}')">Przypomnienie DEMO do kalendarza</button>
  <p class="muted">Plik powstaje w przeglądarce. W tytule jest słowo DEMO. Terminu egzaminu w szkole tu nie ma, bo go nie znam.</p>
 </div>
 <div class="card v29card"><h3>Kroki</h3>${stepsHtml(k)}
  <a class="btn v29b" href="#/karta-quiz/${id}">Quiz przepisów — przykład</a>
  <a class="btn sec" href="#/karta-podglad/${id}">Podgląd karty Junior ${DEMO}</a>
 </div>
 <div class="card v29card"><h3>Dla rodzica</h3>${parentShort()}${ext(MI,'Źródło: Ministerstwo Infrastruktury','ghost')}</div>
 ${srcBike()}`,{tab:'more'});
}
function pageQuiz(){
 const id=sub(1)||'';
 const k=kidBy(id);
 Q.kid=id;
 const name=k?k.n.split(' ')[0]:'dziecko';
 const item=QUIZ[Q.i];
 const end=Q.i>=QUIZ.length;
 let body;
 if(end){
  body=`<h3>Koniec przykładu</h3><p class="v29score">${Q.score} z ${QUIZ.length}</p><p>To liczba w tym pokazie, nie wynik egzaminu i nie ocena ze szkoły. Oficjalnej, jawnej bazy pytań jeszcze nie ma — tak pisze Ministerstwo Infrastruktury. Egzamin składa się w szkole, w WORD albo w ośrodku z poświadczeniem.</p><button type="button" class="btn sec" onclick="v29QuizReset()">Jeszcze raz</button>`;
 }else{
  const opts=item.a.map((t,i)=>{
   let cls='';
   if(Q.picked!==null)cls=i===item.ok?'ok':(i===Q.picked?'bad':'');
   const dis=Q.picked!==null?'disabled':'';
   return `<button type="button" class="v29opt ${cls}" ${dis} onclick="v29Answer(${i})">${esc(t)}</button>`;
  }).join('');
  const why=Q.picked===null?'':`<p class="${Q.picked===item.ok?'v29ok':'v29bad'}">${Q.picked===item.ok?'Dobrze.':'Spróbuj zapamiętać tę zasadę.'} ${esc(item.why)}</p><button type="button" class="btn" onclick="v29Next()">Dalej</button>`;
  body=`<p class="muted">Pytanie ${Q.i+1} z ${QUIZ.length} · dla: ${esc(name)}</p><h3>${esc(item.q)}</h3>${opts}${why}`;
 }
 shell('🚲 Quiz na rowerze',`${DEMO}
 <div class="alert b">ℹ️<div><b>Przykład dla dziecka, nie egzamin.</b> Cztery zasady, które dzieci ćwiczą przed kartą: czerwone światło, prawa strona, przejście dla pieszych i światła po zmroku.</div></div>
 <div class="card v29card">${body}</div>
 <p class="muted"><a href="#/karta-rowerowa${id?'/'+id:''}">Wróć do karty rowerowej</a></p>
 ${srcBike()}`,{tab:'more'});
}
function pageCard(){
 const id=sub(1)||'';
 const k=kidBy(id);
 const list=kids();
 if(!k){
  shell('🪪 Podgląd karty',`${DEMO}
   <div class="alert y">ℹ️<div><b>Wybierz dziecko z pokazu.</b> Podgląd nie jest dokumentem i nie łączy się z rejestrem.</div></div>
   ${list.map(x=>`<a class="btn sec" href="#/karta-podglad/${x.id}">${esc(x.n)}</a>`).join('')}
   <a class="btn ghost" href="#/karta-rowerowa">Wróć</a>`,{tab:'wallet'});
  return;
 }
 const first=k.n.split(' ')[0];
 const b=blocks(dobOf(k.id)||parseYmd(DOB0[k.id]));
 const qr=typeof qrSVG==='function'?qrSVG('DEMO-KR-'+k.id):'';
 shell('🪪 mObywatel Junior',`${DEMO}
 <div class="alert y">ℹ️<div><b>Podgląd projektu, nie dokument.</b> mObywatel Junior istnieje: Ministerstwo Cyfryzacji pisze o nim przy legitymacji szkolnej. Cyfrowej karty rowerowej MC jeszcze nie ogłosiło jako gotowej. Art. 17 ust. 3 ustawy wejdzie w życie w dniu wdrożenia, ogłoszonym w Monitorze Polskim.</div></div>
 <div class="doc g v29doc"><span class="st">DEMO · nieważne</span><div class="t">Karta rowerowa</div><div class="s">mObywatel Junior · podgląd</div><div class="s" style="margin-top:18px">${esc(first)}</div><div class="s">Numer: DEMO — to nie jest numer karty</div></div>
 <div class="card v29card" style="text-align:center">
  <h3>Kod w tym pokazie</h3>${qr}<p class="muted">Kod nic nie potwierdza. Weryfikator prawdziwych ekranów jest w <a href="#/podrobki">„Prawdziwy czy podróbka?”</a>.</p>
  <p>Wiek na zegarze pokazu: <b>${b.a} lat</b>. ${esc(oneLine(dobOf(k.id)))}</p>
  <a class="btn sec" href="#/karta-rowerowa/${k.id}">Kalkulator i kroki</a>
  <a class="btn ghost" href="#/kid/${k.id}">Sprawy dziecka w Rodzinie</a>
 </div>
 ${srcBike()}`,{tab:'wallet'});
}

function pageTogether(){
 const o=learn();
 const b=badge(o);
 const who=P();
 const halina=persona()==='halina';
 shell('👵 Wnuk uczy babcię',`${DEMO}
 <div class="alert b">👪<div><b>Jedna lekcja, dwa głosy, jeden telefon.</b> Młodsza osoba czyta „Ja robię”. Starsza czyta „Ty robisz” i sama stuka, gdy umie. Zapis zostaje w tej przeglądarce. Bez imion i bez dokumentów.</div></div>
 <div class="card v29card">
  ${b?`<p class="v29badge">${esc(b.t)}</p><p>${esc(b.p)}</p>`:'<p class="v29badge">Jeszcze bez odznaki</p><p>Odznaka pojawia się po pierwszej ukończonej lekcji.</p>'}
  ${bar(doneCount(o),LESSONS.length)}
  <p class="muted">Ptaszek „zrobiła to sama”: ${LESSONS.filter(x=>o.solo[x.id]).length} z ${LESSONS.length}.</p>
 </div>
 <div class="card v29card">
  <h3>Kto siada przy telefonie</h3>
  <p>W pokazie starsza osoba z nieaktualną wersją aplikacji to <b>Halina Wrona</b> (57 lat, Lublin). Jej mama, <b>Zofia Wrona</b> (84 lata), jest w upoważnieniach Haliny i nie ma własnego konta na przełączniku. Lekcję można przejść z Haliną albo, tym samym ekranem, z Zofią.</p>
  <p class="muted">Teraz na ekranie: ${esc(who.full||'osoba pokazu')}. ${halina?'To konto Haliny.':'Żeby usiąść przy jej telefonie w pokazie, przełącz konto.'}</p>
  ${halina?`<button type="button" class="btn sec" onclick="v29Senior(true)">Włącz duże litery</button>`:`<button type="button" class="btn" onclick="v29As('halina','#/razem-uczymy',true)">Otwórz konto Haliny i włącz duże litery</button>`}
 </div>
 <div class="card v29card"><h3>Siedem lekcji</h3>
  ${LESSONS.map((ls,i)=>{
    const st=o.done[ls.id]?(o.solo[ls.id]?'zrobiła sama':'razem'):'przed wami';
    return `<a class="v29lesson" href="#/razem-lekcja/${ls.id}"><b>${i+1}. ${esc(ls.t)}</b><small>${esc(st)}</small></a>`;
  }).join('')}
  <a class="btn ghost" href="#/razem-sciaga">Ściąga do wydruku</a>
 </div>
 <div class="card v29card"><h3>To nie jest konkurs dla szkół</h3>
  <p>Szkoła międzypokoleniowa na gov.pl to warsztaty uczniów dla seniorów, z nauczycielem, w szkole albo klubie seniora. Tu zostajecie w domu, przy telefonie z mObywatelem. Konkursu nie zgłaszamy.</p>
  ${ext(MC_WYN,'Wyniki konkursu, MC 2.11.2026','sec')}
 </div>
 ${srcTogether()}`,{tab:'more'});
}
function pageLesson(){
 const ls=lessonBy(sub(1));
 if(!ls){shell('Lekcja',`<p>Nie ma takiej lekcji.</p><a class="btn" href="#/razem-uczymy">Wróć do listy</a>`,{tab:'more'});return}
 const o=learn();
 const i=Math.max(0,Math.min(o.step[ls.id]||0,ls.steps.length-1));
 const st=ls.steps[i];
 const solo=!!o.solo[ls.id];
 const link=st.href?(st.ext?ext(st.href,st.lab,'sec'):`<a class="btn sec v29b" href="${st.href}">${esc(st.lab)}</a>`):(st.go==='senior'?`<button type="button" class="btn sec" onclick="v29Senior(true)">Włącz duże litery</button>`:'');
 const n=LESSONS.findIndex(x=>x.id===ls.id);
 shell('👵 Lekcja '+(n+1),`${DEMO}
 <p class="muted"><a href="#/razem-uczymy">Wszystkie lekcje</a> · ${n+1} z ${LESSONS.length}</p>
 <div class="card v29card">
  <h3>${esc(ls.t)}</h3>
  <p>${esc(ls.lead)}</p>
  ${bar(i+1,ls.steps.length)}
  <p class="v29krok">Krok ${i+1} z ${ls.steps.length}</p>
  <div class="v29who ja"><b>Ja robię</b><p>${esc(st.ja)}</p></div>
  <div class="v29who ty"><b>Ty robisz</b><p>${esc(st.ty)}</p></div>
  ${link}
  <div class="v29nav">
   <button type="button" class="btn ghost" ${i?`onclick="v29Step('${ls.id}',${i-1})"`:'disabled'}>Wstecz</button>
   <button type="button" class="btn" ${i<ls.steps.length-1?`onclick="v29Step('${ls.id}',${i+1})"`:`onclick="v29Finish('${ls.id}')"`}>${i<ls.steps.length-1?'Dalej':'Przeszliśmy razem'}</button>
  </div>
  <button type="button" class="v29solo ${solo?'on':''}" onclick="v29Solo('${ls.id}')">${solo?'✓ Zrobiła to sama':'Zrobiła to sama'}</button>
  <p class="muted">Ptaszek zostaje w tej przeglądarce. Nie wysyła nic do urzędu i nie zapisuje imienia.</p>
 </div>
 <a class="btn ghost" href="#/razem-sciaga">Ściąga do wydruku</a>
 ${srcTogether()}`,{tab:'more'});
}
function sheetLines(){
 return LESSONS.map((ls,i)=>`<li><b>${esc(ls.t)}.</b> ${ls.steps.map(s=>esc(s.ty.replace(/\.$/,''))).join('. ')}.</li>`).join('');
}
function pageSheet(){
 shell('🖨️ Ściąga',`${DEMO}
 <div class="card v29card v29sheet" id="v29sheet">
  <h3>Razem przy telefonie</h3>
  <p>Kartka dla domu. Bez nazwisk. Duże kroki są dla starszej osoby, młodsza siedzi obok.</p>
  <ol class="v29steps">${sheetLines()}</ol>
  <p><b>Aktualizacja:</b> Sklep Play albo App Store, nie usuwanie aplikacji. Gdy zniknął dokument — logowanie i ekran „Dokumenty nie znikną”.</p>
  <p><b>Prawdziwa pomoc:</b> ${PHONE}, dni robocze 7:00–18:00. Hasła, BLIK-a i skanu dowodu nie podajemy.</p>
  <p class="muted">DEMO. Koncepcja mObywatel, nie materiał konkursu „Szkoła międzypokoleniowa”.</p>
 </div>
 <button type="button" class="btn v29noprint" onclick="v29Print()">Drukuj ściągę</button>
 <a class="btn ghost v29noprint" href="#/razem-uczymy">Wróć do lekcji</a>
 ${srcTogether()}`,{tab:'more'});
}

window.v29Dob=function(id,v){if(v&&!parseYmd(v)){toast('To nie jest pełna data.');return}setDob(id,v);route()};
window.v29Ics=function(id){
 const dob=dobOf(id);if(!dob){toast('Najpierw wpisz datę urodzenia.');return}
 const on=clock();
 const k=kidBy(id);
 const name=k?k.n:'dziecka (data z kalkulatora)';
 const marks=[
  {d:addYears(dob,9),sum:'DEMO: sprawdź, czy karta rowerowa od 9 lat już obowiązuje',desc:'Projekt MI z 5.10.2026, jeszcze nie prawo. Zapytaj w szkole. To nie jest termin egzaminu.'},
  {d:addYears(dob,10),sum:'DEMO: według dzisiejszego prawa można uzyskać kartę rowerową',desc:'Minimalny wiek dziś to 10 lat. Kartę wydaje szkoła podstawowa, WORD albo OSK. Źródło w prototypie: gov.pl i eli.gov.pl.'},
  {d:addYears(dob,14),sum:'DEMO: w projekcie MI kończy się obowiązek karty do roweru',desc:'Projekt z 5.10.2026 obniża obowiązek z 18 do 14 lat. Dziś nadal liczy się 18 lat.'},
  {d:addYears(dob,18),sum:'DEMO: według dzisiejszego prawa kończy się obowiązek dokumentu do roweru',desc:'Osoba, która ukończyła 18 lat, nie musi mieć dokumentu do kierowania rowerem.'}
 ];
 const fut=marks.filter(x=>x.d>=on);
 if(!fut.length){toast('W kalkulatorze nie ma już przyszłego progu.');return}
 const p=n=>String(n).padStart(2,'0');
 const stamp=(()=>{const d=new Date();return d.getUTCFullYear()+p(d.getUTCMonth()+1)+p(d.getUTCDate())+'T'+p(d.getUTCHours())+p(d.getUTCMinutes())+p(d.getUTCSeconds())+'Z'})();
 const escape=s=>String(s).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const events=fut.map(x=>{
  const day=ymd(x.d).replace(/-/g,'');
  return ['BEGIN:VEVENT','UID:v29-'+id+'-'+day+'@mobywatel-koncepcja','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+day,'SUMMARY:'+escape(x.sum),'DESCRIPTION:'+escape(x.desc+' Osoba w pokazie: '+name+'. Nic nie zostało wysłane.'),'END:VEVENT'].join('\r\n');
 }).join('\r\n');
 const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-mObywatel-koncepcja-v29-DEMO-','CALSCALE:GREGORIAN',events,'END:VCALENDAR'].join('\r\n');
 const b=new Blob([ics],{type:'text/calendar'});
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='karta-rowerowa-demo.ics';document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(a.href),1000);
 toast('Plik kalendarza zapisany w przeglądarce (DEMO). Nic nie wysłano.');
};
window.v29Answer=function(i){if(Q.picked!==null)return;Q.picked=i;if(i===QUIZ[Q.i].ok)Q.score++;pageQuiz()};
window.v29Next=function(){Q.i++;Q.picked=null;pageQuiz()};
window.v29QuizReset=function(){Q.i=0;Q.score=0;Q.picked=null;pageQuiz()};
window.v29Step=function(id,i){learnSet(o=>{o.step[id]=i});if(top()==='razem-lekcja')pageLesson();else location.hash='#/razem-lekcja/'+id};
window.v29Finish=function(id){learnSet(o=>{o.done[id]=1;o.step[id]=0});toast('Lekcja zapisana na tym telefonie (DEMO).');const n=LESSONS.findIndex(x=>x.id===id);if(n>=0&&n<LESSONS.length-1)location.hash='#/razem-lekcja/'+LESSONS[n+1].id;else location.hash='#/razem-uczymy'};
window.v29Solo=function(id){learnSet(o=>{o.solo[id]=o.solo[id]?0:1;if(o.solo[id])o.done[id]=1});pageLesson()};
window.v29Senior=function(on){S.senior=!!on;try{save()}catch(e){}document.body.classList.toggle('senior',!!S.senior);toast(S.senior?'Duże litery włączone.':'Duże litery wyłączone.');route()};
window.v29As=function(id,hash,senior){if(id&&id!==persona()&&typeof applyPersona==='function'){applyPersona(id);if(typeof syncSide==='function')syncSide()}if(senior){S.senior=true;try{save()}catch(e){}document.body.classList.add('senior')}if(hash&&location.hash!==hash)location.hash=hash;else route()};
window.v29Print=function(){window.print()};

const ANS_BIKE='Dziś kartę rowerową można uzyskać od 10. roku życia. Do ukończenia 18 lat jest potrzebna do samodzielnej jazdy rowerem (albo odpowiednie prawo jazdy). Od 18 lat dokumentu do roweru nie trzeba. Ministerstwo Infrastruktury 5 października 2026 r. zaproponowało kartę od 9 lat, obowiązek tylko do 14 lat i cyfrową kartę w mObywatelu. To projekt, jeszcze nie obowiązujące prawo. Otworzę kalkulator dla dzieci z konta rodzinnego. Odpowiedź z reguł w telefonie, bez AI.';
const ANS_RAZEM='Pokażę siedem krótkich lekcji na jednym telefonie: duże litery, aktualizacja w sklepie bez usuwania aplikacji, dodanie dokumentu, pokazanie go w urzędzie, fałszywy SMS, kod QR i prośba o pomoc. To DEMO, zapis zostaje w przeglądarce. Szkoła Międzypokoleniowa na gov.pl to osobny konkurs dla szkół. Odpowiedź z reguł w telefonie, bez AI.';
function v29Rule(q){
 let l='';try{l=norm(q)}catch(e){l=String(q||'').toLowerCase()}
 if(!l)return null;
 if(/karta duzej|duzej rodzin|\bkdr\b/.test(l)&&!/rower/.test(l))return null;
 if(/karta rower|rowerow\w* kart|od ilu lat.{0,48}(rower|karte rower)|egzamin.{0,24}rower|czy dziecko musi miec kart/.test(l))return ['#/karta-rowerowa',ANS_BIKE];
 if(/razem uczym|wnuk uczy|uczy babci|babci\w*.{0,40}(telefon|aplikac|mobywatel|sms|lekcj)|lekcj\w*.{0,24}(babci|senior)|szkola miedzypokolen|jak wytlumaczyc (babci|senior)/.test(l))return ['#/razem-uczymy',ANS_RAZEM];
 return null;
}
window.v29Rule=v29Rule;

const LEAD=(id,href,title,sub)=>`<a id="${id}" class="v29lead" href="${href}"><b>${title}</b><small>${sub}</small></a>`;
function inject(){
 const sc=app&&app.querySelector('.scroll');if(!sc)return;
 const p=top(),id=sub(1);
 if(p==='family'&&!sc.querySelector('#v29fam')){
  sc.insertAdjacentHTML('afterbegin',`<div id="v29fam">${LEAD('v29famA','#/karta-rowerowa','🚲 Karta rowerowa dziecka','Kalkulator 9, 10, 14 i 18 lat. Dziś obok projektu z 5.10.2026.')}${LEAD('v29famB','#/razem-uczymy','👵 Wnuk uczy babcię','Siedem lekcji na telefonie seniora. Zapis tylko tutaj.')}</div>`);
 }
 if(p==='kid'&&kidBy(id)&&!sc.querySelector('#v29kid')){
  sc.insertAdjacentHTML('afterbegin',LEAD('v29kid','#/karta-rowerowa/'+id,'🚲 Karta rowerowa — kalkulator','Podgląd w mObywatelu Junior jest DEMO. Prawo i projekt są rozdzielone.'));
 }
 if(p==='home'&&S.senior&&!sc.querySelector('#v29home')){
  const anchor=document.getElementById('v19h');
  const html=LEAD('v29home','#/razem-uczymy','👵 Uczymy się razem','Duże kroki: aktualizacja, dokument, fałszywy SMS. Na tym telefonie.');
  if(anchor)anchor.insertAdjacentHTML('afterend',html);else sc.insertAdjacentHTML('afterbegin',html);
 }
 if(p==='settings'&&!sc.querySelector('#v29set')){
  sc.insertAdjacentHTML('afterbegin',`<div id="v29set" class="card v29card"><h3>Lekcje ze starszą osobą</h3><p>Tryb seniora zostaje tu, gdzie był. Obok są lekcje, które młodsza osoba przechodzi razem na tym telefonie.</p><a class="btn sec" href="#/razem-uczymy">Wnuk uczy babcię</a></div>`);
 }
 if((p==='gotowosc'||p==='wskazowka')&&!sc.querySelector('#v29upd')){
  sc.insertAdjacentHTML('afterbegin',LEAD('v29upd','#/razem-lekcja/aktualizacja','👵 Przejdź aktualizację razem','Duże kroki zostają. Lekcja dokłada: nie usuwaj aplikacji przy zwykłej aktualizacji.'));
 }
 if(p==='zdrowie-dokumentow'&&!sc.querySelector('#v29doc')){
  sc.insertAdjacentHTML('afterbegin',LEAD('v29doc','#/razem-lekcja/dokument','👵 Dodaj dokument razem','Te same przyczyny co niżej, w krokach „ja robię / ty robisz”.'));
 }
 if((p==='podrobki'||p==='phishing'||p==='zglos-oszustwo'||p==='jak-rozpoznac')&&!sc.querySelector('#v29fake')){
  sc.insertAdjacentHTML('afterbegin',LEAD('v29fake','#/razem-lekcja/sms','👵 Fałszywy SMS — lekcja razem','Poradnik zostaje. Obok jest lekcja na dwa głosy.'));
 }
 if(p==='assistant'&&!document.getElementById('v29chip')){
  const chips=[...sc.querySelectorAll('.chips')].filter(c=>!c.closest('.chat')&&!c.closest('.msg'));
  const box=chips[chips.length-1];
  if(box)box.insertAdjacentHTML('beforeend','<button type="button" class="chip" id="v29chip" onclick="ask(\'od ilu lat karta rowerowa\')">Od ilu lat karta rowerowa?</button><button type="button" class="chip" id="v29chip2" onclick="ask(\'wnuk uczy babcię\')">Wnuk uczy babcię</button>');
 }
 const more=document.getElementById('v19more');
 if(more&&!more.querySelector('#v29grp')){
  const d=document.createElement('details');d.className='v19g';d.id='v29grp';d.open=true;
  d.innerHTML='<summary>👨‍👩‍👧 <b>Rodzina: rower i lekcje</b> <span class="muted">2</span></summary><div class="grid"><button type="button" class="tile" onclick="location.hash=\'#/karta-rowerowa\'"><b>🚲</b>Karta rowerowa</button><button type="button" class="tile" onclick="location.hash=\'#/razem-uczymy\'"><b>👵</b>Razem uczymy</button></div>';
  const q=more.querySelector('#v19q');
  if(q)q.insertAdjacentElement('afterend',d);else more.insertBefore(d,more.firstChild);
 }
}

const _ask=ask;
ask=async function(q){const hit=v29Rule(q);if(!hit)return _ask.apply(this,arguments);q=(q||'').trim();if(!q)return;if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});window.v14Last={k:'rules',fb:false,shown:1};chat.push({r:'a',t:hit[1]+'<br><b>Czy chcesz kontynuować?</b>',act:hit[0]});drawChat();try{speak(String(hit[1]).replace(/<[^>]+>/g,''))}catch(e){}};
window.ask=ask;
if(window.v18Route){const _v=window.v18Route;window.v18Route=function(q){const hit=v29Rule(q);if(hit)return {kind:'act',hit:[null,hit[0],hit[1]],act:hit[0]};return _v(q)}}
try{
 INT.unshift([/karta rowerowa|od ilu lat karta rowerowa/i,'#/karta-rowerowa',ANS_BIKE],[/wnuk uczy babcię|razem uczymy|szkoła międzypokoleniowa/i,'#/razem-uczymy',ANS_RAZEM]);
 ALL.push(['🚲','Karta rowerowa dziecka','#/karta-rowerowa','karta rowerowa rodzina dziecko egzamin 9 lat 10 lat 14 lat 18 lat mObywatel Junior projekt'],['👵','Wnuk uczy babcię','#/razem-uczymy','senior rodzina lekcja aktualizacja dokument sms qr pomoc szkoła międzypokoleniowa']);
}catch(e){}

const R={'karta-rowerowa':pageBike,'karta-quiz':pageQuiz,'karta-podglad':pageCard,'razem-uczymy':pageTogether,'razem-lekcja':pageLesson,'razem-sciaga':pageSheet};
const _r=route;
route=function(){const p=top();if(R[p]){try{clearInterval(threatT)}catch(e){}try{clearInterval(camT)}catch(e){}if(p==='karta-quiz'&&Q._route!==location.hash){Q={i:0,score:0,picked:null,kid:sub(1),_route:location.hash}}R[p]();try{inject()}catch(e){}return}const out=_r.apply(this,arguments);try{inject()}catch(e){}return out};
window.route=route;onhashchange=route;
new MutationObserver(()=>{try{inject()}catch(e){}}).observe(app,{childList:true,subtree:true});
const st=document.createElement('style');st.textContent=`
.v29lead{display:flex;flex-direction:column;gap:3px;text-decoration:none;border-radius:16px;padding:14px;margin:0 0 10px;background:#fff;color:#14213d;border:1.5px solid #d5deee;box-shadow:0 1px 3px #0001}
.v29lead b{color:#0b3d91;font-size:1.12em}.v29lead small{font-weight:650;line-height:1.35}
.v29card .btn,.v29b{display:block;text-align:center;text-decoration:none;margin:8px 0;min-height:48px;line-height:1.3;box-sizing:border-box}
.v29kid,.v29lesson{display:flex;flex-direction:column;gap:2px;text-decoration:none;color:inherit;border:1px solid #d5deee;border-radius:14px;padding:12px;margin:8px 0;background:#f7f9fd}
.v29kid b,.v29lesson b{color:#0b3d91}.v29kid small,.v29kid em,.v29lesson small{display:block;color:#5b6476;font-style:normal}
.v29kid span{margin-top:4px;line-height:1.35}
.v29pair{display:grid;gap:10px}.v29pair>div{background:#f4f7fb;border:1px solid #d5deee;border-radius:14px;padding:12px}.v29pair p{margin:6px 0 0;line-height:1.4}
.v29steps{margin:0;padding-left:20px}.v29steps li{margin:0 0 8px;line-height:1.45}
.v29more{margin-top:8px}.v29more summary{cursor:pointer;font-weight:700;color:#0b3d91;padding:8px 0}
.v29who{border-radius:14px;padding:12px;margin:8px 0}.v29who b{display:block;margin-bottom:4px}.v29who p{margin:0;line-height:1.4}
.v29who.ja{background:#e7eefc;border:1px solid #c5d4f5}.v29who.ty{background:#e5f6ec;border:1px solid #b7e0c4}
.v29krok{font-weight:800;margin:8px 0 0}.v29nav{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.v29nav .btn{margin:0}.v29solo{display:block;width:100%;margin-top:8px;min-height:52px;border-radius:12px;border:1.5px solid #0b3d91;background:#fff;color:#0b3d91;font-weight:800;font-size:1.05em;cursor:pointer}
.v29solo.on{background:#14804a;color:#fff;border-color:#14804a}
.v29opt{display:block;width:100%;text-align:left;margin:8px 0;min-height:48px;border-radius:12px;border:1.5px solid #c9d3e3;background:#fff;padding:12px;font-weight:700;cursor:pointer}
.v29opt.ok{background:#e5f6ec;border-color:#14804a}.v29opt.bad{background:#fde8ea;border-color:#a32032}
.v29ok{color:#0d5c2e;font-weight:700}.v29bad{color:#8a1c1c;font-weight:700}.v29score{font-size:2em;font-weight:800;margin:4px 0}
.v29badge{font-weight:800;color:#0b3d91;font-size:1.15em;margin:0}
.v29doc{cursor:default}
.v29lead:focus-visible,.v29b:focus-visible,.v29opt:focus-visible,.v29solo:focus-visible,.v29kid:focus-visible,.v29lesson:focus-visible{outline:3px solid #14213d;outline-offset:3px}
body.senior .v29lead{padding:18px}body.senior .v29lead b{font-size:1.4em}body.senior .v29lead small{font-size:1.05em}
body.senior .v29card .btn,body.senior .v29opt,body.senior .v29solo,body.senior .v29nav .btn{min-height:64px;font-size:1.15em}
body.senior .v29card p,body.senior .v29steps li,body.senior .v29who p,body.senior .v29kid span{font-size:1.12em}
body.contrast .v29lead,body.contrast .v29kid,body.contrast .v29lesson,body.contrast .v29pair>div,body.contrast .v29who,body.contrast .v29opt,body.contrast .v29solo{background:#000;color:#fff;border-color:#fff}
body.contrast .v29lead b,body.contrast .v29kid b,body.contrast .v29lesson b,body.contrast .v29badge{color:#ffeb3b}
body.contrast .v29solo.on,body.contrast .v29opt.ok{background:#ffeb3b;color:#000}
@media print{
 .side,.foot,.nav,.notch,.v29noprint,.v29more{display:none!important}
 .stage{display:block;padding:0}.phone{width:auto;height:auto;border-radius:0;background:#fff;box-shadow:none;padding:0}
 .app{height:auto;overflow:visible;border-radius:0}.scroll{overflow:visible}
 .v29sheet{border:2px solid #14213d}
}
`;document.head.appendChild(st);
try{inject()}catch(e){}
route();
})();
