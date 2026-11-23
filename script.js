// Progressive enhancement: navigation, publications and news work without JavaScript.
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menu.hidden = false;
function closeMenu(returnFocus = false) {
  menu.setAttribute('aria-expanded', 'false');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', String(menu.getAttribute('aria-expanded') !== 'true'));
});
nav.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;
  closeMenu();
  // Move focus to the selected content before hiding the mobile navigation.
  const section = document.querySelector(link.getAttribute('href'));
  section.setAttribute('tabindex', '-1');
  section.focus({ preventScroll: true });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
window.matchMedia('(max-width: 700px)').addEventListener('change', () => closeMenu());

// Show the latest ten news items; keep all items accessible without JavaScript.
const newsList = document.querySelector('#news-list');
const newsToggle = document.querySelector('.news-toggle');
if (newsList && newsToggle && newsList.children.length > 10) {
  const olderCount = newsList.children.length - 10;
  const moreLabel = `Show more news (${olderCount})`;
  newsList.classList.add('is-collapsed');
  newsToggle.textContent = moreLabel;
  newsToggle.hidden = false;
  newsToggle.addEventListener('click', () => {
    const expanded = newsToggle.getAttribute('aria-expanded') !== 'true';
    newsList.classList.toggle('is-collapsed', !expanded);
    newsToggle.setAttribute('aria-expanded', String(expanded));
    newsToggle.textContent = expanded ? 'Show less news' : moreLabel;
    updateActiveSection();
  });
}

// Keep the section indicator in sync when navigating or scrolling.
const navLinks = [...nav.querySelectorAll('a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
let scheduled = false;
function updateActiveSection() {
  const offset = document.querySelector('.site-header').offsetHeight + 90;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= offset) active = section;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) active = sections[sections.length - 1];
  navLinks.forEach(link => {
    if (link.getAttribute('href') === `#${active.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateActiveSection); }
}, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();

const avatar = document.querySelector('#avatar-img');
function showAvatarFallback() {
  avatar.hidden = true;
  document.querySelector('.avatar-placeholder').hidden = false;
}
avatar.addEventListener('error', showAvatarFallback);
if (avatar.complete && !avatar.naturalWidth) showAvatarFallback();
