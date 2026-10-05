/* ======================================================
   ODERISMC - AUTH, COMMENTS, LIVE EDITING, EVENTS & RED CURSOR ENGINE
   ====================================================== */

/* --- 1. LOCAL STORAGE DATABASE & INIT --- */
function initLocalStorage() {
    if (!localStorage.getItem('oderis_users')) {
        localStorage.setItem('oderis_users', JSON.stringify([]));
    }

    if (!localStorage.getItem('oderis_comments')) {
        const defaultComments = [
            {
                id: 1,
                author: "Sakarw_al142",
                text: "Welcome to the official OderisMC website! Drop your comments and suggestions below!",
                time: "10 mins ago",
                likes: 12,
                likedBy: [],
                isPinned: true
            },
            {
                id: 2,
                author: "YUVRAJ_THELEGEND",
                text: "Sign-up & Comment persistence system is now live! Enjoy zero lag and safe storage.",
                time: "5 mins ago",
                likes: 8,
                likedBy: [],
                isPinned: false
            }
        ];
        localStorage.setItem('oderis_comments', JSON.stringify(defaultComments));
    }

    if (!localStorage.getItem('oderis_live_events')) {
        const defaultEvents = [
            {
                id: 101,
                title: "Cyber Bedwars Tournament",
                date: "Saturday @ 8:00 PM IST",
                desc: "1v1 Bedwars showdown with 500 Coins prize pool!",
                badge: "UPCOMING"
            }
        ];
        localStorage.setItem('oderis_live_events', JSON.stringify(defaultEvents));
    }

    if (!localStorage.getItem('oderis_site_edits')) {
        localStorage.setItem('oderis_site_edits', JSON.stringify({}));
    }
}

initLocalStorage();

/* --- HELPER DATA GETTERS & SETTERS --- */
function getUsers() {
    return JSON.parse(localStorage.getItem('oderis_users')) || [];
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('oderis_current_user')) || null;
}

function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.username === "YUVRAJ_THELEGEND";
}

function getComments() {
    return JSON.parse(localStorage.getItem('oderis_comments')) || [];
}

function saveComments(comments) {
    localStorage.setItem('oderis_comments', JSON.stringify(comments));
}

function getLiveEvents() {
    return JSON.parse(localStorage.getItem('oderis_live_events')) || [];
}

function saveLiveEvents(events) {
    localStorage.setItem('oderis_live_events', JSON.stringify(events));
}

/* --- 2. UPDATE AUTH UI & ADMIN BAR --- */
function updateUIAuthState() {
    const currentUser = getCurrentUser();
    const headerAuthContainer = document.getElementById('header-auth-container');
    const commentUserDisplay = document.getElementById('comment-active-user-display');
    const adminToolbar = document.getElementById('admin-toolbar');

    if (currentUser) {
        const adminBadge = isAdmin() ? `<span class="admin-tag-badge">ADMIN</span>` : '';
        if (headerAuthContainer) {
            headerAuthContainer.innerHTML = `
                <div class="user-profile-badge">
                    <div class="user-profile-avatar">
                        ${currentUser.username.charAt(0).toUpperCase()}
                    </div>
                    <span>${escapeHtml(currentUser.username)} ${adminBadge}</span>
                    <button class="logout-sm-btn" onclick="handleLogout()" title="Log Out">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            `;
        }

        if (commentUserDisplay) {
            commentUserDisplay.innerHTML = `
                <i class="fas fa-user-check" style="color: var(--neon-green);"></i>
                Posting as: <strong style="color:#fff;">${escapeHtml(currentUser.username)}</strong>
            `;
        }
    } else {
        if (headerAuthContainer) {
            headerAuthContainer.innerHTML = `
                <button class="header-auth-btn" onclick="openAuthModal('login')">
                    <i class="fas fa-user-lock"></i> SIGN IN / SIGN UP
                </button>
            `;
        }

        if (commentUserDisplay) {
            commentUserDisplay.innerHTML = `
                <i class="fas fa-info-circle"></i>
                Log in to post as a registered user!
            `;
        }
    }

    // Toggle Admin Toolbar
    if (adminToolbar) {
        adminToolbar.style.display = isAdmin() ? 'flex' : 'none';
    }

    renderLiveEvents();
    loadSiteEdits();
}

