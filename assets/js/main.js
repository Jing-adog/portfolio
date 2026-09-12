/* ==========================================================
   杂志风个人作品集 — 唯一脚本 main.js
   IIFE + init 架构；每个 init 先判元素存在性，缺组件自动跳过。
   Step 2：initNav（汉堡菜单 / 全屏菜单 / Esc / 滚动锁 / 滚动阴影）
   Step 3：initReveals（滚动进入视口淡入，--d 级联延迟）
   Step 4：initGallery（关于我照片切换器：箭头循环 / 圆点直达）
   Step 5：initCounters（运营成果 KPI 数字滚动：1.2s 千分位，只滚一次）
   Step 6：initAccordion（运营账号折叠展开：原生 details + toggle 单开模式）
   Step 7：initLightbox（灯箱大图，长图作品纵向滚动浏览）
   ========================================================== */
(function () {
  'use strict';

  /* --- initNav：顶部导航与全屏菜单（所有页面） --- */
  function initNav() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var overlay = document.querySelector('.nav-overlay');
    if (!header || !toggle || !overlay) { return; }

    /* 滚动阴影：离开页面顶部后给导航加一条细影 */
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* 菜单开关（开：锁定页面滚动并聚焦第一个链接；关：焦点还给汉堡按钮） */
    function setOpen(open) {
      document.body.classList.toggle('menu-open', open);
      overlay.classList.toggle('is-open', open);
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var first = overlay.querySelector('a');
        if (first) { first.focus(); }
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!overlay.classList.contains('is-open'));
    });

    /* Esc 关闭 */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) { setOpen(false); }
    });

    /* 点击遮罩空白处关闭（没点中链接时） */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { setOpen(false); }
    });

    /* 点了菜单里的链接就收起，再跳转 */
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
  }

  /* --- initReveals：滚动进入视口淡入（所有页面） --- */
  function initReveals() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) { return; }
    /* 无 IntersectionObserver：直接显示全部内容 */
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    /* 运营成果 / 审美习作页：内容需滚入视口更深处才浮现（首屏只有页首，其余往下滑才出现） */
    var deep = document.body.classList.contains('page-achievements') || document.body.classList.contains('page-works');
    var ioOpts = deep
      ? { threshold: 0, rootMargin: '0px 0px -22% 0px' }
      : { threshold: 0.15 };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, ioOpts);
    items.forEach(function (el) { io.observe(el); });
  }

  /* --- initGallery：关于我页照片切换器（仅含 [data-photo-switch] 的页面生效） --- */
  function initGallery() {
    var switcher = document.querySelector('[data-photo-switch]');
    if (!switcher) { return; }
    var slides = switcher.querySelectorAll('.photo-slide');
    var dots = switcher.querySelectorAll('.photo-dot');
    var prevBtn = switcher.querySelector('.photo-btn--prev');
    var nextBtn = switcher.querySelector('.photo-btn--next');
    var current = 0;
    if (!slides.length) { return; }

    /* 切到第 i 张（循环取模）：按与当前张的相对距离分配堆叠位置，卡片随之洗牌换位 */
    var POS = ['is-front', 'is-back-1', 'is-back-2'];
    function show(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        var rel = (idx - current + slides.length) % slides.length;
        POS.forEach(function (cls) { slide.classList.remove(cls); });
        slide.classList.add(POS[Math.min(rel, POS.length - 1)]);
        slide.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle('is-active', idx === current);
        dot.setAttribute('aria-current', idx === current ? 'true' : 'false');
      });
    }

    if (prevBtn) { prevBtn.addEventListener('click', function () { show(current - 1); }); }
    if (nextBtn) { nextBtn.addEventListener('click', function () { show(current + 1); }); }
    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () { show(idx); });
    });
  }

  /* --- initCounters：KPI 数字滚动（仅 achievements 页） --- */
  function initCounters() {
    var box = document.querySelector('[data-counters]');
    if (!box) { return; }
    var values = box.querySelectorAll('.kpi-value[data-count]');
    if (!values.length) { return; }
    var started = false;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* 千分位格式化：万级以上加逗号，小数字保持原样（如「3000%」「4000+」） */
    function fmt(n) {
      return n >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : String(n);
    }

    function run() {
      if (started) { return; }
      started = true;
      values.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        if (reduced) { el.textContent = fmt(target); return; }
        var duration = 1200; /* 1.2s，与设计规范一致 */
        var start = null;
        function frame(ts) {
          if (start === null) { start = ts; }
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
          el.textContent = fmt(Math.round(target * eased));
          if (p < 1) { requestAnimationFrame(frame); }
        }
        requestAnimationFrame(frame);
      });
    }

    /* 滚动进入视口才开始，且只滚一次；无 IO 时直接滚动 */
    if (!('IntersectionObserver' in window)) { run(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe(box);
  }

  /* --- initAccordion：折叠展开单开模式（仅 accounts 页） --- */
  function initAccordion() {
    var wrap = document.querySelector('[data-accordion]');
    if (!wrap) { return; }
    var items = wrap.querySelectorAll('details');
    if (!items.length) { return; }

    /* 单开模式：监听原生 toggle 事件，展开一个自动收起其他；无 JS 时原生 details 照常可用 */
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) { return; }
        items.forEach(function (other) {
          if (other !== item && other.open) { other.open = false; }
        });
      });
    });
  }

  /* --- initLightbox：灯箱大图（仅 works 页；长图作品 data-long 纵向滚动浏览；无 JS 时灯箱保持 hidden） --- */
  function initLightbox() {
    var box = document.querySelector('.lightbox');
    var works = document.querySelectorAll('.work');
    if (!box || !works.length) { return; }
    var media = box.querySelector('.lightbox-media');
    var title = box.querySelector('.lightbox-title');
    var count = box.querySelector('.lightbox-count');
    var closeBtn = box.querySelector('.lightbox-close');
    var prevBtn = box.querySelector('.lightbox-prev');
    var nextBtn = box.querySelector('.lightbox-next');
    var current = 0;
    var lastFocus = null;

    function render(i) {
      current = ((i % works.length) + works.length) % works.length;
      var fig = works[current];
      var t = fig.querySelector('.work-title');
      var name = t ? t.textContent : '';
      var full = fig.getAttribute('data-full');
      var long = fig.getAttribute('data-long') !== null;
      media.classList.toggle('is-long', long);
      media.innerHTML = '';
      if (full) {
        /* 有真实大图时显示图片（长图经 is-long 容器纵向滚动）；占位阶段显示大占位块 */
        var img = document.createElement('img');
        img.src = full;
        img.alt = name;
        media.appendChild(img);
      } else {
        var ph = document.createElement('div');
        ph.className = long ? 'ph lightbox-ph lightbox-ph--long' : 'ph lightbox-ph';
        ph.textContent = (long ? '长图占位 · ' : '大图占位 · ') + name;
        media.appendChild(ph);
      }
      title.textContent = name;
      count.textContent = (current + 1) + ' / ' + works.length;
      media.scrollTop = 0; /* 换图时回滚到长图顶部 */
    }

    function open(fig) {
      lastFocus = document.activeElement;
      render(Array.prototype.indexOf.call(works, fig));
      box.hidden = false;
      requestAnimationFrame(function () { box.classList.add('is-open'); }); /* 下一帧加 class，淡入生效 */
      document.body.classList.add('lb-open'); /* 锁定页面滚动 */
      closeBtn.focus();
    }

    function close() {
      box.classList.remove('is-open');
      document.body.classList.remove('lb-open');
      setTimeout(function () { box.hidden = true; }, 260); /* 等淡出结束再隐藏 */
      if (lastFocus && lastFocus.focus) { lastFocus.focus(); } /* 焦点还给触发按钮 */
    }

    works.forEach(function (fig) {
      var btn = fig.querySelector('.work-btn');
      if (!btn) { return; }
      btn.addEventListener('click', function () { open(fig); });
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { render(current - 1); });
    nextBtn.addEventListener('click', function () { render(current + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) { close(); } }); /* 点遮罩空白处关闭 */

    /* 键盘：Esc 关、←/→ 切换；Tab 焦点圈在灯箱按钮内 */
    document.addEventListener('keydown', function (e) {
      if (box.hidden || !box.classList.contains('is-open')) { return; }
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowLeft') {
        render(current - 1);
      } else if (e.key === 'ArrowRight') {
        render(current + 1);
      } else if (e.key === 'Tab') {
        var focusables = [closeBtn, prevBtn, nextBtn];
        var idx = focusables.indexOf(document.activeElement);
        if (idx === -1) { idx = 0; }
        e.preventDefault();
        var dir = e.shiftKey ? -1 : 1;
        focusables[(idx + dir + focusables.length) % focusables.length].focus();
      }
    });
  }

  function init() {
    initNav();
    initReveals();
    initGallery();
    initCounters();
    initAccordion();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
