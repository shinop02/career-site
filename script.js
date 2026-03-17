
const PASSCODE = '201301';
const gate = document.getElementById('gate');
const passcodeInput = document.getElementById('passcodeInput');
const unlockBtn = document.getElementById('unlockBtn');
const gateError = document.getElementById('gateError');

function unlockSite() {
  if (passcodeInput.value === PASSCODE) {
    sessionStorage.setItem('careerSiteUnlocked', 'true');
    gate.style.display = 'none';
  } else {
    gateError.textContent = 'パスコードが違います。';
  }
}
unlockBtn.addEventListener('click', unlockSite);
passcodeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') unlockSite();
});
if (sessionStorage.getItem('careerSiteUnlocked') === 'true') {
  gate.style.display = 'none';
}

const sections = [...document.querySelectorAll('section[data-title]')];
const sectionLabel = document.getElementById('sectionLabel');
const sectionTitle = document.getElementById('sectionTitle');
const progressBar = document.getElementById('progressBar');

function updateClock() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now);
  document.getElementById('clock').textContent = fmt + ' JST';
}
function updateSubHeader() {
  const marker = window.innerHeight * 0.33;
  let activeIndex = 0;
  sections.forEach((sec, i) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= marker && rect.bottom >= marker) activeIndex = i;
  });
  const active = sections[activeIndex];
  sectionLabel.textContent = active.dataset.label || 'Section';
  sectionTitle.textContent = active.dataset.title || '';
  progressBar.style.width = (((activeIndex + 1) / sections.length) * 100) + '%';
}
updateClock();
updateSubHeader();
setInterval(updateClock, 1000);
window.addEventListener('scroll', updateSubHeader, { passive: true });
window.addEventListener('resize', updateSubHeader);

// tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});

// local save
const recentTitle = document.getElementById('recentTitle');
const recentNotes = document.getElementById('recentNotes');
const previewTitle = document.getElementById('previewTitle');
const previewNotes = document.getElementById('previewNotes');
const saveBtn = document.getElementById('saveRecentBtn');
const clearBtn = document.getElementById('clearRecentBtn');
const promptText = document.getElementById('promptText');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const copyResumeBtn = document.getElementById('copyResumeBtn');
const resumeBox = document.getElementById('resumeBox');

function renderPreview() {
  previewTitle.textContent = recentTitle.value.trim() || 'No title yet';
  previewNotes.textContent = recentNotes.value.trim() || 'ここに保存した内容が表示されます。';
}
function loadRecent() {
  recentTitle.value = localStorage.getItem('recentTitle') || '';
  recentNotes.value = localStorage.getItem('recentNotes') || '';
  renderPreview();
}
saveBtn.addEventListener('click', () => {
  localStorage.setItem('recentTitle', recentTitle.value);
  localStorage.setItem('recentNotes', recentNotes.value);
  renderPreview();
});
clearBtn.addEventListener('click', () => {
  recentTitle.value = '';
  recentNotes.value = '';
  localStorage.removeItem('recentTitle');
  localStorage.removeItem('recentNotes');
  renderPreview();
});
copyPromptBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(promptText.value);
  copyPromptBtn.textContent = 'コピーしました';
  setTimeout(() => copyPromptBtn.textContent = 'GPT用プロンプトをコピー', 1400);
});
copyResumeBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resumeBox.innerText.trim());
  copyResumeBtn.textContent = 'コピーしました';
  setTimeout(() => copyResumeBtn.textContent = 'レジュメ本文をコピー', 1400);
});
loadRecent();
