// ===== v28: szkolenia wGotowości i „Czy portfel unijny zastąpi mObywatela?” =====
// Koncepcja własna (Tomasz Krawczyk). Inspiracja (rozwinięta, nie skopiowana):
// https://x.com/WCR_NowyTarg/status/2123393355761569916
// https://x.com/WCRCiechanow/status/2119733099751973219
// https://x.com/mObywatelGOV/status/2122683937017253946
// https://x.com/KGawkowski/status/2122701180379828629
// https://x.com/INFORPL/status/2123434465191997579
// https://x.com/polskieradiopl/status/2120056550794412212
// Fakty tylko ze stron gov.pl. Symulacje oznaczone DEMO. Nic nie jest wysyłane.
// Łańcuch Gemma → reguły → Bielik i pobieranie Bielika bez zmian.
(function(){
const DEMO='<span class="v28tag">DEMO</span>';
const MON='https://www.gov.pl/web/obrona-narodowa/trwa-program-szkolen-obronnych-wgotowosci-dzis-bezpieczni-jutro';
const MON2='https://www.gov.pl/web/obrona-narodowa/wgotowosci---bezplatne-jednodniowe-szkolenia-dla-obywateli';
const MC_ZAPIS='https://www.gov.pl/web/cyfryzacja/zapisy-na-szkolenia-obronne--nowa-usluga-w-aplikacji-mobywatel';
const WP='https://www.wojsko-polskie.pl/wgotowosci';
const MC_EPTC='https://www.gov.pl/web/cyfryzacja/rzad-przyjal-projekt-ustawy-o-europejskim-portfelu-tozsamosci-cyfrowej';
const PREMIER='https://www.gov.pl/web/premier/projekt-ustawy-o-zmianie-ustawy-o-uslugach-zaufania-oraz-identyfikacji-elektronicznej-oraz-niektorych-innych-ustaw3';
const PILLARS=[
 {id:'bezpieczenstwo',i:'🛡️',t:'Bezpieczeństwo',p:'Jak przygotować siebie, bliskich i dom: awarie, katastrofy, sytuacje kryzysowe, alarmy, plan ewakuacji i podstawy pierwszej pomocy.'},
 {id:'medycyna',i:'🩺',t:'Medycyna',p:'Szybkie działanie przy zagrożeniu życia: resuscytacja, postępowanie w kryzysie, opatrywanie ran.'},
 {id:'przetrwanie',i:'🌲',t:'Przetrwanie',p:'Nawigacja w terenie, znaki ostrzegawcze, uzdatnianie wody, ogień, schronienie w środowisku naturalnym.'},
 {id:'cyberhigiena',i:'🔐',t:'Cyberhigiena',p:'Ochrona danych, rozpoznawanie dezinformacji i phishingu, złośliwe oprogramowanie i ostrożne korzystanie ze sztucznej inteligencji.'}
];
const USES=[
 ['🏦','Konto bankowe w innym kraju UE','Otworzenie konta bez osobnego, krajowego sposobu logowania.'],
 ['📱','Karta SIM', 'Aktywacja karty SIM za granicą.'],
 ['🏨','Hotel','Zameldowanie w hotelu wybranymi danymi, nie całym dokumentem.'],
 ['💊','Polska recepta za granicą','Potwierdzenie tożsamości przy realizacji polskiej recepty w innym państwie UE.'],
 ['✍️','Podpis kwalifikowany','Składanie bezpłatnego kwalifikowanego podpisu elektronicznego uznawanego w Unii.']
];
function top(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/)[0]}
function sub(){return decodeURIComponent((location.hash.split('/')[2]||'').split('?')[0])}
function persona(){return (typeof S!=='undefined'&&S.persona)||'anna'}
function P(){try{return (typeof PERS!=='undefined'&&PERS[persona()])||{}}catch(e){return {}}}
function city(){return P().city||'Twojej okolicy'}
function ext(href,label,cls){return `<a class="btn ${cls||''} v28b" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`}
function srcWg(){return `<div class="card"><h3>Skąd to wiemy</h3><p class="muted">Ministerstwo Obrony Narodowej, gov.pl, 18.09.2026 i 19.09.2026: program jest bezpłatny i dobrowolny, trwa 8 godzin, ma cztery obszary, nie wiąże się ze służbą wojskową ani z przysięgą, szkolenia zaplanowano do końca listopada 2026 r. Zapisy indywidualne: aplikacja mObywatel albo aplikacja #wGotowości. Zapisy grupowe: formularz na stronie programu. <a href="${MON}" target="_blank" rel="noopener">MON, 18.09.2026</a> · <a href="${MON2}" target="_blank" rel="noopener">MON, 19.09.2026</a> · <a href="${MC_ZAPIS}" target="_blank" rel="noopener">Ministerstwo Cyfryzacji, 06.11.2025</a> (ścieżka w mObywatelu) · <a href="${WP}" target="_blank" rel="noopener">wojsko-polskie.pl/wgotowosci</a>.</p>
<p class="muted">Wiek uczestników: strona MON z 18.09.2026 mówi o osobach od 13. roku życia. Komunikat MC z 06.11.2025 o zapisach przez mObywatela mówi o pełnoletnich obywatelach z mDowodem. Część Wojskowych Centrów Rekrutacji w listopadzie 2026 r. nadal pisze o osobach pełnoletnich. Przed zapisem sprawdź aktualne zasady na stronie programu. To nie jest porada prawna.</p></div>`}
function srcEu(){return `<div class="card"><h3>Skąd to wiemy</h3><p class="muted">17.11.2026 Rada Ministrów przyjęła projekt ustawy o Europejskim Portfelu Tożsamości Cyfrowej. To projekt, nie obowiązująca jeszcze ustawa. <a href="${MC_EPTC}" target="_blank" rel="noopener">Ministerstwo Cyfryzacji, 17.11.2026</a> · <a href="${PREMIER}" target="_blank" rel="noopener">Kancelaria Premiera, 17.11.2026</a>. Skrót praw z rozporządzenia (UE) 2024/1183 jest w <a href="#/prawa-portfela">„Twoje prawa przy portfelu”</a>.</p></div>`}

S.v28=S.v28||{sign:{},wiek:'age'};
function signed(){return !!(S.v28.sign&&S.v28.sign[persona()])}
function familyRows(){
 const me=P();
 const rows=[{who:me.full||'Ty',rel:'Ty',age:me.age,city:me.city,key:persona()}];
 if(persona()==='halina')rows.push({who:'Zofia Wrona',rel:'mama',age:84,city:'Lublin',key:'zofia'});
 if(persona()==='anna')rows.push({who:'Bliska osoba z rodziny',rel:'pomoc (bez wymyślonych danych dzieci)',age:null,city:me.city,key:'bliscy'});
 return rows.map(r=>{
  const mine=r.key===persona();
  const st=mine&&signed()?'Zapis demonstracyjny na tym telefonie':'Brak zapisu w tym pokazie';
  const btn=mine
   ?`<a class="btn ${signed()?'sec':'v28b'}" href="#/wgotowosci-zapis">${signed()?'Zobacz zapis DEMO':'Pokaż, jak się zapisać'}</a>`
   :`<a class="btn sec" href="#/wgotowosci-zapis">Pokaż kroki dużym tekstem</a>`;
  const age=r.age!=null?`, ${r.age} lat`:'';
  return `<div class="v28fam"><div><b>${esc(r.who)}</b><small>${esc(r.rel)}${age}${r.city?' · '+esc(r.city):''}</small><span class="muted">${st}</span></div>${btn}</div>`;
 }).join('');
}

function hub(){
 const c=city();
 shell('🛡️ Szkolenia wGotowości',`
 <div class="alert b">ℹ️<div><b>Bezpłatne, dobrowolne szkolenie cywilne.</b> To nie jest wstąpienie do wojska i nie składa się przysięgi. Służba w WOT jest osobną sprawą: <a href="#/flow/wot">WOT przez WCR</a>.</div></div>
 <div class="card v28card">
  <span class="v28tag">Program Ministerstwa Obrony Narodowej</span>
  <h3>wGotowości – dziś. Bezpieczni jutro</h3>
  <p>Osiem godzin z wojskowymi instruktorami, zwykle w weekend, w jednostkach w całym kraju. Cztery obszary: bezpieczeństwo, medycyna, przetrwanie i cyberhigiena. Potwierdzenie przychodzi e-mailem. Po zajęciach jest certyfikat.</p>
  <p>Według MON szkolenia zaplanowano <b>do końca listopada 2026 r.</b> Sprawdź aktualne terminy na stronie programu albo w mObywatelu.</p>
  <a class="btn v28b" href="#/wgotowosci-zapis">Jak się zapisać – krok po kroku</a>
  ${ext(WP,'Otwórz stronę programu (wojsko-polskie.pl)','sec')}
 </div>
 <div class="card v28card"><h3>Cztery obszary</h3>
  <div class="v28grid">${PILLARS.map(x=>`<div class="v28pill"><b>${x.i} ${x.t}</b><p>${x.p}</p></div>`).join('')}</div>
  <p class="muted">Opisy obszarów pochodzą ze stron MON (wrzesień 2026). Prototyp nie prowadzi tych zajęć.</p>
 </div>
 <div class="card v28card"><h3>Rodzina w tym pokazie</h3>
  <p class="muted">Status zapisu jest tylko na tym telefonie (${DEMO}). Nic nie zostało wysłane do wojska ani do mObywatela.</p>
  ${familyRows()}
 </div>
 <div class="card v28card"><h3>Przykładowy termin w okolicy ${esc(c)}</h3>
  <p><b>Sobota, przykład DEMO</b> — jednostka w okolicy ${esc(c)}. To <b>nie jest prawdziwy nabór</b>. Prawdziwe miejsce i godzinę wybierzesz w mObywatelu albo na stronie programu.</p>
  <button type="button" class="btn sec" onclick="v28Ics()">Zapisz przypomnienie DEMO do kalendarza (.ics)</button>
  <p class="muted">Plik powstaje w przeglądarce. W tytule wydarzenia jest słowo DEMO.</p>
 </div>
 <div class="card v28card"><h3>Obok szkoleń</h3>
  <p class="muted">Po treningu warto wiedzieć, gdzie się ukryć i co robić przy alarmie.</p>
  <a class="btn ghost v28b" href="#/schronienie">Gdzie się ukryć – mapa PSP</a>
  <a class="btn ghost v28b" href="#/alarm">Tryb alarmowy</a>
  <a class="btn ghost v28b" href="#/plan">Plan rodzinny</a>
 </div>
 ${srcWg()}`,{tab:'security'});
}

function zapis(){
 const st=signed();
 shell('📝 Zapis na szkolenie',`
 <div class="alert b">ℹ️<div><b>Prawdziwego zapisu ten prototyp nie wykona.</b> Poniżej jest oficjalna ścieżka z komunikatu Ministerstwa Cyfryzacji oraz pokaz DEMO, który zostaje tylko na tym telefonie.</div></div>
 <div class="card v28card">
  <h3>W prawdziwym mObywatelu</h3>
  <ol class="v28steps">
   <li>Wejdź w <b>Usługi</b>.</li>
   <li>W kategorii <b>Bezpieczeństwo</b> wybierz <b>Szkolenia obronne</b>.</li>
   <li>Wybierz <b>Indywidualne szkolenia obronne</b> i przeczytaj informacje.</li>
   <li>Naciśnij <b>Zgłoś się</b>.</li>
   <li>Wybierz typ: podstawowy kurs bezpieczeństwa, kurs przetrwania, kurs medyczny albo kurs cyberhigieny.</li>
   <li>Wskaż na mapie miejsce, sprawdź datę i potwierdź.</li>
   <li>Podaj dane kontaktowe. Potwierdzenie przychodzi e-mailem. Gdy kurs jest pełny, można trafić na listę rezerwową. Zapis w aplikacji da się później anulować.</li>
  </ol>
  <p class="muted">Źródło ścieżki: <a href="${MC_ZAPIS}" target="_blank" rel="noopener">MC, 06.11.2025</a>. Grupy (firmy, szkoły, urzędy) zapisują się formularzem na stronie programu, nie przez ten pokaz.</p>
  ${ext(MC_ZAPIS,'Otwórz komunikat o zapisach w mObywatelu','sec')}
  ${ext(WP,'Strona programu wGotowości','ghost')}
 </div>
 <div class="card v28card">
  <h3>Pokaz na tym telefonie ${DEMO}</h3>
  <p>${st?'W tym pokazie jest już zapis demonstracyjny dla '+esc(P().full||'tej osoby')+'. Nic nie poszło do wojska.':'Przycisk tylko oznacza na tym telefonie, że przerobiłaś albo przerobiłeś kroki. Żaden wniosek nie wychodzi z przeglądarki.'}</p>
  ${st
    ?`<button type="button" class="btn sec" onclick="v28Unsign()">Usuń zapis DEMO z tego telefonu</button>`
    :`<button type="button" class="btn v28b" onclick="v28Sign()">Oznacz pokaz jako przerobiony (DEMO)</button>`}
  <button type="button" class="btn ghost" onclick="v28Ics()">Przypomnienie DEMO do kalendarza</button>
 </div>
 <p class="muted"><a href="#/wgotowosci">← Wróć do szkoleń</a> · <a href="#/flow/wot">To nie jest zgłoszenie do WOT</a></p>
 ${srcWg()}`,{tab:'security'});
}

function eudi(){
 shell('🇪🇺 Portfel unijny a mObywatel',`
 <div class="alert b">⚖️<div><b>Projekt ustawy, jeszcze nie obowiązujące prawo.</b> Rada Ministrów przyjęła projekt 17.11.2026. Sejm go jeszcze nie uchwalił. Nic z poniższego nie działa dziś w tym prototypie poza wyjaśnieniem i pokazem.</div></div>
 <div class="card v28card">
  <span class="v28tag">Pytanie z ostatnich dni</span>
  <h3>Czy Europejski Portfel Tożsamości Cyfrowej zastąpi mObywatela?</h3>
  <p><b>Według komunikatów rządu: nie od razu i nie jako obowiązek.</b> Korzystanie z portfela ma być dobrowolne. W pierwszym etapie ma to być osobna aplikacja, dostępna także z mObywatela. Docelowo oba rozwiązania mają zostać połączone. Projekt zakłada dalszy rozwój mObywatela i utrzymanie dotychczasowych usług oraz sposobów potwierdzania tożsamości.</p>
  <ul class="v28list">
   <li>Portfel ma być częścią ekosystemu mObywatela (Ministerstwo Cyfryzacji).</li>
   <li>Sam zdecydujesz, jakie dane i komu udostępnisz.</li>
   <li>Ma powstać rejestr stron ufających, czyli instytucji i firm uprawnionych do występowania o określone dane.</li>
   <li>We wrześniu 2026 r. uruchomiono środowisko testowe Sandbox EPTC z demonstracyjną aplikacją mObywatel Europa. Do testów zgłosiło się 80 firm i instytucji.</li>
  </ul>
 </div>
 <div class="card v28card">
  <h3>Potwierdź wiek, nie cały dokument ${DEMO}</h3>
  <p>Projekt i komunikaty mówią o potwierdzaniu wieku, kwalifikacji i uprawnień bez oddawania wszystkich danych. To rozwinięcie zasady „tylko to, co potrzebne”, która w prototypie jest też w <a href="#/kto-pyta">„Kto pyta o moje dane”</a>.</p>
  <a class="btn v28b" href="#/potwierdz-wiek">Porównaj: cały dowód albo samo „pełnoletni”</a>
  <a class="btn sec" href="#/prawa-portfela">Twoje prawa przy portfelu europejskim</a>
 </div>
 <div class="card v28card">
  <h3>Co ma ułatwić za granicą (docelowo)</h3>
  <p class="muted">Poniższe przykłady są w komunikacie Kancelarii Premiera z 17.11.2026. To zamierzenia z projektu, nie usługi dostępne już dziś.</p>
  <div class="v28grid">${USES.map(x=>`<div class="v28pill"><b>${x[0]} ${x[1]}</b><p>${x[2]}</p></div>`).join('')}</div>
 </div>
 ${srcEu()}`,{tab:'more'});
}

function wiek(){
 const mode=S.v28.wiek||='age';
 const name=P().full||'Anna Kowalska';
 const pesel=(typeof U!=='undefined'&&U.pesel)||'90010112345 (DEMO)';
 const old=`<ul class="v28list"><li>Imię i nazwisko: <b>${esc(name)}</b></li><li>PESEL: <b>${esc(String(pesel))}</b></li><li>Data urodzenia i adres</li><li>Zdjęcie z dokumentu</li></ul><p class="v28bad">Sklep dostaje więcej, niż potrzebuje do sprawdzenia wieku.</p>`;
 const neu=`<ul class="v28list"><li>Osoba pełnoletnia: <b>tak</b></li><li>Imienia, PESEL-u, daty urodzenia i adresu <b>nie widać</b></li></ul><p class="v28ok">Według projektu portfela wystarcza informacja niezbędna do usługi, na przykład o wieku.</p>`;
 shell('🪪 Potwierdź tylko wiek',`
 <div class="alert b">ℹ️<div><b>Pokaz DEMO, usługa jeszcze nie działa.</b> Opiera się na projekcie ustawy przyjętym 17.11.2026 i na komunikatach o potwierdzaniu wieku bez pozostałych danych. Nic nie jest udostępniane.</div></div>
 <div class="card v28card">
  <h3>Strona albo kasa pyta: czy masz ukończone 18 lat?</h3>
  <div class="v28tabs">
   <button type="button" class="${mode==='old'?'on':''}" onclick="v28Wiek('old')">Dawny sposób: cały dokument</button>
   <button type="button" class="${mode==='age'?'on':''}" onclick="v28Wiek('age')">Z portfela: tylko pełnoletność</button>
  </div>
  <div class="v28cmp">${mode==='old'?old:neu}</div>
  <p class="muted">To nie jest prawdziwe udostępnienie. PESEL w pokazie jest fikcyjny. Żądania od sklepu, banku albo hotelu zostają w <a href="#/kto-pyta">„Kto pyta o moje dane”</a>.</p>
  <a class="btn sec" href="#/portfel-unijny">Wróć do wyjaśnienia projektu</a>
 </div>
 ${srcEu()}`,{tab:'wallet'});
}

window.v28Wiek=function(m){S.v28.wiek=m;try{save()}catch(e){}wiek()};
window.v28Sign=function(){S.v28.sign=S.v28.sign||{};S.v28.sign[persona()]=new Date().toISOString();try{save()}catch(e){}toast('Zapis demonstracyjny tylko na tym telefonie. Nic nie zostało wysłane.');zapis()};
window.v28Unsign=function(){if(S.v28.sign)delete S.v28.sign[persona()];try{save()}catch(e){}toast('Usunięto zapis DEMO z tego telefonu.');zapis()};
window.v28Ics=function(){
 const title='DEMO: szkolenie wGotowości (przykład, nieprawdziwy termin)';
 const desc='Koncepcja mObywatel. To nie jest prawdziwy nabór. Prawdziwy zapis zrobisz w aplikacji mObywatel albo na wojsko-polskie.pl/wgotowosci. Nic nie zostało wysłane.';
 const escape=s=>String(s).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const p=n=>String(n).padStart(2,'0');
 const d=new Date();
 const stamp=d.getUTCFullYear()+p(d.getUTCMonth()+1)+p(d.getUTCDate())+'T'+p(d.getUTCHours())+p(d.getUTCMinutes())+p(d.getUTCSeconds())+'Z';
 // Przykładowa sobota po 21.11.2026, wyraźnie DEMO — nie jest to ogłoszony termin MON.
 const day='20261128';
 const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-mObywatel-koncepcja-v28-DEMO-','BEGIN:VEVENT','UID:v28-demo-'+persona()+'@mobywatel-koncepcja','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+day,'SUMMARY:'+escape(title),'DESCRIPTION:'+escape(desc+' Miasto w pokazie: '+(city()||'')+'.'),'END:VEVENT','END:VCALENDAR'].join('\r\n');
 const b=new Blob([ics],{type:'text/calendar'});
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='wgotowosci-demo.ics';document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(a.href),1000);
 toast('Plik kalendarza zapisany w przeglądarce (DEMO). Nic nie wysłano.');
};

