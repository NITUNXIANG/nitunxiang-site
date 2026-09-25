(()=>{
  document.querySelectorAll('[data-list-gallery]').forEach((gallery)=>{
    const slug=gallery.dataset.listGallery,viewport=gallery.querySelector('.list-gallery-viewport'),track=gallery.querySelector('.list-gallery-track'),slides=[...gallery.querySelectorAll('.list-gallery-track img')],buttons=[...gallery.querySelectorAll('[data-list-index]')],counter=gallery.querySelector('[data-list-current]');let current=0,scrollTimer=0;
    slides.forEach((slide,index)=>{const saved=localStorage.getItem('ntx-article-gallery-'+slug+'-'+index),shared=window.NTX_ARTICLES?.get(slug)?.images?.[index];if(saved||shared)slide.src=shared||saved});
    const show=(index,scroll=false)=>{current=(index+slides.length)%slides.length;buttons.forEach((button,buttonIndex)=>button.classList.toggle('is-active',buttonIndex===current));if(counter)counter.textContent=String(current+1).padStart(2,'0');if(matchMedia('(max-width:850px)').matches){if(scroll)viewport.scrollTo({left:current*viewport.clientWidth,behavior:'smooth'})}else track.style.transform='translateX(-'+current*100+'%)'};
    buttons.forEach((button)=>button.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();show(Number(button.dataset.listIndex),true)}));
    viewport.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>show(Math.round(viewport.scrollLeft/Math.max(1,viewport.clientWidth))),80)},{passive:true});
    const picker=gallery.querySelector('[data-list-picker]');gallery.querySelector('[data-list-replace]')?.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();picker?.click()});
    viewport.setAttribute('role','link');viewport.setAttribute('tabindex','0');viewport.setAttribute('aria-label','打开文章');const openArticle=()=>{location.href='article-detail.html?article='+encodeURIComponent(slug)};viewport.addEventListener('click',openArticle);viewport.addEventListener('keydown',(event)=>{if(event.key==='Enter'){event.preventDefault();openArticle()}});
    picker?.addEventListener('change',()=>{const file=picker.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{slides[current].src=reader.result;try{localStorage.setItem('ntx-article-gallery-'+slug+'-'+current,reader.result)}catch(_){}const images=[...(window.NTX_ARTICLES?.get(slug)?.images||[])];images[current]=reader.result;window.NTX_ARTICLES?.update(slug,{images});picker.value=''};reader.readAsDataURL(file)});
    show(0);
    window.NTX_ARTICLES?.ready?.then(()=>{const shared=window.NTX_ARTICLES?.get(slug)?.images||[];if(!shared.length)return;slides.forEach((slide,index)=>{slide.src=shared[index]||shared[0]});show(0)});
  });
})();
