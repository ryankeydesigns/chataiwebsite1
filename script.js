const body = document.body;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Theme
const themeButton = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && matchMedia('(prefers-color-scheme: dark)').matches)) {
  body.classList.add('dark');
}
themeButton.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

// Mobile navigation
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '×' : '☰';
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '☰';
}));

// Scroll progress, header state and active navigation
const progress = document.querySelector('.scroll-progress');
const sections = [...document.querySelectorAll('section[id]')];
const navItems = [...document.querySelectorAll('.nav-links a')];
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  document.querySelector('.site-header').classList.toggle('scrolled', scrollY > 20);
  let current = 'home';
  sections.forEach(section => {
    if (scrollY >= section.offsetTop - innerHeight * .35) current = section.id;
  });
  navItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === '#' + current));
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal animations
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = Math.min(index % 3 * 90, 180) + 'ms';
  revealObserver.observe(el);
});

// Animated statistics
const countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const el = entry.target;
  const target = Number(el.dataset.count);
  const duration = reduceMotion ? 0 : 1100;
  const start = performance.now();
  function tick(now) {
    const progress = duration ? Math.min((now - start) / duration, 1) : 1;
    const eased = 1 - Math.pow(1 - progress, 3);
    let value = String(Math.round(target * eased));
    if (el.dataset.pad) value = value.padStart(Number(el.dataset.pad), '0');
    el.textContent = value + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  countObserver.unobserve(el);
}), { threshold: .7 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
  // Soft cursor glow
  const glow = document.querySelector('.cursor-glow');
  addEventListener('pointermove', event => {
    body.classList.add('cursor-active');
    glow.style.left = event.clientX + 'px';
    glow.style.top = event.clientY + 'px';
  }, { passive: true });

  // Portrait parallax
  const visual = document.querySelector('.hero-visual');
  const portrait = document.querySelector('.portrait');
  visual.addEventListener('pointermove', event => {
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    portrait.style.transform = `rotate(3deg) translate(${x * 12}px,${y * 12}px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  visual.addEventListener('pointerleave', () => portrait.style.transform = 'rotate(3deg)');

  // Project card tilt
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-8px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  // Magnetic buttons
  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .12}px,${(event.clientY - rect.top - rect.height / 2) * .16}px)`;
    });
    button.addEventListener('pointerleave', () => button.style.transform = '');
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
