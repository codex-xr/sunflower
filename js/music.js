/**
 * Sunflower Romantic Music Controller
 * Manages Giveon - Dancing in the Smoke playback, floating vinyl widget, and fallback synth.
 */

class MusicController {
  constructor() {
    this.config = window.SUNFLOWER_CONFIG ? window.SUNFLOWER_CONFIG.music : {
      title: "Dancing in the Smoke",
      artist: "Giveon",
      src: "assets/audio/music.mp3"
    };

    this.isPlaying = false;
    this.audio = new Audio();
    this.audio.loop = true;
    this.hasUserInteracted = false;
    this.useSynthFallback = false;
    this.audioCtx = null;
    this.synthInterval = null;

    this.vinylEl = document.getElementById('music-vinyl');
    this.toggleBtn = document.getElementById('music-toggle-btn');
    this.statusText = document.getElementById('music-status-text');

    this.initAudioSources();
    this.bindEvents();
  }

  initAudioSources() {
    // Check multiple common file names for convenience
    const candidateSources = [
      this.config.src,
      'assets/audio/dancing-in-the-smoke.mp3',
      'assets/audio/giveon.mp3',
      'assets/audio/music.mp3'
    ];

    this.audio.src = candidateSources[0];

    // If audio fails to load, gracefully fall back to romantic synth chime
    this.audio.addEventListener('error', () => {
      console.info("Custom MP3 not found yet in assets/audio/. Using romantic ambient melody fallback until music.mp3 is added.");
      this.useSynthFallback = true;
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateUI(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateUI(false);
    });
  }

  bindEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    if (this.vinylEl) {
      this.vinylEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    // Unlock audio context on any early tap/click
    const unlockAudio = () => {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        // Pre-prime audio
        this.audio.load();
      }
    };

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
  }

  play() {
    if (this.isPlaying) return;

    if (!this.useSynthFallback) {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          this.updateUI(true);
        }).catch(err => {
          console.warn("Autoplay deferred or audio file missing:", err);
          this.startRomanticSynth();
        });
      }
    } else {
      this.startRomanticSynth();
    }
  }

  pause() {
    if (!this.useSynthFallback) {
      this.audio.pause();
    } else {
      this.stopRomanticSynth();
    }
    this.isPlaying = false;
    this.updateUI(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateUI(isPlaying) {
    if (this.vinylEl) {
      if (isPlaying) {
        this.vinylEl.classList.add('spinning');
      } else {
        this.vinylEl.classList.remove('spinning');
      }
    }

    if (this.toggleBtn) {
      this.toggleBtn.innerHTML = isPlaying 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      this.toggleBtn.setAttribute('title', isPlaying ? 'Pause Music' : 'Play Music');
    }

    if (this.statusText) {
      this.statusText.textContent = isPlaying ? `Playing: ${this.config.title}` : 'Music Paused';
    }
  }

  /**
   * Romantic Soft Web Audio Music Box Fallback (plays if mp3 not yet added)
   */
  startRomanticSynth() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.isPlaying = true;
      this.updateUI(true);

      // Sweet chord notes in F major (F3, A3, C4, E4, G4, A4)
      const notes = [
        174.61, 220.00, 261.63, 329.63, 392.00, 440.00, 523.25
      ];
      let step = 0;

      const playChime = () => {
        if (!this.isPlaying || !this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const freq = notes[step % notes.length];
        step = (step + 1 + Math.floor(Math.random() * 2)) % notes.length;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 2.0);
      };

      if (this.synthInterval) clearInterval(this.synthInterval);
      this.synthInterval = setInterval(playChime, 750);
      playChime();
    } catch (e) {
      console.warn("Web Audio not supported", e);
    }
  }

  stopRomanticSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isPlaying = false;
  }
}

window.MusicController = MusicController;
