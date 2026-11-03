// ===== v27: „Gdzie się ukryć PL” — punkty schronienia Państwowej Straży Pożarnej =====
// Koncepcja własna (Tomasz Krawczyk). Serwis gdziesieukryc.pl i aplikację „Gdzie się ukryć PL”
// prowadzi Komenda Główna PSP (komunikat MSWiA z 02.11.2026). To serwis zewnętrzny wobec mObywatela:
// prototyp tylko otwiera stronę albo Sklep Play. Bez iframe (X-Frame-Options: DENY, frame-ancestors 'none'),
// bez kopiowania danych o punktach, bez płatnych API. Łańcuch Gemma → reguły → Bielik bez zmian.
(function(){
const SITE='https://gdziesieukryc.pl/';
const PKG='pl.gdziesieukryc.app';
const PLAY='https://play.google.com/store/apps/details?id='+PKG;
const APPSTORE='https://apps.apple.com/pl/app/id6819162336';
const MSWIA='https://www.gov.pl/web/mswia/aplikacje-gdzie-sie-ukryc-pl-mozesz-juz-pobrac-na-telefon';
const GUIDE=SITE+'poradniki/poradnik-bezpieczenstwa/';
const REG={'Warszawa':'mazowieckie','Kraków':'malopolskie','Lublin':'lubelskie','Gdańsk':'pomorskie'};
const REGNAME={mazowieckie:'mazowieckie',malopolskie:'małopolskie',lubelskie:'lubelskie',pomorskie:'pomorskie'};
const ANS='Najbliższy punkt schronienia znajdziesz w oficjalnym serwisie Państwowej Straży Pożarnej <b>Gdzie się ukryć PL</b> (gdziesieukryc.pl, aplikacja w Sklepie Play i App Store). To serwis zewnętrzny – prototyp nie ma własnych danych o schronach i tylko go otwiera. Aplikację PSP warto pobrać wcześniej: po pobraniu danych działa bez internetu. W zagrożeniu dzwoń 112 i słuchaj Alertu RCB. Odpowiedź z reguł w telefonie, bez AI.';
function isAndroid(){return /Android/i.test(navigator.userAgent||'')}
function isIOS(){return /iPhone|iPad|iPod/i.test(navigator.userAgent||'')}
// Android: intent do Sklepu Play, gdy go brak – strona Play w przeglądarce
function playHref(){return isAndroid()?'intent://details?id='+PKG+'#Intent;scheme=market;package=com.android.vending;S.browser_fallback_url='+encodeURIComponent(PLAY)+';end':PLAY}
// Android: próba otwarcia zainstalowanej aplikacji PSP; bez niej Chrome przechodzi do strony Play
function appHref(){return 'intent://gdziesieukryc.pl/#Intent;scheme=https;package='+PKG+';S.browser_fallback_url='+encodeURIComponent(PLAY)+';end'}
function top(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/)[0]}
function city(){try{return ((typeof PERS!=='undefined'&&PERS[S.persona])||{}).city||''}catch(e){return ''}}
function ext(href,label,cls){return `<a class="btn ${cls||''} v27b" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`}
const TAG='<span class="v27tag">Serwis zewnętrzny · Państwowa Straż Pożarna</span>';

function page(){
 const c=city(),reg=REG[c];
 const store=isIOS()?ext(APPSTORE,'🍎 Pobierz z App Store','sec'):(isAndroid()?`<a class="btn sec v27b" href="${playHref()}">▶️ Pobierz z Google Play</a>`:ext(PLAY,'▶️ Pobierz z Google Play','sec'));
 shell('🛡️ Gdzie się ukryć',`
 <div class="alert r">📞<div><b>W zagrożeniu dzwoń <a href="tel:112">112</a></b> i słuchaj Alertu RCB oraz poleceń służb. Ten ekran nikogo nie wzywa.</div></div>
 <div class="card v27card">
  ${TAG}
  <h3>Gdzie się ukryć PL</h3>
  <p>Mapa ponad 88 tys. punktów schronienia w Polsce. Pokazuje najbliższe punkty, trasę pieszo, odległość i czas dojścia. Ma kompas, komunikaty głosowe, przycisk 112, poradniki i tryb uproszczony bez mapy.</p>
  <p><b>Prowadzi ją Komenda Główna Państwowej Straży Pożarnej.</b> To nie jest część mObywatela ani tego prototypu. Prototyp otwiera tylko stronę lub sklep z aplikacją i nie wysyła tam Twoich danych.</p>
  <a class="btn v27b" href="${SITE}" target="_blank" rel="noopener noreferrer">🗺️ Otwórz mapę gdziesieukryc.pl</a>
  ${store}
  ${isAndroid()?`<a class="btn ghost v27b" href="${appHref()}">📱 Otwórz aplikację PSP (jeśli jest zainstalowana)</a>`:''}
  <p class="muted">${isAndroid()?'Na Androidzie przycisk otwiera Sklep Play. Gdy go nie ma, otwiera się strona Google Play.':'Na telefonie z Androidem przycisk otworzy Sklep Play. Tu otwiera stronę Google Play.'} Mapę można też dodać do ekranu głównego z menu przeglądarki.</p>
 </div>
 <div class="card v27card">
  <h3>Przygotuj się zawczasu</h3>
  <ol class="v27steps"><li>Zainstaluj aplikację albo otwórz stronę, gdy jest spokojnie.</li><li>Pobierz dane dla swojej okolicy. Potem mapa działa bez internetu.</li><li>Sprawdź najbliższy punkt i przejdź trasę raz z rodziną.</li></ol>
  <p class="muted">Punkt schronienia to nie zawsze schron. Obiekt musi być udostępniony w razie zagrożenia lub alarmu, więc na co dzień może być zamknięty.</p>
 </div>
 <div class="card v27card">
  <h3>Poradniki PSP</h3>
  <div class="v27links">
   ${ext(GUIDE+'schronienia-gdzie-sie-ukryc','Schronienia – gdzie się ukryć','ghost')}
   ${ext(GUIDE+'atak-z-powietrza','Atak z powietrza','ghost')}
   ${ext(GUIDE+'sygnaly-alarmowe-i-komunikaty-ostrzegawcze','Sygnały alarmowe','ghost')}
   ${reg?ext(SITE+'wojewodztwa/'+reg,'Punkty w województwie '+REGNAME[reg]+' ('+esc(c)+')','ghost'):''}
   ${ext(SITE+'faq','Pytania i odpowiedzi (FAQ)','ghost')}
  </div>
 </div>
 <div class="card"><h3>Skąd to wiemy</h3>
  <p class="muted">Źródło: <a href="${MSWIA}" target="_blank" rel="noopener">MSWiA, gov.pl, 02.11.2026</a> · <a href="${PLAY}" target="_blank" rel="noopener">Google Play: ${PKG}</a>. Strona PSP nie pozwala osadzać się w innych serwisach, dlatego nie ma jej w ramce. Nie ma też publicznego API, więc prototyp nie pokazuje punktów na własnej mapie.</p>
  <p class="muted"><a href="#/alarm">🚨 Tryb alarmowy</a> · <a href="#/security">Alarmy i schrony</a> · <a href="#/plan">Plan rodzinny</a> · <a href="#/kit">Plecak</a></p>
 </div>
 <a class="v20call v27call" href="tel:112">📞 Zadzwoń 112</a>`,{tab:'security'});
}

const LEAD=(id,sub)=>`<a id="${id}" class="v27lead" href="#/schronienie"><b>🛡️ Gdzie się ukryć – mapa PSP</b><small>${sub}</small><span class="v27tag">Serwis zewnętrzny</span></a>`;
function inject(){const sc=app.querySelector('.scroll');if(!sc)return;const p=top();
 if(p==='alarm'&&!sc.querySelector('#v27alarm')){const html=`<div id="v27alarm" class="card v27card">${TAG}<h3>Prawdziwe punkty schronienia</h3><p>Schron powyżej jest wymyślony (DEMO). Prawdziwy najbliższy punkt pokaże mapa Państwowej Straży Pożarnej.</p><a class="btn v27b" href="${SITE}" target="_blank" rel="noopener noreferrer">🗺️ Otwórz gdziesieukryc.pl</a><a class="btn sec v27b" href="#/schronienie">Aplikacja PSP i poradniki</a></div>`;const sh=sc.querySelector('.v20shelter');if(sh)sh.insertAdjacentHTML('afterend',html);else sc.insertAdjacentHTML('afterbegin',html)}
 if(p==='security'&&!sc.querySelector('#v27sec')){const a=sc.querySelector('#v20sec');const html=LEAD('v27sec','Najbliższy punkt, trasa i działanie bez internetu. Strona i aplikacja w Sklepie Play.');if(a)a.insertAdjacentHTML('afterend',html);else sc.insertAdjacentHTML('afterbegin',html)}
 if(p==='plan'&&!sc.querySelector('#v27plan')){const a=sc.querySelector('#v20plan');const html=LEAD('v27plan','Wpiszcie do planu najbliższy punkt schronienia z mapy PSP.');if(a)a.insertAdjacentHTML('afterend',html);else sc.insertAdjacentHTML('afterbegin',html)}
 if(p==='kit'&&!sc.querySelector('#v27kit'))sc.insertAdjacentHTML('afterbegin',LEAD('v27kit','Obok plecaka: pobierz aplikację PSP z mapą offline.'));
 if(p==='sos'&&!sc.querySelector('#v27sos'))sc.insertAdjacentHTML('beforeend',LEAD('v27sos','Gdzie zejść w czasie alarmu – mapa Państwowej Straży Pożarnej.'));
 if(p==='syrena'&&!sc.querySelector('#v27syr'))sc.insertAdjacentHTML('beforeend',LEAD('v27syr','Słyszysz syrenę? Sprawdź najbliższy punkt schronienia.'));
 if(p==='assistant'&&!document.getElementById('v27chip')){const chips=[...sc.querySelectorAll('.chips')].filter(c=>!c.closest('.chat')&&!c.closest('.msg'));const box=chips[chips.length-1];if(box)box.insertAdjacentHTML('beforeend','<button type="button" class="chip" id="v27chip" onclick="ask(\'gdzie się ukryć\')">Gdzie się ukryć?</button>')}
 const more=document.getElementById('v19more');
 if(more&&!more.querySelector('[data-v27tile]')){const g=[...more.querySelectorAll('.v19g')].find(d=>/Kryzys/.test((d.querySelector('summary')||{}).textContent||''));const grid=g&&g.querySelector('.grid');if(grid){grid.insertAdjacentHTML('afterbegin','<button type="button" class="tile" data-v27tile="1" onclick="location.hash=\'#/schronienie\'"><b>🛡️</b>Gdzie się ukryć</button>');const n=g.querySelector('summary .muted');if(n)n.textContent=String(grid.querySelectorAll('.tile').length)}}
}

function v27Rule(q){let l='';try{l=norm(q)}catch(e){l=String(q||'').toLowerCase()}
 if(!l)return null;
 if(/ustaw|konsultac|projekt|petycj|referend|podpis/.test(l))return null;
 if(/gdzie (sie )?(ukryc|schowac|schronic)|gdziesieukryc|gdzie.{0,24}schron|najblizsz\w* (schron|punkt|ukryci|miejsc\w* schron)|\bschron(?!isk)\w*|punkt\w* schronienia|miejsc\w* (ukrycia|schronienia)/.test(l))return ['#/schronienie',ANS];
 return null}
window.v27Rule=v27Rule;
const _ask=ask;
ask=async function(q){const hit=v27Rule(q);if(!hit)return _ask.apply(this,arguments);q=(q||'').trim();if(!q)return;if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});window.v14Last={k:'rules',fb:false,shown:1};chat.push({r:'a',t:hit[1]+'<br><b>Czy chcesz kontynuować?</b>',act:hit[0]});drawChat();try{speak(String(hit[1]).replace(/<[^>]+>/g,''))}catch(e){}};
window.ask=ask;
if(window.v18Route){const _v=window.v18Route;window.v18Route=function(q){const hit=v27Rule(q);if(hit)return {kind:'act',hit:[null,hit[0],hit[1]],act:hit[0]};return _v(q)}}
try{INT.unshift([/gdzie si[eę] ukry[cć]|gdzie.{0,20}schron/i,'#/schronienie',ANS]);ALL.push(['🛡️','Gdzie się ukryć – punkty schronienia PSP','#/schronienie','schron schronienie ukrycie punkt schronienia mapa psp straż gdziesieukryc alarm syrena'])}catch(e){}

