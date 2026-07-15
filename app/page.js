'use client';

import { useEffect } from 'react';

export default function App() {
  /* ════════════════════════════════════════════════════════════
     All original script.js behaviour, ported into a single
     mount-time effect. Logic is unchanged — only wrapped so it
     runs after React has rendered the DOM, and cleaned up on
     unmount so nothing double-registers in dev/StrictMode.
     We changed the API URLs from http://localhost:7006/send-* to
     relative /api/send-* endpoints.
  ════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');

    let W, H, stars = [], orbs = [], raf;

    function resizeCanvas() {
      const inv = document.getElementById('inv');
      W = canvas.width = window.innerWidth;
      H = canvas.height = Math.max(inv.scrollHeight, window.innerHeight);
      canvas.style.height = H + 'px';
    }

    function initStars() {
      stars = [];
      const count = Math.floor((W * H) / 9000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.4 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.007 + 0.002,
        });
      }
    }

    function initOrbs() {
      orbs = [];
      const count = Math.min(34, Math.floor(W / 26));
      for (let i = 0; i < count; i++) {
        orbs.push({
          cx: Math.random() * W, cy: Math.random() * H * 0.6 + H * 0.1,
          r: Math.random() * 1.2 + 0.4,
          vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.20,
          phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.004 + 0.001,
          wx: (Math.random() - 0.5) * 55, wy: (Math.random() - 0.5) * 38,
          wPhX: Math.random() * Math.PI * 2, wPhY: Math.random() * Math.PI * 2,
          wSp: Math.random() * 0.0006 + 0.0002,
        });
      }
    }

    function draw(ts) {
      ctx.clearRect(0, 0, W, H);
      const t = ts * 0.001;

      for (const s of stars) {
        const op = 0.12 + 0.55 * ((Math.sin(t * s.speed * 60 + s.phase) + 1) / 2);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(27,58,58,${op * 0.6})`;
        ctx.fill();
      }

      for (const o of orbs) {
        const wobX = Math.sin(t * o.wSp * 60 + o.wPhX) * o.wx;
        const wobY = Math.cos(t * o.wSp * 40 + o.wPhY) * o.wy;
        o.cx += o.vx + wobX * 0.004;
        o.cy += o.vy + wobY * 0.003;
        if (o.cx < -40) o.cx = W + 40;
        if (o.cx > W + 40) o.cx = -40;
        if (o.cy < -40) o.cy = H + 40;
        if (o.cy > H + 40) o.cy = -40;
      }

      const LINK_DIST = Math.min(W * 0.22, 160);
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const a = orbs[i], b = orbs[j];
          const dx = a.cx - b.cx, dy = a.cy - b.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(a.cx, a.cy);
            ctx.lineTo(b.cx, b.cy);
            ctx.strokeStyle = `rgba(27,58,58,${(1 - dist / LINK_DIST) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const o of orbs) {
        const pulse = 0.4 + 0.5 * ((Math.sin(t * o.speed * 60 + o.phase) + 1) / 2);
        const grd = ctx.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, o.r * 5);
        grd.addColorStop(0, `rgba(27,58,58,${0.35 * pulse})`);
        grd.addColorStop(0.4, `rgba(27,58,58,${0.10 * pulse})`);
        grd.addColorStop(1, 'rgba(27,58,58,0)');
        ctx.beginPath();
        ctx.arc(o.cx, o.cy, o.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(o.cx, o.cy, o.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(27,58,58,${0.75 * pulse})`;
        ctx.fill();
      }

      const cx = W / 2, cy = H * 0.28;
      for (let ring = 1; ring <= 3; ring++) {
        const rOp = 0.06 + 0.04 * Math.sin(t * 0.5 + ring);
        ctx.beginPath();
        ctx.arc(cx, cy, ring * 90 + Math.sin(t * 0.3) * 8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(27,58,58,${rOp})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    function startCanvas() {
      if (raf) cancelAnimationFrame(raf);
      resizeCanvas();
      initStars();
      initOrbs();
      raf = requestAnimationFrame(draw);
    }

    startCanvas();
    window.addEventListener('resize', startCanvas);

    /* ─── Floating petals ─── */
    const petalTimeouts = [];
    for (let i = 0; i < 12; i++) {
      petalTimeouts.push(setTimeout(() => {
        const p = document.createElement('div');
        p.className = 'petal';
        const size = 6 + Math.random() * 6;
        p.style.cssText = [
          `left:${Math.random() * 100}%`,
          `top:${55 + Math.random() * 45}%`,
          `animation-delay:${Math.random() * 6}s`,
          `animation-duration:${5 + Math.random() * 5}s`,
          `width:${size}px`, `height:${size}px`,
          `transform:rotate(${Math.random() * 360}deg)`,
        ].join(';');
        document.getElementById('inv').appendChild(p);
      }, i * 320));
    }

    /* ─── Splash → Main ─── */
    let splashTimeout;
    function handleEnter() {
      const splash = document.getElementById('splash');
      const main = document.getElementById('main');
      splash.classList.add('hide');
      splashTimeout = setTimeout(() => {
        splash.style.display = 'none';
        main.classList.add('show');
        startCanvas();
        setTimeout(initReveal, 120);
      }, 1000);
    }
    const enterBtn = document.getElementById('enterBtn');
    enterBtn.addEventListener('click', handleEnter);

    /* ─── Scroll reveal ─── */
    let revealObserver;
    function initReveal() {
      const els = document.querySelectorAll('.reveal');
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
        });
      }, { threshold: 0.08 });
      els.forEach(el => revealObserver.observe(el));
    }

    /* ─── Video (controlled natively) ─── */

    /* ─── Countdown ─── */
    const TARGET = new Date('2026-07-18T10:30:00');
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
      const diff = TARGET - new Date();
      if (diff <= 0) {
        ['cdD', 'cdH', 'cdM', 'cdS'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '00'; });
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = pad(val); };
      set('cdD', d); set('cdH', h); set('cdM', m); set('cdS', s);
    }
    tick();
    const countdownInterval = setInterval(tick, 1000);

    /* ─── Wishes form ─── */
    async function handleSendWish() {
      const nameEl = document.getElementById('wName');
      const msgEl = document.getElementById('wMsg');
      const sendBtn = document.getElementById('sendBtn');

      const name = nameEl.value.trim();
      const msg = msgEl.value.trim();

      nameEl.style.borderColor = '';
      msgEl.style.borderColor = '';

      if (!name) { nameEl.style.borderColor = 'rgba(220,60,60,0.7)'; return; }
      if (!msg) { msgEl.style.borderColor = 'rgba(220,60,60,0.7)'; return; }

      sendBtn.disabled = true;
      sendBtn.querySelector('.sb-text').textContent = 'Sending…';
      sendBtn.querySelector('.sb-icon i').className = 'ti ti-loader-2 spin-icon';
      nameEl.disabled = true;
      msgEl.disabled = true;

      function resetWishBtn() {
        sendBtn.disabled = false;
        sendBtn.querySelector('.sb-text').textContent = 'Send Your Wishes';
        sendBtn.querySelector('.sb-icon i').className = 'ti ti-heart';
        nameEl.disabled = false;
        msgEl.disabled = false;
      }

      try {
        const response = await fetch('/api/send-wish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from_name: name, message: msg }),
        });
        const data = await response.json();

        if (data.ok) {
          document.getElementById('wishWrap').style.display = 'none';
          document.getElementById('successBox').style.display = 'block';
        } else {
          resetWishBtn();
          alert(data.error);
        }
      } catch (err) {
        console.error(err);
        resetWishBtn();
        alert('Failed to send wishes. Please try again.');
      }
    }
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.addEventListener('click', handleSendWish);

    /* ─── RSVP ─── */
    let rsvpChoice = null;
    const btnYes = document.getElementById('rsvpBtnYes');
    const btnNo = document.getElementById('rsvpBtnNo');
    const noSection = document.getElementById('rsvpNoSection');
    const rsvpSendBtn = document.getElementById('rsvpSendBtn');
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpBox = document.getElementById('rsvpSuccess');
    const rsvpMsg = document.getElementById('rsvpSuccessMsg');
    const rsvpSub = document.getElementById('rsvpSuccessSub');

    function selectRsvp(val) {
      rsvpChoice = val;
      btnYes.classList.toggle('selected-yes', val === 'yes');
      btnNo.classList.toggle('selected-no', val === 'no');
      noSection.classList.toggle('visible', val === 'no');
    }
    function handleYes() { selectRsvp('yes'); }
    function handleNo() { selectRsvp('no'); }
    btnYes.addEventListener('click', handleYes);
    btnNo.addEventListener('click', handleNo);

    async function handleRsvpSend() {
      const nameEl = document.getElementById('rName');
      const guestsEl = document.getElementById('rGuests');
      const msgEl = document.getElementById('rMsg');
      
      const name = nameEl.value.trim();
      const guests = guestsEl ? guestsEl.value : '';
      const message = msgEl.value.trim();

      if (!rsvpChoice) { alert('Please let us know if you will attend.'); return; }
      if (!name) { alert('Please enter your name.'); return; }

      rsvpSendBtn.disabled = true;
      rsvpSendBtn.querySelector('.sb-text').textContent = 'Sending…';

      try {
        const response = await fetch('/api/send-rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            attending: rsvpChoice,
            guests,
            message
          }),
        });
        const data = await response.json();

        if (data.ok) {
          rsvpForm.style.display = 'none';
          rsvpBox.style.display = 'block';

          if (rsvpChoice === 'yes') {
            rsvpMsg.textContent = 'JazakAllah Khair, ' + name + '!';
            rsvpSub.textContent = "We can't wait to celebrate with you.";
          } else {
            rsvpMsg.textContent = 'Thank you, ' + name + '.';
            rsvpSub.textContent = 'We will miss you — may Allah bless you always.';
          }
        } else {
          rsvpSendBtn.disabled = false;
          rsvpSendBtn.querySelector('.sb-text').textContent = 'Send RSVP';
          alert(data.error || 'Failed to send RSVP. Please try again.');
        }
      } catch (err) {
        console.error(err);
        rsvpSendBtn.disabled = false;
        rsvpSendBtn.querySelector('.sb-text').textContent = 'Send RSVP';
        alert('Failed to send RSVP. Please try again.');
      }
    }
    rsvpSendBtn.addEventListener('click', handleRsvpSend);

    /* ─── Cleanup on unmount ─── */
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', startCanvas);
      petalTimeouts.forEach(clearTimeout);
      clearTimeout(splashTimeout);
      enterBtn.removeEventListener('click', handleEnter);
      if (revealObserver) revealObserver.disconnect();

      clearInterval(countdownInterval);
      sendBtn.removeEventListener('click', handleSendWish);
      btnYes.removeEventListener('click', handleYes);
      btnNo.removeEventListener('click', handleNo);
      rsvpSendBtn.removeEventListener('click', handleRsvpSend);
    };
  }, []);

  return (
    <div id="inv">

      {/* Generative star / particle canvas */}
      <canvas id="starCanvas"></canvas>

      {/* ═══════════════════════════════
          SPLASH SCREEN
      ═══════════════════════════════ */}
      <div className="splash" id="splash">

        <div className="splash-bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>

        <div className="splash-ring">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <style>{`
                .orbit1 { animation: rotateOrbit 12s linear infinite; transform-origin: 100px 100px; }
                .orbit2 { animation: rotateOrbit 8s linear infinite reverse; transform-origin: 100px 100px; }
                @keyframes rotateOrbit { to { transform: rotate(360deg); } }
                .glow-dash {
                  stroke-dasharray: 8 6;
                  animation: borderFlow 3s linear infinite;
                }
                @keyframes borderFlow { to { stroke-dashoffset: -100; } }
              `}</style>
            </defs>

            {/* Outer rings */}
            <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(100,88,60,0.15)" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="72" fill="none" stroke="rgba(100,88,60,0.25)" strokeWidth="0.5" />

            {/* Orbiting dots — outer */}
            <g className="orbit1">
              <circle cx="100" cy="12" r="3" fill="#8a7a5a" opacity="0.75" />
              <circle cx="188" cy="100" r="2" fill="#8a7a5a" opacity="0.4" />
              <circle cx="100" cy="188" r="3" fill="#8a7a5a" opacity="0.75" />
              <circle cx="12" cy="100" r="2" fill="#8a7a5a" opacity="0.4" />
            </g>

            {/* Orbiting dots — inner */}
            <g className="orbit2">
              <circle cx="100" cy="28" r="2" fill="#6b5c3e" opacity="0.5" />
              <circle cx="172" cy="100" r="2" fill="#6b5c3e" opacity="0.5" />
              <circle cx="100" cy="172" r="2" fill="#6b5c3e" opacity="0.5" />
              <circle cx="28" cy="100" r="2" fill="#6b5c3e" opacity="0.5" />
            </g>

            {/* Inner dashed ring */}
            <circle cx="100" cy="100" r="56"
              fill="rgba(100,88,60,0.04)"
              stroke="rgba(100,88,60,0.35)"
              strokeWidth="0.5"
              className="glow-dash" />

            {/* Centre text */}
            <text x="100" y="88" textAnchor="middle" fontFamily="'Great Vibes',cursive" fontSize="18" fill="#3d3020">Nikkah</text>
            <text x="100" y="110" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="9" fill="#8a7a5a" letterSpacing="3">INVITATION</text>
            <text x="100" y="126" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="8" fill="#6b5c3e" letterSpacing="2">July 18 · 2026</text>

            {/* Star */}
            <polygon
              points="100,68 103,76 111,76 105,81 107,89 100,84 93,89 95,81 89,76 97,76"
              fill="none" stroke="rgba(100,88,60,0.35)" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="splash-name-wrap">
          <span className="splash-name">Ayisha Thesni</span>
          <span className="splash-amp">&amp;</span>
          <span className="splash-name">Jasel Fasil</span>
        </div>

        <div className="splash-sub">We joyfully invite you to our Nikkah</div>

        <button className="enter-btn" id="enterBtn" aria-label="Open invitation">
          <div className="btn-ring">
            <i className="ti ti-chevron-down" aria-hidden="true"></i>
          </div>
          <span className="btn-label">Open Invitation</span>
        </button>

      </div>{/* /splash */}


      {/* ═══════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════ */}
      <div className="main" id="main">

        {/* Hero */}
        <div className="hero-main">
          <div className="hero-bism">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
          <span className="hero-ornament">✦ ❧ ✦</span>
          <p className="hero-invite">With joy and gratitude we invite you to celebrate</p>
          <span className="hero-bride">Ayisha Thesni</span>
          <span className="hero-amp">&amp;</span>
          <span className="hero-groom">Jasel Fasil</span>
          <div className="divider" style={{ marginTop: '1.2rem' }}>
            <div className="dline"></div>
            <div className="ddot"></div>
            <span className="dlabel">Nikkah Ceremony</span>
            <div className="ddot"></div>
            <div className="dline"></div>
          </div>
        </div>

        {/* ── Date & Venue cards ── */}
        <div className="section-max">

          <div className="info-card reveal">
            <span className="corner tl">❧</span>
            <span className="corner tr">❧</span>
            <span className="corner bl">❧</span>
            <span className="corner br">❧</span>
            <svg className="flow-border" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
              <rect x="1" y="1" width="398" height="118" rx="17"
                fill="none" stroke="rgba(100,88,60,0.30)"
                strokeWidth="0.5" strokeDasharray="12 8"
                style={{ animation: 'borderFlow 6s linear infinite' }} />
            </svg>
            <i className="ti ti-calendar-heart card-icon" aria-hidden="true"></i>
            <div className="card-label">Date &amp; Time</div>
            <div className="card-val">Saturday, July 18, 2026</div>
            <div className="card-sub">10:30 in the morning</div>
          </div>

          <div className="info-card reveal" style={{ transitionDelay: '0.1s' }}>
            <span className="corner tl">❧</span>
            <span className="corner tr">❧</span>
            <span className="corner bl">❧</span>
            <span className="corner br">❧</span>
            <svg className="flow-border" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
              <rect x="1" y="1" width="398" height="118" rx="17"
                fill="none" stroke="rgba(100,88,60,0.30)"
                strokeWidth="0.5" strokeDasharray="12 8"
                style={{ animation: 'borderFlow 6s linear infinite reverse' }} />
            </svg>
            <i className="ti ti-building-arch card-icon" aria-hidden="true"></i>
            <div className="card-label">Venue</div>
            <div className="card-val">Parkon Auditorium &amp; Convention Center</div>
            <div className="card-sub">Edavannappara</div>
          </div>

        </div>{/* /section-max cards */}

        {/* ── Map ── */}
        <div className="section-max reveal" style={{ transitionDelay: '0.15s' }}>
          <div className="divider">
            <div className="dline"></div><div className="ddot"></div>
            <span className="dlabel">Find Us</span>
            <div className="ddot"></div><div className="dline"></div>
          </div>
          <div className="map-wrap">
            <iframe
              className="map-frame"
              src="https://maps.google.com/maps?q=Parkon%20Auditorium%20Edavannappara&z=17&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Parkon Auditorium, Edavannappara">
            </iframe>
          </div>
          <a className="fancy-btn" href="https://maps.app.goo.gl/o4xyexsVS3E2JatV8" target="_blank" rel="noopener">
            <div className="fb-inner">
              <div className="fb-icon"><i className="ti ti-navigation" aria-hidden="true"></i></div>
              <div className="fb-text">
                <span>Get Directions</span>
                <small>Open in Google Maps</small>
              </div>
              <i className="ti ti-arrow-up-right fb-arrow" aria-hidden="true"></i>
            </div>
          </a>
        </div>

        {/* ── Video ── */}
        <div className="section-max reveal" style={{ transitionDelay: '0.2s' }}>
          <div className="divider" style={{ marginTop: '1.5rem' }}>
            <div className="dline"></div><div className="ddot"></div>
            <span className="dlabel">Our Story</span>
            <div className="ddot"></div><div className="dline"></div>
          </div>
          <div className="video-wrap" id="vWrap">
            <video className="video-el" id="vEl" preload="metadata" controls playsInline webkit-playsinline="true">
             <source src="/video.MP4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* ── Countdown ── */}
        <div className="section-max reveal" style={{ transitionDelay: '0.25s' }}>
          <div className="divider" style={{ marginTop: '1.5rem' }}>
            <div className="dline"></div><div className="ddot"></div>
            <span className="dlabel">Counting Down</span>
            <div className="ddot"></div><div className="dline"></div>
          </div>
          <div className="cd-grid" role="timer" aria-label="Time until the Nikkah ceremony">
            <div className="cd-box"><span className="cd-num" id="cdD">--</span><div className="cd-lbl">Days</div></div>
            <div className="cd-box"><span className="cd-num" id="cdH">--</span><div className="cd-lbl">Hours</div></div>
            <div className="cd-box"><span className="cd-num" id="cdM">--</span><div className="cd-lbl">Mins</div></div>
            <div className="cd-box"><span className="cd-num" id="cdS">--</span><div className="cd-lbl">Secs</div></div>
          </div>
        </div>

        {/* ── Wishes form ── */}
        <div className="section-max reveal" style={{ transitionDelay: '0.3s', marginTop: '1.5rem' }}>
          <div className="divider">
            <div className="dline"></div><div className="ddot"></div>
            <span className="dlabel">Send Wishes</span>
            <div className="ddot"></div><div className="dline"></div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
            <span style={{ fontFamily: "'Great Vibes',cursive", fontSize: 'clamp(30px,7vw,46px)', color: '#3d3020' }}>Bless the Couple</span>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(44,40,32,0.45)', textTransform: 'uppercase', marginTop: '0.2rem', fontStyle: 'normal' }}>Leave a message for Ayisha &amp; Jasel</p>
          </div>

          <div className="wish-form-wrap" id="wishWrap">
            <div className="form-grp">
              <label className="form-lbl" htmlFor="wName">Your Name</label>
              <input className="form-inp" type="text" id="wName" placeholder="Enter your name" autoComplete="name" />
            </div>
            <div className="form-grp">
              <label className="form-lbl" htmlFor="wMsg">Your Wishes</label>
              <textarea className="form-inp" id="wMsg" placeholder="Write your heartfelt wishes…"></textarea>
            </div>
            <button className="send-btn" id="sendBtn" type="button">
              <div className="sb-inner">
                <div className="sb-icon"><i className="ti ti-heart" aria-hidden="true"></i></div>
                <span className="sb-text">Send Your Wishes</span>
              </div>
            </button>
          </div>

          <div className="success-box" id="successBox" role="alert">
            <div className="success-ring"><i className="ti ti-check" aria-hidden="true"></i></div>
            <div className="success-msg-txt">JazakAllah Khair!<br />Your wishes have been sent.</div>
            <div className="success-sub">May Allah bless Thesni &amp; Jasel with endless happiness.</div>
          </div>
        </div>

        {/* ── RSVP ── */}
        <div className="section-max reveal" style={{ transitionDelay: '0.35s', marginTop: '1.5rem' }}>
          <div className="divider">
            <div className="dline"></div><div className="ddot"></div>
            <span className="dlabel">RSVP</span>
            <div className="ddot"></div><div className="dline"></div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
            <span style={{ fontFamily: "'Great Vibes',cursive", fontSize: 'clamp(30px,7vw,46px)', color: 'var(--gold-lt)' }}>Will You Attend?</span>
            <p style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.25rem', fontStyle: 'normal', fontFamily: "'Lato',sans-serif" }}>Kindly let us know by July 18, 2026</p>
          </div>

          <div className="wish-form-wrap" id="rsvpForm">

            <div className="attend-row">
              <button className="attend-btn" id="rsvpBtnYes" type="button">
                <i className="ti ti-heart" aria-hidden="true"></i>
                <span className="ab-label">Joyfully Attending</span>
                <span className="ab-sub">Yes, I'll be there</span>
              </button>
              <button className="attend-btn" id="rsvpBtnNo" type="button">
                <i className="ti ti-heart-off" aria-hidden="true"></i>
                <span className="ab-label">Regretfully Unable</span>
                <span className="ab-sub">No, I can't make it</span>
              </button>
            </div>

            <div className="form-grp">
              <label className="form-lbl" htmlFor="rName">Your Name</label>
              <input className="form-inp" type="text" id="rName" placeholder="Enter your name" autoComplete="name" />
            </div>

            {/* Slides in only when "No" is chosen */}
            <div className="no-section" id="rsvpNoSection">
              <div className="form-grp">
                <label className="form-lbl" htmlFor="rGuests">Number of Guests (optional)</label>
                <select className="form-inp" id="rGuests" defaultValue="">
                  <option value="">Select number of guests…</option>
                  <option value="0">Just myself — not attending</option>
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5">5+ guests</option>
                </select>
              </div>
            </div>

            <div className="form-grp">
              <label className="form-lbl" htmlFor="rMsg">Message (optional)</label>
              <input className="form-inp" type="text" id="rMsg" placeholder="Any message for the couple…" />
            </div>

            <button className="send-btn" id="rsvpSendBtn" type="button">
              <div className="sb-inner">
                <div className="sb-icon"><i className="ti ti-send" aria-hidden="true"></i></div>
                <span className="sb-text">Send RSVP</span>
              </div>
            </button>

          </div>{/* /rsvpForm */}

          <div className="success-box" id="rsvpSuccess" role="alert">
            <div className="success-ring"><i className="ti ti-check" aria-hidden="true"></i></div>
            <div className="success-msg-txt" id="rsvpSuccessMsg">JazakAllah Khair!</div>
            <div className="success-sub" id="rsvpSuccessSub">We can't wait to celebrate with you.</div>
          </div>

        </div>

        {/* ── Footer quote ── */}
        <footer className="footer-qr">
          <div style={{ fontSize: '18px', color: '#8a7a5a', marginBottom: '0.6rem' }}>✦ ❧ ✦</div>
          "And of His signs is that He created for you from yourselves mates that you may find tranquility in them"
          <div style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(44,40,32,0.35)', marginTop: '0.5rem', fontStyle: 'normal' }}>— Quran 30:21</div>
          <div style={{ marginTop: '1.5rem', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(44,40,32,0.28)', fontStyle: 'normal' }}>Ayisha Thesni ✦ Jasel Fasil · July 18, 2026</div>
        </footer>

      </div>{/* /main */}

    </div>
  );
}
