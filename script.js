/* ==========================================================================
   Thiệp Kim Hạnh — JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initGuestName();
  initSparkles();
  initEnvelope();
  initModals();
  initSecretModal();
  initAutoRemoveBackground();
});

/* --------------------------------------------------------------------------
   1. GUEST NAME PARSER
   -------------------------------------------------------------------------- */
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('name') || urlParams.get('khach') || 'Quý Khách Mời';
  const decodedName = decodeURIComponent(guestName);

  const guestTagEl = document.getElementById('guest-tag-name');
  const guestFullnameEl = document.getElementById('guest-fullname');

  if (guestTagEl) guestTagEl.textContent = decodedName;
  if (guestFullnameEl) guestFullnameEl.textContent = decodedName;

  // Only show "Danh Sách Thiệp Riêng" button if URL contains ?admin=1 or ?owner=1
  if (urlParams.get('admin') === '1' || urlParams.get('owner') === '1') {
    const linkGenToggle = document.getElementById('link-gen-toggle');
    if (linkGenToggle) linkGenToggle.style.display = 'flex';
  }
}

/* --------------------------------------------------------------------------
   2. SPARKLE CANVAS (floating pastel particles)
   -------------------------------------------------------------------------- */
function initSparkles() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  const particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2,
      opacity: Math.random() * 0.4 + 0.1,
      color: ['#f48fb1','#f8bbd0','#fce4ec','#f06292','#fff'][Math.floor(Math.random() * 5)]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   3. ENVELOPE OPENING — exact logic as original project
   -------------------------------------------------------------------------- */
