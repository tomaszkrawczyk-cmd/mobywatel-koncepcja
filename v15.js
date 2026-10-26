// ===== v15: Bielik 1.5B pobiera się sam w tle (Web Worker) i włącza się, gdy jest gotowy =====
// Tylko na komputerach z WebGPU lub ≥4 GB RAM, bez trybu oszczędzania danych i wolnej sieci. ?bielik=1 wymusza, ?bielik=0 wyłącza.
(function(){
S.v15=S.v15||{auto:null,picked:false};const v=S.v15;
const MID='dx0ne/Bielik-1.5B-v3.0-Instruct-onnx-q4',CDN='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6';
const qp=new URLSearchParams(location.search).get('bielik');
const c=navigator.connection||{};const mobile=/Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(navigator.userAgent);
const mem=navigator.deviceMemory;const eligible=!mobile&&!c.saveData&&!/(^|-)(2g|3g)$/.test(c.effectiveType||'')&&(!!navigator.gpu||(mem?mem>=4:false));
const autoOn=()=>qp=='1'?true:qp=='0'?false:(v.auto==null?eligible:!!v.auto&&!mobile);
const SYS='Jesteś asystentem aplikacji mObywatel (prototyp konkursowy, dane fikcyjne). Odpowiadasz po polsku, prosto, najwyżej 3 zdania. Nie udzielasz porad prawnych ani medycznych. Nie wymyślasz przepisów, kwot ani terminów – gdy nie masz pewności, napisz „sprawdź w usłudze lub w urzędzie”. Niczego nie wykonujesz sam. Pewne fakty: wydanie dowodu osobistego jest bezpłatne; wniosek o dowód można złożyć w dowolnym urzędzie gminy lub przez internet z profilem zaufanym/podpisem; dowód odbiera się osobiście; utratę dowodu zgłasza się w urzędzie, na policji lub online i dokument jest od razu unieważniony; zastrzeżenie PESEL jest bezpłatne i można je zrobić w aplikacji mObywatel; mDowód w mObywatelu jest ważnym dokumentem tożsamości w Polsce, ale nie za granicą; paszport wymaga opłaty i wizyty w urzędzie; prawo jazdy odbiera się w wydziale komunikacji starostwa; numer alarmowy to 112; całodobowa linia do zastrzegania kart i dokumentów w bankach to 828 828 828.';
let w=null,state='idle',pct=0,pend={},seq=0,ld=0,tot=0,q=Promise.resolve(),quiet=false;const ev=()=>{try{window.dispatchEvent(new CustomEvent('v15'))}catch(e){}};
function worker(){if(w)return w;const src=`import {pipeline,env} from '${CDN}';env.useBrowserCache=true;env.allowLocalModels=false;let g=null;
self.onmessage=async e=>{const d=e.data;try{if(d.t=='load'){if(!g){const dev=d.gpu?'webgpu':'wasm';try{g=await pipeline('text-generation','${MID}',{dtype:'q4',device:dev,progress_callback:x=>{if(x.status=='progress'&&/onnx/.test(x.file||''))self.postMessage({t:'p',p:x.progress,l:x.loaded,tt:x.total})}})}catch(err){if(dev!='wasm')g=await pipeline('text-generation','${MID}',{dtype:'q4',device:'wasm'});else throw err}}self.postMessage({t:'ready'})}
 else if(d.t=='gen'){const o=await g(d.m,{max_new_tokens:d.n||160,do_sample:false});const m=o[0].generated_text;self.postMessage({t:'out',id:d.id,c:Array.isArray(m)?m[m.length-1].content:String(m)})}}catch(err){self.postMessage({t:'err',id:d.id,e:String(err&&err.message||err)})}}`;
 w=new Worker(URL.createObjectURL(new Blob([src],{type:'text/javascript'})),{type:'module'});
 w.onmessage=e=>{const d=e.data;if(d.t=='p'){pct=Math.round(d.p||0);ld=d.l||ld;tot=d.tt||tot;pill();ev()}else if(d.t=='ready'){state='ready';pill();ev();if(quiet)quiet=false;else onReady()}else if(d.t=='out'||d.t=='err'){const p=pend[d.id];if(p){delete pend[d.id];d.t=='out'?p.ok(d.c):p.no(new Error(d.e))}else if(d.t=='err'&&state=='loading'){state='error';pill();ev();console.warn('v15: Bielik nie załadował się',d.e)}}};
 w.onerror=e=>{state='error';pill();ev();console.warn('v15: worker',e.message)};return w}
function start(){if(state=='loading'||state=='ready')return;state='loading';pct=0;pill();ev();try{worker().postMessage({t:'load',gpu:!!navigator.gpu})}catch(e){state='error';pill()}}
window.v15Start=start;
function stop(){try{w&&w.terminate()}catch(e){}w=null;Object.values(pend).forEach(p=>p.no(new Error('przerwano')));pend={};state='idle';pct=0;pill();ev()}
function gen(msgs,ms){const job=q.then(()=>gen1(msgs,ms));q=job.catch(()=>{});return job}
function gen1(msgs,ms){if(state!='ready')return Promise.reject(new Error('model niegotowy'));return new Promise((ok,no)=>{const id=++seq;pend[id]={ok,no};worker().postMessage({t:'gen',id,m:msgs,n:120});setTimeout(()=>{if(pend[id]){delete pend[id];no(new Error('ponad '+ms/1000+' s'));try{w.terminate()}catch(e){}w=null;state='idle';quiet=true;start()}},ms)})}
window.v15API={get state(){return state},get pct(){return pct},get loaded(){return ld},get total(){return tot},start,stop,MID};
function onReady(){if(window.v15OnReady){try{if(window.v15OnReady()===true)return}catch(e){}}if(!v.picked&&S.v14&&S.v14.model=='gemma'){S.v14.model='local';save();toast('🦅 Bielik gotowy – asystent działa teraz na polskim modelu, lokalnie');try{v14Re()}catch(e){}
  const p=document.getElementById('v14p');if(p)p.remove();}else toast('🦅 Bielik pobrany – możesz go wybrać w ustawieniach Modelu AI')}
// ---- pigułka postępu ----
function pill(){let e=document.getElementById('v15pill');if(state=='idle'){e&&e.remove();return}
 if(!e){e=document.createElement('a');e.id='v15pill';e.href='#/ai';document.body.appendChild(e)}
 e.className='v15pill '+state;e.textContent=state=='loading'?(pct?'🦅 Bielik pobiera się w tle '+pct+'%':'🦅 Bielik przygotowuje się w tle…'):state=='ready'?'🦅 Bielik gotowy (lokalnie)':'🦅 Bielik niedostępny – działa Gemma';
 if(state!='loading')setTimeout(()=>{if(e.isConnected&&state!='loading')e.classList.add('hide')},6000)}
// ---- wywołanie: Bielik z limitem 20 s, potem Gemma/reguły (przez v14) ----
window.v14Set&&(()=>{const _s=window.v14Set;window.v14Set=function(k){v.picked=true;save();return _s(k)}})();
const _call=aiCall;
aiCall=async function(task,p){if(!(S.v14&&S.v14.model=='local'))return _call(task,p);
 if(state=='ready'){try{const q=task=='chat'?String(p.pytanie||''):String(p.tekst||'');const hist=task=='chat'?(p.historia||[]).slice(-4).map(h=>({role:h.k=='u'?'user':'assistant',content:String(h.t||'')})):[];
   const t=(await gen([{role:'system',content:SYS},...hist,{role:'user',content:q}],20000)).trim();if(!t)throw new Error('pusta odpowiedź');
   const k=task=='chat'&&p.kandydaci&&p.kandydaci[0];window.v14Last={k:'local',fb:false};return{tekst:t,akcja:k?{typ:'otworz',cel:k.id}:null}}
  catch(e){console.warn('v15: Bielik – '+e.message+', przełączam na Gemmę')}}
 const prev=S.v14.model;S.v14.model='gemma';try{const r=await _call(task,p);window.v14Last={k:window.v14Last&&window.v14Last.k=='own'?'own':'gemma',fb:true,err:state=='ready'?'Bielik (lokalny)':'Bielik (jeszcze się pobiera)'};return r}
 catch(e){window.v14Last={k:'rules',fb:true,err:'żaden model'};throw e}finally{S.v14.model=prev}};
window.aiCall=aiCall;
// ---- ustawienie ----
function card(){return `<div id="v15c" class="card"><h3>🦅 Bielik w tle</h3><label class="chk"><input type="checkbox" ${autoOn()?'checked':''} onchange="S.v15.auto=this.checked;save();if(this.checked)v15Start();v15Re()"> <b>Automatycznie pobieraj Bielika w tle</b></label>
 <p class="muted">Model (ok. 1,1 GB) pobiera się raz po otwarciu aplikacji, zapisuje w pamięci przeglądarki i przy kolejnych wizytach ładuje się szybko. Gdy jest gotowy, asystent odpowiada polskim modelem <b>na Twoim urządzeniu</b> – do czasu gotowości odpowiada Gemma. ${eligible?'To urządzenie spełnia wymagania.':'To urządzenie nie spełnia wymagań automatycznego pobierania (telefon, słabsza sieć, tryb oszczędzania danych lub mało pamięci) – możesz włączyć ręcznie.'}${qp?` Adres strony wymusza: <code>?bielik=${esc(qp)}</code>.`:''}</p>
 <p class="muted">Stan: <b>${{idle:'nie pobrano',loading:'pobieranie '+pct+'%',ready:'gotowy',error:'błąd – działa Gemma'}[state]}</b> ${state!='loading'&&state!='ready'?'<button class="btn small" onclick="v15Start();v15Re()">Pobierz teraz</button>':''}</p></div>`}
window.v15Re=function(){const e=document.getElementById('v15c');if(e)e.outerHTML=card()};
function inject(){const h=(app.querySelector('.top h2')||{}).textContent||'';const sc=app.querySelector('.scroll');if(!sc)return;
 if(/Asystent AI/.test(h)&&!sc.querySelector('#v15c')){const a=sc.querySelector('#v14c');a?a.insertAdjacentHTML('afterend',card()):sc.insertAdjacentHTML('afterbegin',card())}}
new MutationObserver(()=>inject()).observe(app,{childList:true});inject();
setInterval(()=>{if(state=='loading'&&document.getElementById('v15c'))v15Re()},3000);
const st=document.createElement('style');st.textContent=`.v15pill{position:fixed;left:14px;bottom:44px;z-index:9999;padding:7px 12px;border-radius:999px;background:#fff;color:#1f2d4d;border:1px solid #cdd9f5;box-shadow:0 4px 14px rgba(0,0,0,.12);font:600 13px system-ui,sans-serif;text-decoration:none;transition:opacity .6s}.v15pill.ready{background:#eaf7ee;border-color:#b5e0c2;color:#1a7f37}.v15pill.error{background:#fff6e5;border-color:#f3d9a4}.v15pill.hide{opacity:0;pointer-events:none}`;document.head.appendChild(st);
if(autoOn()){const go=()=>start();('requestIdleCallback' in window)?requestIdleCallback(()=>setTimeout(go,1500),{timeout:5000}):setTimeout(go,3000)}
})();
