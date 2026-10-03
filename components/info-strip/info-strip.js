/* Micro — optional numeric-card carousel. Consumer supplies every card and value.
   R8-02: الجذر الذي يطلب variant الـpeek (data-info-peek) يملكه info-strip-peek
   وحده (مالك واحد للحالة والأحداث) — هذا المحرك يتخطاه مهما تقدّم ترتيب
   التحميل، وسلوكه على الجذور غير peek لا يتغيّر. */
(function () {
  'use strict';

  function initStrip(strip) {
    if (strip.hasAttribute('data-info-peek')) return; /* R8-02: تفويض صريح لمالك وحيد */
    if (strip.hasAttribute('data-info-strip-ready')) return;
    var viewport = strip.querySelector('[data-info-strip-viewport]');
    var track = strip.querySelector('[data-info-strip-track]');
    var slides = track ? Array.prototype.slice.call(track.children).filter(function (node) {
      return node.classList.contains('m-info-strip__slide');
    }) : [];
    var controls = strip.querySelector('[data-info-strip-controls]');
    var previous = strip.querySelector('[data-info-strip-prev]');
    var next = strip.querySelector('[data-info-strip-next]');
    var pageList = strip.querySelector('[data-info-strip-pages]');
    var position = strip.querySelector('[data-info-strip-position]');
    var status = strip.querySelector('[data-info-strip-status]');
    var empty = strip.querySelector('[data-info-strip-empty]');
    var index = 0;
    var startX = null;
    var startY = null;
    var moved = false;

    if (!viewport || !track) return;
    strip.setAttribute('data-info-strip-ready', '');
    if (!slides.length) {
      if (controls) controls.hidden = true;
      viewport.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    if (slides.length < 2 && controls) controls.hidden = true;

    if (pageList) {
      pageList.setAttribute('role', 'group');
      if (!pageList.hasAttribute('aria-label')) pageList.setAttribute('aria-label', 'اختيار البطاقة');
    }
    function setIndex(target, focusViewport) {
      var nextIndex = Math.max(0, Math.min(slides.length - 1, target));
      if (nextIndex === index && track.style.getPropertyValue('--m-info-index') !== '') return;

      var activeElement = document.activeElement;
      if (slides[index] && slides[index].contains(activeElement)) {
        viewport.focus({ preventScroll: true });
      }

      index = nextIndex;
      track.style.setProperty('--m-info-index', String(index));
      slides.forEach(function (slide, slideIndex) {
        var active = slideIndex === index;
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        slide.inert = !active;
      });
      if (previous) previous.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
      if (position) position.textContent = (index + 1) + ' / ' + slides.length;
      if (status) status.textContent = 'البطاقة ' + (index + 1) + ' من ' + slides.length;
      if (pageList) {
        Array.prototype.forEach.call(pageList.querySelectorAll('[data-info-strip-page]'), function (button, pageIndex) {
          button.setAttribute('aria-current', pageIndex === index ? 'true' : 'false');
          button.setAttribute('aria-pressed', pageIndex === index ? 'true' : 'false');
        });
      }
      if (focusViewport) viewport.focus({ preventScroll: true });
    }

    if (pageList) {
      pageList.textContent = '';
      slides.forEach(function (_, pageIndex) {
        var page = document.createElement('button');
        page.type = 'button';
        page.className = 'm-info-strip__page';
        page.setAttribute('data-info-strip-page', '');
        page.setAttribute('aria-label', 'عرض البطاقة ' + (pageIndex + 1));
        page.setAttribute('aria-current', pageIndex === 0 ? 'true' : 'false');
        page.setAttribute('aria-pressed', pageIndex === 0 ? 'true' : 'false');
        page.addEventListener('click', function () { setIndex(pageIndex, false); });
        pageList.appendChild(page);
      });
    }

    if (previous) previous.addEventListener('click', function () { setIndex(index - 1, false); });
    if (next) next.addEventListener('click', function () { setIndex(index + 1, false); });

    viewport.addEventListener('keydown', function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setIndex(index + 1, false);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setIndex(index - 1, false);
      } else if (event.key === 'Home') {
        event.preventDefault();
        setIndex(0, false);
      } else if (event.key === 'End') {
        event.preventDefault();
        setIndex(slides.length - 1, false);
      }
    });

    viewport.addEventListener('pointerdown', function (event) {
      if (event.pointerType !== 'touch' || event.isPrimary === false) return;
      startX = event.clientX;
      startY = event.clientY;
      moved = false;
    });
    viewport.addEventListener('pointerup', function (event) {
      if (startX === null || startY === null) return;
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        moved = true;
        setIndex(index + (dx > 0 ? 1 : -1), false);
      }
      startX = null;
      startY = null;
    });
    viewport.addEventListener('pointercancel', function () {
      startX = null;
      startY = null;
    });
    viewport.addEventListener('click', function (event) {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      }
    }, true);

    slides.forEach(function (slide, slideIndex) {
      slide.setAttribute('aria-hidden', slideIndex === 0 ? 'false' : 'true');
      slide.inert = slideIndex !== 0;
    });
    track.style.setProperty('--m-info-index', '0');
    if (previous) previous.disabled = true;
    if (next) next.disabled = slides.length < 2;
    if (position) position.textContent = '1 / ' + slides.length;
    if (status) status.textContent = 'البطاقة 1 من ' + slides.length;
  }

  function init(root) {
    var scope = root || document;
    if (scope.matches && scope.matches('[data-info-strip]')) initStrip(scope);
    scope.querySelectorAll('[data-info-strip]').forEach(initStrip);
  }

  window.MicroInfoStrip = { init: init };
  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();