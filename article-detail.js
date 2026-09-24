(function(){
  const key=new URLSearchParams(location.search).get('article')||'objects';
  const data=window.NTX_ARTICLES?.get(key)||{};
  const activeCategory=data.category||'nitunxiang';
  document.querySelector('[data-detail-category="'+activeCategory+'"]')?.classList.add('is-active');
  const bi=(selector,value)=>{if(!value)return;const el=document.querySelector(selector);if(!el)return;el.dataset.biEn=value[0];el.dataset.biZh=value[1];el.innerHTML=value[0]};
  bi('[data-article-title]',data.title);bi('[data-article-category]',data.categoryLabel);bi('[data-article-type]',data.type);bi('[data-article-dek]',data.dek);bi('[data-article-quote]',data.quote);
  const articleDate=document.querySelector('[data-article-date]');if(articleDate)articleDate.textContent=data.date;
  const reading=document.querySelector('[data-article-reading]');if(reading)reading.textContent=data.read;
  const gallery=document.querySelector('[data-article-gallery]');
  const viewport=gallery?.querySelector('.detail-gallery-viewport');
  const track=gallery?.querySelector('.detail-gallery-track');
  const slides=[...(gallery?.querySelectorAll('[data-gallery-slide]')||[])];
  const pagination=[...(gallery?.querySelectorAll('[data-gallery-index]')||[])];
  let current=0;
  slides.forEach((slide,index)=>{
    const saved=localStorage.getItem('ntx-article-gallery-'+key+'-'+index);
    slide.src=saved||data.images?.[index]||data.images?.[0]||'';
  });
  const show=(index,scroll=false)=>{
    current=(index+slides.length)%slides.length;
    pagination.forEach((button,buttonIndex)=>button.classList.toggle('is-active',buttonIndex===current));
    if(matchMedia('(max-width:850px)').matches){if(scroll)viewport?.scrollTo({left:current*(viewport?.clientWidth||0),behavior:'smooth'});}
    else if(track)track.style.transform='translateX(-'+(current*100)+'%)';
  };
  gallery?.querySelector('.gallery-prev')?.addEventListener('click',()=>show(current-1));
  gallery?.querySelector('.gallery-next')?.addEventListener('click',()=>show(current+1));
  pagination.forEach((button)=>button.addEventListener('click',()=>show(Number(button.dataset.galleryIndex),true)));
  let scrollTimer=0;
  viewport?.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>show(Math.round(viewport.scrollLeft/Math.max(1,viewport.clientWidth))),80)},{passive:true});
  const picker=gallery?.querySelector('[data-gallery-picker]');
  const saveImage=gallery?.querySelector('[data-gallery-save]');
  let pendingImage=false;
  gallery?.querySelector('[data-gallery-replace]')?.addEventListener('click',()=>picker?.click());
  picker?.addEventListener('change',()=>{
    const file=picker.files?.[0];if(!file)return;
    const reader=new FileReader();reader.onload=()=>{slides[current].src=reader.result;pendingImage=true;if(saveImage){saveImage.disabled=false;saveImage.textContent='SAVE IMAGE'}picker.value=''};reader.readAsDataURL(file);
  });
  saveImage?.addEventListener('click',async()=>{if(!pendingImage)return;const images=slides.map((slide)=>slide.getAttribute('src')||slide.src);saveImage.disabled=true;saveImage.textContent='SAVING…';try{images.forEach((source,index)=>{try{localStorage.setItem('ntx-article-gallery-'+key+'-'+index,source)}catch(_){}});await window.NTX_ARTICLES?.update(key,{images});pendingImage=false;saveImage.textContent='SAVED';setTimeout(()=>{saveImage.textContent='SAVE IMAGE'},1200)}catch(_){saveImage.disabled=false;saveImage.textContent='SAVE FAILED — RETRY'}});
  show(0);
  const revealGallery=()=>{
    const first=slides[0];
    if(!first){gallery?.classList.remove('is-loading');return}
    const reveal=()=>requestAnimationFrame(()=>gallery?.classList.remove('is-loading'));
    const decodeThenReveal=()=>typeof first.decode==='function'?first.decode().catch(()=>{}).then(reveal):reveal();
    if(first.complete&&first.naturalWidth){decodeThenReveal();return}
    first.addEventListener('load',decodeThenReveal,{once:true});
    first.addEventListener('error',reveal,{once:true});
  };
  Promise.resolve(window.NTX_ARTICLES?.ready).then(()=>{
    const latest=window.NTX_ARTICLES?.get(key)||{};
    if(latest.images?.length){slides.forEach((slide,index)=>{slide.src=latest.images[index]||latest.images[0]});show(0)}
    revealGallery();
  }).catch(revealGallery);
  setInterval(()=>{if(!pendingImage&&!document.hidden)show(current+1,true)},3800);
  const customCursor=document.querySelector('.ntx-custom-cursor');
  if(customCursor&&matchMedia('(pointer:fine) and (min-width:851px)').matches){
    document.addEventListener('pointermove',(event)=>{customCursor.style.left=event.clientX+'px';customCursor.style.top=event.clientY+'px';customCursor.classList.add('is-visible')},{passive:true});
    document.addEventListener('pointerdown',()=>customCursor.classList.add('is-pressed'));
    document.addEventListener('pointerup',()=>customCursor.classList.remove('is-pressed'));
    document.documentElement.addEventListener('mouseleave',()=>customCursor.classList.remove('is-visible'));
  }
  document.title=data.title[0]+' — NITUNXIANG';
  (async()=>{try{const local=['127.0.0.1','localhost'].includes(location.hostname),endpoint=local?'/api/site-draft':new URL('api/site-state',location.href).href,response=await fetch(endpoint,{cache:'no-store'});if(!response.ok)return;const contact=(await response.json()).footerContact;if(!contact)return;const links=document.querySelectorAll('.footer-bar a');if(links[0]&&contact.xiaohongshu)links[0].href=contact.xiaohongshu;if(links[1]&&contact.weixin)links[1].href=contact.weixin;if(links[2]&&contact.email){links[2].href='mailto:'+contact.email;links[2].textContent=contact.email}}catch(_){}})();
})();
