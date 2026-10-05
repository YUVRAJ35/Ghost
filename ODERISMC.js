/**
 * OderisMC Cyber Network Interactive Scripts
 * Handles Dual Cursor, Particle Canvas, Minotar Head Fetching,
 * Ghost AI v2.93 Interactive Engine (with Persistent Memory),
 * and Payment Modal & Purchase History Storage.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     0. CENTRAL STORAGE ENGINE (LOCALSTORAGE)
     ========================================== */
  const STORAGE_KEYS = {
    CHAT_HISTORY: 'oderis_chat_history_v1',
    PURCHASE_LOGS: 'oderis_purchase_logs_v1',
    LAST_USERNAME: 'oderis_saved_username_v1',
    STATS: 'oderis_system_stats_v1'
  };

  const DB = {
    get: (key, fallback = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      } catch (e) {
        console.warn('Storage read failed:', e);
        return fallback;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Storage write failed:', e);
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('Storage delete failed:', e);
      }
    }
  };

  /* ==========================================
     1. DUAL CUSTOM CURSOR EFFECT
     ========================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 300, fill: "forwards" });
    });

    const hoverables = document.querySelectorAll('a, button, .card, .chip, input');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '50px';
        cursorOutline.style.height = '50px';
        cursorOutline.style.borderColor = 'var(--secondary)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '32px';
        cursorOutline.style.height = '32px';
        cursorOutline.style.borderColor = 'var(--primary)';
      });
    });
  }

  /* ==========================================
     2. BACKGROUND PARTICLE CANVAS ENGINE
     ========================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.color = '#4f46e5';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            ctx.strokeStyle = `rgba(79, 70, 229, ${1 - distance / 110})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================
     3. MINOTAR MINECRAFT AVATAR FETCHING
     ========================================== */
  const staffAvatars = document.querySelectorAll('[data-mc-head]');
  staffAvatars.forEach((img) => {
    const username = img.getAttribute('data-mc-head');
    if (username) {
      img.src = `https://minotar.net/helm/${username}/100.png`;
      img.onerror = () => {
        img.src = 'https://minotar.net/helm/MHF_Steve/100.png';
      };
    }
  });

  /* ==========================================
     4. COPY SERVER IP BUTTON + COUNTER TRACKER
     ========================================== */
  const copyIpBtn = document.getElementById('copy-ip-btn');
  if (copyIpBtn) {
    copyIpBtn.addEventListener('click', () => {
      const serverIP = 'play.oderismc.net';

      // Update persistent copy count statistic
      const stats = DB.get(STORAGE_KEYS.STATS, { copyCount: 0 });
      stats.copyCount += 1;
      stats.lastCopied = new Date().toISOString();
      DB.set(STORAGE_KEYS.STATS, stats);

      navigator.clipboard.writeText(serverIP).then(() => {
        const originalText = copyIpBtn.innerText;
        copyIpBtn.innerText = 'IP Copied to Clipboard!';
        copyIpBtn.style.background = '#10b981';
        setTimeout(() => {
          copyIpBtn.innerText = originalText;
          copyIpBtn.style.background = '';
        }, 2500);
      }).catch(() => {
        alert(`Server IP: ${serverIP}`);
      });
    });
  }

  /* ==========================================
     5. PAYMENT MODAL SIMULATION & ORDER PERSISTENCE
     ========================================== */
  const modalOverlay = document.getElementById('payment-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalRankTitle = document.getElementById('modal-rank-title');
  const modalRankPrice = document.getElementById('modal-rank-price');
  const buyButtons = document.querySelectorAll('.buy-rank-btn');
  const paymentForm = document.getElementById('payment-form');
  const usernameInput = document.getElementById('mc-username');

  // Pre-fill username if previously stored in memory
  if (usernameInput) {
    const savedName = DB.get(STORAGE_KEYS.LAST_USERNAME, '');
    if (savedName) usernameInput.value = savedName;
  }

  buyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const rank = btn.getAttribute('data-rank');
      const price = btn.getAttribute('data-price');
      if (modalRankTitle && modalRankPrice && modalOverlay) {
        modalRankTitle.innerText = `Checkout [${rank}] Rank`;
        modalRankPrice.innerText = `Total Amount: $${price}`;
        modalOverlay.setAttribute('data-selected-rank', rank);
        modalOverlay.setAttribute('data-selected-price', price);
        modalOverlay.classList.add('active');
      }
    });
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('pay-submit-btn');

      if (usernameInput && submitBtn) {
        const username = usernameInput.value.trim();
        if (!username) return;

        const rank = modalOverlay.getAttribute('data-selected-rank') || 'Rank';
        const price = modalOverlay.getAttribute('data-selected-price') || '0.00';

        submitBtn.disabled = true;
        submitBtn.innerText = 'Processing Gateway...';

        setTimeout(() => {
          // Save last used username
          DB.set(STORAGE_KEYS.LAST_USERNAME, username);

          // Save order to persistent purchase log
          const newTransaction = {
            transactionId: 'ODR-' + Math.floor(100000 + Math.random() * 900000),
            username: username,
            rank: rank,
            price: price,
            timestamp: new Date().toISOString()
          };

          const purchases = DB.get(STORAGE_KEYS.PURCHASE_LOGS, []);
          purchases.push(newTransaction);
          DB.set(STORAGE_KEYS.PURCHASE_LOGS, purchases);

          alert(`Success! [${username}] has been credited with the ${rank} rank on play.oderismc.net.\n\nTransaction ID: ${newTransaction.transactionId}`);

          submitBtn.disabled = false;
          submitBtn.innerText = 'Complete Purchase';
          modalOverlay.classList.remove('active');
        }, 1500);
      }
    });
  }

  /* ==========================================
     6. GHOST AI v2.93 INTERACTIVE ENGINE (PERSISTENT CHAT)
     ========================================== */
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chipButtons = document.querySelectorAll('.chip');
  const clearChatBtn = document.getElementById('clear-chat-btn');

  const ghostKnowledge = [
    { keywords: ['ip', 'address', 'connect', 'join'], response: 'The official server IP is **play.oderismc.net**! Join us on version 1.16 through 1.20+.' },
    { keywords: ['vip', 'rank', 'mvp', 'oderis', 'god', 'store', 'perk'], response: 'Ranks range from VIP ($4.99) to GOD ($49.99). All ranks include /fly abilities, cosmetics, and priority server queue access.' },
    { keywords: ['owner', 'yuvraj', 'developer', 'yjdev'], response: 'OderisMC was created and built by lead developer YuvrajBudhwar under YJDEV STUDIOS.' },
    { keywords: ['bedwars', 'game', 'mode', 'pvp', 'skyblock'], response: 'We feature custom Bedwars with special knockback physics, fast-paced Skyblock, and custom aura-based combat mechanics!' },
    { keywords: ['staff', 'apply', 'admin', 'mod'], response: 'Staff applications open periodically on our official Discord community server.' },
    { keywords: ['history', 'purchases', 'orders', 'bought'], response: () => {
      const logs = DB.get(STORAGE_KEYS.PURCHASE_LOGS, []);
      if (logs.length === 0) return "You don't have any saved store purchases on this device yet!";
      const last = logs[logs.length - 1];
      return `Found ${logs.length} stored transaction(s). Latest purchase: [${last.rank}] for ${last.username} (ID: ${last.transactionId}).`;
    }}
  ];

  function addMessage(text, sender, saveToStorage = true) {
    if (!chatMessages) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerText = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (saveToStorage) {
      const currentHistory = DB.get(STORAGE_KEYS.CHAT_HISTORY, []);
      currentHistory.push({
        text: text,
        sender: sender,
        timestamp: new Date().toISOString()
      });
      DB.set(STORAGE_KEYS.CHAT_HISTORY, currentHistory);
    }
  }

  function loadSavedChatHistory() {
    const savedMessages = DB.get(STORAGE_KEYS.CHAT_HISTORY, []);
    if (savedMessages.length > 0 && chatMessages) {
      chatMessages.innerHTML = ''; // Clear default markup
      savedMessages.forEach(msg => {
        addMessage(msg.text, msg.sender, false);
      });
    }
  }

  function clearChatHistory() {
    DB.remove(STORAGE_KEYS.CHAT_HISTORY);
    if (chatMessages) {
      chatMessages.innerHTML = '';
      addMessage('Ghost AI v2.93 memory cleared. How can I help you today?', 'ai', false);
    }
  }

  function generateGhostResponse(userQuery) {
    const query = userQuery.toLowerCase();

    if (query === '/clear' || query === 'clear chat') {
      clearChatHistory();
      return null;
    }

    for (let k of ghostKnowledge) {
      if (k.keywords.some(kw => query.includes(kw))) {
        return typeof k.response === 'function' ? k.response() : k.response;
      }
    }
    return "Ghost AI v2.93: I am listening! You can ask me about the server IP (play.oderismc.net), rank pricing, game modes, your purchase history, or type '/clear' to reset this chat.";
  }

  function handleUserSubmit(message) {
    if (!message) return;
    addMessage(message, 'user', true);

    setTimeout(() => {
      const response = generateGhostResponse(message);
      if (response) {
        addMessage(response, 'ai', true);
      }
    }, 600);
  }

  // Restore previous chat memory upon page load
  loadSavedChatHistory();

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (query) {
        handleUserSubmit(query);
        chatInput.value = '';
      }
    });
  }

  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', clearChatHistory);
  }

  chipButtons.forEach((chip) => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query) {
        handleUserSubmit(query);
      }
    });
  });

});
