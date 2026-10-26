// ===== v8: persony, asystent jako główne wejście, nowe sprawy (OC, mandat, emerytura, dane skanem, upoważnienia) =====
// Autor koncepcji: Tomasz Krawczyk – Supplemental. Wszystkie osoby, kwoty i terminy są fikcyjne (DEMO).
S.v8=S.v8||{oc:{},mandat:{st:'do zapłaty'},log:[],upow:{in:{},out:{}},rxStore:{},przStore:{}};
S.persona=S.persona||'anna';
const PERS={
 anna:{name:'Anna',full:'Anna Kowalska',age:35,city:'Warszawa',bio:'Mama trójki dzieci, pracuje na etacie.',addr:'ul. Przykładowa 12/4, 00-001 Warszawa',
  todo:[['🚗','OC Corolli kończy się za 12 dni','#/oc',1],['📩','Pismo z urzędu skarbowego – sprawdź termin','#/explain',0],['🩺','Wynik LDL powyżej normy – zobacz w Moim zdrowiu','#/zdrowie',0]],
  chips:['Zgubiłem portfel','Kończy się OC','Dziecko się urodziło'],
  veh:[['WX 12345','Toyota Corolla','2026-11-04',780]],
  sample:'Naczelnik Urzędu Skarbowego Warszawa-Mokotów wzywa do złożenia korekty zeznania PIT-37 za 2025 r. w terminie 14 dni od dnia doręczenia niniejszego wezwania.',rem:null},
 piotr:{name:'Piotr',full:'Piotr Malinowski',age:43,city:'Kraków',bio:'Prowadzi firmę transportową, dwa auta i bus.',addr:'ul. Floriańska 8, 31-021 Kraków',
  todo:[['📩','Wezwanie z urzędu skarbowego (VAT) – termin 7 dni','#/explain',1],['🚐','OC busa kończy się 12.11','#/oc',1],['🚫','PESEL zastrzeżony – kredyt na auto','#/flow/pesel',0]],
  chips:['Dostałem wezwanie z US','Odnów OC busa','Chcę założyć firmę'],
  veh:[['KR 7788A','Renault Master (bus)','2026-11-12',1420],['KR 1020B','VW Passat','2027-03-01',910]],
  sample:'Naczelnik Urzędu Skarbowego Kraków-Podgórze wzywa do złożenia wyjaśnień w sprawie rozbieżności w deklaracji VAT-7 za wrzesień 2026 r. Wyjaśnienia należy złożyć w terminie 7 dni od dnia doręczenia wezwania.',
  rem:[{t:'Wyjaśnienia VAT dla US',d:'2026-10-31',i:'📩',a:'#/explain'},{t:'OC busa (KR 7788A)',d:'2026-11-12',i:'🚐',a:'#/oc'},{t:'Rata kredytu na auto',d:'2026-11-05',i:'💳',a:'#/money'}]},
 halina:{name:'Halina',full:'Halina Wrona',age:57,city:'Lublin',bio:'Nauczycielka, opiekuje się mamą.',addr:'ul. Narutowicza 15, 20-004 Lublin',
  todo:[['🆔','Dowód traci ważność za 48 dni','#/flow/dowod',1],['👵','Recepty mamy do odebrania','#/upowaz',0],['📈','Sprawdź prognozę emerytury','#/emerytura',0]],
  chips:['Kiedy kończy się mój dowód','Prognoza emerytury','Recepty mamy'],
  veh:[['LU 4455C','Fiat Panda','2027-05-10',640]],
  sample:'Dyrektor Szkoły Podstawowej nr 7 w Lublinie wzywa do uzupełnienia dokumentów w ramach awansu zawodowego nauczyciela w terminie 14 dni od dnia doręczenia wezwania.',
  rem:[{t:'Ważność dowodu osobistego',d:'2026-12-10',i:'🆔',a:'#/flow/dowod'},{t:'Recepta mamy – Perindopryl',d:'2026-12-30',i:'👵',a:'#/upowaz'}]},
 kuba:{name:'Kuba',full:'Jakub Lis',age:20,city:'Gdańsk',bio:'Student, prawo jazdy od roku.',addr:'ul. Wita Stwosza 12, 80-308 Gdańsk',
  todo:[['🚦','Mandat 200 zł i 3 punkty karne','#/mandat',1],['🗳️','Głosuję w Gdańsku, nie w Elblągu','#/flow/miejsce',0],['🎓','Legitymacja studencka w telefonie','#/wallet',0]],
  chips:['Dostałem mandat','Zmień miejsce głosowania','Pokaż dane jednym skanem'],
  veh:[],
  sample:'Komendant Straży Miejskiej w Gdańsku informuje o nałożeniu mandatu karnego kredytowanego za przekroczenie prędkości. Od mandatu można odmówić przyjęcia w dniu wystawienia.',
  rem:[{t:'Zapłata mandatu',d:'2026-10-30',i:'🚦',a:'#/mandat'},{t:'Wybory – zmiana miejsca głosowania',d:'2027-10-10',i:'🗳️',a:'#/flow/miejsce'}]}};
