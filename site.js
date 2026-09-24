// Small enhancements only. Every page reads fine with this file blocked.
(function () {
  var toastEl = null;
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  // navigator.clipboard needs a secure context, which Pages is; the textarea
  // path covers older Safari and the odd embedded browser.
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      area.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(area);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  function sourceText(button) {
    var target = document.getElementById(button.getAttribute('data-copy'));
    if (!target) return '';
    return ('value' in target && target.value !== undefined ? target.value : target.textContent).trim();
  }

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var text = sourceText(button);
      copyText(text).then(function () {
        button.setAttribute('data-copied', 'true');
        toast(button.getAttribute('data-copy-toast') || 'Copied');
        setTimeout(function () { button.removeAttribute('data-copied'); }, 2000);
      }).catch(function () {
        var input = document.getElementById(button.getAttribute('data-copy'));
        if (input && input.select) input.select();
        toast('Press and hold to copy');
      });
    });
  });

  // Click into the link field and the whole link is selected, ready to copy.
  document.querySelectorAll('.copy-field input').forEach(function (input) {
    input.addEventListener('focus', function () { input.select(); });
  });

  // The share sheet only exists on phones and some desktop browsers.
  document.querySelectorAll('[data-share]').forEach(function (button) {
    if (!navigator.share) { button.hidden = true; return; }
    button.addEventListener('click', function () {
      var message = document.getElementById(button.getAttribute('data-share'));
      var link = document.getElementById('invite-link');
      navigator.share({
        title: 'Liftr',
        text: message ? message.textContent.replace(link ? link.value : '', '').trim() : '',
        url: link ? link.value : location.href,
      }).catch(function () { /* cancelled */ });
    });
  });

  // ── legal pages: table of contents built from the h2s ────────────────
  var prose = document.querySelector('.prose');
  var tocDesktop = document.querySelector('.toc ol');
  var tocMobile = document.querySelector('.toc-mobile ol');
  if (prose && (tocDesktop || tocMobile)) {
    var headings = Array.prototype.slice.call(prose.querySelectorAll('h2[id]'));
    var links = [];

    headings.forEach(function (h) {
      var label = h.getAttribute('data-toc') || h.textContent.replace('#', '').trim();

      var anchor = document.createElement('a');
      anchor.className = 'anchor';
      anchor.href = '#' + h.id;
      anchor.setAttribute('aria-label', 'Link to ' + label);
      anchor.textContent = '#';
      h.insertBefore(anchor, h.firstChild);

      [tocDesktop, tocMobile].forEach(function (list) {
        if (!list) return;
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = label;
        li.appendChild(a);
        list.appendChild(li);
        if (list === tocDesktop) links.push(a);
        if (list === tocMobile) {
          a.addEventListener('click', function () { list.closest('details').open = false; });
        }
      });
    });

    // The section you're reading is the last heading above the top third of
    // the screen. rAF keeps it to one check per frame while scrolling.
    if (links.length) {
      var ticking = false;
      var markActive = function () {
        ticking = false;
        var current = headings[0].id;
        var line = window.innerHeight * 0.33;
        for (var i = 0; i < headings.length; i++) {
          if (headings[i].getBoundingClientRect().top <= line) current = headings[i].id;
        }
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          current = headings[headings.length - 1].id;
        }
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(markActive); }
      }, { passive: true });
      markActive();
    }
  }

  // ── back to top ───────────────────────────────────────────────────────
  var topButton = document.querySelector('.to-top');
  if (topButton) {
    var onScroll = function () { topButton.classList.toggle('show', window.scrollY > 900); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    topButton.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
})();
