// ============================================================
// ANVIRA LABS — shared site behaviour
// ============================================================

// Mobile nav toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
}

// Reveal-on-scroll animations
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('in'), (i % 4) * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
}

// Animated stat counters
const animateCounter = (el, target, suffix, duration = 1400) => {
    const start = performance.now();
    const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
};

const statEls = document.querySelectorAll('.stat-num[data-count]');
if (statEls.length) {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const target = parseInt(entry.target.dataset.count, 10);
                const suffix = entry.target.dataset.suffix || '';
                animateCounter(entry.target, target, suffix);
            }
        });
    }, { threshold: 0.4 });
    statEls.forEach(el => statObserver.observe(el));
}

// Contact form (static site — no backend; confirms locally)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const success = document.getElementById('formSuccess');
        if (success) success.classList.add('show');
        contactForm.reset();
        if (success) success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Mark active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});
