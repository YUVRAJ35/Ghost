/* ==========================================
   ODERISMC CYBER PORTAL - INTERACTIVITY
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. CUSTOM DUAL CURSOR LOGIC --- */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            // Instant dot tracking
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            
            // Slight delay on the ring for a fluid dragging effect
            setTimeout(() => {
                cursorRing.style.left = `${e.clientX}px`;
                cursorRing.style.top = `${e.clientY}px`;
            }, 60);
        });

        // Trigger hover state on buttons, links, and inputs
        const interactives = document.querySelectorAll('button, a, input');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    /* --- 2. COPY IP TO CLIPBOARD --- */
    const copyBtn = document.querySelector('.copy-btn');
    const ipTextElement = document.querySelector('.ip-text');

    if (copyBtn && ipTextElement) {
        copyBtn.addEventListener('click', () => {
            const ip = ipTextElement.textContent;
            navigator.clipboard.writeText(ip).then(() => {
                const originalText = copyBtn.innerText;
                copyBtn.innerText = 'IP COPIED!';
                copyBtn.style.background = '#fff'; // Flash white
                
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                    copyBtn.style.background = ''; // Reset to CSS default
                }, 2000);
            });
        });
    }

    /* --- 3. PAYMENT MODAL LOGIC --- */
    const buyBtns = document.querySelectorAll('.buy-btn');
    const modal = document.querySelector('.modal-overlay');
    const closeBtn = document.querySelector('.modal-close-btn');

    if (modal) {
        // Open modal on buy button click
        buyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'grid'; // CSS uses place-items: center
            });
        });

        // Close modal on X button
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close modal when clicking outside the card
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    /* --- 4. LIVE MINECRAFT AVATAR FETCH (Floating Pill) --- */
    const loginInput = document.querySelector('.login-input');
    const loginAvatar = document.querySelector('.login-avatar');

    if (loginInput && loginAvatar) {
        const updateAvatar = () => {
            const username = loginInput.value.trim();
            if (username.length > 2) {
                // Uses Minotar API to fetch the 3D head of the player
                loginAvatar.src = `https://minotar.net/helm/${username}/32.png`;
            }
        };

        // Update when user clicks away
        loginInput.addEventListener('blur', updateAvatar);
        
        // Update when user presses Enter
        loginInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                updateAvatar();
            }
        });
    }

    /* --- 5. CYBER PARTICLE BACKGROUND (Canvas) --- */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * -1 - 0.5; // Drift upwards
                // Mix of cyber blue and cyan colors
                this.color = Math.random() > 0.5 ? 'rgba(0, 243, 255, 0.4)' : 'rgba(0, 102, 255, 0.3)';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Reset to bottom if it floats off top
                if (this.y < 0) {
                    this.y = height;
                    this.x = Math.random() * width;
                }
                // Wrap horizontally
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            let particleCount = Math.floor((width * height) / 15000); // Scale count with screen size
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }
});
