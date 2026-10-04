/* ==========================================
   1. DOM READY & INITIALIZATION
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initForms();
  initCardInteractions();
});

/* ==========================================
   2. THEME / DARK MODE TOGGLE
   ========================================== */
function initTheme() {
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', dark);
  }

  // Example event listener for a theme toggle button (id="theme-toggle")
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

/* ==========================================
   3. MOBILE NAVIGATION TOGGLE
   ========================================== */
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================
   4. FORM HANDLING & VALIDATION
   ========================================== */
function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm(form)) return;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        // Replace with your API endpoint
        console.log('Submitting payload:', data);
        
        // Simulating async API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        alert('Form submitted successfully!');
        form.reset();
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required]');

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });

  return isValid;
}

/* ==========================================
   5. DYNAMIC CARD RENDERER
   ========================================== */
export function createCard({ title, description, badgeText, linkUrl }) {
  const card = document.createElement('article');
  card.className = 'card';

  card.innerHTML = `
    ${badgeText ? `<span class="badge">${badgeText}</span>` : ''}
    <h3 class="card-title">${title}</h3>
    <p class="card-body">${description}</p>
    ${linkUrl ? `<a href="${linkUrl}" class="btn btn-primary" style="margin-top: 1rem;">Learn More</a>` : ''}
  `;

  return card;
}

function initCardInteractions() {
  const container = document.getElementById('card-container');
  if (!container) return;

  // Example dataset render
  const sampleData = [
    { title: 'Project One', description: 'Interactive dashboard interface.', badgeText: 'New', linkUrl: '#' },
    { title: 'Project Two', description: 'RESTful API backend setup.', badgeText: 'Updated', linkUrl: '#' },
  ];

  sampleData.forEach((item) => {
    const cardEl = createCard(item);
    container.appendChild(cardEl);
  });
}
