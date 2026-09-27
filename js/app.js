/**
 * Main Application Controller for Sunflower Birthday Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.SUNFLOWER_CONFIG || {};
  let particles = null;
  let music = null;

  try {
    particles = new window.ParticleEngine();
  } catch (e) {
    console.warn("Particles engine initialization skipped:", e);
  }

  try {
    music = new window.MusicController();
  } catch (e) {
    console.warn("Music controller initialization skipped:", e);
  }

  // State
  let currentScreen = 1;
  const totalScreens = 9;
  let carouselIndex = 0;
  let carouselTimer = null;
  let slideshowIndex = 0;
  let screen6CountdownTimer = null;

  // Global access for failsafe inline handlers
  window.goToScreen = goToScreen;

  // DOM Elements
  const tapToOpenBox = document.getElementById('btn-screen-1-open');
  const tapToOpenBtn = document.getElementById('btn-screen-1-open-btn');
  const readyYesBtn = document.getElementById('btn-ready-yes');
  const readyNoBtn = document.getElementById('btn-ready-no');
  const loveAlotBtn = document.getElementById('btn-love-alot');
  const loveAlittleBtn = document.getElementById('btn-love-alittle');
  const chatNextBtn = document.getElementById('btn-chat-next');
  const whoBtn = document.getElementById('btn-who');
  const screen6NextBtn = document.getElementById('btn-screen-6-next');
  const revealBtn = document.getElementById('btn-reveal');
  const slideshowPrevBtn = document.getElementById('slideshow-prev');
  const slideshowNextBtn = document.getElementById('slideshow-next');
  const slideshowFinishBtn = document.getElementById('btn-slideshow-finish');
  const virtualHugBtn = document.getElementById('btn-virtual-hug');
  const replayBtn = document.getElementById('btn-replay');
  const floatingMusicWidget = document.getElementById('music-widget');

  // Screen 1: "Tap to open"
  if (tapToOpenBox) {
    tapToOpenBox.addEventListener('click', (e) => {
      e.preventDefault();
      goToScreen(2);
    });
  }
  if (tapToOpenBtn) {
    tapToOpenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToScreen(2);
    });
  }

  // Screen 2: "Are you ready for a little surprise?"
  if (readyYesBtn) {
    readyYesBtn.addEventListener('click', () => {
      if (music) music.play();
      if (floatingMusicWidget) floatingMusicWidget.classList.add('visible');
      goToScreen(3);
    });
  }

  if (readyNoBtn) {
    readyNoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPlayfulModal({
        emoji: "🥺😭",
        title: "Try Again, Sunflower!",
        text: "You can't say no to this! Give it another shot with YES ❤️",
        btnText: "Okay, I'm ready! 🥰",
        onConfirm: () => {
          if (music) music.play();
          goToScreen(3);
        }
      });
    });
  }

  // Screen 3: "Do you know how much I love you?"
  if (loveAlotBtn) {
    loveAlotBtn.addEventListener('click', () => {
      if (particles) particles.celebrateBurst(window.innerWidth / 2, window.innerHeight / 2, 45);
      goToScreen(4);
    });
  }

  if (loveAlittleBtn) {
    loveAlittleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPlayfulModal({
        emoji: "🤨❤️",
        title: "Wrong Answer!",
        text: "A little?! You know it's deeper than the ocean! Pick the right one 😉",
        btnText: "Fine, A LOT! ❤️",
        onConfirm: () => {
          if (particles) particles.celebrateBurst(window.innerWidth / 2, window.innerHeight / 2, 45);
          goToScreen(4);
        }
      });
    });
  }

  // Screen 4: Chat Memory
  if (chatNextBtn) {
    chatNextBtn.addEventListener('click', () => goToScreen(5));
  }

  // Screen 5: "WHO? 👀"
  if (whoBtn) {
    whoBtn.addEventListener('click', () => {
      goToScreen(6);
      triggerBirthdayCelebration();
    });
  }

  // Screen 6: "YOU! 🌻❤️"
  if (screen6NextBtn) {
    screen6NextBtn.addEventListener('click', () => goToScreen(7));
  }

  // Screen 7: "Ehen... about that promise" -> "Reveal 🎁"
  if (revealBtn) {
    revealBtn.addEventListener('click', () => {
      if (particles) particles.celebrateBurst(window.innerWidth / 2, window.innerHeight / 2, 60);
      goToScreen(8);
    });
  }

  // Screen 8: Slideshow controls
  if (slideshowPrevBtn) {
    slideshowPrevBtn.addEventListener('click', () => changeSlideshowSlide(slideshowIndex - 1));
  }
  if (slideshowNextBtn) {
    slideshowNextBtn.addEventListener('click', () => changeSlideshowSlide(slideshowIndex + 1));
  }
  if (slideshowFinishBtn) {
    slideshowFinishBtn.addEventListener('click', () => goToScreen(9));
  }

  // Screen 9: Teddy Hug & Replay
  if (virtualHugBtn) {
    virtualHugBtn.addEventListener('click', () => triggerTeddyHug());
  }
  if (replayBtn) {
    replayBtn.addEventListener('click', () => goToScreen(1));
  }

  // Initialize Dynamic Features Safely
  try { populateConfigContent(); } catch (err) { console.error("Error populating config:", err); }
  try { initCarousel(); } catch (err) { console.error("Error initializing carousel:", err); }
  try { initSlideshow(); } catch (err) { console.error("Error initializing slideshow:", err); }
  try { initRunawayButtons(); } catch (err) { console.error("Error initializing runaway buttons:", err); }

  // Core Screen Switcher
  function goToScreen(targetIndex) {
    const fromEl = document.querySelector(`.screen[data-screen="${currentScreen}"]`);
    const toEl = document.querySelector(`.screen[data-screen="${targetIndex}"]`);

    if (!toEl) return;

    if (fromEl) {
      fromEl.classList.remove('active');
      fromEl.classList.add('exiting');
      setTimeout(() => {
        fromEl.classList.remove('exiting');
      }, 450);
    }

    currentScreen = targetIndex;
    toEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Screen specific triggers
    if (targetIndex === 6) {
      startScreen6Timer();
    } else {
      if (screen6CountdownTimer) clearInterval(screen6CountdownTimer);
    }

    if (targetIndex === 9 && particles) {
      particles.celebrateBurst(window.innerWidth / 2, window.innerHeight * 0.4, 50);
    }
  }

  /**
   * Runaway Button Physics
   */
  function initRunawayButtons() {
    const rNo = document.getElementById('btn-ready-no');
    const rLittle = document.getElementById('btn-love-alittle');
    const runawayButtons = [rNo, rLittle];

    runawayButtons.forEach(btn => {
      if (!btn) return;
      let dodgeCount = 0;

      const dodge = (e) => {
        if (dodgeCount < 5) {
          const maxOffsetX = Math.min(130, window.innerWidth * 0.3);
          const maxOffsetY = 70;

          const randomX = (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * maxOffsetX);
          const randomY = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * maxOffsetY);

          btn.style.transition = 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)';
          btn.style.transform = `translate3d(${randomX}px, ${randomY}px, 0) scale(0.92)`;

          dodgeCount++;

          if (dodgeCount === 2) {
            btn.innerHTML = btn.id.includes('ready') ? "Can't touch me! 😜" : "Still wrong! 🙈";
          } else if (dodgeCount === 4) {
            btn.innerHTML = "Just click YES! 😂";
          }
        }
      };

      btn.addEventListener('mouseenter', dodge);
      btn.addEventListener('touchstart', (e) => {
        if (dodgeCount < 4) {
          e.preventDefault();
          dodge(e);
        }
      }, { passive: false });
    });
  }

  /**
   * Screen 6 Celebration
   */
  function triggerBirthdayCelebration() {
    if (!particles) return;
    particles.celebrateBurst(window.innerWidth * 0.2, window.innerHeight * 0.3, 50);
    setTimeout(() => {
      particles.celebrateBurst(window.innerWidth * 0.8, window.innerHeight * 0.3, 50);
    }, 250);
    setTimeout(() => {
      particles.celebrateBurst(window.innerWidth * 0.5, window.innerHeight * 0.2, 70);
    }, 550);
  }

  /**
   * Screen 6 Timer
   */
  function startScreen6Timer() {
    const nextBtn = document.getElementById('btn-screen-6-next');
    const timerProgress = document.getElementById('screen-6-progress-bar');
    const timerText = document.getElementById('screen-6-timer-countdown');

    if (!nextBtn) return;

    let secondsLeft = 20;
    nextBtn.classList.remove('revealed');
    if (timerProgress) timerProgress.style.width = '0%';

    if (screen6CountdownTimer) clearInterval(screen6CountdownTimer);

    screen6CountdownTimer = setInterval(() => {
      secondsLeft--;
      const percentage = ((20 - secondsLeft) / 20) * 100;
      if (timerProgress) timerProgress.style.width = `${percentage}%`;
      if (timerText) timerText.textContent = `${secondsLeft}s`;

      if (secondsLeft <= 0) {
        clearInterval(screen6CountdownTimer);
        nextBtn.classList.add('revealed');
        if (timerText && timerText.parentElement) timerText.parentElement.style.opacity = '0';
      }
    }, 1000);
  }

  /**
   * Heart Carousel
   */
  function initCarousel() {
    const track = document.getElementById('heart-carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!track || !config.carouselPhotos || config.carouselPhotos.length === 0) return;

    track.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    config.carouselPhotos.forEach((photo, idx) => {
      const slide = document.createElement('div');
      slide.className = `carousel-slide ${idx === 0 ? 'active' : ''}`;
      slide.innerHTML = `
        <img src="${photo.src}" alt="${photo.alt}" onerror="this.onerror=null; this.src='assets/images/placeholder-her.svg';" />
        <div class="carousel-caption">${photo.caption}</div>
      `;
      track.appendChild(slide);

      if (dotsContainer) {
        const dot = document.createElement('span');
        dot.className = `dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => setCarouselSlide(idx));
        dotsContainer.appendChild(dot);
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        setCarouselSlide((carouselIndex - 1 + config.carouselPhotos.length) % config.carouselPhotos.length);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        setCarouselSlide((carouselIndex + 1) % config.carouselPhotos.length);
      });
    }

    if (carouselTimer) clearInterval(carouselTimer);
    carouselTimer = setInterval(() => {
      if (currentScreen === 6 && config.carouselPhotos) {
        setCarouselSlide((carouselIndex + 1) % config.carouselPhotos.length);
      }
    }, 4500);
  }

  function setCarouselSlide(idx) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('#carousel-dots .dot');
    if (!slides.length) return;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    carouselIndex = idx;
    if (slides[carouselIndex]) slides[carouselIndex].classList.add('active');
    if (dots[carouselIndex]) dots[carouselIndex].classList.add('active');
  }

  /**
   * Screen 8 Slideshow
   */
  function initSlideshow() {
    updateSlideshowUI();
    preloadAdjacentSlideshow(0);
  }

  function changeSlideshowSlide(newIndex) {
    const photos = config.slideshowPhotos;
    if (!photos || photos.length === 0) return;

    if (newIndex < 0) newIndex = 0;
    if (newIndex >= photos.length) newIndex = photos.length - 1;

    slideshowIndex = newIndex;
    updateSlideshowUI();
    preloadAdjacentSlideshow(slideshowIndex);
  }

  function preloadAdjacentSlideshow(index) {
    const photos = config.slideshowPhotos;
    if (!photos) return;
    for (let i = index + 1; i <= Math.min(index + 3, photos.length - 1); i++) {
      if (photos[i] && !photos[i].isVideo && !photos[i].src.endsWith('.mp4')) {
        const img = new Image();
        img.src = photos[i].src;
      }
    }
  }

  function updateSlideshowUI() {
    const photos = config.slideshowPhotos;
    if (!photos || !photos[slideshowIndex]) return;

    const currentItem = photos[slideshowIndex];
    const frameEl = document.querySelector('.slideshow-photo-frame');
    const eraEl = document.getElementById('slideshow-era-badge');
    const captionEl = document.getElementById('slideshow-caption');
    const counterEl = document.getElementById('slideshow-counter');
    const prevBtn = document.getElementById('slideshow-prev');
    const nextBtn = document.getElementById('slideshow-next');
    const finishBtn = document.getElementById('btn-slideshow-finish');

    if (frameEl) {
      frameEl.innerHTML = '';
      const isVideo = currentItem.isVideo || currentItem.src.toLowerCase().endsWith('.mp4');

      if (isVideo) {
        const video = document.createElement('video');
        video.src = currentItem.src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.controls = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        video.style.background = '#0F172A';
        frameEl.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = currentItem.src;
        img.alt = currentItem.caption || 'Memory Photo';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.background = '#0F172A';
        img.onerror = () => {
          img.onerror = null;
          img.src = 'assets/images/placeholder-slideshow.svg';
        };
        frameEl.appendChild(img);
      }
    }

    if (eraEl) eraEl.textContent = currentItem.era;
    if (captionEl) captionEl.textContent = currentItem.caption;
    if (counterEl) counterEl.textContent = `Memory ${slideshowIndex + 1} of ${photos.length}`;

    if (prevBtn) prevBtn.disabled = slideshowIndex === 0;
    if (nextBtn) {
      if (slideshowIndex === photos.length - 1) {
        nextBtn.style.display = 'none';
        if (finishBtn) finishBtn.style.display = 'inline-flex';
      } else {
        nextBtn.style.display = 'inline-flex';
        if (finishBtn) finishBtn.style.display = 'none';
      }
    }
  }

  /**
   * Screen 9 Teddy Hug
   */
  function triggerTeddyHug() {
    const bearsContainer = document.getElementById('teddy-hug-wrapper');
    const hugStatus = document.getElementById('hug-status-message');

    if (bearsContainer) {
      bearsContainer.classList.add('cuddle-active');
      setTimeout(() => {
        bearsContainer.classList.remove('cuddle-active');
      }, 1600);
    }

    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 200]);
    }

    if (particles) {
      particles.celebrateBurst(window.innerWidth / 2, window.innerHeight * 0.45, 60);
    }

    if (hugStatus) {
      hugStatus.textContent = config.finale ? config.finale.hugReceivedMessage : "Hug received! ❤️";
      hugStatus.classList.add('show');
    }
  }

  /**
   * Populate letter & titles
   */
  function populateConfigContent() {
    const letterBody = document.getElementById('romantic-letter-body');
    if (letterBody && config.letter) {
      letterBody.innerHTML = `
        <h3 class="letter-salutation">${config.letter.salutation}</h3>
        ${config.letter.paragraphs.map(p => `<p class="letter-p">${p}</p>`).join('')}
        <div class="letter-closing">
          <p class="closing-lead">${config.letter.closing}</p>
          <p class="signature">${config.letter.signature}</p>
        </div>
      `;
    }

    const chatImg = document.getElementById('chat-screenshot-img');
    if (chatImg) {
      chatImg.src = config.chatImage || 'assets/images/chat.jpg';
      chatImg.onerror = () => {
        chatImg.onerror = null;
        chatImg.src = 'assets/images/placeholder-chat.svg';
      };
    }

    const finaleHeading = document.getElementById('finale-heading');
    const finaleSubheading = document.getElementById('finale-subheading');
    const virtualHugBtnText = document.getElementById('btn-virtual-hug-text');

    if (finaleHeading && config.finale) finaleHeading.textContent = config.finale.heading;
    if (finaleSubheading && config.finale) finaleSubheading.textContent = config.finale.subheading;
    if (virtualHugBtnText && config.finale) virtualHugBtnText.textContent = config.finale.buttonText;
  }

  /**
   * Playful Modal
   */
  function showPlayfulModal({ emoji, title, text, btnText, onConfirm }) {
    const modal = document.getElementById('playful-modal');
    if (!modal) return;

    document.getElementById('modal-emoji').textContent = emoji;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-text').textContent = text;
    const confirmBtn = document.getElementById('modal-confirm-btn');
    confirmBtn.textContent = btnText;

    modal.classList.add('active');

    const handleConfirm = () => {
      modal.classList.remove('active');
      confirmBtn.removeEventListener('click', handleConfirm);
      if (onConfirm) onConfirm();
    };

    confirmBtn.addEventListener('click', handleConfirm);
  }
});
