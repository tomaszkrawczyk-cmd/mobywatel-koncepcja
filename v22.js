// ===== v22: „Zgłoś oszustwo” – prowadzone zgłoszenia do CERT Polska, policji i banku =====
// Autor koncepcji: Tomasz Krawczyk. Nic nie jest wysyłane automatycznie: aplikacja tylko przygotowuje
// podgląd (DEMO, numer DEMO-) i otwiera PRAWDZIWE kanały (sms:8080, incydent.cert.pl, tel:112) dopiero po dotknięciu.
// „Sprawdź link” NIE wydaje werdyktów – tłumaczy, jak działa Lista Ostrzeżeń CERT, i pokazuje wskazówki.
(function(){
const KEY='mob22_fraud_v1';
const SRC={
 sms:['gov.pl: Dostałeś niepokojący SMS albo e-mail? Zgłoś go do CERT Polska','https://www.gov.pl/web/baza-wiedzy/dostales-niepokojacy-sms-albo-email-zglos-go-do-cert-polska-csirt-nask'],
 lista:['CERT Polska: Lista Ostrzeżeń przed niebezpiecznymi stronami','https://cert.pl/lista-ostrzezen/'],
 wiedza:['CERT Polska – Baza wiedzy: Lista Ostrzeżeń','https://wiedza.cert.pl/systemy-cert-polska/uslugi/lista-ostrzezen/'],
 inc:['CERT Polska: formularz incydent.cert.pl','https://incydent.cert.pl'],
 cbzc:['CBZC: Zgłoś cyberoszustwo','https://cbzc.policja.gov.pl/bzc/zglos-cyberprzestepstwo/464,Zglos-cyberoszustwo.html'],
 rf:['Rzecznik Finansowy: Co robić w przypadku nieautoryzowanej transakcji','https://rf.gov.pl/co-robic-w-przypadku-nieautoryzowanej-transakcji/'],
 pesel:['gov.pl: Zastrzeż swój numer PESEL','https://www.gov.pl/web/gov/zastrzez-swoj-numer-pesel-lub-cofnij-zastrzezenie'],
 knf:['KNF: Lista ostrzeżeń publicznych','https://www.knf.gov.pl/dla_konsumenta/ostrzezenia_publiczne']
};
const src=(...k)=>`<p class="v21src">Źródła: ${k.map(x=>`<a href="${SRC[x][1]}" target="_blank" rel="noopener">${SRC[x][0]}</a>`).join(' · ')}</p>`;
const DEMO='<span class="demo">DEMO</span>';
const CAT={
 sms:{ic:'📱',t:'Dziwny SMS',d:'dopłata do paczki, faktura, „blokada konta”',q:[['txt','Wklej treść SMS-a (razem z linkiem)','textarea'],['from','Od kogo przyszedł (numer lub nazwa nadawcy)']],ch:['8080','inc'],tip:'Najlepiej użyj „Przekaż” w swojej aplikacji SMS i wyślij na 8080 – CERT prosi o całą wiadomość w oryginalnej formie, bez wycinania linku. Z jednego numeru: maks. 3 zgłoszenia na 4 godziny.'},
 www:{ic:'🔗',t:'Fałszywa strona lub link',d:'podróbka banku, sklepu, OLX, kuriera, gov.pl',q:[['url','Adres strony (link)'],['how','Skąd go masz? (e-mail, reklama, komunikator)']],ch:['inc'],tip:'Formularz phishingu CERT: incydent.cert.pl. Strony potwierdzone przez CERT trafiają na Listę Ostrzeżeń i są blokowane przez operatorów, którzy z niej korzystają.'},
 call:{ic:'☎️',t:'Telefon „z banku” lub „z policji”',d:'spoofing – na ekranie numer banku, a dzwoni oszust',q:[['num','Numer, który wyświetlił się na ekranie'],['said','Kim się przedstawił i czego chciał? (bez Twoich danych)','textarea']],ch:['bank','inc','112'],tip:'Rozłącz się. Sam zadzwoń do banku numerem z karty lub z aplikacji banku. Bank ani policja nie każą przelewać pieniędzy na „bezpieczne konto”, instalować aplikacji do zdalnego dostępu ani podawać kodu BLIK.'},
 doc:{ic:'🪪',t:'Fałszywy mObywatel lub dokument',d:'sprzedaż podróbek, ktoś okazał podrobiony dokument',q:[['where','Gdzie to widzisz? (link do ogłoszenia, sklep)'],['what','Co się stało?','textarea']],ch:['inc','112'],tip:'Ofertę sprzedaży podróbek zgłoś na incydent.cert.pl. Gdy ktoś właśnie używa podróbki – policja.',v21:true},
 inv:{ic:'📈',t:'Fałszywa inwestycja',d:'„zarabiaj na kryptowalutach”, reklama ze znaną twarzą',q:[['name','Nazwa platformy lub strona'],['paid','Czy wpłaciłeś pieniądze? Ile i jak? (opcjonalnie)']],ch:['bank','inc','pol'],tip:'Sprawdź firmę na liście ostrzeżeń publicznych KNF. Nie instaluj programów, o które prosi „opiekun”. Jeśli zapłaciłeś – najpierw bank, potem policja.'},
 shop:{ic:'🛍️',t:'Oszustwo w sklepie, OLX, Facebooku',d:'link „odbierz pieniądze”, fałszywy kupujący lub sprzedawca',q:[['plat','Serwis (OLX, Vinted, Facebook…)'],['link','Link, który dostałeś (jeśli był)'],['what','Co się stało?','textarea']],ch:['inc','bank','pol'],tip:'Nie klikaj linków „do odbioru płatności” od kupującego. Rozmawiaj i płać tylko w serwisie. Zgłoś konto oszusta administratorowi serwisu.'}
};
let F={};
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}};
const store=v=>{try{localStorage.setItem(KEY,JSON.stringify(v.slice(0,15)))}catch(e){}};
function rnd(n){const a=new Uint32Array(1);crypto.getRandomValues(a);return String(a[0]).slice(-n).padStart(n,'0')}
function caseNo(){const d=new Date();return 'DEMO-CERT-'+d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'-'+rnd(4)}
// usuwa dane osobowe z opisu (nie z treści SMS-a oszusta, którą CERT chce w oryginale)
function strip(s){let n=0;const r=(re,rep)=>{s=s.replace(re,()=>{n++;return rep})};s=String(s||'');
 r(/\b\d{11}\b/g,'[PESEL usunięty]');r(/\bPL\s?\d{2}(?:\s?\d{4}){6}\b|\b\d{2}(?:\s?\d{4}){6}\b/gi,'[nr konta usunięty]');
 r(/\b(?:\d[ -]?){16}\b/g,'[nr karty usunięty]');r(/[\w.+-]+@[\w-]+\.[\w.]+/g,'[e-mail usunięty]');
 r(/\b(?:kod|blik|pin|haslo|hasło)\s*:?\s*\d{4,8}\b/gi,'[kod usunięty]');r(/\b[A-Z]{3}\s?\d{6}\b/g,'[nr dowodu usunięty]');return {s,n}}
