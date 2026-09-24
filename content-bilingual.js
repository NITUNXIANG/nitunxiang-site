(() => {
  if(!document.querySelector('script[data-shared-language-notice]')){const script=document.createElement('script');script.src='language-notice.js?v=2';script.dataset.sharedLanguageNotice='';document.head.append(script);}
  const exact = new Map([
    ['All media / 08', '全部影像 / 08'], ['Still · Motion', '图片 · 动态影像'],
    ['Portrait format 03 × 04', '竖幅格式 03 × 04'], ['Shanghai · China', '上海 · 中国'],
    ['Product information', '商品信息'], ['Material & care', '材质与养护'],
    ['Packaging & delivery', '包装与配送'], ['You may also like', '你可能也喜欢']
  ]);
  const productEnglish = (value) => {
    const direct = new Map([
      ['游牧之歌', 'NOMADIC POEM'], ['食夜之日', 'THE SUN OF DAYBREAK'], ['渴者之息', 'THE BREATH OF THE THIRSTY'],
      ['壶承／樽 · 载游', 'ZAIYOU VESSEL STAND']
    ]);
    if (direct.has(value.trim())) return direct.get(value.trim());
    if (!/[\u3400-\u9fff]/.test(value)) return value;
    return value.replace(/天地人和套组/g,'HARMONY SET').replace(/全收藏套组/g,'COMPLETE COLLECTION SET').replace(/盖碗套组礼盒/g,'GAIWAN GIFT SET').replace(/盖碗套组/g,'GAIWAN SET').replace(/天款/g,'HEAVEN FORM').replace(/地款/g,'EARTH FORM').replace(/杯器/g,'CUP VESSEL').replace(/加小号/g,'EXTRA SMALL').replace(/小号/g,'SMALL').replace(/中号/g,'MEDIUM').replace(/大号变体/g,'LARGE VARIANT').replace(/大号/g,'LARGE').replace(/口径/g,'DIAMETER').replace(/外口径/g,'OUTER DIAMETER').replace(/内口径/g,'INNER DIAMETER').replace(/高/g,'HEIGHT').replace(/套组/g,'SET').replace(/单体/g,'SINGLE').replace(/一游/g,'YIYOU').replace(/二游/g,'ERYOU');
  };
  const render = (node, language) => {
    const value = node.dataset[language === 'zh' ? 'biZh' : 'biEn'];
    if (value == null) return;
    node.textContent = value;
    node.dataset.biLanguage = language;
    node.lang = language === 'zh' ? 'zh-CN' : 'en';
  };
  const bind = (node) => {
    if (node.dataset.biBound === 'true') return;
    node.dataset.biBound = 'true';
    render(node, 'en');
    node.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      render(node, node.dataset.biLanguage === 'en' ? 'zh' : 'en');
    });
  };
  const scan = (root = document) => {
    root.querySelectorAll?.('[data-bi-en][data-bi-zh]').forEach(bind);
    root.querySelectorAll?.('h1,h2,p,span,summary').forEach((node) => {
      if (node.dataset.biBound === 'true' || node.children.length) return;
      const original = node.textContent.trim();
      const translated = exact.get(original) || ((document.body.classList.contains('catalog-page') || document.querySelector('.product-layout')) ? productEnglish(original) : original);
      if (translated !== original) {
        node.dataset.biEn = translated;
        node.dataset.biZh = original;
        bind(node);
      }
    });
  };
  scan();
  new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
    if (node.nodeType !== 1) return;
    if (node.matches?.('[data-bi-en][data-bi-zh]')) bind(node);
    scan(node);
  }))).observe(document.body, { childList: true, subtree: true });
})();
