
(()=>{
 const key='dmvault-gz-owned-v1';
 const getOwned=()=>new Set(JSON.parse(localStorage.getItem(key)||'[]'));
 const save=s=>localStorage.setItem(key,JSON.stringify([...s]));
 function addOwned(el,name){
   if(!name||el.querySelector(':scope > .owned-toggle'))return;
   const b=document.createElement('button'); b.className='owned-toggle'; b.type='button';
   const refresh=()=>{const on=getOwned().has(name);b.classList.toggle('is-owned',on);el.classList.toggle('owned-mark',on);b.textContent=on?'✓ 已養過':'＋ 已養過'};
   b.onclick=e=>{e.preventDefault();e.stopPropagation();const s=getOwned();s.has(name)?s.delete(name):s.add(name);save(s);refresh();document.dispatchEvent(new Event('dm-owned-change'))};
   el.appendChild(b);refresh();
 }
 document.querySelectorAll('.evolution-sheet').forEach(x=>{const n=x.querySelector('.source-title-zh')?.textContent.trim();const p=x.querySelector('.source-panel');if(p)addOwned(p,n)});
 document.querySelectorAll('.monster-card').forEach(x=>{const n=x.querySelector('.names strong,.monster-head strong')?.textContent.trim()||x.querySelector('h3')?.textContent.trim();addOwned(x,n)});
 const targetSelector=document.body.classList.contains('evolution-page')?'.evolution-sheet':document.querySelector('.monster-card')?'.monster-card':document.querySelector('.card')?'.card':null;
 const host=document.querySelector('.intro')||document.querySelector('.evo-main')||document.querySelector('main');
 if(targetSelector&&host){
   const panel=document.createElement('div');panel.className='tool-panel';panel.innerHTML='<input type="search" aria-label="搜尋" placeholder="搜尋中文／日文名稱…"><button type="button" data-act="owned">只看已養過</button><button type="button" data-act="reset">清除</button><span class="result-count"></span>';
   host.after?host.after(panel):host.prepend(panel);
   const input=panel.querySelector('input'),ownedBtn=panel.querySelector('[data-act=owned]'),count=panel.querySelector('.result-count');let onlyOwned=false;
   const apply=()=>{const q=input.value.trim().toLowerCase(),owned=getOwned();let shown=0;document.querySelectorAll(targetSelector).forEach(el=>{const text=el.textContent.toLowerCase();const name=(el.querySelector('.source-title-zh')||el.querySelector('.names strong,.monster-head strong')||el.querySelector('strong'))?.textContent.trim();const ok=(!q||text.includes(q))&&(!onlyOwned||owned.has(name));el.classList.toggle('is-hidden',!ok);if(ok)shown++});count.textContent=`顯示 ${shown} 筆`;ownedBtn.textContent=onlyOwned?'顯示全部':'只看已養過'};
   input.addEventListener('input',apply);ownedBtn.onclick=()=>{onlyOwned=!onlyOwned;apply()};panel.querySelector('[data-act=reset]').onclick=()=>{input.value='';onlyOwned=false;apply()};document.addEventListener('dm-owned-change',apply);apply();
 }
})();
