const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
if(nav)nav.dataset.language='en';
function updateDesktopNavOverflow(){if(!nav||!window.matchMedia('(min-width:761px)').matches)return;nav.style.setProperty('--nav-overflow',`${Math.max(0,nav.scrollWidth-nav.clientWidth)}px`)}
toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); if(open)requestAnimationFrame(updateDesktopNavOverflow); });
window.addEventListener('resize',updateDesktopNavOverflow);
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { toggle?.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));

document.querySelectorAll('[data-gene-toggle]').forEach((button)=>button.addEventListener('click',()=>{
  const group=button.closest('.gene-group');
  const open=!group.classList.contains('is-open');
  group.classList.toggle('is-open',open);
  button.setAttribute('aria-expanded',String(open));
}));

const imagePool = [
  'assets/published-data/e327979d9a9935866da41174.webp',
  'assets/products/sku-02.webp',
  'assets/products/sku-03.webp',
  'assets/products/sku-04.webp',
  'assets/products/sku-05.webp',
  'assets/products/sku-06.webp',
  'assets/products/sku-07.webp',
  'assets/products/sku-08.webp'
];
const heroInitialImages = [
  'assets/published-data/e327979d9a9935866da41174.webp',
  'assets/published-data/25cbab9cf5f6f1eff2e40772.jpg',
  'assets/published-data/802121d9fbef0790f2a7ed09.jpg',
  'assets/published-data/b494d34d4d6288cea672aa2d.jpg',
  'assets/published-data/a8c37bd9ffc0089dab773f34.jpg'
];
const savedLookImages = [
  ['assets/products/sku-01.webp','assets/products/sku-03.webp','assets/products/sku-04.webp','assets/products/sku-05.webp','assets/products/sku-06.webp'],
  ['assets/products/sku-04.webp','assets/products/sku-05.webp','assets/products/sku-06.webp','assets/products/sku-07.webp','assets/products/sku-08.webp'],
  ['assets/products/sku-07.webp','assets/products/sku-07.webp','assets/products/sku-08.webp','assets/products/sku-01.webp','assets/products/sku-02.webp'],
  ['assets/products/sku-09.webp','assets/products/sku-01.webp','assets/products/sku-02.webp','assets/products/sku-03.webp','assets/products/sku-04.webp']
];
const savedAboutImages = [
  'assets/published-data/65915db832b3622338fa61cc.webp',
  'assets/published-data/ab5d4202803a92bde60065f2.webp',
  'assets/published-data/143e5d75f414756e4762dce3.webp'
];
const savedManifestoImages = [
  'assets/published-data/991caff2139e4011b4ef90cd.webp','assets/published-data/57121ec11bbf02a819051867.webp',
  'assets/published-data/c895236623a12c91461d290b.webp','assets/published-data/01baf9d00260eff7267a1cf3.webp',
  'assets/published-data/badae952a2d855d8131cb2e0.webp','assets/published-data/a069ac18924e2e1858339b93.webp',
  'assets/published-data/962c4615107bbb6427801085.webp','assets/published-data/7d30ee3ae0e8ad398ad325ea.webp',
  'assets/published-data/49a80ad49166cda487f4d681.webp','assets/published-data/f2fc12ffc793a672cceda052.webp'
];
const carousels = [];
const aboutIndexNode=document.querySelector('.about-index');
function updateAboutIndexContrast(source){
  if(!aboutIndexNode||!source)return;
  const clean=String(source).replace(/^url\(["']?/,'').replace(/["']?\)$/,'');
  const image=new Image();image.crossOrigin='anonymous';
  image.onload=()=>{try{const canvas=document.createElement('canvas'),context=canvas.getContext('2d',{willReadFrequently:true});canvas.width=24;canvas.height=24;context.drawImage(image,0,0,24,24);const pixels=context.getImageData(0,0,24,24).data;let total=0,count=0;for(let index=0;index<pixels.length;index+=4){if(pixels[index+3]<32)continue;total+=.2126*pixels[index]+.7152*pixels[index+1]+.0722*pixels[index+2];count++}aboutIndexNode.classList.toggle('is-on-light',count>0&&total/count>127.5)}catch(_){aboutIndexNode.classList.remove('is-on-light')}};
  image.onerror=()=>aboutIndexNode.classList.remove('is-on-light');image.src=clean;
}
function createCarousel(host, sources, type = 'img', limit = 5) {
  host.classList.add('carousel-host');
  // 清除容器旧背景，防止轮播切换时从透明层下透出上一张图片。
  host.style.backgroundImage = 'none';
  if (host.classList.contains('about-image')) host.style.position = 'relative';
  const original = host.matches('.look') ? host.querySelector(':scope > img') : null;
  if (original) original.remove();
  const slides = sources.slice(0, limit).map((src, index) => {
    const slide = type === 'img' ? document.createElement('img') : document.createElement('div');
    slide.className = `carousel-slide${index === 0 ? ' is-active' : ''}`; slide.dataset.slideIndex = String(index);
    if (type === 'img') { slide.src = src; slide.alt = `轮播图片 ${index + 1}`; } else { slide.style.backgroundImage = `url("${src}")`; slide.setAttribute('role', 'img'); }
    host.prepend(slide); return slide;
  });
  const dots = document.createElement('div'); dots.className = 'carousel-dots';
  dots.innerHTML = slides.map((_, i) => `<button type="button" class="${i === 0 ? 'is-active' : ''}" aria-label="显示第 ${i + 1} 张图片"></button>`).join(''); host.append(dots);
  const item = { host, slides, dots: [...dots.children], index: 0 };
  item.show = (next) => {
    const target = (next + slides.length) % slides.length;
    if (target === item.index) return;
    const nextSlide=slides[target];
    const commit=()=>{
      const previous=slides[item.index];
      item.index=target;
      if(host.matches('[data-manifesto-image]')){
        previous.classList.add('is-leaving');
        previous.classList.remove('is-active');
        nextSlide.classList.add('is-active');
        window.setTimeout(()=>previous.classList.remove('is-leaving'),650);
      }else slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===item.index));
      item.dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===item.index));
      if(host.classList.contains('about-image'))updateAboutIndexContrast(sources[item.index]);
    };
    if(nextSlide.tagName==='IMG'&&(!nextSlide.complete||!nextSlide.naturalWidth)){nextSlide.addEventListener('load',commit,{once:true});return;}
    if(nextSlide.tagName!=='IMG'){
      const match=nextSlide.style.backgroundImage.match(/^url\(["']?(.*?)["']?\)$/i);
      const source=match?.[1];
      if(source){
        const preload=new Image();let committed=false;
        const finish=()=>{if(committed)return;committed=true;commit()};
        preload.onload=finish;preload.onerror=finish;preload.src=source;
        if(preload.complete&&preload.naturalWidth)finish();
        return;
      }
    }
    commit();
  };
  item.dots.forEach((dot, i) => dot.addEventListener('click', (event) => { event.stopPropagation(); item.show(i); }));if(host.classList.contains('about-image'))updateAboutIndexContrast(sources[0]);carousels.push(item); return item;
}
const heroCarouselHost=document.querySelector('.hero-media');
createCarousel(heroCarouselHost, heroInitialImages, 'background');
if(heroCarouselHost){
  const openHeroArticle=()=>{if(!document.body.classList.contains('editing-active'))location.href='article-detail.html?article=objects';};
  heroCarouselHost.setAttribute('tabindex','0');
  heroCarouselHost.setAttribute('role','link');
  heroCarouselHost.setAttribute('aria-label','阅读游牧系列文章');
  heroCarouselHost.addEventListener('click',(event)=>{if(event.target.closest('.carousel-dots'))return;openHeroArticle();});
  heroCarouselHost.addEventListener('keydown',(event)=>{if(event.key==='Enter'){event.preventDefault();openHeroArticle();}});
}
document.querySelectorAll('.look').forEach((look, index) => createCarousel(look, savedLookImages[index]||savedLookImages[0]));
const aboutImageHost=document.querySelector('.about-image');
const aboutCarousel=aboutImageHost?createCarousel(aboutImageHost,savedAboutImages,'background',3):null;
const manifestoCarouselHost=document.querySelector('[data-manifesto-image]');
manifestoCarouselHost?.querySelector('img')?.remove();
const manifestoCarousel=manifestoCarouselHost?createCarousel(manifestoCarouselHost,savedManifestoImages,'img',10):null;
if(manifestoCarouselHost&&manifestoCarousel){
  let swipeStart=null;
  const swipeSurface=document.querySelector('.manifesto')||manifestoCarouselHost;
  swipeSurface.addEventListener('pointerdown',(event)=>{
    if(document.body.classList.contains('editing-active')||event.button!==0)return;
    swipeStart={x:event.clientX,y:event.clientY,id:event.pointerId};
  });
  swipeSurface.addEventListener('pointerup',(event)=>{
    if(!swipeStart||swipeStart.id!==event.pointerId)return;
    const dx=event.clientX-swipeStart.x,dy=event.clientY-swipeStart.y;swipeStart=null;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2)manifestoCarousel.show(manifestoCarousel.index+(dx<0?1:-1));
  });
  swipeSurface.addEventListener('pointercancel',()=>{swipeStart=null;});
}
setInterval(() => { if (!document.body.classList.contains('editing-active')) carousels.forEach((item) => item.show(item.index + 1)); }, 3800);

const sculptureSources = [
  'assets/catalog/product-20.webp', 'assets/catalog/product-13.webp',
  'assets/catalog/product-77.webp', 'assets/catalog/product-10.webp',
  'assets/catalog/product-14.webp', 'assets/catalog/product-16.webp',
  'assets/catalog/product-21.webp', 'assets/catalog/product-22.webp'
];
const sculptureBoundsCache=new Map();
function scanSculptureBounds(image){
  const maxSide=360,ratio=Math.min(1,maxSide/Math.max(image.naturalWidth,image.naturalHeight));
  const width=Math.max(1,Math.round(image.naturalWidth*ratio)),height=Math.max(1,Math.round(image.naturalHeight*ratio));
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0,width,height);
  const pixels=context.getImageData(0,0,width,height).data;
  const corners=[[2,2],[width-3,2],[2,height-3],[width-3,height-3]];
  const background=[0,1,2].map(channel=>corners.reduce((sum,[x,y])=>sum+pixels[(Math.max(0,y)*width+Math.max(0,x))*4+channel],0)/corners.length);
  const rows=new Uint32Array(height),columns=new Uint32Array(width),rowLeft=new Int32Array(height),rowRight=new Int32Array(height);
  rowLeft.fill(width);rowRight.fill(-1);
  for(let y=0;y<height;y++){for(let x=0;x<width;x++){const offset=(y*width+x)*4,r=pixels[offset],g=pixels[offset+1],b=pixels[offset+2];const dr=r-background[0],dg=g-background[1],db=b-background[2];const maximum=Math.max(r,g,b),minimum=Math.min(r,g,b),chroma=maximum-minimum,saturation=maximum?chroma/maximum:0,colorDistance=Math.sqrt(dr*dr+dg*dg+db*db);if(chroma>16&&saturation>.14&&colorDistance>42){rows[y]++;columns[x]++;rowLeft[y]=Math.min(rowLeft[y],x);rowRight[y]=Math.max(rowRight[y],x);}}}
  const rowMinimum=Math.max(2,Math.round(width*.008)),columnMinimum=Math.max(2,Math.round(height*.008));
  let top=0,bottom=height-1,left=0,right=width-1;
  while(top<bottom&&rows[top]<rowMinimum)top++;while(bottom>top&&rows[bottom]<rowMinimum)bottom--;
  while(left<right&&columns[left]<columnMinimum)left++;while(right>left&&columns[right]<columnMinimum)right--;
  if(bottom-top<height*.08)return {left:0,top:0,width:1,height:1};
  // 水平居中只采用器物的高密度彩色像素带。投影即使略带环境色，
  // 在单列中的像素密度也远低于器物主体，因此不会再把中心拖向影子。
  let peakColumn=0;
  for(let x=0;x<width;x++)peakColumn=Math.max(peakColumn,columns[x]);
  const bodyColumnMinimum=Math.max(columnMinimum,Math.round(peakColumn*.18));
  let bodyLeft=0,bodyRight=width-1;
  while(bodyLeft<bodyRight&&columns[bodyLeft]<bodyColumnMinimum)bodyLeft++;
  while(bodyRight>bodyLeft&&columns[bodyRight]<bodyColumnMinimum)bodyRight--;
  // 再以器物上部至中部的逐行轮廓中心取中位数。底部投影不会参与，
  // 中位数也能抵消局部高光、纹理缺口以及不规则器型造成的偏差。
  const rowCenters=[];
  const centerScanBottom=Math.min(bottom,Math.round(top+(bottom-top)*.72));
  for(let y=top;y<=centerScanBottom;y++){
    const span=rowRight[y]-rowLeft[y]+1;
    if(rows[y]>=rowMinimum&&span>width*.025&&span<width*.72)rowCenters.push((rowLeft[y]+rowRight[y]+1)/(2*width));
  }
  rowCenters.sort((a,b)=>a-b);
  const denseCenter=(bodyLeft+bodyRight+1)/(2*width);
  const center=rowCenters.length>=5?rowCenters[Math.floor(rowCenters.length/2)]:denseCenter;
  return {left:left/width,top:top/height,width:(right-left+1)/width,height:(bottom-top+1)/height,center};
}
function fitSculptureObject(image){
  if(!window.matchMedia('(max-width:760px)').matches){['left','top','width','height'].forEach(property=>image.style.removeProperty(property));return;}
  if(!image.complete||!image.naturalWidth)return;
  try{
    const key=image.currentSrc||image.src;let bounds=sculptureBoundsCache.get(key);if(!bounds){bounds=scanSculptureBounds(image);sculptureBoundsCache.set(key,bounds);}
    const container=image.parentElement,containerWidth=container.clientWidth,containerHeight=container.clientHeight;
    const scale=(containerHeight+2)/(image.naturalHeight*bounds.height);
    const renderedWidth=image.naturalWidth*scale,renderedHeight=image.naturalHeight*scale;
    image.style.width=`${renderedWidth}px`;image.style.height=`${renderedHeight}px`;
    const bodyCenter=Number.isFinite(bounds.center)?bounds.center:bounds.left+bounds.width/2;
    image.style.left=`${containerWidth/2-bodyCenter*renderedWidth}px`;
    image.style.top=`${-bounds.top*renderedHeight-1}px`;
  }catch(_){['left','top','width','height'].forEach(property=>image.style.removeProperty(property));}
  image.parentElement.classList.remove('is-changing');
}
document.querySelectorAll('[data-sculpture-segment]').forEach((segment,index) => {
  let sourceIndex=index;
  const image=segment.querySelector('img');
  image.addEventListener('load',()=>fitSculptureObject(image));
  if(image.complete)requestAnimationFrame(()=>fitSculptureObject(image));
  segment.addEventListener('click', () => {
    sourceIndex=(sourceIndex+1)%sculptureSources.length;
    segment.classList.add('is-changing');
    window.setTimeout(() => {
      image.src=sculptureSources[sourceIndex];
    },160);
  });
});
let sculptureResizeTimer;
window.addEventListener('resize',()=>{clearTimeout(sculptureResizeTimer);sculptureResizeTimer=setTimeout(()=>document.querySelectorAll('[data-sculpture-segment] img').forEach(fitSculptureObject),100);});

