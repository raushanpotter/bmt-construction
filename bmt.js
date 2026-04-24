/* =========================================================
   BMT CONSTRUCTION – JavaScript
   ========================================================= */

'use strict';

/* ── 1. Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveLink();
  toggleBackTop();
}, { passive: true });

/* ── 2. Hamburger menu ── */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const open  = navLinks.classList.contains('open');
  spans[0].style.transform   = open ? 'translateY(7px) rotate(45deg)'  : '';
  spans[2].style.transform   = open ? 'translateY(-7px) rotate(-45deg)' : '';
  spans[1].style.opacity     = open ? '0' : '1';
});

// Close nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── 3. Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ── 4. Animated counter ── */
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(current);
  }, 16);
}

/* ── 5. Intersection Observer – reveal & counters ── */
const revealEls = document.querySelectorAll(
  '.service-card, .gallery-item, .testimonial-card, .about-text, .about-imgs, .contact-info, .contact-form'
);
revealEls.forEach(el => el.classList.add('reveal'));

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-num').forEach(n => counterObserver.observe(n));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── 6. Testimonial carousel (mobile) ── */
let currentTesti = 0;
const testiCards = document.querySelectorAll('.testimonial-card');
const dots       = document.querySelectorAll('.dot');

function showTesti(idx) {
  testiCards.forEach((c, i) => c.classList.toggle('active-testi', i === idx));
  dots.forEach((d, i)       => d.classList.toggle('active', i === idx));
  currentTesti = idx;
}

dots.forEach(dot => {
  dot.addEventListener('click', () => showTesti(+dot.dataset.idx));
});

// Auto-play testimonial on mobile
const mq = window.matchMedia('(max-width:1024px)');
let testiTimer;

function startTestiAuto() {
  if (!mq.matches) return;
  showTesti(0);
  testiTimer = setInterval(() => {
    showTesti((currentTesti + 1) % testiCards.length);
  }, 4000);
}
function stopTestiAuto() { clearInterval(testiTimer); }

mq.addEventListener('change', () => {
  stopTestiAuto();
  if (mq.matches) startTestiAuto();
  else testiCards.forEach(c => { c.classList.remove('active-testi'); });
});
startTestiAuto();

/* ── 7. Contact form ── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

contactForm.addEventListener('submit', e => {
  if (!contactForm.checkValidity()) { contactForm.reportValidity(); e.preventDefault(); return; }
  // Allow real POST to Formsubmit.co — just show sending state
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending… ✉️';
});

/* ── 8. Back to top ── */
const backTop = document.getElementById('backTop');

function toggleBackTop() {
  backTop.classList.toggle('visible', window.scrollY > 400);
}

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
