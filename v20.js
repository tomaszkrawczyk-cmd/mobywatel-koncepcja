// ===== v20: tryb alarmowy (offline, rodzina, senior) i emerytura liczona tylko na telefonie =====
// Autor koncepcji: Tomasz Krawczyk – Supplemental. Kwoty, schrony i statusy są fikcyjne (DEMO).
// Nie rejestrujemy service workera: w projekcie go nie ma, a przechwycenie sieci mogłoby
// naruszyć pamięć podręczną modelu Bielik. Treść alarmu trzymamy w localStorage i w osobnej
// nazwie Cache Storage (mobywatel-koncepcja-alarm-v20), bez ruszania innych cache.
(function(){
const GUIDE_KEY='mob20_alarm_guide_v1';
const STATE_KEY='mob20_alarm_state_v1';
const PEN_KEY='mob20_pension_v1';
const GUIDE_VER=1;
const CACHE_NAME='mobywatel-koncepcja-alarm-v20';
const FEM={anna:true,halina:true,piotr:false,kuba:false};
const PROF={
 anna:{age:35,sex:'k',gross:6200,years:12,note:'przykładowa pensja z pokazu'},
 piotr:{age:43,sex:'m',gross:9800,years:20,note:'przykładowa pensja z pokazu'},
 halina:{age:57,sex:'k',gross:5400,years:34,note:'przykładowa pensja nauczycielki z pokazu'},
 kuba:{age:20,sex:'m',gross:4200,years:1,note:'przykład pierwszej pracy, nie stypendium'}
};
const STEPS=[
 'Zostań w budynku. Nie wychodź na ulicę i nie stój przy oknie.',
 'Zejdź niżej albo wejdź do pokoju bez okien, jak najdalej od ściany zewnętrznej.',
 'Weź telefon, wodę, leki i coś ciepłego. Dokumenty masz w tej aplikacji.',
 'Jeśli ktoś jest ranny, dzwoń pod 112.',
 'Nie nagrywaj i nie wysyłaj zdjęć miejsca, w które coś uderzyło.',
 'Czekaj na odwołanie alarmu. Potem naciśnij zielony przycisk – rodzina na tym telefonie zobaczy, że jesteś bezpieczny albo bezpieczna.'
];
const SHELTERS={
 Warszawa:{name:'Schron przykładowy „Dąb”',kind:'ukrycie (wymysł)',addr:'ul. Demonstracyjna 1, Warszawa',dist:'350 m',walk:'4 min'},
 Kraków:{name:'Miejsce przykładowe „Przykład”',kind:'miejsce doraźne (wymysł)',addr:'ul. Fikcyjna 7, Kraków',dist:'500 m',walk:'6 min'},
 Lublin:{name:'Ukrycie przykładowe „Lipa”',kind:'ukrycie (wymysł)',addr:'ul. Wzorcowa 3, Lublin',dist:'420 m',walk:'5 min'},
 Gdańsk:{name:'Schron przykładowy „Fala”',kind:'schron (wymysł)',addr:'ul. Modelowa 9, Gdańsk',dist:'280 m',walk:'3 min'}
};
const ALARM_RE=/co robic podczas alarmu|podczas alarmu|w czasie alarmu|tryb alarmow|jestem bezpieczn|co robic gdy alarm|jak sie zachowac.{0,16}alarm|alarm powietrz/;
const PEN_RE=/ile bede miec emerytur|ile bede mial(?:a|em)? emerytur|moja przyszla emerytura|emerytura na telefonie|emerytur\w{0,12} (?:ppk|ikze|ike)|(?:ppk|ikze|ike).{0,30}emerytur|o ile (?:wyzsza|wieksza|wzrosnie).{0,24}emerytur|emerytur\w{0,16} pozniej|pozniej na emerytur/;

const loadJSON=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
const saveJSON=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
function prof(){return PROF[S.persona]||PROF.anna}
function lata(n){n=Math.abs(Number(n)||0);if(n===1)return 'rok';const a=n%10,b=n%100;if(a>=2&&a<=4&&!(b>=12&&b<=14))return 'lata';return 'lat'}
function money(n){n=Math.round(Number(n)||0);if(!isFinite(n))n=0;return n.toLocaleString('pl-PL')+' zł'}
function parseZl(s){const n=parseFloat(String(s||'').replace(/\s/g,'').replace(',','.'));if(!isFinite(n)||n<=0)return 0;return Math.min(n,5000000)}
function lifeMonths(age){const pts=[[60,264],[65,216],[70,174],[75,138]];const a=Math.min(75,Math.max(60,+age||60));
 for(let i=1;i<pts.length;i++){const a0=pts[i-1][0],m0=pts[i-1][1],a1=pts[i][0],m1=pts[i][1];if(a<=a1)return Math.round(m0+(m1-m0)*(a-a0)/(a1-a0))}return 138}
function forecast(age,extra){const p=prof();const left=Math.max(0,age-p.age);const year=0.1952*p.gross*12;const past=p.years*year;const future=left*year;const ex=+extra||0;const capital=past+future+ex;const months=lifeMonths(age);
 return {past,future,capital,months,monthly:months?capital/months:0,left,year,extra:ex,extraMonthly:months?ex/months:0,zusMonthly:months?(past+future)/months:0}}
function baseAge(){return prof().sex==='k'?60:65}
function pen(){const j=loadJSON(PEN_KEY)||{};const age=+j.age;return {age:age>=60&&age<=75?age:null,consent:!!j.consent,ppk:j.consent?String(j.ppk||''):'',ike:j.consent?String(j.ike||''):'',ikze:j.consent?String(j.ikze||''):''}}
function savePen(p){const rec={age:p.age||null,consent:!!p.consent,ppk:p.consent?p.ppk:'',ike:p.consent?p.ike:'',ikze:p.consent?p.ikze:''};saveJSON(PEN_KEY,rec);return rec}
function chosenAge(){return pen().age||baseAge()}
function voluntaryCapital(){const p=pen();if(!p.consent)return 0;return parseZl(p.ppk)+parseZl(p.ike)+parseZl(p.ikze)}
function checkins(){const j=loadJSON(STATE_KEY);return j&&j.checkins||{}}
function setCheck(k,val){const all=checkins();if(val)all[k]=val;else delete all[k];saveJSON(STATE_KEY,{checkins:all})}
function when(iso){try{return new Date(iso).toLocaleString('pl-PL',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}catch(e){return ''}}
function guidePayload(){return {v:GUIDE_VER,steps:STEPS,shelters:SHELTERS,at:new Date().toISOString()}}
function cacheGuide(){const payload=guidePayload();const ok=saveJSON(GUIDE_KEY,payload);
 if(window.caches&&caches.open)caches.open(CACHE_NAME).then(c=>c.put(new Request('./alarm-guide-v20.json'),new Response(JSON.stringify(payload),{headers:{'Content-Type':'application/json'}}))).catch(()=>{});
 return ok}
function guideData(){const j=loadJSON(GUIDE_KEY);if(j&&j.v===GUIDE_VER&&Array.isArray(j.steps)&&j.steps.length)return j;return {v:GUIDE_VER,steps:STEPS,shelters:SHELTERS,at:null}}
function shelterFor(data){const city=(PERS[S.persona]||{}).city||'Warszawa';const all=(data||guideData()).shelters||SHELTERS;return all[city]||all.Warszawa}
function wordSafe(k){return FEM[k]?'bezpieczna':'bezpieczny'}

function boardHTML(){const all=checkins();const me=S.persona;
 return Object.keys(PERS).map(k=>{const p=PERS[k];const c=all[k];const on=!!c;
  return `<div class="v20who ${k===me?'me':''}"><b class="av">${esc(p.name[0])}</b><span><b>${esc(p.name)}</b>${k===me?' <span class="demo">to Ty</span>':''}<br><span class="${on?'v20okdot':'v20wait'}">${on?esc(wordSafe(k))+' · '+esc(when(c.at)):'brak potwierdzenia'}</span></span></div>`}).join('')}

function alarm(){
 const data=guideData();const sh=shelterFor(data);const me=S.persona||'anna';const mine=checkins()[me];const stored=!!data.at;
 shell('🚨 Tryb alarmowy',`
 <div class="alert r">📞<div><b>To symulacja (DEMO).</b> W prawdziwym zagrożeniu dzwoń <a href="tel:112"><b>112</b></a> i słuchaj służb oraz Alertu RCB. Ten ekran nikogo nie wzywa.</div></div>
 <p class="v20lead">Sześć krótkich kroków. Duże litery, bez szukania w menu.</p>
 <ol class="v20steps">${data.steps.map((s,i)=>`<li><span>${i+1}</span><p>${esc(s)}</p></li>`).join('')}</ol>
 <button type="button" class="btn sec" onclick="v20Speak()">🔊 Przeczytaj kroki</button>
 <p class="muted">${'speechSynthesis'in window?'Czytanie używa darmowej mowy przeglądarki (Web Speech API) i nic nie wysyła.':'Ta przeglądarka nie czyta na głos – kroki są na ekranie.'}</p>
 <div class="v20shelter card">
  <div class="v20stamp">DEMO · DANE WYMYŚLONE</div>
  <h3>Najbliższe miejsce schronienia</h3>
  <p><b>Nie idź pod ten adres. Taki obiekt nie istnieje.</b> Odległość nie pochodzi z GPS.</p>
  <div class="row"><span>Nazwa</span><b style="text-align:right">${esc(sh.name)}</b></div>
  <div class="row"><span>Rodzaj</span><b>${esc(sh.kind)}</b></div>
  <div class="row"><span>Adres z pokazu</span><b style="text-align:right">${esc(sh.addr)}</b></div>
  <div class="row"><span>Odległość w pokazie</span><b>${esc(sh.dist)} · ${esc(sh.walk)} pieszo</b></div>
  <p class="muted">Prawdziwe mapy prowadzą służby: <a href="https://gdziesieukryc.pl" target="_blank" rel="noopener">gdziesieukryc.pl</a> i <a href="https://schrony.straz.gov.pl" target="_blank" rel="noopener">schrony.straz.gov.pl</a>. Dane bywają niepełne.</p>
 </div>
 <div class="card">
  <h3>Rodzina na tym telefonie</h3>
  <p class="muted">Te same osoby, co na przełączniku kont (Anna, Piotr, Halina, Kuba). Status widać po zmianie osoby. Nic nie wychodzi z urządzenia.</p>
  ${boardHTML()}
  <button type="button" class="btn v20safe" onclick="v20Checkin()">Jestem bezpieczny/bezpieczna</button>
  ${mine?`<p class="v20okdot">Zapisano dla ${esc((PERS[me]||{}).full||'Ciebie')}: ${esc(wordSafe(me))}, ${esc(when(mine.at))}.</p><button type="button" class="btn ghost" onclick="v20Undo()">Cofnij mój status</button>`:'<p class="muted">Jeszcze nie potwierdzono dla aktualnej osoby.</p>'}
  <p class="muted"><span class="demo">DEMO</span> Powiadomienie do rodziny nie jest wysyłane. W prawdziwej aplikacji status trafiłby tylko do osób, które same dodałaś lub dodałeś.</p>
 </div>
 <div class="card"><h3>Zapisane w telefonie</h3><p class="muted">${stored?'Kroki i schron DEMO odczytano z pamięci przeglądarki (localStorage'+(data.at?', zapis '+esc(when(data.at)):'')+').':'Pokazano kopię z aplikacji i zapisano ją w telefonie.'} Ekran nie pobiera tej treści z internetu. Osobna pamięć podręczna alarmu nie rusza plików modelu Bielik. Brak service workera – nie przechwytujemy sieci.</p>
 <p class="muted">Zostaje też lista, kto nacisnął zielony przycisk i o której. <a href="#/plan">Plan rodzinny</a> · <a href="#/kit">Plecak</a> · <a href="#/security">Alarmy i mapa</a></p></div>
 <a class="v20call" href="tel:112">📞 Zadzwoń 112</a>`,{tab:'security'});
}
window.v20Speak=function(){if(!('speechSynthesis'in window))return toast('Ta przeglądarka nie czyta na głos. Kroki są na ekranie.');
 const steps=guideData().steps.map((s,i)=>(i+1)+'. '+s).join(' ');
 speak('Symulacja. '+steps+' W prawdziwym zagrożeniu dzwoń pod numer sto dwanaście.')};
window.v20Checkin=function(){const k=S.persona||'anna';setCheck(k,{at:new Date().toISOString()});alarm();toast('Zapisano tylko na tym telefonie (DEMO). Inna osoba z rodziny zobaczy to po przełączeniu konta.')};
window.v20Undo=function(){setCheck(S.persona||'anna',null);alarm();toast('Cofnięto status tej osoby na tym telefonie.')};

function penAnswer(){const p=prof();const age=chosenAge();const extra=voluntaryCapital();const f=forecast(age,extra);const b=forecast(baseAge(),extra);const later=age-baseAge();const d=f.monthly-b.monthly;
 let grow='';
 if(later>0)grow=` O ${later} ${lata(later)} później niż punkt odniesienia (${baseAge()} lat) kwota w tym przykładzie jest wyższa o około ${money(d)}.`;
 else if(later<0)grow=` To o ${-later} ${lata(-later)} wcześniej niż punkt odniesienia (${baseAge()} lat) – w tym przykładzie około ${money(-d)} mniej.`;
 const pill=extra>0?' Do kwoty doliczono PPK, IKE lub IKZE zapisane na tym telefonie. Nie podaję tych kwot asystentowi.':' PPK, IKE i IKZE doliczysz tylko jeśli sam je wpiszesz i włączysz zgodę. Bez zgody ich nie zapisuję.';
 const who=(PERS[S.persona]||{}).name||'tej osoby';
 return `W przykładzie DEMO dla ${esc(who)} (${p.age} lat), przy wieku ${age} lat, wychodzi około <b>${money(f.monthly)}</b> miesięcznie.${grow}${pill} Liczę to wyłącznie w przeglądarce, nie z ZUS. Odpowiedź z reguł w telefonie, bez AI.`}
function v20Rule(q){const l=norm(q);
 if(ALARM_RE.test(l))return [ALARM_RE,'#/alarm','Podczas alarmu zostań w budynku, zejdź do pomieszczenia bez okien, weź telefon, wodę i leki, nie filmuj uderzeń i dzwoń 112, jeśli ktoś jest ranny. Otworzę tryb alarmowy: duże kroki, schron oznaczony DEMO i przycisk „Jestem bezpieczny/bezpieczna” dla rodziny na tym telefonie. <span class="demo">DEMO</span> W prawdziwym zagrożeniu słuchaj służb. Odpowiedź z reguł w telefonie, bez AI.'];
 if(PEN_RE.test(l))return [PEN_RE,'#/emerytura-telefon',penAnswer()];
 return null}
window.v20Rule=v20Rule;

function outHTML(age,p){const extra=p.consent?parseZl(p.ppk)+parseZl(p.ike)+parseZl(p.ikze):0;const f=forecast(age,extra);const b=forecast(baseAge(),extra);const later=age-baseAge();const d=f.monthly-b.monthly;
 let delta;
 if(later===0)delta=`Punkt odniesienia w tym przykładzie: ${baseAge()} lat.`;
 else if(later>0)delta=`O ${later} ${lata(later)} później niż ${baseAge()} lat: około ${money(d)} więcej miesięcznie.`;
 else delta=`O ${-later} ${lata(-later)} wcześniej niż ${baseAge()} lat: około ${money(-d)} mniej.`;
 const saved=loadJSON(PEN_KEY);
 let store;
 if(!saved)store='Nic nie jest zapisane. Gdy ruszysz suwak, w telefonie zostanie sam wiek. Kwoty PPK, IKE i IKZE dopiszemy tylko po włączeniu zgody. Nie wysyłamy ich na serwer, do ZUS ani do asystenta.';
 else{const has=!!(saved.consent&&(parseZl(saved.ppk)||parseZl(saved.ike)||parseZl(saved.ikze)));
  store='Na tym telefonie zostaje: wybrany wiek ('+(saved.age||age)+' lat)'+(has?', kwoty PPK, IKE i IKZE':', bez kwot PPK, IKE i IKZE')+'. Nie wysyłamy tego na serwer, do ZUS ani do asystenta. „Usuń moje dane” kasuje ten zapis.'}
 return {f,b,delta,store,extra}}
function collectPen(){const prev=pen();const ageEl=document.getElementById('v20age');const age=ageEl?Math.min(75,Math.max(60,+ageEl.value||prev.age||baseAge())):(prev.age||baseAge());
 const box=document.getElementById('v20ok');const consent=box?box.checked:prev.consent;const raw=id=>{const el=document.getElementById(id);return el?String(el.value||'').replace(/[^\d\s.,]/g,'').slice(0,16):(prev[id]||'')};
 return {age,consent,ppk:consent?raw('v20ppk'):'',ike:consent?raw('v20ike'):'',ikze:consent?raw('v20ikze'):''}}
function paintPen(){const ageEl=document.getElementById('v20age');if(!ageEl)return;const p=collectPen();const o=outHTML(p.age,p);const z=document.getElementById('v20zl');if(z)z.textContent=money(o.f.monthly);
 const d=document.getElementById('v20delta');if(d)d.textContent=o.delta;const lab=document.getElementById('v20ageLab');if(lab)lab.textContent=String(p.age);
 ageEl.setAttribute('aria-valuetext',p.age+' lat');
 const base=document.getElementById('v20base');if(base)base.textContent=money(o.b.monthly);
 const now=document.getElementById('v20now');if(now)now.textContent=money(o.f.monthly);
 const age2=document.getElementById('v20age2');if(age2)age2.textContent=String(p.age);
 const st=document.getElementById('v20store');if(st)st.textContent=o.store;
 const parts=document.getElementById('v20parts');if(parts){const pr=prof();
  parts.innerHTML=`<div class="row"><span>Składki już „zebrane” (przykład)</span><b>${money(o.f.past)}</b></div>
   <div class="row"><span>Składki do wieku ${p.age} (${o.f.left} ${lata(o.f.left)})</span><b>${money(o.f.future)}</b></div>
   <div class="row"><span>PPK + IKE + IKZE</span><b>${p.consent?money(o.extra):'nie doliczono'}</b></div>
   <div class="row"><span>Przykładowe miesiące wypłaty</span><b>${o.f.months}</b></div>
   <p class="muted">Wzór DEMO: (składki + opcjonalne salda) ÷ miesiące. Składka 19,52% od ${money(pr.gross)} brutto, bez waloryzacji, bez podatku, bez emerytury minimalnej i bez subkonta. ${pr.years} lat składek już w przykładzie, wiek osoby: ${pr.age}. To nie jest tabela GUS ani prognoza ZUS.</p>`}
 const add=document.getElementById('v20add');if(add)add.textContent=o.extra>0?('Z wpisanych sald: około '+money(o.f.extraMonthly)+' miesięcznie w tym samym uproszczeniu, bez zysku i bez podatku.'):'';
}
function readPen(){const prev=pen();const ageEl=document.getElementById('v20age');const age=ageEl?Math.min(75,Math.max(60,+ageEl.value||prev.age||baseAge())):(prev.age||baseAge());
 const box=document.getElementById('v20ok');const consent=box?box.checked:prev.consent;const raw=id=>{const el=document.getElementById(id);return el?String(el.value||'').replace(/[^\d\s.,]/g,'').slice(0,16):(prev[id]||'')};
 const p={age,consent,ppk:consent?raw('v20ppk'):'',ike:consent?raw('v20ike'):'',ikze:consent?raw('v20ikze'):''};savePen(p);return p}
function field(id,label,val,on){return `<label for="${id}">${label}</label><input id="${id}" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="0" value="${esc(val)}" ${on?'':'disabled'} oninput="v20Pen()">`}
function pension(){const p0=pen();const age=p0.age||baseAge();const p=Object.assign({},p0,{age});const o=outHTML(age,p);const pr=prof();const who=PERS[S.persona]||{};const senior=!!S.senior;
 shell('Przyszła emerytura',`
 <div class="alert y">🧪<div><b>Przykład (DEMO), nie prognoza ZUS.</b> Liczone tylko w tej przeglądarce. Oficjalną kwotę ustala ZUS.</div></div>
 <div class="card total v20sum"><span class="demo">DEMO</span><p class="muted" style="color:#dfe7ff;margin:6px 0 0">Moja przyszła emerytura – liczone na Twoim telefonie</p><div class="v20zl" id="v20zl">${money(o.f.monthly)}</div><p id="v20delta">${esc(o.delta)}</p><p class="muted" style="color:#dfe7ff">miesięcznie, brutto w tym wzorze · ${esc(who.full||'')}, ${pr.age} lat</p></div>
 <div class="card">
  <h3>Wiek przejścia na emeryturę</h3>
  <div class="v20age"><button type="button" class="v20pm" onclick="v20Age(-1)" aria-label="Rok wcześniej">−</button><div class="v20ageN"><b id="v20ageLab">${age}</b><small>lat</small></div><button type="button" class="v20pm" onclick="v20Age(1)" aria-label="Rok później">+</button></div>
  <input id="v20age" class="v20range" type="range" min="60" max="75" step="1" value="${age}" aria-label="Wiek przejścia na emeryturę" oninput="v20Pen()">
  <div class="v20scale"><span>60</span><span>65</span><span>70</span><span>75</span></div>
  ${senior?'':`<div class="row"><span>Przy ${baseAge()} latach (odniesienie)</span><b id="v20base">${money(o.b.monthly)}</b></div><div class="row"><span>Przy <span id="v20age2">${age}</span> latach</span><b id="v20now">${money(o.f.monthly)}</b></div>`}
  <p class="muted">Punkt odniesienia w przykładzie: 60 lat dla kobiety i 65 dla mężczyzny. To nie jest opis Twojego prawa do emerytury. ${senior?`<span id="v20base" hidden>${money(o.b.monthly)}</span><span id="v20age2" hidden>${age}</span><span id="v20now" hidden></span>`:''}</p>
  <button type="button" class="btn ghost" onclick="v20SpeakPen()">🔊 Przeczytaj kwotę</button>
 </div>
 <div class="card v20priv">
  <h3>PPK, IKE i IKZE – tylko jeśli chcesz</h3>
  <p>Możesz doliczyć salda, które znasz. Aplikacja ich nie ma i o nie nie prosi urzędu. Bez zgody pola są wyłączone i puste w pamięci telefonu.</p>
  <label class="v19sw"><input type="checkbox" id="v20ok" ${p.consent?'checked':''} onchange="v20Consent(this.checked)"><span></span><b>Zgadzam się, żeby te kwoty zostały zapisane tylko na tym telefonie</b></label>
  ${field('v20ppk','Saldo PPK (zł)',p.ppk,p.consent)}
  ${field('v20ike','Saldo IKE (zł)',p.ike,p.consent)}
  ${field('v20ikze','Saldo IKZE (zł)',p.ikze,p.consent)}
  <p id="v20add" class="muted">${o.extra?('Z wpisanych sald: około '+money(forecast(age,o.extra).extraMonthly)+' miesięcznie w tym samym uproszczeniu, bez zysku i bez podatku.'):''}</p>
  <h3>Co przechowujemy</h3>
  <p id="v20store">${esc(o.store)}</p>
  <button type="button" class="btn ghost" onclick="v20Wipe()">Usuń moje dane</button>
 </div>
 <details class="v20more" ${senior?'':'open'}><summary>${senior?'Skąd ta liczba (DEMO)':'Założenia wzoru (DEMO)'}</summary>
  <div id="v20parts"></div>
  <p class="muted">${esc(pr.note)}. Wynagrodzenie ${money(pr.gross)} brutto jest zmyślone na potrzeby persony ${esc(who.full||'')}. Starszy kalkulator bez suwaka i bez PPK zostaje na <a href="#/emerytura">prognozie emerytury</a>.</p>
 </details>`,{tab:'more'});
 paintPen()}
window.v20Pen=function(){savePen(collectPen());paintPen()};
window.v20Age=function(d){const el=document.getElementById('v20age');if(!el)return;el.value=String(Math.min(75,Math.max(60,(+el.value||60)+d)));v20Pen()};
window.v20Consent=function(on){const prev=pen();const age=chosenAge();if(!on){savePen({age,consent:false,ppk:'',ike:'',ikze:''});toast('Zgoda wyłączona. Kwoty PPK, IKE i IKZE usunięte z tego telefonu.');}else savePen({age,consent:true,ppk:prev.ppk,ike:prev.ike,ikze:prev.ikze});pension()};
window.v20Wipe=function(){try{localStorage.removeItem(PEN_KEY)}catch(e){}pension();toast('Usunięto z tego telefonu wiek z suwaka oraz kwoty PPK, IKE i IKZE.')};
window.v20SpeakPen=function(){if(!('speechSynthesis'in window))return toast('Ta przeglądarka nie czyta na głos.');const age=chosenAge();const f=forecast(age,voluntaryCapital());
 speak('Przykład, nie prognoza ZUS. Przy wieku '+age+' lat wychodzi około '+Math.round(f.monthly)+' złotych miesięcznie.')};

const _ask20=ask;
ask=async function(q){const hit=v20Rule(q);if(!hit)return _ask20.apply(this,arguments);
 q=(q||'').trim();if(!q)return;if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});
 window.v14Last={k:'rules',fb:false};
 chat.push({r:'a',t:hit[2]+'<br><b>Czy chcesz kontynuować?</b>',act:hit[1]});drawChat();
 try{speak(String(hit[2]).replace(/<[^>]+>/g,''))}catch(e){}
};
window.ask=ask;
if(window.v18Route){const _v18=window.v18Route;window.v18Route=function(q){const hit=v20Rule(q);if(hit)return {kind:'act',hit:hit,act:hit[1]};return _v18(q)}}
try{INT.unshift(
 [/co robi[cć] podczas alarmu|podczas alarmu|tryb alarmowy|jestem bezpieczn/i,'#/alarm','Pokażę duże kroki na czas alarmu, schron oznaczony DEMO i przycisk dla rodziny. To reguła w telefonie, bez AI.'],
 [/ile b[eę]d[eę] mie[cć] emerytur|moja przysz[lł]a emerytura|emerytura na telefonie/i,'#/emerytura-telefon','Policzę przykładową emeryturę suwakiem wieku, tylko w przeglądarce. PPK, IKE i IKZE są dobrowolne. To reguła w telefonie, bez AI.']
);ALL.push(
 ['🚨','Tryb alarmowy','#/alarm','alarm powietrzny schron jestem bezpieczny bezpieczna rodzina offline co robić syrena'],
 ['📱','Moja przyszła emerytura na telefonie','#/emerytura-telefon','emerytura zus ppk ikze ike suwak wiek prognoza prywatność telefon']
)}catch(e){}

const HOME_BTN=`<a id="v20go" class="v20go" href="#/alarm"><b>🚨 Tryb alarmowy</b><small>Co robić krok po kroku · schron DEMO · jestem bezpieczny/bezpieczna</small></a>`;
function top(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/)[0]}
function inject(){const sc=app.querySelector('.scroll');if(!sc)return;const p=top();
 if(p==='home'&&!sc.querySelector('#v20go'))sc.insertAdjacentHTML('afterbegin',HOME_BTN);
 if(p==='family'&&!sc.querySelector('#v20fam'))sc.insertAdjacentHTML('afterbegin',`<div id="v20fam" class="card"><h3>🚨 Bezpieczeństwo rodziny</h3><p class="muted">Jedno stuknięcie zapisuje na tym telefonie, kto jest bezpieczny. Widać to po przełączeniu osoby.</p>${boardHTML()}<a class="btn" href="#/alarm">Otwórz tryb alarmowy</a></div>`);
 if(p==='security'&&!sc.querySelector('#v20sec'))sc.insertAdjacentHTML('afterbegin',HOME_BTN.replace('id="v20go"','id="v20sec"'));
 if(p==='plan'&&!sc.querySelector('#v20plan'))sc.insertAdjacentHTML('afterbegin',`<a id="v20plan" class="v20go" href="#/alarm"><b>🚨 Tryb alarmowy</b><small>Duże kroki, gdy trzeba zejść niżej. Działa bez pobierania treści z sieci.</small></a>`);
 if(p==='emerytura'&&!sc.querySelector('#v20plink'))sc.insertAdjacentHTML('afterbegin',`<div id="v20plink" class="card"><span class="demo">DEMO</span><h3>Moja przyszła emerytura – liczone na Twoim telefonie</h3><p>Suwak wieku pokazuje, jak zmienia się przykładowa kwota. PPK, IKE i IKZE wpisujesz tylko jeśli chcesz – zostają w przeglądarce.</p><a class="btn sec" href="#/emerytura-telefon">Otwórz prognozę na telefonie</a><p class="muted">Poniższy kalkulator zostaje. To wcześniejsza, prostsza wersja.</p></div>`);
 if(p==='settings'&&!sc.querySelector('#v20set'))sc.insertAdjacentHTML('afterbegin',`<div id="v20set" class="card"><h3>🚨 Tryb alarmowy</h3><p class="muted">W trybie seniora przycisk jest duży i jest pierwszy na ekranie głównym. Działa też bez włączonego trybu seniora.</p><a class="btn" href="#/alarm">Otwórz tryb alarmowy</a></div>`);
 if(p==='assistant'&&!document.getElementById('v20chips')){const chips=[...sc.querySelectorAll('.chips')].filter(c=>!c.closest('.chat')&&!c.closest('.msg'));const box=chips[chips.length-1];
  if(box)box.insertAdjacentHTML('beforeend','<button type="button" class="chip" id="v20chips" onclick="ask(\'co robić podczas alarmu\')">Co robić podczas alarmu</button><button type="button" class="chip" onclick="ask(\'ile będę mieć emerytury\')">Ile będę mieć emerytury</button>')}
 const more=document.getElementById('v19more');
 if(more&&!more.querySelector('[data-v20tile]')){const add=(re,html)=>{const g=[...more.querySelectorAll('.v19g')].find(d=>re.test((d.querySelector('summary')||{}).textContent||''));if(!g)return;const grid=g.querySelector('.grid');if(!grid)return;grid.insertAdjacentHTML('afterbegin',html);const n=g.querySelector('summary .muted');if(n)n.textContent=String(grid.querySelectorAll('.tile').length)};
  add(/Kryzys/,'<button type="button" class="tile" data-v20tile="1" onclick="location.hash=\'#/alarm\'"><b>🚨</b>Tryb alarmowy</button>');
  add(/Pieniądze/,'<button type="button" class="tile" data-v20tile="1" onclick="location.hash=\'#/emerytura-telefon\'"><b>📱</b>Emerytura w telefonie</button>')}}