/* --- 3. AUTH MODAL TAB SWITCHER --- */
function switchAuthTab(tab) {
    playSound(400, 'sine', 0.1);
    const loginForm = document.getElementById('auth-login-form');
    const signupForm = document.getElementById('auth-signup-form');
    const adminForm = document.getElementById('auth-admin-form');
    
    const loginTabBtn = document.getElementById('tab-login-btn');
    const signupTabBtn = document.getElementById('tab-signup-btn');
    const adminTabBtn = document.getElementById('tab-admin-btn');

    if (loginForm) loginForm.style.display = (tab === 'login') ? 'block' : 'none';
    if (signupForm) signupForm.style.display = (tab === 'signup') ? 'block' : 'none';
    if (adminForm) adminForm.style.display = (tab === 'admin') ? 'block' : 'none';

    if (loginTabBtn) loginTabBtn.classList.toggle('active', tab === 'login');
    if (signupTabBtn) signupTabBtn.classList.toggle('active', tab === 'signup');
    if (adminTabBtn) adminTabBtn.classList.toggle('active', tab === 'admin');
}

function openAuthModal(tab = 'login') {
    switchAuthTab(tab);
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'grid';
}

/* --- 4. LOGIN & SIGNUP HANDLERS --- */
function handleSignupSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('signup-username');
    const passInput = document.getElementById('signup-password');
    const statusMsg = document.getElementById('signup-status-msg');

    if (!nameInput || !passInput || !statusMsg) return;

    const username = nameInput.value.trim();
    const password = passInput.value.trim();

    if (!username || !password) {
        statusMsg.className = 'auth-status-msg error';
        statusMsg.innerText = 'Please fill out all fields!';
        return;
    }

    const users = getUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        statusMsg.className = 'auth-status-msg error';
        statusMsg.innerText = 'Username already exists! Try logging in.';
        playSound(200, 'sawtooth', 0.2);
        return;
    }

    users.push({ username, password, joinedAt: new Date().toISOString() });
    localStorage.setItem('oderis_users', JSON.stringify(users));
    localStorage.setItem('oderis_current_user', JSON.stringify({ username }));

    statusMsg.className = 'auth-status-msg success';
    statusMsg.innerText = 'Account created successfully!';
    playSound(600, 'sine', 0.2);

    setTimeout(() => {
        closeModal('auth-modal');
        updateUIAuthState();
        renderComments();
    }, 800);
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('login-username');
    const passInput = document.getElementById('login-password');
    const statusMsg = document.getElementById('login-status-msg');

    if (!nameInput || !passInput || !statusMsg) return;

    const username = nameInput.value.trim();
    const password = passInput.value.trim();

    // Stealth Admin Check via Login tab
    if (username === "YUVRAJ_THELEGEND" && password === "@2192@2192@") {
        localStorage.setItem('oderis_current_user', JSON.stringify({ username: "YUVRAJ_THELEGEND" }));
        statusMsg.className = 'auth-status-msg success';
        statusMsg.innerText = 'Admin Login Authorized!';
        playSound(700, 'sine', 0.2);
        setTimeout(() => {
            closeModal('auth-modal');
            updateUIAuthState();
            renderComments();
        }, 800);
        return;
    }

    const users = getUsers();
    const match = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

    if (!match) {
        statusMsg.className = 'auth-status-msg error';
        statusMsg.innerText = 'Invalid username or password!';
        playSound(200, 'sawtooth', 0.2);
        return;
    }

    localStorage.setItem('oderis_current_user', JSON.stringify({ username: match.username }));
    statusMsg.className = 'auth-status-msg success';
    statusMsg.innerText = 'Login successful!';
    playSound(600, 'sine', 0.2);

    setTimeout(() => {
        closeModal('auth-modal');
        updateUIAuthState();
        renderComments();
    }, 800);
}

function handleAdminLoginSubmit(e) {
    e.preventDefault();
    const passInput = document.getElementById('admin-pass-key');
    const statusMsg = document.getElementById('admin-status-msg');

    if (!passInput || !statusMsg) return;

    if (passInput.value.trim() === "@2192@2192@") {
        localStorage.setItem('oderis_current_user', JSON.stringify({ username: "YUVRAJ_THELEGEND" }));
        statusMsg.className = 'auth-status-msg success';
        statusMsg.innerText = 'Admin Portal Access Granted!';
        playSound(750, 'sine', 0.25);

        setTimeout(() => {
            closeModal('auth-modal');
            passInput.value = '';
            statusMsg.innerText = '';
            updateUIAuthState();
            renderComments();
        }, 800);
    } else {
        statusMsg.className = 'auth-status-msg error';
        statusMsg.innerText = 'Incorrect Admin Passcode!';
        playSound(200, 'sawtooth', 0.25);
    }
}

function handleLogout() {
    playSound(300, 'sine', 0.15);
    localStorage.removeItem('oderis_current_user');
    updateUIAuthState();
    renderComments();
}