function initEnvelope() {
  const screen  = document.getElementById('envelope-screen');
  const wrapper = document.getElementById('envelope-wrapper');
  const body    = document.getElementById('envelope-body');
  const seal    = document.getElementById('wax-seal');
  const flap    = document.getElementById('env-flap');
  const main    = document.getElementById('main-content');

  function openEnvelope() {
    if (!screen || screen.classList.contains('opened')) return;

    // 1. Fire cherry blossom petal rain
    startPetalRain();

    // 2. Animate flap open
    if (flap) flap.classList.add('open');

    // 3. After flap animation, show main content
    setTimeout(() => {
      if (screen) screen.classList.add('opened');
      document.body.style.overflow = 'auto';
      if (main) {
        main.classList.add('visible');
        main.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 800);
  }

  if (seal)    seal.addEventListener('click', openEnvelope);
  if (body)    body.addEventListener('click', openEnvelope);
  if (wrapper) wrapper.addEventListener('click', openEnvelope);
}

/* --------------------------------------------------------------------------
   4. PINK PETAL / CHERRY BLOSSOM RAIN
   -------------------------------------------------------------------------- */
function startPetalRain() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const colors = ['#fce4ec','#f8bbd0','#f48fb1','#ffffff','#fff0f5','#f06292'];
  const petals = [];

  for (let i = 0; i < 65; i++) {
    petals.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 320,
      size: Math.random() * 9 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 1.8 + 0.7,
      speedX: (Math.random() - 0.5) * 1.4,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.05 + 0.02,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2.5,
      opacity: 0.75 + Math.random() * 0.25
    });
  }

  let frame = 0;
  const MAX = 450;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    petals.forEach(p => {
      if (p.y < canvas.height + 20) {
        alive = true;
        p.wobble += p.wobbleSpeed;
        p.y += p.speedY; p.x += p.speedX + Math.sin(p.wobble) * 1.2;
        p.rotation += p.rotSpeed;
        ctx.save();
        ctx.globalAlpha = p.opacity * (1 - Math.max(0, (frame - MAX + 60) / 60));
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
    frame++;
    if (alive && frame < MAX) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

/* --------------------------------------------------------------------------
   5. SECRET LETTER MODAL (Hộp thư bí mật chứa Lời chúc & Nút chức năng)
   -------------------------------------------------------------------------- */
function initSecretModal() {
  const secretBtn   = document.getElementById('secret-btn');
  const secretModal = document.getElementById('secret-modal');
  const closeBtn    = document.getElementById('secret-modal-close');

  if (secretBtn && secretModal) {
    secretBtn.addEventListener('click', () => {
      secretModal.classList.add('active');
    });
  }

  if (closeBtn && secretModal) {
    closeBtn.addEventListener('click', () => {
      secretModal.classList.remove('active');
    });
  }

  if (secretModal) {
    secretModal.addEventListener('click', (e) => {
      if (e.target === secretModal) secretModal.classList.remove('active');
    });
  }
}

/* --------------------------------------------------------------------------
   6. BFS FLOOD-FILL BACKGROUND REMOVAL FOR GRADUATE PHOTO
   -------------------------------------------------------------------------- */
function initAutoRemoveBackground() {
  const imgEl = document.getElementById('graduate-img');
  if (!imgEl) return;

  const processImg = () => {
    try {
      if (imgEl.dataset.bgProcessed) return;
      imgEl.dataset.bgProcessed = "true";

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const w = imgEl.naturalWidth || imgEl.width;
      const h = imgEl.naturalHeight || imgEl.height;
      if (!w || !h) return;

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(imgEl, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Helper to check if pixel is neutral light background (studio grey/white)
      function isBgPixel(r, g, b) {
        const brightness = (r + g + b) / 3;
        const diff = Math.max(r, g, b) - Math.min(r, g, b);
        return brightness > 185 && diff < 40;
      }

      // BFS Flood-Fill from outer edges
      const visited = new Uint8Array(w * h);
      const queue = [];

      for (let x = 0; x < w; x++) {
        queue.push(x, 0);
        queue.push(x, h - 1);
        visited[0 * w + x] = 1;
        visited[(h - 1) * w + x] = 1;
      }
      for (let y = 0; y < h; y++) {
        queue.push(0, y);
        queue.push(w - 1, y);
        visited[y * w + 0] = 1;
        visited[y * w + (w - 1)] = 1;
      }

      let head = 0;
      while (head < queue.length) {
        const cx = queue[head++];
        const cy = queue[head++];
        const idx = (cy * w + cx) * 4;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        if (isBgPixel(r, g, b)) {
          data[idx + 3] = 0;

          const neighbors = [
            [cx + 1, cy], [cx - 1, cy],
            [cx, cy + 1], [cx, cy - 1]
          ];

          for (let i = 0; i < neighbors.length; i++) {
            const nx = neighbors[i][0];
            const ny = neighbors[i][1];

            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const nPos = ny * w + nx;
              if (!visited[nPos]) {
                visited[nPos] = 1;
                const nIdx = nPos * 4;
                if (isBgPixel(data[nIdx], data[nIdx + 1], data[nIdx + 2])) {
                  queue.push(nx, ny);
                }
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      imgEl.src = canvas.toDataURL('image/png');
      imgEl.style.mixBlendMode = 'normal';
    } catch (e) {
      console.warn("Canvas background removal error:", e);
    }
  };

  if (imgEl.complete) {
    processImg();
  } else {
    imgEl.addEventListener('load', processImg);
  }
}

/* --------------------------------------------------------------------------
   7. MODALS & LINK GENERATOR
   -------------------------------------------------------------------------- */
const GUEST_LIST = [
  "Chị Anh Như",
  "Chị Gia Hân",
  "Gia Hân",
  "Kim Hồng",
  "Minh Khánh",
  "Chị Minh Thúy",
  "Mỹ Uyên",
  "Ngọc Hà",
  "Em Ngọc Huy",
  "Phương Thanh",
  "Thùy Dương"
];

function initModals() {
  const linkGenToggle = document.getElementById('link-gen-toggle');
  const modalOverlay = document.getElementById('link-modal');
  const modalClose = document.getElementById('modal-close');
  const guestListContainer = document.getElementById('guest-list-items');
  const customInput = document.getElementById('custom-guest-name');
  const customCopyBtn = document.getElementById('custom-copy-btn');

  function renderGuestList() {
    if (!guestListContainer) return;
    const baseUrl = window.location.origin + window.location.pathname;

    guestListContainer.innerHTML = GUEST_LIST.map(name => {
      const targetUrl = `${baseUrl}?to=${encodeURIComponent(name)}`;
      return `
        <div class="guest-item-row">
          <span class="guest-item-name">${escapeHtml(name)}</span>
          <button class="copy-btn" onclick="copyGuestLink(this, '${escapeHtml(targetUrl)}')">
            📋 Sao chép Link
          </button>
        </div>
      `;
    }).join('');
  }

  renderGuestList();

  if (linkGenToggle && modalOverlay) {
    linkGenToggle.addEventListener('click', () => {
      modalOverlay.classList.add('active');
    });
  }

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  if (customCopyBtn && customInput) {
    customCopyBtn.addEventListener('click', () => {
      const name = customInput.value.trim();
      if (!name) {
        alert('Vui lòng nhập tên khách mời!');
        return;
      }
      const baseUrl = window.location.origin + window.location.pathname;
      const targetUrl = `${baseUrl}?to=${encodeURIComponent(name)}`;
      copyGuestLink(customCopyBtn, targetUrl);
    });
  }
}

// Global copy helper
window.copyGuestLink = function(btnEl, url) {
  navigator.clipboard.writeText(url).then(() => {
    const originalText = btnEl.textContent;
    btnEl.textContent = '✓ Đã chép!';
    btnEl.classList.add('copied');
    setTimeout(() => {
      btnEl.textContent = originalText;
      btnEl.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    prompt('Đường link thiệp riêng cho khách:', url);
  });
};

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

/* --------------------------------------------------------------------------
   8. DOWNLOAD CARD (html2canvas)
   -------------------------------------------------------------------------- */
window.downloadCardImage = function () {
  const card = document.getElementById('capture-card');
  if (!card) { alert('Không tìm thấy thiệp!'); return; }

  function doCapture() {
    const btn = document.querySelector('[onclick="downloadCardImage()"]');
    if (btn) { btn.textContent = '⏳ Đang xử lý...'; btn.disabled = true; }
    document.body.classList.add('capture-mode');

    setTimeout(() => {
      window.html2canvas(card, { useCORS: true, allowTaint: true, scale: 2, backgroundColor: '#f4f0f0', logging: false })
        .then(cv => {
          document.body.classList.remove('capture-mode');
          const a = document.createElement('a');
          a.download = 'Thiep_Tot_Nghiep_KimHanh.png';
          a.href = cv.toDataURL('image/png'); a.click();
          if (btn) { btn.innerHTML = '📸 Tải Ảnh Thiệp'; btn.disabled = false; }
        })
        .catch(err => {
          console.error(err); document.body.classList.remove('capture-mode');
          alert('Lỗi khi tạo ảnh!');
          if (btn) { btn.textContent = '📸 Tải Ảnh Thiệp'; btn.disabled = false; }
        });
    }, 100);
  }

  if (typeof window.html2canvas !== 'undefined') {
    doCapture();
  } else {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = doCapture; s.onerror = () => alert('Không tải me được thư viện!');
    document.head.appendChild(s);
  }
};
