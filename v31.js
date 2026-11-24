// ===== v31: Tryb pokazu dla jury, nowy ekran startowy, pasek „Co chcesz załatwić?”, druga strona (firma) =====
// Koncepcja własna (Tomasz Krawczyk). Punkt odniesienia: prototyp organizatorów mObywatel Challenge
// (https://mobywatel.ai/prototyp, wpis https://x.com/jciesz/status/2125179038889398778). Nie kopiujemy kodu ani grafik,
// rozwijamy pomysły prezentacji: telefon + panel obok, osoba w pokazie, „Co sprawdzić”, stos dokumentów, sprawy pod dokumentami.
// Lepiej u nas: asystent działa też w wersji przeglądarkowej (Gemma → reguły → Bielik w przeglądarce), tryb seniora jednym
// dotknięciem, konta rodziny, maskowanie danych, przekazanie samych potwierdzeń bez serwera (dane jadą w kodzie, firma sprawdza je u siebie).
// Wszystko DEMO. Nic nie jest wysyłane. Niczego nie usuwamy: dawny ekran startowy jest w sekcji „Powiadomienia i wszystkie skróty”.
// Wyłączenie trybu pokazu: ?pokaz=0. Wymuszenie: ?pokaz=1. Strona firmy bez ramki telefonu: ?strona=1.
(function(){
const DEMO='<span class="demo">DEMO</span>';
const Q=new URLSearchParams(location.search);
const REPO='https://github.com/tomaszkrawczyk-cmd/mobywatel-koncepcja';
const BASE=location.origin+location.pathname;
function top(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/)[0]}
function sub(){return decodeURIComponent((location.hash.split('/')[2]||'').split('?')[0])}
function e(s){try{return esc(String(s))}catch(_){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}}
function per(){return (typeof S!=='undefined'&&S.persona)||'anna'}
function PP(k){try{return (typeof PERS!=='undefined'&&PERS[k||per()])||{}}catch(_){return {}}}
function allP(){try{return typeof PERS!=='undefined'?PERS:{}}catch(_){return {}}}
function ld(k,d){try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(_){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}
function rid(n){const a='ABCDEFGHJKLMNPRSTUWXYZ23456789';const b=new Uint8Array(n);try{crypto.getRandomValues(b)}catch(_){for(let i=0;i<n;i++)b[i]=Math.random()*255}return [...b].map(x=>a[x%a.length]).join('')}
function fmt(t){const d=new Date(t);const p=n=>String(n).padStart(2,'0');return p(d.getDate())+'.'+p(d.getMonth()+1)+'.'+d.getFullYear()+', '+p(d.getHours())+':'+p(d.getMinutes())}
function qr(txt,cell){try{const q=qrcode(0,'L');q.addData(txt);q.make();const n=q.getModuleCount();const c=cell||(n>57?3:n>41?4:5);return q.createSvgTag({cellSize:S&&S.senior?c+1:c,margin:2})}catch(_){return '<div class="v31noqr">QR</div>'}}
const INI=k=>{const p=PP(k);return ((p.name||'?')[0]||'?').toUpperCase()};
const AV={anna:'#e05a7a,#f3a35b',piotr:'#2f6fd6,#45b4c9',halina:'#8a5cd6,#d673b8',kuba:'#1f9d6b,#8fcf4a'};
function av(k,cls){return `<span class="v31av ${cls||''}" style="background:linear-gradient(135deg,${AV[k]||'#667,#99a'})" aria-hidden="true">${INI(k)}</span>`}
const PJ={anna:'B',piotr:'B, C',halina:'B',kuba:'B'};
const SINCE={anna:'od 2008',piotr:'od 2001',halina:'od 1990',kuba:'od 2025'};

// ---------- Dokumenty w stosie (per osoba) ----------
function docsFor(k){
 const p=PP(k),out=[];const veh=p.veh||[];
 if(veh.length)out.push({c:'veh',t:'Moje pojazdy',s:veh.length>1?`${veh.length} pojazdy · ${veh[0][0]}`:`${veh[0][1]} · ${veh[0][0]}`,h:'#/doc/auto',i:'🚗'});
 out.push({c:'pj',t:'mPrawo jazdy',s:'Kat. '+(PJ[k]||'B')+' · '+(SINCE[k]||''),h:'#/doc/pj',i:'PL'});
 if(k==='anna')out.push({c:'kdr',t:'Karta Dużej Rodziny',s:'Rodzina 3+ · 5 osób (DEMO)',h:'#/flow/kdr',i:'👨‍👩‍👧‍👦'});
 if(k==='kuba')out.push({c:'leg',t:'Legitymacja studencka',s:'Uniwersytet Gdański (DEMO)',h:'#/doc/leg',i:'🎓'});
 if(k==='halina')out.push({c:'leg',t:'Upoważnienie: mama',s:'Recepty i sprawy w przychodni',h:'#/upowaz',i:'🤝'});
 out.push({c:'id',t:'mDowód',s:p.full||'Anna Kowalska',h:'#/doc/dowod',i:'🇵🇱'});
 return out;
}
function stack(){
 const k=per(),p=PP(k),d=docsFor(k);
 return `<div class="v31stack" role="list" aria-label="Dokumenty w telefonie">${d.map((x,i)=>{const last=i===d.length-1;
  return `<a role="listitem" class="v31card v31-${x.c} ${last?'last':''}" href="${x.h}" style="z-index:${i+1}"><span class="v31ct">${e(x.t)}</span><span class="v31ci">${x.i}</span>${last?`<span class="v31photo">${av(k,'big')}</span><span class="v31name">${e((p.name||'').toUpperCase())}<small>${e(p.city||'')}, ${p.age||''} lat · ${DEMO}</small></span><span class="v31show">👁 Pokaż dane</span>`:`<span class="v31cs">${e(x.s)}</span>`}</a>`}).join('')}</div>`;
}
// ---------- Sprawy pod dokumentami ----------
function matters(){const p=PP();const t=(p.todo||[]).slice();t.sort((a,b)=>(b[3]||0)-(a[3]||0));return t}
function strip(){
 const t=matters();if(!t.length)return '';
 const f=t[0],n=t.length,rest=n-1;
 const word=rest===1?'inna sprawa':(rest>=2&&rest<=4?'inne sprawy':'innych spraw');
 return `<a class="v31strip" href="#/do-zalatwienia" aria-label="Do załatwienia: ${n}"><span class="v31cnt">${n}</span><span class="v31st"><b>${f[0]} ${e(f[1])}</b><small>${f[3]?'<i>Pilne</i> · ':''}${rest?`i ${rest} ${word}`:'Dotknij, żeby zacząć'}</small></span><span class="v31chev">›</span></a>`;
}
function todoPage(){
 const t=matters();let r=[];try{r=(typeof REM!=='undefined'?REM:[]).slice().sort((a,b)=>a.d.localeCompare(b.d)).slice(0,6)}catch(_){}
 shell('📌 Do załatwienia',`
 <div class="alert b">🧭<div><b>Sprawy osoby: ${e(PP().full||'')}.</b> Dotknij sprawy, a asystent przeprowadzi Cię przez nią do końca. ${DEMO}</div></div>
 ${t.map(x=>`<a class="v31row ${x[3]?'hot':''}" href="${x[2]}"><b>${x[0]} ${e(x[1])}</b><small>${x[3]?'Pilne · ':''}Otwórz sprawę</small><span>›</span></a>`).join('')}
 ${r.length?`<h3 class="v31h3">⏰ Najbliższe terminy</h3>${r.map(x=>`<a class="v31row" href="${x.a||'#/reminders'}"><b>${x.i||'⏰'} ${e(x.t)}</b><small>Do: ${x.d.split('-').reverse().join('.')} · DEMO</small><span>›</span></a>`).join('')}`:''}
 <a class="btn sec" href="#/moj-profil">🧭 Co mnie dotyczy (profil na telefonie)</a>
 <a class="btn ghost" href="#/reminders">Wszystkie terminy</a>`,{tab:'home'});
}
// ---------- Nowy ekran startowy ----------
const SHORT=[['🚨','Alarm','#/alarm'],['🧭','Co mnie dotyczy','#/moj-profil'],['🎯','Pokaż tylko to, co trzeba','#/udostepnij'],['🛡️','Gdzie się ukryć','#/schronienie']];
function topIcons(){
 const tb=app.querySelector('.top');if(!tb||tb.querySelector('.v31ic'))return;
 const h=tb.querySelector('h2');if(h)h.innerHTML=`<button type="button" class="v31who" onclick="v31Who()" aria-label="Zmień osobę w pokazie">${av(per())}<span>${e(PP().name||'Anna')}<small>Dokumenty ▾</small></span></button>`;
 const box=document.createElement('span');box.className='v31ic';
 box.innerHTML=`<a href="#/udostepnij" title="Przekaż dane (tylko to, co trzeba)" aria-label="Przekaż dane">🎯</a><a href="#/inbox" title="Skrzynka" aria-label="Skrzynka, nowe pismo" class="dot">📬</a><button type="button" title="Tryb seniora" aria-label="Tryb seniora ${S.senior?'włączony':'wyłączony'}" aria-pressed="${S.senior?'true':'false'}" onclick="v31Senior()" class="${S.senior?'on':''}">Aa</button>`;
 const dm=tb.querySelector('.demo');tb.insertBefore(box,dm||null);
}
function tidy(){
 if(top()!=='home')return;const sc=app.querySelector('.scroll');if(!sc)return;
 let hero=sc.querySelector('#v31hero');
 if(!hero){
  sc.insertAdjacentHTML('afterbegin',`<div id="v31hero">${stack()}${strip()}<div class="v31short">${SHORT.map(s=>`<a href="${s[2]}"><b>${s[0]}</b>${e(s[1])}</a>`).join('')}</div></div><details id="v31more" ${ld('v31-more',false)?'open':''}><summary>🔔 Powiadomienia i skróty <span class="v31n"></span></summary><div class="v31mb"></div></details>`);
  hero=sc.querySelector('#v31hero');
  const d=sc.querySelector('#v31more');d.addEventListener('toggle',()=>sv('v31-more',d.open));
 }
 const mb=sc.querySelector('#v31more .v31mb');
 [...sc.children].forEach(c=>{if(c.id!=='v31hero'&&c.id!=='v31more')mb.appendChild(c)});
 const n=mb.querySelectorAll('.alert').length;const nn=sc.querySelector('#v31more .v31n');if(nn)nn.textContent=n?`· ${n}`:'';
 topIcons();
}
window.v31Who=function(){
 const m=modal(`<h3>Osoba w pokazie</h3><p class="muted">Każda ma własne dokumenty, sprawy i terminy. Wszystkie są fikcyjne ${DEMO}.</p>
 ${Object.entries(allP()).map(([k,p])=>`<button type="button" class="v31pp ${k===per()?'on':''}" onclick="closeModal();v31Set('${k}')">${av(k)}<span><b>${e(p.full)}</b><small>${e(p.city)}, ${p.age} lat · ${e(p.bio||'')}</small></span></button>`).join('')}
 <a class="btn sec" href="#/family" onclick="closeModal()">👨‍👩‍👧 Konta rodziny</a><button class="btn ghost" onclick="closeModal()">Zamknij</button>`);
};
window.v31Set=function(k){try{if(k!==per())setPersona(k);else route()}catch(_){S.persona=k;save();route()}syncPanel()};
window.v31Senior=function(){S.senior=!S.senior;save();document.body.classList.toggle('senior',S.senior);route();syncPanel();try{toast(S.senior?'Tryb seniora włączony: duże litery i proste słowa':'Tryb seniora wyłączony')}catch(_){}};
window.v31Contrast=function(){S.contrast=!S.contrast;save();document.body.classList.toggle('contrast',S.contrast);route();syncPanel()};

// ---------- Pasek „Co chcesz załatwić?” ----------
const NOBAR=['assistant','wypozyczalnia','druga-strona','weryfikator','sprawdz'];
function bar(){
 const nav=app.querySelector('nav.nav');if(!nav||app.querySelector('.v31ask')||NOBAR.includes(top()))return;
 const f=document.createElement('form');f.className='v31ask';f.setAttribute('role','search');
 f.innerHTML=`<label class="v31sr" for="v31q">Co chcesz załatwić?</label><input id="v31q" autocomplete="off" placeholder="Co chcesz załatwić?" enterkeyhint="send"><button type="button" class="v31mic" aria-label="Powiedz głosem" onclick="v31Mic(this)">🎤</button><button type="submit" class="v31go" aria-label="Wyślij do asystenta">↑</button>`;
 f.onsubmit=ev=>{ev.preventDefault();v31Ask(f.querySelector('input').value)};
 nav.parentNode.insertBefore(f,nav);
}
window.v31Ask=function(q){q=(q||'').trim();if(!q){try{toast('Napisz, np. „zgubiłem portfel” albo „kończy mi się lek”.')}catch(_){}return}
 try{sessionStorage.setItem('v31q',q)}catch(_){}
 if(top()==='assistant'){route()}else location.hash='#/assistant';
};
window.v31Mic=function(b){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){try{toast('Ta przeglądarka nie rozpoznaje mowy. Wpisz, co chcesz załatwić.')}catch(_){}return}
 const r=new SR();r.lang='pl-PL';r.interimResults=false;b.classList.add('rec');
 r.onresult=ev=>{const t=ev.results[0][0].transcript;const i=document.getElementById('v31q');if(i)i.value=t;v31Ask(t)};
 r.onend=()=>b.classList.remove('rec');r.onerror=()=>{b.classList.remove('rec');try{toast('Nie usłyszałam. Spróbuj jeszcze raz albo wpisz.')}catch(_){}};try{r.start()}catch(_){b.classList.remove('rec')}};
function pending(){if(top()!=='assistant')return;let q=null;try{q=sessionStorage.getItem('v31q');sessionStorage.removeItem('v31q')}catch(_){}
 if(q)setTimeout(()=>{try{window.ask(q)}catch(_){}},60)}

// ---------- Druga strona: firma prosi o dane, klient pokazuje kod, firma sprawdza ----------
const REQ={osoba:['🙋','Jestem prawdziwą osobą',()=>'TAK'],a21:['🔞','Mam ukończone 21 lat',()=>(PP().age||0)>=21?'TAK':'NIE'],pj:['🚗','Prawo jazdy kat. B',()=>/B/.test(PJ[per()]||'')?'TAK, od '+((SINCE[per()]||'').replace('od ','')):'NIE'],imie:['🪪','Imię i nazwisko (do umowy)',()=>PP().full||'']};
const NEVER=['PESEL','Data urodzenia','Adres','Seria i numer dowodu','Zdjęcie','Punkty karne i mandaty'];
const SALT='|mobywatel-koncepcja-demo-v31';
function b64(s){return btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function unb64(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return new TextDecoder().decode(Uint8Array.from(atob(s),c=>c.charCodeAt(0)))}
async function sig(s){try{const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s+SALT));return [...new Uint8Array(h)].slice(0,6).map(x=>x.toString(16).padStart(2,'0')).join('')}catch(_){let h=0;for(const c of s+SALT)h=(h*31+c.charCodeAt(0))>>>0;return h.toString(16).padStart(12,'0')}}
async function packUrl(o){const p=b64(JSON.stringify(o));return BASE+'?strona=1#/sprawdz/'+p+'.'+(await sig(p))}
function rentalPage(){
 const id=rid(6);
 const url=BASE+'#/prosba/auto-'+id;
 shell('🚙 AutoNajem – formularz kierowcy',`
 <div class="alert y">🏢<div><b>To jest strona firmy, czyli „druga strona” ${DEMO}.</b> Otwórz ją na komputerze albo drugim telefonie. Wypożyczalnia jest fikcyjna.</div></div>
 <div class="card v31firm"><span class="v31tag">AutoNajem DEMO · wypożyczalnia aut</span><h3>Potrzebujemy potwierdzić kierowcę</h3>
 <ul class="v31need">${Object.values(REQ).map(r=>`<li>${r[0]} ${e(r[1])}</li>`).join('')}</ul>
 <p class="muted">Nie prosimy o PESEL, adres ani skan dowodu.</p></div>
 <div class="card v31firm v31c"><h3>1. Klient skanuje ten kod w mObywatelu</h3><div class="v31qr">${qr(url)}</div><p class="muted">Prośba nr ${id} · kod nie zawiera żadnych danych</p>
 <a class="btn sec" href="#/prosba/auto-${id}">Pokaz na jednym urządzeniu: otwórz prośbę jak klient</a></div>
 <div class="card v31firm"><h3>2. Firma skanuje kod klienta</h3><p>Klient pokazuje kod odpowiedzi. Pracownik skanuje go zwykłym aparatem telefonu albo przyciskiem poniżej, a ta strona sama sprawdza, czy kod jest ważny i nie został zmieniony.</p>
 <button type="button" class="btn" onclick="v31Scan()">📷 Zeskanuj kod klienta</button><div id="v31cam"></div>
 <p class="muted">Bez serwera: dane jadą tylko w kodzie, prosto z telefonu klienta do firmy. W prawdziwej usłudze kod podpisywałby wystawca dokumentu, a firma sprawdzałaby też, czy klient go nie cofnął. Tu podpis jest demonstracyjny.</p></div>`,{tab:'more',nav:false});
}
window.v31Scan=async function(){
 const box=document.getElementById('v31cam');if(!box)return;
 if(!('BarcodeDetector' in window)||!navigator.mediaDevices){box.innerHTML='<p class="muted">Ta przeglądarka nie skanuje kodów. Zeskanuj kod klienta aparatem telefonu: otworzy się ta strona z wynikiem.</p>';return}
 try{const st=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});box.innerHTML='<video id="v31vid" playsinline muted style="width:100%;border-radius:12px"></video><button type="button" class="btn ghost" id="v31stop">Zatrzymaj aparat</button>';
  const v=document.getElementById('v31vid');v.srcObject=st;await v.play();const det=new BarcodeDetector({formats:['qr_code']});let on=true;
  const stop=()=>{on=false;st.getTracks().forEach(t=>t.stop())};document.getElementById('v31stop').onclick=()=>{stop();box.innerHTML=''};
  const tick=async()=>{if(!on||!document.getElementById('v31vid')){stop();return}try{const r=await det.detect(v);const u=r[0]&&r[0].rawValue;if(u&&u.includes('#/sprawdz/')){stop();location.hash=u.slice(u.indexOf('#'));return}}catch(_){}setTimeout(tick,300)};tick();
 }catch(_){box.innerHTML='<p class="muted">Brak dostępu do aparatu. Zeskanuj kod klienta aparatem telefonu.</p>'}
};
let pick31={};
function requestPage(){
 const id=(sub().split('-')[1]||rid(6)).slice(0,8);const p=PP();
 if(pick31._id!==id+per())pick31={_id:id+per(),osoba:true,a21:true,pj:true,imie:true};
 shell('🚙 Prośba o dane',`
 <div class="alert b">🏢<div><b>AutoNajem DEMO prosi o potwierdzenie kierowcy.</b> Prośba nr ${e(id)}. Wybierasz, co firma zobaczy. Osoba w pokazie: <b>${e(p.full||'')}</b>.</div></div>
 <div class="card">${Object.entries(REQ).map(([k,r])=>{const v=r[2]();return `<label class="v31f"><input type="checkbox" ${pick31[k]?'checked':''} onchange="v31Pick('${k}',this.checked)"><span><b>${r[0]} ${e(r[1])}</b><small>Firma zobaczy: ${e(v)}</small></span></label>`}).join('')}</div>
 <div class="card"><h3>🔒 Czego firma nie zobaczy</h3><p class="muted">${NEVER.join(' · ')}</p></div>
 ${(PP().age||0)<21?`<div class="alert y">ℹ️<div>W pokazie masz mniej niż 21 lat, więc firma zobaczy odpowiedź „NIE”. Telefon nie podaje przy tym daty urodzenia.</div></div>`:''}
 <button type="button" class="btn" onclick="v31Confirm('${e(id)}')">Potwierdź i pokaż kod (DEMO)</button>
 <button type="button" class="btn ghost" onclick="history.back()">Odmów</button>`,{tab:'wallet'});
}
window.v31Pick=(k,v)=>{pick31[k]=v};
window.v31Confirm=function(id){
 const on=Object.keys(REQ).filter(k=>pick31[k]);if(!on.length){toast('Zaznacz przynajmniej jedno potwierdzenie albo odmów.');return}
 const m=modal(`<h3>Potwierdź przekazanie</h3><p class="muted">W prawdziwej aplikacji tu jest Face ID, odcisk palca albo PIN. W pokazie wpisz dowolne 4 cyfry.</p><input id="v31pin" inputmode="numeric" maxlength="6" placeholder="••••" aria-label="PIN"><button class="btn" id="v31ok">Potwierdź</button><button class="btn ghost" onclick="closeModal()">Anuluj</button>`);
 m.querySelector('#v31ok').onclick=async()=>{const v=(m.querySelector('#v31pin').value||'');if(!/^\d{4,6}$/.test(v)){toast('Wpisz 4 cyfry (DEMO).');return}closeModal();
  const o={f:'AutoNajem DEMO',r:id,a:on.map(k=>[REQ[k][1],REQ[k][2]()]),t:Date.now(),e:Date.now()+15*60e3};
  const url=await packUrl(o);const L=ld('v31-resp',[]);L.unshift({id,u:url,t:o.t,e:o.e,p:per()});sv('v31-resp',L.slice(0,20));location.hash='#/prosba-kod/'+id};
};
function respPage(){
 const id=sub();const x=ld('v31-resp',[]).find(y=>y.id===id);
 if(!x){shell('Nie ma takiego kodu','<p>Kod wygasł albo powstał na innym telefonie.</p><a class="btn" href="#/wypozyczalnia">Strona wypożyczalni</a>',{tab:'wallet'});return}
 const live=Date.now()<x.e;
 shell('🚙 Pokaż kod firmie',`
 <div class="alert ${live?'g':'y'}">${live?'✅':'⛔'}<div><b>${live?'Kod ważny 15 minut.':'Kod wygasł.'}</b> Firma skanuje go aparatem. Dane są tylko w kodzie, nie na serwerze ${DEMO}.</div></div>
 <div class="card v31c"><div class="v31qr ${live?'':'dead'}">${qr(x.u)}</div><p class="muted">Ważny do ${fmt(x.e)} (czas polski)</p></div>
 <a class="btn sec" href="${x.u.slice(x.u.indexOf('#'))}">Pokaz na jednym urządzeniu: zobacz ekran firmy</a>
 <a class="btn ghost" href="#/udostepnione">Moje udostępnienia</a>`,{tab:'wallet'});
}
async function checkPage(){
 const raw=(location.hash.split('#/sprawdz/')[1]||'').split('?')[0];const [p,s]=raw.split('.');
 let o=null,ok=false;try{o=JSON.parse(unb64(p||''));ok=!!s&&(await sig(p))===s}catch(_){o=null}
 if(top()!=='sprawdz')return;
 const live=o&&Date.now()<o.e;
 const head=!o?['r','⛔','Nie da się odczytać kodu.','Poproś klienta o nowy kod.']:!ok?['r','⛔','Kod zmieniony albo uszkodzony.','Podpis się nie zgadza. Nie przyjmuj tych danych.']:!live?['y','⌛','Kod wygasł.','Poproś klienta o nowy kod.']:['g','✅','Dane potwierdzone (DEMO).','Podpis demonstracyjny się zgadza, a kod jest ważny.'];
 shell('🏢 Wynik sprawdzenia',`
 <div class="alert ${head[0]} v31res">${head[1]}<div><b>${head[2]}</b><br><span class="muted">${head[3]}</span></div></div>
 ${o?`<div class="card v31firm"><span class="v31tag">${e(o.f||'Firma DEMO')}${o.r?' · prośba '+e(o.r):''}</span><h3>Firma widzi tylko to</h3><ul class="v31got">${(o.a||[]).map(a=>`<li><span>${e(a[0])}</span><b>${e(a[1])}</b></li>`).join('')}</ul><p class="muted">Wydano: ${fmt(o.t)} · ważny do: ${fmt(o.e)} (czas polski)</p></div>
 <div class="card"><h3>🔒 Firma nie dostała</h3><p class="muted">${NEVER.join(' · ')}</p></div>`:''}
 <p class="muted">To strona demonstracyjna prototypu konkursowego. Kod nie jest ważny w żadnej prawdziwej firmie ani urzędzie. W prawdziwej usłudze kod podpisywałby wystawca dokumentu, a firma sprawdzałaby też, czy klient go nie cofnął.</p>
 <a class="btn sec" href="#/wypozyczalnia">Nowa prośba wypożyczalni</a>`,{tab:'more',nav:false});
}
// kod z v30 („Pokaż tylko to, co trzeba”) też da się sprawdzić na drugim urządzeniu
async function upgradeV30(){
 if(top()!=='udostepnij-kod')return;const sc=app.querySelector('.scroll');if(!sc||sc.querySelector('#v31v30'))return;
 const x=ld('v30-share',[]).find(y=>y.id===sub());if(!x||x.revoked||Date.now()>x.exp)return;
 const who={rekruter:'Portal z ofertami pracy (DEMO)',bank:'Bank DEMO',wynajem:'Wynajmujący DEMO',sklep:'Sklep internetowy DEMO',przychodnia:'Przychodnia DEMO'}[x.k]||'Firma DEMO';
 const url=await packUrl({f:who,r:x.id.slice(0,4),a:x.attrs,t:x.at,e:x.exp});
 if(top()!=='udostepnij-kod'||sc.querySelector('#v31v30'))return;
 const q=sc.querySelector('.v30qr');if(q)q.innerHTML=qr(url);
 const c=sc.querySelector('.v30code');if(c)c.insertAdjacentHTML('beforeend',`<div id="v31v30"><p class="muted">Firma skanuje ten kod zwykłym aparatem i od razu widzi wynik. Dane są tylko w kodzie, bez serwera ${DEMO}.</p><a class="btn sec" href="${url.slice(url.indexOf('#'))}">Zobacz, co zobaczy firma</a></div>`);
}

