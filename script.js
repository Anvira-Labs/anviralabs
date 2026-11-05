// ============================================================
// ANVIRA LABS — shared site behaviour
// ============================================================
document.documentElement.classList.add('js');

// Mobile nav toggle
(function () {
    var hamburger = document.querySelector('.hamburger');
    var navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;
    function set(open) {
        navMenu.classList.toggle('active', open);
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    hamburger.addEventListener('click', function () { set(!navMenu.classList.contains('active')); });
    navMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
})();

// Navbar border on scroll
(function () {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    var onScroll = function () { navbar.classList.toggle('scrolled', window.scrollY > 20); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
})();

// Reveal on scroll
(function () {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
            if (!entry.isIntersecting) return;
            setTimeout(function () { entry.target.classList.add('in'); }, (i % 4) * 70);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
})();

// Theme preview switcher: only appears when the URL contains ?themes
(function () {
    var params = new URLSearchParams(window.location.search);
    var keep = params.has('themes') || (function () { try { return sessionStorage.getItem('al-themes') === '1'; } catch (e) { return false; } })();
    if (!keep) return;
    try { sessionStorage.setItem('al-themes', '1'); } catch (e) {}
    var names = { clarity: 'Clarity', midnight: 'Midnight', ember: 'Ember', aurora: 'Aurora' };
    var bar = document.createElement('div');
    bar.className = 'theme-switch';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Preview theme');
    Object.keys(names).forEach(function (key) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = names[key];
        b.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme') === key ? 'true' : 'false');
        b.addEventListener('click', function () {
            document.documentElement.setAttribute('data-theme', key);
            try { sessionStorage.setItem('al-theme', key); } catch (e) {}
            bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        });
        bar.appendChild(b);
    });
    document.body.appendChild(bar);
})();

// Mark the current page in the nav
(function () {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a[href]').forEach(function (a) {
        if (a.getAttribute('href') === page) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
    });
})();

// Contact form, delivered by Web3Forms (same service as vipan.me).
// Without JS it still posts as a normal HTML form. Success is only shown once the
// service confirms delivery; on failure the visitor's text stays in the form.
(function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('button[type="submit"]');
    var topic = form.elements.topic;

    // ?topic=... links (from service pages) arrive with the matching topic chosen.
    var wanted = new URLSearchParams(window.location.search).get('topic');
    if (wanted) {
        Array.prototype.forEach.call(topic.options, function (o) { if (o.value === wanted) topic.value = wanted; });
    }

    function show(text, sent) {
        status.hidden = false;
        status.classList.toggle('is-success', !!sent);
        status.textContent = text;
        status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;
        var label = submit.textContent;
        var company = form.elements.company.value.trim();
        var topicLabel = topic.options[topic.selectedIndex].text;
        form.elements.subject.value = 'Anvira Labs enquiry: ' + topicLabel + (company ? ' (' + company + ')' : '');
        var failed = 'Your message could not be sent. Please email ' + form.getAttribute('data-fallback') + ' instead. Your text is still in the form so you can copy it.';

        submit.disabled = true;
        submit.textContent = 'Sending...';
        status.hidden = true;

        fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
            .then(function (res) {
                return res.json().then(function (data) { return res.ok && data.success === true; });
            })
            .then(function (sent) {
                if (sent) {
                    form.reset();
                    show('Thanks, your message has been sent. We will reply by email within one business day.', true);
                } else {
                    show(failed);
                }
            })
            .catch(function () { show(failed); })
            .then(function () {
                submit.disabled = false;
                submit.textContent = label;
            });
    });
})();
