/**
 * Main Application Controller for Sunflower Birthday Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.SUNFLOWER_CONFIG;
  const particles = new window.ParticleEngine();
  const music = new window.MusicController();

  // State
  let currentScreen = 1;
  const totalScreens = 9;
  let carouselIndex = 0;
  let carouselTimer = null;
  let slideshowIndex = 0;
  let screen6CountdownTimer = null;

  // DOM Elements
  const screens = document.querySelectorAll('.screen');
  const floatingMusicWidget = document.getElementById('music-widget');

  // Render Dynamic Config Content
  populateConfigContent();

  // Initialize Carousel & Slideshow
  initCarousel();
  initSlideshow();

  // Initialize Runaway Negative Buttons
  initRunawayButtons();

  // Screen 1: "Tap to open"
  const tapToOpenBox = document.getElementById('btn-screen-1-open');
  const tapToOpenBtn = document.getElementById('btn-screen-1-open-btn');
  
  if (tapToOpenBox) {
    tapToOpenBox.addEventListener('click', () => goToScreen(2));
  }
  if (tapToOpenBtn) {
    tapToOpenBtn.addEventListener('click', () => goToScreen(2));
  }

  // Screen 2: "Are you ready for a little surprise?"
  const readyYesBtn = document.getElementById('btn-ready-yes');
  const readyNoBtn = document.getElementById('btn-ready-no');

  if (readyYesBtn) {
    readyYesBtn.addEventListener('click', () => {
      // Start Giveon music on positive transition
      music.play();
      if (floatingMusicWidget) {
        floatingMusicWidget.classList.add('visible');
      }
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
          music.play();
          goToScreen(3);
        }
      });
    });
  }

  // Screen 3: "Do you know how much I love you?"
  const loveAlotBtn = document.getElementById('btn-love-alot');
  const loveAlittleBtn = document.getElementById('btn-love-alittle');

  if (loveAlotBtn) {
    loveAlotBtn.addEventListener('click', () => {
      particles.celebrateBurst(window.innerWidth / 2, window.innerHeight / 2, 45);
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
          particles.celebrateBurst(window.innerWidth / 2, window.innerHeight / 2, 45);
          goToScreen(4);
        }
      });
    });
  }

  // Screen 4: Chat Memory
  const chatNextBtn = document.getElementById('btn-chat-next');
  if (chatNextBtn) {
    chatNextBtn.addEventListener('click', () => {
      goToScreen(5);
    });
  }

  // Screen 5: "WHO? 👀"
  const whoBtn = document.getElementById('btn-who');
  if (whoBtn) {
    whoBtn.addEventListener('click', () => {
      goToScreen(6);
      triggerBirthdayCelebration();
    });
  }

  // Screen 6: "YOU! 🌻❤️"
  const screen6NextBtn = document.getElementById('btn-screen-6-next');
  if (screen6NextBtn) {
    screen6NextBtn.addEventListener('click', () => {
      goToScreen(7);
    });
  }

  // Screen 7: "Ehen... about that promise" -> "Reveal 🎁"
  const revealBtn = document.getElementById('btn-reveal');
  if (revealBtn) {
    revealBtn.addEventListener('click', () => {
      particles.celebrateBurst(window.innerWidth / 2, window.innerHeight / 2, 60);
      goToScreen(8);
    });
  }

  // Screen 8: Childhood-to-Now Slideshow controls
  const slideshowPrevBtn = document.getElementById('slideshow-prev');
  const slideshowNextBtn = document.getElementById('slideshow-next');
  const slideshowFinishBtn = document.getElementById('btn-slideshow-finish');

  if (slideshowPrevBtn) {
    slideshowPrevBtn.addEventListener('click', () => {
      changeSlideshowSlide(slideshowIndex - 1);
    });
  }
  if (slideshowNextBtn) {
    slideshowNextBtn.addEventListener('click', () => {
      changeSlideshowSlide(slideshowIndex + 1);
    });
  }
  if (slideshowFinishBtn) {
    slideshowFinishBtn.addEventListener('click', () => {
      goToScreen(9);
    });
  }

  // Screen 9: Teddy Hug & Virtual Hug Button
  const virtualHugBtn = document.getElementById('btn-virtual-hug');
  const replayBtn = document.getElementById('btn-replay');

  if (virtualHugBtn) {
    virtualHugBtn.addEventListener('click', () => {
      triggerTeddyHug();
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      goToScreen(1);
    });
  }

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

    // Handle Screen-Specific Entry Logic
    if (targetIndex === 6) {
      startScreen6Timer();
    } else {
      if (screen6CountdownTimer) {
        clearInterval(screen6CountdownTimer);
      }
    }

    if (targetIndex === 9) {
      particles.celebrateBurst(window.innerWidth / 2, window.innerHeight * 0.4, 50);
    }
  }

  /**
   * Runaway Button Physics
   * Moves button playfully away when hover or touch approaches!
   */
  function initRunawayButtons() {
    const runawayButtons = [readyNoBtn, loveAlittleBtn];

    runawayButtons.forEach(btn => {
      if (!btn) return;

      let dodgeCount = 0;

      const dodge = (e) => {
        // Prevent default click if dodging
        if (dodgeCount < 5) {
          const container = btn.parentElement;
          const rect = btn.getBoundingClientRect();
          const pRect = container.getBoundingClientRect();

          // Generate random jump coordinates within reasonable bounds
          const maxOffsetX = Math.min(130, window.innerWidth * 0.3);
          const maxOffsetY = 70;

          const randomX = (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * maxOffsetX);
          const randomY = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * maxOffsetY);

          btn.style.transition = 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)';
          btn.style.transform = `translate3d(${randomX}px, ${randomY}px, 0) scale(0.92)`;

          dodgeCount++;

          // After a few dodges, change text playfully
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
   * Birthday Screen 6 Celebration
   */
  function triggerBirthdayCelebration() {
    // Multiple celebratory bursts
    particles.celebrateBurst(window.innerWidth * 0.2, window.innerHeight * 0.3, 50);
    setTimeout(() => {
      particles.celebrateBurst(window.innerWidth * 0.8, window.innerHeight * 0.3, 50);
    }, 250);
    setTimeout(() => {
      particles.celebrateBurst(window.innerWidth * 0.5, window.innerHeight * 0.2, 70);
    }, 550);
  }

  /**
   * Screen 6 Timer: Shows "Next" button after 20 seconds (with progress bar)
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
        if (timerText) timerText.parentElement.style.opacity = '0';
      }
    }, 1000);
  }

  /**
   * Screen 6: Heart-Shaped Carousel Logic
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

    // Auto rotate every 5 seconds
    if (carouselTimer) clearInterval(carouselTimer);
    carouselTimer = setInterval(() => {
      if (currentScreen === 6) {
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
   * Screen 8: Childhood-to-Now Slideshow
   */
  function initSlideshow() {
    updateSlideshowUI();
  }

  function changeSlideshowSlide(newIndex) {
    const photos = config.slideshowPhotos;
    if (!photos || photos.length === 0) return;

    if (newIndex < 0) newIndex = 0;
    if (newIndex >= photos.length) newIndex = photos.length - 1;

    slideshowIndex = newIndex;
    updateSlideshowUI();
  }

  function updateSlideshowUI() {
    const photos = config.slideshowPhotos;
    if (!photos || !photos[slideshowIndex]) return;

    const currentItem = photos[slideshowIndex];
    const imgEl = document.getElementById('slideshow-image');
    const eraEl = document.getElementById('slideshow-era-badge');
    const captionEl = document.getElementById('slideshow-caption');
    const counterEl = document.getElementById('slideshow-counter');
    const prevBtn = document.getElementById('slideshow-prev');
    const nextBtn = document.getElementById('slideshow-next');
    const finishBtn = document.getElementById('btn-slideshow-finish');

    if (imgEl) {
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = currentItem.src;
        imgEl.onerror = () => {
          imgEl.onerror = null;
          imgEl.src = 'assets/images/placeholder-slideshow.svg';
        };
        imgEl.style.opacity = '1';
      }, 200);
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
   * Screen 9: Teddy Bear Hug & Virtual Hug Reaction
   */
  function triggerTeddyHug() {
    const bearsContainer = document.getElementById('teddy-hug-wrapper');
    const hugStatus = document.getElementById('hug-status-message');

    // Squeeze animation class
    if (bearsContainer) {
      bearsContainer.classList.add('cuddle-active');
      setTimeout(() => {
        bearsContainer.classList.remove('cuddle-active');
      }, 1600);
    }

    // Vibration haptics on mobile
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 200]);
    }

    // Celebration burst of hugs, hearts and kisses
    particles.celebrateBurst(window.innerWidth / 2, window.innerHeight * 0.45, 60);

    // Show sweet popup message
    if (hugStatus) {
      hugStatus.textContent = config.finale.hugReceivedMessage;
      hugStatus.classList.add('show');
    }
  }

  /**
   * Populate texts and drafted letter from config
   */
  function populateConfigContent() {
    // Fill letter paragraphs
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

    // Chat image
    const chatImg = document.getElementById('chat-screenshot-img');
    if (chatImg) {
      chatImg.src = config.chatImage;
      chatImg.onerror = () => {
        chatImg.onerror = null;
        chatImg.src = 'assets/images/placeholder-chat.svg';
      };
    }

    // Finale titles
    const finaleHeading = document.getElementById('finale-heading');
    const finaleSubheading = document.getElementById('finale-subheading');
    const virtualHugBtnText = document.getElementById('btn-virtual-hug-text');

    if (finaleHeading) finaleHeading.textContent = config.finale.heading;
    if (finaleSubheading) finaleSubheading.textContent = config.finale.subheading;
    if (virtualHugBtnText) virtualHugBtnText.textContent = config.finale.buttonText;
  }

  /**
   * Playful Modal for "NO" / "A little"
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
