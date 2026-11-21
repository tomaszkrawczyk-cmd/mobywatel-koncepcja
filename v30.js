// ===== v30: „Pokaż tylko to, co trzeba” i „Mój profil życiowy” =====
// Koncepcja własna (Tomasz Krawczyk). Inspiracja (rozwinięta, nie skopiowana):
// https://x.com/piotrek_nowy/status/2123798254005416253
// Zamiast profilu zawodowego w chmurze: (1) udostępnianie samych potwierdzeń (tak/nie, kategoria),
// bez PESEL-u i adresu, z kodem ważnym krótko i z cofnięciem; (2) profil życiowy zapisany
// wyłącznie na tym telefonie, z którego asystent buduje listę spraw do pilnowania.
// Fakty prawne tylko z komunikatów rządu i EUR-Lex (projekt ustawy o EPTC = projekt).
// Symulacje oznaczone DEMO. Nic nie jest wysyłane. Profil nie trafia do Gemmy ani do serwera.
// Łańcuch Gemma → reguły → Bielik i pobieranie Bielika bez zmian.
(function(){
const DEMO='<span class="demo">DEMO</span>';
const MC_EPTC='https://www.gov.pl/web/cyfryzacja/rzad-przyjal-projekt-ustawy-o-europejskim-portfelu-tozsamosci-cyfrowej';
const PREMIER='https://www.gov.pl/web/premier/projekt-ustawy-o-zmianie-ustawy-o-uslugach-zaufania-oraz-identyfikacji-elektronicznej-oraz-niektorych-innych-ustaw3';
const EURLEX='https://eur-lex.europa.eu/eli/reg/2024/1183/oj?locale=pl';
const PK='v30-profil',SK='v30-share';
function top(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/)[0]}
function sub(){return decodeURIComponent((location.hash.split('/')[2]||'').split('?')[0])}
function persona(){return (typeof S!=='undefined'&&S.persona)||'anna'}
function P(){try{return (typeof PERS!=='undefined'&&PERS[persona()])||{}}catch(e){return {}}}
function e(s){try{return esc(String(s))}catch(_){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}}
function ld(k,d){try{return JSON.parse(localStorage.getItem(k)||'null')||d}catch(_){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}
function rid(n){const a='ABCDEFGHJKLMNPRSTUWXYZ23456789';const b=new Uint8Array(n);try{crypto.getRandomValues(b)}catch(_){for(let i=0;i<n;i++)b[i]=Math.random()*255}return [...b].map(x=>a[x%a.length]).join('')}
function fmt(t){const d=new Date(t);const p=n=>String(n).padStart(2,'0');return p(d.getDate())+'.'+p(d.getMonth()+1)+'.'+d.getFullYear()+', '+p(d.getHours())+':'+p(d.getMinutes())}
function stopT(){try{clearInterval(window.v30T)}catch(_){}window.v30T=null}

// ---------- Element 1: Pokaż tylko to, co trzeba ----------
// Cechy w pokazie są fikcyjne (DEMO), zgodne z personami z v8.
const FAKE={
 anna:{pj:'B',wyk:null,student:false},
 piotr:{pj:'B, C (DEMO)',wyk:null,student:false},
 halina:{pj:'B',wyk:'wyższe – magister (DEMO)',student:false},
 kuba:{pj:'B',wyk:null,student:true}
};
function fk(){return FAKE[persona()]||{pj:null,wyk:null,student:false}}
const ATTR={
 osoba:{i:'🙋',t:'Jestem prawdziwą osobą',v:()=>'TAK – tożsamość potwierdzona w telefonie',src:'profil mObywatel (DEMO)'},
 a18:{i:'🔞',t:'Mam ukończone 18 lat',v:()=>(P().age||0)>=18?'TAK':'NIE',src:'mDowód – tylko wynik tak/nie'},
 imie:{i:'🪪',t:'Imię i nazwisko',v:()=>P().full||'Anna Kowalska',src:'mDowód'},
 pj:{i:'🚗',t:'Prawo jazdy – kategorie',v:()=>fk().pj,src:'mPrawo jazdy – same kategorie'},
 wyk:{i:'🎓',t:'Wykształcenie / dyplom',v:()=>fk().wyk,src:'w pokazie: dane przykładowe'},
 student:{i:'📚',t:'Status studenta',v:()=>fk().student?'TAK':null,src:'legitymacja studencka'},
 gmina:{i:'📍',t:'Mieszkam w gminie',v:()=>P().city||null,src:'sama gmina, bez ulicy i numeru'}
};
const NEVER=['PESEL','Data urodzenia','Adres: ulica i numer mieszkania','Seria i numer dowodu','Zdjęcie z dokumentu','Twoje sprawy, recepty i historia'];
const SC={
 rekruter:{i:'💼',t:'Rekruter',who:'Portal z ofertami pracy (DEMO)',goal:'Chce wiedzieć, że kandydat jest prawdziwą osobą, a nie fałszywym kontem, i czy ma uprawnienia do pracy kierowcy.',ask:['osoba','a18','pj','wyk','imie'],need:['osoba']},
 bank:{i:'🏦',t:'Bank – wstępna oferta',who:'Bank DEMO S.A.',goal:'Przed przygotowaniem oferty chce wiedzieć, że rozmawia z prawdziwą, pełnoletnią osobą.',ask:['osoba','a18','imie'],need:['osoba','a18'],note:'Przy samej umowie bank zwykle identyfikuje klienta pełniej. Zobacz <a href="#/zadanie/bank">kartę żądania banku</a>.'},
 wynajem:{i:'🏠',t:'Wynajmujący mieszkanie',who:'Właściciel mieszkania (DEMO)',goal:'Przed oglądaniem chce wiedzieć, że pisze do niego prawdziwa, pełnoletnia osoba.',ask:['osoba','a18','imie','student','gmina'],need:['osoba','a18'],note:'Umowę najmu podpisujecie osobno. Tu jest tylko pierwsze sprawdzenie.'},
 sklep:{i:'🛒',t:'Sklep z produktem 18+',who:'Sklep internetowy DEMO',goal:'Sprzedaż produktu dla osób pełnoletnich.',ask:['a18'],need:['a18'],note:'Porównanie z pokazaniem całego dokumentu: <a href="#/potwierdz-wiek">„Potwierdź tylko wiek”</a>.'},
 przychodnia:{i:'🩺',t:'Przychodnia – zapis online',who:'Przychodnia DEMO',goal:'Wstępny zapis na wizytę. Pełna rejestracja pacjenta jest przy wizycie.',ask:['osoba','imie','gmina'],need:['osoba'],note:'Do rejestracji przychodnia zwykle potrzebuje PESEL-u. Zobacz <a href="#/zadanie/przychodnia">kartę żądania przychodni</a>.'}
};
const EXP=[['15m','15 minut',15*60e3],['24h','24 godziny',24*3600e3],['7d','7 dni',7*24*3600e3]];
let pick={};
function shares(){return ld(SK,[])}
function status(x){if(x.revoked)return 'cofnięte';if(Date.now()>x.exp)return 'wygasło';return 'aktywne'}
function srcCard(){return `<div class="card"><h3>Skąd to wiemy</h3><p class="muted">Rozporządzenie (UE) 2024/1183 przewiduje w europejskim portfelu tożsamości cyfrowej możliwość selektywnego ujawniania danych, czyli udostępniania tylko wybranych informacji. 17.11.2026 Rada Ministrów przyjęła <b>projekt</b> polskiej ustawy o Europejskim Portfelu Tożsamości Cyfrowej. To jeszcze nie obowiązujące prawo. <a href="${EURLEX}" target="_blank" rel="noopener">EUR-Lex 2024/1183</a> · <a href="${MC_EPTC}" target="_blank" rel="noopener">Ministerstwo Cyfryzacji, 17.11.2026</a> · <a href="${PREMIER}" target="_blank" rel="noopener">Kancelaria Premiera, 17.11.2026</a>.</p><p class="muted">Ekran „Pokaż tylko to, co trzeba” to koncepcja prototypu ${DEMO}, a nie opis działającej usługi mObywatela. Scenariusze, kategorie prawa jazdy i dyplomy są fikcyjne. To nie jest porada prawna.</p></div>`}

function hub(){
 const act=shares().filter(x=>x.persona===persona()&&status(x)==='aktywne').length;
 shell('🎯 Pokaż tylko to, co trzeba',`
 <div class="alert b">🎯<div><b>Firma prosi o potwierdzenie, Ty wybierasz, co zobaczy.</b> Zamiast całego dokumentu udostępniasz same odpowiedzi: „prawdziwa osoba”, „18+”, „prawo jazdy kat. B”. PESEL i adres zostają w telefonie. ${DEMO}</div></div>
 <div class="card v30card"><h3>Kto prosi o potwierdzenie?</h3>
 <div class="v30grid">${Object.entries(SC).map(([k,s])=>`<a class="v30scen" href="#/udostepnij/${k}"><b>${s.i} ${e(s.t)}</b><small>${e(s.who)}</small></a>`).join('')}</div></div>
 <a class="v30lead" href="#/udostepnione"><b>🧾 Moje udostępnienia${act?` · aktywne: ${act}`:''}</b><small>Historia na tym telefonie. Każde aktywne możesz cofnąć jednym stuknięciem.</small></a>
 <div class="card v30card"><h3>Jak to działa</h3><ol class="v30steps">
  <li>Firma pokazuje, o co prosi i po co.</li>
  <li>Zaznaczasz tylko te potwierdzenia, które chcesz dać.</li>
  <li>Widzisz obok siebie: <b>co zobaczy firma</b> i <b>czego nie zobaczy</b>.</li>
  <li>Dostajesz kod ważny 15 minut, 24 godziny albo 7 dni. Możesz go cofnąć wcześniej.</li>
 </ol></div>
 <div class="card v30card"><h3>Powiązane w prototypie</h3>
  <a class="btn sec" href="#/potwierdz-wiek">Porównaj: cały dowód albo samo „pełnoletni”</a>
  <a class="btn sec" href="#/portfel-unijny">Czy portfel unijny zastąpi mObywatela?</a>
  <a class="btn ghost" href="#/kto-pyta">Kto pyta o moje dane (pełne żądania)</a>
  <a class="btn ghost" href="#/disclose">Pierwszy pokaz: tylko 18+</a>
 </div>
 ${srcCard()}`,{tab:'wallet'});
}

function scen(){
 const k=sub(),s=SC[k];
 if(!s){hub();return}
 if(pick._k!==k+persona()){pick={_k:k+persona(),exp:'24h'};s.ask.forEach(a=>{if(s.need.includes(a)&&ATTR[a].v())pick[a]=true})}
 const rows=s.ask.map(a=>{const A=ATTR[a],val=A.v(),need=s.need.includes(a);
  return `<label class="v30f ${val?'':'off'}"><input type="checkbox" ${val?'':'disabled'} ${pick[a]&&val?'checked':''} onchange="v30Pick('${a}',this.checked)"><span><b>${A.i} ${e(A.t)}</b> <i>${need?'Firma prosi jako konieczne':'Opcjonalne'}</i><small>${val?'Zobaczy: '+e(val)+' · źródło: '+e(A.src):'Brak w tym telefonie (DEMO), więc nie da się tego udostępnić.'}</small></span></label>`}).join('');
 shell(s.i+' '+s.t,`
 <div class="alert y">🧪<div><b>Fikcyjne żądanie ${DEMO}.</b> Nic nie zostanie wysłane. Osoba w pokazie: <b>${e(P().full||'Anna Kowalska')}</b>.</div></div>
 <div class="card v30card"><span class="v30tag">${e(s.who)}</span><h3>Po co?</h3><p>${e(s.goal)}</p>${s.note?`<p class="muted">${s.note}</p>`:''}</div>
 <div class="card v30card"><h3>Co chcesz potwierdzić?</h3>${rows}
  <label class="v30lbl">Jak długo kod ma działać?<select id="v30exp" onchange="v30Pick('exp',this.value)">${EXP.map(x=>`<option value="${x[0]}" ${pick.exp===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></label>
 </div>
 <div class="v30pair" id="v30prev">${preview(k)}</div>
 <button type="button" class="btn v30b" onclick="v30Share('${k}')">Udostępnij tylko zaznaczone (DEMO)</button>
 <button type="button" class="btn ghost" onclick="toast('Odmowa zapisana tylko na tym telefonie (DEMO). Firma nic nie dostała.');location.hash='#/udostepnij'">Odmów</button>
 <p class="muted">Gdy firma prosi o więcej, niż potrzeba, możesz odmówić albo zaznaczyć mniej.</p>`,{tab:'wallet'});
}
function preview(k){
 const s=SC[k];const on=s.ask.filter(a=>pick[a]&&ATTR[a].v());
 const see=on.length?on.map(a=>`<li><b>${e(ATTR[a].t)}:</b> ${e(ATTR[a].v())}</li>`).join(''):'<li>Nic nie zaznaczono.</li>';
 const hide=NEVER.slice();if(!on.includes('imie'))hide.unshift('Imię i nazwisko');
 s.ask.forEach(a=>{if(!on.includes(a)&&a!=='imie'&&ATTR[a].v())hide.push(ATTR[a].t)});
 return `<div class="v30see"><h4>👁️ Co zobaczy firma</h4><ul>${see}</ul></div><div class="v30hide"><h4>🔒 Czego nie zobaczy</h4><ul>${hide.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`;
}
window.v30Pick=function(a,v){pick[a]=v;if(a!=='exp'){const b=document.getElementById('v30prev');if(b)b.innerHTML=preview(sub())}};
window.v30Share=function(k){
 const s=SC[k];if(!s)return;const on=s.ask.filter(a=>pick[a]&&ATTR[a].v());
 if(!on.length){toast('Zaznacz przynajmniej jedno potwierdzenie albo odmów.');return}
 const ex=EXP.find(x=>x[0]===pick.exp)||EXP[1];
 const x={id:rid(8),persona:persona(),k,attrs:on.map(a=>[ATTR[a].t,ATTR[a].v()]),at:Date.now(),exp:Date.now()+ex[2],revoked:false};
 const all=shares();all.unshift(x);sv(SK,all.slice(0,40));pick={};
 toast('Kod DEMO gotowy. Nic nie zostało wysłane.');location.hash='#/udostepnij-kod/'+x.id;
};
function qr(txt){try{const q=qrcode(0,'M');q.addData(txt);q.make();return q.createSvgTag({cellSize:S.senior?6:5,margin:2})}catch(_){return '<div class="v30noqr">QR</div>'}}
function left(x){const ms=x.exp-Date.now();if(ms<=0)return 'wygasł';const m=Math.floor(ms/60e3),h=Math.floor(m/60),d=Math.floor(h/24);return d?`jeszcze ${d} d ${h%24} h`:h?`jeszcze ${h} h ${m%60} min`:`jeszcze ${m} min ${Math.floor(ms/1000)%60} s`}
function code(){
 const x=shares().find(y=>y.id===sub());
 if(!x){shell('Nie ma takiego kodu',`<p>Ten kod został usunięty z historii albo pochodzi z innego telefonu.</p><a class="btn" href="#/udostepnij">Wróć</a>`,{tab:'wallet'});return}
 const s=SC[x.k]||{i:'🎯',t:'Firma',who:'DEMO'},st=status(x);
 const url=location.origin+location.pathname+'#/demo-qr/v30-'+x.id;
 shell('🎯 Kod do okazania',`
 <div class="alert ${st==='aktywne'?'g':'y'}">${st==='aktywne'?'✅':'⛔'}<div><b>Status: ${st}.</b> Kod jest demonstracyjny ${DEMO}. Zawiera tylko adres strony pokazowej, bez Twoich danych.</div></div>
 <div class="card v30card v30code"><span class="v30tag">${s.i} ${e(s.who)}</span>
  <div class="v30qr ${st==='aktywne'?'':'dead'}">${qr(url)}</div>
  <p class="v30num">${x.id.slice(0,4)}-${x.id.slice(4)}</p>
  <p id="v30left" class="v30left">${st==='aktywne'?left(x):(st==='cofnięte'?'Cofnięty':'Wygasł')}</p>
  <p class="muted">Ważny do: ${fmt(x.exp)} (czas polski)</p>
 </div>
 <div class="card v30card"><h3>Firma zobaczy tylko to</h3><ul class="v30list">${x.attrs.map(a=>`<li><b>${e(a[0])}:</b> ${e(a[1])}</li>`).join('')}</ul><p class="muted">Bez PESEL-u, daty urodzenia, adresu i numeru dokumentu.</p></div>
 ${st==='aktywne'?`<button type="button" class="btn v30b" onclick="v30Revoke('${x.id}',1)">Cofnij teraz</button>`:''}
 <a class="btn sec" href="#/udostepnione">Moje udostępnienia</a>
 <a class="btn ghost" href="#/udostepnij">Nowe potwierdzenie</a>`,{tab:'wallet'});
 stopT();if(st==='aktywne')window.v30T=setInterval(()=>{const el=document.getElementById('v30left');if(!el||top()!=='udostepnij-kod'){stopT();return}if(Date.now()>x.exp){stopT();code();return}el.textContent=left(x)},1000);
}
function hist(){
 const mine=shares().filter(x=>x.persona===persona());
 shell('🧾 Moje udostępnienia',`
 <div class="alert b">📱<div><b>Historia jest tylko na tym telefonie ${DEMO}.</b> Każdy członek rodziny ma swoją listę. Cofnięcie w pokazie zmienia status kodu.</div></div>
 ${mine.length?mine.map(x=>{const s=SC[x.k]||{i:'🎯',who:'Firma'},st=status(x);return `<div class="card v30card v30h"><span class="v30tag ${st==='aktywne'?'on':''}">${st}</span><h3>${s.i} ${e(s.who)}</h3><p class="muted">Udostępniono ${fmt(x.at)} · ważne do ${fmt(x.exp)} (czas polski)</p><ul class="v30list">${x.attrs.map(a=>`<li>${e(a[0])}: <b>${e(a[1])}</b></li>`).join('')}</ul><a class="btn sec" href="#/udostepnij-kod/${x.id}">Pokaż kod</a>${st==='aktywne'?`<button type="button" class="btn ghost" onclick="v30Revoke('${x.id}')">Cofnij</button>`:''}</div>`}).join(''):'<div class="card"><p>Nic jeszcze nie udostępniono.</p></div>'}
 <a class="btn" href="#/udostepnij">Nowe potwierdzenie</a>
 ${mine.length?'<button type="button" class="btn ghost" onclick="v30Clear()">Usuń historię z telefonu</button>':''}
 <a class="btn ghost" href="#/privacy">Kto widział moje dane (rejestr)</a>`,{tab:'wallet'});
}
window.v30Revoke=function(id,fromCode){const all=shares();const x=all.find(y=>y.id===id);if(x){x.revoked=true;x.revAt=Date.now();sv(SK,all)}toast('Cofnięto (DEMO). Kod przestał działać.');stopT();fromCode?code():hist()};
window.v30Clear=function(){sv(SK,shares().filter(x=>x.persona!==persona()));toast('Historia tej osoby usunięta z telefonu.');hist()};

// ---------- Element 2: Mój profil życiowy ----------
const TR=[
 {id:'senior',i:'👴',q:'Czy jesteś osobą starszą albo wolisz duże litery?',l:'Senior'},
 {id:'emeryt',i:'🧓',q:'Czy jesteś na emeryturze albo zbliżasz się do niej?',l:'Emerytura'},
 {id:'rodzic',i:'👨‍👩‍👧',q:'Czy masz dzieci, które są pod Twoją opieką?',l:'Rodzic'},
 {id:'auto',i:'🚗',q:'Czy masz samochód?',l:'Mam auto'},
 {id:'firma',i:'🏢',q:'Czy prowadzisz firmę?',l:'Prowadzę firmę'},
 {id:'opiekun',i:'🤝',q:'Czy opiekujesz się kimś bliskim, np. mamą albo tatą?',l:'Opiekuję się kimś'},
 {id:'niepeln',i:'♿',q:'Czy Ty albo ktoś bliski ma orzeczenie o niepełnosprawności?',l:'Niepełnosprawność'},
 {id:'student',i:'🎓',q:'Czy uczysz się albo studiujesz?',l:'Uczę się / studiuję'},
 {id:'najem',i:'🏠',q:'Czy wynajmujesz mieszkanie albo się przeprowadzasz?',l:'Wynajem / przeprowadzka'},
 {id:'praca',i:'💼',q:'Czy szukasz pracy?',l:'Szukam pracy'}
];
const GUESS={anna:['rodzic','auto'],piotr:['firma','auto'],halina:['opiekun','auto'],kuba:['student','najem','praca']};
const W8={
 senior:[['🔠','Tryb seniora: duże litery i czytanie na głos','Włączasz i wyłączasz jednym przełącznikiem na starcie.','#/settings'],['👵','Uczymy się razem','Lekcje z wnukiem: aktualizacja, dokument, fałszywy SMS.','#/razem-uczymy'],['📲','Czy aplikacja jest gotowa?','Sprawdzenie aktualizacji krok po kroku.','#/gotowosc'],['🎣','Fałszywe SMS-y i telefony','Jak rozpoznać oszusta, zanim podasz dane.','#/phishing']],
 emeryt:[['📈','Prognoza emerytury','Pokaz z danymi przykładowymi.','#/emerytura'],['💊','E-recepty','Recepty i przypomnienia o lekach.','#/recepty']],
 rodzic:[['👶','800 plus','Wniosek na nowy okres i terminy.','#/flow/800'],['🚲','Karta rowerowa dziecka','Kalkulator wieku: prawo dziś i projekt.','#/karta-rowerowa'],['👨‍👩‍👧','Konta rodziny','Dokumenty i sprawy dzieci w jednym miejscu.','#/family'],['💳','Karta Dużej Rodziny','Gdy masz troje lub więcej dzieci.','#/flow/kdr']],
 auto:[['🛡️','Koniec OC','Kiedy kończy się polisa w pokazie.','#/oc'],['🔑','Kupiłem albo sprzedałem auto','Terminy: rejestracja, zgłoszenie zbycia, PCC-3, OC.','#/auto-co-dalej'],['🚦','Mandaty i punkty','Sprawdź i opłać.','#/mandat']],
 firma:[['🏢','Moja firma','Sprawy firmy i terminy.','#/firma'],['✏️','Zmiana danych firmy','CEIDG krok po kroku.','#/flow/firmazmiana'],['⏸️','Zawieszenie działalności','Gdy robisz przerwę.','#/flow/firmazawies']],
 opiekun:[['✍️','Upoważnienia','Odbieranie recept i spraw bliskiej osoby.','#/upowaz'],['📜','Pełnomocnictwo','Gdy ktoś ma załatwiać sprawy za bliską osobę.','#/flow/pelnom'],['👵','Uczymy się razem','Pomoc starszej osobie na jej telefonie.','#/razem-uczymy']],
 niepeln:[['🌗','Kontrast i duże litery','Ustawienia dostępności.','#/settings'],['✍️','Upoważnienia','Gdy ktoś pomaga w sprawach.','#/upowaz'],['🤖','Zapytaj asystenta','Nie podaję tu kwot ani warunków świadczeń. Sprawdź je na gov.pl albo w urzędzie.','#/assistant']],
 student:[['🎓','Studia','Sprawy studenta.','#/studia'],['🪪','Legitymacja w telefonie','Dokumenty w portfelu.','#/wallet'],['🗳️','Miejsce głosowania','Gdy mieszkasz w innym mieście.','#/flow/miejsce']],
 najem:[['🚚','Przeprowadzka','Wszystkie sprawy po kolei.','#/flow/przeprowadzka'],['🏡','Meldunek','Zameldowanie przez internet.','#/flow/meldunek'],['🎯','Potwierdź się wynajmującemu','Prawdziwa osoba i 18+, bez PESEL-u i adresu.','#/udostepnij/wynajem']],
 praca:[['🎯','Potwierdź się rekruterowi','Prawdziwa osoba, prawo jazdy, dyplom – bez PESEL-u.','#/udostepnij/rekruter'],['🎣','Fałszywe oferty pracy','Oszuści podszywają się pod firmy. Zgłoś podejrzaną wiadomość.','#/zglos-oszustwo'],['🧭','Gdzie trafia to, co piszesz','Zanim wkleisz CV do asystenta.','#/gdzie-trafia']]
};
const ALLW=[['🏠','Gdzie się ukryć','Najbliższe punkty schronienia (aplikacja PSP).','#/schronienie'],['🛡️','Szkolenia wGotowości','Bezpłatne szkolenie cywilne MON.','#/wgotowosci'],['🎒','Plecak na 72 godziny','Lista rzeczy na sytuację kryzysową.','#/kit'],['⏰','Wszystkie terminy','Przypomnienia z tego telefonu.','#/reminders']];
function prof(){return ld(PK,{})[persona()]||null}
function setProf(v){const all=ld(PK,{});if(v)all[persona()]=v;else delete all[persona()];sv(PK,all)}
let Wz={i:0,a:{},_p:null};
function dates(){
 let r=[];try{r=(P().rem||(typeof REM!=='undefined'?REM:[])||[]).slice()}catch(_){}
 const now=new Date().toISOString().slice(0,10);
 const a=r.filter(x=>x&&x.d).sort((a,b)=>a.d.localeCompare(b.d));
 const row=x=>`<a class="v30item ${x.d<now?'late':''}" href="${x.a||'#/reminders'}"><b>${x.i||'⏰'} ${e(x.t)}</b><small>${x.d<now?'Termin minął: ':'Do: '}${x.d.split('-').reverse().join('.')} · DEMO</small></a>`;
 const fut=a.filter(x=>x.d>=now).slice(0,4),past=a.filter(x=>x.d<now);
 if(!fut.length&&!past.length)return '';
 return fut.map(row).join('')+(past.length?`<details class="v30past"><summary>Po terminie w pokazie: ${past.length}</summary>${past.map(row).join('')}</details>`:'')+'<a class="btn ghost" href="#/reminders">Wszystkie terminy</a>';
}
function profile(){
 const pr=prof();
 if(!pr){
  const g=(GUESS[persona()]||[]).map(id=>TR.find(t=>t.id===id).l).join(', ');
  shell('🧭 Mój profil życiowy',`
  <div class="alert b">📱<div><b>Dane zostają na telefonie.</b> Nie trafiają do serwera, do Gemmy ani do żadnej firmy. Możesz je usunąć jednym przyciskiem. ${DEMO}</div></div>
  <div class="card v30card"><h3>Asystent zapyta raz o kilka prostych rzeczy</h3><p>Na przykład: czy masz auto, dzieci, firmę albo opiekujesz się kimś. Potem sam pokaże, czego pilnować: terminy, świadczenia i sprawy do załatwienia.</p>
  <a class="btn v30b" href="#/moj-profil-pytania">Zacznij (${TR.length} pytań, ok. minuty)</a>
  ${g?`<p class="muted">W pokazie osoba ${e(P().name||'')} pasuje do: ${e(g)}. Nic nie jest zaznaczone, dopóki nie odpowiesz.</p>`:''}</div>
  <div class="card v30card"><h3>Dla każdego, bez pytań</h3>${ALLW.map(item).join('')}</div>`,{tab:'more'});
  return;
 }
 const on=TR.filter(t=>pr.t[t.id]);
 const seen={};const list=[];on.forEach(t=>(W8[t.id]||[]).forEach(x=>{if(!seen[x[3]]){seen[x[3]]=1;list.push([t,x])}}));
 const d=dates();
 shell('🧭 Co mnie dotyczy',`
 <div class="alert g">📱<div><b>Profil jest tylko na tym telefonie</b> (zapisany ${fmt(pr.at)}, czas polski). Nie wysyłam go do Gemmy ani do serwera. ${DEMO}</div></div>
 <div class="v30chips">${on.length?on.map(t=>`<span class="v30chip">${t.i} ${e(t.l)}</span>`).join(''):'<span class="v30chip">Bez zaznaczonych sytuacji</span>'}</div>
 ${pr.t.senior&&!S.senior?`<div class="card v30card"><h3>Włączyć duże litery?</h3><p>Zaznaczyłeś, że wolisz duże litery. Tryb seniora możesz wyłączyć w każdej chwili.</p><button type="button" class="btn v30b" onclick="S.senior=true;save();route()">Włącz tryb seniora</button></div>`:''}
 ${d?`<div class="card v30card"><h3>⏰ Najbliższe terminy</h3>${d}</div>`:''}
 ${list.length?`<div class="card v30card"><h3>👀 Pilnuję dla Ciebie</h3>${list.map(([t,x])=>item(x,t)).join('')}</div>`:''}
 <div class="card v30card"><h3>Dla każdego</h3>${ALLW.map(x=>item(x)).join('')}</div>
 <a class="btn sec" href="#/moj-profil-pytania">Zmień odpowiedzi</a>
 <button type="button" class="btn ghost v30del" onclick="v30DelProf()">🗑️ Usuń mój profil z telefonu</button>
 <p class="muted">Lista nie jest decyzją urzędu. Pokazuje sprawy z prototypu, które mogą Cię dotyczyć. Kwoty i warunki świadczeń sprawdź w źródłach na gov.pl.</p>`,{tab:'more'});
}
function item(x,t){return `<a class="v30item" href="${x[3]}"><b>${x[0]} ${e(x[1])}</b><small>${t?e(t.l)+' · ':''}${e(x[2])}</small></a>`}
function wizard(){
 if(Wz._p!==persona()){const pr=prof();Wz={i:0,a:pr?Object.assign({},pr.t):{},_p:persona()}}
 if(Wz.i>=TR.length){finish();return}
 const t=TR[Wz.i],ans=Wz.a[t.id];
 shell('🧭 Pytania asystenta',`
 <div class="v30prog"><span style="width:${Math.round(Wz.i/TR.length*100)}%"></span></div>
 <p class="muted">Pytanie ${Wz.i+1} z ${TR.length} · odpowiedzi zostają na telefonie ${DEMO}</p>
 <div class="msg a v30q"><span class="v30qi">${t.i}</span> ${e(t.q)}</div>
 <div class="v30yn">
  <button type="button" class="btn ${ans===true?'v30b':'sec'}" onclick="v30Ans(true)">Tak</button>
  <button type="button" class="btn ${ans===false?'v30b':'sec'}" onclick="v30Ans(false)">Nie</button>
 </div>
 <button type="button" class="btn ghost" onclick="v30Ans(null)">Pomiń</button>
 ${Wz.i?'<button type="button" class="btn ghost" onclick="v30Back()">‹ Poprzednie pytanie</button>':''}
 <p class="muted">Nie pytam o PESEL, adres, zarobki ani choroby. Wystarczy tak albo nie.</p>`,{tab:'more'});
}
function finish(){
 const t={};TR.forEach(x=>{if(Wz.a[x.id]===true)t[x.id]=true});
 setProf({t,at:Date.now()});Wz={i:0,a:{},_p:null};
 toast('Profil zapisany tylko na tym telefonie.');
 if(top()==='moj-profil')profile();else location.hash='#/moj-profil';
}
window.v30Ans=function(v){const t=TR[Wz.i];if(v===null)delete Wz.a[t.id];else Wz.a[t.id]=v;Wz.i++;wizard()};
window.v30Back=function(){Wz.i=Math.max(0,Wz.i-1);wizard()};
window.v30DelProf=function(){setProf(null);Wz={i:0,a:{},_p:null};toast('Profil usunięty z telefonu.');profile()};

// ---------- Asystent: reguły w telefonie ----------
const ANS_SH='Możesz potwierdzić firmie tylko to, czego potrzebuje: że jesteś prawdziwą osobą, że masz 18 lat albo jakie masz kategorie prawa jazdy, bez PESEL-u i adresu. To pokaz DEMO oparty na zasadzie selektywnego ujawniania z rozporządzenia (UE) 2024/1183; polska ustawa o portfelu jest na razie projektem. Otworzę wybór. Odpowiedź z reguł w telefonie, bez AI.';
const ANS_PR='Zrobię listę spraw, które Cię dotyczą: terminy, świadczenia i sprawy do załatwienia. Zapytam raz o kilka rzeczy (tak/nie). Odpowiedzi zostają tylko na tym telefonie i możesz je usunąć. Odpowiedź z reguł w telefonie, bez AI.';
function v30Rule(q){
 let l='';try{l=norm(q)}catch(_){l=String(q||'').toLowerCase()}
 if(!l)return null;
 if(/rekruter|pracodawc|ogloszeni\w* o prac/.test(l)&&/udostepn|potwierdz|pokaz|weryfik|prawdziw|dane/.test(l))return ['#/udostepnij/rekruter',ANS_SH];
 if(/wynajmuj|najemc|wlasciciel\w* mieszkani/.test(l)&&/udostepn|potwierdz|pokaz|weryfik|prawdziw|dane/.test(l))return ['#/udostepnij/wynajem',ANS_SH];
 if(/pokaz\w* tylko (wiek|pelnolet|18)|tylko (ze mam )?18|udostepn\w* tylko wiek/.test(l))return ['#/udostepnij/sklep',ANS_SH];
 if(/pokaz\w* tylko to|tylko to,? co (trzeba|potrzeb)|udostepn\w* (tylko )?wybran|selektywn\w* (ujawn|udostepn)|bez (podawania )?pesel\w*.{0,30}(potwierdz|udowodn)|udowodni\w*.{0,20}(ze jestem|prawdziw)|moje udostepnienia|cofnij udostepn/.test(l))return [/moje udostepn|cofnij/.test(l)?'#/udostepnione':'#/udostepnij',ANS_SH];
 if(/co mnie dotyczy|moj profil|profil zyciow|czego (mam|powinien\w*) pilnowac|co powinien\w* (zalatwic|pilnowac)|o czym (mam|musze) pamietac|co mi grozi.{0,10}termin/.test(l))return ['#/moj-profil',ANS_PR];
 return null;
}
window.v30Rule=v30Rule;
const _ask=ask;
ask=async function(q){const hit=v30Rule(q);if(!hit)return _ask.apply(this,arguments);q=(q||'').trim();if(!q)return;if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});window.v14Last={k:'rules',fb:false,shown:1};chat.push({r:'a',t:hit[1]+'<br><b>Czy chcesz kontynuować?</b>',act:hit[0]});drawChat();try{speak(String(hit[1]).replace(/<[^>]+>/g,''))}catch(_){}};
window.ask=ask;
if(window.v18Route){const _v=window.v18Route;window.v18Route=function(q){const hit=v30Rule(q);if(hit)return {kind:'act',hit:[null,hit[0],hit[1]],act:hit[0]};return _v(q)}}
try{
 INT.unshift([/pokaż tylko to|udostępnij.{0,20}rekruter|selektywn/i,'#/udostepnij',ANS_SH],[/co mnie dotyczy|mój profil|profil życiowy/i,'#/moj-profil',ANS_PR]);
 ALL.push(['🎯','Pokaż tylko to, co trzeba','#/udostepnij','udostępnij rekruter bank wynajmujący sklep przychodnia 18+ prawo jazdy dyplom bez pesel selektywne portfel kod'],['🧭','Mój profil życiowy','#/moj-profil','co mnie dotyczy profil terminy świadczenia senior rodzic auto firma opiekun student emeryt wynajem praca']);
}catch(_){}

// ---------- Wejścia (ukryte / pogrupowane) ----------
const LEAD=(id,href,title,s)=>`<a id="${id}" class="v30lead" href="${href}"><b>${title}</b><small>${s}</small></a>`;
function inject(){
 const sc=app&&app.querySelector('.scroll');if(!sc)return;
 const p=top();
 if(p==='home'&&!sc.querySelector('#v30home')&&document.getElementById('v19h')){
  const pr=prof();const n=pr?TR.filter(t=>pr.t[t.id]).length:0;
  const html=LEAD('v30home','#/moj-profil','🧭 Co mnie dotyczy',pr?`Twój profil: ${n} ${n===1?'sytuacja':'sytuacje'}. Lista spraw do pilnowania. Dane tylko na telefonie.`:'Odpowiedz raz na kilka pytań tak/nie. Dane zostają na telefonie.');
  const anchor=document.getElementById('v29home')||document.getElementById('v19h');
  if(anchor)anchor.insertAdjacentHTML('afterend',html);else sc.insertAdjacentHTML('afterbegin',html);
 }
 if((p==='disclose'||p==='kto-pyta'||p==='potwierdz-wiek'||p==='portfel-unijny'||p==='prawa-portfela'||p==='privacy'||p==='wallet')&&!sc.querySelector('#v30sh')){
  sc.insertAdjacentHTML('afterbegin',LEAD('v30sh','#/udostepnij','🎯 Pokaż tylko to, co trzeba','Rekruter, bank, wynajmujący: „prawdziwa osoba”, „18+”, „kat. B” – bez PESEL-u. Kod z terminem i cofnięciem.'));
 }
 if(p==='family'&&!sc.querySelector('#v30fam')){
  sc.insertAdjacentHTML('afterbegin',LEAD('v30fam','#/moj-profil','🧭 Profil życiowy tej osoby','Każdy członek rodziny ma osobny profil i osobną listę spraw. Zapis tylko na telefonie.'));
 }
 if(p==='settings'&&!sc.querySelector('#v30set')){
  sc.insertAdjacentHTML('afterbegin',`<div id="v30set" class="card v30card"><h3>🧭 Mój profil życiowy</h3><p>${prof()?'Profil tej osoby jest zapisany tylko na tym telefonie.':'Profil nie jest zapisany.'}</p><a class="btn sec" href="#/moj-profil">Otwórz profil</a>${prof()?'<button type="button" class="btn ghost" onclick="v30DelProf()">Usuń profil z telefonu</button>':''}</div>`);
 }
 if(p==='assistant'&&!document.getElementById('v30chip')){
  const chips=[...sc.querySelectorAll('.chips')].filter(c=>!c.closest('.chat')&&!c.closest('.msg'));
  const box=chips[chips.length-1];
  if(box)box.insertAdjacentHTML('beforeend','<button type="button" class="chip" id="v30chip" onclick="ask(\'co mnie dotyczy\')">Co mnie dotyczy?</button><button type="button" class="chip" id="v30chip2" onclick="ask(\'udostępnij dane rekruterowi\')">Potwierdź się rekruterowi</button>');
 }
 const more=document.getElementById('v19more');
 if(more&&!more.querySelector('[data-v30tile]')){
  const g=[...more.querySelectorAll('.v19g')].find(d=>/Dokument|Dane/.test((d.querySelector('summary')||{}).textContent||''));
  const grid=g&&g.querySelector('.grid');
  if(grid){grid.insertAdjacentHTML('afterbegin','<button type="button" class="tile" data-v30tile="1" onclick="location.hash=\'#/udostepnij\'"><b>🎯</b>Pokaż tylko to, co trzeba</button>');const n=g.querySelector('summary .muted');if(n)n.textContent=String(grid.querySelectorAll('.tile').length)}
  const g2=[...more.querySelectorAll('.v19g')].find(d=>/Rodzin/.test((d.querySelector('summary')||{}).textContent||''));
  const grid2=g2&&g2.querySelector('.grid');
  if(grid2&&!grid2.querySelector('[data-v30p]')){grid2.insertAdjacentHTML('afterbegin','<button type="button" class="tile" data-v30tile="1" data-v30p="1" onclick="location.hash=\'#/moj-profil\'"><b>🧭</b>Mój profil życiowy</button>');const n=g2.querySelector('summary .muted');if(n)n.textContent=String(grid2.querySelectorAll('.tile').length)}
 }
}

const R={'udostepnij':scenOrHub,'pokaz-tylko':scenOrHub,'pokaz-tylko-to':scenOrHub,'udostepnij-kod':code,'udostepnione':hist,'moje-udostepnienia':hist,'moj-profil':profile,'profil-zyciowy':profile,'co-mnie-dotyczy':profile,'moj-profil-pytania':wizard};
function scenOrHub(){sub()?scen():hub()}
const _r=route;
route=function(){const p=top();stopT();if(R[p]){try{clearInterval(threatT)}catch(_){}try{clearInterval(camT)}catch(_){}R[p]();try{inject()}catch(_){}return}const out=_r.apply(this,arguments);try{inject()}catch(_){}return out};
window.route=route;onhashchange=route;
new MutationObserver(()=>{try{inject()}catch(_){}}).observe(app,{childList:true,subtree:true});
const st=document.createElement('style');st.textContent=`
.v30lead{display:flex;flex-direction:column;gap:3px;text-decoration:none;border-radius:16px;padding:14px;margin:0 0 10px;background:#fff;color:#14213d;border:1.5px solid #d5deee;box-shadow:0 1px 3px #0001}
.v30lead b{color:#0b3d91;font-size:1.12em}.v30lead small{font-weight:650;line-height:1.35}
.v30card .btn,.v30b,.v30yn .btn{display:block;text-align:center;text-decoration:none;margin:8px 0;min-height:48px;line-height:1.3;box-sizing:border-box;width:100%}
.v30tag{display:inline-block;background:#eef2f8;color:#24324a;border:1px solid #c9d3e3;border-radius:8px;padding:2px 8px;font-size:.78em;font-weight:700;margin-bottom:6px}.v30tag.on{background:#e5f6ec;border-color:#14804a;color:#0d5c2e}
.v30grid{display:grid;gap:8px}
.v30scen,.v30item{display:flex;flex-direction:column;gap:2px;text-decoration:none;color:#14213d;border:1px solid #d5deee;border-radius:14px;padding:12px;background:#f8faff;margin:0 0 8px}
.v30scen b,.v30item b{color:#0b3d91}.v30scen small,.v30item small{line-height:1.35;color:#43506a}
.v30past summary{cursor:pointer;font-weight:700;color:#8a1c1c;padding:8px 0}.v30item.late{border-color:#a32032;background:#fde8ea}
.v30steps,.v30list{margin:0;padding-left:20px}.v30steps li,.v30list li{margin:0 0 6px;line-height:1.45}
.v30f{display:flex;gap:10px;align-items:flex-start;border:1px solid #d5deee;border-radius:12px;padding:10px;margin:0 0 8px;cursor:pointer}
.v30f input{width:22px;height:22px;flex:none;margin-top:2px}.v30f span{display:flex;flex-direction:column;gap:2px}.v30f i{font-style:normal;font-size:.8em;color:#0b3d91;font-weight:700}.v30f small{color:#43506a;line-height:1.35}
.v30f.off{opacity:.6;cursor:not-allowed}
.v30lbl{display:flex;flex-direction:column;gap:6px;font-weight:700;margin-top:6px}.v30lbl select{min-height:44px;border-radius:10px;border:1px solid #c9d3e3;padding:6px 10px;font:inherit}
.v30pair{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 10px}
.v30pair>div{border-radius:14px;padding:10px;border:1.5px solid}.v30pair h4{margin:0 0 6px}.v30pair ul{margin:0;padding-left:18px}.v30pair li{margin:0 0 4px;line-height:1.35}
.v30see{background:#e5f6ec;border-color:#14804a!important}.v30hide{background:#f4f5f7;border-color:#9aa3b2!important}
.v30code{text-align:center}.v30qr{display:inline-block;background:#fff;padding:8px;border-radius:12px;border:1px solid #d5deee}.v30qr.dead{opacity:.25;filter:grayscale(1)}
.v30num{font:800 1.6em ui-monospace,monospace;letter-spacing:.12em;margin:8px 0 0}.v30left{font-weight:800;color:#0b3d91;margin:4px 0}
.v30noqr{width:120px;height:120px;display:grid;place-items:center;border:2px dashed #999}
.v30chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}.v30chip{background:#eef2f8;border:1px solid #c9d3e3;border-radius:999px;padding:4px 10px;font-weight:650;font-size:.9em}
.v30prog{height:8px;background:#e6ebf3;border-radius:99px;overflow:hidden;margin:4px 0 6px}.v30prog span{display:block;height:100%;background:#0b3d91}
.v30q{font-size:1.15em;font-weight:650;margin:10px 0}.v30qi{font-size:1.3em}
.v30yn{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.v30lead:focus-visible,.v30scen:focus-visible,.v30item:focus-visible,.v30f:focus-within,.v30b:focus-visible{outline:3px solid #14213d;outline-offset:3px}
body.senior .v30lead{padding:18px}body.senior .v30lead b{font-size:1.4em}body.senior .v30lead small{font-size:1.05em}
body.senior .v30card .btn,body.senior .v30b,body.senior .v30yn .btn{min-height:64px;font-size:1.2em}
body.senior .v30yn{grid-template-columns:1fr}body.senior .v30pair{grid-template-columns:1fr}
body.senior .v30card p,body.senior .v30steps li,body.senior .v30list li,body.senior .v30f b,body.senior .v30item b,body.senior .v30scen b,body.senior .v30pair li{font-size:1.15em}
body.senior .v30f input{width:30px;height:30px}body.senior .v30q{font-size:1.4em}
body.contrast .v30lead,body.contrast .v30scen,body.contrast .v30item,body.contrast .v30f,body.contrast .v30pair>div,body.contrast .v30tag,body.contrast .v30chip{background:#000;color:#fff;border-color:#fff}
body.contrast .v30lead b,body.contrast .v30scen b,body.contrast .v30item b,body.contrast .v30left{color:#ffeb3b}
@media (max-width:360px){.v30pair{grid-template-columns:1fr}}
`;document.head.appendChild(st);
try{inject()}catch(_){}
route();
})();
