/* ============================================
   AKIBAFEST 2025 — JAVASCRIPT
   ============================================ */

/* ===== GLOBAL STATE ===== */
let currentTab = 'visitor';
let currentTier = 'regular';
let qty = 1;
let slideshowActive = true;
let slideshowTimer = null;
let currentBgIndex = 0;
let slideshowInterval = 5000;

const PRICES = {
  visitor: { regular: 150000, vip: 350000, '3day': 400000 },
  seller:  { mini: 1500000, standard: 3000000, premium: 6000000 }
};
const LABELS = {
  visitor: { regular: 'Regular Pass', vip: 'VIP Pass', '3day': '3-Day Pass' },
  seller:  { mini: 'Mini Booth', standard: 'Standard Booth', premium: 'Premium Booth' }
};

/* ===== ANIME BACKGROUNDS ===== */
// Using public domain / freely usable anime-aesthetic gradient backgrounds
// In production, replace these with actual anime wallpaper URLs
const animeBgs = [
  {
    name: 'Sakura Night',
    color: 'linear-gradient(135deg, #0d0221 0%, #1a0533 30%, #2d0b4e 60%, #0d0221 100%)',
    accent: '#ff6b9d',
    thumb: 'linear-gradient(135deg,#0d0221,#2d0b4e)'
  },
  {
    name: 'Neon City',
    color: 'linear-gradient(135deg, #000d1a 0%, #001433 40%, #002266 70%, #000d1a 100%)',
    accent: '#00d4ff',
    thumb: 'linear-gradient(135deg,#000d1a,#002266)'
  },
  {
    name: 'Sunset Akiba',
    color: 'linear-gradient(135deg, #1a0000 0%, #4d0000 30%, #802b00 60%, #1a0000 100%)',
    accent: '#ff6600',
    thumb: 'linear-gradient(135deg,#1a0000,#802b00)'
  },
  {
    name: 'Ocean Spirit',
    color: 'linear-gradient(135deg, #000d1a 0%, #00334d 40%, #004466 70%, #000d1a 100%)',
    accent: '#00ffcc',
    thumb: 'linear-gradient(135deg,#000d1a,#004466)'
  },
  {
    name: 'Dark Forest',
    color: 'linear-gradient(135deg, #010d00 0%, #032400 40%, #063d00 70%, #010d00 100%)',
    accent: '#66ff66',
    thumb: 'linear-gradient(135deg,#010d00,#063d00)'
  },
  {
    name: 'Galaxy Dream',
    color: 'linear-gradient(135deg, #050014 0%, #0d0033 35%, #1a0066 65%, #050014 100%)',
    accent: '#aa88ff',
    thumb: 'linear-gradient(135deg,#050014,#1a0066)'
  },
];

function initBgChanger() {
  const presets = document.getElementById('bgPresets');
  const dots = document.getElementById('bgDots');
  presets.innerHTML = '';
  dots.innerHTML = '';

  animeBgs.forEach((bg, i) => {
    // Thumb
    const thumb = document.createElement('div');
    thumb.className = 'bg-preset-thumb' + (i === 0 ? ' active' : '');
    thumb.style.background = bg.thumb;
    thumb.innerHTML = `<span>${bg.name}</span>`;
    thumb.onclick = () => setBg(i);
    presets.appendChild(thumb);

    // Dot
    const dot = document.createElement('div');
    dot.className = 'bg-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => setBg(i);
    dots.appendChild(dot);
  });

  setBg(0);
  startSlideshow();
}

function setBg(index) {
  currentBgIndex = index;
  const bg = animeBgs[index];
  const globalBg = document.getElementById('globalBg');

  globalBg.style.background = bg.color;
  globalBg.style.backgroundSize = 'cover';

  // Update active states
  document.querySelectorAll('.bg-preset-thumb').forEach((t, i) => t.classList.toggle('active', i === index));
  document.querySelectorAll('.bg-dot').forEach((d, i) => d.classList.toggle('active', i === index));
}

function setCustomBg(url) {
  const globalBg = document.getElementById('globalBg');
  globalBg.style.background = `url('${url}') center/cover no-repeat`;
  // Add a custom entry to the list
  document.querySelectorAll('.bg-preset-thumb').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.bg-dot').forEach(d => d.classList.remove('active'));
  stopSlideshow();
  document.getElementById('slideshowBtn').textContent = '▶ Play';
}

window.uploadBg = function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => setCustomBg(ev.target.result);
  reader.readAsDataURL(file);
};

window.toggleBgPanel = function() {
  const panel = document.getElementById('bgPanel');
  panel.classList.toggle('open');
};

