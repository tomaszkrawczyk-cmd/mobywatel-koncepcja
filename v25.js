// ===== v25: „Gdzie trafia moje pytanie?” + „Pismo krótko i konkretnie” =====
// Autor koncepcji: Tomasz Krawczyk. Symulacje oznaczone DEMO. Nic nie jest wysyłane do urzędu.
//
// Łańcuch Gemma (pośrednik) → reguły w telefonie → Bielik w przeglądarce zostaje bez zmian.
// Pobieranie Bielika też: v15 (kiedy startuje, próg 4 s, ?bielik=0/1) i v24 (WebGPU, „Użyj Bielika mimo wszystko”, limit 90 s).
// Ta warstwa nie woła v15Start, nie zmienia S.v15 ani flagi v24 i nie edytuje worker.js.
//
// Haki — tylko owinięcie funkcji, nic nie jest wyłączone:
//   aiAssist, llm — lokalne sprawdzenie pytania ZANIM tekst pójdzie do Gemmy (przed redact z v10/v17)
//   aiCall — to samo, gdy tekst idzie inną drogą (np. „Skróć z asystentem”); pomija, jeśli warstwa wyżej już zapytała
//   drawChat — plakietka, kto odpowiedział
//   ask, v18Route — reguły „gdzie trafia moje pytanie” / „czy AI widzi mój PESEL” / „pismo krótko” przed modelem
//   genPismo, sendPismo — karta sprawdzenia i streszczenie; właściwa wysyłka DEMO to wciąż sendPismo z v3
(function(){
const DEMO='<span class="demo">DEMO</span>';
const TARGET=2200, LO=1400, HI=2800, SCALE=3500;
const DEADLINE={odwolanie:1,zazalenie:1,skarga:1,sprzeciw:1,apelacja:1,bezczynnosc:1};
const FILLER=[
 /w zwi[aą]zku z powy[zż]szym/i,/maj[aą]c na uwadze powy[zż]sze/i,/niniejszym uprzejmie/i,
 /pragn[eę] zwr[oó]ci[cć] uwag/i,/co do zasady/i,/w przedmiotowej sprawie/i,
 /wyra[zż]am (głębok|nadziej)/i,/z ca[lł][aą] pewno[sś]ci[aą]/i,/nie ulega w[aą]tpliwo[sś]ci/i,
 /nale[zż]y podkre[sś]li[cć]/i,/uprzejmie prosz[eę] o pozytywne/i,/z g[oó]ry dzi[eę]kuj/i,
 /w trosce o dobro/i,/jak powszechnie wiadomo/i,/w [sś]wietle powy[zż]szego/i,
 /bior[aą]c pod uwag[eę] powy[zż]sze/i,/w zaistnia[lł]ej sytuacji/i,/pragn[eę] zaznaczy[cć]/i
];

// ---------- sumy kontrolne (tylko na urządzeniu) ----------
function peselOk(d){if(!/^\d{11}$/.test(d))return false;const w=[1,3,7,9,1,3,7,9,1,3];let s=0;for(let i=0;i<10;i++)s+=+d[i]*w[i];return (10-(s%10))%10===+d[10]}
function peselDate(d){const m=+d.slice(2,4)%20,day=+d.slice(4,6);return m>=1&&m<=12&&day>=1&&day<=31}
function idOk(s){if(!/^[A-Z]{3}\d{6}$/.test(s))return false;const w=[7,3,1,9,7,3,1,7,3];let sum=0;for(let i=0;i<9;i++){const c=s[i];sum+=(c>='A'&&c<='Z'?c.charCodeAt(0)-55:+c)*w[i]}return sum%10===0}
function passOk(s){if(!/^[A-Z]{2}\d{7}$/.test(s))return false;const w=[7,3,9,1,7,3,1,7,3];let sum=0;for(let i=0;i<9;i++){const c=s[i];sum+=(c>='A'&&c<='Z'?c.charCodeAt(0)-55:+c)*w[i]}return sum%10===0}
function ibanOk(s){const t=String(s||'').replace(/\s/g,'').toUpperCase();const b=/^\d{26}$/.test(t)?'PL'+t:t;if(!/^PL\d{26}$/.test(b))return false;const n=(b.slice(4)+b.slice(0,4)).replace(/[A-Z]/g,c=>String(c.charCodeAt(0)-55));let m=0;for(const ch of n)m=(m*10+ +ch)%97;return m===1}
(function selftest(){if(!peselOk('44051401359')||peselOk('90010112345')||!idOk('ABS123456')||!passOk('EH0123456')||!ibanOk('PL61109010140000071219812874'))console.error('v25: błąd sumy kontrolnej w detektorze')})();

function scan(text){
 const s=String(text||'');const hits=[];const spans=[];
 const free=(a,b)=>!spans.some(([x,y])=>a<y&&b>x);
 const add=(a,b,hit)=>{if(a<0||b<=a||!free(a,b))return;spans.push([a,b]);hits.push(Object.assign({a,b,raw:s.slice(a,b)},hit))};
 const all=(re,fn)=>{const r=new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g');let m;while((m=r.exec(s))){fn(m);if(m.index===r.lastIndex)r.lastIndex++}};
 all(/\bPL\s?(?:\d[\s]?){26}/gi,m=>{const compact=m[0].replace(/\s/g,'').toUpperCase();if(!/^PL\d{26}$/.test(compact))return;add(m.index,m.index+m[0].replace(/\s+$/,'').length,{type:'iban',label:'Rachunek (IBAN)',note:ibanOk(compact)?'cyfra kontrolna IBAN się zgadza':'wygląda jak IBAN, cyfra kontrolna się nie zgadza',ph:'[RACHUNEK]'})});
 all(/\b\d{2}(?:\s\d{4}){6}\b/g,m=>{add(m.index,m.index+m[0].length,{type:'iban',label:'Numer rachunku',note:ibanOk(m[0])?'cyfra kontrolna rachunku się zgadza':'26 cyfr w układzie rachunku',ph:'[RACHUNEK]'})});
 all(/\b\d{11}\b/g,m=>{const ok=peselOk(m[0]);if(!ok&&!peselDate(m[0]))return;add(m.index,m.index+11,{type:'pesel',label:'PESEL',note:ok?'cyfra kontrolna się zgadza — to wygląda na PESEL':'11 cyfr jak PESEL, ale cyfra kontrolna się nie zgadza',ph:'[PESEL]'})});
 all(/(?<!\d)(?:\+48[\s-]?)?(?:\d{3}[\s-]?\d{3}[\s-]?\d{3})(?!\d)/g,m=>{const digits=m[0].replace(/\D/g,'');const n=digits.length===11&&digits.startsWith('48')?digits.slice(2):digits;if(n.length!==9)return;add(m.index,m.index+m[0].length,{type:'phone',label:'Telefon',note:'numer telefonu',ph:'[TELEFON]'})});
 all(/[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/gi,m=>add(m.index,m.index+m[0].length,{type:'email',label:'E-mail',note:'adres e-mail',ph:'[E-MAIL]'}));
 all(/\b[A-Z]{3}\s?\d{6}\b/g,m=>{const c=m[0].replace(/\s/g,'');add(m.index,m.index+m[0].length,{type:'id',label:'Dowód osobisty',note:idOk(c)?'cyfra kontrolna numeru dowodu się zgadza (4. znak)':'wygląda jak seria i numer dowodu, cyfra kontrolna się nie zgadza',ph:'[DOWÓD]'})});
 all(/\b[A-Z]{2}\s?\d{7}\b/g,m=>{const c=m[0].replace(/\s/g,'');add(m.index,m.index+m[0].length,{type:'passport',label:'Paszport',note:passOk(c)?'cyfra kontrolna numeru paszportu się zgadza (3. znak)':'wygląda jak numer paszportu, cyfra kontrolna się nie zgadza',ph:'[PASZPORT]'})});
 all(/\b(?:ul\.?|ulica|al\.?|aleja|aleje|os\.?|osiedle|pl\.?|plac)\s+[A-Za-zÀ-žĄĆĘŁŃÓŚŹŻąćęłńóśźż][A-Za-zÀ-žĄĆĘŁŃÓŚŹŻąćęłńóśźż.\- ]{0,40}?\d+[A-Za-z]?(?:\s*\/\s*\d+)?/g,m=>add(m.index,m.index+m[0].length,{type:'addr',label:'Adres',note:'ulica i numer',ph:'[ADRES]'}));
 return hits;
}
function maskText(text){const hits=scan(text).sort((a,b)=>b.a-a.a);let s=String(text||'');hits.forEach(h=>{s=s.slice(0,h.a)+h.ph+s.slice(h.b)});return s}
function uniqHits(hits){const seen=new Set();return hits.filter(h=>{const k=h.type+'|'+h.raw;if(seen.has(k))return false;seen.add(k);return true})}
window.v25Scan=scan;window.v25Mask=maskText;

// ---------- czy następne wywołanie może wyjść do Gemmy ----------
function leavesDevice(){
 let localFirst=false,remote=true;
 try{if(window.v24Route&&window.v24Route()==='bielik')localFirst=true}catch(e){}
 try{if(window.aiStatus){const s=aiStatus();remote=!!(s&&s.remote);if(!localFirst&&s&&!s.remote)localFirst=true}}catch(e){}
 const gemma=!!(S.v10&&S.v10.mode==='proxy'&&/^https:/.test(S.v10.proxy||''));
 if(localFirst&&gemma)return 'maybe';
 if(localFirst&&!gemma)return false;
 if(!remote&&!gemma)return false;
 return true;
}
let gateChain=Promise.resolve();
function askChoice(hits,preview,mode){
 const run=()=>new Promise(res=>{
  const list=uniqHits(hits).slice(0,8);
  const rows=list.map(h=>`<li><b>${esc(h.label)}</b> — ${esc(h.note)}<br><code>${esc(h.raw)}</code> → <b>${esc(h.ph)}</b></li>`).join('');
  const maybe=mode==='maybe'?`<p>Najpierw odpowie <b>Bielik na tym urządzeniu</b>. Jeśli nie zdąży, ten sam tekst może pójść do Gemmy. Kolejność się nie zmienia.</p>`:'';
  const m=modal(`<h3>Zanim pytanie wyjdzie z telefonu</h3>
   <p>Na tym urządzeniu widać w tekście dane, które mogą Cię wskazać. ${DEMO} Nic nie idzie do urzędu.</p>
   ${maybe}
   <ul class="v25hits">${rows}</ul>
   <p><b>Zamaskuj i wyślij</b> zamieni je na nawiasy, np. [PESEL], i dopiero ten tekst pójdzie dalej.</p>
   <p class="muted"><b>Wyślij bez zmian</b> nie robi tej podmiany. Starszy filtr prototypu (warstwy v10 i v17) i tak, jeszcze w przeglądarce, zamienia PESEL, NIP, rachunek, telefon, e-mail, kod pocztowy i część adresu, zanim tekst dotrze do pośrednika. Nie rusza numeru dowodu ani paszportu — te przy „bez zmian” mogą wyjść z telefonu. Nie usuwa każdego nazwiska.</p>
   <div class="v25actions"><button type="button" class="btn" id="v25m">Zamaskuj i wyślij</button><button type="button" class="btn sec" id="v25r">Wyślij bez zmian</button><button type="button" class="btn ghost" id="v25x">Anuluj — zostań na urządzeniu</button></div>`);
  const done=v=>{try{closeModal()}catch(e){}res(v)};
  m.querySelector('#v25m').onclick=()=>done('mask');
  m.querySelector('#v25r').onclick=()=>done('raw');
  m.querySelector('#v25x').onclick=()=>done('stop');
  m.onclick=e=>{if(e.target===m)done('stop')};
 });
 const p=gateChain.then(run,run);gateChain=p.then(()=>{},()=>{});return p;
}
function maskPayload(p){if(!p||typeof p!=='object')return p;const o=Object.assign({},p);['pytanie','tekst'].forEach(k=>{if(typeof o[k]==='string')o[k]=maskText(o[k])});if(Array.isArray(o.historia))o.historia=o.historia.map(h=>Object.assign({},h,{t:maskText((h&&h.t)||'')}));return o}
async function gatePayload(p,task){
 if(task==='ping'||window.v25SkipGate)return p;
 const chunks=[];if(p&&typeof p.pytanie==='string')chunks.push(p.pytanie);if(p&&typeof p.tekst==='string')chunks.push(p.tekst);if(p&&Array.isArray(p.historia))p.historia.forEach(h=>chunks.push((h&&h.t)||''));
 const hits=scan(chunks.join('\n'));if(!hits.length)return p;
 const mode=leavesDevice();if(!mode)return p;
 const choice=await askChoice(hits,chunks.join('\n'),mode);
 window.v25LastMask=choice;
 if(choice==='stop'){const err=new Error('v25: zostaje na urządzeniu');err.v25stop=true;throw err}
 if(choice==='mask')return maskPayload(p);
 return p;
}
const _aiAssist=aiAssist;
aiAssist=async function(q,hit,cards){
 const hits=scan(q);const mode=hits.length?leavesDevice():false;
 if(hits.length&&mode){const choice=await askChoice(hits,q,mode);window.v25LastMask=choice;
  if(choice==='stop'){try{window.v18NoAct=false}catch(e){}chat.push({r:'a',v25k:'rules',v25mask:'stop',t:'Nie wysłałam tego pytania dalej. Zostało na tym urządzeniu. Możesz napisać je jeszcze raz i wybrać „Zamaskuj i wyślij”, albo usunąć numery i adres. '+DEMO});drawChat();return}
  if(choice==='mask')q=maskText(q)}
 window.v25SkipGate=true;try{return await _aiAssist.apply(this,[q,hit,cards])}finally{window.v25SkipGate=false}};
window.aiAssist=aiAssist;
const _llm=llm;
llm=async function(sys,user){
 const hits=scan(user);const mode=hits.length?leavesDevice():false;
 if(hits.length&&mode){const choice=await askChoice(hits,String(user||''),mode);window.v25LastMask=choice;
  if(choice==='stop'){const err=new Error('v25: zostaje na urządzeniu');err.v25stop=true;throw err}
  if(choice==='mask')user=maskText(user)}
 window.v25SkipGate=true;try{return await _llm.call(this,sys,user)}finally{window.v25SkipGate=false}};
window.llm=llm;
const _call=aiCall;
aiCall=async function(task,p){const payload=await gatePayload(p,task);return _call.call(this,task,payload)};
window.aiCall=aiCall;

// ---------- plakietka przy odpowiedzi ----------
function badgeMeta(k){
 if(k==='local')return {cls:'stay',short:'Bielik · zostało w telefonie',why:'local'};
 if(k==='rules')return {cls:'stay',short:'Reguły · zostało w telefonie',why:'rules'};
 if(k==='bielik')return {cls:'left',short:'Bielik 11B · wyszło z telefonu',why:'remote'};
 if(k==='pllum')return {cls:'left',short:'PLLuM · wyszło z telefonu',why:'remote'};
 if(k==='own')return {cls:'left',short:'Własny model · wyszło z telefonu',why:'remote'};
 return {cls:'left',short:'Gemma · wyszło z telefonu',why:'gemma'};
}
function proxyHost(){try{const u=(S.v10&&S.v10.proxy)||'';return u?new URL(u).host:'adres pośrednika nie jest ustawiony'}catch(e){return 'pośrednik'}}
function whyHtml(kind,mask){
 const host=esc(proxyHost());
 const common=`<p class="muted">Pobieranie Bielika jest bez zmian (warstwy v15 i v24, w tym WebGPU i „Użyj Bielika mimo wszystko”). Ta warstwa go nie uruchamia.</p><p>${DEMO} Nic z tego nie idzie do urzędu.</p><a class="btn sec" href="#/gdzie-trafia">Cały opis</a><button type="button" class="btn ghost" onclick="closeModal()">Zamknij</button>`;
 const maskNote=mask==='mask'?'<p>Przy tym pytaniu wybrano <b>Zamaskuj i wyślij</b>.</p>':mask==='raw'?'<p>Przy tym pytaniu wybrano <b>Wyślij bez zmian</b>. Starszy filtr v10/v17 i tak podmienia PESEL, NIP, rachunek, telefon, e-mail i część adresu. Numer dowodu i paszportu ten filtr pomija.</p>':mask==='stop'?'<p>To pytanie <b>nie zostało wysłane</b>.</p>':'';
 if(kind==='rules')return `<h3>Odpowiedziały reguły</h3><p>Tekst <b>został w telefonie</b>. To gotowa odpowiedź z kodu tej strony, nie model językowy. Pytanie nie poszło do pośrednika ani do Bielika.</p>${maskNote}${common}`;
 if(kind==='local')return `<h3>Odpowiedział Bielik</h3><p>Tekst <b>został w telefonie</b>. Polski model liczy odpowiedź w przeglądarce. Pytanie nie poszło do pośrednika.</p><p class="muted">Sam plik modelu (ok. 1,1 GB) pobiera się osobno z internetu — to wagi modelu, nie Twoje pytanie. Kiedy się pobiera, ustala warstwa v15 i v24.</p>${maskNote}${common}`;
 if(kind==='remote')return `<h3>Odpowiedział model poza telefonem</h3><p>Tekst <b>wyszedł z telefonu</b> — do Hugging Face, do Twojego serwera albo do modelu podłączonego kluczem (ustawienie zaawansowane, nie domyślna Gemma).</p>${maskNote}${common}`;
 return `<h3>Odpowiedziała Gemma</h3><p>Tekst <b>wyszedł z telefonu</b>. Poszedł do pośrednika <b>${host}</b> (Cloudflare Worker), a stamtąd do modelu. W kodzie tej strony ta droga nazywa się Gemma. Czy uruchomiony Worker naprawdę woła Gemmę, zależy od jego sekretów — tego z przeglądarki nie widać <b>(niezweryfikowane)</b>.</p>
  <p>Pośrednik dostaje treść pytania (przyciętą), kilka ostatnich zdań rozmowy, wiek i miasto wybranej osoby oraz listę funkcji aplikacji. Nie dostaje dokumentów z portfela.</p>${maskNote}${common}`;
}
window.v25Why=function(btn){const k=btn&&btn.dataset?btn.dataset.k:'gemma';const mask=btn&&btn.dataset?btn.dataset.mask:'';modal(whyHtml(badgeMeta(k).why,mask))};
const _draw=drawChat;
drawChat=function(){try{
 const m=chat[chat.length-1];
 if(m&&m.r==='a'&&!m.v25&&!/Myślę|przełączył się/.test(m.t)){
  const prevUser=chat.slice(0,-1).some(x=>x.r==='u');
  const aiText=/odpowiedź AI|bez AI|· AI, sprawdź/.test(m.t);
  if(prevUser||m.v25k||aiText){
   let k=m.v25k;
   if(!k)k=(/odpowiedź AI|bez AI|· AI, sprawdź/.test(m.t)&&window.v14Last&&window.v14Last.k)?window.v14Last.k:'rules';
   if(!m.v25mask&&window.v25LastMask&&k!=='rules'){m.v25mask=window.v25LastMask;window.v25LastMask=null}
   if(k==='rules'&&window.v25LastMask==='stop'){m.v25mask='stop';window.v25LastMask=null}
   m.v25k=k;m.v25=1;
   const b=badgeMeta(k);
   m.t+=` <button type="button" class="v25b ${b.cls}" data-k="${esc(k)}" data-mask="${esc(m.v25mask||'')}" onclick="v25Why(this)">${b.short}</button>`;
  }
 }
}catch(e){console.warn('v25',e)}return _draw.apply(this,arguments)};
window.drawChat=drawChat;

// ---------- reguły asystenta (przed Gemmą) ----------
const WHERE_ANS='Pytanie idzie w stałej kolejności. Najpierw Gemma przez pośrednika w internecie — wtedy tekst wychodzi z telefonu. Gdy Gemma nie odpowie, odpowiadają reguły zapisane w tej stronie — zostają w telefonie. Gdy żadna reguła nie pasuje i Bielik jest już pobrany, liczy Bielik w przeglądarce — też zostaje w telefonie. Przy odpowiedzi jest plakietka, kto ją dał. Jeśli wpiszesz PESEL, dowód, paszport, rachunek, telefon, e-mail albo adres, zapytam, czy zamaskować, zanim tekst pójdzie do Gemmy. Ta odpowiedź jest z reguł w telefonie, bez AI. '+DEMO;
const PESEL_ANS='Sam z siebie asystent nie dostaje PESEL-u z portfela. Jeśli wpiszesz go w pytaniu, na tym telefonie sprawdzę cyfrę kontrolną i zapytam, czy zamienić go na [PESEL], zanim tekst pójdzie do Gemmy. Starszy filtr i tak zamienia 11 cyfr na [PESEL] w drodze do pośrednika. Reguły i Bielik w przeglądarce nie wysyłają pytania. Czy dostawca modelu zapisuje treść u siebie, nie wynika z kodu tego prototypu. Ta odpowiedź jest z reguł w telefonie, bez AI. '+DEMO;
const LETTER_ANS='Zanim wyślesz pismo (to i tak tylko symulacja), pokażę długość, brakujące elementy i rzeczy, których nie wpisano w formularzu: puste miejsca, numery przepisów i puste zwroty. Na górze wstawię dwa–trzy zdania dla urzędnika. Przycisk „Skróć” działa w telefonie, bez nowego serwisu. Otworzę kreator. '+DEMO;
function v25Rule(q){
 let l='';try{l=norm(q)}catch(e){l=String(q||'').toLowerCase()}
 if(!l)return null;
 if((/czy (ai|asystent|gemma|bielik|model) widzi/.test(l)&&/pesel/.test(l))||(/pesel/.test(l)&&/(wychodzi|trafia do|do gemmy|do modelu|widzi)/.test(l)&&/(ai|asystent|gemma|pytanie|model)/.test(l)))return ['#/gdzie-trafia',PESEL_ANS];
 if(/gdzie trafia (moje |to )?pytanie|gdzie (idzie|wychodzi) (moje )?pytanie|kto widzi moje pytanie|dokad (trafia|idzie) (moje )?pytanie|gdzie trafia moje pytanie/.test(l))return ['#/gdzie-trafia',WHERE_ANS];
 if(/pismo krotko|krotko i konkretnie|skroc (moje )?pismo|sprawdz (moje )?pismo|streszczenie dla urzednika|pismo (za dlugie|za dlug)/.test(l))return ['#/appeal',LETTER_ANS];
 return null;
}
window.v25Rule=v25Rule;
const _ask=ask;
ask=async function(q){const hit=v25Rule(q);if(!hit)return _ask.apply(this,arguments);
 q=(q||'').trim();if(!q)return;if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});
 window.v14Last={k:'rules',fb:false,shown:1};
 chat.push({r:'a',v25k:'rules',t:hit[1]+'<br><b>Czy chcesz kontynuować?</b>',act:hit[0]});
 drawChat();try{speak(String(hit[1]).replace(/<[^>]+>/g,''))}catch(e){}};
window.ask=ask;
if(window.v18Route){const _v=window.v18Route;window.v18Route=function(q){const hit=v25Rule(q);if(hit)return {kind:'act',hit:[null,hit[0],hit[1]],act:hit[0]};return _v(q)}}
try{
 INT.unshift([/gdzie trafia moje pytanie|czy AI widzi mój PESEL/i,'#/gdzie-trafia','Powiem, gdzie idzie pytanie i czy PESEL wychodzi z telefonu. To reguła w telefonie, bez AI.'],[/pismo krótko|skróć pismo|streszczenie dla urzędnika/i,'#/appeal','Pokażę sprawdzenie pisma przed wysyłką DEMO. To reguła w telefonie, bez AI.']);
 ALL.push(['🔒','Gdzie trafia moje pytanie','#/gdzie-trafia','prywatność AI gemma bielik pesel maskowanie gdzie idzie pytanie'],['✂️','Pismo krótko i konkretnie','#/pismo-krotko','pismo skróć streszczenie urząd długość kreator']);
}catch(e){}

// ---------- panel: co jest prawdą w kodzie ----------
function factsHtml(short){
 const host=esc(proxyHost());
 const s=window.aiStatus?aiStatus():null;
 const now=s?esc(s.name)+' — '+esc(s.where):'status asystenta niedostępny';
 return `<div id="v25priv" class="card v25card"><span class="demo">DEMO</span><h3>Gdzie trafia moje pytanie?</h3>
  <p>Zamiast wyłączać asystenta, widać drogę tekstu. Teraz: <b>${now}</b>.</p>
  <ul class="v25ul">
   <li><b>Gemma</b> — tekst wychodzi z telefonu do pośrednika <b>${host}</b>. W kodzie Workera w tym repozytorium pytanie idzie dalej do modelu (Workers AI, Claude albo inny adres — zależnie od sekretów). Który model działa na wdrożonym adresie, <b>nie zweryfikowano</b> z tej strony.</li>
   <li><b>Reguły i Bielik w przeglądarce</b> — tekst zostaje na urządzeniu. Pobranie pliku Bielika to osobna rzecz i ta warstwa go nie zmienia.</li>
   <li><b>Co dostaje pośrednik</b> (tak jest w <code>worker/worker.js</code> i w wywołaniu czatu): treść pytania obcięta do 600 znaków, do 6 poprzednich wypowiedzi, wiek i miasto osoby z przełącznika rodziny, lista spraw do wyboru. Nie idą dokumenty z portfela. Inne zadania (np. skrót pisma) wysyłają pole „tekst”, obcięte do 3000 znaków.</li>
   <li><b>Co jest zapisane.</b> Ta strona nie ma własnej bazy rozmów (GitHub Pages podaje tylko pliki). Rozmowa jest w pamięci strony, a po zmianie osoby w rodzinie kopia trafia do localStorage tej przeglądarki (klucz <code>mob3</code>) — zostaje na urządzeniu. W kodzie Workera nie ma zapisu treści pytania do bazy; jest licznik limitu w pamięci izolatu (albo usługa limitów Cloudflare, jeśli jest włączona na wdrożeniu — <b>niezweryfikowane</b>). Czy dostawca modelu loguje treść, <b>nie wynika z tego kodu</b>.</li>
  </ul>
  ${short?'<a class="btn sec" href="#/gdzie-trafia">Cały opis prostym językiem</a>':`<p class="muted">Inspiracja: zamiast odcinać urzędników od ChatGPT i Claude, pokazać obywatelowi drogę danych. <a href="https://x.com/kurasinski/status/2114670549146202392" target="_blank" rel="noopener">Wpis o blokadzie w szwedzkim urzędzie</a>.</p>
  <div class="v25actions"><button type="button" class="btn" onclick="v25Ask('gdzie trafia moje pytanie')">Zapytaj: gdzie trafia moje pytanie</button><button type="button" class="btn sec" onclick="v25Ask('czy AI widzi mój PESEL')">Zapytaj: czy AI widzi mój PESEL</button></div>`}
  </div>`;
}
window.v25Ask=function(q){location.hash='#/assistant';setTimeout(()=>{try{ask(q)}catch(e){}},400)};

// ---------- pismo: sprawdzenie, streszczenie, skróć ----------
function plDate(iso){if(!iso)return '';const d=new Date(iso);if(isNaN(d.getTime()))return String(iso);return d.toLocaleDateString('pl-PL')}
function firstSentence(s){s=String(s||'').replace(/\s+/g,' ').trim();if(!s)return '';const cut=s.search(/[.!?](\s|$)/);let out=cut>=0?s.slice(0,cut+1):s;if(out.length>180)out=out.slice(0,177).replace(/\s+\S*$/,'')+'…';return out}
function readFields(){
 const g=id=>{const e=document.getElementById(id);return e?String(e.value||'').trim():''};
 return {org:g('a_org'),sig:g('a_sig'),dt:g('a_dt'),zad:g('a_zad'),why:g('a_why'),zal:!!(document.getElementById('a_zal')&&document.getElementById('a_zal').checked)};
}
function buildSummary(fields,kind){
 const f=fields||{};const who=(typeof U!=='undefined'&&U.full)?U.full:'Osoba składająca pismo';
 const zad=(f.zad||'').trim()||'rozpatrzenie sprawy opisanej w piśmie';
 const org=(f.org||'').trim()||'właściwy organ';
 const orgShort=org.length>90?org.slice(0,87)+'…':org;
 let s1=who+' wnosi o '+zad.replace(/\.+$/,'')+'.';
 let s2='Adresat: '+orgShort+'. '+(f.sig?'Znak sprawy: '+f.sig+'.':'Znaku sprawy nie podano.');
 let s3='';
 if(DEADLINE[kind]&&f.dt)s3='Dotyczy pisma z dnia '+plDate(f.dt)+'. '+(f.why?'W skrócie: '+firstSentence(f.why):'');
 else if(f.why)s3='W skrócie: '+firstSentence(f.why);
 const text=[s1,s2,s3].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
 return 'STRESZCZENIE DLA URZĘDNIKA (DEMO)\n'+text;
}
function userBlob(f){return [f.org,f.sig,f.zad,f.why,f.dt].filter(Boolean).join('\n')}
function checkLetter(text,opt){
 opt=opt||{};const f=opt.fields||{};const kind=opt.kind||'';const t=String(text||'');
 const items=[];
 const orgOk=(f.org&&f.org.length>3&&t.indexOf(f.org)!==-1)||/sąd|urz[aą]d|kolegium|prezydent|naczelnik|wójt|burmistrz|prezes|organ /i.test(t);
 items.push({ok:!!orgOk,id:'org',label:'Adresat (organ)'});
 const sigKnown=!!(f.sig&&f.sig.length>2);
 items.push({ok:sigKnown&&t.indexOf(f.sig)!==-1,na:!sigKnown,id:'sig',label:sigKnown?'Znak sprawy / sygnatura':'Znak sprawy — nie wpisano (dopisz, jeśli go masz)'});
 const zadOk=(f.zad&&f.zad.length>8)||/wnosz[eę] o \S.{8,}/i.test(t);
 items.push({ok:!!zadOk,id:'zad',label:'Czego dokładnie żądasz'});
 const whyOk=(f.why&&f.why.length>12)||/UZASADNIENIE[\s\S]{40,}/i.test(t);
 items.push({ok:!!whyOk,id:'why',label:'Krótkie uzasadnienie'});
 if(DEADLINE[kind])items.push({ok:!!(f.dt&&t.indexOf(plDate(f.dt))!==-1),id:'dt',label:'Data doręczenia albo data pisma, od którego biegnie termin'});
 const signed=/podpisano|z poważaniem/i.test(t)&&/(20\d{2}|\d{1,2}\.\d{1,2}\.\d{4})/.test(t);
 items.push({ok:!!signed,id:'sign',label:'Data i podpis'});
 const flags=[];
 if(/\[(uzupełnij|wpisz|TODO|XXX|…)\]|\b(lorem ipsum|do uzupełnienia|wpisz tutaj)\b|X{3,}/i.test(t))flags.push({level:'bad',t:'W piśmie został pusty wypełniacz (np. „wpisz”, „TODO”).'});
 const blob=userBlob(f).toLowerCase();
 const arts=t.match(/art\.?\s*\d+[a-z]?(?:\s*(?:ust\.|§|pkt)\s*\d+)?(?:\s*[a-z]\.?\s*[a-z]\.?\s*[a-z]\.?)?/gi)||[];
 [...new Set(arts.map(a=>a.replace(/\s+/g,' ').trim()))].forEach(a=>{if(!blob.includes(a.toLowerCase()))flags.push({level:'bad',t:'Numer przepisu „'+a+'” nie występuje w tym, co jest w formularzu. Sprawdź, czy nie został dopisany.'})});
 if(/zło[zż]one w terminie/i.test(t)&&!/termin/i.test(f.why||''))flags.push({level:'warn',t:'Zdanie „pismo zostało złożone w terminie” dodaje szablon. Zostaw je tylko wtedy, gdy to prawda.'});
 let fillers=0;
 FILLER.forEach(re=>{if(fillers>=2)return;const m=t.match(re);if(m){fillers++;flags.push({level:'warn',t:'Jest typowy pusty zwrot („'+m[0]+'”). Urząd czyta szybciej bez niego.'})}});
 if(/DEMO/.test(t))flags.push({level:'info',t:'Jest oznaczenie DEMO (np. adres do e-Doręczeń w pokazie). To nie jest prawdziwy identyfikator.'});
 if(/[Śś]wiadectwo pracy/.test(t)&&!/świadectwo|swiadectwo/i.test(f.why||''))flags.push({level:'info',t:'Załącznik „świadectwo pracy” jest nazwą z szablonu pokazu. Popraw ją, jeśli to inny dokument.'});
 let tone='ok',label='Około jednej strony';
 if(t.length<800){tone='short';label='Bardzo krótkie — dopisz żądanie i uzasadnienie'}
 else if(t.length<LO){tone='short';label='Krótsze niż jedna strona'}
 else if(t.length<=HI){tone='ok';label='Około jednej strony'}
 else if(t.length<=4000){tone='long';label='Dłuższe niż jedna strona'}
 else {tone='long';label='Zdecydowanie za długie'};
 return {n:t.length,tone,label,items,flags,summary:buildSummary(f,kind),deadline:!!DEADLINE[kind]};
}
window.v25CheckLetter=checkLetter;
function stripSummary(text){return String(text||'').replace(/^STRESZCZENIE DLA URZĘDNIKA[\s\S]*?\n---\n+/,'')}
function shorten(text,opt){
 opt=opt||{};const f=opt.fields||{};const kind=opt.kind||'';
 let body=stripSummary(text);
 body=body.split('\n').filter(line=>!/^\s*\[(uzupełnij|wpisz|TODO|XXX|…)[^\]]*\]\s*$/i.test(line)).map(line=>{
  if(FILLER.some(re=>re.test(line))&&line.length<220)return '';
  const parts=line.split(/(?<=[.!?])\s+/);
  return parts.filter(p=>!FILLER.some(re=>re.test(p))).join(' ');
 }).join('\n');
 if(!/termin/i.test(f.why||''))body=body.replace(/Wskazuję, że pismo zostało złożone w terminie\.?\s*/g,'');
 const blob=userBlob(f).toLowerCase();
 body=body.split('\n').filter(line=>{
  const arts=line.match(/art\.?\s*\d+/gi);if(!arts)return true;
  return arts.every(a=>blob.includes(a.toLowerCase().replace(/\s+/g,' ')));
 }).join('\n').replace(/\n{3,}/g,'\n\n').trim();
 if(body.length>2400){
  const mark=body.search(/UZASADNIENIE/i);
  if(mark>=0){const head=body.slice(0,mark);let rest=body.slice(mark);const sig=rest.match(/\n\(podpisano[\s\S]*$/i);const tail=sig?sig[0]:'';let mid=tail?rest.slice(0,rest.length-tail.length):rest;const budget=Math.max(360,2100-head.length-tail.length);if(mid.length>budget){let cut=mid.slice(0,budget);const dot=cut.lastIndexOf('.');if(dot>60)cut=cut.slice(0,dot+1);mid=cut.trim()+'\n'}body=(head+mid.trim()+'\n'+tail.trim()).trim()}
  else {let cut=body.slice(0,2200);const dot=cut.lastIndexOf('.');if(dot>800)cut=cut.slice(0,dot+1);body=cut.trim()}
 }
 return buildSummary(f,kind)+'\n---\n\n'+body.trim()+'\n';
}
window.v25Shorten=shorten;
function checkHtml(rep){
 const pct=Math.max(4,Math.min(100,Math.round(rep.n/SCALE*100)));
 const mark=Math.round(TARGET/SCALE*100);
 const rows=rep.items.map(it=>{const ic=it.na?'–':it.ok?'✓':'!';const cls=it.na?'na':it.ok?'ok':'bad';return `<li class="${cls}"><b>${ic}</b> ${esc(it.label)}</li>`}).join('');
 const flags=rep.flags.length?rep.flags.map(f=>`<li class="${f.level}">${esc(f.t)}</li>`).join(''):'<li class="ok">Nie widać pustych miejsc, dopisanych numerów przepisów ani typowych pustych zwrotów.</li>';
 return `<span class="demo">DEMO</span><h3>Pismo krótko i konkretnie</h3>
  <p class="v25len ${rep.tone}"><b>${rep.n}</b> znaków — ${esc(rep.label)}</p>
  <div class="v25meter" role="img" aria-label="${esc(rep.label)}"><i style="width:${pct}%"></i><em style="left:${mark}%" title="cel: około jednej strony"></em></div>
  <p class="muted">Cel poglądowy: około jednej strony (${LO}–${HI} znaków). To nie jest norma prawna. Nic nie zostanie wysłane.</p>
  <p><b>Elementy pisma</b></p><ul class="v25el">${rows}</ul>
  <p><b>Do sprawdzenia</b></p><ul class="v25fl">${flags}</ul>
  <p class="muted">Na górze szkicu jest „Streszczenie dla urzędnika” — dwa albo trzy zdania z pól formularza, bez nowych faktów.</p>`;
}
function actionsHtml(){const ai=window.aiOn&&aiOn();return `<div class="v25actions"><button type="button" class="btn" data-act="short">Skróć</button>${ai?'<button type="button" class="btn sec" data-act="ai">Skróć z asystentem</button>':''}<button type="button" class="btn ghost" data-act="send">Podpisz i wyślij (DEMO)</button></div><p class="muted v25hint">„Skróć” działa regułami w telefonie. „Skróć z asystentem” używa tej samej kolejności co czat (Gemma, potem reguły, potem Bielik) i niczego nowego nie podłącza.</p>`}
async function applyShort(ta,kind,fields,useAi){
 const opt={fields,kind};let via='rules',note='';
 if(useAi){try{const prompt='Skróć szkic pisma do około jednej strony. Zostaw adresata, znak sprawy, żądanie, krótkie uzasadnienie, datę i podpis. Nie dodawaj faktów, kwot ani numerów przepisów, których nie ma w tekście.\n\n'+ta.value;const r=await aiCall('popraw',{tekst:prompt});let out=String((r&&r.tekst)||'').trim();if(out.length<80)throw new Error('pusta');if(!/^STRESZCZENIE DLA URZĘDNIKA/.test(out))out=buildSummary(fields,kind)+'\n---\n\n'+out+'\n';ta.value=out;via=(window.v14Last&&window.v14Last.k)||'ai';note='Skrócono przez asystenta ('+via+'). Sprawdź, czy nie dopisał faktów. '+DEMO}
  catch(e){ta.value=shorten(ta.value,opt);note=e&&e.v25stop?'Tekst został w telefonie — skracam regułami. '+DEMO:'Asystent nie skrócił — skracam regułami w telefonie. '+DEMO;via='rules'}}
 else {ta.value=shorten(ta.value,opt);note='Skrócono regułami w telefonie. Sprawdź, czy nie zniknęło nic ważnego. '+DEMO}
 try{toast(note.replace(/<[^>]+>/g,''))}catch(err){}
 return via;
}
function ensureSummary(ta,fields,kind){if(!ta.dataset.v25sum){if(!/^STRESZCZENIE DLA URZĘDNIKA/.test(ta.value))ta.value=buildSummary(fields,kind)+'\n---\n\n'+ta.value.trim()+'\n';ta.dataset.v25sum='1'}}
function paintInto(box,ta,kind,fields,mode){if(!box||!ta)return;const rep=checkLetter(ta.value,{fields,kind});
 const ai=window.aiOn&&aiOn();
 const bar=mode==='gate'?actionsHtml():mode==='inline'?`<div class="v25actions"><button type="button" class="btn" data-act="short">Skróć</button>${ai?'<button type="button" class="btn sec" data-act="ai">Skróć z asystentem</button>':''}</div><p class="muted v25hint">„Skróć” zostaje w telefonie. Przycisk pod szkicem otworzy to sprawdzenie jeszcze raz, zanim cokolwiek podpiszesz. ${DEMO}</p>`:`<div class="v25actions"><button type="button" class="btn" data-act="short">Skróć</button><a class="btn sec" href="#/appeal">Otwórz kreator pism</a></div>`;
 box.innerHTML=checkHtml(rep)+bar;return rep}
let v25Sending=false;
const _sendPismo=sendPismo;
sendPismo=function(k){if(v25Sending)return _sendPismo.apply(this,arguments);
 const ta=document.getElementById('ptxt');const fields=readFields();const kind=k||((location.hash.split('/')[2])||'odwolanie');
 if(ta)ensureSummary(ta,fields,kind);
 const m=modal('<div id="v25gate"></div>');
 const box=m.querySelector('#v25gate');
 const redraw=()=>{if(ta)paintInto(box,ta,kind,readFields(),'gate');else box.innerHTML='<p>Najpierw ułóż pismo.</p>'};
 redraw();
 box.onclick=async e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const act=b.getAttribute('data-act');
  if(act==='short'||act==='ai'){b.disabled=true;try{await applyShort(ta,kind,readFields(),act==='ai')}finally{b.disabled=false}redraw();const inline=document.getElementById('v25let');if(inline&&ta)paintInto(inline,ta,kind,readFields(),'inline')}
  if(act==='send'){closeModal();v25Sending=true;try{_sendPismo(k)}finally{v25Sending=false}}};
 m.onclick=e=>{if(e.target===m)m.remove()};
};
window.sendPismo=sendPismo;
function mountLetter(kind){
 const pout=document.getElementById('pout');const ta=document.getElementById('ptxt');if(!pout||!ta)return;
 const fields=readFields();ensureSummary(ta,fields,kind);
 if(!ta.dataset.v25in){ta.dataset.v25in='1';ta.addEventListener('input',()=>{const box=document.getElementById('v25let');if(box)paintInto(box,ta,kind,readFields(),'inline')})}
 let box=document.getElementById('v25let');if(!box){box=document.createElement('div');box.id='v25let';box.className='card v25card';pout.insertAdjacentElement('afterbegin',box)}
 if(!box.dataset.v25on){box.dataset.v25on='1';box.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const act=b.getAttribute('data-act');const area=document.getElementById('ptxt');if(!area)return;if(act==='short'||act==='ai'){b.disabled=true;try{await applyShort(area,kind,readFields(),act==='ai')}finally{b.disabled=false}paintInto(box,area,kind,readFields(),'inline')}})}
 paintInto(box,ta,kind,fields,'inline');
}
const _genPismo=genPismo;
genPismo=function(k){const r=_genPismo.apply(this,arguments);try{mountLetter(k)}catch(e){console.warn('v25',e)}return r};
window.genPismo=genPismo;