// ---------- Tryb pokazu (komputer): telefon + panel ----------
const TIPS=[
 ['Napisz albo powiedz na dole ekranu, co chcesz załatwić, np. „zgubiłem portfel”. Odpowiada asystent: Gemma, a gdy nie działa, reguły w telefonie i polski model Bielik w przeglądarce.','#/assistant','Asystent'],
 ['Dotknij sprawy pod dokumentami. Asystent prowadzi ją do końca, z potwierdzeniem przed wysłaniem.','#/do-zalatwienia','Do załatwienia'],
 ['Włącz tryb seniora przyciskiem Aa w górnym pasku: duże litery, prosty język i czytanie na głos.','#/settings','Tryb seniora'],
 ['Zmień osobę. Każda ma inne dokumenty i sprawy, a rodzic widzi sprawy dzieci.','#/family','Konta rodziny'],
 ['Dostałeś pismo z urzędu? Asystent wyjaśni je prostymi słowami i przygotuje szkic odpowiedzi.','#/explain','Pismo po ludzku'],
 ['Przekaż firmie tylko to, co trzeba: „18+” albo „kat. B”, bez PESEL-u i adresu. Spróbuj ze stroną wypożyczalni na drugim urządzeniu.','#/udostepnij','Pokaż tylko to, co trzeba'],
 ['Zanim pytanie trafi do AI, telefon wykrywa PESEL, numer dowodu i IBAN i proponuje je zamaskować.','#/gdzie-trafia','Gdzie trafia pytanie'],
 ['Tryb alarmowy: co robić krok po kroku, najbliższe schrony z aplikacji „Gdzie się ukryć PL” i wiadomość do bliskich.','#/alarm','Bezpieczeństwo']
];
const BETTER=[
 'Asystent działa w tej wersji przeglądarkowej. Według strony konkursu wersja przeglądarkowa prototypu wzorcowego działa na przygotowanych scenariuszach.',
 'Polski model Bielik może działać w samej przeglądarce, bez płatnych API i bez wysyłania pytań na serwer.',
 'Tryb seniora jednym dotknięciem, wysoki kontrast i czytanie na głos.',
 'Konta rodziny, upoważnienia i lekcje „Wnuk uczy babcię”.',
 'Przed wysłaniem pytania do AI telefon ukrywa PESEL, numer dowodu i IBAN, jeśli chcesz.',
 'Przekazanie danych bez serwera: firma dostaje same potwierdzenia, a kod ma termin ważności i można go cofnąć.',
 'Ponad 180 ekranów: od pisma z urzędu i e-recepty po tryb alarmowy i schrony.'
];
function wantShow(){const v=Q.get('pokaz');if(v==='0'||Q.get('strona')==='1')return false;if(v==='1')return true;return window.innerWidth>=1100&&window.innerHeight>=600}
function panelHTML(inApp){
 const ps=Object.entries(allP());
 return `${inApp?'':`<a class="v31top" href="https://mobywatel.ai/" target="_blank" rel="noopener">← mObywatel Challenge</a>`}
 <span class="v31badge">● Pełny prototyp z działającym asystentem AI · bez płatnych API</span>
 <h1>mObywatel 3.0: asystent, który doprowadza sprawę do końca</h1>
 <p class="v31lead">Klikalny prototyp z prawdziwym asystentem. Powiedz albo napisz, co chcesz załatwić, a asystent przeprowadzi Cię przez sprawę i poprosi o zgodę, zanim cokolwiek wyśle.</p>
 <div class="v31h">Osoba w pokazie</div>
 <div class="v31ps">${ps.map(([k,p])=>`<button type="button" data-p="${k}" class="${k===per()?'on':''}" onclick="v31Set('${k}')">${av(k)}<span><b>${e(p.name)}</b><small>${e(p.city)}, ${p.age} ${p.age%10>=2&&p.age%10<=4&&(p.age%100<10||p.age%100>=20)?'lata':'lat'}</small></span></button>`).join('')}</div>
 <div class="v31tg"><button type="button" data-t="senior" class="${S.senior?'on':''}" onclick="v31Senior()">👴 Tryb seniora</button><button type="button" data-t="contrast" class="${S.contrast?'on':''}" onclick="v31Contrast()">🌗 Wysoki kontrast</button><button type="button" onclick="resetDemo()">↺ Od nowa</button></div>
 <div class="v31h">Co sprawdzić</div>
 <ol class="v31tips">${TIPS.map((t,i)=>`<li><span>${i+1}</span><div>${e(t[0])} <a href="${t[1]}">${e(t[2])} ›</a></div></li>`).join('')}</ol>
 ${inApp?'':`<div class="v31two"><div class="v31qrs">${qr(BASE+'#/home',3)}</div><div><b>Pokaz na dwóch urządzeniach</b><p>Zeskanuj kod telefonem, żeby otworzyć prototyp u siebie. Potem otwórz na komputerze <a href="${BASE}?strona=1#/wypozyczalnia" target="_blank" rel="noopener">stronę wypożyczalni</a> i przekaż jej dane z telefonu.</p></div></div>`}
 <details class="v31d"><summary>Czym różni się od prototypu wzorcowego</summary><ul>${BETTER.map(b=>`<li>${e(b)}</li>`).join('')}</ul></details>
 ${inApp?'<a class="btn sec" href="#/all">🔍 Wszystkie usługi</a>':'<details class="v31d" id="v31list"><summary>Wszystkie ekrany (pełna lista)</summary></details>'}
 <p class="v31fine">Osoby i dane są fikcyjne (DEMO). To koncepcja konkursowa, nie oficjalna aplikacja mObywatel ani usługa administracji publicznej. Autor: Tomasz Krawczyk · <a href="${REPO}" target="_blank" rel="noopener">kod źródłowy</a>. Wyłącz tryb pokazu: <a href="?pokaz=0">?pokaz=0</a>.</p>`;
}
let panel=null;
function syncPanel(){
 if(!panel)return;
 panel.querySelectorAll('.v31ps button').forEach(b=>b.classList.toggle('on',b.dataset.p===per()));
 panel.querySelectorAll('.v31tg [data-t]').forEach(b=>b.classList.toggle('on',!!S[b.dataset.t]));
}
function showcase(){
 const on=wantShow(),st=document.querySelector('.stage'),side=document.querySelector('.side');
 document.body.classList.toggle('v31show',on);
 if(!st)return;
 if(on&&!panel){
  panel=document.createElement('aside');panel.className='v31panel';panel.setAttribute('aria-label','O prototypie');panel.innerHTML=panelHTML(false);
  st.appendChild(panel);
  const L=panel.querySelector('#v31list');if(L&&side)L.appendChild(side);
 }else if(!on&&panel){
  if(side)st.insertBefore(side,st.firstChild);panel.remove();panel=null;
 }
}
function pageMode(){if(Q.get('strona')==='1')document.body.classList.add('v31page')}
function infoPage(){shell('ℹ️ O prototypie',`<div class="v31panel inapp">${panelHTML(true)}</div>`,{tab:'more'})}