window.changeOverlay = function(val) {
  const overlay = document.getElementById('globalOverlay');
  overlay.style.background = `rgba(8,9,13,${val/100})`;
  document.getElementById('overlayVal').textContent = val + '%';
};

window.changeBgBlur = function(val) {
  document.getElementById('globalBg').style.filter = `blur(${val}px)`;
  document.getElementById('blurVal').textContent = val + 'px';
};

window.changeSpeed = function(val) {
  slideshowInterval = val * 1000;
  document.getElementById('speedVal').textContent = val + 's';
  if (slideshowActive) { stopSlideshow(); startSlideshow(); }
};

function startSlideshow() {
  stopSlideshow();
  slideshowTimer = setInterval(() => {
    const next = (currentBgIndex + 1) % animeBgs.length;
    setBg(next);
  }, slideshowInterval);
}

function stopSlideshow() {
  if (slideshowTimer) clearInterval(slideshowTimer);
}

window.toggleSlideshow = function() {
  slideshowActive = !slideshowActive;
  const btn = document.getElementById('slideshowBtn');
  if (slideshowActive) { startSlideshow(); btn.textContent = '⏸ Pause'; }
  else { stopSlideshow(); btn.textContent = '▶ Play'; }
};

/* ===== CURSOR ===== */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateTrail() {
  const tx = parseFloat(trail.style.left) || 0;
  const ty = parseFloat(trail.style.top) || 0;
  trail.style.left = tx + (mouseX - tx) * 0.15 + 'px';
  trail.style.top = ty + (mouseY - ty) * 0.15 + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, .ticket-card, .info-card, .guest-card, .sponsor-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '24px'; cursor.style.height = '24px';
    cursor.style.background = 'var(--primary)';
    trail.style.width = '50px'; trail.style.height = '50px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '16px'; cursor.style.height = '16px';
    cursor.style.background = 'var(--accent)';
    trail.style.width = '36px'; trail.style.height = '36px';
  });
});

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
  updateActiveNav();
});

function updateActiveNav() {
  const sections = ['hero','info','guests','sponsors','map','tickets'];
  let current = 'hero';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
window.closeMobile = () => mobileMenu.classList.remove('open');

/* ===== SAKURA ===== */
function createSakura() {
  const container = document.getElementById('sakura');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;width:${Math.random()*10+6}px;height:${Math.random()*10+6}px;background:radial-gradient(circle,rgba(255,182,193,0.8),rgba(255,105,135,0.3));border-radius:0 50% 50% 50%;left:${Math.random()*100}%;top:${Math.random()*-20}%;animation:sakuraFall ${Math.random()*8+6}s linear ${Math.random()*10}s infinite;`;
    container.appendChild(p);
  }
}
createSakura();

/* ===== PARTICLES ===== */
function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const color = Math.random() > 0.5 ? 'rgba(0,212,255,' : 'rgba(230,57,70,';
    p.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:${color}${Math.random()*0.5+0.1});border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:float ${Math.random()*10+8}s ease-in-out ${Math.random()*5}s infinite;`;
    container.appendChild(p);
  }
}
createParticles();