const ANS_WG='Program wGotowości to bezpłatne, dobrowolne, zwykle weekendowe szkolenie cywilne MON (ok. 8 godzin): bezpieczeństwo, medycyna, przetrwanie i cyberhigiena. To nie jest służba wojskowa i nie składa się przysięgi. Zapisy indywidualne: w mObywatelu Usługi → Bezpieczeństwo → Szkolenia obronne → Zgłoś się, albo w aplikacji wGotowości. Według MON szkolenia zaplanowano do końca listopada 2026 r. — sprawdź aktualny termin na stronie programu. Otworzę przewodnik. Odpowiedź z reguł w telefonie, bez AI.';
const ANS_EU='17 listopada 2026 r. rząd przyjął projekt ustawy o Europejskim Portfelu Tożsamości Cyfrowej. To jeszcze nie obowiązujące prawo. Z komunikatów wynika, że korzystanie ma być dobrowolne, a portfel na początku ma być osobną aplikacją dostępną także z mObywatela, docelowo połączoną z nim; dotychczasowe usługi mObywatela mają zostać. Otworzę wyjaśnienie i pokaz „potwierdź tylko wiek”. Odpowiedź z reguł w telefonie, bez AI.';

function v28Rule(q){
 let l='';try{l=norm(q)}catch(e){l=String(q||'').toLowerCase()}
 if(!l)return null;
 if(/wot|przysieg|sluzb\w* (wojsk|terytor)|terytorialn\w* sluzb|dobrowoln\w* zasadnicz|aktywna rezerwa/.test(l)&&!/wgotowosc|szkolen\w* obronn|szkolen\w* cywiln/.test(l))return null;
 if(/wgotowosc|w gotowosci|#wgotowosci|szkolen\w* obronn|szkolen\w* cywiln|kurs (medyczn|przetrwani|cyberhigien)|zapisz.{0,24}szkolen/.test(l))return ['#/wgotowosci',ANS_WG];
 if(/zastapi (mobywatel|m obywatel)|portfel\w* (unijn|europej|tozsamosci)|europejsk\w* portfel|eptc|mobywatel europa|ustaw\w* o (europejskim )?portfel/.test(l))return ['#/portfel-unijny',ANS_EU];
 if(/potwierdz\w* (tylko )?wiek|pelnoletn|pełnoletn\w* bez (pesel|danych)|wiek bez (danych|pesel|dokumentu)/.test(l))return ['#/potwierdz-wiek','W pokazie widać różnicę: cały dokument albo samo potwierdzenie pełnoletniości, zgodnie z projektem ustawy z 17.11.2026. To DEMO, usługa jeszcze nie działa. Otworzę porównanie. Odpowiedź z reguł w telefonie, bez AI.'];
 return null;
}
window.v28Rule=v28Rule;

const LEAD=(id,href,title,sub)=>`<a id="${id}" class="v28lead" href="${href}"><b>${title}</b><small>${sub}</small></a>`;
function inject(){
 const sc=app&&app.querySelector('.scroll');if(!sc)return;
 const p=top(),sp=sub();
 if((p==='security'||p==='alarm'||p==='plan'||p==='kit'||p==='sos')&&!sc.querySelector('#v28sec')){
  const subTxt=p==='alarm'?'Szkolenie cywilne MON, nie schron. Bezpłatne, dobrowolne, bez przysięgi.':'Bezpłatne szkolenie cywilne MON do końca listopada 2026 r. (sprawdź aktualny termin).';
  const html=LEAD('v28sec','#/wgotowosci','🛡️ Szkolenia wGotowości',subTxt);
  const after=sc.querySelector('#v27sec,#v27alarm,#v27plan,#v27kit,#v27sos,#v20sec');
  if(after)after.insertAdjacentHTML('afterend',html);else sc.insertAdjacentHTML('afterbegin',html);
 }
 if(p==='flow'&&sp==='wot'&&!sc.querySelector('#v28wot')){
  sc.insertAdjacentHTML('afterbegin',`<div id="v28wot" class="card v28card"><h3>Chcesz tylko szkolenie, bez służby?</h3><p>Program <b>wGotowości</b> jest bezpłatny i dobrowolny. Według MON nie zostaje się żołnierzem i nie składa się przysięgi. Zgłoszenie do WOT poniżej to osobna ścieżka.</p><a class="btn v28b" href="#/wgotowosci">Szkolenia wGotowości</a></div>`);
 }
 if((p==='prawa-portfela'||p==='kto-pyta')&&!sc.querySelector('#v28eu')){
  sc.insertAdjacentHTML('afterbegin',LEAD('v28eu','#/portfel-unijny','🇪🇺 Czy portfel unijny zastąpi mObywatela?','Projekt ustawy z 17.11.2026: dobrowolny, na początku osobna aplikacja przy mObywatelu.'));
 }
 if(p==='assistant'&&!document.getElementById('v28chip')){
  const chips=[...sc.querySelectorAll('.chips')].filter(c=>!c.closest('.chat')&&!c.closest('.msg'));
  const box=chips[chips.length-1];
  if(box)box.insertAdjacentHTML('beforeend','<button type="button" class="chip" id="v28chip" onclick="ask(\'szkolenia wGotowości\')">wGotowości</button><button type="button" class="chip" id="v28chip2" onclick="ask(\'czy portfel unijny zastąpi mObywatela\')">Portfel unijny?</button>');
 }
 const more=document.getElementById('v19more');
 if(more&&!more.querySelector('[data-v28tile]')){
  const g=[...more.querySelectorAll('.v19g')].find(d=>/Kryzys/.test((d.querySelector('summary')||{}).textContent||''));
  const grid=g&&g.querySelector('.grid');
  if(grid){grid.insertAdjacentHTML('afterbegin','<button type="button" class="tile" data-v28tile="1" onclick="location.hash=\'#/wgotowosci\'"><b>🛡️</b>wGotowości</button>');const n=g.querySelector('summary .muted');if(n)n.textContent=String(grid.querySelectorAll('.tile').length)}
  const g2=[...more.querySelectorAll('.v19g')].find(d=>/Dokument|Dane|Prawo/.test((d.querySelector('summary')||{}).textContent||''));
  const grid2=g2&&g2.querySelector('.grid');
  if(grid2&&!grid2.querySelector('[data-v28eu]')){grid2.insertAdjacentHTML('afterbegin','<button type="button" class="tile" data-v28eu="1" onclick="location.hash=\'#/portfel-unijny\'"><b>🇪🇺</b>Portfel unijny</button>');const n=g2.querySelector('summary .muted');if(n)n.textContent=String(grid2.querySelectorAll('.tile').length)}
 }
}

const _ask=ask;
ask=async function(q){const hit=v28Rule(q);if(!hit)return _ask.apply(this,arguments);q=(q||'').trim();if(!q)return;if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});window.v14Last={k:'rules',fb:false,shown:1};chat.push({r:'a',t:hit[1]+'<br><b>Czy chcesz kontynuować?</b>',act:hit[0]});drawChat();try{speak(String(hit[1]).replace(/<[^>]+>/g,''))}catch(e){}};
window.ask=ask;
if(window.v18Route){const _v=window.v18Route;window.v18Route=function(q){const hit=v28Rule(q);if(hit)return {kind:'act',hit:[null,hit[0],hit[1]],act:hit[0]};return _v(q)}}
try{
 INT.unshift([/wgotowosc|szkolen\w* obronn/i,'#/wgotowosci',ANS_WG],[/portfel\w* (unijn|europej|tozsamosci)|zastapi mobywatel/i,'#/portfel-unijny',ANS_EU]);
 ALL.push(['🛡️','Szkolenia wGotowości','#/wgotowosci','wgotowości szkolenie obronne cywilne mon medycyna przetrwanie cyberhigiena'],['🇪🇺','Czy portfel unijny zastąpi mObywatela?','#/portfel-unijny','eudi eptc europejski portfel tożsamości ustawa mObywatel Europa wiek']);
}catch(e){}