// ---------- Router ----------
const R={'do-zalatwienia':todoPage,'sprawy':todoPage,'wypozyczalnia':rentalPage,'druga-strona':rentalPage,'weryfikator':rentalPage,'prosba':requestPage,'prosba-kod':respPage,'sprawdz':checkPage,'pokaz':infoPage,'o-prototypie':infoPage};
function after(){try{tidy()}catch(_){}try{bar()}catch(_){}try{pending()}catch(_){}try{upgradeV30()}catch(_){}try{syncPanel()}catch(_){}
 [80,400,1200].forEach(t=>setTimeout(()=>{try{tidy()}catch(_){}try{bar()}catch(_){}},t))}
const _r=route;
route=function(){const p=top();if(R[p]){try{clearInterval(threatT)}catch(_){}try{clearInterval(camT)}catch(_){}try{clearInterval(window.v30T)}catch(_){}const o=R[p]();after();return o}const out=_r.apply(this,arguments);after();return out};
window.route=route;onhashchange=route;

// ---------- Boczna lista (stary panel): nowa pozycja ----------
(function(){const j=document.querySelector('.side ul.jump');if(j&&!document.getElementById('v31side'))j.insertAdjacentHTML('afterbegin',`<li class="sep" id="v31side">Nowe w v31</li><li><a href="#/do-zalatwienia">📌 Do załatwienia</a></li><li><a href="#/wypozyczalnia">🚙 Druga strona: wypożyczalnia (DEMO)</a></li><li><a href="#/pokaz">ℹ️ O prototypie i co sprawdzić</a></li>`)})();