/* 手机端柔和磁吸：只在区块上沿已经非常靠近页面上沿时接住。 */
if(window.matchMedia('(max-width:760px)').matches){
  let softSnapTimer=null,softSnapping=false;
  window.addEventListener('scroll',()=>{
    if(softSnapping||document.body.classList.contains('editing-active'))return;
    clearTimeout(softSnapTimer);
    softSnapTimer=window.setTimeout(()=>{
      const sections=[...document.querySelectorAll('.home-page main>section')];
      const nearest=sections.map((section)=>({section,distance:Math.abs(section.getBoundingClientRect().top)})).sort((a,b)=>a.distance-b.distance)[0];
      if(!nearest||nearest.distance>56)return;
      const top=window.scrollY+nearest.section.getBoundingClientRect().top;
      if(Math.abs(window.scrollY-top)<2)return;
      softSnapping=true;
      window.scrollTo({top,behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
      window.setTimeout(()=>{softSnapping=false;},420);
    },150);
  },{passive:true});
}

/* 电脑端哲学区轻吸附：接近语言切换条下沿并停止滚动后才柔和对齐。 */
if(window.matchMedia('(min-width:761px)').matches&&document.body.classList.contains('home-page')){
  const philosophySection=document.querySelector('.about');
  const languageNotice=document.querySelector('[data-language-notice]');
  const siteHeader=document.querySelector('.site-header');
  let philosophySnapTimer=null,philosophySnapping=false;
  const philosophyAnchorBottom=()=>{
    if(languageNotice&&getComputedStyle(languageNotice).display!=='none')return languageNotice.getBoundingClientRect().bottom;
    return siteHeader?siteHeader.getBoundingClientRect().bottom:76;
  };
  window.addEventListener('scroll',()=>{
    if(!philosophySection||philosophySnapping||document.body.classList.contains('editing-active'))return;
    clearTimeout(philosophySnapTimer);
    philosophySnapTimer=window.setTimeout(()=>{
      const delta=philosophySection.getBoundingClientRect().top-philosophyAnchorBottom();
      if(Math.abs(delta)>48||Math.abs(delta)<1.5)return;
      philosophySnapping=true;
      window.scrollTo({
        top:window.scrollY+delta,
        behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'
      });
      window.setTimeout(()=>{philosophySnapping=false;},360);
    },130);
  },{passive:true});
}

const editor = document.querySelector('[data-editor-panel]');
const editMode = document.querySelector('[data-edit-mode]');
const imagePicker = document.querySelector('[data-image-picker]');
const editorStatus = document.querySelector('[data-editor-status]');
const selectionLabel = document.querySelector('[data-text-selection]');
const carouselSelection = document.querySelector('[data-carousel-selection]');
const hoverTranslationInput = document.querySelector('[data-hover-translation]');
const hoverTranslationHint = document.querySelector('[data-hover-translation-hint]');
const initialLanguageSelect = document.querySelector('[data-initial-language]');
const englishFontSelect = document.querySelector('[data-font-english]');
const chineseFontSelect = document.querySelector('[data-font-chinese]');
const englishCaseSelect = document.querySelector('[data-english-case]');
const englishCaseWrap = document.querySelector('[data-philosophy-english-case]');
const footerXiaohongshu=document.querySelector('[data-footer-xiaohongshu]');
const footerWeixin=document.querySelector('[data-footer-weixin]');
const footerEmail=document.querySelector('[data-footer-email]');
const footerXiaohongshuInput=document.querySelector('[data-footer-xiaohongshu-input]');
const footerWeixinInput=document.querySelector('[data-footer-weixin-input]');
const footerEmailInput=document.querySelector('[data-footer-email-input]');
let imageTarget = null;
let guideImageTarget = null;
let manifestoImageTarget = null;
let geneImageTarget = null;
let selectedText = null;
const hoverPairs = [
  { key:'hero-kicker', node: document.querySelector('.hero-kicker'), translation: '器物 · 文化 · 时间\n上海 · 2026' },
  { key:'hero-index', node: document.querySelector('.hero-index'), translation: '编号 001 / 026' },
  { key:'hero-collection', node: document.querySelector('.hero-copy>p'), translation: '系列 01 / 2026' },
  { key:'hero-scroll', node: document.querySelector('.scroll-cue'), translation: '向下浏览\n↓' },
  { key:'manifesto-index', node: document.querySelector('.manifesto>.eyebrow'), translation: '01 / 品牌宣言' },
  { key:'manifesto-title', node: document.querySelector('.manifesto-copy>p:first-child'), translation: '自由明智。' },
  { key:'manifesto-copy', node: document.querySelector('.manifesto-copy>.muted'), translation: '我们是一个以人文创新实验为宗旨的陶瓷容器艺术设计品牌。' },
  { key:'manifesto-side', node: document.querySelector('.manifesto>.side-note'), translation: '为边界之间而设计。' },
  { key:'gene-index', node: document.querySelector('.gene-heading .eyebrow'), translation: '02 / 品牌基因' },
  { key:'gene-culture', node: document.querySelector('.gene-group:nth-child(1) .gene-bar span'), translation: '中国文化与非遗', defaultInitial:'zh' },
  { key:'gene-contemporary', node: document.querySelector('.gene-group:nth-child(2) .gene-bar span'), translation: '当代艺术与设计', defaultInitial:'zh' },
  { key:'glaze-head-index', node: document.querySelector('.glaze-guide-head .eyebrow'), translation: '釉色索引 / 2026' },
  { key:'glaze-head-title', node: document.querySelector('.glaze-guide-head h2'), translation: '三釉色导览' },
  { key:'glaze-head-copy', node: document.querySelector('.glaze-guide-head>p:last-child'), translation: '按釉色进入独立商品目录' },
  { key:'glaze-1-name', node: document.querySelector('.glaze-guide-card:nth-child(1) b'), translation: '游牧之歌' },
  { key:'glaze-1-entry', node: document.querySelector('.glaze-guide-card:nth-child(1) i'), translation: '商店' },
  { key:'glaze-2-name', node: document.querySelector('.glaze-guide-card:nth-child(2) b'), translation: '食夜之日' },
  { key:'glaze-2-entry', node: document.querySelector('.glaze-guide-card:nth-child(2) i'), translation: '商店' },
  { key:'glaze-3-name', node: document.querySelector('.glaze-guide-card:nth-child(3) b'), translation: '渴者之息' },
  { key:'glaze-3-entry', node: document.querySelector('.glaze-guide-card:nth-child(3) i'), translation: '商店' }
].filter((pair) => pair.node);
[
  {key:'works-index',selector:'.works .section-head .eyebrow',translation:'03 / 精选作品'},
  {key:'works-title',selector:'.works .section-head h2',translation:'收藏\n系列'},
  {key:'works-copy',selector:'.works .section-head>p:last-child',translation:'六个造型，一种持续的语言。\n探索 2026 系列。'},
  {key:'works-link',selector:'.collection-link',translation:'查看完整系列 →'},
  {key:'about-index',selector:'.about-index',translation:'03 / 品牌哲学'},
  {key:'about-title',selector:'.about-copy h2',translation:'超越\n季节'},
  {key:'about-copy',selector:'.about-copy>p:not(.eyebrow)',translation:'泥吞象 NITUNXIANG 是一个研究器物、身体与日常关系的独立品牌。我们从自然形态、手工痕迹与当代生活出发，创造能够长久陪伴使用者的作品。'},
  {key:'about-link',selector:'.about-copy .text-link',translation:'阅读品牌理念 ↗'},
  {key:'journal-index',selector:'.journal>.eyebrow',translation:'05 / 文章'},
  {key:'journal-title-1',selector:'.journal-item:nth-of-type(1) h3',translation:'关于寂静与结构'},
  {key:'journal-title-2',selector:'.journal-item:nth-of-type(2) h3',translation:'亚麻的重量'},
  {key:'footer-enquiry',selector:'.footer-top>p',translation:'有项目、合作或造型需求？'},
  {key:'footer-talk',selector:'.footer-top>a',translation:'联系我们 ↗'},
  {key:'footer-address',selector:'.footer-grid>div:nth-of-type(2)>p',translation:'上海市静安区\n预约制工作室'},
  {key:'footer-rights',selector:'.footer-bottom>span:nth-child(2)',translation:'版权所有'},
  {key:'footer-top-link',selector:'.footer-bottom>a',translation:'返回顶部 ↑'}
].forEach(({key,selector,translation})=>{const node=document.querySelector(selector);if(node)hoverPairs.push({key,node,translation});});
document.querySelectorAll('.look-meta span,.archive-card>div span').forEach((node,index)=>hoverPairs.push({key:`object-meta-${index}`,node,translation:node.textContent.replace(/Object/gi,'器物').replace(/Ceramic/gi,'陶瓷').replace(/Fire/gi,'火').replace(/Clay/gi,'陶土').replace(/Glaze/gi,'釉').replace(/Earth/gi,'土').replace(/Trace/gi,'痕迹').replace(/Form/gi,'形态').replace(/Time/gi,'时间').replace(/Archive/gi,'档案')}));
const homeCategoryNav=document.querySelector('.home-article-categories'),homeNomadicTrigger=document.querySelector('[data-home-nomadic-trigger]'),homeNomadicSubmenu=document.querySelector('.home-nomadic-subcategories');
if(homeCategoryNav&&homeNomadicTrigger&&homeNomadicSubmenu){
  const introPanel=homeCategoryNav.querySelector('.home-category-intro'),introZh=introPanel?.querySelector('span'),introEn=introPanel?.querySelector('i'),aboutCopy=homeCategoryNav.closest('.about-copy');
  let previewLink=null,interactionTimer=0,nomadicHoverCloseTimer=0;
  const setHomeNomadicOpen=(open)=>{homeCategoryNav.classList.toggle('is-nomadic-open',open);homeNomadicTrigger.setAttribute('aria-expanded',String(open));};
  const showCategoryIntro=(link)=>{clearTimeout(interactionTimer);previewLink=link;introPanel?.classList.remove('is-activating');if(introZh)introZh.textContent=link.dataset.introZh||'';if(introEn)introEn.textContent=link.dataset.introEn||'';introPanel?.classList.add('is-open');introPanel?.setAttribute('aria-hidden','false');aboutCopy?.classList.add('is-category-intro-open');homeCategoryNav.classList.add('is-intro-open');};
  const closeCategoryIntro=()=>{clearTimeout(interactionTimer);setHomeNomadicOpen(false);introPanel?.classList.remove('is-open','is-activating');introPanel?.setAttribute('aria-hidden','true');aboutCopy?.classList.remove('is-category-intro-open');homeCategoryNav.classList.remove('is-intro-open');previewLink=null;};
  const activateThenNavigate=(link,group)=>{group.forEach((item)=>item.classList.toggle('is-active',item===link));setTimeout(()=>{location.href=link.href;},450);};
  const motherLinks=[...homeCategoryNav.querySelectorAll(':scope > a')];
  const childLinks=[...homeNomadicSubmenu.querySelectorAll('a')];
  let activeHomeArticle='objects',activeHomeCategory='nitunxiang';
  const articleForCategory=(category,fallback)=>{const entries=Object.entries(window.NTX_ARTICLES?.all?.()||{}),match=entries.find(([,article])=>article.category===category)?.[0];if(match)return match;const fallbackArticle=window.NTX_ARTICLES?.get(fallback);return fallbackArticle?.category===category?fallback:null};
  const homeArticleIntro=(value='')=>String(value).split(/\n[\t ]*\n/).map((part)=>part.trim()).find(Boolean)||'';
  const matchChineseTitleLines=(english='',chinese='')=>{const lines=String(chinese).split(/\n+/).filter((line)=>line.trim());if(lines.length<2||String(english).includes('\n'))return String(english);const punctuationParts=String(english).split(/(?<=[,;:])\s+/).filter(Boolean);if(punctuationParts.length===lines.length)return punctuationParts.join('\n');const words=String(english).trim().split(/\s+/),perLine=Math.ceil(words.length/lines.length),result=[];for(let i=0;i<lines.length;i++)result.push(words.slice(i*perLine,i===lines.length-1?words.length:(i+1)*perLine).join(' '));return result.filter(Boolean).join('\n')};
  const renderHomeArticle=(key)=>{if(!key)return;activeHomeArticle=key;const data=window.NTX_ARTICLES?.get(activeHomeArticle);if(!data||data.category!==activeHomeCategory)return;const title=document.querySelector('.about-copy h2'),summary=document.querySelector('.about-copy>p:not(.eyebrow)'),meta=[...document.querySelectorAll('.about-editorial-meta span')],tags=[...document.querySelectorAll('.about-editorial-tags span')],hit=document.querySelector('.about-hit'),titleValues=[matchChineseTitleLines(data.title?.[0],data.title?.[1]),data.title?.[1]||''],summaryValues=[homeArticleIntro(data.dek?.[0]),homeArticleIntro(data.dek?.[1])];[[title,titleValues],[summary,summaryValues]].forEach(([node,value])=>{if(!node||!value)return;const pair=hoverPairs.find((item)=>item.node===node);if(pair){pair.englishHtml=translationHtml(value[0]||'');pair.translation=value[1]||'';node.innerHTML=pair.isChinese?translationHtml(pair.translation):pair.englishHtml}else node.textContent=value[0]||''});title?.classList.toggle('is-long-title',(titleValues[0]||'').replace(/\s/g,'').length>38);if(meta[0])meta[0].textContent=data.type?.[0]||'';if(meta[1])meta[1].textContent=data.date||'';tags.forEach((tag,index)=>{const value=data.tags?.[index]?.[0];tag.hidden=!value;if(value)tag.textContent=value});if(hit)hit.href='article-detail.html?article='+encodeURIComponent(activeHomeArticle);if(aboutCarousel&&data.images?.length){const images=data.images;aboutCarousel.slides.forEach((slide,index)=>setSlideSource(slide,images[index]||images[0]));aboutCarousel.show(0)}};
  window.syncHomeArticle=()=>renderHomeArticle(articleForCategory(activeHomeCategory,activeHomeArticle));
  motherLinks.forEach((link)=>link.addEventListener('click',(event)=>{event.preventDefault();if(previewLink===link&&introPanel?.classList.contains('is-open')){closeCategoryIntro();return;}setHomeNomadicOpen(false);motherLinks.forEach((item)=>item.classList.toggle('is-active',item===link));activeHomeCategory=new URL(link.href).searchParams.get('category')||'nitunxiang';renderHomeArticle(articleForCategory(activeHomeCategory,link.dataset.homeArticle));showCategoryIntro(link);}));
  const followCategoryIntro=()=>{if(!previewLink||!introPanel?.classList.contains('is-open'))return;clearTimeout(interactionTimer);introPanel.classList.add('is-activating');if(previewLink===homeNomadicTrigger){interactionTimer=setTimeout(()=>{setHomeNomadicOpen(true);},window.matchMedia('(hover:hover) and (pointer:fine)').matches?80:320);return;}interactionTimer=setTimeout(()=>{location.href=previewLink.href;},420);};
  introPanel?.addEventListener('click',followCategoryIntro);
  introPanel?.addEventListener('keydown',(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();followCategoryIntro();}});
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches&&introPanel){
    const keepNomadicSubmenuOpen=()=>{clearTimeout(nomadicHoverCloseTimer);};
    const scheduleNomadicSubmenuClose=()=>{clearTimeout(nomadicHoverCloseTimer);nomadicHoverCloseTimer=setTimeout(()=>{setHomeNomadicOpen(false);introPanel.classList.remove('is-activating');},160);};
    introPanel.addEventListener('mouseenter',()=>{if(!previewLink)return;keepNomadicSubmenuOpen();introPanel.classList.add('is-activating');if(previewLink===homeNomadicTrigger)setHomeNomadicOpen(true);});
    introPanel.addEventListener('mouseleave',scheduleNomadicSubmenuClose);
    homeNomadicSubmenu.addEventListener('mouseenter',keepNomadicSubmenuOpen);
    homeNomadicSubmenu.addEventListener('mouseleave',scheduleNomadicSubmenuClose);
  }
  childLinks.forEach((link)=>link.addEventListener('click',(event)=>{event.preventDefault();activateThenNavigate(link,childLinks);}));
  document.addEventListener('ntx:articles-updated',()=>window.syncHomeArticle());
  if(aboutImageHost){const openActiveHomeArticle=()=>{if(!document.body.classList.contains('editing-active'))location.href='article-detail.html?article='+encodeURIComponent(activeHomeArticle);};aboutImageHost.setAttribute('tabindex','0');aboutImageHost.setAttribute('role','link');aboutImageHost.setAttribute('aria-label','阅读当前哲学文章');aboutImageHost.addEventListener('click',(event)=>{if(event.target.closest('.carousel-dots'))return;openActiveHomeArticle();});aboutImageHost.addEventListener('keydown',(event)=>{if(event.key==='Enter'){event.preventDefault();openActiveHomeArticle();}});}
  const initialHomeLink=motherLinks.find((link)=>link.classList.contains('is-active'));activeHomeCategory=new URL(initialHomeLink?.href||location.href).searchParams.get('category')||'nitunxiang';renderHomeArticle(articleForCategory(activeHomeCategory,initialHomeLink?.dataset.homeArticle));
  window.NTX_ARTICLES?.ready?.then(()=>{const currentLink=motherLinks.find((link)=>link.classList.contains('is-active'))||initialHomeLink;activeHomeCategory=new URL(currentLink?.href||location.href).searchParams.get('category')||'nomadic';motherLinks.forEach((link)=>link.classList.toggle('is-active',link===currentLink));renderHomeArticle(articleForCategory(activeHomeCategory,currentLink?.dataset.homeArticle));});
}
const hoverPairFor = (node) => hoverPairs.find((pair) => pair.node === node);
function translationHtml(value){return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}
const isPhilosophyPair = (pair) => !!pair?.node.matches('.about-copy h2,.about-copy>p:not(.eyebrow)');
const bilingualStyleProperties = ['fontWeight','fontStyle','fontSize','lineHeight','textAlign','color','letterSpacing'];
const readBilingualStyle = (node) => Object.fromEntries(bilingualStyleProperties.map((property)=>[property,node.style[property]||'']));
function applyBilingualStyle(pair,language){
  if(!isPhilosophyPair(pair))return;
  const style=pair.languageStyles?.[language]||{};
  bilingualStyleProperties.forEach((property)=>{pair.node.style[property]=style[property]||'';});
}
function rememberBilingualStyle(property,value){
  const pair=hoverPairFor(selectedText);
  if(!isPhilosophyPair(pair))return;
  const language=pair.isChinese?'zh':'en';
  pair.languageStyles[language]??=readBilingualStyle(pair.node);
  pair.languageStyles[language][property]=value;
}
function syncHoverTranslationEditor(node) {
  const pair = hoverPairFor(node);
  const supportsEnglishCase = !!node?.matches('.hero-kicker,.hero-index,.hero-copy>p,.scroll-cue,.about-copy h2,.about-copy>p:not(.eyebrow)');
  hoverTranslationInput.disabled = !pair;
  hoverTranslationInput.value = pair?.translation || '';
  initialLanguageSelect.disabled = !pair;
  initialLanguageSelect.value = pair?.initialLanguage || 'en';
  englishFontSelect.value = pair?.englishFont || 'bigcaslon';
  chineseFontSelect.value = pair?.chineseFont || 'sourcehan';
  englishCaseWrap.hidden = !supportsEnglishCase;
  englishCaseSelect.disabled = !pair || !supportsEnglishCase;
  englishCaseSelect.value = pair?.englishCase || 'preserve';
  hoverTranslationHint.textContent = pair ? '英文直接在页面上修改；这里填写点击后显示的中文。' : '请选中带有中英文点击切换功能的文字。';
}
function setPairLanguage(pair, language) {
  if (language === 'zh' && !pair.isChinese) {
    pair.englishHtml = pair.node.innerHTML;
    pair.node.innerHTML = translationHtml(pair.translation);
    pair.isChinese = true;
  } else if (language === 'en' && pair.isChinese) {
    pair.node.innerHTML = pair.englishHtml;
    pair.isChinese = false;
  }
  const languageFont = language === 'zh' ? pair.chineseFont : pair.englishFont;
  if (languageFont) pair.node.style.fontFamily = fontFamily(languageFont);
  applyBilingualStyle(pair,language);
  if (pair.node.matches('.hero-kicker,.hero-index,.hero-copy>p,.scroll-cue,.about-copy h2,.about-copy>p:not(.eyebrow)')) {
    pair.node.style.textTransform = language === 'en' ? (pair.englishCase === 'upper' ? 'uppercase' : pair.englishCase === 'title' ? 'capitalize' : 'none') : 'none';
  }
  pair.node.dataset.language = language;
}
hoverPairs.forEach((pair) => {
  const { node } = pair;
  node.classList.add('hover-bilingual');
  pair.isChinese = false;
  pair.englishHtml = '';
  pair.initialLanguage = pair.defaultInitial || 'en';
  pair.englishFont = 'bigcaslon';
  pair.chineseFont = 'sourcehan';
  pair.englishCase = 'preserve';
  pair.languageStyles = {en:{},zh:{}};
  node.addEventListener('click', (event) => {
    if (editMode?.checked) return;
    const glazeCard=node.closest('.glaze-guide-card');
    if(glazeCard){
      if(glazeCard.dataset.clickStage==='text'){glazeCard.dataset.clickStage='';return;}
      event.preventDefault();
      event.stopPropagation();
      document.querySelectorAll('.glaze-guide-card').forEach((card)=>card.dataset.clickStage='');
      glazeCard.dataset.clickStage='text';
      setPairLanguage(pair,pair.isChinese?'en':'zh');
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setPairLanguage(pair, pair.isChinese ? 'en' : 'zh');
  });
});
const languageNotice=document.querySelector('[data-language-notice]');
document.querySelector('[data-language-switch]')?.addEventListener('click',()=>{
  if(editMode?.checked)return;
  const targetLanguage=hoverPairs.some((pair)=>!pair.isChinese)?'zh':'en';
  hoverPairs.forEach((pair)=>setPairLanguage(pair,targetLanguage));
  document.querySelectorAll('[data-footer-bi]').forEach((node)=>{node.textContent=node.dataset[targetLanguage==='zh'?'biZh':'biEn'];node.dataset.biLanguage=targetLanguage;node.lang=targetLanguage==='zh'?'zh-CN':'en';node.style.fontFamily=targetLanguage==='zh'?fontFamily('sourcehan'):fontFamily('bigcaslon')});
  document.querySelectorAll('[data-nav-bi]').forEach((node)=>{node.textContent=node.dataset[targetLanguage==='zh'?'biZh':'biEn'];node.lang=targetLanguage==='zh'?'zh-CN':'en'});
  if(nav){nav.dataset.language=targetLanguage;requestAnimationFrame(updateDesktopNavOverflow)}
});
document.querySelector('[data-language-notice-close]')?.addEventListener('click',()=>{
  languageNotice?.classList.add('is-closed');
  document.body.classList.add('language-notice-closed');
  window.setTimeout(()=>languageNotice?.setAttribute('hidden',''),300);
});
hoverTranslationInput?.addEventListener('input', () => {
  const pair = hoverPairFor(selectedText);
  if (!pair) return;
  pair.translation = hoverTranslationInput.value;
  if (pair.isChinese) pair.node.innerHTML = translationHtml(pair.translation);
  editorStatus.textContent = '点击切换中文已更新，请点击保存修改';
});
initialLanguageSelect?.addEventListener('change', () => {
  const pair = hoverPairFor(selectedText);
  if (!pair) return;
  pair.initialLanguage = initialLanguageSelect.value;
  setPairLanguage(pair, pair.initialLanguage);
  editorStatus.textContent = `该文字首次显示已设为${pair.initialLanguage === 'zh' ? '中文' : '英文'}，请点击保存修改`;
});
englishCaseSelect?.addEventListener('change', () => {
  const pair = hoverPairFor(selectedText);
  if (!pair || !selectedText?.matches('.hero-kicker,.hero-index,.hero-copy>p,.scroll-cue,.about-copy h2,.about-copy>p:not(.eyebrow)')) return;
  pair.englishCase = englishCaseSelect.value;
  setPairLanguage(pair, pair.isChinese ? 'zh' : 'en');
  editorStatus.textContent = '当前英文大小写已更新，请点击保存修改';
});
const editableSelector = 'h1,h2,h3,p:not(.editor-tip):not(.editor-status):not(.editor-selection):not(.sculpture-hint),.brand,.main-nav a,.text-link,.collection-link,.journal-item span,.footer-grid a';
document.querySelectorAll(editableSelector).forEach((node, index) => { if (!node.closest('.editor-panel') && !node.closest('.glaze-guide') && !node.closest('.gene') && !node.closest('.site-footer') && !node.matches('.main-nav a:last-child')) node.dataset.editable = String(index); });
document.querySelectorAll('.glaze-guide h2,.glaze-guide-head p,.glaze-guide-card b,.glaze-guide-card i').forEach((node, index) => { node.dataset.glazeEditable = String(index); });
document.querySelectorAll('.gene-heading .eyebrow,.gene-bar span').forEach((node,index)=>{node.dataset.geneEditable=String(index);});
function openEditor(open) { editor.classList.toggle('is-open', open); editor.setAttribute('aria-hidden', String(!open)); }
document.querySelector('[data-editor-launch]')?.addEventListener('click', () => openEditor(true));
document.querySelector('[data-editor-close]')?.addEventListener('click', () => openEditor(false));
document.querySelectorAll('[data-editable],[data-glaze-editable],[data-gene-editable],[data-notice-editable]').forEach((node) => node.addEventListener('click', (event) => {
  if (!editMode.checked) return; event.preventDefault(); event.stopPropagation(); selectedText?.classList.remove('is-selected-text'); selectedText = node; node.classList.add('is-selected-text'); selectionLabel.textContent = `当前文字：${node.textContent.trim().slice(0, 22) || '空白文字'}`; syncHoverTranslationEditor(node); const computed=getComputedStyle(node); const size=Math.round(parseFloat(computed.fontSize)); const sizeInput=document.querySelector('[data-font-size]'); if(sizeInput)sizeInput.value=Math.min(220,Math.max(8,size)); const sizeValue=document.querySelector('[data-font-size-value]'); if(sizeValue)sizeValue.textContent=`${size} px`; const rawLine=parseFloat(computed.lineHeight); const lineRatio=Number.isFinite(rawLine)&&size?Math.min(3,Math.max(.8,rawLine/size)):1.2; const lineInput=document.querySelector('[data-line-height]'); if(lineInput)lineInput.value=lineRatio.toFixed(2); const lineValue=document.querySelector('[data-line-height-value]'); if(lineValue)lineValue.textContent=`${lineRatio.toFixed(2)} ×`;
}));
document.querySelectorAll('[data-editable],[data-glaze-editable],[data-gene-editable]').forEach((node)=>node.addEventListener('input',()=>{const pair=hoverPairFor(node);if(pair?.isChinese)pair.translation=node.innerText.replace(/\r/g,'');}));
editMode?.addEventListener('change', () => { document.body.classList.toggle('editing-active', editMode.checked); document.querySelectorAll('[data-editable],[data-glaze-editable],[data-gene-editable],[data-notice-editable]').forEach((node) => { node.contentEditable = editMode.checked ? 'true' : 'false'; }); editorStatus.textContent = editMode.checked ? '请点击要修改的文字或图片' : '直接编辑已关闭'; });

const fontFamily = (value) => ({ serif: '"Instrument Serif", Georgia, serif', sourcehan: 'DetailHan, "NTX Source Han", serif', bigcaslon: '"NTX Big Caslon", "Times New Roman", serif', adobecaslon: '"Adobe Caslon Pro Local", "Times New Roman", serif', sans: '"DM Sans", Arial, sans-serif', system: '"PingFang SC", "Microsoft YaHei", sans-serif' }[value]);
document.querySelectorAll('[data-notice-font]').forEach((select)=>select.addEventListener('change',()=>{
  const language=select.dataset.noticeFont,node=document.querySelector(`[data-notice-editable="${language}"]`);
  if(!node)return;
  node.style.fontFamily=fontFamily(select.value);
  editorStatus.textContent=`顶部提示条${language==='zh'?'中文':'英文'}字体已修改，请点击保存`;
}));
function applyLanguageFont(language, value) {
  if (!selectedText || !editMode.checked) { editorStatus.textContent = '请先开启直接编辑，并点击一段文字'; return; }
  const pair = hoverPairFor(selectedText);
  if (pair) {
    if (language === 'zh') pair.chineseFont = value; else pair.englishFont = value;
    if ((language === 'zh') === pair.isChinese) selectedText.style.fontFamily = fontFamily(value);
    editorStatus.textContent = `${language === 'zh' ? '中文' : '英文'}字体已单独设置，请点击保存修改`;
    return;
  }
  selectedText.style.fontFamily = fontFamily(value);
  editorStatus.textContent = '该文字没有中英文切换，字体已直接应用';
}
englishFontSelect?.addEventListener('change', (event) => applyLanguageFont('en', event.target.value));
chineseFontSelect?.addEventListener('change', (event) => applyLanguageFont('zh', event.target.value));
document.querySelector('[data-font-weight]')?.addEventListener('change', (event) => { if (!selectedText) { editorStatus.textContent = '请先开启直接编辑，并点击一段文字'; return; } selectedText.style.fontWeight = event.target.value; rememberBilingualStyle('fontWeight',event.target.value); editorStatus.textContent = `当前文字已设为字重 ${event.target.value}`; });
document.querySelector('[data-font-style]')?.addEventListener('change', (event) => { if (!selectedText) { editorStatus.textContent = '请先开启直接编辑，并点击一段文字'; return; } selectedText.style.fontStyle = event.target.value; rememberBilingualStyle('fontStyle',event.target.value); editorStatus.textContent = `当前文字已切换为${event.target.value === 'italic' ? '斜体' : '正体'}`; });
document.querySelector('[data-font-size]')?.addEventListener('input', (event) => { const value=Number(event.target.value); const sizeValue=document.querySelector('[data-font-size-value]'); if(sizeValue)sizeValue.textContent=`${value} px`; if(!selectedText){editorStatus.textContent='请先开启直接编辑，并点击一段文字';return;} selectedText.style.fontSize=`${value}px`; rememberBilingualStyle('fontSize',`${value}px`); editorStatus.textContent=`当前文字字号：${value} px`; });
document.querySelector('[data-line-height]')?.addEventListener('input', (event) => { const value=Number(event.target.value); const lineValue=document.querySelector('[data-line-height-value]'); if(lineValue)lineValue.textContent=`${value.toFixed(2)} ×`; if(!selectedText){editorStatus.textContent='请先开启直接编辑，并点击一段文字';return;} selectedText.style.lineHeight=String(value); rememberBilingualStyle('lineHeight',String(value)); editorStatus.textContent=`当前文字行间距：${value.toFixed(2)} 倍`; });
document.querySelector('[data-vertical-spacing]')?.addEventListener('input',(event)=>{const value=Number(event.target.value);const output=document.querySelector('[data-vertical-spacing-value]');if(output)output.textContent=`${value} px`;if(!selectedText?.matches('.manifesto>.side-note')){editorStatus.textContent='请先点击页3右下角的竖排小字';return;}const language=selectedText.dataset.language==='zh'?'zh':'en';selectedText.style.setProperty(`--side-note-${language}-letter-spacing`,`${value}px`);editorStatus.textContent=`页3右下角${language==='zh'?'中文':'英文'}竖排字间距：${value} px`;});
document.querySelector('[data-vertical-column-spacing]')?.addEventListener('input',(event)=>{const value=Number(event.target.value);const output=document.querySelector('[data-vertical-column-spacing-value]');if(output)output.textContent=`${value.toFixed(2)} ×`;if(!selectedText?.matches('.manifesto>.side-note')){editorStatus.textContent='请先点击页3右下角的竖排小字';return;}const language=selectedText.dataset.language==='zh'?'zh':'en';selectedText.style.setProperty(`--side-note-${language}-column-spacing`,String(value));editorStatus.textContent=`页3右下角${language==='zh'?'中文':'英文'}竖排列间距：${value.toFixed(2)} 倍`;});
document.querySelectorAll('[data-text-align]').forEach((button) => button.addEventListener('click', () => {
  if (!selectedText) { editorStatus.textContent = '请先开启直接编辑，并点击一段文字'; return; }
  const align = button.dataset.textAlign;
  selectedText.style.textAlign = align;
  rememberBilingualStyle('textAlign',align);
  document.querySelectorAll('[data-text-align]').forEach((item) => item.classList.toggle('is-active', item === button));
  editorStatus.textContent = `当前文字已设为${align === 'left' ? '居左' : align === 'center' ? '居中' : '居右'}`;
}));
document.querySelectorAll('[data-text-color]').forEach((button)=>button.addEventListener('click',()=>{
  if(!selectedText){editorStatus.textContent='请先开启直接编辑，并点击一段文字';return;}
  selectedText.style.color=button.dataset.textColor;
  rememberBilingualStyle('color',button.dataset.textColor);
  document.querySelectorAll('[data-text-color]').forEach((item)=>item.classList.toggle('is-active',item===button));
  editorStatus.textContent=`当前文字颜色已改为${button.textContent.trim()}，请点击保存修改`;
}));
function updateCarouselSelection() {
  if (!carouselSelection || !imageTarget) return;
  const area = imageTarget.host.classList.contains('hero-media') ? '开屏图片栏' : imageTarget.host.matches('[data-manifesto-image]') ? '第三屏背景图片' : imageTarget.host.classList.contains('about-image') ? '品牌简介图片栏' : `作品图片栏 ${carousels.indexOf(imageTarget)}`;
  carouselSelection.textContent = `${area} · 当前第 ${imageTarget.index + 1} / ${imageTarget.slides.length} 张`;
}
function portableAssetValue(value) {
  if (typeof value !== 'string' || !value) return value;
  if (value.startsWith('data:')) return value;
  const cssMatch=value.match(/^url\(["']?(.*?)["']?\)$/i);
  if(cssMatch)return `url("${portableAssetValue(cssMatch[1])}")`;
  const normalized=value.replace(/\\/g,'/');
  const marker='/assets/';
  const markerIndex=normalized.toLowerCase().indexOf(marker);
  return markerIndex>=0?`assets/${normalized.slice(markerIndex+marker.length)}`:normalized;
}
function slideSource(slide) { return portableAssetValue(slide.tagName === 'IMG' ? (slide.getAttribute('src')||slide.src) : slide.style.backgroundImage); }
function setSlideSource(slide, value) { const portable=portableAssetValue(value); if (slide.tagName === 'IMG') slide.src = portable; else slide.style.backgroundImage=/^(url\(|none$|linear-gradient)/i.test(portable)?portable:`url("${portable}")`;if(slide.classList.contains('is-active')&&slide.closest('.about-image'))updateAboutIndexContrast(portable); }
function moveCurrentSlide(offset) {
  if (!imageTarget) { editorStatus.textContent = '请先开启直接编辑并点击一个图片栏'; return; }
  const from = imageTarget.index;
  const to = Math.max(0, Math.min(imageTarget.slides.length - 1, from + offset));
  if (from === to) { editorStatus.textContent = offset < 0 ? '当前图片已经排在最前' : '当前图片已经排在最后'; return; }
  const currentSource = slideSource(imageTarget.slides[from]);
  const targetSource = slideSource(imageTarget.slides[to]);
  setSlideSource(imageTarget.slides[from], targetSource);
  setSlideSource(imageTarget.slides[to], currentSource);
  imageTarget.show(to);
  updateCarouselSelection();
  editorStatus.textContent = `当前图片已移动到第 ${to + 1} 位，请点击保存修改`;
}
document.querySelector('[data-slide-earlier]')?.addEventListener('click', () => moveCurrentSlide(-1));
document.querySelector('[data-slide-later]')?.addEventListener('click', () => moveCurrentSlide(1));
carousels.forEach((item) => item.host.addEventListener('click', (event) => { if (editMode.checked && !event.target.closest('.carousel-dots')) { event.preventDefault(); guideImageTarget = null; if(item===manifestoCarousel){imageTarget=item;manifestoImageTarget=item.slides[item.index];syncManifestoCropControls();updateCarouselSelection();}else{manifestoImageTarget=null;imageTarget=item;updateCarouselSelection();} imagePicker.click(); } }));
const manifestoBackground=document.querySelector('[data-manifesto-image]');
const currentManifestoImage=()=>manifestoCarousel?.slides[manifestoCarousel.index]||null;
function syncManifestoCropControls(){
  const manifestoBackgroundImage=currentManifestoImage();
  if(!manifestoBackgroundImage)return;
  document.querySelector('[data-manifesto-x]').value=parseFloat(manifestoBackgroundImage.style.getPropertyValue('--crop-x'))||50;
  document.querySelector('[data-manifesto-y]').value=parseFloat(manifestoBackgroundImage.style.getPropertyValue('--crop-y'))||50;
  document.querySelector('[data-manifesto-zoom]').value=(parseFloat(manifestoBackgroundImage.style.getPropertyValue('--crop-zoom'))||1)*100;
}
[
  ['[data-manifesto-x]','--crop-x',(value)=>`${value}%`],
  ['[data-manifesto-y]','--crop-y',(value)=>`${value}%`],
  ['[data-manifesto-zoom]','--crop-zoom',(value)=>String(value/100)]
].forEach(([selector,property,format])=>document.querySelector(selector)?.addEventListener('input',(event)=>{
  const manifestoBackgroundImage=currentManifestoImage();
  if(!manifestoBackgroundImage)return;
  manifestoBackgroundImage.style.setProperty(property,format(Number(event.target.value)));
  editorStatus.textContent='第三屏图片裁切已调整，请点击保存修改';
}));
document.querySelectorAll('.glaze-slide').forEach((slide)=>{
  if(!(slide instanceof HTMLImageElement))return;
  slide.loading='eager';
  slide.decoding='sync';
  const preload=new Image();
  preload.src=slide.currentSrc||slide.src;
  preload.decode?.().catch(()=>{});
});
document.querySelectorAll('.glaze-guide-card').forEach((card) => card.addEventListener('click', (event) => {
  if(event.target.closest('[data-glaze-editable]'))return;
  if(editMode.checked){
    event.preventDefault();
    guideImageTarget=card.querySelector('.glaze-slide.is-active')||card.querySelector('img');
    imageTarget=null;
    imagePicker.click();
    return;
  }
  if(card.dataset.clickStage==='image'){card.dataset.clickStage='';return;}
  event.preventDefault();
  event.stopPropagation();
  document.querySelectorAll('.glaze-guide-card').forEach((item)=>item.dataset.clickStage='');
  const slides=[...card.querySelectorAll('.glaze-slide')];
  const active=Math.max(0,slides.findIndex((slide)=>slide.classList.contains('is-active')));
  const next=(active+1)%slides.length;
  if(matchMedia('(max-width:760px)').matches){
    const leaving=slides[active];
    const entering=slides[next];
    leaving.classList.add('is-leaving');
    leaving.classList.remove('is-active');
    entering.classList.add('is-active');
    setTimeout(()=>leaving.classList.remove('is-leaving'),520);
  }else{
    slides.forEach((slide,index)=>slide.classList.toggle('is-active',index===next));
  }
  card.dataset.clickStage='image';
}));
document.querySelectorAll('.gene-grid figure').forEach((figure)=>figure.addEventListener('click',(event)=>{
  if(!editMode.checked){location.href=figure.closest('.gene-group').dataset.geneDestination;return;}
  event.preventDefault();event.stopPropagation();
  geneImageTarget=figure.querySelector('img');imageTarget=null;guideImageTarget=null;manifestoImageTarget=null;
  editorStatus.textContent='已选中品牌基因图片，请选择替换图片';
  imagePicker.click();
}));
function prepareManifestoImage(file){
  return new Promise((resolve,reject)=>{
    const source=URL.createObjectURL(file),image=new Image();
    image.onload=()=>{
      const limit=2400,scale=Math.min(1,limit/Math.max(image.naturalWidth,image.naturalHeight));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
      canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
      URL.revokeObjectURL(source);
      resolve(canvas.toDataURL('image/jpeg',.9));
    };
    image.onerror=()=>{URL.revokeObjectURL(source);reject(new Error('图片读取失败'));};
    image.src=source;
  });
}
imagePicker?.addEventListener('change',async()=>{
  const file=imagePicker.files?.[0];
  if(!file||(!imageTarget&&!guideImageTarget&&!manifestoImageTarget&&!geneImageTarget))return;
  if(geneImageTarget){
    const target=geneImageTarget;geneImageTarget=null;
    editorStatus.textContent='正在优化并载入品牌基因图片…';
    try{target.src=await prepareManifestoImage(file);editorStatus.textContent='品牌基因图片已替换，请点击保存修改';}catch(error){editorStatus.textContent=error.message;}
    imagePicker.value='';return;
  }
  if(manifestoImageTarget){
    const target=manifestoImageTarget;manifestoImageTarget=null;
    editorStatus.textContent='正在优化并载入第三屏图片…';
    try{target.src=await prepareManifestoImage(file);editorStatus.textContent=`第三屏第 ${manifestoCarousel.index+1} 张已替换，请保存修改`;}catch(error){editorStatus.textContent=error.message;}
    imagePicker.value='';return;
  }
  const reader=new FileReader();
  reader.onload=()=>{
    if(guideImageTarget){
      guideImageTarget.src=reader.result;
      const card=guideImageTarget.closest('.glaze-guide-card'),slides=[...card.querySelectorAll('.glaze-slide')],current=slides.indexOf(guideImageTarget),next=slides[(current+1)%slides.length];
      slides.forEach((slide)=>slide.classList.toggle('is-active',slide===next));guideImageTarget=null;
      editorStatus.textContent=`导览图 ${current+1} 已替换；已切到第 ${(current+1)%slides.length+1} 张，可继续替换`;return;
    }
    const slide=imageTarget.slides[imageTarget.index];
    if(slide.tagName==='IMG')slide.src=reader.result;else slide.style.backgroundImage=`url("${reader.result}")`;
    updateCarouselSelection();editorStatus.textContent=`第 ${imageTarget.index+1} 张轮播图已替换`;
  };
  reader.readAsDataURL(file);imagePicker.value='';
});

document.querySelector('[data-paper-color]')?.addEventListener('input', (event) => document.documentElement.style.setProperty('--paper', event.target.value));
document.querySelector('[data-ink-color]')?.addEventListener('input', (event) => document.documentElement.style.setProperty('--ink', event.target.value));
document.querySelector('[data-spacing]')?.addEventListener('input', (event) => document.documentElement.style.setProperty('--pad', `${event.target.value}px`));
document.querySelector('[data-layout]')?.addEventListener('change', (event) => { const works = document.querySelector('.works'); if(!works)return; works.classList.remove('layout-grid', 'layout-large'); if (event.target.value !== 'editorial') works.classList.add(`layout-${event.target.value}`); });
footerXiaohongshuInput?.addEventListener('input',()=>{footerXiaohongshu.href=footerXiaohongshuInput.value.trim()||'#'});
footerWeixinInput?.addEventListener('input',()=>{footerWeixin.href=footerWeixinInput.value.trim()||'#'});
footerEmailInput?.addEventListener('input',()=>{const value=footerEmailInput.value.trim();footerEmail.textContent=value||'EMAIL';footerEmail.href=value?'mailto:'+value:'#'});

function stableEditableHtml(node,html){if(!node.matches('.manifesto>.side-note'))return html;const box=document.createElement('div');box.innerHTML=html;[...box.querySelectorAll('div,p')].reverse().forEach((block)=>{const br=document.createElement('br');block.replaceWith(...block.childNodes,br);});while(box.firstChild?.nodeName==='BR')box.firstChild.remove();while(box.lastChild?.nodeName==='BR')box.lastChild.remove();return box.innerHTML;}
function collectState() { return { text: [...document.querySelectorAll('[data-editable]')].map((node) => { const pair = hoverPairFor(node); const html=pair?.isChinese ? pair.englishHtml : node.innerHTML; return { html:stableEditableHtml(node,html), style: node.getAttribute('style') || '' }; }), glazeText: [...document.querySelectorAll('[data-glaze-editable]')].map((node) => { const pair = hoverPairFor(node); return { html: pair?.isChinese ? pair.englishHtml : node.innerHTML, style: node.getAttribute('style') || '' }; }), glazeTextByKey:Object.fromEntries(hoverPairs.filter((pair)=>pair.node.matches('[data-glaze-editable]')).map((pair)=>[pair.key,{html:pair.isChinese?pair.englishHtml:pair.node.innerHTML,style:pair.node.getAttribute('style')||''}])), glazeImages: [...document.querySelectorAll('.glaze-guide-card img')].map((image) => portableAssetValue(image.getAttribute('src')||image.src)), hoverTranslations: hoverPairs.map((pair) => pair.translation), initialLanguages: hoverPairs.map((pair) => pair.initialLanguage), bilingualTranslations:Object.fromEntries(hoverPairs.map((pair)=>[pair.key,pair.translation])), bilingualInitialLanguages:Object.fromEntries(hoverPairs.map((pair)=>[pair.key,pair.initialLanguage])), bilingualFonts:Object.fromEntries(hoverPairs.map((pair)=>[pair.key,{en:pair.englishFont,zh:pair.chineseFont}])), bilingualCases:Object.fromEntries(hoverPairs.map((pair)=>[pair.key,pair.englishCase||'preserve'])), bilingualStyles:Object.fromEntries(hoverPairs.filter(isPhilosophyPair).map((pair)=>[pair.key,pair.languageStyles])), slides: carousels.map((item) => item.slides.map(slideSource)), paper: document.querySelector('[data-paper-color]').value, ink: document.querySelector('[data-ink-color]').value, spacing: document.querySelector('[data-spacing]').value, layout: document.querySelector('[data-layout]').value }; }
function collectStateWithManifesto(){const state=collectState();state.manifestoImages=(manifestoCarousel?.slides||[]).map((image)=>({x:parseFloat(image.style.getPropertyValue('--crop-x'))||50,y:parseFloat(image.style.getPropertyValue('--crop-y'))||50,zoom:parseFloat(image.style.getPropertyValue('--crop-zoom'))||1}));state.geneImageGroups=[...document.querySelectorAll('.gene-grid')].map((grid)=>[...grid.querySelectorAll('img')].map((image)=>portableAssetValue(image.getAttribute('src')||image.src)));state.geneTextByKey=Object.fromEntries(hoverPairs.filter((pair)=>pair.node.matches('[data-gene-editable]')).map((pair)=>[pair.key,{html:pair.isChinese?pair.englishHtml:pair.node.innerHTML,style:pair.node.getAttribute('style')||''}]));state.noticeText=Object.fromEntries([...document.querySelectorAll('[data-notice-editable]')].map((node)=>[node.dataset.noticeEditable,{html:node.innerHTML,style:node.getAttribute('style')||''}]));state.noticeFonts=Object.fromEntries([...document.querySelectorAll('[data-notice-font]')].map((select)=>[select.dataset.noticeFont,select.value]));state.footerContact={xiaohongshu:footerXiaohongshuInput?.value||'#',weixin:footerWeixinInput?.value||'#',email:(footerEmailInput?.value||'').trim()};return state;}
const apiOrigin = location.protocol === 'file:' ? 'http://127.0.0.1:4173' : new URL('.', location.href).href.replace(/\/$/, '');
async function postState(path,state){const response=await fetch(`${apiOrigin}${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state)});if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);}
async function stateForSave(path){let existing={};try{const response=await fetch(`${apiOrigin}${path}`,{cache:'no-store'});if(response.ok)existing=await response.json();}catch(_){}const state={...existing,...collectStateWithManifesto()};delete state.geneImages;return state;}
async function saveState() { try { editorStatus.textContent='正在保存本机草稿…'; await postState('/api/site-draft',await stateForSave('/api/site-draft')); localStorage.removeItem('nitunxiang-editor-v1');localStorage.removeItem('nitunxiang-editor-v1-previous');editorStatus.textContent = '✓ 已保存到电脑，可使用“退回上一保存版”撤回'; } catch (error) { editorStatus.textContent = `保存失败：${error.message || '无法连接本机预览服务'}`; } }
async function publishState() {
  try {
    editorStatus.textContent = '正在发布，请稍候…';
    const draftState=await stateForSave('/api/site-draft');
    await postState('/api/site-draft',draftState);
    const publishedState=await stateForSave('/api/site-state');
    await postState('/api/site-state',publishedState);
    localStorage.removeItem('nitunxiang-editor-v1');localStorage.removeItem('nitunxiang-editor-v1-previous');
    editorStatus.textContent = '✓ 已发布，手机刷新后即可看到';
  } catch (error) {
    editorStatus.textContent = `发布失败：${error.message || '无法连接同步服务'}`;
  }
}
function applyState(state) {
  if (!state) return; document.querySelectorAll('[data-editable]').forEach((node, i) => { if (state.text?.[i]) { if(node.closest('.main-nav'))return;const pair=hoverPairFor(node);if(node.matches('[data-page3-bilingual]')&&!state.bilingualTranslations?.[pair?.key])return;node.innerHTML = state.text[i].html; node.setAttribute('style', state.text[i].style); } });
  document.querySelectorAll('[data-notice-editable]').forEach((node)=>{const saved=state.noticeText?.[node.dataset.noticeEditable];if(saved){node.innerHTML=saved.html;node.setAttribute('style',saved.style);}});
  document.querySelectorAll('[data-notice-font]').forEach((select)=>{const saved=state.noticeFonts?.[select.dataset.noticeFont];if(saved)select.value=saved;});
  const glazeNodes=[...document.querySelectorAll('[data-glaze-editable]')]; glazeNodes.forEach((node, i) => { const pair=hoverPairFor(node); const saved=pair&&state.glazeTextByKey?.[pair.key]||((state.glazeText?.length===glazeNodes.length)?state.glazeText[i]:null); if(saved){node.innerHTML=saved.html;node.setAttribute('style',saved.style);} });
  document.querySelectorAll('[data-gene-editable]').forEach((node)=>{const pair=hoverPairFor(node),saved=pair&&state.geneTextByKey?.[pair.key];if(saved){node.innerHTML=saved.html;node.setAttribute('style',saved.style);}});
  const glazeCards=[...document.querySelectorAll('.glaze-guide-card')],glazeImages=[...document.querySelectorAll('.glaze-guide-card img')]; if(state.glazeImages?.length===glazeCards.length)glazeCards.forEach((card,i)=>{if(state.glazeImages[i])card.querySelector('img').src=portableAssetValue(state.glazeImages[i]);});else glazeImages.forEach((image,i)=>{if(state.glazeImages?.[i])image.src=portableAssetValue(state.glazeImages[i]);});
  if(manifestoCarousel){const savedImages=state.manifestoImages?.length?state.manifestoImages:(state.manifestoImage?[state.manifestoImage]:[]);manifestoCarousel.slides.forEach((image,index)=>{const saved=savedImages[index];if(!saved)return;if(saved.src)image.src=portableAssetValue(saved.src);image.style.setProperty('--crop-x',`${saved.x??50}%`);image.style.setProperty('--crop-y',`${saved.y??50}%`);image.style.setProperty('--crop-zoom',String(saved.zoom??1));});syncManifestoCropControls();}
  const geneGrids=[...document.querySelectorAll('.gene-grid')];if(state.geneImageGroups?.length){geneGrids.forEach((grid,groupIndex)=>grid.querySelectorAll('img').forEach((image,index)=>{const value=state.geneImageGroups?.[groupIndex]?.[index];if(value)image.src=portableAssetValue(value);}));}else if(state.geneImages?.length===12&&geneGrids.length===2){geneGrids.forEach((grid,groupIndex)=>[...grid.querySelectorAll('img')].slice(0,6).forEach((image,index)=>{const value=state.geneImages[groupIndex*6+index];if(value)image.src=portableAssetValue(value);}));}else{document.querySelectorAll('.gene-grid img').forEach((image,index)=>{if(state.geneImages?.[index])image.src=portableAssetValue(state.geneImages[index]);});}
  hoverPairs.forEach((pair, index) => { const mapped=state.bilingualTranslations?.[pair.key]; if(typeof mapped==='string')pair.translation=mapped;else if(index<4&&typeof state.hoverTranslations?.[index]==='string')pair.translation=state.hoverTranslations[index]; });
  const aboutIndexPair=hoverPairs.find((pair)=>pair.key==='about-index');if(aboutIndexPair)aboutIndexPair.translation='03 / 品牌哲学';
  hoverPairs.forEach((pair) => { const fonts=state.bilingualFonts?.[pair.key]; pair.englishFont=fonts?.en||'bigcaslon'; pair.chineseFont=fonts?.zh||'sourcehan'; });
  hoverPairs.forEach((pair) => { pair.englishCase=state.bilingualCases?.[pair.key]||'preserve'; });
  hoverPairs.filter(isPhilosophyPair).forEach((pair)=>{const seed=readBilingualStyle(pair.node),saved=state.bilingualStyles?.[pair.key];pair.languageStyles={en:{...seed,...saved?.en},zh:{...seed,...saved?.zh}};});
  hoverPairs.forEach((pair, index) => { const mapped=state.bilingualInitialLanguages?.[pair.key]; pair.initialLanguage=mapped==='zh'||(mapped==null&&(pair.defaultInitial==='zh'||(index<4&&state.initialLanguages?.[index]==='zh')))?'zh':'en';setPairLanguage(pair,pair.initialLanguage); });
  carousels.forEach((item, c) => item.slides.forEach((slide, s) => { const value = state.slides?.[c]?.[s]; if (!value) return; setSlideSource(slide,value); }));
  const set = (selector, value, eventName = 'input') => { const el = document.querySelector(selector); if (el && value != null) { el.value = value; el.dispatchEvent(new Event(eventName)); } }; set('[data-paper-color]', state.paper); set('[data-ink-color]', state.ink); set('[data-spacing]', state.spacing); set('[data-layout]', state.layout, 'change');
  const footerContact=state.footerContact||{};if(footerContact.xiaohongshu!=null&&footerXiaohongshu&&footerXiaohongshuInput){footerXiaohongshu.href=footerContact.xiaohongshu||'#';footerXiaohongshuInput.value=footerContact.xiaohongshu||'#'}if(footerContact.weixin!=null&&footerWeixin&&footerWeixinInput){footerWeixin.href=footerContact.weixin||'#';footerWeixinInput.value=footerContact.weixin||'#'}if(footerContact.email!=null&&footerEmail&&footerEmailInput){footerEmail.textContent=footerContact.email;footerEmail.href='mailto:'+footerContact.email;footerEmailInput.value=footerContact.email}
}
document.querySelector('[data-save]')?.addEventListener('click', saveState);
document.querySelector('[data-publish]')?.addEventListener('click', publishState);
document.querySelector('[data-undo-save]')?.addEventListener('click', async () => {
  let previous=null;
  try { const response=await fetch(`${apiOrigin}/api/site-draft/previous`,{cache:'no-store'}); if(response.ok)previous=await response.json(); } catch (_) {}
  if(!previous){ try { previous=JSON.parse(localStorage.getItem('nitunxiang-editor-v1-previous')); } catch (_) {} }
  if(!previous){editorStatus.textContent='暂时没有可退回的上一保存版';return;}
  applyState(previous); try{await postState('/api/site-draft',previous);localStorage.removeItem('nitunxiang-editor-v1');localStorage.removeItem('nitunxiang-editor-v1-previous');}catch(_){}
  editorStatus.textContent='✓ 已退回上一保存版；如需同步手机，请再次点击发布';
});
document.querySelector('[data-reset]')?.addEventListener('click', async () => { if (confirm('确定恢复到最初版本吗？当前保存的修改会被清除。')) { try{await fetch(`${apiOrigin}/api/site-draft`,{method:'DELETE'});}catch(_){} localStorage.removeItem('nitunxiang-editor-v1'); localStorage.removeItem('nitunxiang-editor-v1-previous'); localStorage.removeItem('noir07-editor'); localStorage.removeItem('noir07-editor-v2'); location.reload(); } });
async function loadInitialState() {
  try {
    const local = JSON.parse(localStorage.getItem('nitunxiang-editor-v1'));
    if (local) { applyState(local); return; }
  } catch (_) {}
  try {
    const embedded=document.querySelector('#ntx-initial-state');
    if(embedded){applyState(JSON.parse(embedded.textContent));return;}
  } catch (_) {}
  try {
    const isComputerPreview=location.protocol==='file:'||location.hostname==='127.0.0.1'||location.hostname==='localhost';
    const endpoint = `${apiOrigin}${isComputerPreview?'/api/site-draft':'/api/site-state'}`;
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (response.ok) applyState(await response.json()); else if(isComputerPreview){const published=await fetch(`${apiOrigin}/api/site-state`,{cache:'no-store'});if(published.ok)applyState(await published.json());}
  } catch (_) {}
}
function syncManifestoEyebrowTop(){
  const section=document.querySelector('.manifesto'),copy=section?.querySelector('.manifesto-copy');
  if(!section||!copy)return;
  section.style.setProperty('--manifesto-copy-top',`${copy.offsetTop}px`);
}
const manifestoCopyForAlignment=document.querySelector('.manifesto-copy');
if(manifestoCopyForAlignment){
  new ResizeObserver(syncManifestoEyebrowTop).observe(manifestoCopyForAlignment);
  new MutationObserver(syncManifestoEyebrowTop).observe(manifestoCopyForAlignment,{childList:true,subtree:true,characterData:true});
  window.addEventListener('resize',syncManifestoEyebrowTop);
}
const revealHomeWhenReady=()=>new Promise((resolve)=>{const active=heroCarouselHost?.querySelector('.carousel-slide.is-active'),source=active?.style.backgroundImage.match(/^url\(["']?(.*?)["']?\)$/i)?.[1],finish=()=>{heroCarouselHost?.classList.add('is-ready');resolve()};if(!source){finish();return}const image=new Image();image.onload=finish;image.onerror=finish;image.src=source;if(image.complete&&image.naturalWidth)finish();setTimeout(finish,4000)});
loadInitialState().finally(() => {
  window.syncHomeArticle?.();
  syncManifestoEyebrowTop();
  document.querySelectorAll('.hero .reveal').forEach((node)=>node.classList.add('is-visible'));
  document.documentElement.scrollTop=0;
  document.body.scrollTop=0;
  scrollTo(0,0);
  document.documentElement.classList.remove('state-loading');
  revealHomeWhenReady();
  requestAnimationFrame(()=>{scrollTo(0,0);requestAnimationFrame(()=>scrollTo(0,0))});
  setTimeout(()=>scrollTo(0,0),120);
});

document.querySelector('form')?.addEventListener('submit', (event) => { event.preventDefault(); const input = event.currentTarget.querySelector('input'); if (input?.value) { input.value = ''; input.placeholder = 'THANK YOU — SUBSCRIBED'; } });
if(!document.querySelector('script[data-shared-language-notice]')){const sharedNoticeScript=document.createElement('script');sharedNoticeScript.src='language-notice.js?v=1';sharedNoticeScript.dataset.sharedLanguageNotice='';document.head.append(sharedNoticeScript);}