function top(){return (location.hash.replace(/^#\//,'')||'home').split(/[/?]/)[0]}
function sub(){return location.hash.split('/')[2]||''}

// ---------- hub ----------
function hub(){const list=load();shell('🚨 Zgłoś oszustwo',`
 <div class="v22hero"><b>Coś Cię zaniepokoiło? Zgłoś – to chroni innych.</b><span>Wybierz, co się stało. Pomogę przygotować zgłoszenie i otworzę właściwy oficjalny kanał. Aplikacja sama niczego nie wysyła.</span></div>
 <a class="v22money" href="#/po-oszustwie"><b>💸 Straciłem pieniądze lub podałem dane</b><small>Najpierw bank i zastrzeżenie karty – lista kroków</small></a>
 <div class="v22cats">${Object.entries(CAT).map(([k,c])=>`<a class="v22cat" href="#/zglos-oszustwo/${k}"><b>${c.ic} ${c.t}</b><small>${c.d}</small></a>`).join('')}</div>
 <div class="v22row"><a class="btn sec" href="#/sprawdz-link">🔎 Sprawdź link ${DEMO}</a><a class="btn sec" href="#/po-oszustwie">✅ Lista po oszustwie</a></div>
 <details class="v21more"><summary>📞 Oficjalne kanały – skrót</summary><ul class="v21list">
  <li><b>SMS 8080</b> – bezpłatnie przekaż podejrzany SMS do CERT Polska (w roamingu wg cennika operatora).</li>
  <li><b>incydent.cert.pl</b> – formularz dla stron, e-maili i innych incydentów; można też pisać na cert@cert.pl.</li>
  <li><b>Bank</b> – od razu, gdy chodzi o pieniądze; kartę zastrzeżesz w aplikacji banku.</li>
  <li><b>Policja</b> – zawiadomienie w każdej jednostce; w nagłej sytuacji <a href="tel:112">112</a>.</li>
  <li><b>Zastrzeż PESEL</b> – w mObywatelu lub na gov.pl, bezpłatnie i od razu.</li></ul>${src('sms','inc','cbzc','pesel')}</details>
 ${list.length?`<details class="v21more"><summary>🗂️ Moje przygotowane zgłoszenia (${list.length}) – tylko na tym telefonie</summary>${list.map(r=>`<div class="row"><span>${esc(CAT[r.c]?CAT[r.c].t:r.c)}</span><b>${esc(r.n)}</b></div>`).join('')}<button class="btn sec" onclick="v22Wipe()">Usuń wszystkie z telefonu</button></details>`:''}`,{tab:'security'})}
window.v22Wipe=function(){store([]);hub();toast('Usunięto zgłoszenia DEMO z tego telefonu.')};

// ---------- formularz kategorii ----------
function flow(){const k=sub();const c=CAT[k];if(!c){location.hash='#/zglos-oszustwo';return}
 shell(c.ic+' '+c.t,`
 <div class="alert">ℹ️<div><b>${c.tip}</b></div></div>
 ${c.v21?`<a class="v21go" href="#/zglos-podrobke"><b>🛡️ Podrobiony mObywatel?</b><small>Formularz z modułu „Prawdziwy czy podróbka?” oraz poradnik rozpoznawania</small></a>`:''}
 <p class="muted">Zbieram tylko to, co potrzebne. Dane zostają na telefonie. Z opisu usuwam PESEL, numery kont i kart, e-maile i kody.</p>
 ${c.q.map(([id,l,t])=>`<label>${l}${t==='textarea'?`<textarea id="v22_${id}" rows="3">${esc(F[id]||'')}</textarea>`:`<input id="v22_${id}" value="${esc(F[id]||'')}">`}</label>`).join('')}
 <label class="v19sw"><input type="checkbox" id="v22lost" ${F.lost?'checked':''}> <b>Straciłem pieniądze albo podałem dane logowania / kartę</b></label>
 <button class="btn" onclick="v22Prev('${k}')">Pokaż podgląd zgłoszenia ${DEMO}</button>
 ${src(...(k==='sms'?['sms','inc']:k==='inv'?['knf','cbzc','inc']:k==='call'?['cbzc','rf']:['inc','cbzc']))}`,{tab:'security'})}
function collect(k){F={};CAT[k].q.forEach(([id])=>{const el=document.getElementById('v22_'+id);F[id]=el?el.value.trim():''});F.lost=!!(document.getElementById('v22lost')||{}).checked}
window.v22Prev=function(k){collect(k);const c=CAT[k];let removed=0;const lines=c.q.map(([id,l])=>{let v=F[id]||'—';if(!(k==='sms'&&id==='txt')){const r=strip(v);v=r.s;removed+=r.n}return `<div class="v22pl"><span>${esc(l)}</span><p>${esc(v)}</p></div>`}).join('');
 const n=caseNo();const smsBody=encodeURIComponent(F.txt||'');
 const btn={
  '8080':`<a class="btn v22real" href="sms:8080${/iPhone|iPad/.test(navigator.userAgent)?'&':'?'}body=${smsBody}">📨 Wyślij SMS na 8080 (prawdziwy kanał)</a><p class="muted">Otworzy się Twoja aplikacja SMS z wklejoną treścią – nic nie wyjdzie, dopóki sam nie naciśniesz „Wyślij”. Jeszcze lepiej: „Przekaż” oryginalną wiadomość.</p>`,
  inc:`<a class="btn v22real" href="https://incydent.cert.pl" target="_blank" rel="noopener">🌐 Otwórz incydent.cert.pl (prawdziwy formularz)</a><button class="btn sec" onclick="v22Copy()">📋 Skopiuj treść do wklejenia</button>`,
  '112':`<a class="btn sec" href="tel:112">📞 112 – tylko w nagłej sytuacji (np. oszust jest na miejscu)</a>`,
  bank:`<div class="v22bank">🏦 <b>Zadzwoń do swojego banku</b> numerem z odwrotu karty lub z aplikacji banku – nie oddzwaniaj na numer, z którego dzwonił „konsultant”.</div>`,
  pol:`<p class="muted">👮 Zawiadomienie złożysz w każdej jednostce policji. Weź korespondencję, potwierdzenia przelewów i numer konta oszusta. Zaświadczenie dołącz do reklamacji w banku.</p>`};
 const rec=load();rec.unshift({c:k,n,at:new Date().toISOString()});store(rec);window.v22Text=`Zgłoszenie (przygotowane w koncepcji mObywatel, ${n})\nKategoria: ${c.t}\n`+c.q.map(([id,l])=>l+': '+(k==='sms'&&id==='txt'?F[id]:strip(F[id]).s)).join('\n');
 shell('👁️ Podgląd zgłoszenia',`
  <div class="v22case"><span class="demo">DEMO</span><b>${n}</b><small>Numer DEMO, nadany w telefonie, a nie przez CERT. Prawdziwy numer da CERT albo policja.</small></div>
  <div class="card">${lines}${removed?`<p class="v22strip">🧹 Usunięto ${removed} ${removed===1?'fragment':'fragmenty'} z danymi osobowymi.</p>`:''}</div>
  ${F.lost?`<div class="alert r">💸<div><b>Straciłeś pieniądze lub dane? Najpierw bank.</b> Potem zgłoszenie. <a href="#/po-oszustwie">Lista kroków</a></div></div>`+btn.bank:''}
  <h3>Wyślij prawdziwym kanałem</h3>${c.ch.filter(x=>!(F.lost&&x==='bank')).map(x=>btn[x]).join('')}
  <a class="btn sec" href="#/zglos-oszustwo">Wróć do kategorii</a>`,{tab:'security'})};
window.v22Copy=function(){const t=window.v22Text||'';(navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Skopiowano. Wklej w formularzu CERT.'),()=>toast('Nie udało się skopiować – zaznacz tekst ręcznie.'))};

// ---------- Sprawdź link (bez fałszywych werdyktów) ----------
function link(){shell('🔎 Sprawdź link',`
 <div class="alert">ℹ️<div><b>DEMO – to nie jest werdykt.</b> W tej koncepcji nie pobieramy Listy Ostrzeżeń CERT. Pokażę tylko wskazówki z samego adresu. Brak ostrzeżenia nie oznacza, że strona jest bezpieczna.</div></div>
 <label>Wklej link<input id="v22u" placeholder="np. https://inpost-doplata.example"></label><button class="btn" onclick="v22Check()">Przeanalizuj adres</button><div id="v22out"></div>
 <details class="v21more" open><summary>Jak działa Lista Ostrzeżeń CERT Polska</summary><ul class="v21list">
  <li>CERT od marca 2020 r. przez całą dobę wpisuje na listę domeny, które wyłudzają dane.</li><li>Operatorzy, którzy korzystają z listy, blokują te domeny i pokazują planszę ostrzegawczą „hole.cert.pl”.</li>
  <li>Wpis trwa zwykle 6 miesięcy i obejmuje też subdomeny.</li><li>Na <a href="https://lista.cert.pl" target="_blank" rel="noopener">lista.cert.pl</a> sprawdzisz, czy Twoja przeglądarka lub sieć jest chroniona listą.</li>
  <li>Listę można dodać do uBlock Origin lub AdGuard. Korzystają z niej też Quad9 i NextDNS.</li></ul>
  <p class="muted">Pomysł na prawdziwą aplikację: sprawdzanie linku na telefonie z kopią listy z hole.cert.pl, aktualizowaną co kilka minut, bez wysyłania adresu na zewnątrz.</p>${src('lista','wiedza')}</details>`,{tab:'security'})}
window.v22Check=function(){const raw=(document.getElementById('v22u')||{}).value||'';let u;try{u=new URL(/^\w+:\/\//.test(raw)?raw:'https://'+raw)}catch(e){document.getElementById('v22out').innerHTML='<p class="muted">To nie wygląda na adres strony.</p>';return}
 const h=u.hostname.toLowerCase(),tips=[];
 if(/(^|\.)(gov\.pl)$/.test(h))tips.push(['ok','Kończy się na <b>.gov.pl</b> – tak wyglądają strony administracji. Mimo to sprawdź, czy dobrze przeczytałeś adres.']);
 if(/(inpost|dpd|dhl|poczta|allegro|olx|vinted|pko|mbank|santander|ing|pekao|mobywatel|gov|blik|facebook)/.test(h)&&!/(^|\.)(gov\.pl|inpost\.pl|allegro\.pl|olx\.pl|pkobp\.pl|mbank\.pl|ing\.pl|pekao\.com\.pl|facebook\.com|dhl\.com|dpd\.com\.pl|poczta-polska\.pl|vinted\.pl|santander\.pl)$/.test(h))tips.push(['bad','Adres zawiera nazwę znanej firmy, ale <b>nie jest jej domeną</b>. To częsty sposób oszustów (np. „olx.kupteraz…”).']);
 if(/\.(sbs|top|xyz|click|shop|online|icu|cfd|buzz)$/.test(h))tips.push(['warn','Nietypowa końcówka domeny, często spotykana w kampaniach phishingowych. Sama w sobie nie przesądza.']);
 if(/\d{4,}/.test(h))tips.push(['warn','W nazwie domeny jest długi ciąg cyfr.']);
 if(/(netlify\.app|vercel\.app|web\.app|github\.io|blogspot|weebly|wixsite)$/.test(h))tips.push(['warn','Darmowy hosting – banki i urzędy z niego nie korzystają.']);
 if(h.startsWith('xn--')||h.includes('.xn--'))tips.push(['bad','Domena z nietypowymi znakami (punycode) – może udawać inny adres.']);
 if(/doplat|weryfik|odbierz|zwrot|blokad|logowan|platnosc/.test(u.href.toLowerCase()))tips.push(['warn','W adresie są słowa typowe dla wyłudzeń („dopłata”, „weryfikacja”, „odbierz”).']);
 if(u.protocol==='http:')tips.push(['warn','Brak https.']);
 document.getElementById('v22out').innerHTML=`<div class="card"><p><b>Domena:</b> ${esc(h)}</p>${tips.length?tips.map(t=>`<p class="v22t ${t[0]}">${t[0]==='ok'?'✅':t[0]==='bad'?'⛔':'⚠️'} ${t[1]}</p>`).join(''):'<p class="v22t">Brak oczywistych sygnałów w samym adresie. <b>To nie znaczy, że strona jest bezpieczna.</b></p>'}
 <p class="muted">Masz wątpliwości? Nie wpisuj danych. Zgłoś adres do CERT.</p><a class="btn sec" href="#/zglos-oszustwo/www">Zgłoś ten link ${DEMO}</a></div>`;F={url:raw}};

// ---------- po oszustwie ----------
const STEPS=[['bank','🏦 Zadzwoń do banku i zablokuj lub zastrzeż kartę','W aplikacji banku albo na infolinii z odwrotu karty. Liczy się czas. Poproś wprost o zwrot nieautoryzowanej transakcji – według Rzecznika Finansowego bank powinien oddać pieniądze najpóźniej w kolejnym dniu roboczym (D+1), poza wyjątkami.'],
 ['pesel','🆔 Zastrzeż PESEL w mObywatelu','Bezpłatnie i od razu. Banki i firmy pożyczkowe muszą sprawdzać zastrzeżenie przy kredycie. Dalej możesz chodzić do lekarza, robić przelewy i wypłacać z bankomatu.','https://www.gov.pl/web/gov/zastrzez-swoj-numer-pesel-lub-cofnij-zastrzezenie'],
 ['pass','🔑 Zmień hasła','Najpierw do poczty i banku, potem do innych miejsc z tym samym hasłem. Włącz weryfikację dwuetapową.'],
 ['dev','📲 Usuń aplikacje do zdalnego dostępu','Jeśli „konsultant” kazał coś zainstalować (np. AnyDesk) – odinstaluj to i powiedz o tym bankowi.'],
 ['cert','📨 Zgłoś do CERT','SMS przekaż na 8080, a stronę lub e-mail zgłoś na incydent.cert.pl.','#/zglos-oszustwo'],
 ['pol','👮 Złóż zawiadomienie na policji','Weź korespondencję, potwierdzenia przelewów, numer konta lub portfela oszusta. Zaświadczenie dołącz do reklamacji w banku.'],
 ['fam','👪 Ostrzeż bliskich','Jeśli przejęto Twoje konto w mediach społecznościowych, uprzedź znajomych, że to nie Ty prosisz o pieniądze.']];
function after(){const done=(()=>{try{return JSON.parse(localStorage.getItem(KEY+'_done')||'{}')}catch(e){return {}}})();const n=STEPS.filter(s=>done[s[0]]).length;
 shell('✅ Po oszustwie – krok po kroku',`
 <div class="alert r">⏱️<div><b>Liczy się czas. Zacznij od banku.</b> Odhaczenia zostają tylko na tym telefonie.</div></div>
 <div class="v22prog"><i style="width:${n/STEPS.length*100}%"></i></div><p class="muted">${n} z ${STEPS.length} kroków</p>
 <ol class="v22chk">${STEPS.map(s=>`<li class="${done[s[0]]?'on':''}"><label><input type="checkbox" ${done[s[0]]?'checked':''} onchange="v22Done('${s[0]}',this.checked)"><span><b>${s[1]}</b><small>${s[2]}</small>${s[3]?`<a href="${s[3]}"${/^http/.test(s[3])?' target="_blank" rel="noopener"':''}>Przejdź →</a>`:''}</span></label></li>`).join('')}</ol>
 <a class="btn sec" href="tel:112">📞 112 – gdy zagrożone jest życie lub oszust jest na miejscu</a>${src('rf','cbzc','pesel')}`,{tab:'security'})}
window.v22Done=function(k,on){let d={};try{d=JSON.parse(localStorage.getItem(KEY+'_done')||'{}')}catch(e){}d[k]=on;try{localStorage.setItem(KEY+'_done',JSON.stringify(d))}catch(e){}after()};

// ---------- asystent ----------
const RE=/dziwn\w* (sms|wiadomos)|podejrzan\w* (sms|wiadomos|link|stron|telefon|e-?mail)|zglos\w* oszust|jak zglosic (oszust|sms|phishing|link)|oszust\w* (sms|telefon|bank|olx|inwestyc)|podszy\w*|spoofing|\b8080\b|\bcert\b|phishing|wyludz|stracil\w* pieniadz|oszukal\w*|oszukan\w*|sprawdz\w* (link|strone|adres)|dzwonil\w* (z banku|bank|policj)|doplat\w* do paczki/;
function v22Rule(q){const l=norm(q);if(!RE.test(l))return null;
 if(/stracil|oszukal|oszukan|podalem|podalam/.test(l))return [RE,'#/po-oszustwie','Najpierw zadzwoń do banku i zablokuj kartę – liczy się czas. Potem zastrzeż PESEL w mObywatelu, zmień hasła, zgłoś sprawę do CERT (SMS na 8080, strony na incydent.cert.pl) i na policję. Otworzę listę kroków. Odpowiedź z reguł w telefonie, bez AI.'];
 if(/sprawdz\w* (link|strone|adres)/.test(l))return [RE,'#/sprawdz-link','Nie wydam werdyktu, ale pokażę wskazówki z samego adresu i wyjaśnię Listę Ostrzeżeń CERT Polska (lista.cert.pl). W razie wątpliwości nie wpisuj danych i zgłoś link. Odpowiedź z reguł w telefonie, bez AI.'];
 if(/sms|wiadomos|8080|paczk/.test(l))return [RE,'#/zglos-oszustwo/sms','Nie klikaj linku i nie odpisuj. Przekaż całego SMS-a, razem z linkiem, bezpłatnie na numer 8080 – to CERT Polska. Pomogę przygotować zgłoszenie. Odpowiedź z reguł w telefonie, bez AI.'];
 if(/dzwonil|telefon|podszy|spoofing/.test(l))return [RE,'#/zglos-oszustwo/call','Rozłącz się i sam zadzwoń do banku numerem z karty. Bank ani policja nie każą przelewać pieniędzy na „bezpieczne konto” ani instalować aplikacji. Pomogę zgłosić. Odpowiedź z reguł w telefonie, bez AI.'];
 return [RE,'#/zglos-oszustwo','Oszustwo zgłosisz do CERT Polska: SMS przekaż na 8080, stronę lub e-mail zgłoś na incydent.cert.pl. Gdy chodzi o pieniądze – najpierw bank, potem policja. Otworzę „Zgłoś oszustwo” z kategoriami. Odpowiedź z reguł w telefonie, bez AI.']}
window.v22Rule=v22Rule;
const _ask=ask;
ask=async function(q){const hit=v22Rule(q);if(!hit)return _ask.apply(this,arguments);
 q=(q||'').trim();if(!q)return;if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});window.v14Last={k:'rules',fb:false};
 chat.push({r:'a',t:hit[2]+'<br><b>Czy chcesz kontynuować?</b>',act:hit[1]});drawChat();try{speak(String(hit[2]).replace(/<[^>]+>/g,''))}catch(e){}};
window.ask=ask;
if(window.v18Route){const _v=window.v18Route;window.v18Route=function(q){const hit=v22Rule(q);if(hit)return {kind:'act',hit:hit,act:hit[1]};return _v(q)}}
try{INT.unshift([/zg[lł]o[sś] oszust|dziwn\w* sms|8080|cert/i,'#/zglos-oszustwo','Pomogę zgłosić oszustwo do CERT Polska. To reguła w telefonie, bez AI.']);
 ALL.push(['🚨','Zgłoś oszustwo (CERT, 8080, bank, policja)','#/zglos-oszustwo','oszustwo cert 8080 sms phishing link spoofing bank policja zgłoś incydent wyłudzenie olx inwestycja'],
  ['🔎','Sprawdź link','#/sprawdz-link','link strona adres phishing lista ostrzeżeń cert'],['✅','Po oszustwie – co zrobić','#/po-oszustwie','straciłem pieniądze zastrzeż kartę pesel hasła bank'])}catch(e){}

// ---------- wejścia ----------
const TILE=id=>`<a id="${id}" class="v22go" href="#/zglos-oszustwo"><b>🚨 Zgłoś oszustwo</b><small>Dziwny SMS, fałszywa strona, telefon „z banku” · CERT 8080 · co po oszustwie</small></a>`;
function inject(){const sc=app.querySelector('.scroll');if(!sc)return;const p=top();
 if(p==='security'&&!sc.querySelector('#v22sec')){const a=sc.querySelector('#v21sec');a?a.insertAdjacentHTML('afterend',TILE('v22sec')):sc.insertAdjacentHTML('afterbegin',TILE('v22sec'))}
 if(p==='zglos-podrobke'&&!sc.querySelector('#v22pod'))sc.insertAdjacentHTML('afterbegin',TILE('v22pod').replace('Dziwny SMS, fałszywa strona, telefon „z banku”','Inne oszustwo? Wszystkie kategorie i oficjalne kanały'));
 if(p==='podrobki'&&!sc.querySelector('#v22hub'))sc.insertAdjacentHTML('beforeend',TILE('v22hub'));
 if(p==='assistant'&&!document.getElementById('v22chip')){const chips=[...sc.querySelectorAll('.chips')].filter(c=>!c.closest('.chat')&&!c.closest('.msg'));const box=chips[chips.length-1];
  if(box)box.insertAdjacentHTML('beforeend','<button type="button" class="chip" id="v22chip" onclick="ask(\'dostałem dziwnego SMS-a\')">Dostałem dziwnego SMS-a</button><button type="button" class="chip" onclick="ask(\'jak zgłosić oszustwo\')">Jak zgłosić oszustwo</button>')}
 const g=document.getElementById('v21grp');
 if(g&&!g.querySelector('[data-v22]')){const grid=g.querySelector('.grid');const s=g.querySelector('summary');if(s&&s.querySelector('b'))s.querySelector('b').textContent='Ochrona przed podróbkami i oszustwami';
  grid.insertAdjacentHTML('afterbegin',[['🚨','Zgłoś oszustwo','#/zglos-oszustwo'],['🔎','Sprawdź link','#/sprawdz-link'],['✅','Po oszustwie','#/po-oszustwie']].map(t=>`<button type="button" class="tile" data-v22="1" onclick="location.hash='${t[2]}'"><b>${t[0]}</b>${t[1]}</button>`).join(''));
  const n=g.querySelector('summary .muted');if(n)n.textContent=String(grid.querySelectorAll('.tile').length)}}
const R={'zglos-oszustwo':()=>sub()?flow():hub(),'sprawdz-link':link,'po-oszustwie':after};
const _r=route;
route=function(){const p=top();if(R[p]){if(p==='zglos-oszustwo'&&!sub()&&!/sprawdz-link/.test(document.referrer))F=F.url?{url:F.url}:{};R[p]();try{inject()}catch(e){}return}const out=_r.apply(this,arguments);try{inject()}catch(e){}return out};
window.route=route;onhashchange=route;
const prevReset=window.resetDemo||resetDemo;
window.resetDemo=resetDemo=function(){try{localStorage.removeItem(KEY);localStorage.removeItem(KEY+'_done')}catch(e){}return prevReset()};
new MutationObserver(()=>{try{inject()}catch(e){}}).observe(app,{childList:true});
const st=document.createElement('style');st.textContent=`
.v22go{display:flex;flex-direction:column;gap:2px;background:linear-gradient(135deg,#b3261e,#7a1610);color:#fff;text-decoration:none;border-radius:18px;padding:14px 16px;margin:0 0 12px;box-shadow:0 8px 22px #b3261e33}
.v22go b{font-size:1.2em}.v22go small{opacity:.95}body.senior .v22go{padding:20px}body.senior .v22go b{font-size:1.6em}body.senior .v22go small{font-size:1.05em}
.v22hero{background:#eef3ff;border-left:5px solid #0b3d91;border-radius:14px;padding:12px 14px;margin:0 0 12px;display:flex;flex-direction:column;gap:4px}
.v22money{display:flex;flex-direction:column;gap:2px;background:#b3261e;color:#fff;text-decoration:none;border-radius:16px;padding:14px;margin:0 0 12px}.v22money b{font-size:1.15em}body.senior .v22money b{font-size:1.5em}
.v22cats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 12px}body.senior .v22cats{grid-template-columns:1fr}
.v22cat{display:flex;flex-direction:column;gap:4px;background:#fff;border:2px solid #dde5f5;color:#0b2350;text-decoration:none;border-radius:16px;padding:12px;min-height:80px}.v22cat small{color:#555}
body.senior .v22cat b{font-size:1.35em}body.senior .v22cat small{font-size:1.05em}
.v22row{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px}.v22row .btn{flex:1}
.v22case{background:#fff4e5;border-radius:14px;padding:12px;margin:0 0 12px;display:flex;flex-direction:column;gap:4px}.v22case b{font:800 1.2em ui-monospace,monospace}body.senior .v22case b{font-size:1.5em}
.v22pl{border-bottom:1px solid #eee;padding:6px 0}.v22pl span{font-size:.85em;color:#555}.v22pl p{margin:2px 0;white-space:pre-wrap;word-break:break-word}body.senior .v22pl p{font-size:1.2em}
.v22strip{color:#14804a;font-weight:700}.btn.v22real{background:#14804a}body.senior .btn.v22real{font-size:1.3em;min-height:72px}
.v22bank{background:#fff4e5;border-radius:14px;padding:12px;margin:8px 0}body.senior .v22bank{font-size:1.2em}
.v22t{padding:8px 10px;border-radius:10px;background:#f3f5f9}.v22t.bad{background:#fdecea}.v22t.warn{background:#fff4e5}.v22t.ok{background:#eefaf1}
.v22prog{height:10px;background:#e3e8f3;border-radius:9px;overflow:hidden}.v22prog i{display:block;height:100%;background:#14804a}
.v22chk{list-style:none;padding:0}.v22chk li{background:#fff;border-radius:14px;margin:0 0 8px;padding:12px;box-shadow:0 1px 3px #0001}.v22chk li.on{opacity:.7;background:#eefaf1}
.v22chk label{display:flex;gap:10px;align-items:flex-start}.v22chk input{width:24px;height:24px;flex:none}.v22chk span{display:flex;flex-direction:column;gap:3px}.v22chk small{color:#444}
body.senior .v22chk b{font-size:1.25em}body.senior .v22chk small{font-size:1.08em}body.senior .v22chk input{width:34px;height:34px}
body.contrast .v22cat,body.contrast .v22hero,body.contrast .v22case,body.contrast .v22chk li,body.contrast .v22bank,body.contrast .v22t{background:#000;color:#fff;border:2px solid #fff}
`;document.head.appendChild(st);
inject();route();
})();
