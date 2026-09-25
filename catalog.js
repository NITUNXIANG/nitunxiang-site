const imageDb=()=>new Promise((resolve,reject)=>{const request=indexedDB.open('nitunxiang-media-v1',1);request.onupgradeneeded=()=>request.result.createObjectStore('images');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
async function putImage(key,value){const db=await imageDb();return new Promise((resolve,reject)=>{const tx=db.transaction('images','readwrite');tx.objectStore('images').put(value,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
async function getImage(key){const db=await imageDb();return new Promise((resolve,reject)=>{const request=db.transaction('images').objectStore('images').get(key);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}

const yiyou = [
  {name:'天款 · 小号',price:980,spec:'S / 口径 7 cm / 高 5.5 cm / 80 ml'},
  {name:'地款 · 小号',price:980,spec:'S / 口径 7.2 cm / 高 5.4 cm / 70 ml'},
  {name:'天款 · 中号',price:1280,spec:'M / 口径 8.7 cm / 高 6.7 cm / 120 ml'},
  {name:'地款 · 中号',price:1280,spec:'M / 口径 9 cm / 高 6.5 cm / 110 ml'},
  {name:'天款 · 大号',price:1580,spec:'L / 口径 10 cm / 高 8 cm / 180 ml'},
  {name:'地款 · 大号',price:1580,spec:'L / 口径 10.5 cm / 高 7.8 cm / 170 ml'},
  {name:'天地人和套组 · 小号',price:1880,spec:'S / 天款 × 1 + 地款 × 1',group:true},
  {name:'天地人和套组 · 中号',price:2380,spec:'M / 天款 × 1 + 地款 × 1',group:true},
  {name:'天地人和套组 · 大号',price:2980,spec:'L / 天款 × 1 + 地款 × 1',group:true},
  {name:'天款 · 大号变体',price:1280,spec:'L Extended / 口径 10 cm / 高 3.5 cm / 120 ml'},
  {name:'地款 · 大号变体',price:880,spec:'L Extended / 口径 5 cm / 高 3.8 cm / 40 ml'},
  {name:'天地人和套组 · 大号变体',price:2080,spec:'L Extended / 天款 × 1 + 地款 × 1',group:true},
  {name:'壶承／樽 · 载游',price:2580,spec:'外口径 17 cm / 高 5.4 cm / 内口径 4.6 cm'},
  {name:'全收藏套组 · 小号',price:5980,spec:'S 天地人和 + L Extended 天地人和 + 载游',group:true},
  {name:'全收藏套组 · 中号',price:6580,spec:'M 天地人和 + L Extended 天地人和 + 载游',group:true},
  {name:'全收藏套组 · 大号',price:6980,spec:'L 天地人和 + L Extended 天地人和 + 载游',group:true}
];
const eryou = [
  {name:'盖碗套组 · 中号',price:1680,spec:'M / 8.8 cm / 100 ml',group:true},
  {name:'盖碗套组 · 大号',price:2280,spec:'L / 10 cm / 160 ml',group:true},
  {name:'杯器 · 加小号',price:1080,spec:'XS / 口径 6.4 cm / 高 4.1 cm / 50 ml'},
  {name:'壶承／樽 · 载游',price:2580,spec:'外口径 17.4 cm / 高 4.2 cm / 内口径 4.4 cm'},
  {name:'盖碗套组礼盒 · 中号',price:3680,spec:'M 盖碗套组 × 1 + XS 杯 × 2',group:true},
  {name:'盖碗套组礼盒 · 大号',price:4280,spec:'L 盖碗套组 × 1 + XS 杯 × 2',group:true},
  {name:'全收藏套组 · 中号',price:6180,spec:'M 盖碗套组 × 1 + XS 杯 × 2 + 载游',group:true},
  {name:'全收藏套组 · 大号',price:6780,spec:'L 盖碗套组 × 1 + XS 杯 × 2 + 载游',group:true}
];

const p = (id) => `assets/catalog/product-${id}.webp`;
const series = [
  {name:'游牧之歌',en:'Nomadic Poem',key:'nomadic',images:[p(20),p(9),p(7),p(16),p(19),p(8),p(24),p(23),p(22),p(18),p(17),p(21),p(70),p(150),p(151),p(151),p(34),p(49),p(44),p(57),'assets/catalog/gift-nomadic-m.webp','assets/catalog/gift-nomadic-l.webp',p(160),p(161)]},
  {name:'食夜之日',en:'The Sun of Daybreak',key:'daybreak',images:[p(13),p(6),p(4),p(11),p(14),p(5),p(27),p(26),p(25),p(12),p(10),p(15),p(64),p(148),p(149),p(149),p(40),p(46),p(45),p(55),'assets/catalog/gift-daybreak-m.webp','assets/catalog/gift-daybreak-l.webp',p(157),p(158)]},
  {name:'渴者之息',en:'The Breath of the Thirsty',key:'thirsty',images:[p(77),p(3),p(2),p(31),p(76),p(1),p(30),p(29),p(28),p(33),p(32),p(78),p(58),p(152),p(153),p(153),p(37),p(52),p(43),p(56),'assets/catalog/gift-thirsty-m.webp','assets/catalog/gift-thirsty-l.webp',p(154),p(155)]}
];

// 以 SKU 为主序，每个款式固定按：游牧之歌（绿）→ 食夜之日（红）→ 渴者之息（黄）排列。
const skuTemplates = [
  ...yiyou.map((sku) => ({...sku,category:'yiyou',subseries:'一游 YIYOU'})),
  ...eryou.map((sku) => ({...sku,category:'eryou',subseries:'二游 ERYOU'}))
];
const products = skuTemplates.flatMap((sku, skuOrder) => series.map((color, seriesOrder) => ({
  ...sku,
  series:color.name,
  seriesEn:color.en,
  seriesKey:color.key,
  image:color.images[skuOrder],
  skuOrder,
  seriesOrder,
  position:skuOrder*3+seriesOrder+1
})));

products.forEach((item) => { item.id = `${item.category}-${item.skuOrder}-${item.seriesOrder}`; });
try {
  const savedV2 = JSON.parse(localStorage.getItem('nitunxiang-catalog-edits-v2'));
  const savedV1 = JSON.parse(localStorage.getItem('nitunxiang-catalog-edits-v1')) || {};
  products.forEach((item) => {
    if (savedV2?.[item.id]) Object.assign(item, savedV2[item.id]);
    else if (savedV1[item.id]) { const {position:_oldPosition,...legacy}=savedV1[item.id]; Object.assign(item,legacy); }
  });
} catch (_) {}

const grid=document.querySelector('[data-product-grid]');let current='all';let sortMode='position';let bag=0;let catalogEditing=false;let selectedProductId=null;
const requestedGlaze=new URLSearchParams(location.search).get('glaze');
const activeGlaze=series.some((item)=>item.key===requestedGlaze)?requestedGlaze:null;
const matchesCategory=(item,key)=>key==='all'||item.category===key||(key==='group'&&item.group)||(key==='single'&&!item.group);
const matches=(item)=>(!activeGlaze||item.seriesKey===activeGlaze)&&matchesCategory(item,current);
const glazeInfo=series.find((item)=>item.key===activeGlaze);
if(glazeInfo){document.querySelector('.catalog-title h1').textContent=glazeInfo.name;document.querySelector('.catalog-title p:first-child').textContent='Glaze Archive / 2026';document.querySelector('.pagination').hidden=true;document.title=`${glazeInfo.name} — 泥吞象 NITUNXIANG`;document.body.classList.add('glaze-catalog');}
document.querySelectorAll('[data-category]').forEach((button)=>{const count=products.filter((item)=>(!activeGlaze||item.seriesKey===activeGlaze)&&matchesCategory(item,button.dataset.category)).length;button.querySelector('sup').textContent=count;});
function render(){const list=products.filter(matches).sort((a,b)=>{if(sortMode==='price-asc')return a.price-b.price||a.position-b.position||a.seriesOrder-b.seriesOrder;if(sortMode==='price-desc')return b.price-a.price||a.position-b.position||a.seriesOrder-b.seriesOrder;return a.position-b.position||a.seriesOrder-b.seriesOrder;});grid.innerHTML=list.map((item,displayIndex)=>`<article class="product-card${item.id===selectedProductId?' sku-selected-card':''}" data-product-id="${item.id}"><p class="product-label">${item.subseries} · ${item.series}</p><button class="product-image" data-index="${products.indexOf(item)}" aria-label="查看 ${item.series} ${item.name}"><img src="${item.image}" alt="${item.series} ${item.name}"><span class="product-number">${String(activeGlaze?displayIndex+1:item.position).padStart(2,'0')}</span></button><div class="product-info"><h2>${item.name}</h2><p>¥ ${item.price.toLocaleString('zh-CN')}</p><p class="product-material">${item.seriesEn} · ${item.spec}</p></div></article>`).join('');document.querySelector('[data-result-count]').textContent=`${String(list.length).padStart(2,'0')} objects`;}
document.querySelectorAll('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelector('[data-category].active').classList.remove('active');btn.classList.add('active');current=btn.dataset.category;render();}));
document.querySelector('[data-sort]').addEventListener('click',e=>{sortMode=sortMode==='position'?'price-asc':sortMode==='price-asc'?'price-desc':'position';e.currentTarget.textContent=sortMode==='position'?'Position ↑':sortMode==='price-asc'?'Price ↑':'Price ↓';render();});
const dialog=document.querySelector('[data-dialog]');grid.addEventListener('click',e=>{const button=e.target.closest('[data-index]');if(!button)return;const item=products[button.dataset.index];if(catalogEditing){selectProduct(item);return;}const snapshot={...item,image:item.image?.startsWith('data:')?'':item.image};try{sessionStorage.setItem('nitunxiang-active-product',JSON.stringify(snapshot));}catch(_){}location.href=`product.html?id=${encodeURIComponent(item.id)}`;});
document.querySelector('[data-dialog-close]').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
document.querySelector('[data-add-bag]').addEventListener('click',()=>{bag+=1;document.querySelector('[data-bag-count]').textContent=bag;dialog.close();});
document.querySelector('[data-menu]').addEventListener('click',()=>document.querySelector('[data-nav]').classList.toggle('open'));

const skuEditor=document.querySelector('[data-sku-editor]');
const skuName=document.querySelector('[data-sku-name]');
const skuPrice=document.querySelector('[data-sku-price]');
const skuSpec=document.querySelector('[data-sku-spec]');
const skuPosition=document.querySelector('[data-sku-position]');
const skuStatus=document.querySelector('[data-sku-status]');
const skuImageInput=document.querySelector('[data-sku-image-input]');
const editableControls=[skuPosition,skuName,skuPrice,skuSpec,document.querySelector('[data-sku-image]'),document.querySelector('[data-sku-apply]')];
function selectedProduct(){return products.find((item)=>item.id===selectedProductId);}
function selectProduct(item){selectedProductId=item.id;document.querySelector('[data-sku-selected]').textContent=`当前商品：${item.series} · ${item.name}`;skuPosition.value=item.position;skuName.value=item.name;skuPrice.value=item.price;skuSpec.value=item.spec;editableControls.forEach((control)=>control.disabled=false);skuStatus.textContent='修改后点击“应用当前修改”';render();}
document.querySelector('[data-sku-editor-launch]').addEventListener('click',()=>{skuEditor.classList.add('open');skuEditor.setAttribute('aria-hidden','false');});
document.querySelector('[data-sku-editor-close]').addEventListener('click',()=>{skuEditor.classList.remove('open');skuEditor.setAttribute('aria-hidden','true');});
document.querySelector('[data-sku-edit-mode]').addEventListener('change',(event)=>{catalogEditing=event.target.checked;document.body.classList.toggle('sku-editing',catalogEditing);skuStatus.textContent=catalogEditing?'现在请点击一个商品':'商品选择已关闭';});
document.querySelector('[data-sku-apply]').addEventListener('click',()=>{const item=selectedProduct();if(!item)return;const oldPosition=item.position;const newPosition=Math.max(1,Math.min(72,Number(skuPosition.value)||oldPosition));if(newPosition!==oldPosition){products.forEach((product)=>{if(product.id===item.id)product.position=newPosition;else if(newPosition<oldPosition&&product.position>=newPosition&&product.position<oldPosition)product.position+=1;else if(newPosition>oldPosition&&product.position<=newPosition&&product.position>oldPosition)product.position-=1;});sortMode='position';document.querySelector('[data-sort]').textContent='Position ↑';}item.name=skuName.value.trim()||item.name;item.price=Math.max(0,Number(skuPrice.value)||0);item.spec=skuSpec.value.trim();skuStatus.textContent='当前商品已修改，请点击“保存全部修改”';render();});
document.querySelector('[data-sku-image]').addEventListener('click',()=>skuImageInput.click());
skuImageInput.addEventListener('change',()=>{const file=skuImageInput.files?.[0],item=selectedProduct();if(!file||!item)return;const reader=new FileReader();reader.onload=()=>{item.image=reader.result;skuStatus.textContent='图片已替换，请保存全部修改';render();};reader.readAsDataURL(file);skuImageInput.value='';});
document.querySelector('[data-sku-save]').addEventListener('click',async()=>{skuStatus.textContent='正在保存图片…';const edits={};const imageJobs=[];products.forEach((item)=>{const custom=item.image?.startsWith('data:');edits[item.id]={name:item.name,price:item.price,spec:item.spec,image:custom?undefined:item.image,position:item.position};if(custom)imageJobs.push(putImage(`catalog:${item.id}`,item.image));});try{await Promise.all(imageJobs);localStorage.setItem('nitunxiang-catalog-edits-v2',JSON.stringify(edits));skuStatus.textContent='✓ 文字、位置和高清图片均已保存';}catch(_){skuStatus.textContent='保存失败，请确认浏览器允许本地数据存储';}});
document.querySelector('[data-sku-reset]').addEventListener('click',()=>{if(confirm('确定恢复价目表中的原始商品内容吗？')){localStorage.removeItem('nitunxiang-catalog-edits-v1');localStorage.removeItem('nitunxiang-catalog-edits-v2');location.reload();}});
render();
Promise.all(products.map(async(item)=>{try{const image=await getImage(`catalog:${item.id}`);if(image)item.image=image;}catch(_){}})).then(render);
