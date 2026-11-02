// ===== v26: „Kupiłem/sprzedałem auto — co dalej?” + „Czy moja aplikacja jest gotowa?” =====
// Koncepcja własna. Terminy tylko z gov.pl, podatki.gov.pl i tekstu ustawy na eli.gov.pl.
// Gdzie liczby dni nie ma w źródle, widać „sprawdź termin”. Wersja aplikacji i system są symulacją (DEMO).
// Nic nie jest wysyłane. Łańcuch Gemma → reguły → Bielik i pobieranie Bielika bez zmian.
(function(){
S.v26=S.v26||{};
if(!S.v26.by)S.v26.by={};
if(!S.v26.guides)S.v26.guides={};
const DEMO='<span class="demo">DEMO</span>';
const DEMO_DUE='2026-12-15';
const SRC={
 rej:['Ministerstwo Infrastruktury: rejestracja pojazdu','https://www.gov.pl/web/infrastruktura/rejestracja-pojazdow/'],
 zbycie:['gov.pl: zgłoś zbycie pojazdu','https://www.gov.pl/web/gov/zglos-zbycie-lub-nabycie-pojazdu-na-przyklad-sprzedaz-kupno-darowizne'],
 pcc14:['PCC-3: 14 dni od powstania obowiązku','https://www.podatki.gov.pl/media/1crptyvc/pcc-3-06-08.pdf'],
 pccKto:['podatki.gov.pl: przy sprzedaży płaci kupujący','https://podatki.gov.pl/podatki-osobiste/pcc/informacje-podstawowe'],
 pccSt:['podatki.gov.pl: sprzedaż rzeczy ruchomych 2%','https://podatki.gov.pl/podatki-osobiste/pcc/stawki-i-limity'],
 pccZw:['podatki.gov.pl: zwolnienie do 1000 zł','https://podatki.gov.pl/podatki-osobiste/pcc/ulgi-i-zwolnienia'],
 pccVat:['podatki.gov.pl: PCC nie występuje przy VAT','https://www.podatki.gov.pl/en/vehicles-in-eu/vehicle-registration-tax/'],
 akcyza:['podatki.gov.pl: akcyza od samochodu','https://www.podatki.gov.pl/en/vehicles-in-eu/vehicle-registration-tax/'],
 oc32:['art. 32 ustawy o ubezpieczeniach obowiązkowych (Dz.U. 2023 poz. 2500)','https://eli.gov.pl/api/acts/DU/2023/2500/text.html'],
 oc31:['art. 31 po zmianie (Dz.U. 2025 poz. 1175)','https://eli.gov.pl/api/acts/DU/2025/1175/text.html']
};
const DEV={
 anna:{ver:'DEMO 26.0',fresh:true,os:'Android (pokaz)',osOk:true},
 piotr:{ver:'DEMO 26.0',fresh:true,os:'iOS (pokaz)',osOk:true},
 halina:{ver:'DEMO 24.1',fresh:false,os:'Android (pokaz)',osOk:true},
 kuba:{ver:'DEMO 26.0',fresh:true,os:'Android (pokaz)',osOk:true}
};
const GUIDE=[
 'Poproś bliską osobę, jeśli wolisz robić to razem.',
 'Otwórz sklep z aplikacjami: Sklep Play albo App Store.',
 'Wyszukaj: mObywatel.',
 'Stuknij „Aktualizuj”. Poczekaj, aż pasek dobiegnie końca.',
 'Otwórz mObywatela i zaloguj się tak jak zawsze.',
 'Gotowe, gdy aplikacja się otwiera. W tym pokazie nowsza wersja nazywa się DEMO 26.0.'
];
const CAR_ANS='Pokażę listę kroków od daty umowy: rejestracja, ciągłość OC i PCC-3 albo zgłoszenie sprzedaży. Termin, którego nie mam w gov.pl albo podatki.gov.pl, oznaczę „sprawdź termin”. Możesz pomóc członkowi rodziny i zapisać terminy do kalendarza. Ta odpowiedź jest z reguł w telefonie, bez AI. DEMO.';
const READY_ANS='Pokażę w tym pokazie wersję aplikacji, system i ważność dokumentów oraz listę „co zrobić i do kiedy”. W rodzinie widać, gdy starsza osoba potrzebuje aktualizacji — można zostawić jej duże kroki. Wersja i system są symulacją. Ta odpowiedź jest z reguł w telefonie, bez AI. DEMO.';

function segs(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/).filter(Boolean)}
function top(){return segs()[0]||'home'}
function persona(){return S.persona||'anna'}
function P(id){return (typeof PERS!=='undefined'&&PERS[id])||{name:id,full:id,age:'',city:''}}
function devOf(id){return DEV[id]||DEV.anna}
function blank(){return {mode:'kupilem',date:'',from:'prywatna',basis:'pl',ocEnd:'',st:{}}}
function rec(){const id=persona();S.v26.by[id]=Object.assign(blank(),S.v26.by[id]||{});if(!S.v26.by[id].st)S.v26.by[id].st={};return S.v26.by[id]}
function parseYmd(s){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');if(!m)return null;const d=new Date(+m[1],+m[2]-1,+m[3]);if(d.getFullYear()!==+m[1]||d.getMonth()!==+m[2]-1||d.getDate()!==+m[3])return null;return d}
function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function plusDays(s,n){const d=parseYmd(s);if(!d)return null;d.setDate(d.getDate()+n);return ymd(d)}
function plDate(s){const d=parseYmd(s);if(!d)return '';return String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear()}
function parseUntil(s){let m=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s||'').trim());if(m)return m[3]+'-'+m[2]+'-'+m[1];m=/^(\d{4}-\d{2}-\d{2})/.exec(String(s||''));return m?m[1]:null}
function leftTxt(n){if(n<0){const k=-n;return 'po terminie o '+k+' '+(k===1?'dzień':'dni')}if(n===0)return 'ostatni dzień';if(n===1)return 'został 1 dzień';const u=n%10,v=n%100;if(u>=2&&u<=4&&!(v>=12&&v<=14))return 'zostały '+n+' dni';return 'zostało '+n+' dni'}
function clockTxt(){try{return plDate(ymd(today))}catch(e){return '23.10.2026'}}
function say(t){try{speak(t)}catch(e){}}
function srcLine(items){return `<p class="v26src">Źródło: ${items.map(x=>`<a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>`).join(' · ')}</p>`}
function docIssues(){if(typeof window.v23Docs!=='function')return [];try{const pack=window.v23Docs();return (pack.mine||[]).filter(d=>d.st==='soon'||d.st==='refresh'||d.st==='gone'||d.st==='blocked')}catch(e){return []}}
function readyOf(id){
 const dev=devOf(id),docs=id===persona()?docIssues():[];
 let level='ok',line='W tym pokazie aplikacja jest gotowa.';
 if(!dev.fresh){level='bad';line='Trzeba zaktualizować aplikację. Termin w pokazie: '+plDate(DEMO_DUE)+'.'}
 else if(!dev.osOk){level='bad';line='System w pokazie wymaga sprawdzenia.'}
 else if(docs.length){level='warn';line='Aplikacja w pokazie jest aktualna. Dokumenty wymagają uwagi ('+docs.length+').'}
 return {level,line,dev,docs};
}
function people(){return typeof PERS!=='undefined'?Object.keys(PERS):['anna','piotr','halina','kuba']}

