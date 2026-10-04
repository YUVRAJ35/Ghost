/* ======================================================
   ODERISMC - AUTH, COMMENTS, NAVIGATION & UI ENGINE
   ====================================================== */


/* ======================================================
   1. LOCAL STORAGE DATABASE & AUTH SYSTEM
   ====================================================== */

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
                likedBy: []
            },
            {
                id: 2,
                author: "YUVRAJ_THELEGEND",
                text: "Sign-up & Comment persistence system is now live! Enjoy zero lag and safe storage.",
                time: "5 mins ago",
                likes: 8,
                likedBy: []
            }
        ];

        localStorage.setItem(
            'oderis_comments',
            JSON.stringify(defaultComments)
        );
    }
}

initLocalStorage();


function getUsers() {
    return JSON.parse(
        localStorage.getItem('oderis_users')
    ) || [];
}


function getCurrentUser() {
    return JSON.parse(
        localStorage.getItem('oderis_current_user')
    ) || null;
}


function getComments() {
    return JSON.parse(
        localStorage.getItem('oderis_comments')
    ) || [];
}


function saveComments(comments) {
    localStorage.setItem(
        'oderis_comments',
        JSON.stringify(comments)
    );
}


/* ======================================================
   2. UPDATE AUTH UI
   ====================================================== */

function updateUIAuthState() {
    const currentUser = getCurrentUser();

    const headerAuthContainer =
        document.getElementById('header-auth-container');

    const floatingLabel =
        document.getElementById('floating-user-label');

    const floatingBtn =
        document.getElementById('floating-auth-btn');

    const commentUserDisplay =
        document.getElementById('comment-active-user-display');


    if (currentUser) {

        /* USER LOGGED IN */

        if (headerAuthContainer) {
            headerAuthContainer.innerHTML = `
                <div class="user-profile-badge">

                    <div class="user-profile-avatar">
                        ${currentUser.username.charAt(0).toUpperCase()}
                    </div>

                    <span>
                        ${escapeHtml(currentUser.username)}
                    </span>

                    <button
                        class="logout-sm-btn"
                        onclick="handleLogout()"
                        title="Log Out"
                    >
                        <i class="fas fa-sign-out-alt"></i>
                    </button>

                </div>
            `;
        }


        if (floatingLabel) {
            floatingLabel.innerText =
                currentUser.username;
        }


        if (floatingBtn) {
            floatingBtn.innerText = "LOGOUT";
            floatingBtn.onclick = handleLogout;
        }


        if (commentUserDisplay) {
            commentUserDisplay.innerHTML = `
                <i
                    class="fas fa-user-check"
                    style="color: var(--neon-green);"
                ></i>

                Posting as:
                <strong style="color:#fff;">
                    ${escapeHtml(currentUser.username)}
                </strong>
            `;
        }

    } else {

        /* GUEST */

        if (headerAuthContainer) {
            headerAuthContainer.innerHTML = `
                <button
                    class="header-auth-btn"
                    onclick="openAuthModal('login')"
                >
                    <i class="fas fa-user-lock"></i>
                    SIGN IN / SIGN UP
                </button>
            `;
        }


        if (floatingLabel) {
            floatingLabel.innerText =
                "Guest Player";
        }


        if (floatingBtn) {
            floatingBtn.innerText = "ACCOUNT";
            floatingBtn.onclick = () =>
                openAuthModal('login');
        }


        if (commentUserDisplay) {
            commentUserDisplay.innerHTML = `
                <i class="fas fa-info-circle"></i>
                Log in to post as a registered user!
            `;
        }
    }
}


/* ======================================================
   3. AUTH MODAL TAB SWITCHER
   ====================================================== */

function switchAuthTab(tab) {

    playSound(400, 'sine', 0.1);

    const loginForm =
        document.getElementById('auth-login-form');

    const signupForm =
        document.getElementById('auth-signup-form');

    const loginTabBtn =
        document.getElementById('tab-login-btn');

    const signupTabBtn =
        document.getElementById('tab-signup-btn');


    if (!loginForm || !signupForm) return;


    const loginStatus =
        document.getElementById('login-status-msg');

    const signupStatus =
        document.getElementById('signup-status-msg');


    if (loginStatus) loginStatus.innerText = '';
    if (signupStatus) signupStatus.innerText = '';


    if (tab === 'login') {

        loginForm.style.display = 'block';
        signupForm.style.display = 'none';

        if (loginTabBtn) {
            loginTabBtn.classList.add('active');
        }

        if (signupTabBtn) {
            signupTabBtn.classList.remove('active');
        }

    } else {

        loginForm.style.display = 'none';
        signupForm.style.display = 'block';

        if (signupTabBtn) {
            signupTabBtn.classList.add('active');
        }

        if (loginTabBtn) {
            loginTabBtn.classList.remove('active');
        }
    }
}


