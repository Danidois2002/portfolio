
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('load', () => {
  setTimeout(() => loadingScreen.classList.add('hidden'), 550);
  requestAnimationFrame(updateOnScroll);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const navToggle = document.getElementById('nav-toggle');
const nav = document.getElementById('site-nav');
navToggle?.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));

const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const nom = encodeURIComponent(data.get('nom'));
  const email = encodeURIComponent(data.get('email'));
  const message = encodeURIComponent(data.get('message'));
  const subject = `Contact portfolio - ${decodeURIComponent(nom)}`;
  const body = `Nom: ${decodeURIComponent(nom)}
Email: ${decodeURIComponent(email)}

Message:
${decodeURIComponent(message)}`;
  window.location.href = `mailto:dbitar77@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.textContent = 'Le formulaire ouvre votre application mail pour envoyer le message.';
});

const parallaxElements = [...document.querySelectorAll('[data-parallax]')];
const heroVisual = document.querySelector('.hero-visual');
let ticking = false;

function updateOnScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;

  // Toutes les lectures d'abord, puis toutes les écritures (évite les reflows forcés)
  const halfViewport = window.innerHeight / 2;
  // Dans un [data-parallax-group], on se base sur la position du groupe : les éléments bougent ensemble et gardent leur espacement
  const tops = parallaxElements.map((el) => (el.closest('[data-parallax-group]') || el).getBoundingClientRect().top);

  if (heroVisual) {
    heroVisual.style.translate = `0 ${(scrollTop * 0.035).toFixed(1)}px`;
  }

  parallaxElements.forEach((el, i) => {
    const speed = Number(el.dataset.parallax || 0.03);
    const translateY = (tops[i] - halfViewport) * speed * -1;
    el.style.setProperty('--parallax-y', `${translateY.toFixed(1)}px`);
  });

  ticking = false;
}

function requestUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
}

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);

const tiltItems = document.querySelectorAll('[data-tilt], .tilt-card');
tiltItems.forEach((item) => {
  item.addEventListener('pointermove', (event) => {
    if (window.innerWidth < 900) return;
    const rect = item.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 10;
    const rotateX = (0.5 - py) * 8;
    item.style.setProperty('--rotate-x', `${rotateX.toFixed(2)}deg`);
    item.style.setProperty('--rotate-y', `${rotateY.toFixed(2)}deg`);
  });
  item.addEventListener('pointerleave', () => {
    item.style.setProperty('--rotate-x', '0deg');
    item.style.setProperty('--rotate-y', '0deg');
  });
});
