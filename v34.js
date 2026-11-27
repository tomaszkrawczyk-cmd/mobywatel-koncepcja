// ===== v34: tryb seniora na samej górze (włączasz i w tym samym miejscu od razu widzisz „Wyłącz”) + przejrzystość ekranu startowego =====
// Prośba Tomasza (27.11.2026): „Tryb seniora na górze nie na dole. Jak się włącza to po włączeniu widać wyłączenie. Zadbaj o przejrzystość aplikacji.”
// Niczego nie usuwamy funkcjonalnie: powtórzone na jednym ekranie wejścia do TEJ SAMEJ funkcji są scalane w jedno (zostaje to wyżej / w lepszej grupie).
// Bez płatnych API. Łańcuch Gemma → reguły → Bielik bez zmian.
(function(){
function top(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/)[0]}
function L(){let l='pl';try{l=localStorage.getItem('v32-lang')||'pl'}catch(_){}return ({pl:0,en:1,uk:2,be:3,de:4})[l]!=null?l:'pl'}
const LI={pl:0,en:1,uk:2,be:3,de:4};
const TX={
 onT:['Włącz tryb seniora','Turn on senior mode','Увімкнути режим для літніх','Уключыць рэжым для пажылых','Seniorenmodus einschalten'],
 onS:['Większe litery i przyciski, prostsze słowa','Bigger text and buttons, simpler words','Більші літери й кнопки, простіші слова','Большыя літары і кнопкі, прасцейшыя словы','Größere Schrift und Tasten, einfachere Wörter'],
 isOn:['Tryb seniora włączony','Senior mode is on','Режим для літніх увімкнено','Рэжым для пажылых уключаны','Seniorenmodus ist an'],
 off:['Wyłącz tryb seniora','Turn off senior mode','Вимкнути режим для літніх','Выключыць рэжым для пажылых','Seniorenmodus ausschalten'],
 offShort:['Wyłącz','Turn off','Вимкнути','Выключыць','Ausschalten'],
 aaOn:['Tryb seniora włączony – dotknij, aby wyłączyć','Senior mode on – tap to turn off','Режим для літніх увімкнено – торкніться, щоб вимкнути','Рэжым для пажылых уключаны – дакраніцеся, каб выключыць','Seniorenmodus an – tippen zum Ausschalten'],
 aaOff:['Tryb seniora wyłączony – dotknij, aby włączyć','Senior mode off – tap to turn on','Режим для літніх вимкнено – торкніться, щоб увімкнути','Рэжым для пажылых выключаны – дакраніцеся, каб уключыць','Seniorenmodus aus – tippen zum Einschalten'],
 tOn:['Tryb seniora włączony. Wyłączysz go przyciskiem na górze ekranu.','Senior mode on. Turn it off with the button at the top of the screen.','Режим для літніх увімкнено. Вимкнути можна кнопкою вгорі екрана.','Рэжым для пажылых уключаны. Выключыць можна кнопкай уверсе экрана.','Seniorenmodus an. Ausschalten mit der Taste oben auf dem Bildschirm.'],
 tOff:['Tryb seniora wyłączony.','Senior mode off.','Режим для літніх вимкнено.','Рэжым для пажылых выключаны.','Seniorenmodus aus.'],
 set:['Tryb seniora: przełącznik jest na górze ekranu · więcej ustawień','Senior mode: the switch is at the top of the screen · more settings','Режим для літніх: перемикач угорі екрана · більше налаштувань','Рэжым для пажылых: пераключальнік уверсе экрана · больш налад','Seniorenmodus: Schalter oben auf dem Bildschirm · weitere Einstellungen'],
 short:['Na skróty','Shortcuts','Швидкий доступ','Хуткі доступ','Schnellzugriff'],
 ask:['Napisz na dole ekranu albo wybierz:','Type at the bottom of the screen or pick:','Напишіть унизу екрана або виберіть:','Напішыце ўнізе экрана або выберыце:','Unten eingeben oder auswählen:'],
 docs:['Moje dokumenty','My documents','Мої документи','Мае дакументы','Meine Dokumente']
};
function t(k){const a=TX[k];return a?(a[LI[L()]]||a[0]):k}
function senior(){try{return !!S.senior}catch(_){return false}}
const SKIP=['kontrola'];// pełnoekranowa kontrola dokumentu ma własny układ

// ---------- 1. Jeden duży przełącznik na samej górze ----------
window.v34Sen=function(){
 const was=senior();
 try{if(window.v31Senior)window.v31Senior();else{S.senior=!S.senior;save();document.body.classList.toggle('senior',S.senior);route()}}catch(_){}
 setTimeout(()=>{run();try{toast(was?t('tOff'):t('tOn'))}catch(_){}const b=document.querySelector('#v34sen button');if(b)try{b.focus({preventScroll:true})}catch(_){}},60);
};
function senBar(){
 const tb=app.querySelector(':scope > .top');let el=app.querySelector(':scope > #v34sen');
 const want=tb&&!SKIP.includes(top())&&(senior()||top()==='home');
 if(!want){if(el)el.remove();return}
 const key=(senior()?'on':'off')+'|'+L();
 if(!el){el=document.createElement('div');el.id='v34sen';el.setAttribute('data-v32skip','1');tb.insertAdjacentElement('afterend',el)}
 else if(el.previousElementSibling!==tb)tb.insertAdjacentElement('afterend',el);
 if(el.dataset.k===key)return;
 el.dataset.k=key;el.lang=L();el.className='v34sen '+(senior()?'on':'off');
 el.innerHTML=senior()
  ?`<button type="button" class="v34off" aria-pressed="true" onclick="v34Sen()"><b>✕ ${t('off')}</b><small><span aria-hidden="true">👓</span> ${t('isOn')}</small></button>`
  :`<button type="button" class="v34onb" aria-pressed="false" onclick="v34Sen()"><span class="v34ico" aria-hidden="true">👓</span><span class="v34tx"><b>${t('onT')}</b><small>${t('onS')}</small></span><span class="v34sw" aria-hidden="true"></span></button>`;
}
function aa(){
 const b=app.querySelector('.top .v31ic button[onclick*="v31Senior"]');if(!b)return;
 const s=senior(),lbl=s?t('aaOn'):t('aaOff');
 if(b.getAttribute('aria-label')!==lbl){b.setAttribute('aria-label',lbl);b.title=lbl}
 if(b.getAttribute('aria-pressed')!==String(s))b.setAttribute('aria-pressed',String(s));
 b.classList.toggle('on',s);b.setAttribute('data-v32skip','1');
 document.querySelectorAll('.v31tg [data-t="senior"]').forEach(x=>{if(x.getAttribute('aria-pressed')!==String(s))x.setAttribute('aria-pressed',String(s))});
}

// ---------- 2. Przejrzystość ekranu startowego ----------
function homeTidy(){
 if(top()!=='home')return;const sc=app.querySelector('.scroll');if(!sc)return;
 const hero=sc.querySelector('#v31hero');if(!hero)return;
 const stack=hero.querySelector('.v31stack'),strip=hero.querySelector('.v31strip'),short=hero.querySelector('.v31short');
 // nagłówek „Moje dokumenty” nad stosem kart
 if(stack&&!hero.querySelector('#v34hd')){stack.insertAdjacentHTML('beforebegin',`<h3 class="v34h" id="v34hd" data-v32skip="1"></h3>`)}
 const hd=hero.querySelector('#v34hd');if(hd&&hd.textContent!=='🪪 '+t('docs')){hd.textContent='🪪 '+t('docs');hd.lang=L()}
 // „Co chcesz załatwić?” (karta z v8) zaraz pod sprawami; pole wpisywania jest już na dole ekranu, więc w karcie zostają gotowe sprawy + mikrofon
 let ask=hero.querySelector('.v34ask');
 if(!ask){const c=[...sc.querySelectorAll('.card')].find(x=>!hero.contains(x)&&x.querySelector('#hq'));
  if(c){c.classList.add('v34ask');const row=c.querySelector('#hq')&&c.querySelector('#hq').parentElement;if(row)row.remove();
   const b=c.querySelector('b');if(b&&!c.querySelector('.v34askh')){b.insertAdjacentHTML('afterend',`<small class="v34askh" data-v32skip="1"></small>`)}
   (strip||stack).insertAdjacentElement('afterend',c);ask=c}}
 if(ask){const h=ask.querySelector('.v34askh');if(h&&h.textContent!==t('ask')){h.textContent=t('ask');h.lang=L()}
  const mic=sc.querySelector('#v19mic');if(mic&&!ask.contains(mic))ask.appendChild(mic)}
 // skróty: dwa kafelki z v33 (Kontrola bez internetu, Jestem bezpieczny) w jednej siatce z resztą skrótów
 const v33=hero.querySelector('#v33home');
 if(short&&v33){[...v33.querySelectorAll('a')].forEach(a=>{const bb=a.querySelector('b'),sp=a.querySelector('span');const n=document.createElement('a');n.href=a.getAttribute('href');n.className='v34from33'+(a.classList.contains('ok')?' ok':'');n.innerHTML=`<b>${bb?bb.innerHTML:''}</b>${sp?sp.innerHTML:a.textContent}`;if(a.getAttribute('lang'))n.setAttribute('lang',a.getAttribute('lang'));n.setAttribute('data-v32skip','1');
  if(!short.querySelector(`a[href="${n.getAttribute('href')}"]`))short.insertBefore(n,short.firstChild);a.remove()});}
 if(short){const pref=['#/alarm','#/bezpieczenstwo','#/offline','#/schronienie','#/udostepnij','#/moj-profil'];const as=[...short.children];const sorted=as.slice().sort((a,b)=>{const ia=pref.indexOf(a.getAttribute('href')),ib=pref.indexOf(b.getAttribute('href'));return (ia<0?99:ia)-(ib<0?99:ib)});
  if(sorted.some((x,i)=>x!==as[i]))sorted.forEach(x=>short.appendChild(x));short.classList.add('v34short');
  if(!hero.querySelector('#v34hs'))short.insertAdjacentHTML('beforebegin',`<h3 class="v34h" id="v34hs" data-v32skip="1"></h3>`);
  const hs=hero.querySelector('#v34hs');if(hs&&hs.textContent!=='⚡ '+t('short')){hs.textContent='⚡ '+t('short');hs.lang=L()}
  if(ask&&hs&&hs.previousElementSibling!==ask&&ask.nextElementSibling!==hs){/* kolejność: dokumenty → sprawy → co chcesz załatwić → skróty */ask.insertAdjacentElement('afterend',hs);hs.insertAdjacentElement('afterend',short)}}
 // scalanie powtórzeń w pełnej liście (zostaje jedno wejście – wyżej, w hero albo w lepszej grupie)
 const list=sc.querySelector('#v31more');if(!list)return;
 const dup=el=>{if(el&&!el.classList.contains('v34dup')){el.classList.add('v34dup');el.setAttribute('aria-hidden','true')}};
 // drugi mDowód (zawsze „Anna Kowalska”) – ten sam dokument jest na górze w stosie kart
 list.querySelectorAll('.doc').forEach(d=>{if(/#\/doc\/dowod/.test(d.getAttribute('onclick')||''))dup(d)});
 // „Do załatwienia” z v8 – te same sprawy co pasek z licznikiem (dotknięcie paska otwiera pełną listę)
 [...list.querySelectorAll('.card')].forEach(c=>{const h=c.querySelector('h3');if(h&&/📌/.test(h.textContent)&&c.querySelectorAll('.row[onclick]').length&&strip)dup(c)});
 // druga wyszukiwarka usług (obie prowadzą do #/all) – zostaje pierwsza
 const sb=[...list.querySelectorAll('.searchbar')];if(sb.length>1)sb.slice(1).forEach(dup);
 // duże karty, które powtarzają skrót z góry (Alarm, Co mnie dotyczy)
 if(short){if(short.querySelector('a[href="#/alarm"]'))dup(list.querySelector('#v20go'));if(short.querySelector('a[href="#/moj-profil"]'))dup(list.querySelector('#v30home'))}
 // przełącznik trybu seniora w dolnej sekcji → krótki link (włącznik jest na samej górze)
 const v19=list.querySelector('#v19h');
 if(v19){const sw=v19.querySelector('.v19sw');if(sw){const row=sw.closest('.v19row')||sw;row.outerHTML=`<a class="v34setl" href="#/settings" data-v32skip="1"></a>`}
  const l=v19.querySelector('.v34setl');if(l&&l.textContent!=='👴 '+t('set')+' ›'){l.textContent='👴 '+t('set')+' ›';l.lang=L()}}
 // puste grupy v32 po scaleniu
 list.querySelectorAll('.v32g').forEach(g=>{const vis=[...g.children].filter(c=>!c.classList.contains('v32gh')&&!c.classList.contains('v34dup'));const h=vis.length===0;if(g.hidden!==h)g.hidden=h});
}

// ---------- 3. Bezpieczeństwo: baner z v13 nie spycha treści w dół ----------
function bezp(){
 if(top()!=='bezpieczenstwo')return;const sc=app.querySelector('.scroll');if(!sc)return;const u=sc.querySelector('#v13u');
 if(u&&sc.lastElementChild!==u&&!u.dataset.v34){u.dataset.v34='1';sc.appendChild(u)}
}

// ---------- 4. Dymki Bielika nie zasłaniają paska „Co chcesz załatwić?”, nawigacji ani kontroli ----------
function bubbles(){
 const r=document.documentElement;const showcase=document.body.classList.contains('v31show');
 let b=16;if(!showcase){const el=app.querySelector('.v31ask')||app.querySelector('nav.nav');if(el&&el.offsetHeight){const tp=el.getBoundingClientRect().top;if(tp>0&&tp<innerHeight)b=Math.round(innerHeight-tp+8)}}
 const v=b+'px';if(r.style.getPropertyValue('--v34bb')!==v)r.style.setProperty('--v34bb',v);
 const k=SKIP.includes(top())||!!document.querySelector('.v33ctl');document.body.classList.toggle('v34full',k);
}
// propozycja pobrania Bielika czeka, aż zamkniesz okno (np. wybór języka) i wyjdziesz z kontroli dokumentu – nie nakłada się na nie
const _pre=window.v17Pre;
if(typeof _pre==='function'){window.v17Pre=function(start){const busy=()=>!!document.querySelector('.modal')||SKIP.includes(top())||!!document.querySelector('.v33ctl');
 if(!busy())return _pre(start);return new Promise(res=>{const iv=setInterval(()=>{if(!busy()){clearInterval(iv);res(_pre(start))}},700)})}}

// ---------- przebieg ----------
let busy=false,tm=null;
function run(){if(busy)return;busy=true;try{senBar()}catch(_){}try{aa()}catch(_){}try{homeTidy()}catch(_){}try{bezp()}catch(_){}try{bubbles()}catch(_){}busy=false}
function sched(){if(busy)return;clearTimeout(tm);tm=setTimeout(run,40)}
new MutationObserver(sched).observe(app,{childList:true,subtree:true});
new MutationObserver(sched).observe(document.body,{attributes:true,attributeFilter:['class']});
addEventListener('resize',sched);addEventListener('hashchange',()=>setTimeout(run,0));
const _r=route;route=function(){const o=_r.apply(this,arguments);try{run()}catch(_){}return o};window.route=route;onhashchange=route;

const st=document.createElement('style');st.textContent=`
#v34sen{flex:none;position:relative;z-index:4;padding:8px 12px;background:var(--card);border-bottom:1px solid #e3e7ef}
.v34onb{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;border:2px solid var(--blue,#1f4fbf);background:#f3f7ff;color:var(--txt);border-radius:16px;padding:8px 12px;font:inherit;text-align:left;cursor:pointer}
.v34onb .v34ico{font-size:1.6em;line-height:1}.v34tx{flex:1;min-width:0;display:flex;flex-direction:column}.v34tx b{font-size:1.02em;color:var(--blue,#1f4fbf)}.v34tx small{font-size:.8em;color:var(--mut)}
.v34sw{flex:none;width:50px;height:30px;border-radius:99px;background:#c9d1de;position:relative}.v34sw:after{content:'';position:absolute;left:3px;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 1px 3px #0003}
.v34sen.on{background:#fff8d6;border-bottom:2px solid #e8c547}
.v34off{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;min-height:56px;border-radius:14px;border:2.5px solid #14213d;background:#fff;color:#14213d;font:inherit;cursor:pointer;padding:6px 12px;line-height:1.2}
.v34off b{font-size:1.05em;font-weight:800}.v34off small{font-size:.78em;color:#5a4a00;margin-top:2px}
.v34onb:focus-visible,.v34off:focus-visible{outline:3px solid #ffbf47;outline-offset:2px}
body.senior .v34off{min-height:64px}body.senior .v34sen.on{padding:6px 10px}
body.senior .v31stack .v31card:first-child{margin-top:0}
body.contrast #v34sen{background:#000;border-color:#fff}body.contrast .v34onb,body.contrast .v34off{background:#000;color:#ffeb3b;border-color:#fff}body.contrast .v34tx b,body.contrast .v34tx small,body.contrast .v34off small{color:#fff}
.v31ic button[aria-pressed="true"]:after{content:'✓';position:absolute;right:-2px;bottom:-2px;width:15px;height:15px;border-radius:50%;background:#1a7f37;color:#fff;font-size:10px;line-height:15px;text-align:center;border:1.5px solid #fff}
.v34h{font-size:.8em;text-transform:uppercase;letter-spacing:1px;color:var(--mut);margin:4px 2px 8px}body.senior .v34h{font-size:1em}
#v31hero .v34h:not(:first-child){margin-top:14px}
.v34ask{margin:10px 0 4px}.v34ask .v34askh{display:block;opacity:.9;font-size:.8em;margin-top:2px}
.v34ask .v19mic{margin:10px 0 0;padding:10px;box-shadow:none;background:#fff;color:var(--blue,#1f4fbf);flex-direction:row;justify-content:center;gap:8px;font-size:.95em}.v34ask .v19mic small{display:none}
body.senior .v34ask .v19mic{font-size:1.2em;padding:16px}
#v33home:empty{display:none}
.v31short.v34short{grid-template-columns:repeat(3,1fr)}
.v31short a.v34from33{background:var(--card)}.v31short a.v34from33.ok{background:#f0fbf5;box-shadow:0 0 0 1.5px #9fd9b8 inset}
body.senior .v31short.v34short{grid-template-columns:1fr 1fr}
.v34dup{display:none!important}
.v33fa{display:flex;flex-wrap:wrap;gap:6px}.v33mini{white-space:normal!important;max-width:100%;overflow-wrap:anywhere}
.v34setl{display:block;margin:6px 0 8px;color:var(--blue,#1f4fbf);font-weight:600;font-size:.9em}
.v15pill{bottom:var(--v34bb,44px)!important}
body:not(.v31show) #v16b,body:not(.v31show) #v17pre{bottom:var(--v34bb,44px)!important;max-height:calc(100vh - var(--v34bb,44px) - 70px);overflow:auto}
body.v34full .v15pill,body.v34full #v16b,body.v34full #v17pre{display:none!important}
`;document.head.appendChild(st);
run();
})();