/* ======================================================
   4. OPEN AUTH MODAL
   ====================================================== */

function openAuthModal(tab = 'login') {

    switchAuthTab(tab);

    const modal =
        document.getElementById('auth-modal');

    if (modal) {
        modal.style.display = 'grid';
    }
}


/* ======================================================
   5. SIGN UP
   ====================================================== */

function handleSignupSubmit(e) {

    e.preventDefault();

    const nameInput =
        document.getElementById('signup-username');

    const passInput =
        document.getElementById('signup-password');

    const statusMsg =
        document.getElementById('signup-status-msg');


    if (!nameInput || !passInput || !statusMsg) {
        return;
    }


    const username =
        nameInput.value.trim();

    const password =
        passInput.value.trim();


    if (!username || !password) {

        statusMsg.className =
            'auth-status-msg error';

        statusMsg.innerText =
            'Please fill out all fields!';

        return;
    }


    const users = getUsers();


    const existing =
        users.find(
            user =>
                user.username.toLowerCase() ===
                username.toLowerCase()
        );


    if (existing) {

        statusMsg.className =
            'auth-status-msg error';

        statusMsg.innerText =
            'Username already exists! Try logging in.';

        playSound(200, 'sawtooth', 0.2);

        return;
    }


    const newUser = {

        username: username,

        password: password,

        joinedAt:
            new Date().toISOString()
    };


    users.push(newUser);


    localStorage.setItem(
        'oderis_users',
        JSON.stringify(users)
    );


    localStorage.setItem(
        'oderis_current_user',
        JSON.stringify({
            username: username
        })
    );


    statusMsg.className =
        'auth-status-msg success';

    statusMsg.innerText =
        'Account created successfully! Logging in...';


    playSound(600, 'sine', 0.2);


    setTimeout(() => {

        closeModal('auth-modal');

        updateUIAuthState();

        renderComments();

    }, 800);
}


/* ======================================================
   6. LOGIN
   ====================================================== */

function handleLoginSubmit(e) {

    e.preventDefault();


    const nameInput =
        document.getElementById('login-username');

    const passInput =
        document.getElementById('login-password');

    const statusMsg =
        document.getElementById('login-status-msg');


    if (!nameInput || !passInput || !statusMsg) {
        return;
    }


    const username =
        nameInput.value.trim();

    const password =
        passInput.value.trim();


    const users = getUsers();


    const match =
        users.find(
            user =>
                user.username.toLowerCase() ===
                username.toLowerCase() &&
                user.password === password
        );


    if (!match) {

        statusMsg.className =
            'auth-status-msg error';

        statusMsg.innerText =
            'Invalid username or password!';

        playSound(200, 'sawtooth', 0.2);

        return;
    }


    localStorage.setItem(
        'oderis_current_user',
        JSON.stringify({
            username: match.username
        })
    );


    statusMsg.className =
        'auth-status-msg success';

    statusMsg.innerText =
        'Login successful!';


    playSound(600, 'sine', 0.2);


    setTimeout(() => {

        closeModal('auth-modal');

        updateUIAuthState();

        renderComments();

    }, 800);
}


/* ======================================================
   7. LOGOUT
   ====================================================== */

function handleLogout() {

    playSound(300, 'sine', 0.15);

    localStorage.removeItem(
        'oderis_current_user'
    );

    updateUIAuthState();

    renderComments();
}


/* ======================================================
   8. COMMENTS SYSTEM
   ====================================================== */

