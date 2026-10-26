// ===== v16: przejrzysty komunikat o pobieraniu Bielika w tle (co, po co, co się zmieni) + wstrzymanie/powrót do Gemmy =====
(function(){
const A=window.v15API;if(!A)return;
let cached=null,shown=false,collapsed=false,doneShown=false;
const isCached=async()=>{try{if(!window.caches)return false;for(const k of await caches.keys()){const c=await caches.open(k);for(const r of await c.keys())if(r.url.includes(A.MID)&&/\.onnx/.test(r.url))return true}}catch(e){}return false};
isCached().then(v=>{cached=v;upd()});
const MB=b=>Math.round((b||0)/1048576).toLocaleString('pl-PL');
const WHY=`<ul class="v16l"><li><b>Po co?</b> Asystent zadziała lokalnie, prywatnie i po polsku – pytania nie opuszczają Twojego urządzenia.</li><li><b>Co się zmieni?</b> Gdy model będzie gotowy, asystent przełączy się z Gemmy na Bielika, a przy każdej odpowiedzi zobaczysz oznaczenie, który model odpowiedział.</li><li><b>Do tego czasu</b> odpowiada Gemma, tak jak dotąd. Możesz w każdej chwili wstrzymać pobieranie albo wrócić do Gemmy.</li></ul>`;
window.v16Pause=function(){S.v15.auto=false;save();A.stop();close();toast('Wstrzymano – Bielik nie będzie pobierany automatycznie');try{v15Re()}catch(e){}};
window.v16Gemma=function(){try{v14Set('gemma')}catch(e){S.v14.model='gemma';S.v15.picked=true;save()}close();toast('Asystent wrócił do Gemmy');try{v15Re()}catch(e){}};
window.v16Fold=function(){collapsed=true;close()};
function close(){const e=document.getElementById('v16b');if(e)e.remove()}
function box(html){let e=document.getElementById('v16b');if(!e){e=document.createElement('div');e.id='v16b';e.setAttribute('role','status');document.body.appendChild(e)}e.innerHTML=html}
function upd(){const s=A.state;
 if(s=='loading'&&cached===false&&!collapsed){shown=true;const p=A.pct||0;
  box(`<div class="v16h">🦅 <b>Pobieramy w tle polski model Bielik</b> <span class="muted">(ok. 1,1 GB, jednorazowo)</span></div>${WHY}
  <div class="v16bar"><i style="width:${p}%"></i></div><div class="v16p">${p}%${A.total?` · ${MB(A.loaded)} z ${MB(A.total)} MB`:' · przygotowuję…'}</div>
  <div class="v16btn"><button class="btn sec small" onclick="v16Pause()">⏸ Wstrzymaj / Nie pobieraj</button><a class="btn ghost small" href="#/ai">Szczegóły</a><button class="btn ghost small" onclick="v16Fold()">Zwiń</button></div>`)}
 else if(s=='ready'&&shown&&!doneShown){doneShown=true;
  box(`<div class="v16h">✅ <b>Gotowe – asystent działa teraz na Bielik 1.5B lokalnie</b></div><p class="muted">Pytania nie opuszczają urządzenia. Przy odpowiedziach widać oznaczenie „💻 Bielik 1.5B w przeglądarce”; gdy Bielik nie zdąży, odpowie Gemma.</p><div class="v16btn"><button class="btn ghost small" onclick="v16Gemma()">Wróć do Gemmy</button><button class="btn small" onclick="document.getElementById('v16b').remove()">OK</button></div>`)}
 else if(s=='error'&&shown){box(`<div class="v16h">⚠️ <b>Nie udało się uruchomić Bielika</b></div><p class="muted">Asystent dalej działa na Gemmie. Spróbuj Chrome lub Edge na komputerze.</p><div class="v16btn"><button class="btn small" onclick="document.getElementById('v16b').remove()">OK</button></div>`)}
 else if(s=='idle')close()}
window.addEventListener('v15',upd);
window.v15OnReady=function(){if(shown){setTimeout(upd,0);return false}return false};
// gdy model był w pamięci podręcznej: bez dużej karty – v15 pokazuje krótki komunikat
// ---- „Jak to działa” w ustawieniach ----
function inject(){const c=document.getElementById('v15c');if(c&&!c.querySelector('.v16how'))c.insertAdjacentHTML('beforeend',`<details class="v16how"><summary><b>Jak to działa</b></summary><p>Pobieramy w tle polski model Bielik (ok. 1,1 GB, jednorazowo) – tylko na komputerach z WebGPU lub co najmniej 4 GB pamięci, nie na telefonach i wolnych sieciach.</p>${WHY}<p class="muted">Model zapisuje się w pamięci tej przeglądarki; kolejne wizyty ładują go w kilka sekund. Adres <code>?bielik=1</code> wymusza pobieranie, <code>?bielik=0</code> je wyłącza. ${S.v14&&S.v14.model=='local'?'<button class="btn ghost small" onclick="v16Gemma()">Wróć do Gemmy</button>':''}</p></details>`)}
new MutationObserver(inject).observe(app,{childList:true,subtree:true});inject();
const st=document.createElement('style');st.textContent=`#v16b{position:fixed;right:16px;bottom:44px;z-index:10000;width:min(380px,calc(100vw - 32px));background:#fff;border:1px solid #cdd9f5;border-radius:16px;box-shadow:0 10px 30px rgba(20,40,90,.18);padding:14px 16px;font:14px/1.45 system-ui,sans-serif;color:#1f2d4d;animation:v16in .3s ease}@keyframes v16in{from{transform:translateY(12px);opacity:0}}#v16b .v16h{font-size:15px;margin-bottom:6px}.v16l{margin:6px 0 10px;padding-left:18px}.v16l li{margin:3px 0}.v16bar{height:8px;background:#e6ebf5;border-radius:99px;overflow:hidden}.v16bar i{display:block;height:100%;background:linear-gradient(90deg,#1f4fbf,#dc143c);transition:width .4s}.v16p{font-size:12px;color:#556;margin:4px 0 8px}.v16btn{display:flex;gap:6px;flex-wrap:wrap}.v16btn .btn{margin:0}.v16how{margin-top:8px}.v16how summary{cursor:pointer}`;document.head.appendChild(st);
})();
