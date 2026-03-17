
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
    sessionStorage.setItem('careerSiteUnlockedV4','true');
    showSite();
  } else {
    gateError.textContent = 'パスコードが違います。';
  }
}
unlockBtn.addEventListener('click', unlockSite);
passcodeInput.addEventListener('keydown', e => {
  if(e.key === 'Enter') unlockSite();
});
if(sessionStorage.getItem('careerSiteUnlockedV4') === 'true'){
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

// tabs
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

// notes local save
const recentTitle = document.getElementById('recentTitle');
const recentNotes = document.getElementById('recentNotes');
const previewTitle = document.getElementById('previewTitle');
const previewNotes = document.getElementById('previewNotes');
document.getElementById('saveRecentBtn').addEventListener('click', () => {
  localStorage.setItem('recentTitleV4', recentTitle.value);
  localStorage.setItem('recentNotesV4', recentNotes.value);
  renderPreview();
});
document.getElementById('clearRecentBtn').addEventListener('click', () => {
  recentTitle.value = '';
  recentNotes.value = '';
  localStorage.removeItem('recentTitleV4');
  localStorage.removeItem('recentNotesV4');
  renderPreview();
});
function renderPreview(){
  previewTitle.textContent = recentTitle.value.trim() || 'No label yet';
  previewNotes.textContent = recentNotes.value.trim() || '保存した内容がここに表示されます。';
}
function loadRecent(){
  recentTitle.value = localStorage.getItem('recentTitleV4') || '';
  recentNotes.value = localStorage.getItem('recentNotesV4') || '';
  renderPreview();
}
loadRecent();

// profile + agent prompt
const profileIds = ['fullName','address','phone','email','targetRole'];
const agentOutput = document.getElementById('agentPromptOutput');

function buildAgentPrompt(){
  const name = document.getElementById('fullName').value.trim();
  const address = document.getElementById('address').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const targetRole = document.getElementById('targetRole').value.trim();
  const recentLabel = recentTitle.value.trim();
  const recentBody = recentNotes.value.trim();

  const prompt = `以下の人物情報と経歴情報をもとに、応募書類、自己紹介、職務経歴書、面接回答、LinkedIn要約などを作成してください。誇張しすぎず、でも弱くしすぎず、知的で洗練されたトーンにしてください。必要に応じて、日本語版と自然な英語版の両方を出してください。

個人情報:
氏名: ${name}
住所: ${address}
電話番号: ${phone}
メールアドレス: ${email}
対象ポジション: ${targetRole}

経歴の要点:
- SoftBankでスマホ営業エリアマネージャーを経験
- その後、SoftBankで新規事業開発を経験
- WeWorkやCameo Japanなどの立ち上げやアライアンスに関与
- AmazonでEasy Ship立ち上げに関与
- AmazonでMerchant ConsultantとしてMarketplace成長、JBP、カテゴリ視点、施策実装、セラー支援を経験
- プラットフォーム型ビジネス、チャネル、カテゴリ、エコシステム戦略に強み
- UI/UXやApple的な体験価値への関心が強い
- 営業だけでもコンサルだけでもなく、事業と仕組みをつなぐタイプ

最近やったことメモ:
タイトル: ${recentLabel}
本文: ${recentBody}

作成したいもの:
1. 職務経歴書向けの要約
2. 応募先向けの自己紹介文
3. 面接で1分で話す説明
4. LinkedInや個人サイトに載せる短い紹介文`;

  agentOutput.value = prompt;
  return prompt;
}
document.getElementById('copyAgentPromptBtn').addEventListener('click', async () => {
  const prompt = buildAgentPrompt();
  await navigator.clipboard.writeText(prompt);
  const btn = document.getElementById('copyAgentPromptBtn');
  btn.textContent = 'Copied';
  setTimeout(() => btn.textContent = 'Copy agent prompt', 1400);
});
document.getElementById('saveProfileBtn').addEventListener('click', () => {
  profileIds.forEach(id => localStorage.setItem('profile_' + id, document.getElementById(id).value));
  buildAgentPrompt();
});
function loadProfile(){
  profileIds.forEach(id => {
    const v = localStorage.getItem('profile_' + id);
    if(v) document.getElementById(id).value = v;
  });
  buildAgentPrompt();
}
profileIds.forEach(id => {
  document.getElementById(id).addEventListener('input', buildAgentPrompt);
});
recentTitle.addEventListener('input', buildAgentPrompt);
recentNotes.addEventListener('input', buildAgentPrompt);
loadProfile();

document.getElementById('copyResumeBtn').addEventListener('click', async () => {
  const text = document.getElementById('resumeBox').innerText.trim();
  await navigator.clipboard.writeText(text);
  const btn = document.getElementById('copyResumeBtn');
  btn.textContent = 'Copied';
  setTimeout(() => btn.textContent = 'Copy resume', 1400);
});
