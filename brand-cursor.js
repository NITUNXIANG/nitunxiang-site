(()=>{
  if(!matchMedia('(pointer:fine) and (min-width:851px)').matches)return;
  let cursor=document.querySelector('.ntx-custom-cursor');
  if(!cursor){cursor=document.createElement('div');cursor.className='ntx-custom-cursor';cursor.setAttribute('aria-hidden','true');cursor.innerHTML='<img src="assets/ntx-logo-pointer.svg" alt="">';document.body.append(cursor)}
  const darkSelector='.site-header,.catalog-header,.product-header,.editorial-header,.editorial-footer,.detail-quote';
  const mediaSelector='img,video,.hero,.hero-media,.carousel-slide,.media-frame,.detail-gallery-viewport,[data-manifesto-image]';
  document.addEventListener('pointermove',(event)=>{
    const target=document.elementFromPoint(event.clientX,event.clientY);
    cursor.style.left=event.clientX+'px';cursor.style.top=event.clientY+'px';cursor.classList.add('is-visible');
    if(!target)return;
    cursor.classList.toggle('is-over-media',Boolean(target?.closest(mediaSelector)));
    cursor.classList.toggle('is-over-dark',Boolean(target?.closest(darkSelector))&&!target?.closest(mediaSelector));
  },{passive:true});
  document.addEventListener('pointerdown',()=>cursor.classList.add('is-pressed'));
  document.addEventListener('pointerup',()=>cursor.classList.remove('is-pressed'));
  window.addEventListener('pageshow',()=>cursor.classList.remove('is-pressed'));
  document.documentElement.addEventListener('mouseleave',()=>cursor.classList.remove('is-visible'));
})();