const REM_ANNA=REM.filter(x=>!/Polisa OC/.test(x.t));REM_ANNA.push({t:'OC Corolli (WX 12345)',d:'2026-11-04',i:'🚗',a:'#/oc'});REM_ANNA.sort((a,b)=>a.d.localeCompare(b.d));if(S.persona=='anna'){REM.length=0;REM.push(...REM_ANNA)}
const RX0={anna:null,piotr:[],halina:[{id:11,lek:'Bisoprolol 5 mg, 28 tabl.',dawka:'1 tabl. rano',kod:'2604',do:'2027-01-05',st:'aktywna',stale:true,szt:28,dz:1,start:'2026-10-15'}],kuba:[]};
function applyPersona(k,boot){const o=S.persona;const P=PERS[k];if(!P)return;
 if(!boot){S.v8.casesStore=S.v8.casesStore||{};S.v8.casesStore[o]=S.cases;S.cases=S.v8.casesStore[k]||[];S.v8.rxStore[o]=S.v7.rx;S.v8.przStore[o]=S.v7.prz;S.v7.rx=S.v8.rxStore[k]||(RX0[k]===null?S.v8.rxStore.anna||S.v7.rx:RX0[k].map(x=>Object.assign({},x)));S.v7.prz=S.v8.przStore[k]||[]}
 S.persona=k;Object.assign(U,{name:P.name,full:P.full,addr:P.addr});
 REM.length=0;REM.push(...(P.rem?P.rem:REM_ANNA));REM.sort((a,b)=>a.d.localeCompare(b.d));save()}
function setPersona(k){if(k==S.persona)return;applyPersona(k);toast('Zalogowano jako '+PERS[k].full+' (DEMO)');location.hash='#/home';route();syncSide()}
function syncSide(){const s=document.getElementById('perSide');if(s)s.value=S.persona}
// przy starcie dla Anny RX zostaje z v7; dla pozostałych podmieniamy
if(S.persona!='anna')applyPersona(S.persona,true);
// pasek wyboru osoby w menu bocznym
(function(){const h=document.querySelector('.side h1');if(h&&!document.getElementById('perSide'))h.insertAdjacentHTML('afterend',`<label class="muted" style="font-size:.8em">Osoba w pokazie</label><select id="perSide" onchange="setPersona(this.value)" style="width:100%;margin:2px 0 10px">${Object.entries(PERS).map(([k,p])=>`<option value="${k}">${p.full}, ${p.age}, ${p.city}</option>`).join('')}</select>`);syncSide()})();

// ---------- FACE ID (symulacja) ----------
function faceId(what,cb){const m=modal(`<h3>🙂 Potwierdź twarzą</h3><p class="muted">Potwierdzasz: <b>${esc(what)}</b></p><div style="text-align:center;font-size:4em;margin:10px">🫥</div><p class="muted">Symulacja – kamera nie jest używana i nie zapisujemy żadnych danych biometrycznych.</p><button class="btn" id="fid">Potwierdź (DEMO)</button><button class="btn ghost" onclick="closeModal()">Anuluj</button>`);
 m.querySelector('#fid').onclick=()=>{m.querySelector('.sheet').innerHTML='<div style="text-align:center;font-size:4em">🙂</div><p style="text-align:center">Rozpoznano…</p>';setTimeout(()=>{closeModal();cb()},900)}}