/* ===== STAT COUNTER ===== */
function animateCount(el, target) {
  const duration = 2000;
  const start = Date.now();
  const step = () => {
    const p = Math.min((Date.now() - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString('id');
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('id') + '+';
  };
  step();
}
const statObs = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) {
    document.querySelectorAll('.stat-num').forEach(el => animateCount(el, parseInt(el.dataset.target)));
    statObs.disconnect();
  }
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObs.observe(heroStats);

/* ===== COUNTDOWN ===== */
const eventDate = new Date('2025-08-15T09:00:00+07:00');
function updateCountdown() {
  const diff = eventDate - new Date();
  if (diff <= 0) { document.getElementById('countdown').innerHTML = '<span style="color:var(--accent);font-family:var(--font-display)">🎉 Event Sedang Berlangsung!</span>'; return; }
  const d = Math.floor(diff/86400000), h = Math.floor((diff%86400000)/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
  document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ===== SCHEDULE ===== */
const scheduleData = {
  1: [
    {time:'09:00',title:'Opening Ceremony',desc:'Pembukaan resmi AkibaFest 2025',tag:'main'},
    {time:'10:30',title:'Cosplay Walk & Parade',desc:'Parade cosplayer di area utama',tag:'contest'},
    {time:'12:00',title:'Artist Talk: Illustrator JP',desc:'Talk show bersama ilustrator dari Jepang',tag:'side'},
    {time:'14:00',title:'Cosplay Contest – Penyisihan',desc:'Penjurian tahap pertama',tag:'contest'},
    {time:'16:30',title:'Live Band Anime Cover',desc:'Penampilan band cover lagu anime',tag:'main'},
    {time:'19:00',title:'Night Market Opening',desc:'Booth malam dan pertunjukan lampu',tag:'side'},
  ],
  2: [
    {time:'09:30',title:'Workshop Cosplay Makeup',desc:'Teknik makeup cosplay dari ahlinya',tag:'side'},
    {time:'11:00',title:'Anime Quiz Competition',desc:'Uji pengetahuan animemu!',tag:'contest'},
    {time:'13:00',title:'Guest Star Q&A Session',desc:'Sesi tanya jawab dengan guest star',tag:'main'},
    {time:'15:00',title:'Doujin & Artist Alley Opening',desc:'Grand opening area artist & doujin',tag:'side'},
    {time:'17:00',title:'Cosplay Contest – Semifinal',desc:'Babak semifinal cosplay contest',tag:'contest'},
    {time:'20:00',title:'Night Fiesta & DJ Set',desc:'Pesta malam dengan DJ anime',tag:'main'},
  ],
  3: [
    {time:'10:00',title:'Cosplay Contest – Grand Final',desc:'Penentuan juara cosplay terbaik',tag:'contest'},
    {time:'12:30',title:'Meet & Greet VIP Session',desc:'Eksklusif pemegang tiket VIP',tag:'side'},
    {time:'14:00',title:'Merchandise Auction',desc:'Lelang merchandise rare & eksklusif',tag:'side'},
    {time:'16:00',title:'Announcement & Awarding',desc:'Pengumuman pemenang semua kompetisi',tag:'main'},
    {time:'18:00',title:'Closing Live Concert',desc:'Konser penutup dengan penampilan spesial',tag:'main'},
    {time:'20:00',title:'Closing Ceremony',desc:'Sayonara & sampai tahun depan! 👋',tag:'main'},
  ]
};
const tagClass = {main:'tag-main',side:'tag-side',contest:'tag-contest'};
const tagLabel = {main:'Main Stage',side:'Side Event',contest:'Contest'};

function renderSchedule(day) {
  const list = document.getElementById('scheduleList');
  list.innerHTML = '';
  scheduleData[day].forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'sched-item';
    el.style.animationDelay = `${i*60}ms`;
    el.innerHTML = `<span class="sched-time">${item.time}</span><div class="sched-content"><h4>${item.title}</h4><p>${item.desc}</p></div><span class="sched-tag ${tagClass[item.tag]}">${tagLabel[item.tag]}</span>`;
    list.appendChild(el);
  });
}
document.querySelectorAll('.sched-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.sched-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderSchedule(parseInt(tab.dataset.day));
  });
});
renderSchedule(1);

