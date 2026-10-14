const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const dialog = document.querySelector('[data-privacy-dialog]');

const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

const closeMenu = (restoreFocus = false) => {
  menu?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  if (restoreFocus) menuButton?.focus();
};

menuButton?.addEventListener('click', () => {
  const nextState = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(nextState));
  menu?.classList.toggle('open', nextState);
  document.body.classList.toggle('menu-open', nextState);
});

menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.classList.contains('open')) closeMenu(true);
  if (event.key === 'Tab' && menu?.classList.contains('open')) {
    const focusable = [menuButton, ...menu.querySelectorAll('a')].filter(Boolean);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

document.querySelector('[data-copy-contact]')?.addEventListener('click', async () => {
  const status = document.querySelector('[data-copy-status]');
  try {
    await navigator.clipboard.writeText(document.querySelector('[data-copy-contact]').dataset.contactEmail);
    if (status) status.textContent = 'Enquiry email copied to clipboard.';
  } catch {
    if (status) status.textContent = 'Copy unavailable. Use the consultation button to open your email app.';
  }
});

document.querySelectorAll('[data-privacy-open]').forEach((button) => {
  button.addEventListener('click', () => dialog?.showModal());
});
document.querySelectorAll('[data-privacy-close]').forEach((button) => {
  button.addEventListener('click', () => dialog?.close());
});
dialog?.addEventListener('click', (event) => {
  const bounds = dialog.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) dialog.close();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-ready'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}
