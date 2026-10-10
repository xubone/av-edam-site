
// tooltips on chart columns
const tip=document.getElementById('tip');
function show(e){const t=e.target.closest('[data-tip]');if(!t)return;
 const r=t.getBoundingClientRect();tip.textContent=t.dataset.tip;tip.hidden=false;
 const w=tip.offsetWidth;tip.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+'px';
 tip.style.top=Math.max(8,r.top-34)+'px';}
function hide(){tip.hidden=true}
document.addEventListener('pointerover',show);document.addEventListener('focusin',show);
document.addEventListener('pointerout',e=>{if(e.target.closest('[data-tip]'))hide()});
document.addEventListener('focusout',hide);addEventListener('scroll',hide,{passive:true});

// stale data: the page carries the time of the last successful sync
(()=>{const b=document.body,up=b.dataset.updated;if(!up)return;const t=new Date(up);
 if((Date.now()-t)/36e5<=+b.dataset.staleH)return;const el=document.getElementById('stale');
 el.textContent='⚠ Deze gegevens zijn niet bijgewerkt sinds '+t.toLocaleDateString('nl-NL',
  {weekday:'long',day:'numeric',month:'long'})+'. Startlijsten en uitslagen kunnen verouderd zijn.';
 el.hidden=false;})();

// route buttons: Apple Maps on iPhone / iPad / Mac, Google Maps everywhere else
if(/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent))
 document.querySelectorAll('a.route[data-apple]').forEach(a=>a.href=a.dataset.apple);

// Resultaten tab: filters on data-* attributes of each result row
const rf=document.getElementById('resfilters');
if(rf){
 const st={level:'top',kind:'all'},vet=document.getElementById('vetonly'),q=document.getElementById('reszoek'),
  cards=[...document.querySelectorAll('#resruns .resrun')],cnt=document.getElementById('rescount'),
  geen=document.getElementById('resgeen');
 function apply(){const t=q.value.trim().toLowerCase();let n=0,runs=0;
  for(const c of cards){let k=0;
   for(const r of c.querySelectorAll('tbody tr')){const d=r.dataset;
    const on=(st.level==='all'||(st.level==='top'?d.top==='1':d.pod==='1'))&&
     (st.kind==='all'||(st.kind==='comp'?d.comp==='1':d.comp==='0'))&&(!vet.checked||d.vet==='1')&&
     (!t||d.n.includes(t));
    r.hidden=!on;if(on)k++;}
   c.hidden=!k;n+=k;if(k)runs++;}
  cnt.textContent=n+' resultat'+(n===1?'':'en')+' in '+runs+' run'+(runs===1?'':'s');geen.hidden=n>0;}
 rf.querySelectorAll('.seg').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');
  if(!b)return;st[g.dataset.f]=b.dataset.v;
  g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));apply();}));
 vet.addEventListener('change',apply);q.addEventListener('input',apply);apply();
}

// member list (Leden tab): search + sort on a column header (cells carry data-s)
const zoek=document.getElementById('zoek');
if(zoek){
 const tbl=document.getElementById('ledenlijst'),body=tbl.tBodies[0],geen=document.getElementById('geen');
 zoek.addEventListener('input',()=>{const q=zoek.value.trim().toLowerCase();let n=0;
  for(const r of body.rows){r.hidden=!r.dataset.n.includes(q);if(!r.hidden)n++;}
  geen.hidden=n>0;});
 tbl.querySelectorAll('th').forEach(th=>th.addEventListener('click',()=>{
  const k=+th.dataset.k,cur=th.getAttribute('aria-sort');
  const dir=cur?(cur==='ascending'?-1:1):('desc' in th.dataset?-1:1);
  tbl.querySelectorAll('th').forEach(h=>h.removeAttribute('aria-sort'));
  th.setAttribute('aria-sort',dir>0?'ascending':'descending');
  const val=c=>{const v=c.dataset.s;return isNaN(v)?v:+v;};
  [...body.rows].sort((a,b)=>{const x=val(a.cells[k]),y=val(b.cells[k]);
   return (x<y?-1:x>y?1:0)*dir||a.cells[0].dataset.s.localeCompare(b.cells[0].dataset.s);})
   .forEach(r=>body.appendChild(r));}));
}