const R={schronienie:page,'gdzie-sie-ukryc':page};
const _r=route;
route=function(){const p=top();if(R[p]){try{clearInterval(threatT)}catch(e){}try{clearInterval(camT)}catch(e){}R[p]();try{inject()}catch(e){}return}const out=_r.apply(this,arguments);try{inject()}catch(e){}return out};
window.route=route;onhashchange=route;
new MutationObserver(()=>{try{inject()}catch(e){}}).observe(app,{childList:true,subtree:true});
const st=document.createElement('style');st.textContent=`
.v27tag{display:inline-block;background:#eef2f8;color:#24324a;border:1px solid #c9d3e3;border-radius:8px;padding:2px 8px;font-size:.78em;font-weight:700;margin-bottom:6px}
.v27card .btn.v27b,.v27links .btn{display:block;text-align:center;text-decoration:none;margin:8px 0;min-height:48px;line-height:1.3;box-sizing:border-box}
.v27links{display:flex;flex-direction:column}
.v27steps{margin:0;padding-left:20px}.v27steps li{margin:0 0 8px;line-height:1.4}
.v27lead{display:flex;flex-direction:column;gap:3px;text-decoration:none;border-radius:16px;padding:14px;margin:0 0 10px;background:#fff;color:#14213d;border:1.5px solid #d5deee;box-shadow:0 1px 3px #0001}
.v27lead b{color:#0b3d91;font-size:1.12em}.v27lead small{font-weight:650;line-height:1.35}.v27lead .v27tag{align-self:flex-start;margin:4px 0 0}
body.senior .v27lead{padding:18px}body.senior .v27lead b{font-size:1.4em}body.senior .v27lead small{font-size:1.05em}
body.senior .v27card .btn.v27b,body.senior .v27links .btn{min-height:64px;font-size:1.2em;padding:16px}
body.senior .v27card p,body.senior .v27steps li{font-size:1.15em}body.senior .v27tag{font-size:.95em}
.v27lead:focus-visible,.v27b:focus-visible{outline:3px solid #14213d;outline-offset:3px}
body.contrast .v27lead,body.contrast .v27tag{background:#000;color:#fff;border-color:#fff}body.contrast .v27lead b{color:#ffeb3b}
`;document.head.appendChild(st);
try{inject()}catch(e){}
route();
})();