function buildSteps(r){
 r=r||rec();const steps=[];const add=s=>steps.push(s);const dated=(base,n)=>base?plusDays(base,n):null;
 if(r.mode==='sprzedalem'){
  add({id:'zbycie',kind:r.date?'task':'check',title:'Zgłoś sprzedaż w urzędzie',due:dated(r.date,30),
   plain:'Masz 30 dni kalendarzowych od umowy. Zgłoszenie składa dotychczasowy właściciel. Na gov.pl: osoba, która tego nie zrobi, może zapłacić 250 zł.',
   more:'Od 1 stycznia 2024 r. nabywca nie zgłasza samego nabycia. Rejestruje pojazd. To jego sprawa.',
   src:[SRC.zbycie],href:'#/agent/auto',hrefLabel:'Lista „Sprzedaję samochód”'});
  add({id:'ubezp',kind:r.date?'task':'check',title:'Powiadom ubezpieczyciela OC',due:dated(r.date,14),
   plain:'W ciągu 14 dni od przeniesienia własności napisz do ubezpieczyciela i podaj dane nabywcy: imię, nazwisko, adres i PESEL.',
   more:'Do czasu powiadomienia sprzedający i kupujący odpowiadają solidarnie za składkę za ten okres.',
   src:[SRC.oc32],href:'#/oc',hrefLabel:'OC tego pojazdu'});
  add({id:'potw',kind:'check',title:'Przekaż nabywcy potwierdzenie OC',due:null,
   plain:'Ustawa każe przekazać potwierdzenie zawarcia OC. Liczbę 14 dni przypisuje do powiadomienia ubezpieczyciela, dlatego tu jest „sprawdź termin”.',
   more:'',src:[SRC.oc32],href:'#/oc',hrefLabel:'Podgląd OC'});
  return steps;
 }
 const basis=r.basis||'pl';
 const regN=basis==='spadek'?60:basis==='obrot'?90:30;
 const regWhy=basis==='spadek'?'60 dni od prawomocnego orzeczenia albo aktu poświadczenia dziedziczenia.':
  basis==='obrot'?'90 dni, gdy właścicielem jest przedsiębiorca prowadzący obrót pojazdami. Liczę od daty nabycia.':
  basis==='ue'?'30 dni od sprowadzenia pojazdu z kraju Unii Europejskiej.':
  basis==='poza'?'30 dni od dopuszczenia do obrotu przez Krajową Administrację Skarbową.':
  '30 dni od nabycia pojazdu w Polsce.';
 add({id:'rej',kind:r.date?'task':'check',title:'Zarejestruj pojazd na siebie',due:dated(r.date,regN),
  plain:regWhy+' Wniosek składasz tam, gdzie rejestruje się pojazdy.',
  more:'Gdy sprzedasz auto, zanim ten termin minie, obowiązek rejestracji przechodzi na kolejnego właściciela.',
  src:[SRC.rej],href:'#/flow/auto',hrefLabel:'Rejestracja auta (DEMO)'});
 const ocDue=parseYmd(r.ocEnd)?r.ocEnd:null;
 add({id:'oc',kind:ocDue?'task':'check',title:'Pilnuj ciągłości OC',due:ocDue,
  plain:ocDue?'Polisa poprzedniego właściciela działa do tej daty, chyba że wypowiesz ją na piśmie. Po wypowiedzeniu własne OC ma obowiązywać od dnia rozwiązania.':'Wpisz koniec polisy poprzedniego właściciela. Do tego dnia OC przechodzi na Ciebie, chyba że wypowiesz umowę na piśmie. Bez daty jest „sprawdź termin”.',
  more:'Przerwa w OC oznacza opłatę. Jej wysokości tu nie podaję.',
  src:[SRC.oc31],href:'#/oc',hrefLabel:'Porównanie OC'});
 const from=r.from||'prywatna';
 if(basis==='spadek')add({id:'pcc',kind:'check',title:'Podatek przy spadku',due:null,
  plain:'To nie jest PCC-3 od umowy sprzedaży. Termin podatku od spadków i darowizn zależy od grupy i zgłoszenia. Tu jest „sprawdź termin”.',
  more:'',src:[SRC.pccKto],href:'#/money',hrefLabel:'Płatności w aplikacji'});
 else if(from==='vat')add({id:'pcc',kind:'info',title:'PCC-3 przy zakupie od firmy',due:null,
  plain:'Gdy umowa była opodatkowana VAT albo z niego zwolniona, podatku PCC nie ma. Nie liczę 14 dni. Jeśli na dokumencie nie ma VAT, wybierz „Osoba prywatna”.',
  more:'',src:[SRC.pccVat,SRC.pccKto],href:'#/money',hrefLabel:'Płatności w aplikacji'});
 else if(from==='niewiem')add({id:'pcc',kind:'check',title:'PCC-3 — ustal, od kogo jest auto',due:null,
  plain:'14 dni liczę tylko przy kupnie od osoby prywatnej. Wybierz „Osoba prywatna” albo „Firma z VAT”. Dopóki nie wiadomo, jest „sprawdź termin”.',
  more:'Przy osobie prywatnej stawka to 2% wartości rynkowej. Gdy podstawa nie przekracza 1000 zł, sprzedaży rzeczy ruchomej nie obejmuje PCC.',
  src:[SRC.pcc14,SRC.pccSt,SRC.pccZw],href:'#/money',hrefLabel:'Płatności w aplikacji'});
 else add({id:'pcc',kind:r.date?'task':'check',title:'Złóż PCC-3 i zapłać podatek',due:dated(r.date,14),
  plain:'14 dni od umowy. Płaci kupujący. Stawka przy sprzedaży rzeczy ruchomej to 2% wartości rynkowej. Gdy podstawa nie przekracza 1000 zł, podatku nie ma.',
  more:'Deklarację składasz do urzędu skarbowego właściwego dla miejsca zamieszkania.',
  src:[SRC.pcc14,SRC.pccKto,SRC.pccSt,SRC.pccZw],href:'#/money',hrefLabel:'Płatności (w pokazie jest PCC)'});
 add({id:'potw',kind:'check',title:'Odbierz potwierdzenie OC od sprzedającego',due:null,
  plain:'Sprzedający ma je przekazać. Ustawa wiąże 14 dni z jego powiadomieniem ubezpieczyciela, nie z osobnym terminem dla kupującego. Dlatego tu jest „sprawdź termin”.',
  more:'',src:[SRC.oc32],href:'#/oc',hrefLabel:'OC w aplikacji'});
 if(basis==='ue'||basis==='poza')add({id:'akcyza',kind:'check',title:'Akcyza za samochód z zagranicy',due:null,
  plain:'Przy aucie sprowadzonym sprawdź akcyzę na stronie podatki.gov.pl. Nie wpisuję liczby dni, bo nie mam jednego terminu deklaracji z tego źródła.',
  more:'',src:[SRC.akcyza],href:'#/money',hrefLabel:'Płatności'});
 return steps;
}
function actionable(list){return list.filter(s=>s.kind==='task'||s.kind==='check')}
function whenHTML(s){
 if(s.kind==='info')return '<p class="v26when na">Nie liczę terminu</p>';
 if(!s.due)return '<p class="v26when unk">sprawdź termin</p>';
 const n=typeof days==='function'?days(s.due):0;
 const cls=n<0?'late':n<=14?'soon':'ok';
 return `<p class="v26when ${cls}">do ${plDate(s.due)} · ${leftTxt(n)}</p>`;
}
function stepHTML(s,i,st){
 const state=st[s.id]||'todo';
 const buttons=s.kind==='info'?'':`<div class="v26st">${[['todo','Do zrobienia'],['doing','W trakcie'],['done','Zrobione']].map(([k,lab])=>`<button type="button" class="${k===state?'on':''}" onclick="v26Set('${s.id}','${k}')">${lab}</button>`).join('')}</div>`;
 const more=s.more?`<details class="v26more"><summary>Więcej o tym kroku</summary><p>${esc(s.more)}</p></details>`:'';
 return `<article class="v26step ${state}"><p class="v26n">Krok ${i+1}</p><h3>${esc(s.title)}</h3>${whenHTML(s)}<p>${esc(s.plain)}</p>${srcLine(s.src)}<a class="btn sec" href="${s.href}">${esc(s.hrefLabel)}</a>${buttons}${more}</article>`;
}
function timelineHTML(list){
 const dated=list.filter(s=>s.due).slice().sort((a,b)=>a.due.localeCompare(b.due));
 const open=list.filter(s=>!s.due&&s.kind!=='info');
 if(!dated.length&&!open.length)return '';
 return `<div class="v26tl"><h3>Oś terminów</h3>${dated.map(s=>`<div class="v26tick"><b>${plDate(s.due)}</b><span>${esc(s.title)}</span></div>`).join('')}${open.map(s=>`<div class="v26tick unk"><b>sprawdź termin</b><span>${esc(s.title)}</span></div>`).join('')}</div>`;
}
function dateLabel(r){
 if(r.mode==='sprzedalem')return 'Data umowy sprzedaży';
 const b=r.basis||'pl';
 if(b==='spadek')return 'Data prawomocnego orzeczenia albo aktu poświadczenia dziedziczenia';
 if(b==='ue')return 'Data sprowadzenia pojazdu do Polski';
 if(b==='poza')return 'Data dopuszczenia do obrotu przez KAS';
 return 'Data umowy kupna';
}
function icsEscape(s){return String(s).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')}
function icsStamp(){const d=new Date();const p=n=>String(n).padStart(2,'0');return d.getUTCFullYear()+p(d.getUTCMonth()+1)+p(d.getUTCDate())+'T'+p(d.getUTCHours())+p(d.getUTCMinutes())+p(d.getUTCSeconds())+'Z'}
window.v26IcsText=function(){
 const r=rec();const items=buildSteps(r).filter(s=>s.kind==='task'&&s.due);if(!items.length)return '';
 const who=persona();const stamp=icsStamp();
 const events=items.map(s=>{const day=s.due.replace(/-/g,'');const uid='v26-'+who+'-'+s.id+'-'+day+'@demo.local';
  return ['BEGIN:VEVENT','UID:'+uid,'DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+day,'SUMMARY:'+icsEscape('DEMO: '+s.title),'DESCRIPTION:'+icsEscape('Koncepcja mObywatel. Nic nie zostało wysłane do urzędu. '+s.plain),'END:VEVENT'].join('\r\n')}).join('\r\n');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//mObywatel koncepcja DEMO//PL','CALSCALE:GREGORIAN','METHOD:PUBLISH',events,'END:VCALENDAR',''].join('\r\n');
};
window.v26Ics=function(){const text=window.v26IcsText();if(!text){toast('Wpisz datę z umowy. Pozycje „sprawdź termin” nie wchodzą do kalendarza.');return}const b=new Blob([text],{type:'text/calendar'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='auto-terminy-demo.ics';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('Plik kalendarza zapisany w przeglądarce (DEMO). Nic nie wysłano.')};
window.v26Set=function(id,st){const r=rec();r.st[id]=st;save();pageCar()};
window.v26Mode=function(m){rec().mode=m==='sprzedalem'?'sprzedalem':'kupilem';save();pageCar()};
window.v26From=function(v){rec().from=v;save();pageCar()};
window.v26Basis=function(v){rec().basis=v;save();pageCar()};
window.v26Date=function(v){if(v&&!parseYmd(v))return;rec().date=v||'';save();pageCar()};
window.v26Oc=function(v){if(v&&!parseYmd(v))return;rec().ocEnd=v||'';save();pageCar()};
window.v26Sample=function(){const r=rec();r.date='2026-10-20';if(r.mode==='kupilem'&&persona()==='anna'&&!r.ocEnd)r.ocEnd='2026-11-04';save();pageCar();toast(persona()==='anna'&&r.mode==='kupilem'?'Przykład DEMO: umowa 20.10.2026. Koniec OC Corolli jak w ekranie OC: 04.11.2026.':'Przykład DEMO: umowa 20.10.2026.')};
window.v26Help=function(id){if(!P(id).full)return;if(id===persona()){toast('To już ta osoba.');return}if(typeof applyPersona!=='function'){toast('Przełącznik rodziny jest niedostępny.');return}S.v26.back=persona();applyPersona(id);if(typeof syncSide==='function')syncSide();toast('Pomagasz: '+P(id).full+' (DEMO)');if((location.hash||'')!=='#/auto-co-dalej')location.hash='#/auto-co-dalej';else pageCar()};
window.v26Back=function(){const id=S.v26.back;if(!id||id===persona()||typeof applyPersona!=='function')return;S.v26.back='';applyPersona(id);if(typeof syncSide==='function')syncSide();if((location.hash||'')!=='#/auto-co-dalej')location.hash='#/auto-co-dalej';else pageCar()};

function pageCar(){
 const r=rec();const list=buildSteps(r);const act=actionable(list);const done=act.filter(s=> (r.st[s.id]||'todo')==='done').length;
 const me=P(persona());const back=S.v26.back&&S.v26.back!==persona()?S.v26.back:'';
 const modes=`<div class="v26modes"><button type="button" class="${r.mode==='kupilem'?'on':''}" onclick="v26Mode('kupilem')">Kupiłem auto</button><button type="button" class="${r.mode==='sprzedalem'?'on':''}" onclick="v26Mode('sprzedalem')">Sprzedałem auto</button></div>`;
 const buyer=r.mode==='kupilem'?`<label for="v26from">Od kogo jest auto?</label><select id="v26from" onchange="v26From(this.value)"><option value="prywatna" ${r.from==='prywatna'?'selected':''}>Osoba prywatna</option><option value="vat" ${r.from==='vat'?'selected':''}>Firma z VAT (salon, komis)</option><option value="niewiem" ${r.from==='niewiem'?'selected':''}>Nie wiem</option></select><label for="v26oc">Koniec polisy OC poprzedniego właściciela</label><input id="v26oc" type="date" value="${esc(r.ocEnd||'')}" onchange="v26Oc(this.value)"><details class="v26more"><summary>Inny sposób nabycia niż zwykłe kupno</summary><label for="v26basis">Jak nabyto pojazd?</label><select id="v26basis" onchange="v26Basis(this.value)"><option value="pl" ${r.basis==='pl'?'selected':''}>Kupno w Polsce — 30 dni</option><option value="spadek" ${r.basis==='spadek'?'selected':''}>Spadek — 60 dni</option><option value="ue" ${r.basis==='ue'?'selected':''}>Sprowadzony z UE — 30 dni od sprowadzenia</option><option value="poza" ${r.basis==='poza'?'selected':''}>Spoza UE — 30 dni od dopuszczenia do obrotu</option><option value="obrot" ${r.basis==='obrot'?'selected':''}>Prowadzę obrót pojazdami — 90 dni</option></select></details>`:'';
 const help=people().map(id=>{const p=P(id);const on=id===persona();return `<button type="button" class="v26who ${on?'on':''}" onclick="v26Help('${id}')"><b>${esc(p.name)}</b><small>${esc(p.age?p.age+' lat, '+p.city:'')} ${on?'· teraz na ekranie':''}</small></button>`}).join('');
 shell('🚗 Auto — co dalej?',`${DEMO}
 <p class="v26leadp">Nic nie jest wysyłane do urzędu. Dni liczę od daty, którą wpiszesz. Zegar pokazu: <b>${clockTxt()}</b>.</p>
 ${back?`<div class="alert b"><div><b>Pomagasz: ${esc(me.full)}</b><br><span class="muted">To jej albo jego konto w przełączniku rodziny.</span><button type="button" class="btn sec" onclick="v26Back()">Wróć do ${esc(P(back).name)}</button></div></div>`:`<p class="muted">Konto: <b>${esc(me.full)}</b>${me.city?', '+esc(me.city):''}.</p>`}
 <div class="card v26card">${modes}<label for="v26date">${esc(dateLabel(r))}</label><input id="v26date" type="date" value="${esc(r.date||'')}" onchange="v26Date(this.value)">${buyer}<button type="button" class="btn ghost" onclick="v26Sample()">Wstaw przykład DEMO (20.10.2026)</button></div>
 <div class="card v26card"><h3>Postęp: ${done} z ${act.length}</h3><div class="bar"><i style="width:${act.length?Math.round(done/act.length*100):0}%"></i></div><button type="button" class="btn" onclick="v26Ics()">Zapisz terminy do kalendarza (.ics)</button><p class="muted">Plik powstaje w tej przeglądarce. Pozycje „sprawdź termin” do niego nie wchodzą.</p></div>
 ${timelineHTML(list)}
 ${list.map((s,i)=>stepHTML(s,i,r.st)).join('')}
 <div class="card v26card"><h3>Pomóż członkowi rodziny</h3><p>Ta sama lista osób co na starcie. Po wyborze widzisz jej listę i terminy.</p><div class="v26whos">${help}</div>${S.trusted?`<p class="muted">Zaufana osoba zostaje w ustawieniach: <b>${esc(S.trusted)}</b>.</p><a class="btn ghost" href="#/settings">Zaufana osoba</a>`:'<p class="muted">Zaufaną osobę dodasz w ustawieniach. Ta lista i tak przełącza konta rodziny.</p>'}</div>
 <details class="v26more"><summary>Te sprawy już są w aplikacji</summary><div class="v26links"><a href="#/flow/auto">Rejestracja auta</a><a href="#/oc">Porównanie OC</a><a href="#/money">Płatności, w tym PCC w pokazie</a><a href="#/agent/auto">Krótka lista „Sprzedaję samochód”</a><a href="#/reminders">Terminy i przypomnienia</a></div></details>`,{tab:'home'});
}

function actions(){
 const dev=devOf(persona());const out=[];
 if(!dev.fresh)out.push({t:'Zaktualizuj aplikację mObywatel w sklepie (Sklep Play albo App Store).',due:DEMO_DUE,demo:true,href:'#/wskazowka',btn:'Duże kroki'});
 if(!dev.osOk)out.push({t:'System w tym pokazie jest za stary na aplikację. Sprawdź wymagania w sklepie.',due:null,href:'#/wskazowka',btn:'Duże kroki'});
 docIssues().forEach(d=>{
  const due=d.st==='soon'?parseUntil(d.until):null;
  const t=d.st==='soon'?'„'+d.name+'” wygasa. Złóż wniosek o nowy, zanim skończy się ważność.':d.st==='refresh'?'Odśwież „'+d.name+'” w aplikacji. W pokazie wymaga odświeżenia.':d.st==='gone'?'„'+d.name+'” nie ma na telefonie w tym pokazie. Dodaj dokument ponownie.':'„'+d.name+'” jest zastrzeżony w pokazie.';
  out.push({t,due,href:'#/zdrowie-dokumentow',btn:'Stan dokumentów'});
 });
 return out;
}
function taskLine(a){
 const when=a.due?`<b>do ${plDate(a.due)}</b> · ${leftTxt(typeof days==='function'?days(a.due):0)}`:'<b>sprawdź termin</b>';
 const tag=a.demo?` ${DEMO} data pokazu, nie komunikat urzędu`:'';
 return `<li><span>${esc(a.t)}</span><em>${when}${tag}</em><a class="btn sec" href="${a.href}">${esc(a.btn)}</a></li>`;
}
function pageReady(){
 const id=persona();const me=P(id);const sum=readyOf(id);const dev=sum.dev;const list=actions();
 const rows=`<div class="v26check ${dev.fresh?'ok':'bad'}"><b>Wersja aplikacji</b><span>${esc(dev.ver)} · ${dev.fresh?'aktualna w pokazie':'starsza w pokazie'}</span></div>
 <div class="v26check ${dev.osOk?'ok':'bad'}"><b>System telefonu</b><span>${esc(dev.os)} · ${dev.osOk?'obsługiwany w pokazie':'wymaga sprawdzenia'}</span></div>
 <div class="v26check ${sum.docs.length?'warn':'ok'}"><b>Dokumenty</b><span>${sum.docs.length?sum.docs.length+' wymaga uwagi':'w pokazie bez uwag'}</span><a href="#/zdrowie-dokumentow">Otwórz stan dokumentów</a></div>`;
 const family=people().map(pid=>{const p=P(pid);const d=devOf(pid);const mine=pid===id;const need=!d.fresh;
  return `<div class="v26member"><div><b>${esc(p.full)}</b><small>${mine?' · to Ty':' · '+esc(String(p.age)+(p.age?' lat, ':'')+ (p.city||''))}</small><br><span>${esc(d.ver)} · ${need?'trzeba aktualizacji':'wersja w pokazie aktualna'}</span></div>${need&&!mine?`<button type="button" class="btn" onclick="v26Send('${pid}')">Wyślij wskazówkę</button><button type="button" class="btn sec" onclick="v26As('${pid}')">Otwórz to konto i włącz duże litery</button>`:''}</div>`}).join('');
 const kids=typeof window.v23Docs==='function'?(window.v23Docs().family||[]).filter(d=>d.st&&d.st!=='ok'&&d.st!=='na'):[];
 const kidBlock=kids.length?`<details class="v26more"><summary>Dokumenty dzieci (${kids.length})</summary><p>Szczegóły zostają w „Dokumenty nie znikną”.</p><ul class="v26kids">${kids.map(d=>`<li>${esc(d.who||'Dziecko')}: ${esc(d.name)}</li>`).join('')}</ul><a class="btn ghost" href="#/zdrowie-dokumentow">Stan dokumentów dzieci</a></details>`:'';
 shell('✅ Czy aplikacja jest gotowa?',`${DEMO}
 <div class="v26hero ${sum.level}"><b>${esc(sum.line)}</b><small>${esc(me.full)}. Wersja i system są wpisane na potrzeby pokazu. Aplikacja ich nie odczytuje z telefonu.</small></div>
 <div class="card v26card">${rows}</div>
 <div class="card v26card"><h3>Co musisz zrobić i do kiedy</h3>${list.length?`<ol class="v26todo">${list.map(taskLine).join('')}</ol>`:'<p>W tym pokazie nic nie trzeba robić.</p>'}</div>
 <div class="card v26card"><h3>Rodzina</h3><p>Przełącznik osób jest ten sam co na starcie. Wskazówka zostaje na tym telefonie. Nic nie idzie w internet.</p>${family}</div>
 ${kidBlock}
 <details class="v26more"><summary>Skąd bierze się ten wynik</summary><p>Wersja i system: symulacja. Dokumenty: ten sam stan co w „Moje dokumenty nie znikną”. Termin aktualizacji w pokazie to ${plDate(DEMO_DUE)} i jest datą demonstracyjną.</p><a href="#/wskazowka">Podgląd wskazówki dużym tekstem</a></details>`,{tab:'home'});
}
window.v26Send=function(id){
 if(id===persona()){toast('Wskazówkę wysyła inny członek rodziny.');return}
 if(devOf(id).fresh){toast('W pokazie ta osoba ma aktualną wersję.');return}
 S.v26.guides[id]={from:persona(),fromName:P(persona()).full,at:new Date().toISOString()};save();
 toast('Wskazówka została na tym telefonie (DEMO). '+P(id).name+' zobaczy ją po przełączeniu osoby. Nic nie wysłano.');
 pageReady();
};
window.v26As=function(id){
 if(id!==persona()){if(typeof applyPersona!=='function'){toast('Przełącznik rodziny jest niedostępny.');return}S.v26.back=persona();applyPersona(id);if(typeof syncSide==='function')syncSide()}
 S.senior=true;save();document.body.classList.add('senior');
 if((location.hash||'')!=='#/wskazowka')location.hash='#/wskazowka';else pageGuide();
};
window.v26Senior=function(on){S.senior=!!on;save();document.body.classList.toggle('senior',S.senior);pageGuide()};
function pageGuide(){
 const g=S.v26.guides[persona()]||null;const me=P(persona());
  const head=g?`<div class="alert y"><div><b>Wskazówka od ${esc(g.fromName)}</b><br><span class="muted">Jest na tym telefonie (DEMO). Nic nie poszło w internet.</span></div></div>`:`<p class="muted">Taką wskazówkę dostaje osoba, której aplikacja w pokazie jest nieaktualna. Członek rodziny wysyła ją z ekranu „Czy aplikacja jest gotowa?”.</p>`;
 shell('🔤 Jak zaktualizować',`${DEMO}
 <p class="v26leadp">Duże kroki. Osoba: <b>${esc(me.full)}</b>.</p>
 ${head}
 <div class="card v26guide"><h3>Krok po kroku</h3><ol>${GUIDE.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
 <p class="v26when unk">Termin w pokazie: ${plDate(DEMO_DUE)}. ${DEMO} data pokazu, nie komunikat urzędu.</p>
 <button type="button" class="btn" onclick="say(document.querySelector('.v26guide').innerText)">Przeczytaj wskazówkę</button>
 <button type="button" class="btn sec" onclick="v26Senior(${S.senior?'false':'true'})">${S.senior?'Tryb seniora jest włączony':'Włącz tryb seniora'}</button>
 <a class="btn ghost" href="#/gotowosc">Wróć do sprawdzenia</a></div>`,{tab:'home'});
}

function homeBits(){
 const id=persona();const sum=readyOf(id);const g=S.v26.guides[id];
 const other=people().filter(pid=>pid!==id&&!devOf(pid).fresh);
 const fam=other.length?`<p class="v26famline">Rodzina: ${other.map(pid=>esc(P(pid).full)+' — aplikacja w pokazie wymaga aktualizacji').join('. ')}. <a href="#/gotowosc">Zobacz i wyślij wskazówkę</a></p>`:'';
 return `${g?`<a id="v26inbox" class="v26inbox" href="#/wskazowka"><b>Wskazówka od ${esc(g.fromName||'bliskiej osoby')}</b><small>Duże kroki: jak zaktualizować aplikację. DEMO</small></a>`:''}
 <a id="v26ready" class="v26ready ${sum.level}" href="#/gotowosc"><span class="demo">DEMO</span><b>Czy moja aplikacja jest gotowa?</b><small>${esc(sum.line)}</small></a>
 <a id="v26carhome" class="v26carhome" href="#/auto-co-dalej"><b>Kupiłem lub sprzedałem auto — co dalej?</b><small>Lista od daty umowy, terminy z gov.pl, kalendarz w telefonie.</small></a>
 ${fam}`;
}
function lead(href,title,sub){return `<a class="v26lead" href="${href}"><b>${title}</b><small>${sub}</small></a>`}
function inject(){
 const sc=app.querySelector('.scroll');if(!sc)return;const p=top();const s2=segs()[1]||'';
 if(p==='home'&&!sc.querySelector('#v26homewrap')){const wrap=document.createElement('div');wrap.id='v26homewrap';wrap.innerHTML=homeBits();const alarm=sc.querySelector('#v20go');if(alarm&&alarm.parentNode===sc)alarm.insertAdjacentElement('afterend',wrap);else sc.insertAdjacentElement('afterbegin',wrap)}
 if(p==='family'&&!sc.querySelector('#v26fam')){const html=`<div id="v26fam" class="card"><h3>Auto i aktualizacja</h3><p class="muted">Pomoc przy aucie i wskazówka dla starszej osoby używają tego samego przełącznika rodziny.</p><a class="btn sec" href="#/auto-co-dalej">Kupiłem lub sprzedałem auto</a><a class="btn sec" href="#/gotowosc">Czy aplikacja jest gotowa?</a></div>`;const anchor=document.getElementById('v20fam');if(anchor)anchor.insertAdjacentHTML('afterend',html);else sc.insertAdjacentHTML('afterbegin',html)}
 if(p==='flow'&&s2==='auto'&&!sc.querySelector('#v26flow'))sc.insertAdjacentHTML('afterbegin',lead('#/auto-co-dalej','Co dalej po kupnie lub sprzedaży?','Terminy od daty umowy. Ten wniosek zostaje.').replace('<a ','<a id="v26flow" '));
 if(p==='oc'&&!sc.querySelector('#v26oc'))sc.insertAdjacentHTML('afterbegin',lead('#/auto-co-dalej','Kupiłem lub sprzedałem auto','Ciągłość OC jest jednym z kroków. Porównanie ofert zostaje.').replace('<a ','<a id="v26oc" '));
 if(p==='agent'&&s2==='auto'&&!sc.querySelector('#v26ag'))sc.insertAdjacentHTML('afterbegin',lead('#/auto-co-dalej','Pełna lista z terminami','Ta krótka lista zostaje. Obok jest oś czasu od daty umowy.').replace('<a ','<a id="v26ag" '));
 if(p==='money'&&!sc.querySelector('#v26pay'))sc.insertAdjacentHTML('afterbegin',lead('#/auto-co-dalej','PCC po kupnie auta','14 dni liczę tylko tam, gdzie potwierdza to podatki.gov.pl.').replace('<a ','<a id="v26pay" '));
 if(p==='reminders'&&!sc.querySelector('#v26rem'))sc.insertAdjacentHTML('afterbegin',lead('#/auto-co-dalej','Terminy po kupnie lub sprzedaży auta','Osobny plik kalendarza, obok tych przypomnień.').replace('<a ','<a id="v26rem" '));
 if(p==='assistant'&&!document.getElementById('v26chip')){const chips=[...sc.querySelectorAll('.chips')].filter(c=>!c.closest('.chat')&&!c.closest('.msg'));const box=chips[chips.length-1];if(box)box.insertAdjacentHTML('beforeend','<button type="button" class="chip" id="v26chip" onclick="ask(\'kupiłem auto co teraz\')">Kupiłem auto, co teraz?</button><button type="button" class="chip" onclick="ask(\'czy moja aplikacja jest gotowa\')">Czy aplikacja jest gotowa?</button>')}
 const more=document.getElementById('v19more');
 if(more&&!more.querySelector('#v26grp')){const d=document.createElement('details');d.className='v19g';d.id='v26grp';d.open=true;d.innerHTML='<summary>🚗 <b>Auto i telefon</b> <span class="muted">2</span></summary><div class="grid"><button type="button" class="tile" onclick="location.hash=\'#/auto-co-dalej\'"><b>🚗</b>Auto — co dalej</button><button type="button" class="tile" onclick="location.hash=\'#/gotowosc\'"><b>✅</b>Czy aplikacja gotowa</button></div>';const first=more.querySelector('.v19g');first?more.insertBefore(d,first):more.appendChild(d)}
}
function v26Rule(q){
 let l='';try{l=norm(q)}catch(e){l=String(q||'').toLowerCase()}
 if(!l)return null;
 if(/kupil\w*.{0,30}(auto|samochod|pojazd)|sprzedal\w*.{0,30}(auto|samochod|pojazd)|(auto|samochod).{0,24}(co dalej|co teraz|co robic)|po (kupnie|sprzedazy|zakupie) (auta|samochodu|pojazdu)/.test(l))return ['#/auto-co-dalej',CAR_ANS];
 if(/czy (moja )?aplikacja jest gotowa|czy musze zaktualizowac (aplikacje|mobywatela)|aktualizacja aplikacji|gotowosc aplikacji/.test(l))return ['#/gotowosc',READY_ANS];
 return null;
}
window.v26Rule=v26Rule;
const _ask=ask;
ask=async function(q){const hit=v26Rule(q);if(!hit)return _ask.apply(this,arguments);q=(q||'').trim();if(!q)return;if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});window.v14Last={k:'rules',fb:false,shown:1};chat.push({r:'a',t:hit[1]+'<br><b>Czy chcesz kontynuować?</b>',act:hit[0]});drawChat();say(hit[1])};
window.ask=ask;
if(window.v18Route){const _v=window.v18Route;window.v18Route=function(q){const hit=v26Rule(q);if(hit)return {kind:'act',hit:[null,hit[0],hit[1]],act:hit[0]};return _v(q)}}
try{INT.unshift([/kupiłem auto co teraz|sprzedałem auto co teraz/i,'#/auto-co-dalej',CAR_ANS],[/czy moja aplikacja jest gotowa/i,'#/gotowosc',READY_ANS]);ALL.push(['🚗','Kupiłem lub sprzedałem auto — co dalej','#/auto-co-dalej','auto samochód kupiłem sprzedałem rejestracja pcc oc zbycie termin kalendarz'],['✅','Czy moja aplikacja jest gotowa','#/gotowosc','aktualizacja wersja senior rodzina dokument gotowość'])}catch(e){}

const R={'auto-co-dalej':pageCar,gotowosc:pageReady,wskazowka:pageGuide};
const _r=route;
route=function(){const p=top();if(R[p]){try{clearInterval(threatT)}catch(e){}try{clearInterval(camT)}catch(e){}R[p]();try{inject()}catch(e){}return}const out=_r.apply(this,arguments);try{inject()}catch(e){}return out};
window.route=route;onhashchange=route;
new MutationObserver(()=>{try{inject()}catch(e){}}).observe(app,{childList:true});
const st=document.createElement('style');st.textContent=`
.v26ready,.v26carhome,.v26inbox,.v26lead{display:flex;flex-direction:column;gap:3px;text-decoration:none;border-radius:16px;padding:14px 14px;margin:0 0 10px}
.v26ready{color:#fff;background:linear-gradient(135deg,#0b3d91,#1d5bd8);box-shadow:0 8px 20px #0b3d9133}
.v26ready.ok{background:linear-gradient(135deg,#0c6b44,#1aa36b)}
.v26ready.warn{background:linear-gradient(135deg,#8a4b00,#c77700)}
.v26ready.bad{background:linear-gradient(135deg,#8b0a26,#dc143c)}
.v26ready b,.v26carhome b,.v26inbox b,.v26lead b{font-size:1.12em}
.v26ready small,.v26inbox small,.v26lead small{font-weight:650;line-height:1.35}
.v26carhome,.v26lead{background:#fff;color:#14213d;border:1.5px solid #d5deee;box-shadow:0 1px 3px #0001}
.v26carhome b,.v26lead b{color:#0b3d91}
.v26inbox{background:#fff6e5;color:#5c3b00;border:1.5px solid #f3d9a4}
.v26famline{margin:-4px 0 12px;font-size:.92em}
.v26leadp{margin:0 0 8px}
.v26modes{display:flex;gap:8px;margin-bottom:8px}.v26modes button{flex:1;border:1.5px solid #0b3d91;background:#fff;color:#0b3d91;border-radius:12px;padding:12px 8px;font-weight:700;cursor:pointer}
.v26modes button.on{background:#0b3d91;color:#fff}
.v26hero{border-radius:16px;padding:16px;color:#fff;margin:0 0 12px}.v26hero.ok{background:#0c6b44}.v26hero.warn{background:#8a4b00}.v26hero.bad{background:#8b0a26}.v26hero small{display:block;margin-top:6px;line-height:1.4}
.v26check{display:flex;flex-direction:column;gap:2px;padding:10px 0;border-bottom:1px solid #eef0f4}.v26check:last-child{border:0}.v26check.ok b{color:#0c6b44}.v26check.warn b{color:#8a4b00}.v26check.bad b{color:#8b0a26}
.v26todo{list-style:none;padding:0;margin:0}.v26todo li{background:#f6f8fb;border-radius:14px;padding:12px;margin:0 0 10px}.v26todo em{display:block;font-style:normal;margin:6px 0;font-weight:700}
.v26member{padding:10px 0;border-bottom:1px solid #eef0f4}.v26member:last-child{border:0}.v26member small{color:#5b6476}
.v26tl{margin:0 0 12px;padding:4px 0 4px 12px;border-left:3px solid #0b3d91}
.v26tick{display:flex;flex-direction:column;margin:0 0 8px}.v26tick.unk b{color:#5b6476}
.v26step{background:#fff;border:1px solid #e1e6ef;border-radius:16px;padding:14px;margin:0 0 10px;box-shadow:0 1px 3px #0001}
.v26step.done{opacity:.8}.v26n{margin:0;color:#5b6476;font-weight:700;font-size:.8em}.v26step h3{margin:2px 0 6px}
.v26when{font-weight:800;font-size:1.15em;margin:4px 0}.v26when.late{color:#8b0a26}.v26when.soon{color:#8a4b00}.v26when.ok{color:#0c6b44}.v26when.unk,.v26when.na{color:#5b6476}
.v26st{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.v26st button{flex:1;min-width:96px;border-radius:12px;border:1.5px solid #cfd6e3;background:#fff;padding:10px 6px;font-weight:700;cursor:pointer}
.v26st button.on{background:#0b3d91;color:#fff;border-color:#0b3d91}
.v26src{font-size:.82em;color:#24324a}.v26src a{color:#0b3d91}
.v26more{margin:8px 0}.v26more summary{cursor:pointer;font-weight:700;color:#0b3d91}
.v26whos{display:flex;flex-direction:column;gap:8px}.v26who{text-align:left;border:1.5px solid #d5deee;background:#fff;border-radius:14px;padding:12px;cursor:pointer}.v26who.on{border-color:#0b3d91;background:#f4f7ff}.v26who b{display:block}.v26who small{color:#5b6476}
.v26links{display:flex;flex-direction:column;gap:6px;margin-top:8px}.v26links a{color:#0b3d91;font-weight:700}
.v26guide li{margin:0 0 12px;font-size:1.15em;line-height:1.4}
body.senior .v26ready,body.senior .v26carhome,body.senior .v26inbox,body.senior .v26lead{padding:18px}
body.senior .v26ready b,body.senior .v26carhome b,body.senior .v26lead b,body.senior .v26inbox b{font-size:1.4em}
body.senior .v26ready small,body.senior .v26carhome small,body.senior .v26lead small{font-size:1.05em}
body.senior .v26modes{flex-direction:column}
body.senior .v26modes button,body.senior .v26st button,body.senior .v26who,body.senior .v26card .btn,body.senior .v26step .btn,body.senior .v26guide .btn{min-height:56px;font-size:1.12em}
body.senior .v26step h3,body.senior .v26when,body.senior .v26hero b{font-size:1.35em}
body.senior .v26guide li{font-size:1.45em}
body.senior input,body.senior select{min-height:56px;font-size:1.1em}
body.senior .v26src{font-size:1em}
body.contrast .v26carhome,body.contrast .v26lead,body.contrast .v26step,body.contrast .v26who,body.contrast .v26guide{background:#000;color:#fff;border-color:#fff}
body.contrast .v26ready,body.contrast .v26hero{background:#000;color:#ffeb3b;border:2px solid #ffeb3b}
body.contrast .v26src a,body.contrast .v26lead b,body.contrast .v26carhome b{color:#ffeb3b}
`;document.head.appendChild(st);

function selftest(){
 const buy=buildSteps({mode:'kupilem',date:'2026-10-20',from:'prywatna',basis:'pl',ocEnd:'2026-11-04',st:{}});
 const rej=buy.find(s=>s.id==='rej'),pcc=buy.find(s=>s.id==='pcc'),oc=buy.find(s=>s.id==='oc');
 if(!rej||rej.due!=='2026-11-19')console.error('v26 rejestracja',rej&&rej.due);
 if(!pcc||pcc.due!=='2026-11-03')console.error('v26 pcc',pcc&&pcc.due);
 if(!oc||oc.due!=='2026-11-04')console.error('v26 oc',oc&&oc.due);
 const sell=buildSteps({mode:'sprzedalem',date:'2026-10-20',from:'prywatna',basis:'pl',ocEnd:'',st:{}});
 if(!sell.find(s=>s.id==='zbycie')||sell.find(s=>s.id==='zbycie').due!=='2026-11-19')console.error('v26 zbycie');
 if(!sell.find(s=>s.id==='ubezp')||sell.find(s=>s.id==='ubezp').due!=='2026-11-03')console.error('v26 ubezpieczyciel');
 if(buildSteps({mode:'kupilem',date:'2026-10-20',from:'vat',basis:'pl',ocEnd:'',st:{}}).find(s=>s.id==='pcc').kind!=='info')console.error('v26 vat');
 if(buildSteps({mode:'kupilem',date:'2026-10-20',from:'prywatna',basis:'spadek',ocEnd:'',st:{}}).find(s=>s.id==='rej').due!=='2026-12-19')console.error('v26 spadek');
 if(buildSteps({mode:'kupilem',date:'2026-10-20',from:'prywatna',basis:'obrot',ocEnd:'',st:{}}).find(s=>s.id==='rej').due!=='2027-01-18')console.error('v26 obrot');
 if(buildSteps({mode:'kupilem',date:'',from:'niewiem',basis:'pl',ocEnd:'',st:{}}).find(s=>s.id==='pcc').due)console.error('v26 niewiem');
}
try{selftest()}catch(e){console.error('v26 test',e)}
try{inject()}catch(e){}
route();
})();