const SAMPLE_FIELDS={org:'Samorządowe Kolegium Odwoławcze w Warszawie za pośrednictwem Prezydenta m.st. Warszawy',sig:'SW-DEMO.4012.17.2026',dt:'2026-10-12',zad:'uchylenie zaskarżonej decyzji w całości i przyznanie świadczenia',why:'Organ nie uwzględnił dochodu po utracie pracy, choć załączyłam świadectwo pracy.'};
function sampleLetter(){
 const body=`Anna Kowalska
ul. Przykładowa 12/4, 00-001 Warszawa
adres do e-Doręczeń: AE:PL-DEMO-12345-ABCDE-12

Warszawa, ${new Date().toLocaleDateString('pl-PL')}

${SAMPLE_FIELDS.org}

Znak sprawy: ${SAMPLE_FIELDS.sig}

ODWOŁANIE OD DECYZJI
dotyczy: decyzji z dnia ${plDate(SAMPLE_FIELDS.dt)}

Wnoszę o ${SAMPLE_FIELDS.zad}.

UZASADNIENIE

${SAMPLE_FIELDS.why}

W związku z powyższym pragnę zwrócić uwagę, że w przedmiotowej sprawie nie ulega wątpliwości, iż organ działał wadliwie. Mając na uwadze powyższe, uprzejmie proszę o pozytywne rozpatrzenie niniejszego pisma. Z góry dziękuję za przychylność. Jak powszechnie wiadomo, należy podkreślić wagę sprawy dla wnioskodawcy i jego rodziny, która oczekuje szybkiego rozstrzygnięcia i pełnego uwzględnienia wszystkich okoliczności życiowych, które zostały już opisane powyżej i które powtarzam wyłącznie po to, aby pismo było dłuższe niż potrzeba.

Zgodnie z art. 999 k.p.a. sprawa jest oczywista.

Wskazuję, że pismo zostało złożone w terminie.

[wpisz numer konta]

Załączniki:
1. Świadectwo pracy (kopia)

Anna Kowalska
(podpisano podpisem osobistym)
`;
 return buildSummary(SAMPLE_FIELDS,'odwolanie')+'\n---\n\n'+body;
}
function pageWhere(){shell('🔒 Gdzie trafia moje pytanie?',factsHtml(false)+`<div class="card"><h3>Co zobaczysz przy odpowiedzi</h3><p>Przy każdej odpowiedzi asystenta jest plakietka. <b>Wyszło z telefonu</b> znaczy Gemma (albo inny model poza urządzeniem). <b>Zostało w telefonie</b> znaczy reguły albo Bielik w przeglądarce. Stuknij plakietkę — jest wyjaśnienie prostym językiem.</p><a class="btn ghost" href="#/assistant">Otwórz asystenta</a></div>`,{tab:'more'})}
function pageLetter(){
 shell('✂️ Pismo krótko i konkretnie',`<div class="alert b">✂️<div><b>Zanim pismo w ogóle powstanie jako wysyłka.</b> Urzędy dostają długie, czasem zmyślone pisma z modeli. Tu sprawdzenie jest przed przyciskiem wyślij. ${DEMO} Nic nie wychodzi z przeglądarki.</div></div>
  <p class="muted">Inspiracja: <a href="https://x.com/inTorusAI/status/2114951978434646462" target="_blank" rel="noopener">wpis o skargach generowanych przez AI w brytyjskich urzędach</a>. Poniżej przykładowe odwołanie z dopisanym przepisem i pustymi zdaniami.</p>
  <div id="v25sampleCard" class="card v25card"></div>
  <label>Przykładowy szkic (możesz skrócić)</label><textarea id="v25sample" rows="12"></textarea>
  <a class="btn" href="#/appeal">Otwórz kreator i sprawdź własne pismo</a>`,{tab:'more'});
 const ta=document.getElementById('v25sample');ta.value=sampleLetter();
 const box=document.getElementById('v25sampleCard');
 const redraw=()=>paintInto(box,ta,'odwolanie',SAMPLE_FIELDS,'sample');
 redraw();
 ta.addEventListener('input',redraw);
 box.onclick=async e=>{const b=e.target.closest('[data-act]');if(!b)return;if(b.getAttribute('data-act')==='short'){b.disabled=true;try{await applyShort(ta,'odwolanie',SAMPLE_FIELDS,false)}finally{b.disabled=false}redraw()}};
}

