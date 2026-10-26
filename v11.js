// ===== v11: „Moje zdrowie” – karta zdrowia w mObywatelu (własna koncepcja) =====
// Założenia: (1) wszystkie dane są fikcyjne, (2) żadne zgłoszenie nigdzie nie jest wysyłane,
// (3) karta ma być WIDOKIEM na dane z Internetowego Konta Pacjenta (IKP), a nie nowym rejestrem.
// Czego tu nie ma celowo: „żywych” kolejek SOR i bilansu „ile wpłaciłem, ile dostałem” jako konta pacjenta.
(()=>{
S.v11=Object.assign({who:'anna',tab:'karta',sens:false,scope:{leki:false,alergie:false,wyniki:false},nop:[],log:[],ice:false,num:null},S.v11||{});
const fd=d=>new Date(d).toLocaleDateString('pl-PL');
const ZHP={anna:{n:'Anna Kowalska',w:'dorosła'},jan:{n:'Jan Kowalski',w:'8 lat'},zofia:{n:'Zofia Kowalska',w:'3 lata'},stas:{n:'Staś Kowalski',w:'16 lat'},piotr:{n:'Piotr Malinowski',w:'dorosły'},halina:{n:'Halina Wrona',w:'dorosła'},kuba:{n:'Jakub Lis',w:'dorosły'}};
const ZHKIDS={anna:['jan','zofia','stas']};
const ZHV={
 anna:[{d:'2026-10-09',p:'Przychodnia POZ „Mokotów” (DEMO)',t:'Porada lekarza POZ',nfz:68},{d:'2026-09-22',p:'Poradnia kardiologiczna, Szpital Bielański (DEMO)',t:'Porada kardiologiczna',nfz:142},{d:'2026-08-05',p:'Poradnia zdrowia psychicznego (DEMO)',t:'Porada specjalistyczna',nfz:150,sens:true}],
 jan:[{d:'2026-10-02',p:'Przychodnia POZ „Mokotów” (DEMO)',t:'Porada lekarza POZ',nfz:68}],
 zofia:[{d:'2026-09-15',p:'Przychodnia POZ „Mokotów” (DEMO)',t:'Bilans zdrowia dziecka',nfz:96}],
 stas:[{d:'2026-06-20',p:'Przychodnia POZ „Mokotów” (DEMO)',t:'Porada lekarza POZ',nfz:68}],
 piotr:[{d:'2026-09-30',p:'Medycyna pracy – kierowcy, Kraków (DEMO)',t:'Badanie kierowcy zawodowego',nfz:0},{d:'2026-07-11',p:'Przychodnia POZ „Kazimierz” (DEMO)',t:'Porada lekarza POZ',nfz:68}],
 halina:[{d:'2026-10-05',p:'Przychodnia POZ „Czuby”, Lublin (DEMO)',t:'Porada lekarza POZ',nfz:68},{d:'2026-08-19',p:'Poradnia okulistyczna, SPSK1 Lublin (DEMO)',t:'Porada okulistyczna',nfz:120}],
 kuba:[{d:'2026-05-14',p:'Akademickie Centrum Medyczne, Gdańsk (DEMO)',t:'Porada lekarza POZ',nfz:68}]};
const ZHB={
 anna:[{d:'2026-09-22',n:'Cholesterol LDL',w:'128 mg/dl',r:'norma laboratorium: poniżej 115 mg/dl (DEMO)',out:true},{d:'2026-09-22',n:'TSH',w:'2,1 mIU/l',r:'norma laboratorium: 0,4–4,0 mIU/l (DEMO)'},{d:'2026-09-22',n:'Hemoglobina',w:'13,2 g/dl',r:'norma laboratorium: 12–16 g/dl (DEMO)'}],
 jan:[{d:'2026-10-02',n:'Morfologia',w:'bez odchyleń',r:'(DEMO)'}],zofia:[],stas:[],piotr:[{d:'2026-09-30',n:'Glukoza na czczo',w:'94 mg/dl',r:'norma laboratorium: 70–99 mg/dl (DEMO)'}],halina:[{d:'2026-10-05',n:'Ciśnienie tętnicze (pomiar)',w:'142/88 mmHg',r:'zalecane: poniżej 140/90 mmHg (DEMO)',out:true}],kuba:[]};
const ZHI={
 anna:{krew:'A Rh+ (DEMO)',alergie:['penicylina'],leki:['Atorwastatyna 20 mg','Euthyrox 50 µg'],kont:'Tomasz Kowalski (mąż) +48 600 000 000'},
 jan:{krew:'0 Rh+ (DEMO)',alergie:[],leki:[],kont:'Anna Kowalska (mama) +48 600 000 001'},
 zofia:{krew:'A Rh+ (DEMO)',alergie:[],leki:[],kont:'Anna Kowalska (mama) +48 600 000 001'},
 stas:{krew:'0 Rh+ (DEMO)',alergie:[],leki:[],kont:'Anna Kowalska (mama) +48 600 000 001'},
 piotr:{krew:'B Rh+ (DEMO)',alergie:[],leki:[],kont:'Ewa Malinowska (żona) +48 600 000 002'},
 halina:{krew:'0 Rh- (DEMO)',alergie:['pyłki traw'],leki:['Bisoprolol 5 mg'],kont:'Marek Wrona (syn) +48 600 000 003'},
 kuba:{krew:'AB Rh+ (DEMO)',alergie:['orzeszki ziemne'],leki:[],kont:'Barbara Lis (mama) +48 600 000 004'}};
const ZHSOR=[['SOR – Szpital Bielański','Warszawa, Bielany','ok. 1 h 40 min'],['SOR – Szpital Praski','Warszawa, Praga-Północ','ok. 2 h 15 min'],['SOR – Szpital Grochowski','Warszawa, Praga-Południe','ok. 55 min'],['SOR – UCK WUM','Warszawa, Śródmieście','ok. 3 h']];
// Typy zgłoszeń: [kod, opis, adresat, podstawa]. Podstawę podajemy tylko tam, gdzie wynika wprost z przepisu.
const ZHREP={
 wizyta:[['brak','Tej wizyty nie było','oddział wojewódzki NFZ oraz placówka','sprawdzenie rozliczenia świadczenia'],['rozl','Rozliczenie wygląda błędnie','oddział wojewódzki NFZ','wyjaśnienie rozliczenia'],['dok','Placówka nie wydaje dokumentacji','placówka, a następnie Rzecznik Praw Pacjenta','art. 26 ust. 1 ustawy z 6.11.2008 o prawach pacjenta i Rzeczniku Praw Pacjenta (prawo dostępu do dokumentacji)'],['czas','Zbyt długo czekam na termin','NFZ – informator o terminach leczenia','']],
 badanie:[['nie','Tego badania nie wykonano','placówka oraz oddział wojewódzki NFZ','sprawdzenie rozliczenia świadczenia'],['cudze','Ten wynik nie jest mój','placówka (pilnie) i jej inspektor ochrony danych','']]};
const ZHW={ // wspólne linki zewnętrzne (tylko strony główne instytucji)
 pacjent:['pacjent.gov.pl','https://pacjent.gov.pl'],rpp:['Rzecznik Praw Pacjenta','https://www.gov.pl/web/rpp'],nfz:['nfz.gov.pl','https://www.nfz.gov.pl'],urpl:['urpl.gov.pl','https://www.urpl.gov.pl'],terminy:['Informator o terminach leczenia (NFZ)','https://terminyleczenia.nfz.gov.pl']};
const lnk=k=>`<a href="${ZHW[k][1]}" target="_blank" rel="noopener">${ZHW[k][0]}</a>`;
const stamp=()=>new Date().toLocaleString('pl-PL',{dateStyle:'short',timeStyle:'short'});
const logAdd=(who,co,po)=>{S.v11.log.unshift([stamp(),who,co,po]);S.v11.log=S.v11.log.slice(0,20)};

function zdrowie(){
 const me=ZHP[S.persona]?S.persona:'anna',fam=[me].concat(ZHKIDS[me]||[]);if(S.v11.who=='jakub')S.v11.who='stas';if(!fam.includes(S.v11.who))S.v11.who=me;
 const v=S.v11,p=ZHP[v.who];
 const tabs=[['karta','🪪 Karta'],['wizyty','📅 Wizyty'],['badania','🧪 Badania'],['leki','💊 Leki'],['gdzie','🧭 Gdzie iść'],['koszty','🧾 Koszty'],['prywatnosc','🔒 Prywatność']];
 const T={karta:tKarta,wizyty:tWizyty,badania:tBadania,leki:tLeki,gdzie:tGdzie,koszty:tKoszty,prywatnosc:tPryw};
 shell('🩺 Moje zdrowie',`<div class="alert y">⚠️<div><b>Koncepcja (DEMO).</b> Dane są fikcyjne, a żadne zgłoszenie nigdzie się nie wysyła. Karta ma być widokiem na dane z Internetowego Konta Pacjenta, a nie nowym rejestrem.</div></div>
 <div class="chips">${fam.map(k=>`<button class="chip ${k==v.who?'on':''}" onclick="zhSet('who','${k}')">${ZHP[k].n.split(' ')[0]}</button>`).join('')}</div>
 <div class="chips">${tabs.map(([k,t])=>`<button class="chip ${k==v.tab?'on':''}" onclick="zhSet('tab','${k}')">${t}</button>`).join('')}</div>
 ${v.who!=me?`<p class="muted">Widok rodzica: ${p.n} (${p.w}). Konto rodzica widzi dane dziecka do ukończenia 18 lat.</p>`:''}
 ${T[v.tab]()}
 <p class="muted" style="margin-top:14px">Funkcja jest symulacją. W nagłej sytuacji dzwoń 112.</p>`,{tab:'more'});
 if(v.tab=='gdzie')numDraw();
}
function zhSet(k,val){S.v11[k]=val;save();zdrowie()}

// ---- Karta ----
function tKarta(){const v=S.v11,p=ZHP[v.who],i=ZHI[v.who];
 return `<div class="card" style="background:linear-gradient(135deg,#0d6e5b,#1c9b83);color:#fff"><div style="font-size:.8em;opacity:.85">KARTA ZDROWIA • DEMO</div><h3 style="color:#fff;margin:6px 0">${p.n}</h3><div>Prawo do świadczeń: <b>aktywne</b> (DEMO)</div><div style="opacity:.85;font-size:.85em;margin-top:4px">W wersji docelowej: uprawnienie sprawdzane w systemie NFZ w chwili wizyty.</div></div>
 ${card('📲 Kod wizyty – udostępniasz tylko to, co trzeba',`<p class="muted">Rejestracja widzi tożsamość i prawo do świadczeń. Resztę dodajesz świadomie, na 5 minut. Kod nie ma PIN-u: odczyt zatwierdza lekarz lub rejestrator swoim kontem, a wpis trafia do historii dostępu.</p>
  <label class="chk"><input type="checkbox" checked disabled> Tożsamość i prawo do świadczeń</label>
  ${[['leki','Leki stałe'],['alergie','Alergie i grupa krwi'],['wyniki','Ostatnie wyniki badań']].map(([k,t])=>`<label class="chk"><input type="checkbox" ${v.scope[k]?'checked':''} onchange="zhScope('${k}',this.checked)"> ${t}</label>`).join('')}
  <button class="btn" onclick="zhKod()">Pokaż kod na 5 minut</button>`)}
 ${card('🚑 Karta ratunkowa',`<div class="row"><span>Grupa krwi</span><b>${i.krew}</b></div><div class="row"><span>Alergie</span><b>${i.alergie.length?i.alergie.join(', '):'brak znanych'}</b></div><div class="row"><span>Leki stałe</span><b>${i.leki.length?i.leki.join(', '):'brak'}</b></div><div class="row"><span>Kontakt w nagłej sytuacji</span><b>${i.kont}</b></div>
  <label class="chk"><input type="checkbox" ${v.ice?'checked':''} onchange="zhIce(this.checked)"> Pokaż ratownikom na ekranie blokady</label>
  <p class="muted">Koncepcja: wymaga zgody w ustawieniach telefonu i współpracy systemu operacyjnego. Domyślnie wyłączone. Nie zastępuje dokumentacji medycznej.</p>`)}
 ${card('📤 Moje dane',`<p class="muted">Pobierz dane z tego ekranu jako plik JSON w uproszczonym formacie FHIR R4 (DEMO, nie walidowany).</p><button class="btn sec" onclick="zhExport()">Pobierz plik</button>`)}`}
function zhScope(k,on){S.v11.scope[k]=on;save()}
function zhIce(on){if(!on){S.v11.ice=false;save();return zdrowie()}
 const m=modal(`<h3>Włączyć kartę ratunkową?</h3><p class="muted">Ratownik zobaczy na ekranie blokady grupę krwi, alergie, leki stałe i numer kontaktowy – bez odblokowania telefonu. Wyłączysz to w każdej chwili.</p><button class="btn" id="zi">Włączam</button><button class="btn ghost" onclick="closeModal();zdrowie()">Anuluj</button>`);
 m.querySelector('#zi').onclick=()=>{S.v11.ice=true;logAdd('Ustawienia','Karta ratunkowa włączona','Zmiana wykonana przez Ciebie');save();closeModal();zdrowie();toast('Włączono (symulacja)')}}
function zhKod(){const v=S.v11;const co=['tożsamość','uprawnienie'].concat(Object.keys(v.scope).filter(k=>v.scope[k]).map(k=>({leki:'leki stałe',alergie:'alergie i grupa krwi',wyniki:'wyniki badań'}[k])));
 let left=300;const m=modal(`<h3>Kod wizyty</h3><div style="text-align:center">${qrSVG(v.who+Date.now())}</div><p class="muted" style="text-align:center">Zakres: ${co.join(', ')}<br>Ważny jeszcze <b id="zk">5:00</b></p><button class="btn sec" id="zr">Symuluj odczyt w rejestracji</button><button class="btn ghost" onclick="closeModal()">Zamknij</button>`);
 const iv=setInterval(()=>{const e=document.getElementById('zk');if(!e){clearInterval(iv);return}left--;e.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');if(left<=0){clearInterval(iv);closeModal();toast('Kod wygasł')}},1000);
 m.querySelector('#zr').onclick=()=>{logAdd('Przychodnia POZ „Mokotów” – rejestracja (DEMO)',co.join(', '),'Kod wizyty');save();closeModal();toast('Odczyt zapisano w historii dostępu')}}
function zhExport(){const v=S.v11,p=ZHP[v.who],i=ZHI[v.who];const parts=p.n.split(' ');
 const ent=[{resource:{resourceType:'Patient',id:v.who,name:[{family:parts.slice(1).join(' '),given:[parts[0]]}]}}].concat(i.leki.map(l=>({resource:{resourceType:'MedicationStatement',status:'active',medicationCodeableConcept:{text:l},subject:{reference:'Patient/'+v.who}}}))).concat(i.alergie.map(a=>({resource:{resourceType:'AllergyIntolerance',patient:{reference:'Patient/'+v.who},code:{text:a}}})));
 const b=new Blob([JSON.stringify({resourceType:'Bundle',type:'collection',meta:{tag:[{display:'DEMO – dane fikcyjne, uproszczony i niewalidowany'}]},entry:ent},null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='moje-zdrowie-'+v.who+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);toast('Pobrano plik (DEMO)')}

// ---- Wizyty i badania ----
function tWizyty(){const v=S.v11;const L=ZHV[v.who];
 return `${rowl('⏰','Najbliższe wizyty i przypomnienia','#/reminders','Terminy z Twojej listy przypomnień')}
 ${L.length?L.map((x,i)=>x.sens&&!v.sens?`<div class="card"><h3>🔒 Wpis wrażliwy – ukryty</h3><p class="muted">${fd(x.d)}. Ukrywamy go domyślnie, bo dotyczy szczególnie wrażliwych danych. Odkrywasz go świadomie.</p><button class="btn ghost small" onclick="zhUnlock()">Pokaż (potwierdzenie twarzą)</button></div>`:card(`${fd(x.d)} • ${x.t}`,`<p class="muted">${x.p}</p><div class="row"><span>Zrealizowano</span><b>✔</b></div><div class="row"><span>Sfinansowane przez NFZ</span><b>${x.nfz} zł (DEMO)</b></div><div class="row"><span>Twoja dopłata</span><b>0 zł</b></div><button class="btn ghost small" onclick="zhRep('wizyta',${i})">⚠ Coś się nie zgadza</button>`)).join(''):'<p class="muted">Brak wizyt w historii (DEMO).</p>'}`}
function zhUnlock(){faceId('Pokazanie ukrytych wpisów',()=>{S.v11.sens=true;logAdd('Ty (potwierdzenie twarzą)','Ukryte wpisy','Odkryte świadomie');save();zdrowie()})}
function tBadania(){const L=ZHB[S.v11.who];
 return (L.length?L.map((x,i)=>card(`${x.n}: ${x.w}`,`<p class="muted">${fd(x.d)} • ${x.r}</p>${x.out?'<div class="alert y">⚠️<div>Wynik poza normą laboratorium. To nie diagnoza – omów go z lekarzem.</div></div>':''}<button class="btn ghost small" onclick="zhRep('badanie',${i})">⚠ Coś się nie zgadza</button>`)).join(''):'<p class="muted">Brak wyników w historii (DEMO).</p>')}

// ---- Zgłoszenie rozbieżności: szkic z adresatem i podstawą, bez wysyłki ----
function zhRep(kind,i){const v=S.v11,p=ZHP[v.who];const src=kind=='wizyta'?ZHV[v.who][i]:ZHB[v.who][i];const types=ZHREP[kind];
 const what=kind=='wizyta'?`wizyta ${fd(src.d)}, ${src.p}`:`badanie ${src.n} z dnia ${fd(src.d)}`;
 const m=modal(`<h3>Co się nie zgadza?</h3><p class="muted">${esc(what)}</p>${types.map((t,k)=>`<label class="chk"><input type="radio" name="zt" value="${k}" ${k==0?'checked':''}> ${t[1]}</label>`).join('')}<div id="zd"></div><button class="btn" id="zs">Zapisz szkic (nic nie wysyłam)</button><button class="btn ghost" onclick="closeModal()">Anuluj</button>`);
 const draw=()=>{const t=types[+m.querySelector('input[name=zt]:checked').value];
  m.querySelector('#zd').innerHTML=`<p class="muted"><b>Adresat:</b> ${t[2]}${t[3]?`<br><b>Podstawa:</b> ${t[3]}`:''}</p><textarea rows="7">Dotyczy: ${p.n}\nSprawa: ${t[1]}\nZdarzenie: ${what}\n\nProszę o ${t[3]&&t[0]=='dok'?'udostępnienie dokumentacji medycznej dotyczącej tego świadczenia':'sprawdzenie i wyjaśnienie sprawy'}.${t[3]?`\nPodstawa: ${t[3]}.`:''}\n\n(Szkic z prototypu – nic nie wysłano.)</textarea>`};
 m.querySelectorAll('input[name=zt]').forEach(r=>r.onchange=draw);draw();
 m.querySelector('#zs').onclick=()=>{const t=types[+m.querySelector('input[name=zt]:checked').value];
  S.cases.push({t:'Zdrowie (szkic): '+t[1],no:caseNo(),st:'Symulacja – nic nie wysłano'});save();
  m.querySelector('.sheet').innerHTML=`<h3>Szkic zapisany</h3><p><b>Nic nie zostało wysłane.</b> To symulacja. Prawdziwą sprawę złożysz bezpośrednio: ${lnk('nfz')}, ${lnk('rpp')} lub przez ${lnk('pacjent')}.</p><p class="muted">Szkic jest w „Moich sprawach” ze statusem symulacji. Podstawa prawna wynika wprost z przepisu tylko tam, gdzie ją wskazano; wybór adresata to wskazówka, nie porada prawna.</p><button class="btn" onclick="closeModal();zdrowie()">Zamknij</button>`}}

// ---- Leki i działania niepożądane ----
function tLeki(){const n=S.v11.nop;
 return `${rowl('💊','Moje e-recepty i zapas leków','#/recepty','Realizacja, przedłużenie, kod do apteki')}
 ${card('⚠️ Działanie niepożądane leku',`<p class="muted">Zgłosić może każdy pacjent. Oficjalne zgłoszenie przyjmuje Urząd Rejestracji Produktów Leczniczych (${lnk('urpl')}). Prototyp zapisuje tylko Twoją notatkę i niczego nie wysyła.</p><button class="btn" onclick="zhNop()">Zgłoś działanie niepożądane</button>`)}
 ${n.length?card('Moje notatki o działaniach niepożądanych',n.map(x=>`<div class="row"><span>${esc(x.lek)}<br><span class="muted">${esc(x.o)}</span></span><b>${x.d}</b></div>`).join('')):''}`}
function zhNop(){const own=(ZHI[S.v11.who]||{}).leki||[];const rx=(S.v11.who=='anna'&&S.v7&&S.v7.rx&&S.v7.rx.length?S.v7.rx.map(x=>x.lek):own.length?own:['Inny lek (wpisz w opisie)']);
 const m=modal(`<h3>⚠️ Działanie niepożądane</h3><label>Lek</label><select id="zl">${rx.map(l=>`<option>${esc(l)}</option>`).join('')}</select><label>Co się dzieje?</label>${['Wysypka, świąd','Nudności, wymioty','Zawroty głowy','Ból brzucha','Inne'].map(o=>`<label class="chk"><input type="checkbox" name="zo" value="${o}"> ${o}</label>`).join('')}<label class="chk"><input type="checkbox" id="zc"> Duszność, obrzęk twarzy lub gardła, utrata przytomności</label><div id="zw"></div><button class="btn" id="zs">Zapisz w mojej historii</button><button class="btn ghost" onclick="closeModal()">Anuluj</button>`);
 m.querySelector('#zc').onchange=e=>{m.querySelector('#zw').innerHTML=e.target.checked?'<div class="alert r">🚨<div><b>To może zagrażać życiu. Dzwoń 112.</b> Nie czekaj na zgłoszenie w aplikacji.</div></div><a class="btn" href="tel:112">📞 Zadzwoń 112</a>':''};
 m.querySelector('#zs').onclick=()=>{const o=[...m.querySelectorAll('input[name=zo]:checked')].map(x=>x.value);if(m.querySelector('#zc').checked)o.push('objawy ciężkie');
  const x={lek:m.querySelector('#zl').value,o:o.join(', ')||'bez opisu',d:fd(new Date())};S.v11.nop.unshift(x);save();
  const txt=`Zgłoszenie działania niepożądanego (szkic)\nLek: ${x.lek}\nObjawy: ${x.o}\nData: ${x.d}`;
  m.querySelector('.sheet').innerHTML=`<h3>Zapisano lokalnie</h3><p><b>Nic nie zostało wysłane do URPL.</b> Formularz zgłoszenia znajdziesz na stronie ${lnk('urpl')}. Możesz skopiować powyższe dane.</p><pre style="white-space:pre-wrap;font-size:.85em">${esc(txt)}</pre><button class="btn sec" id="zcp">Kopiuj</button><button class="btn" onclick="closeModal();zdrowie()">Zamknij</button>`;
  m.querySelector('#zcp').onclick=()=>{try{navigator.clipboard.writeText(txt);toast('Skopiowano')}catch(e){toast('Nie udało się skopiować')}}}}

// ---- Gdzie iść: wybór drogi, nie diagnoza ----
const ZHWYB={
 zycie:['🚨','Zagrożenie życia','Dzwoń 112 od razu. Przykłady: utrata przytomności, silny ból w klatce piersiowej, ciężka duszność, rozległy krwotok, objawy udaru (opadający kącik ust, niedowład, zaburzenia mowy).','<a class="btn" href="tel:112">📞 Zadzwoń 112</a>'],
 noc:['🌙','Nagłe pogorszenie, ale bez zagrożenia życia – wieczorem, w nocy, w weekend','Nocna i świąteczna opieka zdrowotna działa po godzinach pracy poradni POZ (zwykle wieczorem i w nocy w dni robocze oraz całą dobę w weekendy i święta), bez skierowania. Godziny i adresy różnią się lokalnie – sprawdź je u swojego POZ lub w NFZ.',`<a class="btn sec" href="${ZHW.nfz[1]}" target="_blank" rel="noopener">Sprawdź na nfz.gov.pl</a>`],
 uraz:['🦴','Uraz lub stan wymagający szybkiej oceny, ale niezagrażający życiu','Szpitalny oddział ratunkowy (SOR) przyjmuje wg pilności, więc przy lżejszych przypadkach czeka się długo. Przy wątpliwościach dzwoń 112 albo skorzystaj z nocnej opieki, jeśli jest czynna.','<button class="btn sec" onclick="zhSet(\'tab\',\'gdzie\');document.getElementById(\'zsor\').scrollIntoView()">Pokaż przykładowe SOR-y</button>'],
 plan:['📅','Sprawa niepilna','Umów wizytę u lekarza POZ albo specjalisty. Porównaj terminy w informatorze NFZ.',`<a class="btn sec" href="#/health">Umów wizytę</a> <a class="btn ghost" href="${ZHW.terminy[1]}" target="_blank" rel="noopener">Terminy leczenia (NFZ)</a>`]};
function tGdzie(){const w=S.v11.wyb;
 return `${card('🧭 Gdzie z tym iść?',`<p class="muted">To pomoc w wyborze drogi, a nie diagnoza. W razie wątpliwości dzwoń 112.</p>${Object.keys(ZHWYB).map(k=>`<button class="btn ${w==k?'':'ghost'}" style="margin-bottom:6px;text-align:left" onclick="zhWyb('${k}')">${ZHWYB[k][0]} ${ZHWYB[k][1]}</button>`).join('')}${w?`<div class="alert ${w=='zycie'?'r':'b'}"><div><p style="margin:0 0 8px">${ZHWYB[w][2]}</p>${ZHWYB[w][3]}</div></div>`:''}`)}
 ${card('🎫 Wirtualna poczekalnia (symulacja)',`<p class="muted">Numerek w kolejce do rejestracji i powiadomienie, gdy zbliża się Twoja kolej. Wymaga integracji placówki – prototyp tylko pokazuje, jak mogłoby to wyglądać.</p><div id="znum"></div>`)}
 <div id="zsor">${card('🏥 SOR – przykładowe dane',`<div class="alert y">⚠️<div><b>Dane przykładowe.</b> Nie mamy potwierdzonego źródła kolejek na żywo. W wersji docelowej dane musiałby udostępniać NFZ lub szpitale, z datą aktualizacji.</div></div>${ZHSOR.map(s=>`<div class="row"><span>${s[0]}<br><span class="muted">${s[1]}</span></span><b>${s[2]}</b></div><a class="muted" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s[0].replace('SOR – ','')+' Warszawa')}" target="_blank" rel="noopener">🗺️ Pokaż w Google Maps</a>`).join('')}`)}</div>`}
function zhWyb(k){S.v11.wyb=k;save();zdrowie()}
function numDraw(){const e=document.getElementById('znum');if(!e){clearInterval(window.zhT);return}const n=S.v11.num;
 if(!n){e.innerHTML='<button class="btn" onclick="zhNum()">Weź numerek (DEMO)</button>';return}
 e.innerHTML=`<div class="row"><span>Twój numerek</span><b>${n.no}</b></div><div class="row"><span>Przed Tobą</span><b>${n.pos}</b></div><p class="muted">${n.pos<=0?'Zapraszamy do gabinetu.':n.pos<=2?'Za chwilę Twoja kolej – podejdź do rejestracji.':'Możesz poczekać poza placówką. Powiadomimy Cię przed Twoją kolejką.'}</p><button class="btn ghost small" onclick="zhNumOff()">Zrezygnuj</button>`}
function zhNum(){S.v11.num={no:'A-'+(40+Math.floor(Math.random()*50)),pos:6};save();numDraw();clearInterval(window.zhT);
 window.zhT=setInterval(()=>{const n=S.v11.num;if(!n||!document.getElementById('znum')){clearInterval(window.zhT);return}n.pos=Math.max(0,n.pos-1);save();numDraw();if(n.pos==2)toast('🔔 Zbliża się Twoja kolej (symulacja)');if(n.pos==0)clearInterval(window.zhT)},8000)}
function zhNumOff(){S.v11.num=null;save();clearInterval(window.zhT);numDraw()}

// ---- Koszty ----
function tKoszty(){const v=S.v11,L=ZHV[v.who];const sum=L.reduce((s,x)=>s+x.nfz,0);
 return `${card('🧾 Informacja o kosztach leczenia (DEMO)',`${L.map(x=>`<div class="row"><span>${fd(x.d)} • ${x.t}</span><b>${x.nfz} zł</b></div>`).join('')||'<p class="muted">Brak świadczeń.</p>'}<div class="row"><span><b>Razem sfinansowane przez NFZ</b></span><b>${sum} zł</b></div><div class="row"><span>Zapłacone przez Ciebie</span><b>0 zł</b></div><p class="muted">To informacja o wartości świadczeń, a nie rachunek do zapłaty. Kwoty są przykładowe.</p>`)}
 ${v.who=='anna'?card('Składka a świadczenia',`<div class="row"><span>Składka zdrowotna odprowadzona w 2026</span><b>8 640 zł (DEMO)</b></div><div class="alert b">ℹ️<div>Nie pokazujemy salda „wpłaciłem – dostałem”. System jest solidarnościowy: składka nie jest kontem pacjenta, a wartość świadczeń nie musi odpowiadać wpłatom. Zestawienie służy przejrzystości, nie rozliczeniu.</div></div>`):''}`}

// ---- Prywatność ----
function tPryw(){const v=S.v11;const base=[['09.10.2026 09:12','Przychodnia POZ „Mokotów” – rejestracja (DEMO)','Tożsamość, uprawnienie','Kod wizyty'],['09.10.2026 10:05','lek. Z. Nowak, POZ (DEMO)','Leki stałe, wyniki badań','Wizyta'],['12.10.2026 14:30','Apteka „Zdrowie” (DEMO)','E-recepta 4821','Realizacja recepty']];
 const all=v.log.concat(base);
 return `${card('👁️ Kto widział moje dane o zdrowiu',all.map(l=>`<div class="row"><span>${l[1]}<br><span class="muted">${l[0]} • ${l[2]} • ${l[3]}</span></span><button class="chip" onclick="toast('Zgłoszenie do inspektora ochrony danych (symulacja – nic nie wysłano)')">To nie ja</button></div>`).join(''))}
 ${card('🔐 Wrażliwe wpisy',`<p class="muted">Wpisy szczególnie wrażliwe są domyślnie ukryte. Odkrycie wymaga potwierdzenia twarzą i zapisuje się w historii dostępu.</p><div class="row"><span>Pokazuj ukryte wpisy</span><b>${v.sens?'tak':'nie'}</b></div>${v.sens?'<button class="btn ghost small" onclick="zhHide()">Ukryj ponownie</button>':''}`)}
 ${rowl('👪','Upoważnienia i dostęp bliskich','#/upowaz','Kto może działać w Twoim imieniu')}
 ${card('Założenia i niepewności',`<p class="muted">• Karta jest widokiem na dane z IKP – to założenie koncepcji, nie ustalony fakt.<br>• Dostęp rodzica do danych nastolatka (16–17 lat) wymaga analizy prawnej, m.in. art. 32 ustawy o zawodach lekarza i lekarza dentysty (zgoda równoległa) – do weryfikacji w aktualnym tekście.<br>• Czy IKP udostępnia dziś informację o kosztach świadczeń w tej formie – do sprawdzenia; kwoty w prototypie są przykładowe.<br>• Kolejki SOR i numerek w poczekalni wymagają integracji, której nie zakładamy jako istniejącej.<br>• Linki prowadzą do stron głównych instytucji; adresy podstron mogą się zmieniać.</p>`)}`}
function zhHide(){S.v11.sens=false;save();zdrowie()}

// ---- Rejestracja w aplikacji ----
ALL.push(['🩺','Moje zdrowie – karta zdrowia','#/zdrowie','zdrowie karta wizyty badania leki działania niepożądane sor poczekalnia koszty prywatność karta ratunkowa kod wizyty']);
INT.unshift([/moje zdrowie|karta zdrowia|histori[a-ząćęłńóśźż]* wizyt|wynik[a-ząćęłńóśźż]* bada|dzia[a-ząćęłńóśźż]* niepożądan|skutk[a-ząćęłńóśźż]* uboczn|\bsor\b|poczekalni|karta ratunkow|koszt[a-ząćęłńóśźż]* leczenia/,'#/zdrowie','Karta „Moje zdrowie” zbiera wizyty, badania, leki i koszty w jednym miejscu. Lekarzowi pokazujesz tylko wybrane dane, a każdy wgląd zapisuje się w historii. Wszystko tu jest symulacją.']);
const _home11=home;home=function(){_home11();const g=app.querySelector('.grid');if(g)g.insertAdjacentHTML('afterbegin','<button class="tile hot" onclick="location.hash=\'#/zdrowie\'"><b>🩺</b>Moje zdrowie</button>')};
const _more11=more;more=function(){_more11();const g=app.querySelector('.grid');if(g)g.insertAdjacentHTML('afterbegin','<button class="tile" onclick="location.hash=\'#/zdrowie\'"><b>🩺</b>Moje zdrowie</button>')};
Object.assign(window,{zdrowie,zhSet,zhScope,zhIce,zhKod,zhExport,zhUnlock,zhRep,zhNop,zhWyb,zhNum,zhNumOff,zhHide});
const _route10=route;route=function(){const h=location.hash.replace(/^#\//,'')||'home';const[p]=h.split('/');
 if(p=='zdrowie'){clearInterval(threatT);clearInterval(camT);zdrowie()}else{clearInterval(window.zhT);_route10()}};
onhashchange=route;route();
})();
