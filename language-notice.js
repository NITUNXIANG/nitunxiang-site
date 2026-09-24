(() => {
  if (window.__ntxLanguageNoticeLoaded) return;
  window.__ntxLanguageNoticeLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    @font-face{font-family:"NTX Source Han";src:local("Source Han Serif SC"),local("Noto Serif CJK SC"),local("Songti SC"),local("SimSun");font-weight:200 900;font-display:swap}@font-face{font-family:"NTX Big Caslon";src:url("assets/fonts/Big-Caslon-Medium.ttf") format("truetype");font-weight:400 500;font-display:swap}
    .language-notice{position:fixed;z-index:19;top:76px;left:0;width:100%;height:25px;display:flex;align-items:center;justify-content:center;background:#090909;color:#fff;border-top:1px solid #222;transition:transform .28s ease,opacity .22s ease}
    .language-notice-message{position:absolute;left:50%;height:100%;display:flex;align-items:center;justify-content:center;gap:.65em;padding:0;border:0;background:none;color:inherit;font:500 8px/1 "DM Sans","NTX Source Han",sans-serif;letter-spacing:.08em;white-space:nowrap;transform:translateX(-50%);cursor:pointer;transition:color .2s}.language-notice-message i{font-style:normal}.language-notice-message:hover{color:#c97f12}
    .language-notice-close{position:absolute;right:clamp(20px,3vw,52px);top:50%;width:15px;height:15px;display:grid;place-items:center;padding:0;border:1px solid currentColor;border-radius:50%;background:none;color:#fff;font-size:0;line-height:0;transform:translateY(-50%);cursor:pointer;transition:color .2s}.language-notice-close:before{content:"×";display:block;font:400 12px/1 Arial,sans-serif;transform:translateY(-.5px)}.language-notice-close:hover{color:#c97f12}
    .language-notice.is-closed{opacity:0;transform:translateY(-105%);pointer-events:none}
    .language-notice-message .language-notice-zh{font-family:"NTX Source Han","Source Han Serif SC","Songti SC",serif!important}.language-notice-message .language-notice-en{font-family:"NTX Big Caslon","Big Caslon","Times New Roman",serif!important}
    @media(max-width:760px){.language-notice{top:64px;height:24px}.language-notice-message{padding:0;font-size:7px;letter-spacing:.035em}.language-notice-close{right:23px}.language-notice-close:before,.language-notice-close:after{content:"";position:absolute;left:50%;top:50%;width:7px;height:1px;background:currentColor;transform-origin:center}.language-notice-close:before{transform:translate(-50%,-50%) rotate(45deg)}.language-notice-close:after{transform:translate(-50%,-50%) rotate(-45deg)}}
  `;
  document.head.append(style);

  let notice = document.querySelector('[data-language-notice]');
  if (!notice) {
    notice = document.createElement('div');
    notice.className = 'language-notice';
    notice.dataset.languageNotice = '';
    notice.innerHTML = '<button class="language-notice-message" type="button" data-language-switch><span>点击可中英文转换</span><i>·</i><span>CLICK TO SWITCH LANGUAGE</span></button><button class="language-notice-close" type="button" data-language-notice-close aria-label="关闭语言提示"></button>';
    document.body.append(notice);
  }
  const noticeSpans=notice.querySelectorAll('.language-notice-message span');
  const chineseNotice=notice.querySelector('[data-notice-editable="zh"]')||noticeSpans[0];
  const englishNotice=notice.querySelector('[data-notice-editable="en"]')||noticeSpans[noticeSpans.length-1];
  chineseNotice?.classList.add('language-notice-zh');
  englishNotice?.classList.add('language-notice-en');
  notice.hidden = false;
  notice.classList.remove('is-closed');
  document.body.classList.remove('language-notice-closed');

  const close = notice.querySelector('[data-language-notice-close]');
  if (!close.dataset.sharedBound) {
    close.dataset.sharedBound = 'true';
    close.addEventListener('click', () => {
      notice.classList.add('is-closed');
      document.body.classList.add('language-notice-closed');
      setTimeout(() => { notice.hidden = true; }, 300);
    });
  }

  const switcher = notice.querySelector('[data-language-switch]');
  if (!switcher.dataset.sharedBound) {
    switcher.dataset.sharedBound = 'true';
    switcher.addEventListener('click', () => {
      if (document.body.classList.contains('home-page')) return;
      const galleryTitle = document.querySelector('[data-gallery-title]');
      if (galleryTitle) {
        const target = galleryTitle.dataset.language === 'en' ? 'zh' : 'en';
        galleryTitle.click();
        document.querySelectorAll('[data-meta-en][data-meta-zh]').forEach((node) => {
          if (node.dataset.language !== target) node.click();
        });
        return;
      }
      const nodes = [...document.querySelectorAll('[data-bi-en][data-bi-zh]')];
      const target = nodes.some((node) => node.dataset.biLanguage !== 'zh') ? 'zh' : 'en';
      nodes.forEach((node) => {
        if (node.dataset.biLanguage === target) return;
        node.textContent = node.dataset[target === 'zh' ? 'biZh' : 'biEn'];
        node.dataset.biLanguage = target;
        node.lang = target === 'zh' ? 'zh-CN' : 'en';
      });
    });
  }
})();

