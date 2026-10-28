// ===== v24: Bielik na telefonie – jak włączyć WebGPU w Chrome na Androidzie + „Użyj Bielika mimo wszystko” =====
// Autor koncepcji: Tomasz Krawczyk. Strona nie może sama zmienić ustawień przeglądarki ani otworzyć chrome://flags –
// pokazujemy tylko instrukcję i przycisk kopiowania. Domyślna kolejność Gemma → reguły → Bielik zostaje bez zmian.
(function(){
const A=window.v15API;if(!A)return;
const FKEY='mob24_bielik_force';const BENCH=4000,TOK=16,FORCE_MS=90000;
const qp=new URLSearchParams(location.search).get('bielik');
const lsGet=()=>{try{return localStorage.getItem(FKEY)==='1'}catch(e){return false}};
const force=()=>qp==='force'||(qp!=='0'&&lsGet());
window.v24Force=force;
const android=/Android/i.test(navigator.userAgent),chrome=/Chrome\//.test(navigator.userAgent)&&!/Edg\//.test(navigator.userAgent);
const G={api:!!navigator.gpu,adapter:null,checked:false};
(async()=>{try{if(navigator.gpu){const a=await navigator.gpu.requestAdapter();G.adapter=!!a}else G.adapter=false}catch(e){G.adapter=false}G.checked=true;setTimeout(()=>{try{safe()}catch(e){}},0)})();
const gpuOk=()=>G.api&&G.adapter===true;
function backend(){const d=A.dev;if(d==='webgpu')return 'WebGPU (karta graficzna)';if(d==='wasm')return 'WASM / procesor (CPU)';return gpuOk()?'WebGPU dostępne – Bielik jeszcze nie uruchomiony':'WASM / procesor (CPU) – WebGPU niedostępne'}
function speed(){const b=A.bench;if(!b)return 'jeszcze nie mierzono';if(b===BENCH+1)return 'test przerwany po 12 s (próg: '+TOK+' tokenów w 4 s)';const s=b/1000;return `${TOK} tokenów w ${s.toLocaleString('pl-PL',{maximumFractionDigits:1})} s (≈ ${(TOK/s).toLocaleString('pl-PL',{maximumFractionDigits:1})} tok/s) · próg: 4 s · ${b<=BENCH?'zaliczony':'za wolno'}`}
const base=location.origin+location.pathname;
const STEPS=[
 ['Otwórz nową kartę w Chrome','Wpisz w pasku adresu <code>chrome://flags</code> i zatwierdź. Strona nie może tego otworzyć za Ciebie – skopiuj adres przyciskiem poniżej i wklej.'],
 ['Wyszukaj „WebGPU”','W polu „Search flags” u góry wpisz <b>WebGPU</b>.'],
 ['Włącz „Unsafe WebGPU Support”','Przy pozycji <b>Unsafe WebGPU Support</b> (<code>#enable-unsafe-webgpu</code>) wybierz <b>Enabled</b>.'],
 ['Jeśli jest – „WebGPU Developer Features”','Przy <b>WebGPU Developer Features</b> też wybierz <b>Enabled</b>. Jeśli tej pozycji nie ma, pomiń ten krok.'],
 ['Naciśnij „Relaunch”','Na dole pojawi się niebieski przycisk <b>Relaunch</b> – Chrome uruchomi się ponownie.'],
 ['Otwórz prototyp jeszcze raz z ?bielik=1','Model jest już w pamięci przeglądarki, więc <b>nie pobierze się ponownie</b> (ok. 1,1 GB). Bielik uruchomi się i jeszcze raz zrobi test szybkości – tym razem na karcie graficznej.']];
function guide(){return `<div class="v24g"><h4>🛠️ Jak włączyć WebGPU w Chrome na Androidzie</h4>
 <ol class="v24s">${STEPS.map(s=>`<li><b>${s[0]}</b><span>${s[1]}</span></li>`).join('')}</ol>
 <div class="v24b"><button class="btn" onclick="v24Copy('chrome://flags')">📋 Skopiuj „chrome://flags”</button><button class="btn sec" onclick="v24Copy('chrome://flags/#enable-unsafe-webgpu')">📋 Skopiuj adres flagi</button><button class="btn sec" onclick="v24Copy('${base}?bielik=1')">📋 Skopiuj adres prototypu z ?bielik=1</button><a class="btn sec" href="${base}?bielik=1">↻ Otwórz ponownie z ?bielik=1</a></div>
 <p class="muted">ℹ️ <b>Strona nie może sama zmienić ustawień przeglądarki</b> ani otworzyć <code>chrome://</code> – to zabezpieczenie Chrome. „Unsafe” oznacza funkcję eksperymentalną: Chrome może działać mniej stabilnie. Możesz ją w każdej chwili wyłączyć tak samo (Default → Relaunch).</p>
 <details class="v24more"><summary>Dalej nie działa?</summary><ul><li>Sprawdź wersję Chrome (<code>chrome://version</code>) – WebGPU na Androidzie wymaga Chrome 121 lub nowszego. Domyślnie działa na Androidzie 12+ z kartą Qualcomm lub ARM; inne układy mogą wymagać flagi albo nie działać wcale.</li><li>Na <code>chrome://gpu</code> zobaczysz, czy WebGPU jest zablokowane („disabled via blocklist”). Wtedy pomaga też flaga <b>Override software rendering list</b> (<code>#ignore-gpu-blocklist</code>) – na własne ryzyko.</li><li>Nie każdy telefon będzie dość szybki nawet z WebGPU. Wtedy odpowiada Gemma albo możesz włączyć „Użyj Bielika mimo wszystko”.</li></ul>
 <p class="v21src">Źródła: <a href="https://developer.chrome.com/docs/web-platform/webgpu/troubleshooting-tips" target="_blank" rel="noopener">Chrome for Developers – WebGPU: Troubleshooting</a> · <a href="https://developer.chrome.com/blog/new-in-webgpu-121" target="_blank" rel="noopener">What's New in WebGPU (Chrome 121)</a></p></details></div>`}
function card(){const f=force(),st=A.state,noGpu=G.checked&&!gpuOk();
 return `<div id="v24c" class="card v24c"><h3>🦅 Bielik na tym urządzeniu</h3>
 <div class="row"><span>Silnik</span><b>${backend()}</b></div>
 <div class="row"><span>WebGPU w przeglądarce</span><b>${!G.checked?'sprawdzam…':gpuOk()?'✅ dostępne':G.api?'⚠️ jest, ale brak karty (adapter = null)':'⛔ niedostępne'}</b></div>
 <div class="row"><span>Zmierzona szybkość</span><b>${speed()}</b></div>
 <div class="row"><span>Stan</span><b>${{idle:'nie uruchomiony',loading:A.phase==='bench'?'test szybkości…':'pobieranie / uruchamianie '+(A.pct||0)+'%',ready:f&&A.bench>BENCH?'gotowy (wymuszony)':'gotowy',slow:'za wolny – odpowiada Gemma',error:'błąd – odpowiada Gemma'}[st]||st}</b></div>
 ${noGpu?(android&&chrome?guide():`<p class="muted">WebGPU jest niedostępne. Na Androidzie: Chrome → <code>chrome://flags</code> → „Unsafe WebGPU Support” → Enabled → Relaunch. Na komputerze: Chrome lub Edge w najnowszej wersji.</p><details class="v24more"><summary>Pokaż instrukcję dla Chrome na Androidzie</summary>${guide()}</details>`):''}
 <label class="v19sw v24f"><input type="checkbox" id="v24fx" ${f?'checked':''} ${qp==='force'?'disabled':''} onchange="v24Set(this.checked)"><span></span><b>Użyj Bielika mimo wszystko</b></label>
 <p class="muted">Pomija test szybkości. Asystent odpowiada Bielikiem na tym urządzeniu (pytania nie opuszczają telefonu), ale <b>wolniej</b> – czekam do ${FORCE_MS/1000} s. Gdy Bielik nie odpowie: Gemma, a potem reguły w telefonie. ${qp==='force'?'<br>Włączone adresem <code>?bielik=force</code> – usuń go z adresu, aby wyłączyć.':''}</p>
 ${f&&(st==='idle'||st==='error'||st==='slow')?`<button class="btn" onclick="v15Start();v24Paint()">🦅 Uruchom Bielika teraz</button><p class="muted">Jeśli model jest w pamięci przeglądarki, nie pobierze się ponownie. W przeciwnym razie pobierze się ok. 1,1 GB.</p>`:''}</div>`}
window.v24Copy=function(t){const done=()=>toast('Skopiowano: '+t+' – wklej w pasku adresu Chrome.');const fb=()=>{try{const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();const ok=document.execCommand('copy');a.remove();ok?done():toast('Skopiuj ręcznie: '+t)}catch(e){toast('Skopiuj ręcznie: '+t)}};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,fb);else fb()};
window.v24Set=function(on){try{on?localStorage.setItem(FKEY,'1'):localStorage.removeItem(FKEY)}catch(e){}
 if(on){toast('🦅 Bielik wymuszony – odpowiedzi będą wolniejsze.');if(A.state==='slow'||A.state==='error')A.start()}
 else{toast('Wyłączono wymuszanie. Wracam do zwykłej kolejności: Gemma → reguły → Bielik.');if(A.state==='ready'&&A.bench>BENCH){A.stop();if(!(S.v15&&S.v15.auto===false))setTimeout(()=>A.start(),50)}}
 paint();try{window.dispatchEvent(new CustomEvent('v15'))}catch(e){}};
window.v24Paint=()=>setTimeout(paint,50);
// ---------- wymuszony tor odpowiedzi ----------
const adv=()=>['bielik','pllum'].includes((S.v14||{}).model);
const forcedActive=()=>force()&&!adv()&&!window.v24NoB&&A.state==='ready';
window.v24Route=function(){return forcedActive()?'bielik':'domyślnie'}; // do testów
const _call=aiCall;
aiCall=async function(task,p){if(!forcedActive())return _call.apply(this,arguments);
 try{const q=task=='chat'?String(p.pytanie||''):String(p.tekst||'');const hist=task=='chat'?(p.historia||[]).slice(-4).map(h=>({role:h.k=='u'?'user':'assistant',content:String(h.t||'')})):[];
  const t=String(await A.gen([{role:'system',content:A.SYS||''},...hist,{role:'user',content:q}],FORCE_MS)||'').trim();if(!t)throw new Error('pusta odpowiedź');
  const kc=task=='chat'&&p.kandydaci||[];window.v14Last={k:'local',fb:false,forced:true};if(kc.length>1)window.v17Opts=kc.slice(0,3);return{tekst:t,akcja:kc.length==1?{typ:'otworz',cel:kc[0].id}:null}}
 catch(e){console.warn('v24: wymuszony Bielik – '+(e&&e.message)+', przełączam na Gemmę');toast('🦅 Bielik nie odpowiedział ('+((e&&e.message)||'błąd')+'). Odpowiada Gemma, a gdy ona nie zadziała – reguły w telefonie.');
  window.v24NoB=true;try{const r=await _call.apply(this,arguments);if(window.v14Last)window.v14Last=Object.assign({},window.v14Last,{fb:true,err:'Bielik (wymuszony)'});return r}finally{window.v24NoB=false}}};
window.aiCall=aiCall;
if(window.aiStatus){const _st=window.aiStatus;window.aiStatus=function(){const s=_st.apply(this,arguments);if(!forcedActive())return s;
 return Object.assign({},s,{eng:'local',name:'Bielik 1.5B (wymuszony – wolniej)',where:'na tym urządzeniu – pytanie nie opuszcza telefonu/komputera',remote:false,why:'Włączono „Użyj Bielika mimo wszystko”. Gdy nie odpowie w '+FORCE_MS/1000+' s: Gemma, potem reguły.'})}}
// ---------- wstawki ----------
const BANNER=()=>`<div id="v24w" class="v24w">🐢 <b>Bielik wymuszony – odpowiedzi mogą trwać do ${FORCE_MS/1000} s.</b> ${A.state==='ready'?'':'Bielik jeszcze nie działa – na razie zwykła kolejność. '}<button class="v19c" onclick="v24Set(false);route()">Wyłącz</button> <a href="#/ai">Ustawienia</a></div>`;
function h2(){return (app.querySelector('.top h2')||{}).textContent||''}
function paint(){const sc=app.querySelector('.scroll');if(!sc)return;const h=h2();
 if(/Asystent AI/.test(h)){const html=card();let c=document.getElementById('v24c');if(c){if(c._h!==html){const n=document.createElement('div');n.innerHTML=html;const nc=n.firstElementChild;nc._h=html;c.replaceWith(nc)}}else{const a=sc.querySelector('#v19set')||sc.querySelector('#v18s');const n=document.createElement('div');n.innerHTML=html;const nc=n.firstElementChild;nc._h=html;a?a.insertAdjacentElement('afterend',nc):sc.insertAdjacentElement('afterbegin',nc)}}
 const s=sc.querySelector('#v18s');if(s){const html=`<div id="v24line" class="v24line">🦅 Bielik: <b>${backend()}</b> · ${speed()}${force()?' · <b>wymuszony</b>':''}${G.checked&&!gpuOk()?' · <a href="#/ai">jak włączyć WebGPU</a>':''}</div>`;let l=document.getElementById('v24line');
  if(!l||l.previousElementSibling!==s){l&&l.remove();s.insertAdjacentHTML('afterend',html);document.getElementById('v24line')._h=html}else if(l._h!==html){l.innerHTML=html.replace(/^<div[^>]*>|<\/div>$/g,'');l._h=html}}
 const asst=/Asystent/.test(h)&&!/Asystent AI/.test(h);const w=document.getElementById('v24w');
 if(asst&&force()){const html=BANNER();if(!w)sc.insertAdjacentHTML('afterbegin',html);else if(w._h!==html){w.outerHTML=html}const nw=document.getElementById('v24w');if(nw)nw._h=html}else if(w)w.remove();
 const t=document.getElementById('v18slow');if(t&&!t.querySelector('.v24t')&&G.checked&&!gpuOk())t.insertAdjacentHTML('beforeend',' <a class="v24t" href="#/ai">Włącz WebGPU lub użyj Bielika mimo wszystko →</a>')}
let busy=false;const safe=()=>{if(busy)return;busy=true;try{paint()}catch(e){console.warn('v24',e)}finally{busy=false}};
new MutationObserver(safe).observe(app,{childList:true,subtree:true});window.addEventListener('v15',()=>setTimeout(safe,0));
setInterval(()=>{if(A.state==='loading'&&document.getElementById('v24c'))safe()},3000);
try{ALL.push(['🦅','Bielik: włącz WebGPU / użyj mimo wszystko','#/ai','bielik webgpu chrome flags android wolny szybkość wymuś model lokalny offline'])}catch(e){}
const st=document.createElement('style');st.textContent=`
.v24c .row b{text-align:right}.v24g{background:#f5f8ff;border:1px solid #cdd9f5;border-radius:14px;padding:12px;margin:10px 0}.v24g h4{margin:0 0 8px}
.v24s{padding-left:0;list-style:none;counter-reset:s;margin:0 0 10px}.v24s li{counter-increment:s;display:grid;grid-template-columns:34px 1fr;gap:2px 10px;margin:0 0 10px}
.v24s li:before{content:counter(s);grid-row:span 2;width:30px;height:30px;border-radius:50%;background:#0b3d91;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}
.v24s code,.v24g code{background:#fff;border:1px solid #dde5f5;border-radius:6px;padding:0 4px}.v24b{display:flex;flex-direction:column;gap:6px;margin:0 0 8px}
.v24more summary{cursor:pointer;font-weight:700;padding:6px 0}.v24f{margin-top:12px}
.v24line{font-size:.85em;color:#44506b;margin:-4px 0 10px;padding:0 4px}body.senior .v24line{font-size:1.05em}
.v24w{background:#fff4e5;border:1px solid #f3d9a4;border-radius:12px;padding:8px 10px;margin:0 0 8px;font-size:.92em}.v24t{color:#fff;text-decoration:underline;font-weight:700}
body.senior .v24s li{grid-template-columns:46px 1fr;font-size:1.18em}body.senior .v24s li:before{width:40px;height:40px;font-size:1.1em}body.senior .v24g h4{font-size:1.3em}body.senior .v24c .row{font-size:1.1em}body.senior .v24line{font-size:.85em;color:#44506b;margin:-4px 0 10px;padding:0 4px}body.senior .v24line{font-size:1.05em}
.v24w{font-size:1.15em;padding:12px}
body.contrast .v24g,body.contrast .v24line{font-size:.85em;color:#44506b;margin:-4px 0 10px;padding:0 4px}body.senior .v24line{font-size:1.05em}
.v24w{background:#000;color:#fff;border:2px solid #fff}body.contrast .v24s code{background:#000;color:#ffeb3b}
`;document.head.appendChild(st);
safe();
})();
