
const sections = [...document.querySelectorAll('section[data-title]')];
const sectionLabel = document.getElementById('sectionLabel');
const sectionTitle = document.getElementById('sectionTitle');
const progressBar = document.getElementById('progressBar');

const updateClock = () => {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now);
  document.getElementById('clock').textContent = fmt + ' JST';
};

const updateSubHeader = () => {
  const marker = window.innerHeight * 0.33;
  let activeIndex = 0;
  sections.forEach((sec, i) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= marker && rect.bottom >= marker) activeIndex = i;
  });
  const active = sections[activeIndex];
  sectionLabel.textContent = active.dataset.label || 'Section';
  sectionTitle.textContent = active.dataset.title || '';
  const progress = ((activeIndex + 1) / sections.length) * 100;
  progressBar.style.width = progress + '%';
};

updateClock();
updateSubHeader();
setInterval(updateClock, 1000);
window.addEventListener('scroll', updateSubHeader, { passive: true });
window.addEventListener('resize', updateSubHeader);