/* ===== GUEST STARS DATA ===== */
const guestData = [
  {
    name: 'Rian Pratama',
    alias: '@RianGG',
    type: 'gamer',
    origin: '🇮🇩 Jakarta, Indonesia',
    game: 'Mobile Legends / PUBG Mobile',
    tags: ['MPL Season', 'World Champion', 'Streamer'],
    session: 'Meet & Greet — Hari 1 & 2',
    avatar: 'linear-gradient(135deg,#1a0033,#4400aa,#0044ff)',
    initial: 'RG',
    imageUrl: 'Asset/RianGG.jpg'
  },
  {
    name: 'Yuki Tanaka',
    alias: '@YukiCosplay_JP',
    type: 'cosplayer',
    origin: '🇯🇵 Tokyo, Japan',
    game: 'Final Fantasy XIV Cosplay',
    tags: ['World Cosplay Summit', 'Guest JP', 'FF XIV'],
    session: 'Workshop — Hari 2',
    avatar: 'linear-gradient(135deg,#330011,#aa0044,#ff0066)',
    initial: 'YT'
  },
  {
    name: 'Kevin "Zero" Saputra',
    alias: '@ZeroML',
    type: 'gamer',
    origin: '🇮🇩 Surabaya, Indonesia',
    game: 'Mobile Legends Bang Bang',
    tags: ['MVP Season 13', 'Top Jungler', 'Content Creator'],
    session: 'Talkshow — Hari 1',
    avatar: 'linear-gradient(135deg,#001a33,#004488,#0088ff)',
    initial: 'KZ'
  },
  {
    name: 'Sachi Miura',
    alias: '@SachiArtisan',
    type: 'cosplayer',
    origin: '🇯🇵 Osaka, Japan',
    game: 'Genshin Impact / Honkai',
    tags: ['Armor Builder', 'WCS Finalist', 'Prop Master'],
    session: 'Workshop & Judging — Hari 2-3',
    avatar: 'linear-gradient(135deg,#1a0022,#660088,#cc00ff)',
    initial: 'SM'
  },
  {
    name: 'Budi "Destroyer" Harto',
    alias: '@DestroyerID',
    type: 'streamer',
    origin: '🇮🇩 Bandung, Indonesia',
    game: 'Genshin Impact / Honkai Star Rail',
    tags: ['2M Subscribers', 'Gacha King', 'Hoyoverse Partner'],
    session: 'Live Session — Hari 1',
    avatar: 'linear-gradient(135deg,#1a1a00,#555500,#aaaa00)',
    initial: 'BD'
  },
  {
    name: 'Park Jiwon',
    alias: '@JiwonCos_KR',
    type: 'cosplayer',
    origin: '🇰🇷 Seoul, Korea',
    game: 'Valorant / League of Legends',
    tags: ['Korean Champion', 'LoL Specialist', 'Twitch Partner'],
    session: 'Cosplay Show — Hari 3',
    avatar: 'linear-gradient(135deg,#001a1a,#006666,#00cccc)',
    initial: 'PJ'
  },
  {
    name: 'Indira "IniRa" Kusuma',
    alias: '@IniRaLive',
    type: 'streamer',
    origin: '🇮🇩 Jakarta, Indonesia',
    game: 'Among Us / Minecraft / Anime Reacts',
    tags: ['500K Subs', 'Variety Streamer', 'Idol Vtuber'],
    session: 'Live Collab — Hari 2',
    avatar: 'linear-gradient(135deg,#1a000d,#880033,#ff6699)',
    initial: 'IR'
  },
  {
    name: 'Liang Wei',
    alias: '@DragonCos_CN',
    type: 'cosplayer',
    origin: '🇨🇳 Shanghai, China',
    game: 'Fate / Sword Art Online',
    tags: ['Asia Cosplay Meet', 'SAO Expert', 'Prop Design'],
    session: 'Parade & Judging — Hari 1-3',
    avatar: 'linear-gradient(135deg,#1a0000,#880000,#ff4400)',
    initial: 'LW'
  },
];

function renderGuests(filter = 'all') {
  const grid = document.getElementById('guestGrid');
  grid.innerHTML = '';
  const filtered = filter === 'all' ? guestData : guestData.filter(g => g.type === filter);
  filtered.forEach((g, i) => {
    const badgeClass = {gamer:'badge-gamer',cosplayer:'badge-cosplayer',streamer:'badge-streamer'}[g.type];
    const badgeLabel = {gamer:'🎮 Gamer',cosplayer:'👘 Cosplayer',streamer:'📡 Streamer'}[g.type];
    const card = document.createElement('div');
    card.className = 'guest-card';
    card.style.animationDelay = `${i*80}ms`;
    card.innerHTML = `
      <div class="guest-card-img" style="background:${g.avatar}">
        <div class="guest-type-badge ${badgeClass}">${badgeLabel}</div>
        <div style="position:absolute;bottom:0.8rem;left:1rem;right:1rem;z-index:2;display:flex;align-items:center;gap:0.7rem">
          <div style="width:44px;height:44px;border-radius:50%;background:${g.avatar};display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:0.85rem;border:2px solid rgba(255,255,255,0.3);flex-shrink:0">${g.initial}</div>
          <div><div style="font-family:var(--font-display);font-size:0.95rem;color:#fff">${g.name}</div><div style="font-size:0.72rem;color:rgba(255,255,255,0.6)">${g.alias}</div></div>
        </div>
      </div>
      <div class="guest-card-body">
        <div class="guest-origin">${g.origin} · ${g.game}</div>
        <div class="guest-tags">${g.tags.map(t=>`<span class="guest-tag">${t}</span>`).join('')}</div>
      </div>
      <div class="guest-card-bottom">
        <div class="guest-session-badge">${g.session}</div>
      </div>`;
    grid.appendChild(card);
  });
}

document.querySelectorAll('.guest-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.guest-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGuests(btn.dataset.filter);
  });
});
renderGuests();

