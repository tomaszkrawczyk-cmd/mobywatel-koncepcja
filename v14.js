// ===== v14: wybór modelu AI – Gemma (demo), Bielik 11B v3, PLLuM 12B przez własny klucz/endpoint, Bielik 1.5B w przeglądarce (za darmo) =====
// Klucz API trzymamy WYŁĄCZNIE w localStorage tej przeglądarki (osobny wpis), nigdy w repozytorium ani na serwerze.
(function(){
S.v14=S.v14||{model:'gemma',ep:'hf',url:'http://localhost:11434/v1/chat/completions',ids:{}};
const v=S.v14,KK='mob_ai_key_v14';
const getKey=()=>{try{return localStorage.getItem(KK)||''}catch(e){return''}};
const setKey=k=>{try{k?localStorage.setItem(KK,k):localStorage.removeItem(KK)}catch(e){}};
const M={
 gemma:{n:'Gemma',d:'domyślny, demo konkursowe',ic:'💎',id:'@cf/google/gemma-4-26b-a4b-it',who:'Google, otwarte wagi, przez pośrednika Cloudflare'},
 bielik:{n:'Bielik 11B v3',d:'polski model SpeakLeash / ACK Cyfronet AGH',ic:'🦅',id:'speakleash/Bielik-11B-v3.0-Instruct',who:'SpeakLeash, Apache 2.0'},
 pllum:{n:'PLLuM 12B',d:'polski model konsorcjum PLLuM (CYFRAGOVPL)',ic:'🇵🇱',id:'CYFRAGOVPL/PLLuM-12B-chat-2412',who:'Ministerstwo Cyfryzacji / konsorcjum PLLuM'},
 local:{n:'Bielik 1.5B w przeglądarce',d:'za darmo, bez klucza, działa na Twoim urządzeniu',ic:'💻',id:'dx0ne/Bielik-1.5B-v3.0-Instruct-onnx-q4',who:'SpeakLeash (wersja ONNX q4, ok. 1,1 GB)'}};
const EP={hf:['Hugging Face (router)','https://router.huggingface.co/v1/chat/completions'],custom:['Własny adres zgodny z OpenAI (np. Ollama, vLLM, serwer suwerenny)','']};
const mid=k=>(v.ids&&v.ids[k])||M[k].id;
const epUrl=()=>v.ep=='hf'?EP.hf[1]:(v.url||'').trim();
const ready=()=>v.model=='local'||(v.model!='gemma'&&!!epUrl()&&(!!getKey()||v.ep=='custom'));
let cfgProxy='';fetch('ai-config.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(c=>{cfgProxy=c&&c.proxy||''}).catch(()=>{});
const proxy=()=>(S.v10&&S.v10.proxy)||cfgProxy;
window.v14Last=null;
// ---- wywołania ----
const AIB0='Jesteś asystentem aplikacji mObywatel (prototyp konkursowy; dane osób są fikcyjne). Odpowiadasz po polsku, prostym językiem, najwyżej 3 zdania. Nie udzielasz porad prawnych. Nie wymyślasz przepisów, terminów ani kwot. Niczego nie wykonujesz – możesz tylko zaproponować akcję.';
const sysFor=task=>task=='chat'?AIB0+' Dostajesz JSON z pytaniem i listami kandydatów. Odpowiedz WYŁĄCZNIE obiektem JSON {"tekst":"...","akcja":null|{"typ":"otworz","cel":"<id kandydata>"}|{"typ":"scenariusz","id":"<id scenariusza>"}}.':AIB0;
const userFor=(task,p)=>task=='chat'?JSON.stringify({pytanie:p.pytanie,historia:p.historia,kandydaci:p.kandydaci,scenariusze:p.scenariusze}):String(p.tekst||'');
const parse=(task,c)=>task=='chat'&&window.aiParse?aiParse(c):{tekst:String(c||''),akcja:null};
async function callDirect(task,p){const ac=new AbortController();const to=setTimeout(()=>ac.abort(),40000);const k=getKey();
 try{const r=await fetch(epUrl(),{method:'POST',headers:{'Content-Type':'application/json',...(k?{Authorization:'Bearer '+k}:{})},body:JSON.stringify({model:mid(v.model),temperature:.2,max_tokens:400,messages:[{role:'system',content:sysFor(task)},{role:'user',content:userFor(task,p)}]}),signal:ac.signal});
  if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();const c=j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content;if(!String(c||'').trim())throw new Error('empty');return parse(task,c)}finally{clearTimeout(to)}}
let gen=null,genP=null;
function loadLocal(onp){if(gen)return Promise.resolve(gen);if(genP)return genP;
 genP=(async()=>{const T=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6');const dev=navigator.gpu?'webgpu':'wasm';
  gen=await T.pipeline('text-generation',M.local.id,{dtype:'q4',device:dev,progress_callback:x=>{if(onp&&x.status=='progress'&&/onnx/.test(x.file||''))onp(Math.round(x.progress||0))}});return gen})();
 genP.catch(()=>{genP=null});return genP}
async function callLocal(task,p){const g=await loadLocal(pr=>{const e=document.getElementById('v14prog');if(e)e.textContent='Pobieram model: '+pr+'%';});
 const q=task=='chat'?String(p.pytanie||''):String(p.tekst||'');
 const o=await g([{role:'system',content:AIB0},{role:'user',content:q}],{max_new_tokens:180,do_sample:false});const m=o[0].generated_text;const c=Array.isArray(m)?m[m.length-1].content:String(m);
 if(!String(c||'').trim())throw new Error('empty');return{tekst:c.trim(),akcja:null}}
async function callGemma(task,p){if(window.v19Offline)throw new Error('tryb offline');const u=proxy();if(!/^https:\/\//.test(u))throw new Error('no proxy');const ac=new AbortController();const to=setTimeout(()=>ac.abort(),45000);
 try{const r=await fetch(u.replace(/\/$/,''),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task,...p}),signal:ac.signal});if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();if(j.error||!String(j.tekst||'').trim())throw new Error(j.error||'empty');if(j.model&&S.v13){S.v13.model=String(j.model).slice(0,80);save()}return{tekst:String(j.tekst),akcja:j.akcja||null,model:j.model}}finally{clearTimeout(to)}}
const _call=aiCall,_on=aiOn;
aiOn=function(){return (v.model!='gemma'&&ready())||_on()};window.aiOn=aiOn;
aiCall=async function(task,p){
 if(v.model!='gemma'&&ready()){try{const r=v.model=='local'?await callLocal(task,p):await callDirect(task,p);window.v14Last={k:v.model,fb:false};return r}catch(e){console.warn('v14: '+M[v.model].n+' niedostępny – próbuję Gemmę',e&&e.message);window.v14Last={k:'gemma',fb:true,err:M[v.model].n}}}
 try{const r=(S.v10.mode=='off'||S.v10.mode=='proxy')?await callGemma(task,p):await _call(task,p);if(!window.v14Last||!window.v14Last.fb)window.v14Last={k:S.v10.mode=='direct'?'own':'gemma',fb:false};return r}
 catch(e){window.v14Last={k:'rules',fb:true,err:window.v14Last&&window.v14Last.err};throw e}
 finally{setTimeout(()=>{if(window.v14Last)window.v14Last.used=1},0)}};
window.aiCall=aiCall;
// ---- plakietka „kto odpowiedział” w rozmowie ----
const BD=l=>{const k=l.k,lab=k=='rules'?'⚙️ Reguły w telefonie (bez AI)':k=='own'?'🤖 Własny model (tryb bezpośredni)':M[k].ic+' '+M[k].n;return ` <span class="v14b ${k}">${lab}${l.fb&&l.err?' · zastępczo, bo '+esc(l.err)+' nie odpowiedział':''}</span>`};
const _d=drawChat;drawChat=function(){try{const m=chat[chat.length-1];if(m&&m.r=='a'&&!m.v14&&window.v14Last&&!window.v14Last.shown&&/odpowiedź AI|bez AI/.test(m.t)){m.t+=BD(window.v14Last);m.v14=1;window.v14Last.shown=1}}catch(e){}return _d.apply(this,arguments)};window.drawChat=drawChat;
// ---- karta ustawień „Model AI” ----
function card(){const k=getKey(),cur=M[v.model];
 return `<div id="v14c" class="card v14card"><h3>🧠 Model AI</h3><p class="muted">Wybierz, który model odpowiada w asystencie. Na prezentacji działa <b>Gemma</b>. Polskie modele <b>Bielik</b> i <b>PLLuM</b> podłączasz własnym kluczem albo własnym (suwerennym) serwerem – bez zmian w kodzie.</p>
 <div class="v14grid">${Object.entries(M).map(([id,m])=>`<button class="v14opt ${v.model==id?'on':''}" onclick="v14Set('${id}')"><span class="v14ic">${m.ic}</span><b>${m.n}</b><small>${m.d}</small></button>`).join('')}</div>
 ${v.model=='bielik'||v.model=='pllum'?`<div class="v14box"><label>Punkt dostępu (endpoint)</label><div class="chips">${Object.entries(EP).map(([id,e])=>`<button class="chip ${v.ep==id?'on':''}" style="${v.ep==id?'background:var(--blue,#1f4fbf);color:#fff':''}" onclick="S.v14.ep='${id}';save();v14Re()">${id=='hf'?'Hugging Face':'Własny adres'}</button>`).join('')}</div>
  ${v.ep=='custom'?`<input id="v14u" placeholder="np. http://localhost:11434/v1/chat/completions" value="${esc(v.url)}"><p class="muted">Ollama: <code>ollama run SpeakLeash/bielik-11b-v3.0-instruct</code> i uruchom z <code>OLLAMA_ORIGINS=*</code>, aby przeglądarka mogła się połączyć.</p>`:`<p class="muted"><code>${EP.hf[1]}</code> – zgodny z OpenAI. Potrzebny token Hugging Face z dostępnymi środkami.</p>`}
  <label>Nazwa modelu</label><input id="v14m" value="${esc(mid(v.model))}">
  <label>Klucz API ${k?'<span class="v14ok">✔ zapisany</span>':''}</label><input id="v14k" type="password" placeholder="${k?'•••••••• (zapisany – wpisz nowy, aby zmienić)':'hf_… lub klucz Twojego serwera'}" autocomplete="off">
  <div class="v14row"><button class="btn small" onclick="v14Save()">Zapisz i sprawdź</button>${k?'<button class="btn ghost small" onclick="v14Del()">Usuń klucz</button>':''}</div></div>`:''}
 ${v.model=='local'?`<div class="v14box"><p>Model <b>Bielik 1.5B v3</b> pobierze się jednorazowo (ok. 1,1 GB) i będzie działał <b>w całości na Twoim urządzeniu</b> – pytania nie wychodzą z przeglądarki. Najlepiej na komputerze z Chrome/Edge (WebGPU). Odpowiedzi mniejszego modelu są prostsze.</p><div class="v14row"><button class="btn small" onclick="v14Load()">⬇️ Pobierz i sprawdź</button><span id="v14prog" class="muted">${gen?'✔ model gotowy':''}</span></div></div>`:''}
 <div id="v14res"></div>
 <div class="alert b">🔒<div><b>Prywatność klucza.</b> Klucz zapisuje się wyłącznie w pamięci tej przeglądarki (localStorage) i trafia tylko do wybranego punktu dostępu. Nie ma go w repozytorium ani na naszym serwerze. Nie wpisuj klucza na cudzym urządzeniu; używaj klucza z niskim limitem. Gdy wybrany model nie odpowie, asystent przełączy się na Gemmę, a potem na reguły w telefonie – zawsze pokaże, kto odpowiedział.</div></div>
 <p class="muted">Teraz: ${cur.ic} <b>${cur.n}</b> ${v.model=='gemma'||ready()?'':'– <b>brak klucza</b>, odpowiada Gemma'} · ${esc(cur.who)}</p></div>`}
window.v14Re=function(){const c=document.getElementById('v14c');if(c)c.outerHTML=card()};
window.v14Set=function(k){v.model=k;save();v14Re()};
window.v14Save=async function(){const u=document.getElementById('v14u'),m=document.getElementById('v14m'),k=document.getElementById('v14k');if(u)v.url=u.value.trim();if(m&&m.value.trim())v.ids[v.model]=m.value.trim();if(k&&k.value.trim())setKey(k.value.trim());save();v14Re();
 const o=document.getElementById('v14res');if(!ready()){o.innerHTML='<div class="alert y">⚠️<div>Wpisz klucz API (dla Hugging Face) albo własny adres.</div></div>';return}
 o.innerHTML='<p class="muted">Sprawdzam połączenie…</p>';const t=Date.now();try{const r=await callDirect('pytanie',{tekst:'Odpowiedz jednym słowem: działa?'});o.innerHTML=`<div class="alert g">✅<div><b>${esc(M[v.model].n)} odpowiada</b> (${((Date.now()-t)/1000).toFixed(1)} s): „${esc(r.tekst.slice(0,120))}”</div></div>`}
 catch(e){o.innerHTML=`<div class="alert r">⚠️<div>Brak odpowiedzi (${esc(e.message||'błąd')}). Sprawdź klucz, środki na koncie i CORS. Asystent użyje Gemmy.</div></div>`}};
window.v14Del=function(){setKey('');v14Re();toast('Klucz usunięty z tej przeglądarki')};
window.v14Load=async function(){const p=document.getElementById('v14prog');p.textContent='Przygotowuję…';const t=Date.now();try{const r=await callLocal('pytanie',{tekst:'Przywitaj się jednym zdaniem.'});p.textContent='✔ gotowy ('+((Date.now()-t)/1000).toFixed(0)+' s): „'+r.tekst.slice(0,80)+'”'}catch(e){p.textContent='⚠️ Nie udało się ('+(e.message||e)+'). Spróbuj Chrome na komputerze.'}};
// ---- wstrzyknięcia ----
function inject(){const h=(app.querySelector('.top h2')||{}).textContent||'';const sc=app.querySelector('.scroll');if(!sc)return;
 if(/Asystent AI/.test(h)&&!sc.querySelector('#v14c'))sc.insertAdjacentHTML('afterbegin',card());
 else if(/Asystent/.test(h)&&!sc.querySelector('#v14p')){const m=M[v.model],on=v.model=='gemma'||ready();sc.insertAdjacentHTML('afterbegin',`<a id="v14p" class="v14pill" href="#/ai">🧠 Model AI: <b>${on?m.ic+' '+m.n:'💎 Gemma'}</b>${on?'':' <small>(brak klucza do '+m.n+')</small>'} · <u>zmień</u> <small>– Bielik, PLLuM lub model w przeglądarce</small></a>`)}}
new MutationObserver(()=>inject()).observe(app,{childList:true});inject();
const st=document.createElement('style');st.textContent=`.v14card .v14grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:10px 0}.v14opt{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;padding:10px;border:2px solid #dfe3ea;border-radius:14px;background:#fff;cursor:pointer;font:inherit;color:inherit}.v14opt small{color:#667;font-size:.78em}.v14opt.on{border-color:var(--blue,#1f4fbf);background:#eef3ff;box-shadow:0 2px 8px rgba(31,79,191,.15)}.v14ic{font-size:1.4em}.v14box{background:#f6f8fb;border-radius:12px;padding:10px;margin:8px 0}.v14box input{width:100%;box-sizing:border-box;margin:4px 0 8px}.v14box code{word-break:break-all;overflow-wrap:anywhere}.v14box label{font-weight:600;font-size:.9em}.v14row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.v14ok{color:#1a7f37;font-weight:600}.v14pill{display:block;margin:0 0 10px;padding:9px 12px;border-radius:999px;background:#eef3ff;color:#1f2d4d;text-decoration:none;font-size:.9em;border:1px solid #cdd9f5}.v14b{display:inline-block;margin-top:6px;padding:2px 8px;border-radius:999px;font-size:.75em;background:#eef3ff;color:#1f4fbf;border:1px solid #cdd9f5}.v14b.rules{background:#f3f3f3;color:#555;border-color:#ddd}.v14b.bielik,.v14b.pllum,.v14b.local{background:#fff1f1;color:#b3261e;border-color:#f3c7c4}`;document.head.appendChild(st);
})();
