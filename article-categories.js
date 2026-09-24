(() => {
  const tabs=[...document.querySelectorAll('[data-category-filter]')];
  const articles=[...document.querySelectorAll('[data-article-category]')];
  const results=document.querySelector('.category-results');
  const subcategories=document.querySelector('.nomadic-subcategories');
  const subcategoryTabs=[...document.querySelectorAll('[data-subcategory]')];
  if(!tabs.length||!articles.length)return;
  const requestedCategory=new URLSearchParams(location.search).get('category');
  const requestedSubcategory=new URLSearchParams(location.search).get('subcategory');
  let activeSubcategory=subcategoryTabs.some((tab)=>tab.dataset.subcategory===requestedSubcategory)?requestedSubcategory:'spiritual';
  let activeCategory=tabs.some((tab)=>tab.dataset.categoryFilter===requestedCategory)?requestedCategory:(tabs.find((tab)=>tab.classList.contains('is-active'))?.dataset.categoryFilter||tabs[0].dataset.categoryFilter);
  let switchTimer=0;
  const render=(category)=>{
    tabs.forEach((tab)=>{
      const active=tab.dataset.categoryFilter===category;
      tab.classList.toggle('is-active',active);
      tab.setAttribute('aria-pressed',String(active));
    });
    articles.forEach((article)=>{article.hidden=article.dataset.articleCategory!==category;});
    if(subcategories)subcategories.hidden=category!=='nomadic';
    subcategoryTabs.forEach((tab)=>tab.classList.toggle('is-active',tab.dataset.subcategory===activeSubcategory));
  };
  const select=(category)=>{
    if(category===activeCategory)return;
    activeCategory=category;
    if(subcategories)subcategories.hidden=category!=='nomadic';
    tabs.forEach((tab)=>{const active=tab.dataset.categoryFilter===category;tab.classList.toggle('is-active',active);tab.setAttribute('aria-pressed',String(active));});
    if(matchMedia('(max-width:760px)').matches){
      clearTimeout(switchTimer);
      results?.classList.remove('is-switching');
      articles.forEach((article)=>{article.hidden=article.dataset.articleCategory!==category;});
      return;
    }
    results?.classList.add('is-switching');
    clearTimeout(switchTimer);
    switchTimer=setTimeout(()=>{
      articles.forEach((article)=>{article.hidden=article.dataset.articleCategory!==category;});
      requestAnimationFrame(()=>requestAnimationFrame(()=>results?.classList.remove('is-switching')));
    },140);
  };
  tabs.forEach((tab)=>tab.addEventListener('click',()=>select(tab.dataset.categoryFilter)));
  subcategoryTabs.forEach((tab)=>tab.addEventListener('click',()=>{activeSubcategory=tab.dataset.subcategory;subcategoryTabs.forEach((item)=>item.classList.toggle('is-active',item===tab));const url=new URL(location.href);url.searchParams.set('category','nomadic');url.searchParams.set('subcategory',activeSubcategory);history.replaceState(null,'',url);}));
  document.addEventListener('ntx:articles-updated',()=>render(activeCategory));
  render(activeCategory);
})();