// ---------- ASYSTENT: wyszukiwanie rozmyte, przyciski w rozmowie, scenariusze ----------
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l');
const stm=w=>w.length>5?w.slice(0,5):w;
function fuzzy(q){const qt=norm(q).split(/[^a-z0-9]+/).filter(w=>w.length>2).map(stm);if(!qt.length)return[];
 return ALL.map(a=>{const txt=norm(a[1]+' '+(a[3]||''));const tk=txt.split(/[^a-z0-9]+/).map(stm);let s=0;qt.forEach(w=>{if(tk.includes(w))s+=2;else if(txt.includes(w))s+=1});return[s,a]}).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]).slice(0,3).map(x=>x[1])}
drawChat=function(){const c=$('#chat');if(!c)return;c.innerHTML=chat.map((m,i)=>`<div class="msg ${m.r}">${m.t}${m.act?`<div style="margin-top:8px"><button class="btn small" onclick="doAct('${m.act}')">✔ Tak, przejdź dalej</button><button class="btn ghost small" onclick="chat.push({r:'a',t:'W porządku, nic nie robię.'});drawChat()">✖ Nie</button></div>`:''}${m.btns?`<div class="chips" style="margin-top:8px">${m.btns.map((b,j)=>`<button class="chip" onclick="chatBtn(${i},${j})">${b[0]}</button>`).join('')}</div>`:''}${m.cards?`<div class="chips" style="margin-top:8px">${m.cards.map(a=>`<a class="chip" href="${a[2]}">${a[0]} ${esc(a[1])}</a>`).join('')}</div>`:''}</div>`).join('');const sc=app.querySelector('.scroll');if(sc)sc.scrollTop=sc.scrollHeight};
function chatBtn(i,j){const b=chat[i].btns[j];chat[i].btns=null;drawChat();b[1]()}
function say(t,extra){chat.push(Object.assign({r:'a',t},extra||{}));drawChat();try{speak(t.replace(/<[^>]+>/g,''))}catch(e){}}
function scenWallet(){say(`Przykro mi, ${esc(U.name)}. Mogę od razu: zastrzec dowód osobisty i prawo jazdy w Systemie Dokumenty Zastrzeżone (obejmuje dokumenty tożsamości, nie karty) oraz przekazać prośbę o blokadę kart do Twojego banku (DEMO). Kartę zastrzeżesz też sam/a pod 828 828 828, całodobowo. Zrobię to jednym potwierdzeniem.`,{btns:[['🔒 Zastrzeż dokumenty i poproś bank o blokadę kart',()=>faceId('Zastrzeżenie dowodu, prawa jazdy i kart',()=>{S.blocked=today.toLocaleDateString('pl-PL');S.cases.push({t:'Zastrzeżenie dokumentów po zgubieniu portfela',no:caseNo(),st:'Zastrzeżono'});save();say('Gotowe ✅ Dowód i prawo jazdy zastrzeżone, prośba o blokadę kart przekazana do banku (DEMO) – dla pewności zadzwoń pod 828 828 828. Jeśli portfel się znajdzie, możesz je odblokować w ciągu 14 dni (DEMO). Nowy dowód możesz zamówić teraz.',{btns:[['🆔 Zamów nowy dowód',()=>location.hash='#/flow/dowod'],['📣 Zgłoś kradzież na policję',()=>location.hash='#/report']]})})],['Nie teraz',()=>say('W porządku. Gdybyś zmienił/a zdanie, napisz „zgubiłem portfel”.')]]})}
function scenOC(){const v=PERS[S.persona].veh;if(!v.length)return say('Nie widzę w rejestrach pojazdów zarejestrowanych na Ciebie, więc nie ma polisy OC do odnowienia.');const [pl,n,d,pr]=v[0];const dl=days(S.v8.oc[pl]||d);
 say(`Polisa OC dla ${esc(n)} (${pl}) ${dl>=0?'kończy się za <b>'+dl+' dni</b>':'wygasła'}. Najtańsza oferta w porównaniu (DEMO): <b>${_p(Math.round(pr*0.88))}</b> za rok.`,{btns:[['💸 Kup najtańszą',()=>ocBuy(pl,0.88)],['🔍 Porównaj oferty',()=>location.hash='#/oc']]})}
