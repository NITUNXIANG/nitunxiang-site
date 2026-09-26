(function(){
  const key=new URLSearchParams(location.search).get('article')||'objects';
  const data=window.NTX_ARTICLES?.get(key)||{};
  const activeCategory=data.category||'nitunxiang';
  document.querySelector('[data-detail-category="'+activeCategory+'"]')?.classList.add('is-active');
  const categoryResults=document.querySelector('[data-detail-category-results]');
  let expandedCategory='';
  let guideMode='index';categoryResults.dataset.guideMode=guideMode;
  const esc=(value)=>String(value??'').replace(/[&<>"']/g,(character)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const dateParts=(value)=>{const parts=String(value||'').split('.'),day=parts[0]||'01';if(parts.length<3)return{day,weekday:['Mon','周一']};const date=new Date(2000+Number(parts[2]),Number(parts[1])-1,Number(parts[0]));const en=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()]||'Mon',zh=['周日','周一','周二','周三','周四','周五','周六'][date.getDay()]||'周一';return{day,weekday:[en,zh]}};
  const renderCategoryResults=(category)=>{if(!categoryResults)return;const entries=Object.entries(window.NTX_ARTICLES?.all?.()||{}).filter(([,article])=>(article.category||'nitunxiang')===category);categoryResults.innerHTML=entries.map(([slug,article],index)=>{const href=`article-detail.html?article=${encodeURIComponent(slug)}`,number=String(index+1).padStart(2,'0'),date=dateParts(article.date),images=(article.images?.length?article.images:['']).slice(0,3),tags=(article.tags||[]).map((tag)=>`<span data-bi-en="${esc(tag?.[0])}" data-bi-zh="${esc(tag?.[1])}">${esc(tag?.[0])}</span>`).join('');while(images.length<3)images.push(images[0]||'');return `<article class="story article-row detail-guide-row"><time class="article-date"><span data-bi-en="${date.weekday[0]}" data-bi-zh="${date.weekday[1]}">${date.weekday[0]}</span><strong>${esc(date.day)}</strong></time><a class="detail-guide-image" href="${href}" aria-label="${esc(article.title?.[0])}"><figure class="article-list-gallery"><div class="list-gallery-viewport"><div class="list-gallery-track">${images.map((image)=>`<img src="${esc(image)}" alt="">`).join('')}</div></div></figure></a><div class="story-copy"><div class="story-meta"><span data-bi-en="${esc(article.type?.[0])}" data-bi-zh="${esc(article.type?.[1])}">${esc(article.type?.[0])}</span><time>${esc(article.date||number)}</time></div><h2 data-bi-en="${esc(article.title?.[0])}" data-bi-zh="${esc(article.title?.[1])}">${esc(article.title?.[0]||article.title?.[1])}</h2><p data-bi-en="${esc(article.dek?.[0])}" data-bi-zh="${esc(article.dek?.[1])}">${esc(article.dek?.[0]||article.dek?.[1])}</p><div class="article-tags">${tags}</div></div><a class="row-arrow" href="${href}" aria-label="${esc(article.title?.[0])}">↗</a></article><a class="detail-category-result" href="${href}"><span>${esc(article.title?.[1]||article.title?.[0])}</span><i>${esc(article.title?.[0]||'')}</i><b>${number}</b></a>`}).join('');const currentLanguage=document.querySelector('[data-bi-language="zh"]')?'zh':'en';categoryResults.querySelectorAll('[data-bi-en][data-bi-zh]').forEach((node)=>{node.textContent=node.dataset[currentLanguage==='zh'?'biZh':'biEn'];node.dataset.biLanguage=currentLanguage;node.lang=currentLanguage==='zh'?'zh-CN':'en'});categoryResults.hidden=!entries.length};
  const syncGuideState=()=>{document.body.classList.toggle('detail-guide-open',Boolean(expandedCategory));document.body.classList.remove('detail-guide-visual-open')};
  document.querySelectorAll('[data-detail-category]').forEach((link)=>link.addEventListener('click',(event)=>{event.preventDefault();const category=link.dataset.detailCategory;if(expandedCategory===category){expandedCategory='';categoryResults.hidden=true;syncGuideState();link.setAttribute('aria-expanded','false');return}expandedCategory=category;syncGuideState();document.querySelectorAll('[data-detail-category]').forEach((item)=>item.setAttribute('aria-expanded',String(item===link)));renderCategoryResults(category)}));
  categoryResults?.addEventListener('click',(event)=>{
    const link=event.target.closest('.detail-category-result');
    if(!link||!matchMedia('(max-width:850px)').matches)return;
    event.preventDefault();
    if(link.classList.contains('is-activating'))return;
    link.classList.add('is-activating');
    setTimeout(()=>{location.href=link.href},380);
  });
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
    if(expandedCategory)renderCategoryResults(expandedCategory);
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
