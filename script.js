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

const publications = [...document.querySelectorAll('.publication')];
const filters = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#publication-search');
const status = document.querySelector('#publication-status');
let selectedTopic = 'all';
function filterPublications() {
  const query = search.value.trim().toLocaleLowerCase();
  let count = 0;
  for (const paper of publications) {
    const matchesTopic = selectedTopic === 'all' || paper.dataset.topic === selectedTopic;
    paper.hidden = !(matchesTopic && paper.textContent.toLocaleLowerCase().includes(query));
    if (!paper.hidden) count++;
  }
  document.querySelectorAll('.publication-year').forEach(group => {
    const visible = [...group.querySelectorAll('.publication')].filter(paper => !paper.hidden).length;
    group.hidden = visible === 0;
    group.querySelector('.year-label span').textContent = `${String(visible).padStart(2, '0')} ${visible === 1 ? 'paper' : 'papers'}`;
  });
  status.textContent = count === publications.length ? `Showing all ${count} publications` : `Showing ${count} of ${publications.length} publications`;
  document.querySelector('.empty-state').hidden = count !== 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  selectedTopic = button.dataset.filter;
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  filterPublications();
}));
search.addEventListener('input', filterPublications);
document.querySelector('.publication-tools').hidden = false;
filterPublications();

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

// A printed bibliography always includes all papers, even after filtering.
let printQuery = '';
let printTopic = 'all';
window.addEventListener('beforeprint', () => {
  printQuery = search.value;
  printTopic = selectedTopic;
  search.value = '';
  selectedTopic = 'all';
  filterPublications();
});
window.addEventListener('afterprint', () => {
  search.value = printQuery;
  selectedTopic = printTopic;
  filterPublications();
});