async function ask2(q){q=(q||'').trim();if(!q)return;if($('#q'))$('#q').value='';chat.push({r:'u',t:esc(q)});drawChat();const l=norm(q);
 if(/zgubi|ukrad|zginal|portfel/.test(l)&&!/legitym/.test(l))return scenWallet();
 if(/\boc\b|polis|ubezpiecz/.test(l)&&/(odnow|kupi|kon[cć]z|koncz|sprawdz|oc)/.test(l))return scenOC();
 const hit=INT.find(([re])=>re.test(q.toLowerCase()));
 let t=hit?hit[2]:null,cards=null;
 if(!hit){cards=fuzzy(q);t=cards.length?'Nie jestem pewien, o którą sprawę chodzi. Najbliżej pasują:':'Nie znalazłem takiej sprawy w katalogu. Mogę pomóc m.in. w: pismach i terminach, zgłoszeniach, receptach, biletach, OC, mandatach, wyborach i sprawach sądowych. Opisz to inaczej albo otwórz <a href="#/guide">przewodnik</a>.';if(!cards.length)cards=null}
 if(window.aiOn&&aiOn()&&!hit)return aiAssist(q,hit,cards); // trafienie reguły ma pierwszeństwo przed modelem
 chat.push({r:'a',t:t+(hit?'<br><b>Czy chcesz kontynuować?</b>':''),act:hit?hit[1]:null,cards});drawChat();try{speak(String(t).replace(/<[^>]+>/g,''))}catch(e){}}
ask=ask2;
function homeAsk(v){v=(v||'').trim();if(!v)return;location.hash='#/assistant';setTimeout(()=>ask(v),200)}
function homeMic(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast('Przeglądarka nie obsługuje rozpoznawania mowy – wpisz pytanie.');const r=new SR();r.lang='pl-PL';r.onresult=e=>homeAsk(e.results[0][0].transcript);r.onerror=()=>toast('Nie usłyszałem – spróbuj ponownie');r.start()}

