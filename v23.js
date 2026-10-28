// ===== v23: „Moje dokumenty nie znikną” + „Kto pyta o moje dane?” =====
// Koncepcja konkursowa. Stany dokumentów, żądania usług i raport są DEMO: nic nie wychodzi z przeglądarki.
// Przyczyny znikania i prawa portfela UE są opisane tylko tam, gdzie dało się je sprawdzić w gov.pl, regulaminie,
// rozporządzeniu (UE) 2024/1183 i materiałach Komisji Europejskiej. Reszta jest oznaczona jako możliwa przyczyna.
// Łańcuch asystenta (Gemma → reguły → Bielik) i pobieranie Bielika pozostają bez zmian.
(function(){
S.v23=S.v23||{restored:{},shares:[]};
if(!S.v23.restored)S.v23.restored={};
if(!Array.isArray(S.v23.shares))S.v23.shares=[];
const V=S.v23;
const DEMO='<span class="demo">DEMO</span>';
const PHONE='+48 42 253 54 74';
const MAIL='mobywatel-pomoc@coi.gov.pl';
const SRC={
 upd:['MC: zaloguj się do 5 sierpnia 2026 – aktualizacja certyfikatów','https://www.gov.pl/web/cyfryzacja/wazna-aktualizacja-w-mobywatelu-zaloguj-sie-do-aplikacji-do-5-sierpnia'],
 rok:['MC: certyfikat mDowodu jest ważny rok','https://www.gov.pl/web/cyfryzacja/korzystasz-z-mdowodu-w-telefonie-juz-rok-pamietaj-o-odnowieniu-swojego-profilu-mobywatel'],
 tel:['MC: zgubiony telefon z mObywatelem','https://www.gov.pl/web/cyfryzacja/zgubiony-telefon-z-aplikacja-mobywatel--co-zrobic-podpowiadamy'],
 pomoc:['MC: oficjalna pomoc (infolinia i e-mail COI)','https://www.gov.pl/web/cyfryzacja/ministerstwo-cyfryzacji-ostrzega-cyberprzestepcy-podszywaja-sie-pod-mobywatela'],
 zastrz:['MC: Zastrzeż dokument oraz zawieszenie e-dowodu','https://www.gov.pl/web/cyfryzacja/kpo-napedza-mobywatela-zgubiony-lub-skradziony-dokument-zastrzezesz-go-w-aplikacji-dzieki-srodkom-unijnym'],
 kontakt:['info.mobywatel.gov.pl – kontakt','https://info.mobywatel.gov.pl/kontakt'],
 reg:['Regulamin aplikacji mObywatel (załącznik na gov.pl)','https://www.gov.pl/attachment/a3f74ecd-21a7-4579-b3bc-24c2ea5164d2'],
 eidas:['Rozporządzenie (UE) 2024/1183 – EUR-Lex','https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32024R1183'],
 ke:['Komisja Europejska: European Digital Identity Wallet','https://digital-strategy.ec.europa.eu/en/factpages/european-digital-identity-wallet'],
 kefaq:['Komisja Europejska: pytania i odpowiedzi','https://digital-strategy.ec.europa.eu/en/faqs/qa-digital-identity'],
 kedash:['Komisja Europejska: standardy i pulpit prywatności','https://digital-strategy.ec.europa.eu/en/news/commission-adopts-technical-standards-cross-border-european-digital-identity-wallets'],
 gov:['MC: europejski portfel tożsamości cyfrowej w mObywatelu','https://www.gov.pl/web/cyfryzacja/europejski-portfel-tozsamosci-cyfrowej-zmierza-do-mobywatela']
};
const src=(...k)=>`<p class="v23src">Źródła: ${k.map(x=>SRC[x]?`<a href="${SRC[x][1]}" target="_blank" rel="noopener">${esc(SRC[x][0])}</a>`:'').filter(Boolean).join(' · ')}</p>`;
const ST={
 ok:{t:'Aktywny',c:'ok'},
 refresh:{t:'Wymaga odświeżenia',c:'warn'},
 soon:{t:'Wygasa wkrótce',c:'warn'},
 blocked:{t:'Zastrzeżony',c:'bad'},
 gone:{t:'Usunięty z urządzenia',c:'bad'},
 na:{t:'Nie dotyczy',c:'ok'}
};
let W=0,openId='';

function top(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/)[0]}
function sub(){return decodeURIComponent(location.hash.split('/')[2]||'')}
function persona(){return S.persona||'anna'}
function parent(){return persona()==='anna'}
function dkey(id){return persona()+'/'+id}
function restored(id){return V.restored[dkey(id)]||''}
function showDate(s){if(!s||s==='—')return 'brak daty w tym pokazie';const p=String(s).split('-');return p.length===3?p[2]+'.'+p[1]+'.'+p[0]:s}
function stamp(){const d=typeof today!=='undefined'?today:new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function offlineTxt(on){return on?'jest kopia do okazania offline':'brak aktualnej kopii offline'}
function uwagi(n){if(!n)return 'Dokumenty: wszystko w porządku';if(n===1)return 'Dokumenty: 1 wymaga uwagi';const a=n%10,b=n%100;if(a>=2&&a<=4&&!(b>=12&&b<=14))return 'Dokumenty: '+n+' wymagają uwagi';return 'Dokumenty: '+n+' wymaga uwagi'}

function adult(){
 const p=persona();
 const list=[
  {id:'dowod',name:'mDowód',st:'ok',refresh:'2026-10-18',offline:true,until:'ważny w pokazie'},
  {id:'pj',name:'Prawo jazdy',st:'ok',refresh:'2026-09-02',offline:true,until:'ważne w pokazie'},
  {id:'paszport',name:'Paszport',st:'ok',refresh:'2026-07-01',offline:true,until:'ważny w pokazie'},
  {id:'ekuz',name:'EKUZ',st:'ok',refresh:'2026-08-11',offline:true,until:'ważna w pokazie'}
 ];
 if(p==='anna'){
  Object.assign(list[0],{st:'soon',until:'15.01.2027'});
  Object.assign(list[2],{st:'refresh',refresh:'2025-09-30',offline:false,until:'2028-06-30 w danych pokazu'});
  list.push({id:'kdr',name:'Karta Dużej Rodziny',st:'gone',refresh:'',offline:false,until:'—'});
 }
 if(p==='halina')Object.assign(list[0],{st:'soon',refresh:'2026-08-01',until:'10.12.2026'});
 if(p==='piotr')Object.assign(list[2],{st:'gone',refresh:'',offline:false,until:'—'});
 if(p==='kuba')list.push({id:'leg',name:'Legitymacja studencka',st:'refresh',refresh:'2026-06-01',offline:false,until:'do ponownego dodania'});
 return list;
}
function kids(){
 if(!parent()||typeof KIDS==='undefined')return [];
 return [
  {id:'kid-jan-leg',kid:'jan',name:'mLegitymacja szkolna',who:'Jan, 8 lat',st:'ok',refresh:'2026-09-01',offline:true,until:'ważna w pokazie'},
  {id:'kid-jan-pasz',kid:'jan',name:'Paszport',who:'Jan, 8 lat',st:'ok',refresh:'2026-06-12',offline:true,until:'do 2030 w danych pokazu'},
  {id:'kid-zofia-brak',kid:'zofia',name:'Dokument tożsamości',who:'Zofia, 3 lata',st:'na',refresh:'',offline:false,until:'brak — w tym wieku nie ma dowodu',empty:true},
  {id:'kid-kuba-leg',kid:'kuba',name:'mLegitymacja szkolna',who:'Jakub, 16 lat',st:'refresh',refresh:'2025-08-20',offline:false,until:'do ponownego dodania'},
  {id:'kid-kuba-dowod',kid:'kuba',name:'Dowód osobisty',who:'Jakub, 16 lat',st:'ok',refresh:'2026-10-02',offline:true,until:'ważny w pokazie'}
 ];
}
function enrich(d){
 const copy=Object.assign({},d);
 const back=restored(d.id);
 if(d.id==='dowod'&&!d.kid&&S.blocked&&!back){copy.st='blocked';copy.offline=false}
 else if(back&&d.st!=='soon'&&d.st!=='na'){copy.st='ok';copy.refresh=back;copy.offline=true;copy.restored=true}
 else if(back&&d.st==='soon'){copy.refresh=back;copy.offline=true;copy.restored=true}
 if(copy.st==='na')copy.empty=true;
 return copy;
}
function mine(){return adult().map(enrich)}
function familyDocs(){return kids().map(enrich)}
function watch(){return mine().concat(familyDocs())}
function findDoc(id){return watch().find(d=>d.id===id)||null}
function problems(list){return (list||watch()).filter(d=>d.st==='refresh'||d.st==='soon'||d.st==='blocked'||d.st==='gone')}
function worst(list){const p=problems(list);if(p.some(d=>d.st==='gone'||d.st==='blocked'))return 'bad';if(p.length)return 'warn';return 'ok'}

const CAUSES=[
 {id:'phone',fact:true,t:'Nowy telefon, reinstalacja albo aktywacja na innym urządzeniu',
  b:'Aktywacja mObywatela na nowym telefonie unieważnia certyfikat na poprzednim. Dokumenty przestają być tam widoczne. Tak opisuje to Ministerstwo Cyfryzacji przy zgubionym telefonie. Hasła do aplikacji nie da się odtworzyć: trzeba aktywować ją ponownie. Przed oddaniem telefonu komuś innemu regulamin każe aplikację odinstalować.'},
 {id:'cert',fact:true,t:'Certyfikat wygasł, bo dawno nie było logowania',
  b:'Certyfikat mDowodu jest ważny rok. Profil mObywatel też nie dłużej niż rok i nie dłużej niż sam mDowód. 27.07.2026 Ministerstwo podało termin 5.08.2026: do tego dnia wystarczyło się zalogować, żeby certyfikaty dokumentów odświeżyły się same. Po terminie mDowód i dokument ochrony czasowej wymagają ponownego potwierdzenia tożsamości (e-dowód, profil zaufany albo bankowość elektroniczna). Inne dokumenty odświeża się w ich szczegółach. Legitymacja studencka może potrzebować nowego kodu QR z dziekanatu, a legitymacja szkolna w mObywatelu Junior — nowego kodu z Zintegrowanej Platformy Edukacyjnej.'},
 {id:'block',fact:true,t:'Zastrzeżenie albo zawieszenie',
  b:'Usługa „Zastrzeż dokument” obejmuje dowód osobisty, paszport i prawo jazdy. Zgłoszenie trafia do Systemu Dokumenty Zastrzeżone Związku Banków Polskich. Zawieszenie e-dowodu trafia do Rejestru Dowodów Osobistych: przez 14 dni można je cofnąć, potem dokument jest unieważniany. Ministerstwo nie pisze, że zastrzeżenie kasuje kafelek w telefonie. W tym pokazie taki dokument widać jako zastrzeżony. Cofnięcie zastrzeżenia zrobionego w aplikacji robi się w aplikacji. Zastrzeżenie z banku cofa się w tym banku.'},
 {id:'registry',fact:false,t:'Zmiana danych w rejestrze albo nowy dokument',
  b:'Możliwa przyczyna, nie fakt automatycznego kasowania. Gdy urząd wyda nowy dowód, unieważni stary albo zmieni dane (na przykład nazwisko), stary dokument w telefonie może przestać pasować do rejestru. Trzeba wtedy dodać aktualny. Nie znalazłem komunikatu Ministerstwa, który mówi, że sama zmiana danych — bez końca certyfikatu — po cichu usuwa dokument z aplikacji.'},
 {id:'net',fact:false,t:'Długi brak internetu',
  b:'Aktualizacja danych wymaga internetu, a pobrane dane leżą na telefonie zaszyfrowane. Tak jest w regulaminie. Brak sieci nie jest tam opisany jako powód zniknięcia dokumentu. Jest przeszkodą w odświeżeniu. Kopia zostaje na urządzeniu, dopóki certyfikat i dokument są ważne. Nie podaję liczby godzin działania offline: nie znalazłem jednej takiej liczby w regulaminie.'}
];
function causeIds(d){
 if(!d)return ['phone','cert','block','registry','net'];
 if(d.empty)return [];
 if(d.st==='blocked')return ['block'];
 if(d.st==='gone')return ['phone','cert','registry'];
 if(d.st==='refresh')return d.id==='leg'||d.id==='kid-kuba-leg'?['cert','net']:['cert','net','registry'];
 if(d.st==='soon')return ['cert'];
 return ['phone','cert','block','registry','net'];
}
function causeHTML(ids){
 return CAUSES.filter(c=>ids.includes(c.id)).map(c=>`<div class="v23cause"><b>${c.fact?'Potwierdzone':'Możliwa przyczyna'}</b><span>${esc(c.t)}</span><p>${esc(c.b)}</p></div>`).join('');
}
function stepsFor(d){
 if(d.empty)return [{h:'To nie jest awaria',p:'Dziecko w tym wieku nie ma dowodu osobistego. W pokazie nie ma też czego przywracać. Gdy dokument się pojawi (legitymacja szkolna), dodasz go kodem z szkoły albo z Zintegrowanej Platformy Edukacyjnej — tak MC opisuje legitymację w mObywatelu Junior.'}];
 if(d.st==='blocked')return [
  {h:'To zastrzeżenie, nie błąd aplikacji',p:'Dokument jest oznaczony jako zastrzeżony, bo w tym pokazie użyto ścieżki „zgubiony portfel”. Instytucje podłączone do Systemu Dokumenty Zastrzeżone nie powinny go przyjąć.'},
  {h:'Dokument się znalazł',p:'Jeśli zastrzeżenie zrobiłaś lub zrobiłeś w aplikacji i dokument nie został użyty przez kogoś innego, cofniesz je w aplikacji. Zastrzeżenie złożone w banku cofa się w tym banku, nie tutaj.'},
  {h:'E-dowód zawieszony na 14 dni',p:'Zawieszenie e-dowodu w Rejestrze Dowodów Osobistych cofniesz w tym czasie. Po 14 dniach dokument jest unieważniany i trzeba wyrobić nowy. W tym pokazie przycisk tylko zdejmuje oznaczenie DEMO.'}
 ];
 if(d.st==='gone')return [
  {h:'Nie szukaj dokumentu w koszu',p:'Aktywacja na innym telefonie gasi certyfikat na poprzednim. Reinstalacja bez ponownego dodania dokumentu daje ten sam skutek: kafelka nie ma, bo nie ma już certyfikatu albo dokumentu nie dodano drugi raz.'},
  {h:'Zainstaluj aplikację z oficjalnego sklepu',p:'Tylko Sklep Play albo App Store. Nie z linku w SMS-ie. Ministerstwo przypomina, że pracownicy COI nie piszą pierwsi i nie proszą o hasło, kod BLIK ani skan dowodu.'},
  {h:'Aktywuj i potwierdź tożsamość',p:'Przy mDowodzie i dokumencie ochrony czasowej, gdy certyfikat już wygasł, MC każe potwierdzić tożsamość e-dowodem, profilem zaufanym albo bankowością elektroniczną. Aktywacja na tym telefonie unieważnia certyfikat na starym.'},
  {h:'Dodaj dokument jeszcze raz',p:d.id==='leg'?'Legitymacja studencka: pobierz nowy kod QR w dziekanacie i dodaj dokument od nowa. Tak opisuje to MC przy aktualizacji certyfikatów.':d.id==='kid-kuba-leg'?'Legitymacja szkolna w mObywatelu Junior: nowy kod QR z Zintegrowanej Platformy Edukacyjnej, potem ponowne dodanie. Jakub ma 16 lat — czy korzysta z wersji Junior, ten pokaz tego nie rozstrzyga.':'Wejdź w dokumenty i dodaj ten, którego brakuje. Przycisk poniżej tylko symuluje, że dokument wrócił na to urządzenie.'}
 ];
 if(d.st==='refresh')return [
  {h:'Połącz się z internetem i zaloguj',p:'Często wystarczy logowanie. Przy aktualizacji z 2026 r. MC pisało, że certyfikaty odświeżają się same, a komunikat na ekranie jest tylko informacją.'},
  {h:'Jeśli to mDowód po terminie certyfikatu',p:'Potwierdź tożsamość jeszcze raz: e-dowód, profil zaufany albo bank. Inny dokument odśwież w jego szczegółach, ręcznie.'},
  {h:'Legitymacja ma inną ścieżkę',p:d.id==='leg'?'Studencka: nowy kod QR z dziekanatu, jeśli aplikacja o to prosi.':d.id==='kid-kuba-leg'?'Szkolna w mObywatelu Junior: nowy kod QR z Zintegrowanej Platformy Edukacyjnej.':'Tego dokumentu zwykle nie odnawia się kodem z dziekanatu. Zostaw tę ścieżkę legitymacjom.'}
 ];
 if(d.st==='soon')return [
  {h:'Kończy się data ważności',p:'W danych tego pokazu dokument jest blisko końca ważności ('+d.until+'). Kopia w telefonie nie przedłuża plastikowego dokumentu.'},
  {h:'Złóż wniosek o nowy',p:'Nowy dowód osobisty załatwisz w istniejącej ścieżce wniosku. Do wydania nowego okazujesz aktualny, o ile certyfikat w aplikacji jest ważny.'},
  {h:'Odśwież kopię, jeśli dawno jej nie było',p:'Logowanie online odświeża certyfikat. Przycisk DEMO oznacza tylko, że kopia w pokazie została odświeżona. Data ważności plastikowego dokumentu zostaje.'}
 ];
 return [
  {h:'Wygląda na aktywny',p:'W tym pokazie dokument ma świeże odświeżenie i kopię offline. To nie jest odczyt z rejestru państwowego.'},
  {h:'Gdy zniknie bez komunikatu',p:'Najpierw sprawdź: czy to ten sam telefon, czy da się zalogować online i czy dokument nie jest zastrzeżony. Przyczyny są niżej, z odesłaniem do źródeł.'}
 ];
}
function helpBox(){return `<div class="v23help"><b>Prawdziwa pomoc, poza tym pokazem</b><p>Infolinia <a href="tel:+48422535474">${PHONE}</a> oraz <a href="mailto:${MAIL}">${MAIL}</a>. Komunikat MC z 2.12.2025: pracownicy COI są dostępni w dni robocze 7:00–18:00 i nie kontaktują się pierwsi. Ten sam numer regulamin podaje do unieważnienia certyfikatu po utracie telefonu; w tekście regulaminu linia do unieważnienia certyfikatu jest opisana jako całodobowa. Godziny sprawdź przed dzwonieniem.</p><p>Nie wysyłaj hasła, kodu BLIK, PESEL-u ani skanu dowodu.</p></div>`}

function rowDoc(d){
 const st=ST[d.st]||ST.ok;
 const who=d.who?`<small>${esc(d.who)}</small>`:'';
 return `<a class="v23doc ${st.c}" href="#/stan-dokumentu/${encodeURIComponent(d.id)}"><span><b>${esc(d.name)}</b>${who}<small>Odświeżenie: ${esc(showDate(d.refresh))} · ${esc(offlineTxt(d.offline))}</small></span><em>${esc(st.t)}</em></a>`;
}
function pill(id){
 const list=watch(),n=problems(list).length,lv=worst(list);
 return `<a id="${id}" class="v23pill ${lv}" href="#/zdrowie-dokumentow"><i aria-hidden="true"></i>${esc(uwagi(n))}</a>`;
}

function zdrowie(){
 const my=mine(),fam=familyDocs(),bad=problems(watch());
 shell('Moje dokumenty nie znikną',`
  <div class="alert b">🩺<div><b>Stan dokumentów w tym telefonie.</b> Dane są fikcyjne ${DEMO}. Nic nie jest pobierane z rejestru i nic nie jest wysyłane.</div></div>
  <p class="v23lead">${esc(uwagi(bad.length))}. Data pokazu w prototypie: 23.10.2026.</p>
  <div class="v23list">${my.map(rowDoc).join('')}</div>
  ${parent()?`<h3 class="v23h">Dokumenty dzieci</h3><p class="muted">Rodzic (Anna w tym pokazie) widzi stan dokumentów dzieci. Przełącznik osoby na górze zmienia konto. To nie jest wgląd w prawdziwy rejestr.</p><div class="v23list">${fam.map(rowDoc).join('')}</div>`:`<p class="muted">Konta z dziećmi w tym pokazie ma Anna. Przełącz osobę, żeby zobaczyć ten widok jako rodzic.</p>`}
  <a class="btn" href="#/raport-problemu">Przygotuj raport problemu ${DEMO}</a>
  <a class="btn sec" href="#/flow/wallet">Zgubiłem plastikowy dokument — zastrzeż</a>
  <details class="v23more"><summary>Dlaczego dokument może zniknąć z aplikacji</summary>${causeHTML(['phone','cert','block','registry','net'])}${src('upd','rok','tel','zastrz','reg')}</details>
  ${helpBox()}`,{tab:'wallet'});
}

function stan(){
 const id=sub();
 if(openId!==id){openId=id;W=0}
 const d=findDoc(id);
 if(!d){shell('Nie ma takiego dokumentu',`<p>W tym pokazie nie ma dokumentu o tym identyfikatorze.</p><a class="btn" href="#/zdrowie-dokumentow">Wróć do stanu dokumentów</a>`,{tab:'wallet'});return}
 const st=ST[d.st]||ST.ok;
 const steps=stepsFor(d);
 W=Math.max(0,Math.min(W,steps.length-1));
 const cur=steps[W];
 window.v23CurStep=cur.h+'. '+cur.p;
 const list=steps.map((s,i)=>`<li class="${i===W?'on':''}"><span>${i+1}</span><div><b>${esc(s.h)}</b><p>${esc(s.p)}</p></div></li>`).join('');
 const last=W>=steps.length-1;
 const label=d.st==='blocked'?'Cofnij zastrzeżenie (DEMO)':d.st==='soon'?'Odśwież kopię w aplikacji (DEMO)':'Przywróć (DEMO)';
 const showBtn=!d.empty&&(!S.senior||last);
 shell(d.name,`
  <div class="alert ${st.c==='bad'?'r':st.c==='warn'?'y':'g'}">${st.c==='ok'?'✅':st.c==='warn'?'⚠️':'⛔'}<div><b>${esc(st.t)}</b> ${DEMO}${d.who?' · '+esc(d.who):''}<br><span class="muted">Ostatnie odświeżenie: ${esc(showDate(d.refresh))}. ${esc(offlineTxt(d.offline))}. Ważność w pokazie: ${esc(d.until)}.</span>${d.restored?'<br><b>W tym pokazie jest już oznaczenie „przywrócono”.</b>':''}</div></div>
  ${S.senior?'<p class="v23lead">Duże kroki. Jeden na raz. '+ (W+1)+' z '+steps.length+'.</p>':''}
  <ol class="v23steps">${list}</ol>
  ${S.senior?`<div class="v23nav"><button type="button" class="btn sec" onclick="v23Step(-1)" ${W<=0?'disabled':''}>Wstecz</button><button type="button" class="btn sec" onclick="v23Step(1)" ${last?'disabled':''}>Dalej</button></div><button type="button" class="btn ghost" onclick="v23Speak()">Przeczytaj ten krok</button>`:''}
  ${showBtn?`<button type="button" class="btn" onclick="v23Restore('${esc(d.id)}')">${label}</button>`:''}
  ${d.id==='dowod'||d.st==='soon'?`<a class="btn sec" href="#/flow/dowod">Wniosek o nowy dowód</a>`:''}
  ${d.st==='blocked'?`<a class="btn sec" href="#/flow/wallet">Ścieżka zastrzeżenia dokumentu</a>`:''}
  <h3 class="v23h">Skąd się to bierze</h3>
  ${causeHTML(causeIds(d))}
  <a class="btn ghost" href="#/raport-problemu/${encodeURIComponent(d.id)}">Raport problemu dla pomocy ${DEMO}</a>
  <a class="btn ghost" href="#/kto-pyta">Kto pyta o moje dane</a>
  ${src('upd','rok','tel','zastrz','pomoc','reg')}`,{tab:'wallet'});
}
window.v23Step=function(d){W+=d;stan()};
window.v23Speak=function(){try{speak(window.v23CurStep||'')}catch(e){}};
window.v23Restore=function(id){
 const d=findDoc(id);if(!d||d.empty)return;
 const go=()=>{
  V.restored[dkey(id)]=stamp();
  if(id==='dowod'&&S.blocked)S.blocked=false;
  save();
  toast(d.st==='soon'
   ?'Symulacja: kopia w aplikacji odświeżona. Data ważności plastikowego dokumentu się nie zmienia. Nic nie zostało wysłane.'
   :'Symulacja: dokument oznaczony jako przywrócony na tym urządzeniu. Nic nie zostało wysłane do rejestru.');
  location.hash='#/zdrowie-dokumentow';
 };
 if(window.v19Pin)v19Pin(d.st==='blocked'?'Cofnięcie zastrzeżenia (DEMO)':'Przywrócenie dokumentu (DEMO)',go);else go();
};

function strip(s){s=String(s||'');
 s=s.replace(/\b\d{11}\b/g,'[liczba 11 cyfr usunięta]');
 s=s.replace(/\b[A-Z]{3}\s?\d{6}\b/g,'[nr dokumentu usunięty]');
 s=s.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,m=>m.toLowerCase()===MAIL?'[adres pomocy]':'[e-mail usunięty]');
 return s}
function techHead(){
 let ua='';try{ua=navigator.userAgent||''}catch(e){}
 const bits=[
  'RAPORT PROBLEMU – prototyp koncepcyjny, nieoficjalny',
  'Oznaczenie: DEMO. Ten plik powstał na urządzeniu. Aplikacja go nie wysyła.',
  'Czas lokalny: '+(new Date().toISOString()),
  'Ekran: '+(screen&&screen.width?screen.width+'×'+screen.height:'nieznany'),
  'Język przeglądarki: '+(navigator.language||''),
  'Połączenie z siecią wg przeglądarki: '+(navigator.onLine?'tak':'nie'),
  'Ciąg przeglądarki (skrócony): '+strip(ua).slice(0,160)
 ];
 return bits.join('\n')}
function reportBody(list){
 const lines=list.map(d=>{
  const st=ST[d.st]||ST.ok;
  return [
   '—',
   'Rodzaj: '+(d.kid?'dokument dziecka · ':'')+d.name,
   'Stan: '+st.t,
   'Ostatnie odświeżenie: '+showDate(d.refresh),
   'Kopia offline: '+(d.offline?'tak':'nie'),
   'Ważność w pokazie: '+d.until
  ].join('\n')}).join('\n');
 return strip(techHead()+'\n'+lines+'\n—\nBez imienia, nazwiska, PESEL-u, adresu i numeru dokumentu.');
}
function raport(){
 const id=sub();
 const one=id?findDoc(id):null;
 const missing=!!(id&&!one);
 const list=one?[one]:(problems(watch()).length?problems(watch()):mine().slice(0,1));
 const text=reportBody(list);
 const no='DEMO-DOK-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+String((crypto.getRandomValues(new Uint32Array(1))[0]%9000)+1000);
 const mail='mailto:'+MAIL+'?subject='+encodeURIComponent(no)+'&body='+encodeURIComponent(text.slice(0,1800));
 shell('Raport problemu',`
  <div class="alert y">🧪<div><b>Nic nie jest wysyłane.</b> Poniżej są dane techniczne, bez danych osobowych. Numer ${esc(no)} istnieje tylko na tym ekranie.</div></div>
  ${missing?'<p class="muted">Nie ma dokumentu o tym identyfikatorze. Raport obejmuje te, które wymagają uwagi.</p>':''}
  <textarea id="v23rep" readonly rows="14">${esc(text)}</textarea>
  <button type="button" class="btn" onclick="v23Copy()">Kopiuj raport ${DEMO}</button>
  <a class="btn sec" href="${mail}">Otwórz e-mail do COI</a>
  <a class="btn sec" href="tel:+48422535474">Zadzwoń na infolinię ${PHONE}</a>
  <p class="muted">E-mail i telefon otwierają się dopiero po dotknięciu. Aplikacja sama nie wysyła zgłoszenia. Nie dopisuj hasła ani skanu dowodu.</p>
  ${helpBox()}${src('pomoc','kontakt','reg')}`,{tab:'wallet'});
}
window.v23Copy=function(){
 const t=(document.getElementById('v23rep')||{}).value||'';
 const done=()=>toast('Skopiowano na tym urządzeniu. Nic nie zostało wysłane.');
 if(navigator.clipboard&&t)navigator.clipboard.writeText(t).then(done,()=>toast('Nie udało się skopiować. Zaznacz tekst ręcznie. Nic nie zostało wysłane.'));
 else toast('Zaznacz tekst ręcznie. Nic nie zostało wysłane.');
};

const SCEN={
 sklep:{ic:'🛒',t:'Sklep internetowy',who:'Księgarnia „DEMO-Książka” sp. z o.o.',goal:'Sprzedaż gry z oznaczeniem 18+ i dostawa albo odbiór w punkcie.',
  fields:[
   {id:'adult',label:'Pełnoletni: tak',need:true,hint:'Tyle wystarczy do bramki wieku. Daty urodzenia tu nie ma.'},
   {id:'name',label:'Imię i nazwisko',need:true,hint:'Potrzebne, żeby opisać przesyłkę albo odbiór.'},
   {id:'city',label:'Miasto',need:true,hint:'Propozycja zamiast pełnego adresu, gdy odbierasz w punkcie.'},
   {id:'addr',label:'Pełny adres zamieszkania',need:false,hint:'Nadmiarowe przy odbiorze w punkcie. Zaznacz tylko, gdy kurier ma jechać pod wskazany adres.'},
   {id:'dob',label:'Data urodzenia',need:false,hint:'Nadmiarowe. Zamiast daty zostaw „pełnoletni: tak”.'},
   {id:'pesel',label:'PESEL',need:false,hint:'Nadmiarowe przy zakupie gry. Sklep nie jest urzędem ani bankiem.'}
  ]},
 bank:{ic:'🏦',t:'Bank',who:'Bank DEMO S.A.',goal:'Wniosek o konto. Bank identyfikuje klienta przy umowie.',
  fields:[
   {id:'name',label:'Imię i nazwisko',need:true,hint:'Dane strony umowy.'},
   {id:'pesel',label:'PESEL',need:true,hint:'Przy rachunku bank zwykle identyfikuje osobę. To nie jest opinia, czy w tej konkretnej umowie PESEL jest obowiązkowy.'},
   {id:'doc',label:'Seria i numer dowodu',need:true,hint:'Potwierdzenie dokumentu. W pokazie numer nie jest pokazywany ani zapisywany.'},
   {id:'addr',label:'Adres zameldowania',need:true,hint:'Często jest w umowie. Jeśli bank ma go z rejestru, nie wpisuj go drugi raz.'},
   {id:'dob',label:'Data urodzenia',need:false,hint:'Nadmiarowe, gdy podajesz już PESEL. Data jest w tym numerze.'},
   {id:'photo',label:'Zdjęcie z dowodu',need:false,hint:'Nadmiarowe, gdy tożsamość potwierdzasz profilem mObywatel albo e-dowodem.'}
  ]},
 hotel:{ic:'🏨',t:'Hotel',who:'Hotel DEMO „Wisła”',goal:'Meldunek na jedną noc.',
  fields:[
   {id:'name',label:'Imię i nazwisko',need:true,hint:'Ewidencja gościa.'},
   {id:'nat',label:'Obywatelstwo',need:true,hint:'Typowe przy meldunku.'},
   {id:'doc',label:'Rodzaj i numer dokumentu',need:true,hint:'Zwykle wystarczy dokument, nie cały odpis danych.'},
   {id:'city',label:'Kraj i miasto',need:true,hint:'Propozycja zamiast pełnego adresu.'},
   {id:'addr',label:'Pełny adres zamieszkania',need:false,hint:'Nadmiarowe, jeśli hotelowi wystarczy kraj i miasto.'},
   {id:'dob',label:'Data urodzenia',need:false,hint:'Hotele często ją zbierają. Nie sprawdzałem, czy ten meldunek musi mieć datę, dlatego w pokazie pole jest nadmiarowe i możesz je odznaczyć.'},
   {id:'pesel',label:'PESEL',need:false,hint:'Nadmiarowe, jeśli hotel ma już numer dokumentu.'}
  ]},
 przychodnia:{ic:'🩺',t:'Przychodnia',who:'Przychodnia POZ „Mokotów” (DEMO)',goal:'Potwierdzenie, kim jesteś, na dzisiejszą wizytę. Bez historii leczenia.',
  fields:[
   {id:'name',label:'Imię i nazwisko',need:true,hint:'Identyfikacja pacjenta.'},
   {id:'pesel',label:'PESEL',need:true,hint:'Prawo do świadczeń NFZ jest u nas wiązane z PESEL. W pokazie wartość PESEL nie jest zapisywana.'},
   {id:'city',label:'Miasto',need:true,hint:'Zamiast pełnego adresu, gdy przychodnia już go ma w dokumentacji.'},
   {id:'addr',label:'Pełny adres',need:false,hint:'Nadmiarowe, gdy adres jest już w karcie pacjenta.'},
   {id:'dob',label:'Data urodzenia',need:false,hint:'Nadmiarowe obok PESEL.'},
   {id:'hist',label:'Historia chorób, leki, wyniki',need:false,hint:'Nadmiarowe na samą rejestrację. Zakres medyczny udostępniasz osobno, na 24 godziny, i możesz go cofnąć.'}
  ]}
};
function fieldBox(f){
 return `<label class="v23f ${f.need?'need':'extra'}"><input type="checkbox" data-id="${f.id}" ${f.need?'checked disabled':'checked'}><span><b>${esc(f.label)}</b> <i>${f.need?'Potrzebne':'Nadmiarowe'}</i><small>${esc(f.hint)}</small></span></label>`;
}
function kto(){
 shell('Kto pyta o moje dane?',`
  <div class="alert b">👁️<div><b>Zanim cokolwiek udostępnisz, widzisz żądanie.</b> Scenariusze są fikcyjne ${DEMO}. Wartości pól (PESEL, adres, data) nie są pokazywane ani zapisywane.</div></div>
  <div class="v23grid">${Object.entries(SCEN).map(([k,s])=>`<a class="v23scen" href="#/zadanie/${k}"><b>${s.ic} ${esc(s.t)}</b><small>${esc(s.who)}</small></a>`).join('')}</div>
  <a class="v23qr" href="#/sprawdz-dokument"><b>Okazanie na miejscu → weryfikator QR</b><small>Gdy ktoś stoi obok, nie wysyłaj danych w formularz. Użyj istniejącego weryfikatora z kodem QR.</small></a>
  <a class="btn ghost" href="#/disclose">Pokaż tylko wybrane dane (kod)</a>
  <a class="btn ghost" href="#/privacy">Rejestr: kto już dostał dane</a>
  <a class="btn sec" href="#/prawa-portfela">Twoje prawa przy portfelu europejskim</a>
  <p class="muted">Weryfikator QR z warstwy „Prawdziwy czy podróbka?” zostaje osobno. Tu jest żądanie usługi online, zanim naciśniesz „udostępnij”.</p>`,{tab:'more'});
}
function lastFor(kind){return (V.shares||[]).filter(x=>x.kind===kind&&x.persona===persona())[0]||null}
function zadanie(){
 const key=sub(),sc=SCEN[key];
 if(!sc){shell('Nie ma takiego żądania',`<p>Wybierz usługę z listy.</p><a class="btn" href="#/kto-pyta">Wróć</a>`,{tab:'more'});return}
 const prev=lastFor(key);
 const banner=prev?`<div class="alert ${prev.refused?'y':'g'}">${prev.refused?'⛔':'✅'}<div><b>${prev.refused?'Odmowa zapisana':'Udostępnienie zapisane'} w rejestrze (DEMO).</b> ${prev.revoked?'Zgoda jest już cofnięta.':''} <a href="#/privacy">Otwórz rejestr</a></div></div>`:'';
 shell('Karta żądania',`
  ${banner}
  <div class="alert b">${sc.ic}<div><b>${esc(sc.who)}</b><br>${esc(sc.goal)} ${DEMO}</div></div>
  <p class="muted">Pola nadmiarowe są na początku zaznaczone, bo tak prosi usługa. Odznacz je albo użyj jednego przycisku. Pól „potrzebne” nie odznaczysz osobno — jeśli ich nie chcesz, odmów całości.</p>
  <div class="v23fields">${sc.fields.map(fieldBox).join('')}</div>
  <button type="button" class="btn sec" onclick="v23Uncheck()">Odznacz nadmiarowe</button>
  <button type="button" class="btn" onclick="v23Decide(1)">Udostępnij zaznaczone ${DEMO}</button>
  <button type="button" class="btn ghost" onclick="v23Decide(0)">Odmów</button>
  <a class="v23qr" href="#/sprawdz-dokument"><b>Okazanie na miejscu → weryfikator QR</b><small>Selektywne ujawnianie przy ladzie jest w istniejącym weryfikatorze, nie tutaj.</small></a>
  ${key==='przychodnia'?'<a class="btn ghost" href="#/zdrowie">Zakres medyczny na 24 h — osobna zgoda</a>':''}
  <p class="v23src">Podstawa rozróżnienia pól: art. 5b ust. 3 rozporządzenia (UE) 2024/1183 (strona ufająca nie żąda innych danych niż zgłoszone) oraz motyw 56 (żądanie ma być niezbędne i proporcjonalne). Ocena „potrzebne / nadmiarowe” w tych czterech scenach jest poglądowa ${DEMO}, nie opinią prawną.</p>`,{tab:'more'});
}
window.v23Uncheck=function(){document.querySelectorAll('.v23f.extra input').forEach(i=>{i.checked=false})};
function commitShare(sc,key,ok,ids){
 const fields=sc.fields.filter(f=>ids.includes(f.id)&&f.id!=='hist').map(f=>({id:f.id,label:f.label,need:!!f.need}));
 const rec={
  id:'s'+Date.now().toString(36),
  at:new Date().toISOString(),
  persona:persona(),
  kind:key,
  who:sc.who,
  goal:sc.goal,
  fields,
  med:ids.includes('hist'),
  refused:!ok,
  revoked:null,
  flagged:false
 };
 V.shares.unshift(rec);
 V.shares=V.shares.slice(0,30);
 save();
 toast(ok?'Symulacja: udostępnienie zapisane w rejestrze na tym urządzeniu. Nic nie zostało wysłane.':'Symulacja: odmowa zapisana. Żadne pole nie zostało przekazane.');
 zadanie();
}
window.v23Decide=function(ok){
 const key=sub(),sc=SCEN[key];if(!sc)return;
 const ids=[...document.querySelectorAll('.v23f input')].filter(i=>i.checked).map(i=>i.dataset.id);
 if(ok&&!ids.length)return toast('Nie zaznaczono żadnego pola. Możesz odmówić.');
 const go=()=>commitShare(sc,key,!!ok,ids);
 if(ok&&window.v19Pin)v19Pin('Udostępnienie danych usłudze (DEMO)',go);else go();
};

function prawa(){
 shell('Twoje prawa',`
  <div class="alert b">🇪🇺<div><b>Europejski portfel tożsamości.</b> Poniżej są tylko zdania, które da się oprzeć na rozporządzeniu (UE) 2024/1183, stronach Komisji i gov.pl. To nie jest porada prawna.</div></div>
  <div class="v23right"><b>Korzystanie jest dobrowolne</b><p>Art. 5a ust. 15: z portfela nie trzeba korzystać. Brak portfela nie może utrudniać dostępu do usług publicznych i prywatnych, pracy ani działalności. Zostają inne sposoby identyfikacji. Komisja pisze to samo: portfel ma być opcjonalny, bez obowiązku używania.</p></div>
  <div class="v23right"><b>Część usług ma go przyjąć, gdy sam zechcesz</b><p>Art. 5f: podmioty publiczne oraz część podmiotów prywatnych, które i tak muszą silnie uwierzytelniać użytkownika, akceptują portfel — ale na dobrowolne żądanie użytkownika. To obowiązek usługi, nie obowiązek człowieka. Obawa, że portfel będzie „dobrowolny tylko na papierze”, jest głosem z dyskusji. Przepis rozdziela te dwie rzeczy i tego rozróżnienia nie wolno zacierać.</p></div>
  <div class="v23right"><b>Tylko to, co potrzebne</b><p>Art. 5a ust. 4 lit. a wymaga możliwości selektywnego ujawnienia danych. Art. 5b ust. 2 lit. c i ust. 3: strona ufająca rejestruje, jakich danych zamierza żądać i po co, i nie żąda innych. Motyw 56: żądanie ma być niezbędne, proporcjonalne i zgodne z minimalizacją, a użytkownik ma widzieć, co i w jakim celu jest udostępniane. Art. 5b ust. 8: strona przedstawia się użytkownikowi.</p></div>
  <div class="v23right"><b>Wgląd w historię i cofnięcie</b><p>Art. 5a ust. 4 lit. d: w portfelu jest dziennik transakcji (wspólny pulpit). Widać strony, z którymi było połączenie, i wymienione dane. Da się łatwo żądać usunięcia danych u strony ufającej (art. 17 RODO) i zgłosić ją do organu ochrony danych. Motyw 13: pulpit jest włączony domyślnie, a historia obejmuje także transakcję, która nie doszła do skutku. Komisja opisuje ten pulpit jako element standardów portfela.</p></div>
  <div class="v23right"><b>Kontrola po stronie człowieka</b><p>Art. 5a ust. 14: użytkownik ma pełną kontrolę nad użyciem portfela i nad danymi w nim. Dostawca nie zbiera informacji o użyciu ponad to, co potrzebne do świadczenia usługi portfela, i nie łączy tych danych z innymi swoimi usługami, chyba że użytkownik wyraźnie poprosi. Potwierdzenie operacji ma być świadome (motyw 31).</p></div>
  <div class="v23right"><b>Co z Polski, stan na komunikat MC</b><p>Ministerstwo Cyfryzacji zapowiada pilotaż portfela w aplikacji mObywatel. Do skorzystania z pilotażu potrzebny jest dowód z warstwą elektroniczną. Wiek ma dać się potwierdzić bez innych danych osobowych (selektywne przekazanie atrybutu). MC pisze, że kraje Unii powinny udostępnić portfel z końcem 2026 r. i że po pilotażu funkcja ma wejść do mObywatela. To zapowiedź, nie informacja, że portfel już działa produkcyjnie w tej aplikacji.</p></div>
  <a class="btn sec" href="#/kto-pyta">Zobacz kartę żądania (DEMO)</a>
  <a class="btn ghost" href="#/privacy">Rejestr udostępnień w tym prototypie</a>
  ${src('eidas','ke','kefaq','kedash','gov')}`,{tab:'more'});
}

function accHTML(){
 const rows=(V.shares||[]).filter(x=>x.persona===persona());
 const body=rows.length?rows.map(x=>{
  const d=x.at.slice(0,10).split('-');
  const when=d[2]+'.'+d[1];
  const what=x.refused?'odmowa — nic nie przekazano':(x.fields.map(f=>f.label).join(', ')||'brak pól')+(x.med?' · historię leczenia odesłano do zgody na 24 h, treści nie zapisano':'');
  const extra=x.fields.some(f=>!f.need)?' · były pola nadmiarowe':'';
  const tail=x.revoked?'<span class="v18demo">zgoda cofnięta (DEMO)</span>':`<button type="button" class="btn ghost small" onclick="v23Revoke('${esc(x.id)}')">Cofnij zgodę</button>`;
  const flag=x.flagged?'<span class="v18demo">zgłoszono (DEMO)</span>':`<button type="button" class="btn ghost small" onclick="v23Flag('${esc(x.id)}')">Zgłoś organowi</button>`;
  return `<div class="v19log"><div><b>${when}</b> – <b>${esc(x.who)}</b><br><span class="muted">${esc(x.goal)}</span><br><span class="muted">${esc(what+extra)}</span></div><div class="v23acts">${x.refused?'':tail}${flag}</div></div>`;
 }).join(''):'<p class="muted">Brak wpisów z karty „Kto pyta” dla tej osoby. Odmowa też zostanie tu zapisana — rozporządzenie każe pamiętać również transakcję, która nie doszła do skutku (motyw 13). To cytat wymogu, a wpis i tak zostaje tylko na tym urządzeniu.</p>';
 return `<div id="v23acc" class="card"><h3>Udostępnienia z „Kto pyta o moje dane?” ${DEMO}</h3><p class="muted">Dopisek do rejestru z warstwy „Kto sprawdzał moje dane”. Wartości pól nie są przechowywane. Cofnięcie i zgłoszenie do organu są symulacją — nic nie wychodzi z przeglądarki.</p>${body}<a href="#/kto-pyta">Nowe żądanie</a> · <a href="#/prawa-portfela">Twoje prawa</a></div>`;
}
window.v23Revoke=function(id){
 const go=()=>{const s=(V.shares||[]).find(x=>x.id===id);if(s)s.revoked=new Date().toISOString();save();toast('Symulacja: zgoda cofnięta na tym urządzeniu. Nic nie zostało wysłane do usługi.');route()};
 if(window.v19Pin)v19Pin('Cofnięcie zgody (DEMO)',go);else go();
};
window.v23Flag=function(id){
 const s=(V.shares||[]).find(x=>x.id===id);if(!s)return;
 s.flagged=true;save();toast('Symulacja: zgłoszenie do organu ochrony danych przygotowane. Nic nie zostało wysłane.');route();
};

const GONE=/znikn\w+|nie widze .{0,30}(dowod|dokument|mdowod|paszport|prawo jazdy)|nie ma .{0,20}(dowod|dokument|mdowod)|dokument\w{0,3} (znik|przepad)|dowod (znik|przepad)|certyfikat (wygas|mdowod)|nowy telefon|wymienil\w* telefon|przeinstal|reinstal|odinstalow|dokumenty nie znik/;
function v23Rule(q){
 const l=norm(q);if(!l)return null;
 if(/(zgubil\w*|ukrad\w*|kradziez|portfel)/.test(l)&&!/(znikn|nie widze|nowy telefon|przeinstal|reinstal|europej|eudi|eidas|tozsamos)/.test(l))return null;
 if(GONE.test(l))return [GONE,'#/zdrowie-dokumentow','Dokument w aplikacji może stracić ważność albo zniknąć z telefonu bez awarii: aktywacja na nowym urządzeniu unieważnia certyfikat na starym, a certyfikat mDowodu jest ważny rok. Pokażę stan każdego dokumentu, przyczyny ze źródłami i kroki przywrócenia. To reguła w telefonie, bez AI. Nic nie wysyłam.'];
 if(/eudi|eidas|portfel\w* (europej|tozsamos)|europejsk\w* portfel|twoje prawa|praw .{0,24}portfel/.test(l))return [GONE,'#/prawa-portfela','Portfel europejski: korzystanie przez człowieka jest dobrowolne (art. 5a ust. 15 rozporządzenia (UE) 2024/1183), a część usług ma go przyjąć tylko wtedy, gdy sam zechcesz (art. 5f). Otworzę skrót praw ze źródłami. To reguła w telefonie, bez AI.'];
 if(/przychodn/.test(l)&&/(pesel|dane|adres|urodz|udostep)/.test(l))return [GONE,'#/zadanie/przychodnia','Przychodnia w tym pokazie prosi o dane na wizytę. PESEL bywa potrzebny do świadczenia, data urodzenia obok PESEL już nie, a historia leczenia to osobna zgoda na 24 godziny. Otworzę kartę żądania. To reguła w telefonie, bez AI.'];
 if(/hotel/.test(l)&&/(dane|adres|pesel|urodz|dokument|kto pyta)/.test(l))return [GONE,'#/zadanie/hotel','Hotel prosi o dane do meldunku. Zamiast pełnego adresu pokażę kraj i miasto, a PESEL oznaczę jako nadmiarowy, gdy jest numer dokumentu. To reguła w telefonie, bez AI.'];
 if(/bank/.test(l)&&!/(oszust|dzwon|spoof|bezpieczn\w* kont)/.test(l)&&/(urodz|pesel|adres|moje dane|za duzo|kto pyta)/.test(l))return [GONE,'#/zadanie/bank','Bank przy koncie prosi o dane umowy. Data urodzenia obok PESEL jest w tym pokazie nadmiarowa. Zobaczysz kartę żądania, zanim cokolwiek zatwierdzisz. To reguła w telefonie, bez AI.'];
 if(/(sklep|ksiegarn|alkohol)/.test(l)&&/(urodz|pesel|wiek|pelno|adres|moje dane|kto pyta)/.test(l))return [GONE,'#/zadanie/sklep','Sklep nie musi dostać daty urodzenia, żeby sprawdzić pełnoletność. W karcie żądania zostawisz „pełnoletni: tak”, a datę i PESEL odznaczysz. To reguła w telefonie, bez AI.'];
 if(/kto pyta|zadanie danych|nadmiarow|minimalizac|udostepni\w+ tylko/.test(l))return [GONE,'#/kto-pyta','Zanim udostępnisz dane usłudze, zobaczysz kto pyta, o jakie pola, po co, i które pola są nadmiarowe. Możesz je odznaczyć, odmówić albo udostępnić. Wpis trafi do rejestru na tym urządzeniu. To reguła w telefonie, bez AI.'];
 return null;
}
window.v23Rule=v23Rule;
const _ask=ask;
ask=async function(q){const hit=v23Rule(q);if(!hit)return _ask.apply(this,arguments);
 q=(q||'').trim();if(!q)return;if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});window.v14Last={k:'rules',fb:false};
 chat.push({r:'a',t:hit[2]+'<br><b>Czy chcesz kontynuować?</b>',act:hit[1]});drawChat();try{speak(String(hit[2]).replace(/<[^>]+>/g,''))}catch(e){}};
