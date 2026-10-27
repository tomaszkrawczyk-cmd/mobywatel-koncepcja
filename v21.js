// ===== v21: „Prawdziwy czy podróbka?” – ochrona przed fałszywym mObywatelem =====
// Autor koncepcji: Tomasz Krawczyk. Wszystko tu jest symulacją (DEMO): nie łączymy się z rejestrem,
// nie wysyłamy zgłoszeń, numery spraw mają prefiks DEMO-. Fakty prawne opisujemy ostrożnie, ze źródłami.
(function(){
const REP_KEY='mob21_reports_v1';
const AGE={anna:35,piotr:43,halina:57,kuba:20};
const SRC={
 qr:['MC: Kod QR – skuteczna metoda weryfikacji mDowodu (13.02.2025)','https://www.gov.pl/web/cyfryzacja/kod-qr--skuteczna-metoda-weryfikacji-mdowodu'],
 sec:['MC: mDowód – jak działa, jak jest chroniony','https://www.gov.pl/web/cyfryzacja/mdowod--jak-dziala-jak-jest-chroniony-i-jak-sprawdzic-jego-autentycznosc'],
 safe:['MC: Bezpieczeństwo korzystania z e-dowodu i mDowodu','https://www.gov.pl/web/cyfryzacja/bezpieczenstwo-korzystania-z-e-dowodu-i-mdowodu--to-warto-wiedziec2'],
 law:['MC: Fałszowanie dokumentów tożsamości to poważne przestępstwo (14.05.2025)','https://www.gov.pl/web/cyfryzacja/falszowanie-dokumentow-tozsamosci-to-powazne-przestepstwo'],
 cbzc1:['CBZC: Sprzedawali fałszywą aplikację mObywatel (20.02.2026)','https://cbzc.policja.gov.pl/bzc/aktualnosci/831,Sprzedawali-falszywa-aplikacje-mObywatel-zostali-zatrzymani-przez-policjantow-CB.html'],
 cbzc2:['CBZC: Operacja wymierzona w dystrybucję fałszywej aplikacji mObywatel (27.10.2026)','https://cbzc.policja.gov.pl/bzc/aktualnosci/1048,Operacja-CBZC-wymierzona-w-dystrybucje-falszywej-aplikacji-mObywatel.html'],
 skier:['KMP Skierniewice: Fałszywa aplikacja mObywatel','https://skierniewice.policja.gov.pl/es/informacje/114540,Falszywa-aplikacja-mObywatel.html'],
 bytow:['RMF24: 16-latka kupiła alkohol, pokazując sfałszowanego mObywatela (7.02.2025)','https://www.rmf24.pl/regiony/trojmiasto/news-16-latka-kupila-alkohol-pokazujac-sfalszowanego-mobywatela,nId,7907944'],
 instr:['mObywatel: Jak potwierdzać dokumenty w mObywatelu 2.0 (PDF)','https://info.mobywatel.gov.pl/assets/download/Jak%20potwierdza%C4%87%20dokumenty%20w%20mObywatelu%202.0.pdf?v=2'],
 cert:['CERT Polska – zgłoś incydent','https://incydent.cert.pl']
};
const src=(...k)=>`<p class="v21src">Źródła: ${k.map(x=>`<a href="${SRC[x][1]}" target="_blank" rel="noopener">${SRC[x][0]}</a>`).join(' · ')}</p>`;
const DEMO='<span class="demo">DEMO</span>';
let T=null,tiltOn=false,tilt=0;
function stop(){clearInterval(T);T=null}
function per(){return S.persona||'anna'}
function who(){return (window.PERS&&PERS[per()]&&PERS[per()].name)||'Anna Kowalska'}
function rnd6(){const a=new Uint32Array(1);crypto.getRandomValues(a);return String(a[0]%1000000).padStart(6,'0')}
function caseNo(){const d=new Date();return 'DEMO-PF-'+d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'-'+rnd6().slice(0,4)}
function qrSvg(txt){try{const q=qrcode(0,'M');q.addData(txt);q.make();return q.createSvgTag({cellSize:S.senior?6:5,margin:2})}catch(e){return '<div class="v21noqr">QR</div>'}}
const loadR=()=>{try{return JSON.parse(localStorage.getItem(REP_KEY)||'[]')}catch(e){return []}};
const saveR=v=>{try{localStorage.setItem(REP_KEY,JSON.stringify(v))}catch(e){}};

// ---------- 1. Centrum: Prawdziwy czy podróbka ----------
function hub(){stop();shell('🛡️ Prawdziwy czy podróbka?',`
 <div class="v21hero"><b>Fałszywe „mObywatele” są sprzedawane w internecie.</b><span>Wygląd można skopiować. Odpowiedzi z rejestru państwowego – nie. Dlatego najpewniejszy jest kod QR.</span></div>
 <div class="v21grid">
  <a class="v21big" href="#/sprawdz-dokument"><b>🔍 Sprawdź czyjś dokument</b><small>Kod QR + jednorazowy kod, wynik tylko z potrzebnymi danymi</small></a>
  <a class="v21big g" href="#/pokaz-dokument"><b>🪪 Pokaż mój dokument</b><small>Żywy znak bezpieczeństwa, którego nie da się zrobić zrzutem</small></a>
  <a class="v21big w" href="#/jak-rozpoznac"><b>👀 Jak rozpoznać podróbkę</b><small>Dla sklepu, policji, seniora</small></a>
  <a class="v21big r" href="#/zglos-podrobke"><b>🚩 Zgłoś podejrzaną aplikację</b><small>Formularz DEMO, numer DEMO-</small></a>
 </div>
 <details class="v21more"><summary>⚖️ Udostępnienie dokumentu komuś innemu to przestępstwo</summary>${lawHTML()}</details>
 <details class="v21more"><summary>📰 Co się wydarzyło naprawdę (zatrzymania)</summary>${newsHTML()}</details>`,{tab:'wallet'})}

function lawHTML(){return `<ul class="v21list">
 <li><b>Podrabianie, przerabianie dokumentu albo używanie podrobionego jako prawdziwego</b> – art. 270 § 1 Kodeksu karnego: od 3 miesięcy do 5 lat pozbawienia wolności. Ministerstwo Cyfryzacji i policja wprost stosują ten przepis do fałszywych mDowodów.</li>
 <li><b>Tworzenie, sprzedaż i udostępnianie programów do fałszowania</b> – w sprawach CBZC zarzuty obejmowały m.in. bezprawne wytwarzanie i udostępnianie programów komputerowych (art. 269b k.k.) oraz udział w zorganizowanej grupie.</li>
 <li><b>Pokazywanie cudzego dokumentu jako swojego</b> (np. pożyczony telefon starszego brata, zrzut ekranu od kolegi) – może być uznane za używanie dokumentu innej osoby (art. 275 k.k.) lub za oszustwo. Ocena zależy od okoliczności – to nie jest porada prawna.</li>
 <li><b>Nieletni</b> – sprawami zajmuje się sąd rodzinny (upomnienie, nadzór kuratora, nawet ośrodek wychowawczy).</li>
 <li><b>Sprzedawca, który zobaczy podróbkę</b> – MC przypomina o obowiązku zawiadomienia organów ścigania i zabezpieczenia dowodów (art. 304 k.p.k.).</li></ul>
 <p class="muted">Twój mObywatel jest tylko Twój. Nie pożyczaj telefonu z otwartym dokumentem i nie wysyłaj nikomu zrzutów ekranu dokumentu.</p>${src('law','qr','cbzc1','skier')}`}
function newsHTML(){return `<ul class="v21list">
 <li><b>27.10.2026</b> – CBZC: 21 zatrzymanych (w tym 13 nieletnich), 27 przeszukań, ponad 30 urządzeń; skrypt generował wirtualny dokument z nieprawdziwymi danymi „na wzór mObywatela”. 3 osoby tymczasowo aresztowane.</li>
 <li><b>20.02.2026</b> – CBZC: 4 młodych sprzedawców fałszywej aplikacji, proceder ok. 12 miesięcy, mogło kupić ponad 3000 osób; zarzuty z art. 270 k.k. w zw. z art. 65 k.k.</li>
 <li><b>2025</b> – liczne przypadki nieletnich kupujących alkohol lub energetyki z podrobionym mObywatelem (np. Bytów, Skierniewice). W Skierniewicach sprzedawczyni zeskanowała kod QR – system pokazał, że dokument nie jest ważny.</li></ul>${src('cbzc2','cbzc1','bytow','skier')}`}

// ---------- 2. Weryfikator (strona sprawdzająca) ----------
let V=null;
function verify(){stop();const step=(V&&V.step)||'start';
 if(step==='start'){shell('🔍 Sprawdź dokument',`
  <div class="alert">ℹ️<div><b>Symulacja DEMO.</b> W prawdziwej aplikacji użyj „Kod QR → Pokaż kod QR” albo strony weryfikator.mobywatel.gov.pl. Wygląd ekranu może być podrobiony – wynik z rejestru nie.</div></div>
  <h3>1. Co chcesz sprawdzić?</h3><p class="muted">Poproś tylko o to, czego potrzebujesz. Mniej danych = mniej ryzyka.</p>
  <div class="v21opts">
   <label class="v21opt"><input type="radio" name="v21s" value="adult" checked><b>🍺 Czy ma 18 lat</b><small>sklep, kino, stacja – zobaczysz tylko TAK/NIE i zdjęcie</small></label>
   <label class="v21opt"><input type="radio" name="v21s" value="name"><b>🙂 Imię, nazwisko i zdjęcie</b><small>odbiór paczki, recepcja</small></label>
   <label class="v21opt"><input type="radio" name="v21s" value="full"><b>🪪 Pełne dane dowodu</b><small>urząd, bank, policja</small></label>
  </div>
  <button class="btn" onclick="v21Gen()">Pokaż kod do zeskanowania ${DEMO}</button>${src('qr','instr')}`,{tab:'wallet'});return}
 if(step==='code'){const left=Math.max(0,Math.ceil((V.exp-Date.now())/1000));
  shell('🔍 Sprawdź dokument',`
  <h3>2. Pokaż ten kod osobie z dokumentem</h3>
  <div class="v21qr">${qrSvg(location.origin+location.pathname+'#/demo-qr/v21-'+V.code)}<div class="v21code" aria-label="kod jednorazowy">${V.code.slice(0,3)} ${V.code.slice(3)}</div>
  <div class="v21bar"><i id="v21bar" style="width:${left/120*100}%"></i></div><p id="v21left" class="muted">Kod jednorazowy ważny jeszcze <b>${left}</b> s</p></div>
  <p>Osoba okazująca zeskanuje kod, zobaczy <b>komu i jakie dane</b> przekazuje i sama je zatwierdzi.</p>
  <div class="v21row"><button class="btn" onclick="v21Sim(true)">Symuluj: zatwierdził prawdziwy mObywatel ${DEMO}</button><button class="btn sec" onclick="v21Sim(false)">Symuluj: pokazano podróbkę / zrzut ${DEMO}</button></div>
  <button class="btn sec" onclick="v21Gen()">Nowy kod</button>`,{tab:'wallet'});
  T=setInterval(()=>{const l=Math.max(0,Math.ceil((V.exp-Date.now())/1000));const b=document.getElementById('v21left'),bar=document.getElementById('v21bar');if(!b){stop();return}
   b.innerHTML=l?`Kod jednorazowy ważny jeszcze <b>${l}</b> s`:'<b>Kod wygasł.</b> Wygeneruj nowy.';bar.style.width=(l/120*100)+'%';if(!l)stop()},1000);return}
 if(step==='res'){const ok=V.ok,sc=V.scope,age=AGE[per()]||35;const left=Math.max(0,Math.ceil((V.until-Date.now())/1000));
  let data='';if(ok){
   if(sc==='adult')data=`<div class="v21yes">${age>=18?'✅ PEŁNOLETNI – TAK':'⛔ PEŁNOLETNI – NIE'}</div><p class="muted">Nie widzisz imienia, daty urodzenia ani numeru dowodu – nie są potrzebne.</p>`;
   else if(sc==='name')data=`<div class="row"><span>Imię i nazwisko</span><b>${esc(who())}</b></div>`;
   else data=`<div class="row"><span>Imię i nazwisko</span><b>${esc(who())}</b></div><div class="row"><span>Wiek</span><b>${age} lat</b></div><div class="row"><span>Nr dokumentu</span><b>DEMO 000000</b></div><div class="row"><span>Status</span><b>ważny</b></div>`}
  shell('🔍 Wynik sprawdzenia',ok?`
   <div class="v21ok"><b>✔ Dokument potwierdzony (DEMO)</b><span>Dane przyszły z „rejestru” w symulacji, nie z ekranu telefonu okazującego.</span></div>
   <div class="card"><div class="v21face">🙂</div>${data}<p class="muted">Porównaj zdjęcie z twarzą osoby.</p></div>
   <p id="v21gone" class="muted">Dane znikną z tego urządzenia za <b>${left}</b> s i nie są zapisywane.</p>
   <button class="btn" onclick="v21End()">Zakończ</button>`:`
   <div class="v21bad"><b>✖ Nie udało się potwierdzić dokumentu (DEMO)</b><span>Nikt nie zatwierdził kodu albo pokazano zrzut, nagranie lub aplikację-podróbkę.</span></div>
   <ul class="v21list"><li>Nie sprzedawaj towaru z ograniczeniem wieku.</li><li>Nie zabieraj telefonu siłą. Poproś o tradycyjny dowód.</li><li>Jeśli to podróbka: zgłoś na policję (112 w nagłej sytuacji), zapamiętaj szczegóły.</li><li>Brak internetu u okazującego nie oznacza od razu podróbki – sprawdź wtedy elementy ruchome i poproś o drugi dokument.</li></ul>
   <a class="btn sec" href="#/zglos-podrobke">Zgłoś podejrzaną aplikację ${DEMO}</a><button class="btn" onclick="v21End()">Zakończ</button>${src('safe','law')}`,{tab:'wallet'});
  if(ok)T=setInterval(()=>{const l=Math.max(0,Math.ceil((V.until-Date.now())/1000));const el=document.getElementById('v21gone');if(!el){stop();return}if(!l){stop();v21End();toast('Dane usunięte z urządzenia sprawdzającego (DEMO).');return}el.innerHTML=`Dane znikną z tego urządzenia za <b>${l}</b> s i nie są zapisywane.`},1000)}}
window.v21Gen=function(){const r=document.querySelector('input[name=v21s]:checked');V={step:'code',scope:r?r.value:(V&&V.scope)||'adult',code:rnd6(),exp:Date.now()+120000};verify()};
window.v21Sim=function(ok){if(!V)return;if(Date.now()>V.exp)return toast('Kod wygasł. Wygeneruj nowy.');V.step='res';V.ok=ok;V.until=Date.now()+(S.senior?180000:90000);verify()};
window.v21End=function(){V=null;stop();location.hash='#/podrobki'};

// ---------- 3. Pokaż mój dokument z żywym znakiem ----------
function show(){stop();shell('🪪 Mój dokument – żywy znak',`
 <div class="alert">ℹ️<div><b>Koncepcja DEMO.</b> Prawdziwy mDowód ma hologram godła zmieniający kolor przy przechylaniu, powiewającą flagę, bieżącą datę i godzinę. Tu pokazujemy rozwinięcie tego pomysłu.</div></div>
 <div class="v21card" id="v21card"><div class="v21holo" id="v21holo">🦅</div>
  <div class="v21flag"><i></i><i></i></div>
  <div class="v21name">${esc(who())}</div>
  <div class="v21clock" id="v21clock">--:--:--</div>
  <div class="v21word" id="v21word" title="Słowo dnia zmienia się co minutę">—</div>
  <div class="v21valid">● Dokument ważny <small>DEMO</small></div></div>
 <ul class="v21list"><li><b>Zegar z sekundami</b> – porównaj z zegarkiem sprawdzającego. Zrzut ekranu „staje”.</li><li><b>Kolor tła zmienia się co minutę</b> według godziny – na nagraniu kolor nie zgadza się z „teraz”.</li><li><b>Dotknij kartę</b> – fala rozchodzi się od palca. Nagranie wideo nie reaguje na dotyk.</li><li><b>Przechyl telefon</b> – hologram zmienia barwę.</li></ul>
 <button class="btn sec" onclick="v21Tilt()">Włącz reakcję na przechylenie</button>
 <div class="v21warn">📵 <b>Zrzut ekranu ani nagranie nie są dokumentem.</b> Jeśli ktoś wysyła Ci „zdjęcie mObywatela” – to nie jest potwierdzenie tożsamości. W koncepcji aplikacja ostrzega, gdy wykryje próbę zrzutu (tam, gdzie system na to pozwala).</div>
 <a class="btn" href="#/sprawdz-dokument">Najpewniej: sprawdzenie kodem QR</a>${src('sec','safe')}`,{tab:'wallet'});
 const words=['LIPA','BURSZTYN','WISŁA','ŻUBR','TATRY','KAJAK','SOKÓŁ','MAK','DĄB','BAŁTYK','ORZEŁ','KLON'];
 const tick=()=>{const d=new Date(),c=document.getElementById('v21clock');if(!c){stop();return}
  c.textContent=d.toLocaleTimeString('pl-PL')+' · '+d.toLocaleDateString('pl-PL');
  const m=d.getHours()*60+d.getMinutes();const h=(m*37)%360;const card=document.getElementById('v21card');card.style.setProperty('--h',h);
  document.getElementById('v21word').textContent=words[m%words.length]+' · '+String(m%97).padStart(2,'0');
  document.getElementById('v21holo').style.filter=`hue-rotate(${(tilt*4+d.getSeconds()*6)%360}deg)`};
 tick();T=setInterval(tick,1000);
 const card=document.getElementById('v21card');card.onpointerdown=e=>{const r=card.getBoundingClientRect();const s=document.createElement('span');s.className='v21rip';s.style.left=(e.clientX-r.left)+'px';s.style.top=(e.clientY-r.top)+'px';card.appendChild(s);setTimeout(()=>s.remove(),900)}}
function onTilt(e){tilt=Math.round((e.gamma||0)+(e.beta||0))}
window.v21Tilt=async function(){try{if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function'){const p=await DeviceOrientationEvent.requestPermission();if(p!=='granted')return toast('Bez zgody na czujnik ruchu – hologram zmienia się z czasem.')}
 if(!tiltOn&&window.DeviceOrientationEvent){addEventListener('deviceorientation',onTilt);tiltOn=true}toast(window.DeviceOrientationEvent?'Przechyl telefon – hologram zmieni barwę (DEMO).':'To urządzenie nie ma czujnika ruchu.')}catch(e){toast('Czujnik ruchu niedostępny.')}};
// ostrzeżenie o zrzucie ekranu (przeglądarka widzi tylko klawisz PrintScreen / utratę widoczności – uczciwie opisujemy ograniczenie)
addEventListener('keyup',e=>{if(e.key==='PrintScreen'&&/pokaz-dokument|wallet/.test(location.hash))toast('📵 Zrzut ekranu nie jest dokumentem. Sprawdzający powinien użyć kodu QR. (DEMO)')});

// ---------- 4. Jak rozpoznać podróbkę ----------
function guide(){stop();const who0=(location.hash.split('/')[2])||'sklep';
 const tabs=[['sklep','🛒 Sklep'],['policja','👮 Policja, ochrona'],['senior','👵 Senior']];
 const body={
  sklep:`<ol class="v21steps"><li><b>Poproś o kod QR, nie o ekran.</b> Pokaż swój kod z mObywatela lub weryfikator.mobywatel.gov.pl i niech klient go zeskanuje.</li><li><b>Wybierz „pełnoletność”</b>, jeśli tylko to musisz wiedzieć.</li><li><b>Zegar ma sekundy i zgadza się z Twoim?</b> Flaga faluje, hologram zmienia kolor przy przechyleniu?</li><li><b>Poproś o przejście do innego ekranu</b> aplikacji i z powrotem – „metoda funkcjonalna”. Pojedyncza grafika tego nie zrobi.</li><li><b>Coś nie gra?</b> Nie sprzedawaj. Poproś o plastikowy dowód. Zawiadom policję.</li></ol>`,
  policja:`<ol class="v21steps"><li>Kryptograficzne potwierdzenie kodem QR to według MC najpewniejsza metoda – dane z rejestru, nie z telefonu okazującego.</li><li>Elementy dynamiczne powinny poruszać się także offline.</li><li>Data aktualizacji danych nie powinna być starsza niż rok (wg instrukcji mTożsamości).</li><li>Brak internetu u okazującego nie przesądza o podróbce – zastosuj inne metody.</li><li>Telefon z podróbką to dowód – w opisanych sprawach policja go zabezpieczała.</li></ol>`,
  senior:`<ol class="v21steps big"><li><b>mObywatel pobieraj tylko ze sklepu Google Play lub App Store</b> (wydawca: Ministerstwo Cyfryzacji / COI). Nie z linku w SMS-ie.</li><li><b>Nigdy nie wysyłaj nikomu zdjęcia swojego dowodu</b> – ani z aplikacji, ani plastikowego.</li><li><b>Nie podawaj kodu z SMS ani PIN-u</b> nikomu przez telefon. Urzędnik o to nie prosi.</li><li><b>Ktoś chce „sprawdzić Twój dokument”?</b> Aplikacja zawsze pokaże, komu i jakie dane dajesz. Możesz odmówić.</li></ol>`};
 shell('👀 Jak rozpoznać podróbkę',`<div class="v21tabs">${tabs.map(t=>`<a class="${t[0]===who0?'on':''}" href="#/jak-rozpoznac/${t[0]}">${t[1]}</a>`).join('')}</div>${body[who0]||body.sklep}
 <div class="v21cmp"><div><b>✅ Prawdziwy</b><ul><li>potwierdza się kodem QR</li><li>żywy zegar z sekundami</li><li>hologram reaguje na ruch</li><li>da się przejść do innych usług</li></ul></div><div><b>❌ Podejrzany</b><ul><li>„nie mam internetu”, „QR nie działa” za każdym razem</li><li>zegar stoi lub nie ma sekund</li><li>to zdjęcie, film, link w przeglądarce</li><li>inne ekrany nie działają</li></ul></div></div>
 <a class="btn" href="#/sprawdz-dokument">Sprawdź dokument kodem ${DEMO}</a>${src('sec','safe','qr','instr')}`,{tab:'wallet'})}

// ---------- 5. Zgłoś podejrzaną aplikację ----------
function report(){stop();const list=loadR();shell('🚩 Zgłoś podejrzaną aplikację',`
 <div class="alert r">⚠️<div><b>Formularz DEMO – nic nie jest wysyłane.</b> Prawdziwe zgłoszenie: <a href="${SRC.cert[1]}" target="_blank" rel="noopener">incydent.cert.pl</a>, a gdy ktoś w sklepie używa podróbki – policja (w nagłej sytuacji <a href="tel:112">112</a>).</div></div>
 <label>Co widzisz?<select id="v21k"><option>Ogłoszenie sprzedaży fałszywego mObywatela</option><option>Aplikacja/strona podszywająca się pod mObywatel</option><option>Ktoś okazał podrobiony dokument</option><option>Ktoś używa mojego dokumentu</option></select></label>
 <label>Gdzie? (adres, serwis, sklep)<input id="v21w" placeholder="np. link do ogłoszenia"></label>
 <label>Opis (bez danych osobowych innych osób)<textarea id="v21d" rows="3"></textarea></label>
 <button class="btn" onclick="v21Rep()">Utwórz zgłoszenie (SYMULACJA) ${DEMO}</button>
 ${list.length?`<h3>Twoje zgłoszenia na tym telefonie</h3>${list.map(r=>`<div class="row"><span>${esc(r.k)}</span><b>${esc(r.n)}</b></div>`).join('')}<button class="btn sec" onclick="v21Wipe()">Usuń z telefonu</button>`:''}
 ${src('law','cert')}`,{tab:'wallet'})}
window.v21Rep=function(){const k=(document.getElementById('v21k')||{}).value||'';const n=caseNo();const l=loadR();l.unshift({k,n,at:new Date().toISOString()});saveR(l.slice(0,10));report();toast('Utworzono zgłoszenie '+n+' (SYMULACJA – nic nie wysłano).')};
window.v21Wipe=function(){saveR([]);report()};

// ---------- asystent: reguły w telefonie ----------
const FAKE_RE=/(czy|jak).{0,30}(mobywatel|mdowod|dokument|aplikacj).{0,30}(prawdziw|autentycz|podrob|falszyw|oryginal)|(podrob|falszyw|fake).{0,20}(mobywatel|mdowod|aplikacj|dowod)|jak (sprawdzic|zweryfikowac|potwierdzic).{0,30}(mobywatel|mdowod|dokument|tozsamosc|wiek|pelnolet)|jak rozpoznac.{0,20}(podrob|falszyw|mobywatel)|mweryfikator|weryfikator|udostepni\w*.{0,30}(dowod|dokument|mobywatel).{0,30}(komus|innej|koled|znajom)|zglos\w*.{0,20}(podrob|falszyw)/;
function v21Rule(q){const l=norm(q);if(!FAKE_RE.test(l))return null;
 if(/zglos/.test(l))return [FAKE_RE,'#/zglos-podrobke','Ofertę fałszywego mObywatela zgłosisz na incydent.cert.pl, a użycie podróbki – na policję. Otworzę formularz DEMO (numer DEMO-, nic nie wysyłam). Odpowiedź z reguł w telefonie, bez AI.'];
 if(/udostepni|komus|koled|znajom/.test(l))return [FAKE_RE,'#/podrobki','Nie pokazuj cudzego mObywatela jako swojego i nie pożyczaj swojego. Używanie podrobionego dokumentu jako prawdziwego jest karane z art. 270 § 1 k.k. (od 3 miesięcy do 5 lat), a posługiwanie się dokumentem innej osoby może podpadać pod art. 275 k.k. – zależnie od okoliczności, to nie porada prawna. Pokażę szczegóły ze źródłami. Odpowiedź z reguł w telefonie, bez AI.'];
 return [FAKE_RE,'#/sprawdz-dokument','Najpewniej: poproś o potwierdzenie kodem QR (w mObywatelu „Kod QR → Pokaż kod QR” albo strona weryfikator.mobywatel.gov.pl). Okazujący skanuje kod lub wpisuje 6 cyfr, zatwierdza dane, a Ty widzisz je z rejestru przez kilka minut. Wzrokowo: zegar z bieżącą datą i godziną, falująca flaga, hologram godła zmieniający kolor przy przechyleniu, napis „Dokument ważny”. Zrzut ekranu ani film nie są dokumentem. Otworzę weryfikator DEMO. Odpowiedź z reguł w telefonie, bez AI.']}
window.v21Rule=v21Rule;
const _ask21=ask;
ask=async function(q){const hit=v21Rule(q);if(!hit)return _ask21.apply(this,arguments);
 q=(q||'').trim();if(!q)return;if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});window.v14Last={k:'rules',fb:false};
 chat.push({r:'a',t:hit[2]+'<br><b>Czy chcesz kontynuować?</b>',act:hit[1]});drawChat();try{speak(String(hit[2]).replace(/<[^>]+>/g,''))}catch(e){}};