const _r=route;
route=function(){const p=top();
 if(p==='alarm'||p==='emerytura-telefon'){clearInterval(threatT);clearInterval(camT);p==='alarm'?alarm():pension();try{inject()}catch(e){}return}
 const out=_r.apply(this,arguments);try{inject()}catch(e){}return out};
window.route=route;onhashchange=route;
const prevReset=window.resetDemo||resetDemo;
window.resetDemo=resetDemo=function(){try{localStorage.removeItem(GUIDE_KEY);localStorage.removeItem(STATE_KEY);localStorage.removeItem(PEN_KEY);if(window.caches&&caches.delete)caches.delete(CACHE_NAME).catch(()=>{})}catch(e){}return prevReset()};
new MutationObserver(()=>{try{inject()}catch(e){}}).observe(app,{childList:true,subtree:true});
cacheGuide();inject();
const st=document.createElement('style');st.textContent=`
.v20go{display:flex;flex-direction:column;align-items:flex-start;gap:2px;background:linear-gradient(135deg,#dc143c,#8b0a26);color:#fff;text-decoration:none;border-radius:18px;padding:14px 16px;margin:0 0 12px;box-shadow:0 8px 22px #dc143c44;font-weight:800}
.v20go b{font-size:1.28em;line-height:1.2}.v20go small{font-weight:600;opacity:.95;line-height:1.35}
body.senior .v20go{padding:22px 18px;border-radius:22px}body.senior .v20go b{font-size:1.85em}body.senior .v20go small{font-size:1.02em;font-weight:700}
.v20lead{font-size:1.05em;margin:0 0 10px}body.senior .v20lead{font-size:1.2em}
.v20steps{list-style:none;margin:0 0 8px;padding:0}
.v20steps li{display:flex;gap:12px;align-items:flex-start;background:#fff;border-radius:16px;padding:12px 14px;margin:0 0 10px;box-shadow:0 1px 3px #0001}
.v20steps li span{flex:none;width:44px;height:44px;border-radius:50%;background:#dc143c;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.25em}
.v20steps li p{margin:4px 0 0;font-size:1.05em;line-height:1.35}
body.senior .v20steps li{padding:16px}body.senior .v20steps li span{width:58px;height:58px;font-size:1.55em}body.senior .v20steps li p{font-size:1.28em}
.v20shelter{border:2px dashed #c77700;background:#fffaf0}
.v20stamp{display:inline-block;background:#dc143c;color:#fff;font-weight:800;letter-spacing:.04em;border-radius:8px;padding:3px 8px;font-size:.78em;margin-bottom:6px}
.v20who{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #eef0f4}.v20who:last-of-type{border-bottom:0}
.v20who .av{width:40px;height:40px;font-size:1em}.v20who.me{background:#f6f8fb;border-radius:12px;padding:8px}
.v20okdot{color:#14804a;font-weight:700}.v20wait{color:#5b6476}
body.senior .v20who{padding:12px 0;font-size:1.08em}body.senior .v20who .av{width:52px;height:52px;font-size:1.3em}
.btn.v20safe{background:#14804a;font-size:1.2em;padding:16px;min-height:64px}body.senior .btn.v20safe{font-size:1.45em;min-height:84px;padding:20px}
.v20call{display:block;text-align:center;background:#fff;color:#b3261e;border:2px solid #b3261e;font-weight:800;border-radius:14px;padding:14px;text-decoration:none;margin-top:8px;font-size:1.15em}
body.senior .v20call{font-size:1.4em;padding:18px}
.v20zl{font-size:2.35em;font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums;line-height:1.1;margin:4px 0}
body.senior .v20zl{font-size:2.9em}
.v20age{display:flex;align-items:center;justify-content:center;gap:16px;margin:4px 0 8px}
.v20ageN{text-align:center;min-width:92px}.v20ageN b{display:block;font-size:2.5em;line-height:1;font-variant-numeric:tabular-nums}.v20ageN small{color:var(--mut)}
body.senior .v20ageN b{font-size:3.3em}
.v20pm{width:56px;height:56px;border-radius:50%;border:0;background:var(--blue,#0b3d91);color:#fff;font-size:2em;line-height:1;cursor:pointer}
body.senior .v20pm{width:76px;height:76px;font-size:2.5em}
input.v20range{padding:0;height:36px;accent-color:#0b3d91}body.senior input.v20range{height:48px}
.v20scale{display:flex;justify-content:space-between;color:var(--mut);font-size:.85em;margin-top:2px}
.v20priv input{font-size:1.05em}body.senior .v20priv input{font-size:1.25em;padding:16px}body.senior .v20priv .v19sw{font-size:1.12em;align-items:flex-start}body.senior .v20priv .v19sw b{line-height:1.3}
.v20more{background:#fff;border-radius:16px;padding:8px 14px;margin:0 0 12px;box-shadow:0 1px 3px #0001}
.v20more summary{cursor:pointer;font-weight:700;padding:8px 0}
.v20go:focus-visible,.v20call:focus-visible,.v20pm:focus-visible,.btn.v20safe:focus-visible{outline:3px solid #14213d;outline-offset:3px}
body.contrast .v20go,body.contrast .btn.v20safe{background:#ffeb3b;color:#000;box-shadow:none}
body.contrast .v20steps li,body.contrast .v20shelter,body.contrast .v20more{background:#000;color:#fff;border:2px solid #fff}
body.contrast .v20steps li span{background:#ffeb3b;color:#000}
body.contrast .v20call{background:#000;color:#ffeb3b;border-color:#ffeb3b}
body.contrast .v20okdot{color:#b6ff9a}
`;document.head.appendChild(st);
route();
})();
