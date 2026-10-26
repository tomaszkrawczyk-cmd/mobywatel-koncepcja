// ===== v12: porządek w „Wszystkie usługi”, uczciwa plakietka modelu AI, poprawki z przeglądu =====
(()=>{
// ---- Wszystkie usługi: najpierw sprawy flagowe, reszta w grupach wg sytuacji życiowych ----
const FLAG=[['👛','Zgubiłem portfel','#/flow/wallet','Zastrzeż dowód i prawo jazdy jednym wnioskiem'],['📩','Dostałem pismo','#/explain','Po ludzku, z terminem i szkicem odpowiedzi'],['💊','Kończy mi się lek','#/recepty','Zapas, przedłużenie recepty, kod do apteki'],['🧩','Przeprowadzam się','#/agent/przeprowadzka','Plan formalności krok po kroku'],['🩺','Moje zdrowie','#/zdrowie','Karta zdrowia, wizyty, badania'],['📣','Zgłaszam zdarzenie','#/report','Kolizja, kradzież, szkoda'],['🚗','Kończy się OC','#/oc','Porównanie ofert i odnowienie'],['🆘','Cichy SOS','#/sos','Wezwij pomoc bez mówienia']];
const GR=[
 ['🚨','Bezpieczeństwo i nagłe sytuacje',/^#\/(report|sos|c112|syrena|security|flow\/wot|cctv|kmzb|plan|phishing|alerts|help)\b/],
 ['🩺','Zdrowie',/^#\/(health|recepty|zdrowie)\b/],
 ['👪','Rodzina, bliscy i nauka',/^#\/(family|upowaz|social|edu|matura|deklaracja|studia|kalkulator|zgloszenia)\b/],
 ['🚗','Auto, podróże i opłaty',/^#\/(oc|mandat|bilety|travel|money|energy)\b/],
 ['📩','Pisma, prawo i sądy',/^#\/(explain|appeal|deadline|law|lawai|acts|esad|inbox|mail)\b/],
 ['🏢','Praca, firma i emerytura',/^#\/(firma|krs|nip|registers|emerytura|flow\/budowa)\b/],
 ['🗳️','Obywatel i państwo',/^#\/(influence|flow\/petycja|flow\/udip|vote|petitions|elections|refs)\b/],
 ['⚙️','Aplikacja, dane i prywatność',/^#\/(home|guide|agent|skan|privacy|settings|tech|pltech|zrodla|ai)\b/]];
const grp=h=>{const i=GR.findIndex(g=>g[2].test(h));return i<0?GR.length:i};
window.all=function(){shell('🔍 Wszystkie usługi',`<input id="sq" placeholder="Szukaj, np. pozew, syrena, lekarz" aria-label="Szukaj usługi" oninput="drawAll()"><div id="sl" style="margin-top:10px"></div>`,{tab:'more'});drawAll()};
window.drawAll=function(){const el=$('#sl');if(!el)return;const q=($('#sq').value||'').toLowerCase().trim();
 const uniq=ALL.filter((a,i)=>ALL.findIndex(b=>b[2]==a[2])==i);
 if(q){const r=FLAG.concat(uniq).filter((a,i,arr)=>arr.findIndex(b=>b[2]==a[2])==i&&(a[1]+' '+(a[3]||'')).toLowerCase().includes(q));
  el.innerHTML=`<div class="card">${r.length?r.map(a=>rowl(a[0],a[1],a[2])).join(''):'<p class="muted">Nic nie znaleziono – <a href="#/assistant">zapytaj asystenta</a>.</p>'}</div>`;return}
 const G=GR.map(()=>[]).concat([[]]);uniq.forEach(a=>G[grp(a[2])].push(a));
 el.innerHTML=`<div class="card"><h3>⭐ Najczęstsze sprawy</h3><div class="grid">${FLAG.map(([i,t,h])=>`<button class="tile hot" onclick="location.hash='${h}'"><b>${i}</b>${t}</button>`).join('')}</div></div>`+
  G.map((L,k)=>L.length?`<details class="card grp"><summary><b>${k<GR.length?GR[k][0]+' '+GR[k][1]:'➕ Inne usługi'}</b> <span class="muted">(${L.length})</span></summary>${L.map(a=>rowl(a[0],a[1],a[2])).join('')}</details>`:'').join('')+
  `<p class="muted">Razem ${uniq.length} usług. Wpisz słowo w wyszukiwarce, żeby przeszukać wszystkie naraz.</p>`};
// ---- #/letter bez id: zamiast błędu wracamy do skrzynki ----
const _letter=letter;window.letter=letter=function(id){if(!INBOX.some(x=>x.id==id)){location.replace('#/inbox');return}return _letter(id)};
// ---- Asystent: widoczna, uczciwa informacja o modelu ----
const _asst=assistant;window.assistant=assistant=function(){_asst();
 const p=[...app.querySelectorAll('p.muted')].find(x=>/^Silnik:/.test(x.textContent));if(!p)return;
 const on=window.aiOn&&aiOn()&&S.v10.mode=='proxy';
 p.outerHTML=`<div class="alert ${on?'g':'b'}" style="font-size:.85em">🤖<div>${on?'<b>Model: Gemma 4 (Google, otwarte wagi) na Cloudflare Workers AI.</b> Odpowiada tylko, gdy żaden scenariusz nie pasuje. Gotowe do podmiany na polski model Bielik lub PLLuM – <b>dziś ich nie uruchamiamy</b>.':'<b>Tryb offline: reguły i scenariusze w telefonie.</b> Model językowy (Gemma 4 od Google na Cloudflare Workers AI) jest wyłączony – <a href="#/ai">włącz w ustawieniach AI</a>. Bielik / PLLuM: przygotowane, jeszcze nie podłączone.'} Akcje zawsze wymagają potwierdzenia.</div></div>`};
})();