const R={'wgotowosci':hub,'w-gotowosci':hub,'szkolenia-obronne':hub,'wgotowosci-zapis':zapis,'portfel-unijny':eudi,'potwierdz-wiek':wiek,'eudi-ustawa':eudi};
const _r=route;
route=function(){const p=top();if(R[p]){try{clearInterval(threatT)}catch(e){}try{clearInterval(camT)}catch(e){}R[p]();try{inject()}catch(e){}return}const out=_r.apply(this,arguments);try{inject()}catch(e){}return out};
window.route=route;onhashchange=route;
new MutationObserver(()=>{try{inject()}catch(e){}}).observe(app,{childList:true,subtree:true});
const st=document.createElement('style');st.textContent=`
.v28tag{display:inline-block;background:#eef2f8;color:#24324a;border:1px solid #c9d3e3;border-radius:8px;padding:2px 8px;font-size:.78em;font-weight:700;margin-bottom:6px}
.v28card .btn.v28b,.v28card .btn,.v28fam .btn{display:block;text-align:center;text-decoration:none;margin:8px 0;min-height:48px;line-height:1.3;box-sizing:border-box}
.v28steps{margin:0;padding-left:20px}.v28steps li{margin:0 0 8px;line-height:1.45}
.v28list{margin:0;padding-left:20px}.v28list li{margin:0 0 6px;line-height:1.4}
.v28grid{display:grid;gap:10px}
.v28pill{background:#f4f7fb;border:1px solid #d5deee;border-radius:14px;padding:12px}.v28pill p{margin:6px 0 0;line-height:1.4}
.v28fam{display:flex;flex-direction:column;gap:6px;border:1px solid #d5deee;border-radius:14px;padding:12px;margin:8px 0}.v28fam small,.v28fam .muted{display:block}
.v28lead{display:flex;flex-direction:column;gap:3px;text-decoration:none;border-radius:16px;padding:14px;margin:0 0 10px;background:#fff;color:#14213d;border:1.5px solid #d5deee;box-shadow:0 1px 3px #0001}
.v28lead b{color:#0b3d91;font-size:1.12em}.v28lead small{font-weight:650;line-height:1.35}
.v28tabs{display:flex;flex-direction:column;gap:8px;margin:10px 0}
.v28tabs button{min-height:48px;border-radius:12px;border:1.5px solid #c9d3e3;background:#fff;font-weight:700;padding:10px}
.v28tabs button.on{background:#0b3d91;color:#fff;border-color:#0b3d91}
.v28cmp{margin-top:8px}
.v28bad{color:#8a1c1c;font-weight:700}.v28ok{color:#0d5c2e;font-weight:700}
.v28lead:focus-visible,.v28b:focus-visible,.v28tabs button:focus-visible{outline:3px solid #14213d;outline-offset:3px}
body.senior .v28lead{padding:18px}body.senior .v28lead b{font-size:1.4em}body.senior .v28lead small{font-size:1.05em}
body.senior .v28card .btn,body.senior .v28fam .btn,body.senior .v28tabs button{min-height:64px;font-size:1.2em;padding:16px}
body.senior .v28card p,body.senior .v28steps li,body.senior .v28list li,body.senior .v28pill p{font-size:1.15em}
body.contrast .v28lead,body.contrast .v28tag,body.contrast .v28pill,body.contrast .v28fam{background:#000;color:#fff;border-color:#fff}body.contrast .v28lead b{color:#ffeb3b}
body.contrast .v28tabs button{background:#000;color:#fff;border-color:#fff}body.contrast .v28tabs button.on{background:#ffeb3b;color:#000}
`;document.head.appendChild(st);
try{inject()}catch(e){}
route();
})();