// ---------- EKRAN GŁÓWNY: asystent + sprawy osoby ----------
const _home8=home;home=function(){_home8();const sc=app.querySelector('.scroll');if(!sc)return;const P=PERS[S.persona];
 if(S.persona!='anna')[...sc.querySelectorAll('.alert')].filter(x=>/Nakaz zapłaty z e-Sądu|Kończy się zapas/.test(x.innerText)).forEach(x=>x.remove());
 const top=`<div class="card" style="background:var(--blue,#1f4fbf);color:#fff"><b style="font-size:1.05em">Co chcesz załatwić?</b><div style="display:flex;gap:6px;margin-top:8px"><input id="hq" placeholder="Np. „kończy się OC”" aria-label="Co chcesz załatwić? Napisz lub powiedz" style="flex:1" onkeydown="if(event.key=='Enter')homeAsk(this.value)"><button class="mic" onclick="homeMic()" aria-label="Mów">🎤</button><button class="mic" onclick="homeAsk($('#hq').value)" aria-label="Wyślij">➤</button></div><div class="chips" style="margin-top:8px">${P.chips.map(c=>`<button class="chip" onclick="homeAsk('${c.replace(/'/g,"\\'")}')">${c}</button>`).join('')}</div></div>
 <div class="card"><h3>📌 Do załatwienia</h3>${P.todo.map(([i,t,h,u])=>`<div class="row" onclick="location.hash='${h}'" style="cursor:pointer"><span>${i} ${t}</span><b style="color:${u?'var(--red)':'var(--mut)'}">›</b></div>`).join('')}</div>`;
 const first=sc.querySelector('.alert')||sc.firstChild;sc.insertAdjacentHTML('afterbegin',top);
 const hs=sc.querySelector('h1,h2');
 sc.insertAdjacentHTML('afterbegin',`<div class="chips" style="margin-bottom:6px"><span class="muted" style="align-self:center">Osoba:</span>${Object.entries(PERS).map(([k,p])=>`<button class="chip ${k==S.persona?'on':''}" style="${k==S.persona?'background:var(--blue,#1f4fbf);color:#fff':''}" onclick="setPersona('${k}')" title="${p.full}, ${p.city}">${p.name}</button>`).join('')}</div>`);
 const vis=[...sc.children].filter(x=>x.classList.contains('alert')&&x.style.display!='none');if(vis.length>2)vis.slice(2).forEach(x=>x.style.display='none')};

// ---------- OC: porównanie ofert ----------
const OFERTY=[['Towarzystwo Alfa',1],['Towarzystwo Beta',.93],['Towarzystwo Gamma',1.08],['Towarzystwo Delta',.88]];
function oc(){const P=PERS[S.persona];
 shell('🚗 Ubezpieczenie OC',`<div class="alert b">🛡️<div>Sprawdzamy w rejestrach, kiedy kończy się Twoja polisa OC, i porównujemy oferty. Brak ciągłości ubezpieczenia może skutkować opłatą dla Ubezpieczeniowego Funduszu Gwarancyjnego (UFG).</div></div>
 ${P.veh.length?P.veh.map(([pl,n,d,pr])=>{const end=S.v8.oc[pl]||d;const dl=days(end);return card('🚗 '+esc(n)+' • '+pl,`<div class="row"><span>OC ważne do</span><b style="color:${dl<30?'var(--red)':'var(--ok)'}">${fmt(new Date(end))} (${dl} dni)</b></div>${S.v8.oc[pl]?'<p style="color:var(--ok)"><b>✅ Polisa odnowiona</b></p>':OFERTY.map(([n2,k])=>`<div class="row"><span>${n2}<br><span class="muted">OC, 12 mies., zniżka za bezszkodowość (z historii UFG – koncepcja)</span></span><button class="chip" onclick="ocBuy('${pl}',${k})">${_p(Math.round(pr*k))}</button></div>`).join('')}`)}).join(''):'<p class="muted">Nie widzimy pojazdów zarejestrowanych na Ciebie.</p>'}
 <p class="muted">Ceny i oferty są przykładowe (DEMO). Prawdziwa porównywarka wymaga umów z towarzystwami ubezpieczeniowymi oraz Twojej zgody na wykorzystanie historii ubezpieczeniowej. Aplikacja nie jest pośrednikiem ubezpieczeniowym.</p>`,{tab:'more'})}
function ocBuy(pl,k){const P=PERS[S.persona];const v=P.veh.find(x=>x[0]==pl);if(!v)return;const pr=Math.round(v[3]*k);faceId(`Zakup OC ${pl} – ${_p(pr)}`,()=>{const end=iso(addDays(new Date(S.v8.oc[pl]||v[2]),365));S.v8.oc[pl]=end;S.v7.tix.push({n:'🚗 OC '+pl,v:'ważne do '+fmt(new Date(end)),q:'OC'+pl+end});S.cases.push({t:'OC '+pl,no:caseNo(),st:'Opłacone'});save();if(location.hash.includes('assistant'))say(`Polisa kupiona ✅ OC dla ${pl} ważne do ${fmt(new Date(end))}. Potwierdzenie jest w „Bilety i opłaty”.`);else{oc();toast('Polisa OC kupiona ✅ (DEMO)')}})}

// ---------- MANDAT I PUNKTY KARNE ----------
function mandat(){const M=S.v8.mandat;const kuba=S.persona=='kuba';
 shell('🚦 Mandaty i punkty karne',`${kuba||M.st!='do zapłaty'?card('🚦 Mandat karny kredytowany',`<div class="row"><span>Przekroczenie prędkości (Gdańsk)</span><b>200 zł</b></div><div class="row"><span>Punkty karne</span><b>3</b></div><div class="row"><span>Status</span><b style="color:${M.st=='do zapłaty'?'var(--red)':'var(--ok)'}">${M.st}</b></div>${M.st=='do zapłaty'?`<button class="btn" onclick="faceId('Zapłata mandatu 200 zł (BLIK)',()=>{S.v8.mandat.st='opłacony';save();mandat();toast('Mandat opłacony ✅ (DEMO)')})">Zapłać BLIK-iem</button><a class="btn ghost" href="#/appeal">✍️ Chcę się odwołać / wyjaśnić</a>`:'<p class="muted">Dziękujemy. Punkty karne wpisuje się do rejestru kierowców po zapłacie (DEMO).</p>'}`):'<div class="alert g">✅<div>Brak mandatów i punktów karnych w rejestrze.</div></div>'}
 ${card('📊 Stan punktów',`<div class="bar"><i style="width:${(kuba&&M.st!='nowy'?3:0)/24*100}%"></i></div><p>${kuba?3:0} pkt • limit zależy od kategorii kierowcy (dla początkujących jest niższy – sprawdź w CEPiK, dane w prototypie przykładowe)</p>`)}
 ${card('Co dalej',rowl('✍️','Odwołanie lub wyjaśnienie','#/appeal')+rowl('⏱️','Kalkulator terminów','#/deadline')+rowl('🧑‍⚖️','Nieodpłatna porada prawna','#/help'))}
 <p class="muted">Dane przykładowe. O skutkach prawnych odmowy przyjęcia mandatu i zasadach wykreślania punktów decydują przepisy – sprawdź w pouczeniu na mandacie.</p>`,{tab:'more'})}

// ---------- PROGNOZA EMERYTURY ----------
function emerytura(){const P=PERS[S.persona];
 shell('📈 Prognoza emerytury',`<div class="alert y">ℹ️<div><b>Wzór uproszczony (DEMO).</b> Nie uwzględnia waloryzacji, subkonta ani okresów nieskładkowych. Oficjalną prognozę wylicza ZUS – w pełnej wersji pobieramy ją z konta PUE.</div></div>
 ${card('Twoje założenia',`<label>Lata składkowe do emerytury</label><input id="em1" type="number" value="35" oninput="emCalc()"><label>Średnie wynagrodzenie brutto (zł/mies.)</label><input id="em2" type="number" value="6200" oninput="emCalc()"><label>Wiek przejścia na emeryturę</label><select id="em3" onchange="emCalc()"><option value="60">60 lat</option><option value="65" selected>65 lat</option></select><div id="emo"></div>`)}
 <a class="btn ghost" href="#/privacy">🔒 Kto widział moje dane ZUS</a>`,{tab:'more'});emCalc()}
function emCalc(){const l=+$('#em1').value||0,w=+$('#em2').value||0,a=+$('#em3').value;const kap=0.1952*w*12*l;const mies=a==60?270:220;const em=kap/mies;
 $('#emo').innerHTML=`<div class="row"><span>Zgromadzony kapitał (szac.)</span><b>${_p(kap)}</b></div><div class="row"><span>Dalsze trwanie życia (przykład)</span><b>${mies} mies.</b></div><div class="card total"><div class="big">${_p(em)}</div><p class="muted">brutto miesięcznie, szacunek</p></div>`}

// ---------- DANE JEDNYM SKANEM ----------
const POLA=[['imie','Imię i nazwisko',()=>U.full],['wiek','Wiek 18+ (tak/nie)',()=>'tak'],['ur','Data urodzenia',()=>'12.05.1990'],['adres','Adres zamieszkania',()=>U.addr],['pj','Prawo jazdy kat. B',()=>'ważne do 2038'],['nr','Numer dokumentu',()=>'ABC 123456']];
const SZAB={'Wypożyczalnia samochodów':['imie','pj','adres'],'Sklep z alkoholem':['wiek'],'Hotel':['imie','nr'],'Zapis na zajęcia':['imie','ur']};
function skan(){const sel=S.v8.skan||'Sklep z alkoholem';
 shell('📲 Dane jednym skanem',`<div class="alert b">🔐<div>Pokaż odbiorcy <b>tylko to, czego potrzebuje</b>. Kod działa przez 5 minut i jest jednorazowy. Zobaczysz, kto go zeskanował.</div></div>
 ${card('Cel',`<select id="sc" onchange="S.v8.skan=this.value;save();skan()">${Object.keys(SZAB).map(k=>`<option ${k==sel?'selected':''}>${k}</option>`).join('')}</select>${POLA.map(([k,n,f])=>`<label class="chk"><input type="checkbox" ${SZAB[sel].includes(k)?'checked':''} data-k="${k}"> ${n}</label>`).join('')}<div style="text-align:center">${qrSVG('SCAN'+sel+Date.now())}</div><p class="muted" style="text-align:center">DEMO – kod nieważny poza prototypem</p><button class="btn" onclick="skanSim()">▶ Symuluj zeskanowanie przez odbiorcę</button>`)}
 ${S.v8.log.length?card('🕘 Historia udostępnień',S.v8.log.slice(-5).reverse().map(l=>`<div class="row"><span>${esc(l.k)}<br><span class="muted">${esc(l.p)}</span></span><b class="muted">${l.t}</b></div>`).join('')):''}`,{tab:'more'})}
function skanSim(){const ch=[...document.querySelectorAll('[data-k]:checked')].map(x=>x.dataset.k);const sel=$('#sc').value;const rows=POLA.filter(p=>ch.includes(p[0]));faceId('Udostępnienie danych: '+sel,()=>{S.v8.log.push({k:sel,p:rows.map(r=>r[1]).join(', ')||'nic',t:new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'})});save();modal(`<h3>🏪 Widok odbiorcy (${esc(sel)})</h3>${rows.map(([k,n,f])=>`<div class="row"><span>${n}</span><b>${esc(f())}</b></div>`).join('')||'<p class="muted">Nic nie udostępniono.</p>'}<p class="muted">Odbiorca nie widzi PESEL, zdjęcia ani pozostałych danych.</p><button class="btn" onclick="closeModal();skan()">Zamknij</button>`)})}

// ---------- UPOWAŻNIENIA ----------
const UPSEED={halina:{in:[{n:'Zofia Wrona (mama, 84)',z:'recepty i odbiór leków',rx:[{lek:'Perindopryl 5 mg, 30 tabl.',kod:'3317',do:'2026-12-30'},{lek:'Furosemid 40 mg, 30 tabl.',kod:'8841',do:'2027-01-10'}]}],out:[]},anna:{in:[],out:[{n:'Marek Kowalski (mąż)',z:'odbiór moich recept',do:'2027-10-23'}]}};
function upowaz(){const seed=UPSEED[S.persona]||{in:[],out:[]};const out=(seed.out||[]).concat(S.v8.upow.out[S.persona]||[]);
 shell('🤝 Upoważnienia',`<div class="alert b">🤝<div>Możesz upoważnić bliską osobę do wybranych spraw i odebrać zdalnie sprawy osoby, którą się opiekujesz. Zakres jest wąski, ma termin i możesz go cofnąć w każdej chwili.</div></div>
 ${seed.in.length?seed.in.map(a=>card('👵 Działam w imieniu: '+esc(a.n),`<p class="muted" style="margin:0">Zakres: ${esc(a.z)}</p>${a.rx.map(r=>`<div class="row"><span>💊 ${esc(r.lek)}<br><span class="muted">ważna do ${fmt(new Date(r.do))}</span></span><button class="chip" onclick="rxPokaz('${esc(r.lek)}','${r.kod}')">Pokaż w aptece</button></div>`).join('')}`)).join(''):''}
 ${card('Mogą działać w moim imieniu',out.map(a=>`<div class="row"><span>${esc(a.n)}<br><span class="muted">${esc(a.z)} • do ${fmt(new Date(a.do))}</span></span><button class="chip" onclick="cofnij('${esc(a.n)}')">cofnij</button></div>`).join('')||'<p class="muted">Nikt.</p>')}
 <a class="btn" href="#/flow/upowaz">➕ Nadaj upoważnienie</a>
 <p class="muted">Koncepcja: w praktyce wydanie leku opiera się na kodzie e-recepty, a upoważnienie do spraw w aplikacji wymaga podstawy prawnej i zgody osoby upoważniającej. Prototyp nie rozstrzyga zakresu.</p>`,{tab:'more'})}
function rxPokaz(lek,kod){modal(`<h3>💊 ${esc(lek)}</h3><div style="text-align:center">${qrSVG('RX'+kod)}</div><div class="big" style="text-align:center;letter-spacing:.3em;font-size:2.2em">${kod}</div><p class="muted"><b>DEMO – nieważny w aptece.</b></p><button class="btn" onclick="closeModal()">Zamknij</button>`)}
function cofnij(n){const a=S.v8.upow.out[S.persona]||[];S.v8.upow.out[S.persona]=a.filter(x=>x.n!=n);save();upowaz();toast('Upoważnienie cofnięte (DEMO)')}
F.upowaz={t:'Nadanie upoważnienia',i:'🤝',steps:[{h:'Kogo i do czego upoważniasz?',b:`<label>PESEL lub imię i nazwisko osoby</label><input name="kto" value="Marek Kowalski"><label>Zakres</label><select name="z"><option>odbiór moich recept</option><option>odbiór korespondencji z urzędów</option><option>sprawy zdrowotne (wizyty, skierowania)</option><option>opłacanie moich rachunków</option></select><label>Ważne do</label><input name="do" type="date" value="2027-10-23"><div class="alert y">ℹ️<div>Osoba upoważniona dostanie powiadomienie i musi je potwierdzić w swoim mObywatelu.</div></div>`}],
 sum:f=>[['Osoba',f.kto],['Zakres',f.z],['Do',f.do]],
 done:()=>{(S.v8.upow.out[S.persona]=S.v8.upow.out[S.persona]||[]).push({n:fs.kto,z:fs.z,do:fs.do});save();return'Upoważnienie nadane (DEMO). Możesz je cofnąć w „Upoważnieniach”.'}};

// ---------- INTEGRACJA ----------
const _expl8=explain;explain=function(){_expl8();const t=$('#ex');if(t)t.value=PERS[S.persona].sample};
ALL.push(['🚗','OC – porównanie ofert i odnowienie','#/oc','oc polisa ubezpieczenie samochód auto bus odnowienie ufg'],['🚦','Mandaty i punkty karne','#/mandat','mandat punkty karne grzywna straż miejska policja prędkość'],['📈','Prognoza emerytury','#/emerytura','emerytura zus kapitał składki prognoza'],['📲','Dane jednym skanem','#/skan','udostępnij dane skan qr wypożyczalnia hotel 18+ wiek'],['🤝','Upoważnienia – działam w imieniu bliskiej osoby','#/upowaz','upoważnienie pełnomocnik mama opieka recepty w imieniu']);
INT.unshift([/mandat|punkt[a-ząćęłńóśźż]* karn|fotoradar|straż miejsk/,'#/mandat','Pokażę mandat, punkty karne i pomogę zapłacić albo odwołać się.'],[/emerytur|prognoz\w* zus/,'#/emerytura','Policzę orientacyjną emeryturę z Twoich założeń; oficjalną prognozę wylicza ZUS.'],[/udostęp\w* dane|pokaż dane|wypożyczaln|skan\w* /,'#/skan','Udostępnisz odbiorcy tylko wybrane dane jednym skanem kodu, na 5 minut.'],[/upoważ|w imieniu|recepty (mamy|taty|dziecka)/,'#/upowaz','Pokażę upoważnienia: sprawy, które załatwiasz za bliską osobę, i osoby, które mogą działać za Ciebie.']);
const _more8=more;more=function(){_more8();const g=app.querySelector('.grid');if(g)g.insertAdjacentHTML('afterbegin',[['🚗','OC','#/oc'],['🚦','Mandaty','#/mandat'],['📈','Emerytura','#/emerytura'],['📲','Dane skanem','#/skan'],['🤝','Upoważnienia','#/upowaz']].map(([i,t,h])=>`<button class="tile" onclick="location.hash='${h}'"><b>${i}</b>${t}</button>`).join(''))};
const _guide8=guide;guide=function(){_guide8();const sc=app.querySelector('.scroll');if(sc)sc.insertAdjacentHTML('afterbegin',card('👤 Osoby w pokazie',Object.entries(PERS).map(([k,p])=>`<div class="row"><span><b>${p.full}</b>, ${p.age}, ${p.city}<br><span class="muted">${p.bio}</span></span><button class="chip" onclick="setPersona('${k}')">${k==S.persona?'✓ aktywna':'wybierz'}</button></div>`).join('')))};
Object.assign(window,{setPersona,applyPersona,faceId,chatBtn,homeAsk,homeMic,oc,ocBuy,mandat,emerytura,emCalc,skan,skanSim,upowaz,rxPokaz,cofnij,ask:ask2,drawChat,PERS,syncSide});

// ---------- ROUTER v8 ----------
const V8={oc,mandat,emerytura,skan,upowaz,explain:()=>explain(),guide:()=>guide(),more:()=>more()};
const _route7=route;route=function(){const h=location.hash.replace(/^#\//,'')||'home';const[p]=h.split('/');
 if(V8[p]){clearInterval(threatT);clearInterval(camT);V8[p]()}else _route7()};
onhashchange=route;route();