function renderComments() {

    const feed =
        document.getElementById(
            'comments-feed-list'
        );


    if (!feed) return;


    const comments = getComments();

    const currentUser =
        getCurrentUser();


    if (comments.length === 0) {

        feed.innerHTML = `
            <div
                style="
                    text-align:center;
                    color:var(--text-dim);
                    padding:30px;
                "
            >
                No comments yet.
                Be the first to post!
            </div>
        `;

        return;
    }


    feed.innerHTML =
        comments.map(comment => {

            const isLiked =
                currentUser &&
                comment.likedBy &&
                comment.likedBy.includes(
                    currentUser.username
                );


            const canDelete =
                currentUser &&
                (
                    currentUser.username ===
                    comment.author ||

                    currentUser.username ===
                    'YUVRAJ_THELEGEND'
                );


            return `
                <div class="comment-card">

                    <div class="comment-header">

                        <div class="comment-author-box">

                            <div class="comment-avatar">
                                ${escapeHtml(
                                    comment.author
                                ).charAt(0).toUpperCase()}
                            </div>

                            <div>

                                <div
                                    class="comment-author-name"
                                >
                                    ${escapeHtml(
                                        comment.author
                                    )}
                                </div>

                                <div
                                    class="comment-timestamp"
                                >
                                    ${escapeHtml(
                                        comment.time
                                    )}
                                </div>

                            </div>

                        </div>

                    </div>


                    <div class="comment-body-text">
                        ${escapeHtml(comment.text)}
                    </div>


                    <div class="comment-footer-actions">

                        <button
                            class="
                                comment-action-btn
                                ${isLiked ? 'liked' : ''}
                            "
                            onclick="
                                toggleLikeComment(
                                    ${comment.id}
                                )
                            "
                        >

                            <i
                                class="
                                    ${isLiked
                                        ? 'fas'
                                        : 'far'
                                    }
                                    fa-heart
                                "
                            ></i>

                            ${comment.likes || 0}
                            Likes

                        </button>


                        ${
                            canDelete
                                ? `
                                    <button
                                        class="
                                            comment-action-btn
                                            comment-delete-btn
                                        "
                                        onclick="
                                            deleteComment(
                                                ${comment.id}
                                            )
                                        "
                                    >
                                        <i
                                            class="
                                                fas
                                                fa-trash-alt
                                            "
                                        ></i>

                                        Delete
                                    </button>
                                `
                                : ''
                        }

                    </div>

                </div>
            `;

        }).join('');
}


/* ======================================================
   9. POST COMMENT
   ====================================================== */

function handlePostComment() {

    const textInput =
        document.getElementById(
            'comment-input-text'
        );


    if (!textInput) return;


    const text =
        textInput.value.trim();


    if (!text) {

        alert(
            'Please type a comment before posting!'
        );

        return;
    }


    const currentUser =
        getCurrentUser();


    const authorName =
        currentUser
            ? currentUser.username
            : 'Guest Player';


    const comments =
        getComments();


    const newComment = {

        id: Date.now(),

        author: authorName,

        text: text,

        time: 'Just now',

        likes: 0,

        likedBy: []

    };


    comments.unshift(newComment);


    saveComments(comments);


    textInput.value = '';


    playSound(
        550,
        'triangle',
        0.15
    );


    renderComments();
}


/* ======================================================
   10. LIKE / UNLIKE COMMENT
   ====================================================== */

function toggleLikeComment(commentId) {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        openAuthModal('login');

        return;
    }


    const comments =
        getComments();


    const comment =
        comments.find(
            c => c.id === commentId
        );


    if (!comment) return;


    if (!comment.likedBy) {
        comment.likedBy = [];
    }


    const userIndex =
        comment.likedBy.indexOf(
            currentUser.username
        );


    if (userIndex > -1) {

        /* UNLIKE */

        comment.likedBy.splice(
            userIndex,
            1
        );

        comment.likes =
            Math.max(
                0,
                comment.likes - 1
            );

    } else {

        /* LIKE */

        comment.likedBy.push(
            currentUser.username
        );

        comment.likes =
            (comment.likes || 0) + 1;

        playSound(
            650,
            'sine',
            0.1
        );
    }


    saveComments(comments);

    renderComments();
}


/* ======================================================
   11. DELETE COMMENT
   ====================================================== */

function deleteComment(commentId) {

    if (
        !confirm(
            'Are you sure you want to delete this comment?'
        )
    ) {
        return;
    }


    let comments =
        getComments();


    comments =
        comments.filter(
            comment =>
                comment.id !== commentId
        );


    saveComments(comments);


    playSound(
        300,
        'sawtooth',
        0.15
    );


    renderComments();
}


/* ======================================================
   12. HTML ESCAPING
   ====================================================== */