const st=document.createElement('style');st.textContent=`
.v31sr{position:absolute;left:-9999px}
.v31av{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;color:#fff;font-weight:800;flex-shrink:0;font-size:15px}
.v31av.big{width:74px;height:90px;border-radius:12px;font-size:34px;border:3px solid #fff;box-shadow:0 2px 8px #0003}
.v31who{display:flex;align-items:center;gap:8px;border:0;background:none;padding:0;cursor:pointer;font:inherit;color:inherit;text-align:left}
.v31who span{display:flex;flex-direction:column;font-weight:800;line-height:1.1}.v31who small{font-weight:600;color:var(--mut);font-size:.68em}
.v31ic{display:flex;gap:4px;align-items:center}.v31ic a,.v31ic button{position:relative;width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;font-size:18px;background:#f0f3f9;border:0;cursor:pointer;color:var(--txt);font-weight:800}
.v31ic button{font-size:14px}.v31ic button.on{background:var(--blue);color:#fff}.v31ic .dot:after{content:'';position:absolute;top:5px;right:5px;width:8px;height:8px;border-radius:50%;background:var(--red);border:2px solid #fff}
#v31hero{margin:-2px 0 10px}
.v31stack{display:flex;flex-direction:column;margin-bottom:12px}
.v31card{position:relative;display:block;height:150px;border-radius:18px;padding:14px 16px;color:#fff;text-decoration:none;margin-top:-92px;box-shadow:0 -2px 10px #0002,inset 0 1px 0 #fff4;overflow:hidden;transition:transform .15s}
.v31card:first-child{margin-top:0}.v31card:hover{transform:translateY(-3px)}.v31card:focus-visible{outline:3px solid #ffbf47;outline-offset:2px}
.v31card:before{content:'';position:absolute;inset:0;background:repeating-radial-gradient(circle at 85% 120%,#fff0 0 14px,#ffffff12 15px 16px);pointer-events:none}
.v31card.last{height:200px}
.v31ct{font-weight:700;font-size:.95em;position:relative}.v31cs{display:block;font-size:.75em;opacity:.9;margin-top:2px;position:relative}
.v31ci{position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:9px;background:#ffffff33;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800}
.v31-veh{background:linear-gradient(135deg,#e8913a,#f2b35a)}.v31-pj{background:linear-gradient(135deg,#b5395a,#d0574a)}.v31-kdr{background:linear-gradient(135deg,#5b3fb8,#8a4fc9)}.v31-leg{background:linear-gradient(135deg,#167a5c,#2fa37a)}.v31-id{background:linear-gradient(135deg,#1f66d1,#3c8be8 60%,#2a55b8)}
.v31photo{position:absolute;left:16px;bottom:16px}.v31name{position:absolute;left:104px;bottom:44px;font-weight:800;letter-spacing:.5px;display:flex;flex-direction:column}.v31name small{font-weight:600;font-size:.7em;opacity:.95;letter-spacing:0}
.v31show{position:absolute;left:104px;bottom:14px;background:#ffffff2e;border:1px solid #fff6;border-radius:14px;padding:3px 10px;font-size:.75em;font-weight:600}
.v31strip{display:flex;align-items:center;gap:12px;background:var(--card);border-radius:16px;padding:12px 14px;text-decoration:none;color:var(--txt);box-shadow:0 1px 4px #0002;margin-bottom:10px}
.v31cnt{min-width:30px;height:30px;border-radius:50%;background:var(--red);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center}
.v31st{flex:1;display:flex;flex-direction:column}.v31st b{font-size:.92em}.v31st small{color:var(--mut);font-size:.78em}.v31st i{color:var(--red);font-style:normal;font-weight:700}.v31chev{color:var(--mut);font-size:1.4em}
.v31short{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}.v31short a{background:var(--card);border-radius:14px;padding:9px 4px;text-align:center;font-size:.7em;color:var(--txt);text-decoration:none;box-shadow:0 1px 3px #0001;line-height:1.2}.v31short b{display:block;font-size:1.6em;font-weight:400;margin-bottom:2px}
#v31more{margin:4px 0 12px}#v31more>summary{cursor:pointer;background:var(--card);border-radius:14px;padding:12px 14px;font-weight:700;box-shadow:0 1px 3px #0001;list-style:none}#v31more>summary::-webkit-details-marker{display:none}#v31more>summary:after{content:' ▾';color:var(--mut)}#v31more[open]>summary:after{content:' ▴'}
.v31mb{padding-top:12px}.v31n{color:var(--red)}
.v31ask{display:flex;align-items:center;gap:6px;margin:0 10px 8px;background:var(--card);border-radius:28px;padding:5px 5px 5px 16px;box-shadow:0 2px 12px #0b3d9122;border:1px solid #e3e7ef;position:relative;z-index:3}
.v31ask input{flex:1;border:0;outline:0;background:none;font:inherit;font-size:.95em;color:var(--txt);min-width:0;padding:8px 0}
.v31mic,.v31go{border:0;border-radius:50%;width:38px;height:38px;cursor:pointer;font-size:17px;flex-shrink:0}.v31mic{background:none}.v31mic.rec{background:#ffe3e6;animation:v31p 1s infinite}.v31go{background:var(--red);color:#fff;font-weight:800;font-size:19px}
@keyframes v31p{50%{box-shadow:0 0 0 6px #dc143c33}}
.v31row{display:flex;flex-wrap:wrap;align-items:center;background:var(--card);border-radius:14px;padding:12px 14px;margin-bottom:8px;text-decoration:none;color:var(--txt);box-shadow:0 1px 3px #0001;position:relative;padding-right:30px}
.v31row b{width:100%}.v31row small{color:var(--mut)}.v31row span{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--mut);font-size:1.3em}.v31row.hot{border-left:5px solid var(--red)}.v31h3{margin:16px 0 8px}
.v31pp{display:flex;gap:10px;align-items:center;width:100%;text-align:left;border:1.5px solid #e3e7ef;background:#fff;border-radius:14px;padding:10px;margin-bottom:8px;cursor:pointer;font:inherit;color:inherit}.v31pp.on{border-color:var(--red);box-shadow:0 0 0 2px #dc143c22}.v31pp span{display:flex;flex-direction:column}.v31pp small{color:var(--mut)}
.v31firm .v31tag,.v31tag{display:inline-block;background:#eef2fb;color:var(--blue);border-radius:10px;padding:2px 8px;font-size:.75em;font-weight:700}
.v31need,.v31got{list-style:none;padding:0;margin:8px 0}.v31need li{padding:6px 0;border-bottom:1px solid #eef0f4}.v31got li{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid #eef0f4}.v31got b{color:var(--ok)}
.v31c{text-align:center}.v31qr{display:inline-block;background:#fff;padding:8px;border-radius:12px}.v31qr svg{display:block;max-width:100%;height:auto}.v31qr.dead{opacity:.25;filter:grayscale(1)}
.v31f{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #eef0f4;cursor:pointer}.v31f input{width:22px;height:22px;margin-top:2px;flex-shrink:0}.v31f span{display:flex;flex-direction:column}.v31f small{color:var(--mut)}
.v31res{font-size:1.05em}
/* Tryb pokazu na komputerze */
.v31panel{display:none}
body.v31show .stage{gap:56px;align-items:center;min-height:100vh;padding:24px 32px;box-sizing:border-box}
body.v31show .phone{height:min(840px,calc(100vh - 48px));width:auto;aspect-ratio:400/840}
body.v31show .foot{display:none}
body.v31show .v31panel{display:block;max-width:470px;max-height:calc(100vh - 48px);overflow:auto;padding-right:6px}
body.v31show .v31panel .side{display:block;position:static;max-width:none;margin-top:8px}body.v31show .v31panel .side h1{display:none}
.v31panel h1{font-size:2.05em;line-height:1.1;margin:10px 0 10px;color:var(--txt);letter-spacing:-.5px}
.v31top{color:var(--red);text-decoration:none;font-weight:700;font-size:.95em}
.v31badge{display:inline-block;margin-top:12px;background:#ffe3e6;color:#a3102d;border-radius:20px;padding:5px 12px;font-size:.8em;font-weight:700}
.v31lead{color:var(--mut);margin:0 0 14px;line-height:1.45}
.v31h{font-size:.75em;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:var(--mut);margin:16px 0 8px}
.v31ps{display:grid;grid-template-columns:1fr 1fr;gap:10px}.v31ps button{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid transparent;border-radius:14px;padding:10px;cursor:pointer;font:inherit;color:inherit;text-align:left;box-shadow:0 1px 4px #0001}.v31ps button.on{border-color:var(--red)}.v31ps span{display:flex;flex-direction:column}.v31ps small{color:var(--mut);font-size:.8em}.v31ps .v31av{width:42px;height:42px;font-size:18px}
.v31tg{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.v31tg button{border:1.5px solid #d6dbe6;background:#fff;border-radius:20px;padding:6px 12px;cursor:pointer;font:inherit;font-size:.85em}.v31tg button.on{background:var(--blue);border-color:var(--blue);color:#fff}
.v31tips{list-style:none;padding:0;margin:0}.v31tips li{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #e3e7ef;font-size:.92em;line-height:1.4}.v31tips li>span{min-width:24px;height:24px;border-radius:7px;background:#fff;color:var(--red);font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px #0002;font-size:.85em}.v31tips a{color:var(--blue);font-weight:700;white-space:nowrap}
.v31two{display:flex;gap:14px;align-items:center;background:#14213d;color:#fff;border-radius:18px;padding:14px;margin:16px 0 10px}.v31two p{margin:4px 0 0;font-size:.85em;opacity:.9;line-height:1.4}.v31two a{color:#ffd24d}.v31qrs{background:#fff;border-radius:10px;padding:4px;flex-shrink:0}.v31qrs svg{display:block;width:96px;height:96px}
.v31d{margin:8px 0;background:#fff;border-radius:12px;padding:8px 12px}.v31d summary{cursor:pointer;font-weight:700;font-size:.9em}.v31d ul{margin:8px 0 4px;padding-left:18px;font-size:.88em;line-height:1.45}
.v31fine{font-size:.75em;color:var(--mut);margin-top:12px;line-height:1.4}
.v31panel.inapp{display:block}.v31panel.inapp h1{font-size:1.5em}
/* Strona firmy bez ramki telefonu */
body.v31page .side,body.v31page .foot,body.v31page .notch{display:none}body.v31page .stage{padding:0}body.v31page .phone{width:min(760px,100vw);height:100vh;background:none;box-shadow:none;padding:0;border-radius:0}body.v31page .app{border-radius:0}body.v31page .top{padding-top:16px}
/* Senior */
body.senior .v31card{height:170px;margin-top:-104px}body.senior .v31card.last{height:220px}body.senior .v31ct{font-size:1.15em}
body.senior .v31strip{padding:16px}body.senior .v31st b{font-size:1.15em}body.senior .v31st small{font-size:1em}body.senior .v31cnt{min-width:40px;height:40px;font-size:1.2em}
body.senior .v31short{grid-template-columns:1fr 1fr}body.senior .v31short a{font-size:.95em;padding:14px 6px}
body.senior .v31ask input{font-size:1.15em}body.senior .v31mic,body.senior .v31go{width:48px;height:48px}
body.senior .v31ic a,body.senior .v31ic button{width:42px;height:42px}body.senior .v31row b{font-size:1.15em}body.senior .v31f input{width:30px;height:30px}
body.contrast .v31strip,body.contrast .v31short a,body.contrast .v31ask,body.contrast #v31more>summary,body.contrast .v31row,body.contrast .v31pp{background:#000;color:#fff;border:2px solid #fff}
body.contrast .v31ask input{color:#fff}body.contrast .v31ic a,body.contrast .v31ic button{background:#000;color:#ffeb3b;border:2px solid #fff}
@media (max-width:360px){.v31short{grid-template-columns:1fr 1fr}}
`;document.head.appendChild(st);
pageMode();showcase();
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(showcase,150)});
route();
})();
