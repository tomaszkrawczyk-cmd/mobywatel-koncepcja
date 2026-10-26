// ===== v17: prywatność zależna od trybu, zgoda przed pobraniem, propozycje zamiast ślepej akcji, informacja o zmianie silnika =====
(function(){
const A=window.v15API;
const host=u=>{try{return new URL(u).host}catch(e){return'Twój serwer'}};
// Który silnik faktycznie odpowie na następne pytanie
function engine(){const m=(S.v14||{}).model||'gemma';if(m=='local')return A&&A.state=='ready'?'local':'gemma';if((m=='bielik'||m=='pllum')){let k='';try{k=localStorage.getItem('mob_ai_key_v14')||''}catch(e){}if(S.v14.ep=='custom'&&S.v14.url)return'custom';if(k)return'hf'}return'gemma'}
const NAME={local:'💻 Bielik 1.5B (lokalnie)',gemma:'💎 Gemma',hf:'🦅/🇵🇱 '+'model przez Hugging Face',custom:'🦅/🇵🇱 model na Twoim serwerze'};
window.v17Where=function(){const e=engine();return e=='local'?'<b>Bielik działa lokalnie – pytanie nie opuszcza urządzenia.</b>':e=='gemma'?'pytanie trafia do <b>Cloudflare Workers AI</b> (Gemma) – nie wpisuj danych o zdrowiu, nazwisk ani adresów.':e=='hf'?'pytanie trafia do <b>Hugging Face</b> i dostawcy modelu – nie wpisuj danych o zdrowiu, nazwisk ani adresów.':'pytanie trafia do <b>'+esc(host(S.v14.url))+'</b> (Twój serwer).'};
// ---- 1a. Rozszerzony filtr ----
const _red=redact;
redact=function(s){return _red(s).replace(/\b\d{2}-\d{3}\b/g,'[kod pocztowy]').replace(/\b(ul\.?|ulica|al\.?|aleja|aleje|os\.?|osiedle|pl\.?|plac)\s+[A-ZŁŚŻŹĆŃÓĘĄa-ząćęłńóśźż.\- ]{2,40}?\s\d+[a-zA-Z]?(\s?\/\s?\d+|\s?m\.?\s?\d+)?/gi,'[adres]').replace(/(^|[^\p{L}])([Nn]azywam się|[Mm]am na imię|[Jj]estem|[Ss]yn|[Cc]órka|[Mm]ąż|[Żż]ona|[Pp]an|[Pp]ani|[Dd]la)\s+(\p{Lu}\p{Ll}+)(\s+\p{Lu}[\p{Ll}\-]+)?/gu,'$1$2 [imię i nazwisko]')};window.redact=redact;
// ---- 1b. Ostrzeżenie przed wysłaniem danych o zdrowiu poza urządzenie (art. 9 RODO) ----
const HEALTH=/\b(chor\w*|cukrzyc\w*|nowotw\w*|rak\w*|ciąż\w*|depresj\w*|lek(i|ów|ami|u)?\b|leczen\w*|diagnoz\w*|szpital\w*|zabieg\w*|operacj\w*|alergi\w*|hiv|aids|terapi\w*|psychiatr\w*|psycholog\w*|nadciśnien\w*|astm\w*|padaczk\w*|udar\w*|zawał\w*|niepełnospr\w*|recept\w*|wynik\w* bada\w*|bada\w* krwi|ból\w*|boli)/i;
let okSess=false;
function healthAsk(){return new Promise(res=>{const m=modal(`<h3>🩺 Pytanie wygląda na dotyczące zdrowia</h3><p>Dane o zdrowiu to <b>szczególna kategoria danych (art. 9 RODO)</b>. W tym trybie ${v17Where()}</p><p class="muted">Możesz wysłać mimo to, odpowiedzieć bez modelu (reguły w telefonie) albo włączyć Bielika lokalnego w ustawieniach Asystenta AI.</p><button class="btn" id="h1">Odpowiedz bez modelu</button><button class="btn ghost" id="h2">Wyślij mimo to</button><label class="chk"><input type="checkbox" id="h3"> Nie pytaj ponownie w tej sesji</label>`);
 m.querySelector('#h1').onclick=()=>{closeModal();res(false)};m.querySelector('#h2').onclick=()=>{okSess=m.querySelector('#h3').checked;closeModal();res(true)}})}
const _call=aiCall;
aiCall=async function(task,p){const e=engine();const q=String((p&&(p.pytanie||p.tekst))||'');
 if(e!='local'&&e!='custom'&&!okSess&&HEALTH.test(q)){const go=await healthAsk();if(!go){window.v14Last={k:'rules',fb:false};throw new Error('użytkownik nie wysłał danych o zdrowiu')}}
 return _call(task,p)};window.aiCall=aiCall;
// ---- 3 + 5. Propozycje zamiast ślepej akcji; jedno zdanie o zmianie silnika ----
let lastEng=null;
const _d=drawChat;drawChat=function(){try{const m=chat[chat.length-1];
 if(m&&m.r=='a'&&!m.v17&&!/Myślę/.test(m.t)){m.v17=1;
  if(window.v17Opts){const o=window.v17Opts;window.v17Opts=null;if(!m.act&&!(m.cards&&m.cards.length)){m.cards=o.map(c=>ALL.find(a=>a[2]==c.id)||['🔎',c.t,c.id]);m.t+=' <span class="muted">Nie mam pewności, o którą sprawę chodzi – wybierz jedną z propozycji:</span>'}}
  const L=window.v14Last;if(L&&!L.v17){L.v17=1;const k=L.k=='own'?'own':L.k;if(lastEng&&k!=lastEng&&k!='rules'){const nm=k=='local'?'Bielik 1.5B (lokalnie)':k=='gemma'?'Gemma (Cloudflare Workers AI)':k=='bielik'?'Bielik 11B':k=='pllum'?'PLLuM 12B':'inny model';chat.splice(chat.length-1,0,{r:'a',v17:1,t:'<span class="v17sys">🔄 Asystent przełączył się na '+nm+'</span>'})}if(k!='rules')lastEng=k}}}catch(e){}return _d.apply(this,arguments)};window.drawChat=drawChat;
// ---- 1c. Linia „dokąd trafia pytanie” przy polu asystenta ----
function inject(){const h=(app.querySelector('.top h2')||{}).textContent||'';
 if(/^.?.?\s*Asystent$|Asystent(?! AI)/.test(h)&&!/Asystent AI/.test(h)){const c=document.getElementById('chat');if(!c)return;let e=document.getElementById('v17w');const html='🔒 '+v17Where()+' <a href="#/ai">zmień</a>';
  if(!e){e=document.createElement('div');e.id='v17w';e.className='v17w';const inp=app.querySelector('input[type=text],input:not([type]),textarea');const anchor=inp&&inp.closest('.scroll')?inp.parentElement:null;(anchor||c).insertAdjacentElement(anchor?'beforebegin':'afterend',e)}if(e.innerHTML!=html)e.innerHTML=html}}
new MutationObserver(inject).observe(app,{childList:true});window.addEventListener('v15',inject);inject();
// ---- 2. Zgoda przed transferem: karta z odliczaniem 8 s ----
const isCached=async()=>{try{if(!window.caches)return false;for(const k of await caches.keys()){const c=await caches.open(k);for(const r of await c.keys())if(r.url.includes('Bielik-1.5B')&&/\.onnx/.test(r.url))return true}}catch(e){}return false};
window.v17Pre=async function(start){if(await isCached())return start();let n=8,t=null;
 const e=document.createElement('div');e.id='v17pre';document.body.appendChild(e);
 const draw=()=>{e.innerHTML=`<div class="v16h">🦅 <b>Za ${n} s zaczniemy pobierać w tle polski model Bielik</b> <span class="muted">(ok. 1,1 GB, jednorazowo)</span></div><p class="v16l" style="margin:4px 0 8px">Zapasowy asystent <b>offline, po polsku</b> (pytania nie wychodzą z urządzenia). Na co dzień odpowiada Gemma. Na łączu z limitem wybierz „Nie pobieraj”.</p><div class="v16btn"><button class="btn small" id="v17go">⬇️ Pobierz teraz</button><button class="btn sec small" id="v17no">Nie pobieraj</button><a class="btn ghost small" href="#/ai">Szczegóły</a></div>`;
  e.querySelector('#v17go').onclick=()=>{clearInterval(t);e.remove();start()};e.querySelector('#v17no').onclick=()=>{clearInterval(t);e.remove();S.v15.auto=false;save();toast('Nie pobieramy Bielika. Możesz go włączyć w ustawieniach Asystenta AI.');try{v15Re()}catch(x){}}};
 draw();t=setInterval(()=>{n--;if(n<=0){clearInterval(t);e.remove();start()}else{const b=e.querySelector('b');if(b)b.textContent='Za '+n+' s zaczniemy pobierać w tle polski model Bielik'}},1000)};
const st=document.createElement('style');st.textContent=`#v17pre{position:fixed;right:16px;bottom:44px;z-index:10001;width:min(380px,calc(100vw - 32px));background:#fff;border:2px solid #1f4fbf;border-radius:16px;box-shadow:0 10px 30px rgba(20,40,90,.22);padding:14px 16px;font:14px/1.45 system-ui,sans-serif;color:#1f2d4d;animation:v16in .3s ease}.v17w{font-size:.78em;color:#445;background:#f6f8fb;border:1px solid #e1e6ef;border-radius:10px;padding:6px 10px;margin:6px 0}.v17sys{display:inline-block;font-size:.8em;color:#1f4fbf;background:#eef3ff;border-radius:999px;padding:3px 10px}`;document.head.appendChild(st);
})();
