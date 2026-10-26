// ===== v18: wiarygodność – symulacje oznaczone wprost, jeden status AI, pewność dopasowania, spójne ścieżki, osobne dane person =====
(function(){
S.v18=S.v18||{remoteOk:false,pp:{}};const V=S.v18;V.pp=V.pp||{};
const A=window.v15API||{state:'idle'};
// ---------- 2. Symulacje: jeden filtr tekstów, numery DEMO-, przycisk z etykietą DEMO ----------
const SIMRE=/(wysłan\w*|wysłano|złożon\w*|złożono|przyjęt\w*|doręczon\w*|zarejestrowan\w*|opublikowan\w*|trafiła do|przekazan\w*|powiadomion\w*|zgłoszon\w*|podpisan\w*)/i;
window.simTxt=function(s){s=String(s==null?'':s);if(!SIMRE.test(s)||/symulac/i.test(s))return s;return '(symulacja) '+s.replace(/\s*\(DEMO\)/g,'')+' – nic nie zostało wysłane.'};
const _toast=toast;toast=function(m){return _toast(simTxt(m))};window.toast=toast;
const fixCases=()=>{(S.cases||[]).forEach(c=>{if(c.no&&!/^DEMO-/.test(c.no))c.no='DEMO-'+String(c.no).replace(/^DEMO\/?/,'').replace(/\//g,'-');if(c.st&&!/symulac/i.test(c.st)&&SIMRE.test(c.st))c.st='Symulacja – '+c.st.toLowerCase()})};
fixCases();setInterval(()=>{try{fixCases()}catch(e){}},1500); // save jest stałą (const) – porządkujemy przy każdym renderze i cyklicznie
const BTN=/(wyślij|złóż|podpisz|zagłosuj|oddaj głos|zgłoś|udostępnij|kup |kup$|zapłać|zastrzeż|potwierdzam|wyślij)/i;
function tagButtons(root){root.querySelectorAll('button,a.btn').forEach(b=>{if(b.dataset.v18||b.closest('#v18s,#v17pre,#v16b,.side'))return;const t=(b.textContent||'').trim();if(BTN.test(t)&&!/DEMO|symulac/i.test(t)){b.insertAdjacentHTML('beforeend',' <span class="v18demo">DEMO</span>')}b.dataset.v18=1})}
// ---------- 1. Ekrany alarmowe: wyraźna symulacja i prawdziwy 112 ----------
const SOSB=`<div id="v18sos" class="v18sos"><b>SYMULACJA – nic nie zostało wysłane.</b> Nikt nie został powiadomiony i nie przekazano lokalizacji. W prawdziwym zagrożeniu dzwoń 112.<a class="v18call" href="tel:112">📞 Zadzwoń 112</a></div>`;
// ---------- 3. Jeden status AI ----------
const NM={local:'Bielik 1.5B (lokalnie)',gemma:'Gemma (Google, otwarte wagi)',hf:'',custom:'',own:'własny model (tryb bezpośredni)',rules:'reguły w telefonie (bez modelu AI)'};
const key=()=>{try{return localStorage.getItem('mob_ai_key_v14')||''}catch(e){return''}};
const host=u=>{try{return new URL(u).host}catch(e){return'Twój serwer'}};
function bState(){const s=A.state;return s=='idle'?(S.v15&&S.v15.auto===false?'nie pobierany (wyłączono)':'nie pobrano'):s=='loading'?(A.phase=='bench'?'uruchomiony – sprawdzam szybkość':A.phase=='init'?'pobrano – uruchamianie ('+(A.dev=='webgpu'?'GPU':'CPU')+')':'pobieranie '+(A.pct||0)+'%'):s=='ready'?'gotowy ('+(A.dev=='webgpu'?'GPU':'CPU')+')':s=='slow'?'pobrany, ale ten komputer nie obsługuje go wystarczająco szybko':'nie działa na tym urządzeniu (brak WebGPU lub błąd)'}
window.aiStatus=function(){const m=(S.v14||{}).model||'gemma',v10=S.v10||{};const gem=/^https:\/\//.test(v10.proxy||'')&&v10.mode=='proxy';
 const remoteReady=(m=='bielik'||m=='pllum')&&((S.v14.ep=='custom'&&!!S.v14.url)||(S.v14.ep!='custom'&&!!key()));
 let eng,why='';
 if(m=='local'&&A.state=='ready')eng='local';
 else if(remoteReady)eng=S.v14.ep=='custom'?'custom':'hf';
 else if(v10.mode=='direct')eng='own';
 else if(m!='gemma'||gem)eng='gemma';
 else eng='rules';
 if(m=='local'&&eng!='local')why='Wybrano Bielika lokalnego – stan: '+bState()+', więc odpowiada Gemma.';
 if((m=='bielik'||m=='pllum')&&!remoteReady)why='Wybrano '+(m=='bielik'?'Bielik 11B':'PLLuM 12B')+', ale brak klucza lub adresu – odpowiada Gemma.';
 const name=eng=='hf'?(m=='bielik'?'Bielik 11B v3':'PLLuM 12B')+' przez Hugging Face':eng=='custom'?(m=='bielik'?'Bielik 11B v3':'PLLuM 12B')+' na '+host(S.v14.url):NM[eng];
 const where=eng=='local'||eng=='rules'?'na tym urządzeniu – pytanie nie opuszcza telefonu/komputera':eng=='gemma'?'poza urządzeniem: pośrednik Cloudflare Workers AI (mobywatel-asystent)':eng=='hf'?'poza urządzeniem: Hugging Face i dostawca modelu':eng=='custom'?'poza urządzeniem: '+host(S.v14.url):'poza urządzeniem: '+host((v10.direct||{}).url||'dostawca');
 const L=window.v14Last;const last=L&&L.k?(L.k=='rules'?'reguły':L.k=='gemma'?'Gemma':L.k=='local'?'Bielik 1.5B':L.k=='own'?'własny model':L.k=='bielik'?'Bielik 11B':'PLLuM 12B')+(L.fb?' (zastępczo'+(L.err?', bo '+L.err+' nie odpowiedział':'')+')':''):'';
 return{eng,name,where,remote:!(eng=='local'||eng=='rules'),why,last,bielik:bState()}};
window.v17Where=function(){const s=aiStatus();return s.remote?'pytanie trafia '+esc(s.where.replace(/^poza urządzeniem: /,'do: '))+' – nie wpisuj danych o zdrowiu, nazwisk ani adresów.':'<b>pytanie nie opuszcza urządzenia</b> ('+esc(s.name)+').'};
function card(){const s=aiStatus();return `<div id="v18s" class="v18s ${s.remote?'rem':'loc'}"><div class="v18r"><span>🤖 <b>Odpowiada teraz:</b> ${esc(s.name)}</span><a href="#/ai">zmień</a></div><div class="v18r"><span>${s.remote?'🌐':'🔒'} <b>Gdzie:</b> ${esc(s.where)}</span></div>${s.why?`<div class="v18r"><span>↪️ ${esc(s.why)}</span></div>`:''}<div class="v18r muted"><span>🦅 Bielik lokalny: ${esc(s.bielik)}${s.last?' · ostatnia odpowiedź: '+esc(s.last):''}</span></div>${s.remote?'<div class="v18r muted"><span>Maskujemy PESEL, numery, kontakty i część adresów, ale nie usuwamy wszystkich nazwisk ani szczegółów sprawy.</span></div>':''}</div>`}
function putStatus(){const h=(app.querySelector('.top h2')||{}).textContent||'';const sc=app.querySelector('.scroll');if(!sc)return;
 const asst=/Asystent/.test(h)&&!/Asystent AI/.test(h),aip=/Asystent AI/.test(h);if(!asst&&!aip)return;
 if(asst){[...sc.querySelectorAll('.alert')].filter(x=>/Model: |Tryb offline|Model językowy przez pośrednika/.test(x.textContent)).forEach(x=>x.style.display='none');['v14p','v17w'].forEach(id=>{const e=document.getElementById(id);if(e)e.style.display='none'});[...sc.querySelectorAll('p.muted')].filter(x=>/^Silnik:/.test(x.textContent)).forEach(x=>x.style.display='none')}
 const old=document.getElementById('v18s');const html=card();if(old){if(old.outerHTML!=html)old.outerHTML=html}else sc.insertAdjacentHTML('afterbegin',html)}
// Jednorazowe ostrzeżenie przed pierwszą rozmową z modelem zdalnym
const _call=aiCall;aiCall=async function(task,p){const s=aiStatus();if(s.remote&&!V.remoteOk){const ok=await new Promise(res=>{const m=modal(`<h3>🌐 Ta rozmowa opuści urządzenie</h3><p>Odpowiada <b>${esc(s.name)}</b> – pytanie i kilka ostatnich wypowiedzi trafią ${esc(s.where.replace(/^poza urządzeniem: /,'do: '))}.</p><p>Maskujemy PESEL, NIP, rachunki, telefony, e-maile i część adresów, ale <b>maskowanie nie usuwa wszystkich nazwisk ani szczegółów sprawy</b>, które mogą Cię zidentyfikować. Nie wpisuj danych o zdrowiu ani prawdziwych spraw sądowych.</p><button class="btn" id="r1">Rozumiem, kontynuuj</button><button class="btn ghost" id="r2">Odpowiadaj bez modelu</button>`);m.querySelector('#r1').onclick=()=>{V.remoteOk=true;save();closeModal();res(true)};m.querySelector('#r2').onclick=()=>{closeModal();res(false)}});if(!ok){window.v14Last={k:'rules',fb:false};throw new Error('bez zgody na model zdalny')}}return _call(task,p)};window.aiCall=aiCall;
window.addEventListener('v15',()=>{putStatus();if(A.state=='slow'&&!document.getElementById('v18slow')){document.body.insertAdjacentHTML('beforeend',`<div id="v18slow" class="v18toast">🦅 <b>Bielik pobrany, ale ten komputer nie obsługuje go wystarczająco szybko – odpowiada Gemma.</b> <button class="btn ghost small" onclick="this.parentElement.remove()">OK</button></div>`)}});
// ---------- 4. Pewność dopasowania intencji ----------
const ACTMAP={'#/explain':'#/sprawa/pismo','#/report':'#/sprawa/zdarzenie',policja:'#/sprawa/zdarzenie',straz:'#/sprawa/zdarzenie'};
const optOf=h=>{const t=h[1];const href=t.startsWith('#')?t:'#/flow/'+t;const a=ALL.find(x=>x[2]==href||x[2]==t);return a?[a[0],a[1],a[2]]:['🔎',String(h[2]).replace(/<[^>]+>/g,'').slice(0,48)+'…',href]};
window.v18Route=function(q){const low=String(q).toLowerCase().trim(),l=norm(q);
 const info=/^(czy (ty )?(znasz|wiesz|słyszał\w*|kojarzysz)|co to (jest|są|za)|czym (jest|są)|co wiesz o|jak działa|co oznacza|co znaczy|opowiedz)/.test(low.replace(/^[^a-ząćęłńóśźż]+/,''));
 const lost=/zgubi|ukrad|zginal|zginel|portfel/.test(l)&&!/legitym/.test(l),doc=/portfel|dokument|dowod|paszport|prawo jazdy|kart|torebk|plecak/.test(l);
 if(lost&&doc&&!info)return{kind:'scen',id:'wallet'};
 if(/\boc\b|polis|ubezpiecz/.test(l)&&/(odnow|kupi|kon[cć]z|koncz|sprawdz|oc)/.test(l)&&!info)return{kind:'scen',id:'oc'};
 const hits=INT.filter(([re])=>re.test(low));const uniq=[];hits.forEach(h=>{if(!uniq.some(u=>u[1]==h[1]))uniq.push(h)});
 if(!uniq.length)return lost?{kind:'choice',opts:[['👛','Zgubiłem dokumenty lub portfel','#/flow/wallet'],['📣','Zgłoś zdarzenie (np. kradzież)','#/sprawa/zdarzenie']]}:{kind:'none'};
 const verb=/\b(dostałe?m|dostałam|chcę|chce|potrzebuj\w*|muszę|zgłoś|zgłaszam|miałe?m|miałam|przeprowadzam|kończy|wyjaśnij|złóż|zapłać|odnów|sprawdź|zmień|zarejestruj|wymelduj|zamelduj)/i.test(low);
 if(info||lost||(uniq.length>1&&!verb)){const opts=uniq.slice(0,3).map(optOf);try{fuzzy(q).forEach(a=>{if(opts.length<3&&!opts.some(o=>o[2]==a[2]))opts.push(a)})}catch(e){}return{kind:'choice',opts:opts.slice(0,3),info}}
 return{kind:'act',hit:uniq[0],act:ACTMAP[uniq[0][1]]||uniq[0][1]}};
const _ask=ask;ask=async function(q){q=(q||'').trim();if(!q)return;const r=v18Route(q);
 if(r.kind=='none'||r.kind=='scen')return _ask(q);
 if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});
 if(r.kind=='choice'){const t=r.info?'To pytanie o informację – nie uruchamiam żadnej sprawy.':'Nie mam pewności, o którą sprawę chodzi.';
  if(window.aiOn&&aiOn()){drawChat();window.v18NoAct=true;return aiAssist(q,null,r.opts)}
  chat.push({r:'a',t:t+(r.opts.length?' Może chodzi o jedną z tych spraw:':' Opisz to inaczej albo otwórz <a href="#/guide">przewodnik</a>.'),cards:r.opts.length?r.opts:null});drawChat();return}
 chat.push({r:'a',t:r.hit[2]+'<br><b>Czy chcesz kontynuować?</b>',act:r.act});drawChat();try{speak(String(r.hit[2]).replace(/<[^>]+>/g,''))}catch(e){}};window.ask=ask;
const _dc=drawChat;drawChat=function(){try{const m=chat[chat.length-1];if(window.v18NoAct&&m&&m.r=='a'&&!/Myślę/.test(m.t)){window.v18NoAct=false;if(m.act){const a=ALL.find(x=>x[2]==m.act);m.cards=(m.cards||[]).concat([a||['🔎','Otwórz proponowaną sprawę',m.act]]);m.act=null}}}catch(e){}return _dc.apply(this,arguments)};window.drawChat=drawChat;
// ---------- 4b. Jedna ścieżka dla trzech głównych spraw ----------
const STEPS={pismo:['Wklej lub sfotografuj pismo','Wyjaśnienie: czego chcą i do kiedy','Szkic odpowiedzi','Podsumowanie i podpis (DEMO)'],zdarzenie:['Co się stało (ranni? → 112)','Zdjęcie lub nagranie (skrót SHA-256)','Miejsce i opis','Podsumowanie i podpis (DEMO)'],lek:['Wybierz lek','Prośba o e-receptę do lekarza','Podsumowanie i podpis (DEMO)','Kod e-recepty i apteki w pobliżu']};
const _route=route;route=function(){const h=location.hash.replace(/^#\//,'');const m=h.match(/^sprawa\/(pismo|zdarzenie|lek)$/);
 if(m){if(m[1]=='lek'){location.replace('#/recepty');return}location.replace('#/assistant');setTimeout(()=>{try{chat.push({r:'a',t:'<b>'+(m[1]=='pismo'?'📩 Dostałem pismo':'📣 Zgłaszam zdarzenie')+'</b> – 4 kroki: '+STEPS[m[1]].map((s,i)=>(i+1)+'. '+s).join(' → ')});m[1]=='pismo'?pStart():zStart()}catch(e){}},250);return}
 try{fixCases()}catch(e){}return _route.apply(this,arguments)};window.route=route;onhashchange=route;
function pathBanner(){const h=location.hash;const sc=app.querySelector('.scroll');if(!sc||sc.querySelector('#v18p'))return;
 const k=/^#\/(explain|appeal|letter)/.test(h)?'pismo':/^#\/(report|flow\/(policja|straz|zdarzenie))/.test(h)?'zdarzenie':/^#\/recepty/.test(h)?'lek':null;if(!k)return;
 sc.insertAdjacentHTML('afterbegin',`<div id="v18p" class="v18path"><b>${k=='pismo'?'📩 Dostałem pismo':k=='zdarzenie'?'📣 Zgłaszam zdarzenie':'💊 Kończy mi się lek'} – jedna ścieżka, 4 kroki:</b><ol>${STEPS[k].map(s=>`<li>${s}</li>`).join('')}</ol>${k!='lek'?`<a class="btn small" href="#/sprawa/${k}">▶ Zacznij krok po kroku</a>`:''}<span class="muted"> Nic nie zostanie wysłane – to symulacja (DEMO).</span></div>`)}
// ---------- 5. Osobne dane każdej osoby ----------
const PK=['v3.letters','v3.sosLog','v3.comments','v3.paid','v3.follow','v5.apps','v5.dekl','v6.kom','v6.pelnom','v6.zasw','v6.miejsce','v6.koresp','v6.epu','v6.refSig','v6.sprz','v9.firma','v9.watch','v11.log','v13.share','v13.frz','v13.umowy','signed','votes'];
const gp=p=>p.split('.').reduce((o,k)=>o==null?undefined:o[k],S);
const sp=(p,v)=>{const ks=p.split('.');let o=S;for(let i=0;i<ks.length-1;i++){o[ks[i]]=o[ks[i]]||{};o=o[ks[i]]}o[ks[ks.length-1]]=v};
const empty=(p,v)=>p=='v13.umowy'?{blok:true,dec:{}}:Array.isArray(v)?[]:v&&typeof v=='object'?{}:typeof v=='boolean'?false:typeof v=='number'?0:typeof v=='string'?'':null;
const CH0=chat.length?[JSON.parse(JSON.stringify(chat[0]))]:[];
const _ap=applyPersona;applyPersona=function(k,boot){const o=S.persona;if(!boot&&k!=o){V.pp[o]={d:Object.fromEntries(PK.map(p=>[p,JSON.parse(JSON.stringify(gp(p)===undefined?null:gp(p)))])),chat:JSON.parse(JSON.stringify(chat))};
  const n=V.pp[k];PK.forEach(p=>{const cur=gp(p);if(cur===undefined&&!(n&&p in n.d))return;const val=n&&p in n.d?n.d[p]:empty(p,cur);
   const tgt=gp(p);if(tgt&&typeof tgt=='object'&&!Array.isArray(tgt)&&val&&typeof val=='object'&&!Array.isArray(val)){Object.keys(tgt).forEach(x=>delete tgt[x]);Object.assign(tgt,val)}else if(Array.isArray(tgt)&&Array.isArray(val)){tgt.length=0;tgt.push(...val)}else sp(p,val)});
  chat.length=0;chat.push(...(n?n.chat:JSON.parse(JSON.stringify(CH0))));try{if(window.CH)CH.flow=null}catch(e){}window.v14Last=null}
 return _ap.apply(this,arguments)};window.applyPersona=applyPersona;
// ---------- wstrzyknięcia ----------
function inject(){try{putStatus()}catch(e){}try{pathBanner()}catch(e){}const h=location.hash;const sc=app.querySelector('.scroll');
 if(sc&&/^#\/(c112|sos)/.test(h)&&!sc.querySelector('#v18sos'))sc.insertAdjacentHTML('afterbegin',SOSB);
 try{tagButtons(app)}catch(e){}}
new MutationObserver(inject).observe(app,{childList:true,subtree:true});inject();setInterval(()=>{if(document.getElementById('v18s'))putStatus()},2000);
// link w menu bocznym do jednej ścieżki pisma
document.querySelectorAll('.side a[href="#/explain"]').forEach(a=>{if(/Dostałem pismo/.test(a.textContent))a.setAttribute('href','#/sprawa/pismo')});
const st=document.createElement('style');st.textContent=`.v18demo{display:inline-block;margin-left:6px;padding:1px 6px;border-radius:6px;background:#fff3c4;color:#7a5b00;font:700 10px/1.4 system-ui;letter-spacing:.5px;vertical-align:middle;border:1px solid #f0d77a}.v18sos{background:#b3261e;color:#fff;border-radius:14px;padding:12px 14px;margin:0 0 12px;font-size:.95em;line-height:1.4}.v18sos .v18call{display:block;margin-top:10px;text-align:center;background:#fff;color:#b3261e;font-weight:800;font-size:1.25em;border-radius:12px;padding:10px;text-decoration:none}.v18s{border:1px solid #cdd9f5;background:#f5f8ff;border-radius:14px;padding:8px 12px;margin:0 0 10px;font-size:.82em;line-height:1.45}.v18s.loc{background:#eefaf1;border-color:#bfe5ca}.v18r{display:flex;justify-content:space-between;gap:8px;margin:2px 0}.v18r a{white-space:nowrap}.v18path{background:#f6f8fb;border:1px solid #e1e6ef;border-radius:14px;padding:10px 12px;margin:0 0 12px;font-size:.88em}.v18path ol{margin:6px 0 8px 18px;padding:0}.v18toast{position:fixed;left:50%;transform:translateX(-50%);bottom:60px;z-index:10002;background:#fff6e5;border:1px solid #f3d9a4;border-radius:14px;padding:10px 14px;box-shadow:0 8px 24px rgba(0,0,0,.15);font:14px system-ui;max-width:min(520px,92vw)}`;document.head.appendChild(st);
})();
