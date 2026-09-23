/**
 * For Ammuuu (Rakshashiiiiiiii) ♡ A Private Digital Love Book
 * Rebuilt with unreasonable love by Nandhu (Wastee Felloooww)
 * Verbatim Letter Integrity, Realistic 3D Page Turns, Procedural Audio, Cinematic Moments
 */

(function () {
  'use strict';

  // --- STATE MANAGEMENT ---
  const state = {
    currentPage: 1,
    totalPages: 21,
    isTurningPage: false,
    audioInitialized: false,
    musicPlaying: false,
    sfxEnabled: true,
    volume: 0.5,
    particleMode: 'stars', // 'stars', 'petals', 'notes', 'embers', 'rain', 'minimal', 'orbit'
    fluteStageActive: false,
    lilyGalleryActive: false,
    currentLilyPhotoIndex: 0,
    birthdayBgmStarted: false,
    birthdayBgmStopped: false,
    introTimelineStarted: false,
    letterBgmPlaying: false,
    letterBgmPausedByFlute: false,
    letterBgmFadingOut: false,
    userMusicMuted: false,
    marriageBgmPlayed: false,
    marriageBgmPlaying: false,
    savedRosePosition: 0,
    flutePausedAudio: null
  };

  // --- DOM CACHE ---
  const DOM = {
    // Preloader
    preloader: document.getElementById('preloader'),
    preloadLine1: document.getElementById('preload-line-1'),
    preloadLine2: document.getElementById('preload-line-2'),
    loaderProgress: document.getElementById('loader-progress-fill'),
    autoplayTapHint: document.getElementById('autoplay-tap-hint'),

    // Intro
    intro: document.getElementById('cinematic-intro'),
    introGlow: document.getElementById('intro-glow'),
    introStep1: document.getElementById('intro-step-1'),
    introStep2: document.getElementById('intro-step-2'),
    introStep3: document.getElementById('intro-step-3'),
    introStep4: document.getElementById('intro-step-4'),
    introStep5: document.getElementById('intro-step-5'),
    birthdayLetters: document.getElementById('birthday-letters'),
    btnOpenBook: document.getElementById('btn-open-book'),

    // Book
    bookStage: document.getElementById('book-experience'),
    currentChapterTitle: document.getElementById('current-chapter-title'),
    currentPageNum: document.getElementById('current-page-num'),
    totalPageNum: document.getElementById('total-page-num'),
    pageLeftDisplay: document.getElementById('page-left-display'),
    pageLeftText: document.getElementById('page-left-text'),
    pageLeftFooterNum: document.getElementById('page-left-footer-num'),
    pageLeftThemeTag: document.getElementById('page-left-theme-tag'),
    pageRightDisplay: document.getElementById('page-right-display'),
    pageRightContent: document.getElementById('page-right-content'),
    pageRightText: document.getElementById('page-right-text'),
    pageRightFooterNum: document.getElementById('page-right-footer-num'),
    pageRightThemeTag: document.getElementById('page-right-theme-tag'),
    pageSceneStage: document.getElementById('page-scene-stage'),
    btnPrevPage: document.getElementById('btn-prev-page'),
    btnNextPage: document.getElementById('btn-next-page'),
    btnTocOpen: document.getElementById('btn-toc-open'),

    // TOC
    tocDrawer: document.getElementById('toc-drawer'),
    tocBackdrop: document.getElementById('toc-backdrop'),
    btnCloseToc: document.getElementById('btn-close-toc'),
    tocListItems: document.getElementById('toc-list-items'),

    // Flute Video Stage
    fluteModal: document.getElementById('flute-video-modal'),
    fluteBackdrop: document.getElementById('flute-backdrop'),
    fluteVideoPlayer: document.getElementById('flute-media-player'),
    fluteFallback: document.getElementById('flute-video-fallback'),
    btnTestFluteAudio: document.getElementById('btn-test-flute-audio'),
    btnCloseFluteStage: document.getElementById('btn-close-flute-stage'),

    // Lily Photo Gallery Modal
    lilyGalleryModal: document.getElementById('lily-gallery-modal'),
    lilyGalleryBackdrop: document.getElementById('lily-gallery-backdrop'),
    btnCloseLilyGallery: document.getElementById('btn-close-lily-gallery'),
    btnReturnFromLily: document.getElementById('btn-return-from-lily'),
    lilyLightboxImg: document.getElementById('lily-lightbox-img'),
    lilyLightboxCaption: document.getElementById('lily-lightbox-caption'),
    lilyLightboxDate: document.getElementById('lily-lightbox-date'),
    lilyPhotoCounter: document.getElementById('lily-photo-counter'),
    lilyPhotoFrame: document.getElementById('lily-photo-frame'),
    btnLilyPrev: document.getElementById('btn-lily-prev'),
    btnLilyNext: document.getElementById('btn-lily-next'),
    lilyThumbnailsRow: document.getElementById('lily-thumbnails-row'),

    // Closing Stage
    closingScene: document.getElementById('closing-scene'),
    closeLine1: document.getElementById('close-line-1'),
    closeLine2: document.getElementById('close-line-2'),
    closeLine3: document.getElementById('close-line-3'),
    finalSecretTrigger: document.getElementById('final-secret-trigger'),
    btnSecretHeart: document.getElementById('btn-secret-heart'),

    // Secret Modal
    secretModal: document.getElementById('secret-modal'),
    secretBackdrop: document.getElementById('secret-backdrop'),
    btnReplayExperience: document.getElementById('btn-replay-experience'),

    // Audio Elements & Controls
    btnMusicToggle: document.getElementById('btn-music-toggle'),
    musicStatusText: document.getElementById('music-status-text'),
    musicVolumeSlider: document.getElementById('music-volume'),
    btnSfxToggle: document.getElementById('btn-sfx-toggle'),
    bgAudioPlayer: document.getElementById('bg-audio-player'),
    marriageBgmPlayer: document.getElementById('marriage-bgm-player'),
    birthdayBgmPlayer: document.getElementById('birthday-bgm-player'),

    // Canvas
    canvas: document.getElementById('ambient-canvas')
  };

  // --- PROCEDURAL WEB AUDIO ENGINE ---
  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.ambientGain = null;
      this.ambientOsc1 = null;
      this.ambientOsc2 = null;
      this.ambientFilter = null;
      this.isAmbientSynthPlaying = false;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(state.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    setVolume(vol) {
      state.volume = vol;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05);
      }
      if (DOM.birthdayBgmPlayer) {
        DOM.birthdayBgmPlayer.volume = vol;
      }
      if (DOM.bgAudioPlayer && state.letterBgmPlaying && !state.userMusicMuted && !state.letterBgmFadingOut && !state.marriageBgmPlaying) {
        const targetVol = getEffectiveLetterVolume(state.currentPage);
        DOM.bgAudioPlayer.volume = Math.max(0, Math.min(1, targetVol));
      }
      if (DOM.marriageBgmPlayer && state.marriageBgmPlaying && !state.userMusicMuted) {
        DOM.marriageBgmPlayer.volume = getEffectiveTheriVolume();
      }
    }

    // Realistic paper rustle sound on page flip
    playPaperRustle() {
      if (!state.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const bufferSize = this.ctx.sampleRate * 0.35; // 350ms rustle
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);

        // Pink/brown noise burst
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        // Bandpass filter centered around 1400Hz to mimic crisp parchment paper
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.28 * state.volume, this.ctx.currentTime + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.34);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        whiteNoise.start();
        whiteNoise.stop(this.ctx.currentTime + 0.35);
      } catch (err) {
        console.warn('Audio rustle synth error:', err);
      }
    }

    // Soothing ambient chord drone / background music control
    toggleAmbientMusic(play) {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // If Theri marriage intermission is currently active
      if (DOM.marriageBgmPlayer && state.marriageBgmPlaying) {
        if (play) {
          state.userMusicMuted = false;
          state.musicPlaying = true;
          DOM.marriageBgmPlayer.play().then(() => {
            smoothRampMarriageVolume(getEffectiveTheriVolume(), 1000);
          }).catch(e => console.warn('Theri play error:', e));
          DOM.musicStatusText.textContent = 'Playing';
          DOM.btnMusicToggle.classList.add('active');
        } else {
          state.userMusicMuted = true;
          state.musicPlaying = false;
          smoothRampMarriageVolume(0, 400);
          setTimeout(() => {
            if (state.userMusicMuted && DOM.marriageBgmPlayer) {
              DOM.marriageBgmPlayer.pause();
            }
          }, 420);
          DOM.musicStatusText.textContent = 'Muted';
          DOM.btnMusicToggle.classList.remove('active');
        }
        return;
      }

      if (DOM.bgAudioPlayer && state.letterBgmPlaying) {
        if (play) {
          state.userMusicMuted = false;
          state.musicPlaying = true;
          DOM.bgAudioPlayer.play().then(() => {
            smoothRampLetterVolume(getEffectiveLetterVolume(state.currentPage), 1000);
          }).catch(e => console.warn('Play error:', e));
          DOM.musicStatusText.textContent = 'Playing';
          DOM.btnMusicToggle.classList.add('active');
        } else {
          state.userMusicMuted = true;
          state.musicPlaying = false;
          smoothRampLetterVolume(0, 400);
          setTimeout(() => {
            if (state.userMusicMuted && DOM.bgAudioPlayer) {
              DOM.bgAudioPlayer.pause();
            }
          }, 420);
          DOM.musicStatusText.textContent = 'Muted';
          DOM.btnMusicToggle.classList.remove('active');
        }
        return;
      }

      // Procedural fallback
      if (play) {
        this.startSynthPad();
      } else {
        this.stopSynthPad();
      }
    }

    startSynthPad() {
      if (this.isAmbientSynthPlaying || !this.ctx) return;
      try {
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(0.18 * state.volume, this.ctx.currentTime + 2.5);

        this.ambientFilter = this.ctx.createBiquadFilter();
        this.ambientFilter.type = 'lowpass';
        this.ambientFilter.frequency.setValueAtTime(360, this.ctx.currentTime);

        // Dual tuned warm oscillators (A3 = 220Hz, C#4 = 277.18Hz)
        this.ambientOsc1 = this.ctx.createOscillator();
        this.ambientOsc1.type = 'sine';
        this.ambientOsc1.frequency.setValueAtTime(220, this.ctx.currentTime);

        this.ambientOsc2 = this.ctx.createOscillator();
        this.ambientOsc2.type = 'triangle';
        this.ambientOsc2.frequency.setValueAtTime(277.18, this.ctx.currentTime);

        this.ambientOsc1.connect(this.ambientFilter);
        this.ambientOsc2.connect(this.ambientFilter);
        this.ambientFilter.connect(this.ambientGain);
        this.ambientGain.connect(this.masterGain);

        this.ambientOsc1.start();
        this.ambientOsc2.start();
        this.isAmbientSynthPlaying = true;
        state.musicPlaying = true;
        DOM.musicStatusText.textContent = 'Harmonic';
        DOM.btnMusicToggle.classList.add('active');
      } catch (e) {
        console.warn('Synth pad error:', e);
      }
    }

    stopSynthPad() {
      if (!this.isAmbientSynthPlaying || !this.ambientGain) return;
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
        setTimeout(() => {
          if (this.ambientOsc1) { this.ambientOsc1.stop(); this.ambientOsc1.disconnect(); }
          if (this.ambientOsc2) { this.ambientOsc2.stop(); this.ambientOsc2.disconnect(); }
          this.isAmbientSynthPlaying = false;
        }, 1300);
      } catch (e) {
        this.isAmbientSynthPlaying = false;
      }
    }

    // Play a gentle flute note simulation when previewing
    playFluteSampleMelody() {
      this.init();
      if (!this.ctx) return;
      const notes = [440, 493.88, 554.37, 659.25, 739.99]; // A4, B4, C#5, E5, F#5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.45);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.45);
        gain.gain.linearRampToValueAtTime(0.15 * state.volume, this.ctx.currentTime + idx * 0.45 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.45 + 0.65);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.ctx.currentTime + idx * 0.45);
        osc.stop(this.ctx.currentTime + idx * 0.45 + 0.7);
      });
    }
  }

  const audio = new AudioEngine();

  // --- DYNAMIC CANVAS PARTICLES SYSTEM ---
  class ParticleWorld {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.sparkles = [];
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.resize();

      window.addEventListener('resize', () => this.resize());
      this.initParticles();
      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    initParticles() {
      this.particles = [];
      const count = window.innerWidth < 600 ? 35 : 70;
      for (let i = 0; i < count; i++) {
        this.particles.push(this.createParticle());
      }
    }

    addTouchSparkle(x, y) {
      const symbols = ['✦', '♡', '✧', '•'];
      for (let i = 0; i < 3; i++) {
        this.sparkles.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 16,
          size: Math.random() * 2.5 + 1.5,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: -Math.random() * 2.2 - 0.8,
          opacity: 1,
          decay: Math.random() * 0.025 + 0.015,
          color: Math.random() > 0.35 ? '#fce38a' : '#f2849e',
          symbol: symbols[Math.floor(Math.random() * symbols.length)]
        });
      }
      if (this.sparkles.length > 50) {
        this.sparkles.splice(0, this.sparkles.length - 50);
      }
    }

    createParticle() {
      return {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.2,
        opacity: Math.random() * 0.7 + 0.2,
        decay: Math.random() * 0.008 + 0.003,
        color: Math.random() > 0.4 ? '#fce38a' : '#f2849e',
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        symbol: ['♪', '♫', '❦'][Math.floor(Math.random() * 3)]
      };
    }

    loop() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      const mode = state.particleMode;
      const count = this.particles.length;

      for (let i = 0; i < count; i++) {
        const p = this.particles[i];

        if (mode === 'petals') {
          // Soft drifting flower petals
          p.x += Math.sin(p.angle) * 0.8 + p.speedX;
          p.y += 0.9;
          p.angle += p.spin;

          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.angle);
          this.ctx.fillStyle = `rgba(255, 230, 238, ${p.opacity * 0.85})`;
          this.ctx.beginPath();
          this.ctx.ellipse(0, 0, p.size * 2.2, p.size * 4.2, 0, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        } else if (mode === 'notes') {
          // Rising musical notes
          p.y += p.speedY * 1.5;
          p.x += Math.sin(p.angle) * 0.6;
          p.angle += 0.02;

          this.ctx.font = `${p.size * 4 + 8}px 'Cinzel', serif`;
          this.ctx.fillStyle = `rgba(247, 197, 119, ${p.opacity * 0.85})`;
          this.ctx.fillText(p.symbol, p.x, p.y);
        } else if (mode === 'minimal') {
          // Slow, barely perceptible dust motes for vulnerable chapters
          p.y += p.speedY * 0.3;
          p.x += p.speedX * 0.3;

          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(252, 227, 138, ${p.opacity * 0.35})`;
          this.ctx.fill();
        } else {
          // Default: Warm stardust
          p.y += p.speedY;
          p.x += p.speedX;

          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color;
          this.ctx.globalAlpha = p.opacity;
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = p.color;
          this.ctx.fill();
          this.ctx.globalAlpha = 1;
          this.ctx.shadowBlur = 0;
        }

        // Wrap around boundaries
        if (p.y < -20) p.y = this.height + 10;
        if (p.y > this.height + 20) p.y = -10;
        if (p.x < -20) p.x = this.width + 10;
        if (p.x > this.width + 20) p.x = -10;
      }

      // Render and update touch sparkles
      for (let i = 0; i < this.sparkles.length; i++) {
        const s = this.sparkles[i];
        s.x += s.speedX;
        s.y += s.speedY;
        s.opacity -= s.decay;
        if (s.opacity <= 0) {
          this.sparkles.splice(i, 1);
          i--;
          continue;
        }
        this.ctx.save();
        this.ctx.font = `${s.size * 4 + 7}px serif`;
        this.ctx.fillStyle = s.color;
        this.ctx.globalAlpha = Math.max(0, s.opacity);
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = s.color;
        this.ctx.fillText(s.symbol, s.x, s.y);
        this.ctx.restore();
      }

      requestAnimationFrame(this.loop);
    }
  }

  // --- INITIALIZE DATA & TOC ---
  function initDataAndTOC() {
    if (!window.LETTER_PAGES || !Array.isArray(window.LETTER_PAGES)) {
      console.error('letter_data.js not loaded!');
      return;
    }
    state.totalPages = window.LETTER_PAGES.length;
    DOM.totalPageNum.textContent = String(state.totalPages).padStart(2, '0');

    // Build TOC drawer
    DOM.tocListItems.innerHTML = '';
    window.LETTER_PAGES.forEach((item, index) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'toc-item-btn';
      btn.innerHTML = `
        <span>${item.title}</span>
        <span class="toc-item-num">♡ ${String(index + 1).padStart(2, '0')}</span>
      `;
      btn.addEventListener('click', () => {
        closeTOC();
        goToPage(index + 1);
      });
      li.appendChild(btn);
      DOM.tocListItems.appendChild(li);
    });

    // Pre-render initial page immediately so book content is fully loaded
    renderCurrentPage();
  }

  // --- 35-SECOND REMO HAPPY BIRTHDAY BGM SYNCHRONIZED TIMELINE ---
  let introTimeouts = [];
  let introSyncRaf = null;

  function clearIntroTimers() {
    introTimeouts.forEach(t => clearTimeout(t));
    introTimeouts = [];
    if (introSyncRaf) {
      cancelAnimationFrame(introSyncRaf);
      introSyncRaf = null;
    }
  }

  function stopBirthdayBgm() {
    state.birthdayBgmStopped = true;
    clearIntroTimers();
    if (DOM.birthdayBgmPlayer) {
      try {
        DOM.birthdayBgmPlayer.pause();
        DOM.birthdayBgmPlayer.currentTime = 0;
      } catch (err) {
        console.warn('Error stopping birthday BGM:', err);
      }
    }
  }

  function runSynchronizedOpeningTimeline() {
    if (state.introTimelineStarted || state.birthdayBgmStopped) return;
    state.introTimelineStarted = true;

    // 26-second timeline cues synchronized with Remo Birthday BGM
    const TIMELINE_CUES = [
      { time: 0.6, fired: false, action: () => DOM.preloadLine1 && DOM.preloadLine1.classList.add('visible') },
      { time: 1.6, fired: false, action: () => DOM.preloadLine2 && DOM.preloadLine2.classList.add('visible') },
      { time: 2.8, fired: false, action: () => DOM.preloader && DOM.preloader.classList.add('fade-out') },
      { time: 3.6, fired: false, action: () => {
          if (DOM.preloader) DOM.preloader.style.display = 'none';
          if (DOM.intro) DOM.intro.classList.add('active');
        }
      },
      { time: 4.0, fired: false, action: () => DOM.introGlow && DOM.introGlow.classList.add('expand') },
      { time: 5.2, fired: false, action: () => DOM.introStep1 && DOM.introStep1.classList.add('show') },
      { time: 9.2, fired: false, action: () => DOM.introStep2 && DOM.introStep2.classList.add('show') },
      { time: 13.8, fired: false, action: () => DOM.introStep3 && DOM.introStep3.classList.add('show') },
      { time: 18.5, fired: false, action: () => {
          if (!DOM.introStep4) return;
          DOM.introStep4.classList.add('show');
          if (DOM.birthdayLetters) {
            const spans = DOM.birthdayLetters.querySelectorAll('span');
            spans.forEach((span, i) => {
              const t = setTimeout(() => {
                if (state.birthdayBgmStopped) return;
                span.style.opacity = '1';
                span.style.transform = 'translateY(0) scale(1)';
              }, i * 55);
              introTimeouts.push(t);
            });
          }
        }
      },
      { time: 23.8, fired: false, action: () => DOM.introStep5 && DOM.introStep5.classList.add('show') },
      { time: 25.5, fired: false, action: () => DOM.btnOpenBook && DOM.btnOpenBook.classList.add('ready-pulse') }
    ];

    const audioEl = DOM.birthdayBgmPlayer;
    let fallbackStartTime = null;

    function checkTimeline() {
      if (state.birthdayBgmStopped) return;

      let cur = 0;
      if (audioEl && !audioEl.paused && audioEl.currentTime > 0) {
        cur = audioEl.currentTime;
      } else {
        if (!fallbackStartTime) fallbackStartTime = performance.now();
        cur = (performance.now() - fallbackStartTime) / 1000;
      }

      // Smooth preloader progress bar during 0 - 2.8s
      if (cur <= 2.8 && DOM.loaderProgress) {
        const progressPct = Math.min(100, Math.max(0, (cur / 2.6) * 100));
        DOM.loaderProgress.style.width = `${progressPct}%`;
      }

      // Execute cues
      for (let i = 0; i < TIMELINE_CUES.length; i++) {
        const cue = TIMELINE_CUES[i];
        if (!cue.fired && cur >= cue.time) {
          cue.fired = true;
          try {
            cue.action();
          } catch (e) {
            console.error('Cue execution error:', e);
          }
        }
      }

      if ((audioEl && !audioEl.ended && !state.birthdayBgmStopped) || (cur < 36.0 && !state.birthdayBgmStopped)) {
        introSyncRaf = requestAnimationFrame(checkTimeline);
      }
    }

    introSyncRaf = requestAnimationFrame(checkTimeline);
  }

  function startBirthdayBgm() {
    if (state.birthdayBgmStarted || state.birthdayBgmStopped) return;
    state.birthdayBgmStarted = true;

    const player = DOM.birthdayBgmPlayer;
    if (!player) {
      console.warn('Birthday BGM player element not found, running visual timeline directly');
      runSynchronizedOpeningTimeline();
      return;
    }

    player.loop = false;
    player.volume = state.volume;

    const playPromise = player.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Autoplay succeeded!
        if (DOM.autoplayTapHint) {
          DOM.autoplayTapHint.style.display = 'none';
        }
        runSynchronizedOpeningTimeline();
      }).catch((err) => {
        // Autoplay restricted by browser policy
        console.log('Autoplay restriction encountered, awaiting user gesture:', err);
        state.birthdayBgmStarted = false;

        if (DOM.autoplayTapHint) {
          DOM.autoplayTapHint.style.display = 'block';
        }

        const handleUserGesture = () => {
          window.removeEventListener('pointerdown', handleUserGesture);
          window.removeEventListener('touchstart', handleUserGesture);
          window.removeEventListener('click', handleUserGesture);
          window.removeEventListener('keydown', handleUserGesture);

          if (!state.birthdayBgmStarted && !state.birthdayBgmStopped) {
            startBirthdayBgm();
          }
        };

        window.addEventListener('pointerdown', handleUserGesture, { once: true, passive: true });
        window.addEventListener('touchstart', handleUserGesture, { once: true, passive: true });
        window.addEventListener('click', handleUserGesture, { once: true });
        window.addEventListener('keydown', handleUserGesture, { once: true });
      });
    } else {
      runSynchronizedOpeningTimeline();
    }
  }

  // --- LETTER-READING BGM ENGINE: "THE ROSE (INSTRUMENTAL)" ---
  let letterVolumeRampTimer = null;
  let letterLoopMonitorInterval = null;
  let isCrossfadingLoop = false;

  function getPhaseBaseVolume(pageNum) {
    if (pageNum <= 1) return 0.10;   // Phase 1: 10%
    if (pageNum <= 6) return 0.125;  // Phase 2: 12-13%
    if (pageNum <= 8) return 0.135;  // Phase 3: 13-14%
    if (pageNum <= 11) return 0.14;  // Phase 4: 14%
    if (pageNum <= 16) return 0.15;  // Phase 5: 15% (Emotional peak)
    if (pageNum <= 18) return 0.12;  // Phase 6: 12% (Brought gently down)
    return 0.10;                     // Phase 7: 10% (Final message / breathing room)
  }

  function getEffectiveLetterVolume(pageNum) {
    if (state.userMusicMuted) return 0;
    const userMultiplier = state.volume * 2;
    return Math.max(0, Math.min(1, getPhaseBaseVolume(pageNum) * userMultiplier));
  }

  function smoothRampLetterVolume(targetVol, durationMs = 1500) {
    const player = DOM.bgAudioPlayer;
    if (!player) return;
    if (letterVolumeRampTimer) {
      clearInterval(letterVolumeRampTimer);
      letterVolumeRampTimer = null;
    }

    const startVol = player.volume;
    const startTime = performance.now();
    const stepInterval = 25;

    letterVolumeRampTimer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const currentVol = startVol + (targetVol - startVol) * ease;
      player.volume = Math.max(0, Math.min(1, currentVol));

      if (progress >= 1) {
        clearInterval(letterVolumeRampTimer);
        letterVolumeRampTimer = null;
        player.volume = Math.max(0, Math.min(1, targetVol));
      }
    }, stepInterval);
  }

  function startLetterBgm() {
    const player = DOM.bgAudioPlayer;
    if (!player) return;
    if (state.letterBgmPlaying) return; // Exactly ONE instance, no duplicates

    state.letterBgmFadingOut = false;
    state.letterBgmPausedByFlute = false;

    const initialTarget = getEffectiveLetterVolume(state.currentPage);
    player.volume = 0.01;
    player.currentTime = 0;

    const playPromise = player.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        state.letterBgmPlaying = true;
        state.musicPlaying = !state.userMusicMuted;
        DOM.musicStatusText.textContent = state.userMusicMuted ? 'Muted' : 'Playing';
        DOM.btnMusicToggle.classList.toggle('active', !state.userMusicMuted);

        // Smoothly ramp to Page 1 target volume (0.10) over 2 seconds
        if (!state.userMusicMuted) {
          smoothRampLetterVolume(initialTarget, 2000);
        }
        setupLetterLoopMonitor();
      }).catch(err => {
        console.warn('Letter BGM playback error:', err);
      });
    }
  }

  function updateLetterBgmPhase(pageNum) {
    if (!state.letterBgmPlaying || state.letterBgmFadingOut || state.letterBgmPausedByFlute || state.marriageBgmPlaying || state.userMusicMuted) return;
    const targetVol = getEffectiveLetterVolume(pageNum);
    smoothRampLetterVolume(targetVol, 1500); // 1.5-second gradual interpolation across page changes
  }

  function pauseLetterBgmForFlute() {
    const player = DOM.bgAudioPlayer;
    if (!player || player.paused || !state.letterBgmPlaying) return;

    state.letterBgmPausedByFlute = true;
    smoothRampLetterVolume(0, 200);
    setTimeout(() => {
      if (state.letterBgmPausedByFlute && player) {
        player.pause();
      }
    }, 220);
  }

  function resumeLetterBgmAfterFlute() {
    const player = DOM.bgAudioPlayer;
    if (!player || !state.letterBgmPausedByFlute || state.userMusicMuted) return;

    state.letterBgmPausedByFlute = false;
    const playPromise = player.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        const targetVol = getEffectiveLetterVolume(state.currentPage);
        smoothRampLetterVolume(targetVol, 800);
      }).catch(err => console.warn('Resume letter BGM error:', err));
    }
  }

  function setupLetterLoopMonitor() {
    if (letterLoopMonitorInterval) return;
    const player = DOM.bgAudioPlayer;
    if (!player) return;

    letterLoopMonitorInterval = setInterval(() => {
      if (!state.letterBgmPlaying || state.letterBgmFadingOut || state.fluteStageActive || isCrossfadingLoop || state.marriageBgmPlaying) return;

      const duration = player.duration || 134.43;
      const cur = player.currentTime;

      // When nearing the end (~131.5s, 3 seconds before ending), perform smooth musical dip and swell
      if (cur >= duration - 3.0) {
        isCrossfadingLoop = true;
        const targetVol = getEffectiveLetterVolume(state.currentPage);

        // Gentle 2.4-second musical dip down to 0.01
        smoothRampLetterVolume(0.01, 2400);

        setTimeout(() => {
          if (!state.letterBgmPlaying || state.letterBgmFadingOut) {
            isCrossfadingLoop = false;
            return;
          }
          player.currentTime = 0;
          // Smooth 2.5-second musical swell back to target page volume
          if (!state.userMusicMuted) {
            smoothRampLetterVolume(targetVol, 2500);
          }
          setTimeout(() => {
            isCrossfadingLoop = false;
          }, 2600);
        }, 2450);
      }
    }, 500);
  }

  function fadeoutLetterBgm(durationMs = 4000) {
    state.letterBgmFadingOut = true;
    const player = DOM.bgAudioPlayer;
    if (!player || player.paused) return;

    smoothRampLetterVolume(0, durationMs);

    setTimeout(() => {
      if (state.letterBgmFadingOut && player) {
        player.pause();
        state.letterBgmPlaying = false;
        state.musicPlaying = false;
        DOM.musicStatusText.textContent = 'Muted';
        DOM.btnMusicToggle.classList.remove('active');
      }
    }, durationMs + 100);
  }

  // --- ONE-TIME THERI MARRIAGE PROPOSAL INTERMISSION ENGINE ---
  const BASE_THERI_VOLUME = 0.15;
  let marriageVolumeRampTimer = null;
  let theriBreathingTimeout = null;

  function getEffectiveTheriVolume() {
    if (state.userMusicMuted) return 0;
    const userMultiplier = state.volume * 2;
    return Math.max(0, Math.min(1, BASE_THERI_VOLUME * userMultiplier));
  }

  function smoothRampMarriageVolume(targetVol, durationMs = 1500) {
    const player = DOM.marriageBgmPlayer;
    if (!player) return;
    if (marriageVolumeRampTimer) {
      clearInterval(marriageVolumeRampTimer);
      marriageVolumeRampTimer = null;
    }

    const startVol = player.volume;
    const startTime = performance.now();
    const stepInterval = 25;

    marriageVolumeRampTimer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const currentVol = startVol + (targetVol - startVol) * ease;
      player.volume = Math.max(0, Math.min(1, currentVol));

      if (progress >= 1) {
        clearInterval(marriageVolumeRampTimer);
        marriageVolumeRampTimer = null;
        player.volume = Math.max(0, Math.min(1, targetVol));
      }
    }, stepInterval);
  }

  function triggerMarriageIntermission() {
    // Step 1: Immediately lock trigger before async operations to prevent double-firing
    state.marriageBgmPlayed = true;
    state.marriageBgmPlaying = true;

    const rosePlayer = DOM.bgAudioPlayer;
    const theriPlayer = DOM.marriageBgmPlayer;

    if (!theriPlayer) {
      console.warn('Marriage BGM player element not found');
      state.marriageBgmPlaying = false;
      return;
    }

    // Step 2: Capture The Rose position
    if (rosePlayer) {
      state.savedRosePosition = rosePlayer.currentTime;
    }

    // Step 3: Fade The Rose out smoothly over approximately 2 seconds
    if (rosePlayer && !rosePlayer.paused) {
      smoothRampLetterVolume(0, 2000);
      setTimeout(() => {
        if (state.marriageBgmPlaying && rosePlayer) {
          rosePlayer.pause();
          rosePlayer.currentTime = state.savedRosePosition;
        }
        startTheriPlayback();
      }, 2100);
    } else {
      if (rosePlayer) {
        rosePlayer.currentTime = state.savedRosePosition;
      }
      startTheriPlayback();
    }
  }

  function startTheriPlayback() {
    const theriPlayer = DOM.marriageBgmPlayer;
    if (!theriPlayer) return;

    theriPlayer.currentTime = 0;
    const effectiveVol = getEffectiveTheriVolume();
    theriPlayer.volume = effectiveVol;

    const playPromise = theriPlayer.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        state.musicPlaying = !state.userMusicMuted;
        if (!state.userMusicMuted) {
          DOM.musicStatusText.textContent = 'Playing';
          DOM.btnMusicToggle.classList.add('active');
        }
      }).catch(err => {
        console.warn('Theri Marriage BGM playback error:', err);
      });
    }
  }

  function handleTheriEnded() {
    // Step 1: Mark Theri as completed
    state.marriageBgmPlaying = false;

    // Step 2: Approximately 1 second of silence / breathing space
    if (theriBreathingTimeout) clearTimeout(theriBreathingTimeout);
    theriBreathingTimeout = setTimeout(() => {
      const rosePlayer = DOM.bgAudioPlayer;
      if (!rosePlayer) return;

      // In case letter was already completed, closing book, or flute is active
      if (state.letterBgmFadingOut || state.fluteStageActive) return;

      // Step 3: Restore The Rose to the EXACT saved timestamp
      rosePlayer.currentTime = state.savedRosePosition;

      if (state.userMusicMuted) {
        rosePlayer.pause();
        state.letterBgmPlaying = true;
        return;
      }

      // Step 4: Resume The Rose
      rosePlayer.volume = 0.01;
      const playPromise = rosePlayer.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          state.letterBgmPlaying = true;
          state.musicPlaying = true;
          DOM.musicStatusText.textContent = 'Playing';
          DOM.btnMusicToggle.classList.add('active');

          // Step 5: Smoothly ramp The Rose to current page's target volume over approximately 2 seconds
          const targetVol = getEffectiveLetterVolume(state.currentPage);
          smoothRampLetterVolume(targetVol, 2000);
        }).catch(err => {
          console.warn('Resume The Rose error after Theri:', err);
        });
      }
    }, 1000);
  }

  // --- TRANSITION FROM INTRO INTO THE BOOK ---
  function openBookFromIntro() {
    // 1. IMMEDIATELY stop the 35-second birthday BGM
    stopBirthdayBgm();

    // 2. Play paper rustle sound
    audio.init();
    audio.playPaperRustle();

    // 3. Zoom out intro and open the book
    DOM.intro.classList.add('exit-zoom');

    setTimeout(() => {
      DOM.intro.classList.remove('active');
      DOM.intro.style.display = 'none';
      DOM.bookStage.classList.add('active');
      renderCurrentPage();
      startLetterBgm();
    }, 1100);
  }

  // --- PAGE RENDERING & SCENE ENGINE ---
  function renderCurrentPage() {
    const pageIndex = state.currentPage - 1;
    const pageData = window.LETTER_PAGES[pageIndex];
    if (!pageData) return;

    // Update Top Counter & Chapter
    DOM.currentPageNum.textContent = String(state.currentPage).padStart(2, '0');
    DOM.currentChapterTitle.textContent = pageData.title;

    // Trigger Theri Marriage Intermission when Page 10 is reached for the first time
    if (state.currentPage === 10 && !state.marriageBgmPlayed) {
      triggerMarriageIntermission();
    } else {
      // Update Letter BGM Volume according to current page phase
      updateLetterBgmPhase(state.currentPage);
    }

    // Update active state in TOC
    const tocBtns = DOM.tocListItems.querySelectorAll('.toc-item-btn');
    tocBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === pageIndex);
    });

    // Update Left Page (Desktop context: displays previous page text or introductory book leaf)
    if (state.currentPage === 1) {
      if (DOM.pageLeftThemeTag) DOM.pageLeftThemeTag.textContent = 'Dedication';
      DOM.pageLeftText.innerHTML = `
        <div class="page-dedication-leaf">
          <div class="dedication-crown">❦</div>
          <h2 class="dedication-for">For My Ammuuu</h2>
          <h3 class="dedication-nick">(Rakshashiiiiiiii)</h3>
          <div class="dedication-rule"></div>
          <p class="dedication-text">Written with 1000% focus and unconditional love</p>
          <div class="dedication-heart">♡</div>
        </div>
      `;
      DOM.pageLeftFooterNum.textContent = `♡ Book of Ammuuu ♡`;
    } else {
      const prevData = window.LETTER_PAGES[pageIndex - 1];
      if (DOM.pageLeftThemeTag) DOM.pageLeftThemeTag.textContent = prevData.title;
      DOM.pageLeftText.textContent = prevData.content;
      DOM.pageLeftFooterNum.textContent = `♡ ${String(state.currentPage - 1).padStart(2, '0')} ♡`;
    }

    // Update Right Page (Exact letter text rendered verbatim, except page 21 where handwritten calligraphy is featured)
    if (pageData.id === 21) {
      DOM.pageRightText.textContent = '';
    } else {
      DOM.pageRightText.textContent = pageData.content;
    }
    DOM.pageRightFooterNum.textContent = `♡ ${String(state.currentPage).padStart(2, '0')} ♡`;
    DOM.pageRightThemeTag.textContent = pageData.title;

    // Update Prev / Next Buttons
    DOM.btnPrevPage.disabled = state.currentPage === 1;
    DOM.btnNextPage.innerHTML = state.currentPage === state.totalPages 
      ? `<span class="nav-label">Close Book ♡</span><span class="arrow-symbol">›</span>`
      : `<span class="nav-label">Turn Page</span><span class="arrow-symbol">›</span>`;

    // Reset all scroll positions to top for mobile reading comfort
    if (DOM.pageRightContent) {
      DOM.pageRightContent.scrollTop = 0;
    }
    if (DOM.pageRightText) {
      DOM.pageRightText.scrollTop = 0;
    }
    if (DOM.pageLeftText) {
      DOM.pageLeftText.scrollTop = 0;
    }

    // Render Story-Driven Visual Scenes
    renderPageScene(pageData);
  }

  // Render specific letter-driven scene moments
  function renderPageScene(pageData) {
    DOM.pageSceneStage.innerHTML = '';
    const id = pageData.id;

    // Reset particle mode to default stars unless scene overrides
    state.particleMode = 'stars';

    switch (id) {
      case 1: // Morning to Night (Pristine, elegant reading without intrusive overlays)
        state.particleMode = 'stars';
        break;

      case 2: // The Efforts (Pristine text reading)
        state.particleMode = 'stars';
        break;

      case 3: // 30 km & Blooming Lilies with Tap Petal Burst and Photo Memories
        state.particleMode = 'petals';
        const lilyWrap = document.createElement('div');
        lilyWrap.className = 'lily-container';
        lilyWrap.style.pointerEvents = 'auto';
        lilyWrap.style.cursor = 'pointer';
        lilyWrap.title = 'Tap to shower petals & open lily album 🪷';
        lilyWrap.innerHTML = `
          <svg class="lily-svg" viewBox="0 0 100 100" id="lily-flower-svg">
            <path d="M50 85 C45 60, 20 40, 25 15 C35 25, 45 40, 50 85 Z" fill="#fffaf2" stroke="#e6c575" stroke-width="1.2"/>
            <path d="M50 85 C55 60, 80 40, 75 15 C65 25, 55 40, 50 85 Z" fill="#fffaf2" stroke="#e6c575" stroke-width="1.2"/>
            <path d="M50 85 C35 70, 10 70, 5 50 C20 50, 40 65, 50 85 Z" fill="#fff5ea" stroke="#e6c575" stroke-width="1"/>
            <path d="M50 85 C65 70, 90 70, 95 50 C80 50, 60 65, 50 85 Z" fill="#fff5ea" stroke="#e6c575" stroke-width="1"/>
            <circle cx="50" cy="55" r="4" fill="#ffb703" />
          </svg>
          <div class="lily-distance-tag">30 km 🚗💨</div>
        `;
        DOM.pageSceneStage.appendChild(lilyWrap);

        lilyWrap.addEventListener('click', (e) => {
          if (window.particleWorld) {
            for (let k = 0; k < 8; k++) {
              window.particleWorld.addTouchSparkle(e.clientX || window.innerWidth - 60, e.clientY || 80);
            }
          }
          audio.playPaperRustle();
          openLilyGalleryModal(0);
        });

        // Render inline Polaroid Keepsake Section into DOM.pageRightText
        if (pageData.photos && pageData.photos.length > 0) {
          const memoriesSection = document.createElement('div');
          memoriesSection.className = 'lily-memories-section';

          const tilts = [-2.5, 1.8, -1.5, 2.2, -2, 1.5, -1.8];

          memoriesSection.innerHTML = `
            <div class="lily-memories-header">
              <div class="lily-memories-title-group">
                <span class="lily-mini-icon">🪷</span>
                <span class="lily-memories-heading">Moments from that 30 km Ride</span>
                <span class="lily-photos-count">${pageData.photos.length} Photos</span>
              </div>
              <button id="btn-open-lily-album-inline" class="btn-view-all-photos" title="Expand Fullscreen Gallery">
                <span>Open Album</span> 📸
              </button>
            </div>
            <div class="lily-polaroid-reel" id="lily-inline-polaroids" aria-label="30 km Lily photo memories"></div>
          `;

          const reel = memoriesSection.querySelector('#lily-inline-polaroids');
          pageData.photos.forEach((photo, idx) => {
            const card = document.createElement('div');
            card.className = 'lily-polaroid-card';
            card.style.setProperty('--card-i', idx);
            card.style.setProperty('--polaroid-tilt', `rotate(${tilts[idx % tilts.length]}deg)`);
            card.style.animationDelay = `${0.35 + (idx * 0.08)}s`;
            card.title = `${photo.title} — Tap to view in full size`;
            card.innerHTML = `
              <div class="lily-polaroid-img-wrap">
                <img src="${photo.src}" alt="${photo.title}" class="lily-polaroid-img" loading="lazy">
                <span class="lily-polaroid-badge">${idx + 1}/${pageData.photos.length}</span>
              </div>
              <div class="lily-polaroid-caption-small">${photo.title}</div>
            `;
            card.addEventListener('click', (e) => {
              if (window.particleWorld) {
                window.particleWorld.addTouchSparkle(e.clientX, e.clientY);
              }
              audio.playPaperRustle();
              openLilyGalleryModal(idx);
            });
            reel.appendChild(card);
          });

          const btnOpenAlbum = memoriesSection.querySelector('#btn-open-lily-album-inline');
          btnOpenAlbum.addEventListener('click', (e) => {
            if (window.particleWorld) {
              window.particleWorld.addTouchSparkle(e.clientX, e.clientY);
            }
            audio.playPaperRustle();
            openLilyGalleryModal(0);
          });

          DOM.pageRightText.appendChild(memoriesSection);
        }
        break;

      case 4: // Guitar to Flute Transition & Stage Trigger Button
        state.particleMode = 'notes';
        const fluteBadge = document.createElement('div');
        fluteBadge.className = 'flute-trigger-badge inline-flute-badge';
        fluteBadge.innerHTML = `
          <button id="btn-trigger-flute-modal" class="btn-open-flute-stage">
            <span class="btn-flute-icon">🪈</span>
            <span>Watch Nandhu's Flute Video 🎶</span>
          </button>
        `;
        DOM.pageRightText.appendChild(fluteBadge);
        document.getElementById('btn-trigger-flute-modal').addEventListener('click', openFluteVideoStage);
        break;

      case 5: // Constellation details registered
        const constWrap = document.createElement('div');
        constWrap.className = 'detail-constellation-wrap';
        constWrap.style.pointerEvents = 'auto';
        const tags = ['photos istam ✨', 'music istam 🎵', 'ac padadhu ❄️', 'traditions istam 🥻', 'choclates istam 🍫'];
        tags.forEach(tag => {
          const t = document.createElement('span');
          t.className = 'detail-tag';
          t.style.cursor = 'pointer';
          t.textContent = tag;
          t.addEventListener('click', (e) => {
            t.style.transform = 'scale(1.25)';
            if (window.particleWorld) {
              window.particleWorld.addTouchSparkle(e.clientX, e.clientY);
            }
            audio.playPaperRustle();
            setTimeout(() => t.style.transform = 'scale(1)', 400);
          });
          constWrap.appendChild(t);
        });
        DOM.pageRightText.appendChild(constWrap);
        break;

      case 6: // Aspiration embers
        state.particleMode = 'embers';
        break;

      case 7: // Two Times Animation: Two points merging into one heart
        const twoWrap = document.createElement('div');
        twoWrap.className = 'two-times-container';
        twoWrap.innerHTML = `
          <div class="two-points-wrap">
            <span class="glow-point p1" title="FIRST"></span>
            <span class="glow-point p2" title="SECOND"></span>
            <span class="merged-heart-glow">💗</span>
          </div>
        `;
        DOM.pageSceneStage.appendChild(twoWrap);
        break;

      case 8: // Nuvey Prapancham & 10000W bulb
        const bulbWrap = document.createElement('div');
        bulbWrap.className = 'world-bulb-glow';
        DOM.pageSceneStage.appendChild(bulbWrap);
        break;

      case 9: // Mood Controller & Rain
        state.particleMode = 'rain';
        const moodBox = document.createElement('div');
        moodBox.className = 'mood-controller-box inline-mood-box';
        moodBox.innerHTML = `
          <button class="mood-heart-toggle" id="btn-mood-toggle" title="Click to boost mood">💗</button>
          <span class="mood-tag-text" id="mood-label-text">MOOD: controlled by AMMUUU</span>
        `;
        DOM.pageRightText.appendChild(moodBox);

        // Interactive mood boost
        const moodToggle = moodBox.querySelector('#btn-mood-toggle');
        const moodLabel = moodBox.querySelector('#mood-label-text');
        moodToggle.addEventListener('click', (e) => {
          moodToggle.style.transform = 'scale(1.4)';
          moodLabel.textContent = 'MOOD: 10000 WATTS HAPPY! 🌟';
          if (window.particleWorld) {
            for (let m = 0; m < 5; m++) {
              window.particleWorld.addTouchSparkle(e.clientX, e.clientY);
            }
          }
          audio.playPaperRustle();
          setTimeout(() => {
            moodToggle.style.transform = 'scale(1)';
            moodLabel.textContent = 'MOOD: controlled by AMMUUU';
          }, 2600);
        });

        // Gentle rain overlay
        const rainOverlay = document.createElement('div');
        rainOverlay.className = 'rain-glass-overlay';
        for (let r = 0; r < 20; r++) {
          const drop = document.createElement('div');
          drop.className = 'rain-drop';
          drop.style.left = `${Math.random() * 100}%`;
          drop.style.height = `${Math.random() * 40 + 20}px`;
          drop.style.animationDuration = `${Math.random() * 0.8 + 0.6}s`;
          drop.style.animationDelay = `${Math.random() * 1.5}s`;
          rainOverlay.appendChild(drop);
        }
        DOM.pageSceneStage.appendChild(rainOverlay);
        break;

      case 13: // Vulnerability & Fear - minimal, quiet
      case 17: // "I don't want to force you" - pure paper simplicity
        state.particleMode = 'minimal';
        break;

      case 15: // Queen & Devathaa Crown to Halo
        const crownWrap = document.createElement('div');
        crownWrap.className = 'crown-halo-container';
        crownWrap.innerHTML = `
          <svg class="crown-svg" viewBox="0 0 100 100">
            <path d="M20 70 L30 35 L50 55 L70 35 L80 70 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
            <circle cx="30" cy="32" r="3" fill="currentColor"/>
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
            <circle cx="70" cy="32" r="3" fill="currentColor"/>
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.75"/>
          </svg>
        `;
        DOM.pageSceneStage.appendChild(crownWrap);
        break;

      case 18: // First person to open arms spotlight
        const armsGlow = document.createElement('div');
        armsGlow.className = 'open-arms-spotlight-glow';
        DOM.pageSceneStage.appendChild(armsGlow);
        break;

      case 19: // Rarest Most Valuable Treasure: Gemstone morphing to Heart
        const gemWrap = document.createElement('div');
        gemWrap.className = 'treasure-gem-wrap';
        gemWrap.innerHTML = `<div class="gem-icon">💎</div>`;
        DOM.pageSceneStage.appendChild(gemWrap);
        break;

      case 20: // Love Declaration Breathing Glow
        const decAura = document.createElement('div');
        decAura.className = 'declaration-glow-aura';
        DOM.pageSceneStage.appendChild(decAura);
        break;

      case 21: // Handwritten signature
        const signContainer = document.createElement('div');
        signContainer.className = 'signature-calligraphy';
        signContainer.innerHTML = `
          <div class="itlu-text">itlu,</div>
          <div class="sign-nandhu">Nandhuuuuuu <span class="sign-heart-doodle">♡</span></div>
          <div class="sign-waste-fellow">(Wastee Felloooww)</div>
        `;
        DOM.pageRightText.appendChild(signContainer);
        break;

      default:
        state.particleMode = 'stars';
        break;
    }
  }

  // --- PAGE TURNING ENGINE (WITH 3D CURL & SOUND) ---
  function turnNextPage() {
    if (state.isTurningPage) return;

    // Check if at the end of the book
    if (state.currentPage >= state.totalPages) {
      closeBookToFinale();
      return;
    }

    state.isTurningPage = true;
    audio.playPaperRustle();

    const isMobile = window.innerWidth <= 960;
    const duration = isMobile ? 650 : 850;
    const swapTime = isMobile ? 320 : 420;

    const rightPage = DOM.pageRightDisplay;
    rightPage.classList.add('flipping-next');

    // Midway through the curl/transition, update content
    setTimeout(() => {
      state.currentPage++;
      renderCurrentPage();
    }, swapTime);

    setTimeout(() => {
      rightPage.classList.remove('flipping-next');
      state.isTurningPage = false;
    }, duration);

    // Watchdog safety: guarantees state.isTurningPage never remains stuck
    setTimeout(() => {
      state.isTurningPage = false;
      if (rightPage) rightPage.classList.remove('flipping-next');
    }, duration + 100);
  }

  function turnPrevPage() {
    if (state.isTurningPage || state.currentPage <= 1) return;

    state.isTurningPage = true;
    audio.playPaperRustle();

    const isMobile = window.innerWidth <= 960;
    const duration = isMobile ? 650 : 850;
    const swapTime = isMobile ? 320 : 420;

    const rightPage = DOM.pageRightDisplay;
    rightPage.classList.add('flipping-prev');

    setTimeout(() => {
      state.currentPage--;
      renderCurrentPage();
    }, swapTime);

    setTimeout(() => {
      rightPage.classList.remove('flipping-prev');
      state.isTurningPage = false;
    }, duration);

    // Watchdog safety: guarantees state.isTurningPage never remains stuck
    setTimeout(() => {
      state.isTurningPage = false;
      if (rightPage) rightPage.classList.remove('flipping-prev');
    }, duration + 100);
  }

  function goToPage(targetPageNum) {
    if (targetPageNum < 1 || targetPageNum > state.totalPages) return;
    audio.playPaperRustle();
    state.currentPage = targetPageNum;
    renderCurrentPage();
  }

  // --- CINEMATIC FLUTE VIDEO STAGE ---
  function openFluteVideoStage() {
    state.fluteStageActive = true;
    DOM.fluteModal.classList.add('active');

    // Pause whichever background audio is actively playing with zero overlap
    if (state.marriageBgmPlaying && DOM.marriageBgmPlayer && !DOM.marriageBgmPlayer.paused) {
      state.flutePausedAudio = 'theri';
      smoothRampMarriageVolume(0, 200);
      setTimeout(() => {
        if (state.fluteStageActive && DOM.marriageBgmPlayer) {
          DOM.marriageBgmPlayer.pause();
        }
      }, 220);
    } else if (state.letterBgmPlaying && DOM.bgAudioPlayer && !DOM.bgAudioPlayer.paused) {
      state.flutePausedAudio = 'rose';
      pauseLetterBgmForFlute();
    } else {
      state.flutePausedAudio = null;
    }

    // Check if video file loads or shows fallback
    const video = DOM.fluteVideoPlayer;
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback display if video source not found yet
        DOM.fluteFallback.classList.remove('hidden');
      });
    }

    video.onerror = () => {
      DOM.fluteFallback.classList.remove('hidden');
    };
  }

  function closeFluteVideoStage() {
    state.fluteStageActive = false;
    if (DOM.fluteVideoPlayer) {
      DOM.fluteVideoPlayer.pause();
    }
    DOM.fluteModal.classList.remove('active');
    audio.playPaperRustle();

    // Resume the exact previously active background audio from its exact timestamp
    if (state.flutePausedAudio === 'theri') {
      if (DOM.marriageBgmPlayer && !state.userMusicMuted) {
        DOM.marriageBgmPlayer.play().then(() => {
          smoothRampMarriageVolume(getEffectiveTheriVolume(), 800);
        }).catch(err => console.warn('Resume Theri after flute error:', err));
      }
      state.flutePausedAudio = null;
    } else if (state.flutePausedAudio === 'rose') {
      resumeLetterBgmAfterFlute();
      state.flutePausedAudio = null;
    } else {
      state.flutePausedAudio = null;
    }
  }

  // --- CINEMATIC LILY MEMORY GALLERY MODAL ---
  function openLilyGalleryModal(initialIndex = 0) {
    state.lilyGalleryActive = true;
    state.currentLilyPhotoIndex = initialIndex;
    DOM.lilyGalleryModal.classList.add('active');

    // Populate thumbnails
    renderLilyThumbnails();

    // Display selected photo
    showLilyPhoto(initialIndex, true);

    if (window.particleWorld) {
      for (let i = 0; i < 8; i++) {
        window.particleWorld.addTouchSparkle(
          window.innerWidth / 2 + (Math.random() * 240 - 120),
          window.innerHeight / 2 + (Math.random() * 200 - 100)
        );
      }
    }
  }

  function closeLilyGalleryModal() {
    state.lilyGalleryActive = false;
    DOM.lilyGalleryModal.classList.remove('active');
    audio.playPaperRustle();
  }

  function renderLilyThumbnails() {
    const pageData = window.LETTER_PAGES[2]; // Page 3 (id: 3)
    if (!pageData || !pageData.photos) return;

    DOM.lilyThumbnailsRow.innerHTML = '';
    pageData.photos.forEach((photo, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `lily-thumb-item ${idx === state.currentLilyPhotoIndex ? 'active' : ''}`;
      thumb.title = photo.title;
      thumb.innerHTML = `<img src="${photo.src}" alt="${photo.title}">`;
      thumb.addEventListener('click', () => {
        showLilyPhoto(idx);
      });
      DOM.lilyThumbnailsRow.appendChild(thumb);
    });
  }

  function showLilyPhoto(index, isOpening = false) {
    const pageData = window.LETTER_PAGES[2];
    if (!pageData || !pageData.photos) return;
    const photos = pageData.photos;

    // Wrap around navigation
    let newIndex = index;
    if (newIndex < 0) newIndex = photos.length - 1;
    if (newIndex >= photos.length) newIndex = 0;

    state.currentLilyPhotoIndex = newIndex;
    const photo = photos[newIndex];

    if (!isOpening) {
      audio.playPaperRustle();
    }

    // Shimmer effect on polaroid frame
    DOM.lilyPhotoFrame.classList.remove('shimmer-active');
    void DOM.lilyPhotoFrame.offsetWidth;
    DOM.lilyPhotoFrame.classList.add('shimmer-active');

    DOM.lilyLightboxImg.style.opacity = '0.35';
    DOM.lilyLightboxImg.style.transform = 'scale(0.97)';

    setTimeout(() => {
      DOM.lilyLightboxImg.src = photo.src;
      DOM.lilyLightboxImg.alt = photo.title;
      DOM.lilyLightboxCaption.textContent = photo.caption;
      DOM.lilyLightboxDate.textContent = photo.date;
      DOM.lilyPhotoCounter.textContent = `${String(newIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;

      DOM.lilyLightboxImg.style.opacity = '1';
      DOM.lilyLightboxImg.style.transform = 'scale(1)';

      // Update active thumbnail
      const thumbs = DOM.lilyThumbnailsRow.querySelectorAll('.lily-thumb-item');
      thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === newIndex);
        if (i === newIndex) {
          t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    }, 120);
  }

  function nextLilyPhoto() {
    showLilyPhoto(state.currentLilyPhotoIndex + 1);
  }

  function prevLilyPhoto() {
    showLilyPhoto(state.currentLilyPhotoIndex - 1);
  }

  // --- CLOSING SCENE & FINAL SECRET ---
  function closeBookToFinale() {
    audio.playPaperRustle();
    DOM.bookStage.classList.remove('active');

    // If Theri is still playing during rapid navigation to finale, stop it cleanly
    if (state.marriageBgmPlaying && DOM.marriageBgmPlayer) {
      smoothRampMarriageVolume(0, 1000);
      setTimeout(() => {
        if (DOM.marriageBgmPlayer) {
          DOM.marriageBgmPlayer.pause();
        }
      }, 1050);
      state.marriageBgmPlaying = false;
    }

    // 5-7 seconds emotional breathing room before 4-second fade out to silence
    setTimeout(() => {
      fadeoutLetterBgm(4000);
    }, 6000);

    setTimeout(() => {
      DOM.bookStage.style.display = 'none';
      DOM.closingScene.classList.add('active');

      // Sequence of farewell lines
      setTimeout(() => DOM.closeLine1.classList.add('show'), 1000);
      setTimeout(() => DOM.closeLine2.classList.add('show'), 2600);
      setTimeout(() => DOM.closeLine3.classList.add('show'), 4200);
      setTimeout(() => DOM.finalSecretTrigger.classList.add('show'), 5800);
    }, 800);
  }

  function openSecretModal() {
    DOM.secretModal.classList.add('active');
    audio.playPaperRustle();
  }

  function closeSecretModal() {
    DOM.secretModal.classList.remove('active');
  }

  function replayExperience() {
    closeSecretModal();
    DOM.closingScene.classList.remove('active');

    // Reset marriage intermission state cleanly
    state.marriageBgmPlayed = false;
    state.marriageBgmPlaying = false;
    state.savedRosePosition = 0;
    state.flutePausedAudio = null;
    if (theriBreathingTimeout) {
      clearTimeout(theriBreathingTimeout);
      theriBreathingTimeout = null;
    }
    if (DOM.marriageBgmPlayer) {
      DOM.marriageBgmPlayer.pause();
      DOM.marriageBgmPlayer.currentTime = 0;
    }

    setTimeout(() => {
      DOM.closingScene.style.display = 'none';
      DOM.bookStage.style.display = 'flex';
      DOM.bookStage.classList.add('active');
      goToPage(1);

      // Replay The Rose BGM smoothly from start of letter
      state.letterBgmPlaying = false;
      state.letterBgmFadingOut = false;
      startLetterBgm();
    }, 600);
  }

  // --- TOC DRAWER CONTROLS ---
  function openTOC() {
    DOM.tocDrawer.classList.add('active');
  }

  function closeTOC() {
    DOM.tocDrawer.classList.remove('active');
  }

  // --- TOUCH SWIPE & SPARKLES RECOGNITION (MOBILE) ---
  function setupTouchSwipes() {
    let startX = 0;
    let startY = 0;
    let touchStartTime = 0;
    let touchTarget = null;
    let isDragging = false;

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length >= 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        touchStartTime = Date.now();
        touchTarget = e.target;
        isDragging = false;

        if (window.particleWorld) {
          window.particleWorld.addTouchSparkle(startX, startY);
        }
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length >= 1) {
        const moveX = Math.abs(e.touches[0].clientX - startX);
        const moveY = Math.abs(e.touches[0].clientY - startY);
        if (moveX > 8 || moveY > 8) {
          isDragging = true;
        }
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      // Must be on the active book reading experience
      if (!DOM.bookStage || !DOM.bookStage.classList.contains('active')) return;
      if (state.isTurningPage) return;
      if (state.fluteStageActive || state.lilyGalleryActive || 
          (DOM.tocDrawer && DOM.tocDrawer.classList.contains('active')) || 
          (DOM.secretModal && DOM.secretModal.classList.contains('active'))) {
        return;
      }

      // Ignore if user was adjusting the volume slider
      if (touchTarget && touchTarget.closest && touchTarget.closest('input[type="range"]')) {
        return;
      }

      if (e.changedTouches.length === 1) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const elapsedTime = Date.now() - touchStartTime;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Intentional horizontal thumb swipe across page:
        // Requires deliberate horizontal travel (at least 65px),
        // strictly horizontal (absX >= absY * 1.6 to prevent reading scroll interference),
        // and completed in under 750ms.
        if (elapsedTime <= 750 && absX >= 65 && absX >= absY * 1.6) {
          if (deltaX < 0) {
            turnNextPage(); // Swiped left -> Next page with 3D curl
          } else {
            turnPrevPage(); // Swiped right -> Prev page with 3D curl
          }
        }
      }
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      if (window.particleWorld && Math.random() > 0.6) {
        window.particleWorld.addTouchSparkle(e.clientX, e.clientY);
      }
    }, { passive: true });
  }

  // --- KEYBOARD ARROW NAVIGATION ---
  function setupKeyboardNav() {
    window.addEventListener('keydown', (e) => {
      if (state.lilyGalleryActive) {
        if (e.key === 'Escape') closeLilyGalleryModal();
        else if (e.key === 'ArrowRight') nextLilyPhoto();
        else if (e.key === 'ArrowLeft') prevLilyPhoto();
        return;
      }

      if (state.fluteStageActive) {
        if (e.key === 'Escape') closeFluteVideoStage();
        return;
      }

      if (DOM.tocDrawer.classList.contains('active')) {
        if (e.key === 'Escape') closeTOC();
        return;
      }

      if (DOM.secretModal.classList.contains('active')) {
        if (e.key === 'Escape') closeSecretModal();
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        turnNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        turnPrevPage();
      }
    });
  }

  // --- ATTACH EVENT LISTENERS ---
  function attachEventListeners() {
    // Intro Open Book Button
    DOM.btnOpenBook.addEventListener('click', openBookFromIntro);

    // Book Navigation Buttons
    DOM.btnNextPage.addEventListener('click', turnNextPage);
    DOM.btnPrevPage.addEventListener('click', turnPrevPage);

    // TOC Drawer Buttons
    DOM.btnTocOpen.addEventListener('click', openTOC);
    DOM.btnCloseToc.addEventListener('click', closeTOC);
    DOM.tocBackdrop.addEventListener('click', closeTOC);

    // Flute Video Stage Buttons
    DOM.btnCloseFluteStage.addEventListener('click', closeFluteVideoStage);
    DOM.fluteBackdrop.addEventListener('click', closeFluteVideoStage);
    DOM.btnTestFluteAudio.addEventListener('click', () => audio.playFluteSampleMelody());

    // Lily Photo Gallery Modal Buttons
    DOM.btnCloseLilyGallery.addEventListener('click', closeLilyGalleryModal);
    DOM.btnReturnFromLily.addEventListener('click', closeLilyGalleryModal);
    DOM.lilyGalleryBackdrop.addEventListener('click', closeLilyGalleryModal);
    DOM.btnLilyPrev.addEventListener('click', prevLilyPhoto);
    DOM.btnLilyNext.addEventListener('click', nextLilyPhoto);

    // Lily Gallery Touch Swipe for mobile
    let lilyTouchStartX = 0;
    let lilyTouchStartY = 0;
    DOM.lilyGalleryModal.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        lilyTouchStartX = e.touches[0].clientX;
        lilyTouchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    DOM.lilyGalleryModal.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - lilyTouchStartX;
        const deltaY = e.changedTouches[0].clientY - lilyTouchStartY;
        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
          if (deltaX < 0) {
            nextLilyPhoto();
          } else {
            prevLilyPhoto();
          }
        }
      }
    }, { passive: true });

    // Secret Modal Buttons
    DOM.btnSecretHeart.addEventListener('click', openSecretModal);
    DOM.secretBackdrop.addEventListener('click', closeSecretModal);
    DOM.btnReplayExperience.addEventListener('click', replayExperience);

    // Audio Widget Controls
    DOM.btnMusicToggle.addEventListener('click', () => {
      audio.toggleAmbientMusic(!state.musicPlaying);
    });

    DOM.musicVolumeSlider.addEventListener('input', (e) => {
      audio.setVolume(parseFloat(e.target.value));
    });

    DOM.btnSfxToggle.addEventListener('click', () => {
      state.sfxEnabled = !state.sfxEnabled;
      DOM.btnSfxToggle.classList.toggle('active', state.sfxEnabled);
    });

    // Theri Marriage Proposal BGM ended listener (registered ONCE)
    if (DOM.marriageBgmPlayer) {
      DOM.marriageBgmPlayer.addEventListener('ended', handleTheriEnded);
    }
  }

  // --- BOOTSTRAP APPLICATION ---
  window.addEventListener('DOMContentLoaded', () => {
    // Start particle system with touch sparkles
    window.particleWorld = new ParticleWorld(DOM.canvas);

    // Initialize dataset & chapters
    initDataAndTOC();

    // Setup input listeners
    attachEventListeners();
    setupTouchSwipes();
    setupKeyboardNav();

    // Start birthday BGM and synchronized opening experience
    startBirthdayBgm();
  });

  // Expose state for inspection and automated verification
  window.__appState = state;

})();
