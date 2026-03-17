
const PASSCODE = '201301';
const gatePage = document.getElementById('gatePage');
const siteApp = document.getElementById('siteApp');
const passcodeInput = document.getElementById('passcodeInput');
const unlockBtn = document.getElementById('unlockBtn');
const gateError = document.getElementById('gateError');

function showSite(){
  gatePage.classList.add('hidden');
  siteApp.classList.remove('hidden');
  window.scrollTo(0, 0);
  updateSubHeader();
}
function unlockSite(){
  if(passcodeInput.value === PASSCODE){
    sessionStorage.setItem('careerSiteUnlockedV3','true');
    showSite();
  } else {
    gateError.textContent = 'パスコードが違います。';
  }
}
unlockBtn.addEventListener('click', unlockSite);
passcodeInput.addEventListener('keydown', e => {
  if(e.key === 'Enter') unlockSite();
});
if(sessionStorage.getItem('careerSiteUnlockedV3') === 'true'){
  showSite();
}

const sections = [...document.querySelectorAll('section[data-title]')];
const sectionLabel = document.getElementById('sectionLabel');
const sectionTitle = document.getElementById('sectionTitle');
const progressBar = document.getElementById('progressBar');

function updateClock(){
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
function updateSubHeader(){
  if(siteApp.classList.contains('hidden')) return;
  const marker = window.innerHeight * 0.33;
  let activeIndex = 0;
  sections.forEach((sec, i) => {
    const rect = sec.getBoundingClientRect();
    if(rect.top <= marker && rect.bottom >= marker) activeIndex = i;
  });
  const active = sections[activeIndex];
  sectionLabel.textContent = active.dataset.label || 'Section';
  sectionTitle.textContent = active.dataset.title || '';
  progressBar.style.width = (((activeIndex + 1) / sections.length) * 100) + '%';
}
updateClock();
setInterval(updateClock, 1000);
window.addEventListener('scroll', updateSubHeader, { passive:true });
window.addEventListener('resize', updateSubHeader);

// segmented tabs
const segBtns = document.querySelectorAll('.seg-btn');
const tabViews = document.querySelectorAll('.tab-view');
segBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.tab;
    segBtns.forEach(b => b.classList.remove('active'));
    tabViews.forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + key).classList.add('active');
  });
});

// local notes
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

function renderPreview(){
  previewTitle.textContent = recentTitle.value.trim() || 'No label yet';
  previewNotes.textContent = recentNotes.value.trim() || '保存した内容がここに表示されます。';
}
function loadRecent(){
  recentTitle.value = localStorage.getItem('recentTitleV3') || '';
  recentNotes.value = localStorage.getItem('recentNotesV3') || '';
  renderPreview();
}
saveBtn.addEventListener('click', () => {
  localStorage.setItem('recentTitleV3', recentTitle.value);
  localStorage.setItem('recentNotesV3', recentNotes.value);
  renderPreview();
});
clearBtn.addEventListener('click', () => {
  recentTitle.value = '';
  recentNotes.value = '';
  localStorage.removeItem('recentTitleV3');
  localStorage.removeItem('recentNotesV3');
  renderPreview();
});
copyPromptBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(promptText.value);
  copyPromptBtn.textContent = 'Copied';
  setTimeout(() => copyPromptBtn.textContent = 'Copy GPT prompt', 1400);
});
copyResumeBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resumeBox.innerText.trim());
  copyResumeBtn.textContent = 'Copied';
  setTimeout(() => copyResumeBtn.textContent = 'Copy resume', 1400);
});
loadRecent();