window.ask=ask;
if(window.v18Route){const _v=window.v18Route;window.v18Route=function(q){const hit=v21Rule(q);if(hit)return {kind:'act',hit:hit,act:hit[1]};return _v(q)}}
try{INT.unshift([/prawdziw\w* mobywatel|podr[oó]b\w* mobywatel|fa[lł]szyw\w* mobywatel|sprawd[zź] dokument/i,'#/sprawdz-dokument','Pokażę, jak sprawdzić dokument kodem QR (DEMO). To reguła w telefonie, bez AI.']);
 ALL.push(['🛡️','Prawdziwy czy podróbka? – sprawdź dokument','#/podrobki','podróbka fałszywy mobywatel weryfikacja qr kod sprawdź dokument pełnoletni sklep policja zgłoś udostępnianie'])}catch(e){}

// ---------- wejścia ----------
function top(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/)[0]}
const TILE=id=>`<a id="${id}" class="v21go" href="#/podrobki"><b>🛡️ Prawdziwy czy podróbka?</b><small>Sprawdź dokument kodem QR · jak rozpoznać fałszywy mObywatel · zgłoś</small></a>`;
function inject(){const sc=app.querySelector('.scroll');if(!sc)return;const p=top();
 if(p==='home'&&!sc.querySelector('#v21home')){const a=sc.querySelector('#v20go');a?a.insertAdjacentHTML('afterend',TILE('v21home')):sc.insertAdjacentHTML('afterbegin',TILE('v21home'))}
 if(p==='wallet'&&!sc.querySelector('#v21wal'))sc.insertAdjacentHTML('afterbegin',TILE('v21wal'));
 if(p==='security'&&!sc.querySelector('#v21sec'))sc.insertAdjacentHTML('afterbegin',TILE('v21sec'));
 if(p==='assistant'&&!document.getElementById('v21chip')){const chips=[...sc.querySelectorAll('.chips')].filter(c=>!c.closest('.chat')&&!c.closest('.msg'));const box=chips[chips.length-1];
  if(box)box.insertAdjacentHTML('beforeend','<button type="button" class="chip" id="v21chip" onclick="ask(\'jak sprawdzić czy mObywatel jest prawdziwy\')">Czy mObywatel jest prawdziwy?</button>')}
 const more=document.getElementById('v19more');
 if(more&&!more.querySelector('#v21grp')){const d=document.createElement('details');d.className='v19g';d.id='v21grp';
  const it=[['🛡️','Prawdziwy czy podróbka?','#/podrobki'],['🔍','Sprawdź dokument','#/sprawdz-dokument'],['🪪','Mój dokument – żywy znak','#/pokaz-dokument'],['👀','Jak rozpoznać podróbkę','#/jak-rozpoznac'],['🚩','Zgłoś podejrzaną aplikację','#/zglos-podrobke']];
  d.innerHTML=`<summary>🛡️ <b>Ochrona przed podróbkami</b> <span class="muted">${it.length}</span></summary><div class="grid">${it.map(t=>`<button type="button" class="tile" onclick="location.hash='${t[2]}'"><b>${t[0]}</b>${t[1]}</button>`).join('')}</div>`;
  const first=more.querySelector('.v19g');first?more.insertBefore(d,first):more.appendChild(d)}}