function escapeHtml(str) {

    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


/* ======================================================
   13. PAGE NAVIGATION
   ====================================================== */

function switchPage(pageId) {

    playSound(
        400,
        'sine',
        0.1
    );


    document
        .querySelectorAll('.page-view')
        .forEach(page => {
            page.classList.remove('active');
        });


    document
        .querySelectorAll('.nav-btn')
        .forEach(button => {
            button.classList.remove('active');
        });


    const targetPage =
        document.getElementById(
            'page-' + pageId
        );


    if (targetPage) {
        targetPage.classList.add('active');
    }


    const targetNav =
        document.getElementById(
            'nav-' + pageId
        );


    if (targetNav) {
        targetNav.classList.add('active');
    }


    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


function openGhostAIPage() {

    switchPage('ghost-ai');

    playSound(
        600,
        'sawtooth',
        0.15
    );
}


/* ======================================================
   14. MODAL CLOSE
   ====================================================== */

function closeModal(id) {

    playSound(
        300,
        'sine',
        0.1
    );


    const modal =
        document.getElementById(id);


    if (modal) {
        modal.style.display = 'none';
    }
}


/* ======================================================
   15. AUDIO ENGINE
   ====================================================== */

let audioCtx = null;


function getAudioContext() {

    if (!audioCtx) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return null;

        audioCtx =
            new AudioContext();
    }

    return audioCtx;
}


function playSound(
    freq,
    type = 'sine',
    duration = 0.1
) {

    try {

        const ctx =
            getAudioContext();


        if (!ctx) return;


        if (ctx.state === 'suspended') {
            ctx.resume();
        }


        const osc =
            ctx.createOscillator();

        const gain =
            ctx.createGain();


        osc.type = type;

        osc.frequency.setValueAtTime(
            freq,
            ctx.currentTime
        );


        gain.gain.setValueAtTime(
            0.08,
            ctx.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + duration
        );


        osc.connect(gain);

        gain.connect(
            ctx.destination
        );


        osc.start();

        osc.stop(
            ctx.currentTime + duration
        );

    } catch (error) {

        console.warn(
            'Audio unavailable:',
            error
        );
    }
}


/* ======================================================
   16. COPY SERVER IP
   ====================================================== */

function copyIP() {

    navigator.clipboard
        .writeText(
            'play.oderismc.fun'
        )
        .then(() => {

            playSound(
                600,
                'triangle',
                0.15
            );

            alert(
                'Server IP (play.oderismc.fun) copied to clipboard!'
            );

        })
        .catch(() => {

            alert(
                'Could not copy automatically. IP: play.oderismc.fun'
            );
        });
}


/* ======================================================
   17. GHOST AI KNOWLEDGE
   ====================================================== */

const ghostKnowledge = {

    owners:
        "👑 Server Owners: Sakarw_al142, King_Oderis, Ayushggs. Developer: YUVRAJ_THELEGEND",

    ip:
        "🎮 Java IP: play.oderismc.fun | Bedrock Port: 19142",

    ranks:
        "💎 Ranks start from ₹30/month (Hero Rank) up to ₹250/month (Oderis God Rank)."

};


/* ======================================================
   18. GHOST AI INTERACTIVE HANDLER
   ====================================================== */

function askGhostAI(key) {

    const feed =
        document.getElementById(
            'ghost-chat-feed'
        );


    if (!feed) return;


    const userMsg =
        document.createElement('div');


    userMsg.className =
        'ghost-msg user';


    userMsg.innerHTML = `
        <div class="ghost-msg-bubble">
            ${escapeHtml(
                key.toUpperCase()
            )} Query
        </div>
    `;


    feed.appendChild(userMsg);


    setTimeout(() => {

        const aiMsg =
            document.createElement('div');


        aiMsg.className =
            'ghost-msg ai';


        aiMsg.innerHTML = `

            <div
                class="ghost-avatar"
                style="
                    width:32px;
                    height:32px;
                    font-size:16px;
                "
            >
                👻
            </div>

            <div class="ghost-msg-bubble">

                <strong>
                    GHOST AI:
                </strong>

                ${escapeHtml(
                    ghostKnowledge[key] ||
                    "I don't have details on that topic yet."
                )}

            </div>
        `;


        feed.appendChild(aiMsg);


        feed.scrollTop =
            feed.scrollHeight;

    }, 200);
}


/* ======================================================
   19. BACKGROUND PARTICLES
   ====================================================== */

const canvas =
    document.getElementById(
        'bg-canvas'
    );


if (canvas) {

    const ctx =
        canvas.getContext('2d');


    function resizeCanvas() {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;
    }


    resizeCanvas();


    window.addEventListener(
        'resize',
        resizeCanvas
    );


    const particles =
        Array.from(
            { length: 40 },
            () => ({

                x:
                    Math.random() *
                    canvas.width,

                y:
                    Math.random() *
                    canvas.height,

                size:
                    Math.random() *
                    2 + 1,

                speedX:
                    (Math.random() - 0.5) *
                    0.5,

                speedY:
                    (Math.random() - 0.5) *
                    0.5,

                opacity:
                    Math.random() *
                    0.5 + 0.2

            })
        );


    function animateParticles() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        particles.forEach(p => {

            p.x += p.speedX;

            p.y += p.speedY;


            if (p.x < 0)
                p.x = canvas.width;

            if (p.x > canvas.width)
                p.x = 0;

            if (p.y < 0)
                p.y = canvas.height;

            if (p.y > canvas.height)
                p.y = 0;


            ctx.fillStyle =
                `rgba(
                    0,
                    217,
                    255,
                    ${p.opacity}
                )`;


            ctx.beginPath();


            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );


            ctx.fill();

        });


        requestAnimationFrame(
            animateParticles
        );
    }


    animateParticles();
}


/* ======================================================
   20. INITIALIZATION
   ====================================================== */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        updateUIAuthState();

        renderComments();

    }
);