// ---------- wejścia w istniejących ekranach ----------
function kindNow(){const k=(location.hash.split('/')[2])||'';return DEADLINE[k]||k==='pozew'||k==='pismo'||k==='odwolanie'?k:'odwolanie'}
let panelTimer=0;
function placePanel(){
 const sc=app.querySelector('.scroll');if(!sc)return;
 const h=(app.querySelector('.top h2')||{}).textContent||'';
 if(!/Asystent AI|Asystent – ustawienia/.test(h))return;
 let el=document.getElementById('v25priv');
 if(!el){const n=document.createElement('div');n.innerHTML=factsHtml(true);el=n.firstElementChild}
 const anchor=document.getElementById('v19set')||document.getElementById('v18s');
 if(anchor){if(el.previousElementSibling!==anchor)anchor.insertAdjacentElement('afterend',el)}
 else if(!el.isConnected)sc.insertAdjacentElement('afterbegin',el);
}
function schedulePanel(){clearTimeout(panelTimer);panelTimer=setTimeout(placePanel,0)}
function inject(){
 const sc=app.querySelector('.scroll');if(!sc)return;
 const h=(app.querySelector('.top h2')||{}).textContent||'';
 const hash=location.hash.replace(/^#\//,'');
 const top=hash.split(/[/?]/)[0];
 if(/Asystent AI|Asystent – ustawienia/.test(h))schedulePanel();
 if(top==='assistant'){
  const chips=[...sc.querySelectorAll('.chips')].filter(c=>!c.closest('.chat')&&!c.closest('.msg'));
  const box=chips[chips.length-1];
  if(box&&!document.getElementById('v25chip'))box.insertAdjacentHTML('beforeend','<button type="button" class="chip" id="v25chip" onclick="ask(\'gdzie trafia moje pytanie\')">Gdzie trafia moje pytanie?</button><button type="button" class="chip" onclick="ask(\'czy AI widzi mój PESEL\')">Czy AI widzi mój PESEL?</button><button type="button" class="chip" onclick="ask(\'sprawdź moje pismo\')">Sprawdź moje pismo</button>');
 }
 if(top==='appeal'&&!sc.querySelector('#v25lead'))sc.insertAdjacentHTML('afterbegin','<a id="v25lead" class="v25lead" href="#/pismo-krotko"><b>Pismo krótko i konkretnie</b><small>Przed wysyłką DEMO: długość, brakujące elementy, rzeczy dopisane przez szablon. Duże przyciski także w trybie seniora.</small></a>');
 const more=document.getElementById('v19more');
 if(more&&!more.querySelector('#v25grp')){
  const d=document.createElement('details');d.className='v19g';d.id='v25grp';d.open=true;
  d.innerHTML='<summary>🔒 <b>Prywatność AI i pisma</b> <span class="muted">2</span></summary><div class="grid"><button type="button" class="tile" onclick="location.hash=\'#/gdzie-trafia\'"><b>🔒</b>Gdzie trafia pytanie</button><button type="button" class="tile" onclick="location.hash=\'#/pismo-krotko\'"><b>✂️</b>Pismo krótko</button></div>';
  const first=more.querySelector('.v19g');first?more.insertBefore(d,first):more.appendChild(d);
 }
 if(top==='family'&&!sc.querySelector('#v25fam'))sc.insertAdjacentHTML('afterbegin','<div id="v25fam" class="card"><h3>Asystent i pisma tej osoby</h3><p class="muted">Każda osoba ma swoją rozmowę na tym telefonie. Plakietka przy odpowiedzi mówi, czy tekst wyszedł z urządzenia. Pismo w kreatorze bierze imię i adres aktualnej osoby.</p><a class="btn sec" href="#/gdzie-trafia">Gdzie trafia pytanie</a></div>');
}
const _route=route;
route=function(){
 const h=location.hash.replace(/^#\//,'')||'home';const p=h.split(/[/?]/)[0];
 if(p==='gdzie-trafia'||p==='pismo-krotko'){try{clearInterval(threatT)}catch(e){}try{clearInterval(camT)}catch(e){}p==='gdzie-trafia'?pageWhere():pageLetter();try{inject()}catch(e){}return}
 const out=_route.apply(this,arguments);try{inject()}catch(e){}return out};
window.route=route;onhashchange=route;
let busy=false;
new MutationObserver(()=>{if(busy)return;busy=true;try{inject()}catch(e){}finally{busy=false}}).observe(app,{childList:true});
const st=document.createElement('style');st.textContent=`
.v25b{display:inline-flex;align-items:center;margin-top:8px;padding:6px 12px;border-radius:999px;border:1px solid #b7e0c6;background:#eefaf1;color:#0d5c32;font:700 .78em/1.3 system-ui;cursor:pointer}
.v25b.left{background:#fff4e5;border-color:#f3d9a4;color:#7a4e00}
.v25b.stay{background:#eefaf1;border-color:#b7e0c6;color:#0d5c32}
body.senior .v25b{font-size:1.05em;padding:12px 16px;min-height:48px}
.v25card h3{margin-top:6px}.v25ul,.v25el,.v25fl,.v25hits{margin:6px 0 10px;padding-left:18px}
.v25ul li,.v25hits li{margin:0 0 8px}
.v25actions{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.v25actions .btn{margin-top:0}
body.senior .v25actions .btn,body.senior .v25card .btn{font-size:1.15em;padding:16px 14px;min-height:56px}
.v25len{font-size:1.05em;margin:6px 0}
.v25len.ok{color:#0d5c32}.v25len.long{color:#8d1d18}.v25len.short{color:#7a4e00}
.v25meter{position:relative;height:12px;background:#e6ebf3;border-radius:99px;margin:8px 0 4px;overflow:hidden}
.v25meter i{display:block;height:100%;background:#0b3d91;border-radius:99px}
.v25meter em{position:absolute;top:-3px;width:3px;height:18px;background:#dc143c;border-radius:2px}
body.senior .v25meter{height:18px}body.senior .v25meter em{height:26px}
.v25el,.v25fl{list-style:none;padding-left:0}
.v25el li,.v25fl li{display:flex;gap:8px;align-items:flex-start;background:#fff;border:1px solid #e1e6ef;border-radius:12px;padding:8px 10px;margin:0 0 6px}
.v25el li b,.v25fl li:before{flex:none}
.v25el .ok b{color:#0d5c32}.v25el .bad b{color:#8d1d18}.v25el .na b{color:#5b6476}
.v25fl .bad{border-color:#f0b4b4;background:#fff6f5}.v25fl .warn{border-color:#f3d9a4;background:#fffaf0}.v25fl .info{border-color:#d5deee}.v25fl .ok{border-color:#b7e0c6;background:#f3fbf6}
.v25lead{display:flex;flex-direction:column;gap:2px;background:#0b3d91;color:#fff;text-decoration:none;border-radius:16px;padding:12px 14px;margin:0 0 12px}
.v25lead small{opacity:.92;font-weight:600}
body.senior .v25lead{padding:18px}body.senior .v25lead b{font-size:1.35em}body.senior .v25lead small{font-size:1.05em}
.v25hits code{word-break:break-all}
body.senior .v25card,body.senior .v25hits,body.senior .sheet{font-size:1.05em}
body.contrast .v25card,body.contrast .v25el li,body.contrast .v25fl li{background:#000;color:#fff;border-color:#fff}
body.contrast .v25b{background:#000;color:#ffeb3b;border-color:#ffeb3b}
body.contrast .v25lead{background:#000;color:#ffeb3b;border:2px solid #ffeb3b}
`;document.head.appendChild(st);
try{inject()}catch(e){}
route();
})();