/* ===== SPONSORS DATA ===== */
const sponsorData = {
  platinum: [
    { name: 'PlayStation', icon: '🎮', category: 'Gaming Platform', color: '#003791' },
    { name: 'Genshin Impact', icon: '⚔️', category: 'Game Publisher', color: '#1a0066' },
    { name: 'Crunchyroll', icon: '📺', category: 'Anime Streaming', color: '#ff6600' },
  ],
  gold: [
    { name: 'Razer', icon: '🐍', category: 'Gaming Peripherals', color: '#00d900' },
    { name: 'Bandai Namco', icon: '🎌', category: 'Toy & Game Publisher', color: '#cc0000' },
    { name: 'Tokopedia', icon: '🛒', category: 'E-Commerce', color: '#00aa55' },
    { name: 'HoYoverse', icon: '🌟', category: 'Game Developer', color: '#5522aa' },
  ],
  silver: [
    { name: 'Vidio', icon: '📱', category: 'Video Platform', color: '#0066cc' },
    { name: 'ASUS ROG', icon: '💻', category: 'Gaming Hardware', color: '#cc0000' },
    { name: 'Sanrio ID', icon: '🎀', category: 'Lifestyle Brand', color: '#ff4499' },
    { name: 'Indomaret', icon: '🏪', category: 'Official Store Partner', color: '#ff0000' },
    { name: 'Acer', icon: '🖥️', category: 'Tech Partner', color: '#83b81a' },
    { name: 'KFC Indonesia', icon: '🍗', category: 'Food Sponsor', color: '#e4002b' },
  ]
};

function renderSponsors() {
  ['platinum','gold','silver'].forEach(tier => {
    const row = document.getElementById(`sponsors-${tier}`);
    row.innerHTML = '';
    sponsorData[tier].forEach(s => {
      const card = document.createElement('div');
      card.className = `sponsor-card ${tier}`;
      card.innerHTML = `
        <div class="sponsor-logo-box" style="background:${s.color}22;border:1px solid ${s.color}44">
          <span style="font-size:1.8rem">${s.icon}</span>
        </div>
        <div class="sponsor-name">${s.name}</div>
        <div class="sponsor-category">${s.category}</div>`;
      row.appendChild(card);
    });
  });
}
renderSponsors();

/* ===== TICKET TABS ===== */
window.switchTab = function(type) {
  currentTab = type;
  document.querySelectorAll('.ticket-tab').forEach(t => t.classList.toggle('active', t.dataset.type === type));
  document.getElementById('panel-visitor').classList.toggle('hidden', type !== 'visitor');
  document.getElementById('panel-seller').classList.toggle('hidden', type !== 'seller');
};

/* ===== MODAL ===== */
window.openForm = function(type, tier) {
  currentTab = type; currentTier = tier; qty = 1;
  const isV = type === 'visitor';
  const kanjiMap = {regular:'一般',vip:'特別','3day':'三日',mini:'小',standard:'標',premium:'大'};
  document.getElementById('modalKanji').textContent = kanjiMap[tier] || '申';
  document.getElementById('modalTitle').textContent = isV ? 'Form Pemesanan Tiket' : 'Form Pendaftaran Booth';
  document.getElementById('modalSubtitle').textContent = LABELS[type][tier];
  document.querySelectorAll('.visitor-only').forEach(el => el.classList.toggle('hidden', !isV));
  document.querySelectorAll('.seller-only').forEach(el => el.classList.toggle('hidden', isV));
  updateSummary();
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeModalBtn = function() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
};

window.closeModal = function(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModalBtn();
};

window.changeQty = function(d) {
  qty = Math.max(1, Math.min(10, qty + d));
  document.getElementById('qtyDisplay').textContent = qty;
  updateSummary();
};

function updateSummary() {
  const price = PRICES[currentTab][currentTier];
  const total = currentTab === 'visitor' ? price * qty : price;
  document.getElementById('summaryPaket').textContent = LABELS[currentTab][currentTier];
  document.getElementById('summaryTotal').textContent = 'Rp ' + total.toLocaleString('id');
}

window.submitForm = function(e) {
  e.preventDefault();
  if (!document.getElementById('fName').value || !document.getElementById('fEmail').value || !document.getElementById('fPhone').value) {
    alert('Mohon lengkapi semua field yang wajib diisi.');
    return;
  }
  const btn = document.querySelector('.btn-submit');
  btn.innerHTML = '<span>Memproses...</span>';
  btn.disabled = true;
  setTimeout(() => {
    closeModalBtn();
    btn.innerHTML = '<span>Konfirmasi Pemesanan</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    btn.disabled = false;
    document.getElementById('bookingForm').reset();
    qty = 1; document.getElementById('qtyDisplay').textContent = '1';
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }, 1500);
};

window.scrollToTickets = () => document.getElementById('tickets').scrollIntoView({ behavior: 'smooth' });

/* ===== SCROLL ANIMATIONS ===== */
const cardObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.info-card,.ticket-card,.venue-card,.floorplan,.guest-card,.sponsor-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  cardObs.observe(el);
});

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initBgChanger();
});

// Also call initBgChanger directly in case DOM is already ready
initBgChanger();