/* --- 5. COMMENTS SYSTEM (PERMISSIONS & PINNING) --- */
function renderComments() {
    const feed = document.getElementById('comments-feed-list');
    if (!feed) return;

    let comments = getComments();
    const currentUser = getCurrentUser();

    if (comments.length === 0) {
        feed.innerHTML = `<div style="text-align:center; color:var(--text-dim); padding:30px;">No comments yet. Be the first to post!</div>`;
        return;
    }

    // Sort pinned comments to the top
    comments.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    feed.innerHTML = comments.map(comment => {
        const isLiked = currentUser && comment.likedBy && comment.likedBy.includes(currentUser.username);
        
        // Strict Deletion Rule: Users can ONLY delete their own comment. Admin can delete any.
        const canDelete = currentUser && (currentUser.username === comment.author || isAdmin());

        return `
            <div class="comment-card ${comment.isPinned ? 'pinned-comment' : ''}">
                ${comment.isPinned ? `<div class="pinned-badge"><i class="fas fa-thumbtack"></i> PINNED BY ADMIN</div>` : ''}

                <div class="comment-header">
                    <div class="comment-author-box">
                        <div class="comment-avatar">
                            ${escapeHtml(comment.author).charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div class="comment-author-name">
                                ${escapeHtml(comment.author)}
                                ${comment.author === 'YUVRAJ_THELEGEND' ? `<span class="admin-mini-badge">ADMIN</span>` : ''}
                            </div>
                            <div class="comment-timestamp">${escapeHtml(comment.time)}</div>
                        </div>
                    </div>
                </div>

                <div class="comment-body-text">${escapeHtml(comment.text)}</div>

                <div class="comment-footer-actions">
                    <button class="comment-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikeComment(${comment.id})">
                        <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                        ${comment.likes || 0} Likes
                    </button>

                    ${isAdmin() ? `
                        <button class="comment-action-btn pin-btn" onclick="togglePinComment(${comment.id})">
                            <i class="fas fa-thumbtack"></i> ${comment.isPinned ? 'Unpin' : 'Pin'}
                        </button>
                    ` : ''}

                    ${canDelete ? `
                        <button class="comment-action-btn comment-delete-btn" onclick="deleteComment(${comment.id})">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function handlePostComment() {
    const textInput = document.getElementById('comment-input-text');
    if (!textInput) return;

    const text = textInput.value.trim();
    if (!text) {
        alert('Please type a comment before posting!');
        return;
    }

    const currentUser = getCurrentUser();
    const authorName = currentUser ? currentUser.username : 'Guest Player';
    const comments = getComments();

    const newComment = {
        id: Date.now(),
        author: authorName,
        text: text,
        time: 'Just now',
        likes: 0,
        likedBy: [],
        isPinned: false
    };

    comments.unshift(newComment);
    saveComments(comments);
    textInput.value = '';
    playSound(550, 'triangle', 0.15);
    renderComments();
}

function toggleLikeComment(commentId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        openAuthModal('login');
        return;
    }

    const comments = getComments();
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    if (!comment.likedBy) comment.likedBy = [];
    const idx = comment.likedBy.indexOf(currentUser.username);

    if (idx > -1) {
        comment.likedBy.splice(idx, 1);
        comment.likes = Math.max(0, comment.likes - 1);
    } else {
        comment.likedBy.push(currentUser.username);
        comment.likes = (comment.likes || 0) + 1;
        playSound(650, 'sine', 0.1);
    }

    saveComments(comments);
    renderComments();
}

function togglePinComment(commentId) {
    if (!isAdmin()) return;
    const comments = getComments();
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        comment.isPinned = !comment.isPinned;
        saveComments(comments);
        renderComments();
        playSound(600, 'sine', 0.15);
    }
}

function deleteComment(commentId) {
    const currentUser = getCurrentUser();
    const comments = getComments();
    const target = comments.find(c => c.id === commentId);

    if (!target) return;

    // Permissions check
    if (!isAdmin() && (!currentUser || currentUser.username !== target.author)) {
        alert("You can only delete your own comments!");
        return;
    }

    if (!confirm('Are you sure you want to delete this comment?')) return;

    const filtered = comments.filter(c => c.id !== commentId);
    saveComments(filtered);
    playSound(300, 'sawtooth', 0.15);
    renderComments();
}

/* --- 6. LIVE EDITING ENGINE (NO-FILE SITE EDITING) --- */
let isEditModeActive = false;

function toggleAdminEditMode() {
    if (!isAdmin()) return;

    isEditModeActive = !isEditModeActive;
    const editBtn = document.getElementById('admin-edit-toggle-btn');

    if (editBtn) {
        editBtn.innerText = isEditModeActive ? "DISABLE LIVE EDIT" : "ENABLE LIVE EDIT";
        editBtn.classList.toggle('active', isEditModeActive);
    }

    const editableElements = document.querySelectorAll('[data-editable-id]');
    editableElements.forEach(el => {
        el.contentEditable = isEditModeActive ? "true" : "false";
        el.classList.toggle('editable-active', isEditModeActive);

        if (isEditModeActive) {
            el.onblur = function () {
                saveSiteEdits();
            };
        }
    });

    if (isEditModeActive) {
        alert("Live Editing Enabled! Click on site titles, hero texts, or store items to edit them instantly.");
    } else {
        saveSiteEdits();
        alert("Live Edits Saved!");
    }
}

function saveSiteEdits() {
    const edits = {};
    document.querySelectorAll('[data-editable-id]').forEach(el => {
        const id = el.getAttribute('data-editable-id');
        edits[id] = el.innerHTML;
    });
    localStorage.setItem('oderis_site_edits', JSON.stringify(edits));
}

function loadSiteEdits() {
    const edits = JSON.parse(localStorage.getItem('oderis_site_edits')) || {};
    Object.keys(edits).forEach(id => {
        const el = document.querySelector(`[data-editable-id="${id}"]`);
        if (el && edits[id]) {
            el.innerHTML = edits[id];
        }
    });
}

/* --- 7. LIVE EVENTS ENGINE --- */
function renderLiveEvents() {
    const container = document.getElementById('live-events-container');
    if (!container) return;

    const events = getLiveEvents();

    if (events.length === 0) {
        container.innerHTML = `<p style="color:var(--text-dim); text-align:center;">No upcoming live events scheduled.</p>`;
        return;
    }

    container.innerHTML = events.map(ev => `
        <div class="event-card">
            <div class="event-badge">${escapeHtml(ev.badge || 'EVENT')}</div>
            <h3 class="event-title">${escapeHtml(ev.title)}</h3>
            <div class="event-time"><i class="far fa-clock"></i> ${escapeHtml(ev.date)}</div>
            <p class="event-desc">${escapeHtml(ev.desc)}</p>
            ${isAdmin() ? `
                <button class="event-delete-btn" onclick="deleteLiveEvent(${ev.id})">
                    <i class="fas fa-trash-alt"></i> Remove Event
                </button>
            ` : ''}
        </div>
    `).join('');
}

function openAddEventModal() {
    if (!isAdmin()) return;
    const modal = document.getElementById('event-modal');
    if (modal) modal.style.display = 'grid';
}

function handleAddLiveEventSubmit(e) {
    e.preventDefault();
    if (!isAdmin()) return;

    const title = document.getElementById('event-title-input').value.trim();
    const date = document.getElementById('event-date-input').value.trim();
    const desc = document.getElementById('event-desc-input').value.trim();
    const badge = document.getElementById('event-badge-input').value.trim() || 'LIVE';

    if (!title || !date) {
        alert("Please specify at least an event title and time!");
        return;
    }

    const events = getLiveEvents();
    events.unshift({ id: Date.now(), title, date, desc, badge });
    saveLiveEvents(events);

    closeModal('event-modal');
    renderLiveEvents();
    playSound(600, 'sine', 0.2);
}

function deleteLiveEvent(eventId) {
    if (!isAdmin()) return;
    if (!confirm("Delete this Live Event?")) return;

    const events = getLiveEvents().filter(e => e.id !== eventId);
    saveLiveEvents(events);
    renderLiveEvents();
    playSound(300, 'sawtooth', 0.15);
}

/* --- 8. RED CURSOR FOLLOW ENGINE --- */
document.addEventListener('DOMContentLoaded', () => {
    const redCursor = document.getElementById('red-cursor');

    if (redCursor) {
        window.addEventListener('mousemove', (e) => {
            redCursor.style.left = e.clientX + 'px';
            redCursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mousedown', () => {
            redCursor.classList.add('clicking');
        });

        document.addEventListener('mouseup', () => {
            redCursor.classList.remove('clicking');
        });

        const interactables = 'button, a, input, select, textarea, .clickable, [role="button"], .nav-btn, .action-btn';
        document.querySelectorAll(interactables).forEach(el => {
            el.addEventListener('mouseenter', () => redCursor.classList.add('pointer'));
            el.addEventListener('mouseleave', () => redCursor.classList.remove('pointer'));
        });
    }

    updateUIAuthState();
    renderComments();
});

/* --- 9. UTILITIES & AUDIO --- */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function switchPage(pageId) {
    playSound(400, 'sine', 0.1);
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) targetPage.classList.add('active');

    const targetNav = document.getElementById('nav-' + pageId);
    if (targetNav) targetNav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openGhostAIPage() {
    switchPage('ghost-ai');
    playSound(600, 'sawtooth', 0.15);
}

function closeModal(id) {
    playSound(300, 'sine', 0.1);
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

let audioCtx = null;
function playSound(freq, type = 'sine', duration = 0.1) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) { }
}

function copyIP() {
    navigator.clipboard.writeText('play.oderismc.fun').then(() => {
        playSound(600, 'triangle', 0.15);
        alert('Server IP (play.oderismc.fun) copied to clipboard!');
    });
}