const R={podrobki:hub,'sprawdz-dokument':verify,'pokaz-dokument':show,'jak-rozpoznac':guide,'zglos-podrobke':report};
const _r=route;
route=function(){const p=top();if(R[p]){if(p!=='sprawdz-dokument')V=null;R[p]();try{inject()}catch(e){}return}stop();const out=_r.apply(this,arguments);try{inject()}catch(e){}return out};
window.route=route;onhashchange=route;
const prevReset=window.resetDemo||resetDemo;
window.resetDemo=resetDemo=function(){try{localStorage.removeItem(REP_KEY)}catch(e){}return prevReset()};
new MutationObserver(()=>{try{inject()}catch(e){}}).observe(app,{childList:true});
const st=document.createElement('style');st.textContent=`
.v21go{display:flex;flex-direction:column;gap:2px;background:linear-gradient(135deg,#0b3d91,#1565c0);color:#fff;text-decoration:none;border-radius:18px;padding:14px 16px;margin:0 0 12px;box-shadow:0 8px 22px #0b3d9133}
.v21go b{font-size:1.2em}.v21go small{opacity:.95}body.senior .v21go{padding:20px}body.senior .v21go b{font-size:1.6em}body.senior .v21go small{font-size:1.05em}
.v21hero{background:#fff4e5;border-left:5px solid #e65100;border-radius:14px;padding:12px 14px;margin:0 0 12px;display:flex;flex-direction:column;gap:4px}
.v21grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 12px}body.senior .v21grid{grid-template-columns:1fr}
.v21big{display:flex;flex-direction:column;gap:4px;background:#0b3d91;color:#fff;text-decoration:none;border-radius:16px;padding:14px;min-height:92px}.v21big.g{background:#14804a}.v21big.w{background:#6a4bb3}.v21big.r{background:#b3261e}
.v21big b{font-size:1.05em}.v21big small{opacity:.92;font-size:.85em}body.senior .v21big b{font-size:1.4em}body.senior .v21big small{font-size:1.05em}
.v21more{background:#fff;border-radius:14px;padding:6px 14px;margin:0 0 10px;box-shadow:0 1px 3px #0001}.v21more summary{cursor:pointer;font-weight:700;padding:8px 0}
.v21list{padding-left:18px;line-height:1.45}.v21list li{margin:0 0 6px}body.senior .v21list,body.senior .v21steps{font-size:1.18em}
.v21src{font-size:.78em;color:#555;margin:8px 0}.v21src a{color:#0b3d91}body.senior .v21src{font-size:.95em}
.v21opts{display:flex;flex-direction:column;gap:8px;margin:0 0 12px}.v21opt{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;background:#fff;border:2px solid #dde5f5;border-radius:14px;padding:12px;cursor:pointer}
.v21opt input{grid-row:span 2;width:22px;height:22px}.v21opt small{color:#555}.v21opt:has(input:checked){border-color:#0b3d91;background:#eef3ff}body.senior .v21opt{font-size:1.2em;padding:16px}
.v21qr{background:#fff;border-radius:18px;padding:14px;text-align:center;margin:0 0 12px}.v21qr svg{max-width:100%;height:auto}
.v21code{font:800 2em ui-monospace,monospace;letter-spacing:.12em;margin:6px 0}body.senior .v21code{font-size:2.6em}
.v21bar{height:8px;background:#e3e8f3;border-radius:9px;overflow:hidden}.v21bar i{display:block;height:100%;background:#0b3d91;transition:width 1s linear}
.v21row{display:flex;flex-direction:column;gap:8px;margin:8px 0}
.v21ok,.v21bad{border-radius:16px;padding:14px;margin:0 0 12px;display:flex;flex-direction:column;gap:4px;color:#fff}.v21ok{background:#14804a}.v21bad{background:#b3261e}.v21ok b,.v21bad b{font-size:1.2em}
.v21yes{font:800 1.6em system-ui;text-align:center;padding:12px;border-radius:12px;background:#eefaf1;color:#0d5f36}body.senior .v21yes{font-size:2.1em}
.v21face{font-size:3em;text-align:center}
.v21card{--h:200;position:relative;overflow:hidden;border-radius:20px;padding:18px;margin:0 0 12px;color:#0b2350;touch-action:manipulation;
 background:repeating-radial-gradient(circle at 30% 40%,hsla(var(--h),70%,80%,.55) 0 2px,transparent 2px 9px),linear-gradient(135deg,hsl(var(--h),70%,88%),hsl(calc(var(--h) + 60),70%,82%));box-shadow:0 6px 18px #0002}
.v21holo{position:absolute;right:14px;top:12px;font-size:2.6em;animation:v21sp 4s linear infinite;filter:hue-rotate(0)}
@keyframes v21sp{50%{transform:scale(1.12) rotate(6deg)}}
.v21flag{width:54px;height:34px;display:flex;flex-direction:column;animation:v21wave 1.6s ease-in-out infinite;transform-origin:left}.v21flag i{flex:1;background:#fff}.v21flag i+i{background:#dc143c}
@keyframes v21wave{50%{transform:skewY(6deg) scaleX(.94)}}
.v21name{font:800 1.3em system-ui;margin:10px 0 4px}.v21clock{font:700 1.4em ui-monospace,monospace}.v21word{font:800 1.1em system-ui;letter-spacing:.2em;margin:4px 0}
.v21valid{color:#0d7a3e;font-weight:800}body.senior .v21name{font-size:1.7em}body.senior .v21clock{font-size:1.9em}
.v21rip{position:absolute;width:20px;height:20px;margin:-10px;border-radius:50%;border:3px solid #fff;animation:v21r .9s ease-out forwards;pointer-events:none}@keyframes v21r{to{transform:scale(14);opacity:0}}
.v21warn{background:#fdecea;border-radius:14px;padding:12px;margin:10px 0}
.v21tabs{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px}.v21tabs a{padding:8px 12px;border-radius:999px;background:#eef3ff;color:#0b3d91;text-decoration:none;font-weight:700}.v21tabs a.on{background:#0b3d91;color:#fff}body.senior .v21tabs a{font-size:1.15em;padding:12px 16px}
.v21steps li{margin:0 0 8px;line-height:1.45}
.v21cmp{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.v21cmp>div{background:#fff;border-radius:14px;padding:10px}.v21cmp ul{padding-left:16px;margin:4px 0}body.senior .v21cmp{grid-template-columns:1fr;font-size:1.12em}
body.contrast .v21more,body.contrast .v21opt,body.contrast .v21qr,body.contrast .v21cmp>div,body.contrast .v21hero,body.contrast .v21warn{background:#000;color:#fff;border:2px solid #fff}
@media (prefers-reduced-motion:reduce){.v21holo,.v21flag{animation:none}}
`;document.head.appendChild(st);
inject();route();
})();