window.ask=ask;
if(window.v18Route){const _v=window.v18Route;window.v18Route=function(q){const hit=v23Rule(q);if(hit)return {kind:'act',hit:hit,act:hit[1]};return _v(q)}}
try{
 INT.unshift([/znikn\w+.{0,40}(dow[oó]d|dokument)|nie widz\w+.{0,24}(dow[oó]d|dokument).{0,24}aplikac/i,'#/zdrowie-dokumentow','Pokażę stan dokumentów i kroki, gdy znikną z aplikacji. To reguła w telefonie, bez AI.'],[/sklep chce|kto pyta o moje dane/i,'#/kto-pyta','Pokażę kartę żądania, zanim udostępnisz dane. To reguła w telefonie, bez AI.']);
 ALL.push(
  ['🩺','Moje dokumenty nie znikną','#/zdrowie-dokumentow','dokument zniknął stan odświeżenie certyfikat przywróć raport dziecko'],
  ['👁️','Kto pyta o moje dane','#/kto-pyta','udostępnij sklep bank hotel przychodnia minimalizacja pełnoletni'],
  ['🇪🇺','Twoje prawa – portfel europejski','#/prawa-portfela','eudi eidas dobrowolność minimalizacja historia zgód']
 );
}catch(e){}

function inject(){
 const sc=app.querySelector('.scroll');if(!sc)return;
 const p=top();
 if(p==='home'&&!sc.querySelector('#v23pill')){
  const doc=sc.querySelector('.doc');
  const html=pill('v23pill');
  if(doc)doc.insertAdjacentHTML('beforebegin',html);else sc.insertAdjacentHTML('beforeend',html);
 }
 if(p==='wallet'&&!sc.querySelector('#v23wal'))sc.insertAdjacentHTML('afterbegin',pill('v23wal'));
 if(p==='family'&&!sc.querySelector('#v23fam'))sc.insertAdjacentHTML('afterbegin','<a id="v23fam" class="v23pill plain" href="#/zdrowie-dokumentow"><i></i>Stan dokumentów dzieci</a>');
 if(p==='kid'&&!sc.querySelector('#v23kid'))sc.insertAdjacentHTML('afterbegin','<a id="v23kid" class="v23pill plain" href="#/zdrowie-dokumentow"><i></i>Stan dokumentów tego dziecka</a>');
 if(p==='doc'&&!sc.querySelector('#v23doc'))sc.insertAdjacentHTML('beforeend','<a id="v23doc" class="btn ghost" href="#/zdrowie-dokumentow">Stan tego dokumentu i przyczyny zniknięcia</a>');
 if(p==='disclose'&&!sc.querySelector('#v23dis'))sc.insertAdjacentHTML('afterbegin','<a id="v23dis" class="v23pill" href="#/kto-pyta"><i></i>Zanim udostępnisz: kto pyta i po co</a>');
 if(p==='sprawdz-dokument'&&!sc.querySelector('#v23qr'))sc.insertAdjacentHTML('beforeend','<a id="v23qr" class="btn ghost" href="#/kto-pyta">Udostępnianie online → kto pyta o dane</a>');
 if(p==='privacy'&&!sc.querySelector('#v23acc'))sc.insertAdjacentHTML('afterbegin',accHTML());
 if(p==='assistant'&&!document.getElementById('v23chip')){
  const chips=[...sc.querySelectorAll('.chips')].filter(c=>!c.closest('.chat')&&!c.closest('.msg'));
  const box=chips[chips.length-1];
  if(box)box.insertAdjacentHTML('beforeend','<button type="button" class="chip" id="v23chip" onclick="ask(\'zniknął mi dowód z aplikacji\')">Zniknął mi dowód z aplikacji</button><button type="button" class="chip" onclick="ask(\'sklep chce mojej daty urodzenia\')">Sklep chce daty urodzenia</button>');
 }
 const more=document.getElementById('v19more');
 if(more&&!more.querySelector('#v23grp')){
  const d=document.createElement('details');d.className='v19g';d.id='v23grp';d.open=true;
  const it=[['🩺','Dokumenty nie znikną','#/zdrowie-dokumentow'],['👁️','Kto pyta o moje dane','#/kto-pyta'],['🇪🇺','Twoje prawa (EUDI)','#/prawa-portfela'],['📋','Raport problemu z dokumentem','#/raport-problemu']];
  d.innerHTML=`<summary>🩺 <b>Dokumenty i żądania danych</b> <span class="muted">${it.length}</span></summary><div class="grid">${it.map(t=>`<button type="button" class="tile" onclick="location.hash='${t[2]}'"><b>${t[0]}</b>${t[1]}</button>`).join('')}</div>`;
  const first=more.querySelector('.v19g');first?more.insertBefore(d,first):more.appendChild(d);
 }
}
const R={'zdrowie-dokumentow':zdrowie,'stan-dokumentu':stan,'raport-problemu':raport,'kto-pyta':kto,'zadanie':zadanie,'prawa-portfela':prawa};
const _r=route;
route=function(){const p=top();if(R[p]){R[p]();try{inject()}catch(e){}return}const out=_r.apply(this,arguments);try{inject()}catch(e){}return out};
window.route=route;onhashchange=route;
new MutationObserver(()=>{try{inject()}catch(e){}}).observe(app,{childList:true});
const st=document.createElement('style');st.textContent=`
.v23pill{display:inline-flex;align-items:center;gap:8px;margin:0 0 10px;padding:8px 12px;border-radius:999px;background:#f4f6fb;color:#1f2d4d;text-decoration:none;font:600 .86em/1.3 system-ui;border:1px solid #d5deee}
.v23pill i{width:9px;height:9px;border-radius:50%;background:#14804a;flex:none}
.v23pill.warn i{background:#a15c00}.v23pill.bad i{background:#b3261e}
body.senior .v23pill{font-size:1.05em;padding:12px 16px}
.v23lead{font-weight:700;margin:0 0 10px}
.v23h{margin:14px 0 8px}
.v23list{display:flex;flex-direction:column;gap:8px;margin:0 0 12px}
.v23doc{display:flex;justify-content:space-between;gap:10px;align-items:center;background:#fff;border:2px solid #e1e6ef;border-radius:16px;padding:12px 14px;text-decoration:none;color:inherit;min-height:64px}
.v23doc span{display:flex;flex-direction:column;gap:2px}.v23doc small{color:#444;font-weight:500}
.v23doc em{font-style:normal;font-weight:800;font-size:.82em;border-radius:999px;padding:4px 8px;background:#e8f6ee;color:#0d5c32;white-space:nowrap}
.v23doc.warn{border-color:#e6c48a}.v23doc.warn em{background:#fff4d6;color:#7a4e00}
.v23doc.bad{border-color:#f0b4b4}.v23doc.bad em{background:#fdecea;color:#8d1d18}
body.senior .v23doc{min-height:88px;padding:16px}body.senior .v23doc b{font-size:1.25em}body.senior .v23doc em{font-size:1em;padding:8px 10px}
.v23pill.plain i{background:#5c6b82}
.v23steps{list-style:none;margin:0 0 12px;padding:0;display:flex;flex-direction:column;gap:8px}
.v23steps li{display:flex;gap:10px;background:#fff;border-radius:16px;padding:12px;border:1px solid #e6ebf3}
.v23steps li span{flex:none;width:36px;height:36px;border-radius:50%;background:#0b3d91;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}
.v23steps p{margin:4px 0 0}
body.senior .v23steps li{display:none;padding:16px}body.senior .v23steps li.on{display:flex}
body.senior .v23steps li span{width:52px;height:52px;font-size:1.4em}body.senior .v23steps{font-size:1.2em}
.v23nav{display:flex;gap:8px}.v23nav .btn{flex:1}
.v23cause{background:#fff;border-radius:14px;padding:10px 12px;margin:0 0 8px;border-left:4px solid #0b3d91}
.v23cause b{display:inline-block;font-size:.75em;letter-spacing:.03em;text-transform:uppercase;color:#0b3d91;margin-right:6px}
.v23cause p{margin:4px 0 0}
.v23help{background:#f6f8fb;border-radius:14px;padding:12px;margin:10px 0}
.v23src{font-size:.78em;color:#333;margin:8px 0}body.senior .v23src{font-size:.95em}.v23src a{color:#0b3d91}
.v23more{background:#fff;border-radius:14px;padding:4px 12px;margin:8px 0}.v23more summary{cursor:pointer;font-weight:700;padding:10px 0;min-height:44px}
.v23grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 12px}body.senior .v23grid{grid-template-columns:1fr}
.v23scen{display:flex;flex-direction:column;gap:4px;background:#fff;border:2px solid #dde5f5;border-radius:16px;padding:12px;min-height:84px;text-decoration:none;color:#0b2350}
body.senior .v23scen{min-height:100px}body.senior .v23scen b{font-size:1.3em}
.v23qr{display:flex;flex-direction:column;gap:2px;background:#0b3d91;color:#fff;text-decoration:none;border-radius:16px;padding:12px 14px;margin:0 0 10px}
.v23qr small{opacity:.92}body.senior .v23qr{padding:16px}body.senior .v23qr b{font-size:1.25em}
.v23fields{display:flex;flex-direction:column;gap:8px;margin:0 0 8px}
.v23f{display:flex;gap:10px;align-items:flex-start;background:#fff;border:2px solid #f0b4b4;border-radius:14px;padding:10px 12px;min-height:64px}
.v23f.need{border-color:#b7e0c6}
.v23f input{width:26px;height:26px;margin-top:2px;flex:none}
.v23f i{font-style:normal;font-size:.75em;font-weight:800;border-radius:999px;padding:2px 6px;background:#fdecea;color:#8d1d18}
.v23f.need i{background:#e8f6ee;color:#0d5c32}
.v23f small{display:block;color:#333;margin-top:2px}
body.senior .v23f{font-size:1.12em;padding:14px}
.v23right{background:#fff;border-radius:14px;padding:12px;margin:0 0 8px;border-top:4px solid #0b3d91}
.v23right p{margin:4px 0 0}
.v23acts{display:flex;flex-direction:column;gap:4px;align-items:flex-end}
#v23rep{width:100%;box-sizing:border-box;font:13px/1.4 ui-monospace,monospace;border-radius:12px;border:1px solid #d5deee;padding:10px}
body.contrast .v23doc,body.contrast .v23cause,body.contrast .v23f,body.contrast .v23right,body.contrast .v23scen,body.contrast .v23help,body.contrast .v23more{background:#000;color:#fff;border-color:#fff}
body.contrast .v23pill{background:#000;color:#ffeb3b;border-color:#ffeb3b}
body.contrast .v23doc small,body.contrast .v23f small{color:#ffeb3b}
button:disabled{opacity:.45}
`;
document.head.appendChild(st);
inject();route();
})();
