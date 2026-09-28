var _hmt = window._hmt || [];
window._hmt = _hmt;

(function () {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?cc3fabaf242e68f8fe5e02bc827df9cd";
  var firstScript = document.getElementsByTagName("script")[0];
  firstScript.parentNode.insertBefore(hm, firstScript);
})();

(function () {
  var XIAOHONGSHU_URL = "https://xhslink.cn/o/98t8uglJ0eZ";
  var cleanLabel = function (value) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, 80);
  };
  var track = function (category, action, label) {
    window._hmt.push(["_trackEvent", category, action, cleanLabel(label)]);
  };

  var syncXiaohongshu = function () {
    document.querySelectorAll("[data-footer-xiaohongshu], .footer-bar a:first-of-type").forEach(function (link) {
      if (link.href !== XIAOHONGSHU_URL) link.href = XIAOHONGSHU_URL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
    document.querySelectorAll("[data-footer-xiaohongshu-input]").forEach(function (input) {
      if (input.value !== XIAOHONGSHU_URL) input.value = XIAOHONGSHU_URL;
    });
  };

  var recordLandingSource = function () {
    var params = new URLSearchParams(location.search);
    var source = params.get("utm_source");
    var medium = params.get("utm_medium") || "unspecified";
    var campaign = params.get("utm_campaign") || "unspecified";
    if (!source) return;
    var key = [source, medium, campaign].join("|");
    try {
      if (sessionStorage.getItem("ntx-source-event") === key) return;
      sessionStorage.setItem("ntx-source-event", key);
    } catch (_) {}
    track("访问来源", source, medium + " / " + campaign);
  };

  document.addEventListener("DOMContentLoaded", function () {
    syncXiaohongshu();
    recordLandingSource();
    new MutationObserver(syncXiaohongshu).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
  });

  document.addEventListener("click", function (event) {
    var target = event.target.closest("a, button, [data-language-switch]");
    if (!target) return;
    var label = target.getAttribute("aria-label") || target.textContent || "";

    if (target.matches("[data-language-switch]") || target.closest("[data-language-switch]")) {
      track("页面互动", "切换语言", document.documentElement.lang || location.pathname);
      return;
    }

    var link = target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (link.matches("[data-footer-xiaohongshu]") || href.indexOf("xhslink.cn") !== -1) {
      track("联系方式", "点击小红书", location.pathname);
    } else if (link.matches("[data-footer-weixin]")) {
      track("联系方式", "点击微信", location.pathname);
    } else if (href.indexOf("mailto:") === 0) {
      track("联系方式", "点击邮箱", href.slice(7));
    } else if (href.indexOf("article-detail.html") !== -1) {
      track("内容浏览", "打开文章", new URL(link.href, location.href).searchParams.get("article") || label);
    } else if (href.indexOf("product.html") !== -1) {
      track("内容浏览", "打开产品", new URL(link.href, location.href).searchParams.get("id") || label);
    } else if (href.indexOf("catalog.html") !== -1) {
      track("栏目访问", "SHOP", label);
    } else if (href.indexOf("articles.html") !== -1) {
      track("栏目访问", "ARTICLES", label);
    } else if (href.indexOf("gene-") !== -1) {
      track("栏目访问", "GENE", label);
    } else if (href.indexOf("media.html") !== -1) {
      track("栏目访问", "IMAGES_FILM", label);
    }
  }, true);

  if (/article-detail\.html$/i.test(location.pathname)) {
    var articleDepthTracked = false;
    addEventListener("scroll", function () {
      if (articleDepthTracked) return;
      var maxScroll = document.documentElement.scrollHeight - innerHeight;
      if (maxScroll > 0 && scrollY / maxScroll >= 0.75) {
        articleDepthTracked = true;
        track("文章阅读", "阅读75%", new URLSearchParams(location.search).get("article") || document.title);
      }
    }, { passive: true });
  }
})();
