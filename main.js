
    /* ----------------------------------------------------------
       MODULE 1: NAVBAR — Sticky scroll effect + mobile menu
    ---------------------------------------------------------- */
    (function NavbarModule() {
      const navbar = document.getElementById('navbar');
      const burger = document.getElementById('navBurger');
      const mobileNav = document.getElementById('navMobile');

      // Sticky scroll class
      function handleScroll() {
        if (window.scrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Mobile menu toggle
      function toggleMenu() {
        const isOpen = mobileNav.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', isOpen);
      }

      // Close mobile menu when a link is clicked
      function closeMobileMenu() {
        mobileNav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }

      // Attach events
      window.addEventListener('scroll', handleScroll, { passive: true });
      burger.addEventListener('click', toggleMenu);
      mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMobileMenu);
      });
    })();


    /* ----------------------------------------------------------
       MODULE 2: GALLERY LIGHTBOX
    ---------------------------------------------------------- */
    (function GalleryModule() {
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightboxImg');
      const lightboxClose = document.getElementById('lightboxClose');
      const galleryItems = document.querySelectorAll('.gallery-item');

      function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Foto kegiatan Jakarta Study Club';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
      }

      // Open on click or enter key
      galleryItems.forEach(item => {
        const handler = () => {
          const src = item.getAttribute('data-src');
          const alt = item.querySelector('img')?.alt;
          openLightbox(src, alt);
        };
        item.addEventListener('click', handler);
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
        });
      });

      // Close
      lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
      });
    })();


    /* ----------------------------------------------------------
       MODULE 3: ARTICLE SLIDER / CAROUSEL
    ---------------------------------------------------------- */
    (function SliderModule() {
      const track = document.getElementById('sliderTrack');
      const dots = document.querySelectorAll('.slider-dot');
      const prevBtn = document.getElementById('sliderPrev');
      const nextBtn = document.getElementById('sliderNext');
      const counter = document.getElementById('sliderCounter');

      const totalSlides = track.children.length;
      let currentIndex = 0;
      let autoplayTimer = null;

      // Move to a specific slide
      function goToSlide(index) {
        // Clamp / wrap
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        currentIndex = index;

        // Translate track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update dots
        dots.forEach((dot, i) => {
          const active = i === currentIndex;
          dot.classList.toggle('active', active);
          dot.setAttribute('aria-selected', active);
        });

        // Update counter
        counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
      }

      // Auto-play
      function startAutoplay() {
        autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), 5000);
      }

      function stopAutoplay() {
        clearInterval(autoplayTimer);
      }

      // Button controls
      prevBtn.addEventListener('click', () => {
        stopAutoplay();
        goToSlide(currentIndex - 1);
        startAutoplay();
      });

      nextBtn.addEventListener('click', () => {
        stopAutoplay();
        goToSlide(currentIndex + 1);
        startAutoplay();
      });

      // Dot controls
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          stopAutoplay();
          goToSlide(parseInt(dot.getAttribute('data-index'), 10));
          startAutoplay();
        });
      });

      // Touch/swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      track.parentElement.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      track.parentElement.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          stopAutoplay();
          goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
          startAutoplay();
        }
      }, { passive: true });

      // Keyboard navigation when slider is focused
      document.getElementById('articleSlider').addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { stopAutoplay(); goToSlide(currentIndex + 1); startAutoplay(); }
        if (e.key === 'ArrowLeft') { stopAutoplay(); goToSlide(currentIndex - 1); startAutoplay(); }
      });

      // Init
      goToSlide(0);
      startAutoplay();
    })();


    /* ----------------------------------------------------------
       MODULE 4: FAQ ACCORDION
    ---------------------------------------------------------- */
    (function FAQModule() {
      const faqItems = document.querySelectorAll('.faq-item');

      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');

          // Close all others
          faqItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('open');
              const otherAnswer = other.querySelector('.faq-answer');
              const otherQuestion = other.querySelector('.faq-question');
              otherAnswer.style.maxHeight = '0';
              otherQuestion.setAttribute('aria-expanded', 'false');
            }
          });

          // Toggle current
          if (isOpen) {
            item.classList.remove('open');
            answer.style.maxHeight = '0';
            question.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            question.setAttribute('aria-expanded', 'true');
          }
        });
      });
    })();


    /* ----------------------------------------------------------
       MODULE 6: SCROLL REVEAL (Intersection Observer)
    ---------------------------------------------------------- */
    (function ScrollRevealModule() {
      const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
      const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
          }
        });
      }, observerOpts);

      revealEls.forEach(el => observer.observe(el));
    })();


    (function () {
      /* ============ COUNTDOWN ============ */
      // Target: 22 Juni 2027, 00:00:00 WIB (UTC+7) => 21 Juni 2027 17:00 UTC
      var TARGET = new Date('2027-06-21T17:00:00Z').getTime();

      var els = {
        days: document.querySelector('[data-cd="days"]'),
        hours: document.querySelector('[data-cd="hours"]'),
        minutes: document.querySelector('[data-cd="minutes"]'),
        seconds: document.querySelector('[data-cd="seconds"]'),
      };
      var prev = { days: null, hours: null, minutes: null, seconds: null };

      function pad(n, w) {
        w = w || 2;
        var s = String(Math.max(0, n));
        while (s.length < w) s = '0' + s;
        return s;
      }

      function tick() {
        var now = Date.now();
        var diff = Math.max(0, TARGET - now);

        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);

        var values = {
          days: pad(d, d > 999 ? 4 : 3),
          hours: pad(h, 2),
          minutes: pad(m, 2),
          seconds: pad(s, 2),
        };

        Object.keys(values).forEach(function (k) {
          if (!els[k]) return;
          if (values[k] !== prev[k]) {
            els[k].textContent = values[k];
            // restart flip animation
            els[k].classList.remove('flip');
            // force reflow
            void els[k].offsetWidth;
            els[k].classList.add('flip');
            prev[k] = values[k];
          }
        });

        if (diff <= 0) {
          clearInterval(timer);
        }
      }

      tick();
      var timer = setInterval(tick, 1000);

      /* ============ TIMELINE — keyboard + touch ============ */
      var nodes = document.querySelectorAll('#jaTimeline .ja-tl-node');

      function clearActive() {
        nodes.forEach(function (n) { n.classList.remove('is-active'); });
      }

      nodes.forEach(function (node) {
        node.addEventListener('focus', function () {
          clearActive();
          node.classList.add('is-active');
        });
        node.addEventListener('blur', function () {
          node.classList.remove('is-active');
        });
        // Touch toggle
        node.addEventListener('click', function (e) {
          if (window.matchMedia('(hover: none)').matches) {
            var wasActive = node.classList.contains('is-active');
            clearActive();
            if (!wasActive) node.classList.add('is-active');
          }
        });
        node.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            var wasActive = node.classList.contains('is-active');
            clearActive();
            if (!wasActive) node.classList.add('is-active');
          }
        });
      });

      // close active on outside click (touch)
      document.addEventListener('click', function (e) {
        if (!e.target.closest('#jaTimeline')) clearActive();
      });
    })();
 
    

    (function MagnifyingGlassModule() {

      /* ──────────────────────────────────────────────
         ▼ KONFIGURASI — sesuaikan nilai-nilai di sini
         ────────────────────────────────────────────── */

      /**
       * PATH GAMBAR PETA
       * Ganti string ini dengan path/URL gambar peta Anda.
       * Gunakan URL yang sama dengan atribut src pada <img id="mapImg">.
       * PENTING: Gambar harus resolusi tinggi agar hasil zoom tajam.
       */
      const MAP_IMAGE_URL = 'https://i.postimg.cc/vZqcdzZW/0M74412000dk5m6bh9DEE.avif';

      /**
       * LEVEL ZOOM KACA PEMBESAR
       * 2   = 2x lipat ukuran asli (standar)
       * 2.5 = 2.5x
       * 3   = 3x (sangat besar, cocok untuk peta detail)
       *
       * Ingat: nilai ini harus KONSISTEN dengan nilai background-size di CSS.
       * Contoh: zoomLevel = 2 → background-size: "200%"
       *         zoomLevel = 2.5 → background-size: "250%"
       *         zoomLevel = 3 → background-size: "300%"
       */
      const ZOOM_LEVEL = 2; // ← Ubah nilai zoom di sini

      /**
       * UKURAN LENSA (diameter dalam pixel)
       * Harus cocok dengan nilai width/height di CSS .map-lens
       */
      const LENS_SIZE = 160; // ← Ubah diameter lensa di sini

      /**
       * AKTIFKAN/NONAKTIFKAN pada touch screen
       * true  = efek hanya berjalan di perangkat non-touch (default aman)
       * false = paksa aktif di semua perangkat
       */
      const DISABLE_ON_TOUCH = true;

      /* ──────────────────────────────────────────────
         ▲ AKHIR KONFIGURASI
         ────────────────────────────────────────────── */


      // ── Deteksi touch screen ──
      const isTouchDevice = DISABLE_ON_TOUCH &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0);

      if (isTouchDevice) {
        // Sembunyikan hint zoom di touch device, lalu keluar
        const hint = document.querySelector('.map-zoom-hint');
        if (hint) hint.style.display = 'none';
        return;
      }

      // ── Ambil elemen DOM ──
      const wrapper = document.getElementById('mapWrapper');
      const imageWrap = document.getElementById('mapImageWrap');
      const lens = document.getElementById('mapLens');

      if (!wrapper || !imageWrap || !lens) {
        console.warn('[MagnifyGlass] Elemen tidak ditemukan. Periksa ID HTML.');
        return;
      }

      // ── Terapkan konfigurasi zoom ke CSS lensa ──
      // Ini memastikan JS dan CSS selaras
      lens.style.backgroundImage = `url('${MAP_IMAGE_URL}')`;
      lens.style.backgroundSize = `${ZOOM_LEVEL * 100}%`;
      lens.style.width = `${LENS_SIZE}px`;
      lens.style.height = `${LENS_SIZE}px`;

      /**
       * Hitung posisi mouse RELATIF terhadap .map-image-wrap
       * (bukan window), karena lensa berada di dalam wrapper tersebut.
       */
      function getRelativePos(e) {
        const rect = imageWrap.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          w: rect.width,
          h: rect.height
        };
      }

      /**
       * Update posisi lensa dan background-position gambar di dalam lensa.
       * Dipanggil setiap kali mousemove.
       */
      function updateLens(e) {
        const { x, y, w, h } = getRelativePos(e);

        // Posisi center lensa mengikuti kursor
        lens.style.left = `${x}px`;
        lens.style.top = `${y}px`;

        /*
         * Background-position dalam persen:
         * Saat kursor di x=0 → bgX=0%  (gambar dimulai dari kiri)
         * Saat kursor di x=w → bgX=100% (gambar bergeser penuh ke kanan)
         *
         * Formula:
         * bgX (%) = (x / w) * 100
         * bgY (%) = (y / h) * 100
         *
         * Nilai ini langsung memetakan posisi kursor ke posisi
         * dalam gambar yang sudah di-zoom, menghasilkan efek kaca pembesar.
         */
        const bgX = (x / w) * 100;
        const bgY = (y / h) * 100;

        lens.style.backgroundPosition = `${bgX}% ${bgY}%`;
      }

      // ── Mouse ENTER — tampilkan lensa ──
      imageWrap.addEventListener('mouseenter', () => {
        wrapper.classList.add('is-hovering');
      });

      // ── Mouse MOVE — gerakkan lensa ──
      imageWrap.addEventListener('mousemove', (e) => {
        // Gunakan requestAnimationFrame untuk pergerakan mulus
        requestAnimationFrame(() => updateLens(e));
      });

      // ── Mouse LEAVE — sembunyikan lensa ──
      imageWrap.addEventListener('mouseleave', () => {
        wrapper.classList.remove('is-hovering');
      });

      // ── Pause/resume float animation saat hover ──
      // (sudah di-handle di CSS via .map-wrapper:hover)

      console.log(
        '[MagnifyGlass] Aktif ✓',
        `| Zoom: ${ZOOM_LEVEL}x`,
        `| Lens: ${LENS_SIZE}px`
      );

    })();

    /* =========================================================
       MARI BERKOLABORASI — Form validation & submission
    ========================================================= */
    (function initKolaborasiForm() {
      const form = document.getElementById('kolaborasiForm');
      const btn = document.getElementById('submitBtn');
      const status = document.getElementById('formStatus');
      if (!form) return;

      // Fields that must not be empty
      const requiredFields = form.querySelectorAll('[required]');

      /**
       * Show a status banner with a given type and message.
       * @param {'processing'|'success'|'error'} type
       * @param {string} message
       */
      function showStatus(type, message) {
        status.className = 'form-status show ' + type;
        status.textContent = message;
      }

      /**
       * Validate all required fields. Adds/removes `.invalid` class
       * and returns true if the whole form is valid.
       * @returns {boolean}
       */
      function validateForm() {
        let isValid = true;

        requiredFields.forEach(field => {
          const value = field.value.trim();
          let fieldValid = value !== '';

          // Extra check for email format
          if (field.type === 'email' && value !== '') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            fieldValid = emailPattern.test(value);
          }

          if (!fieldValid) {
            field.classList.add('invalid');
            isValid = false;
          } else {
            field.classList.remove('invalid');
          }
        });

        return isValid;
      }

      // Remove invalid state as soon as the user starts fixing a field
      requiredFields.forEach(field => {
        field.addEventListener('input', () => field.classList.remove('invalid'));
        field.addEventListener('change', () => field.classList.remove('invalid'));
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) {
          showStatus('error', 'Mohon lengkapi semua kolom wajib (*) dengan benar.');
          return;
        }

        // Show processing state
        btn.disabled = true;
        btn.textContent = 'Mengirim...';
        showStatus('processing', 'Pesan Anda sedang diproses...');

        // Submit to Formspree endpoint via fetch (AJAX), so we can show
        // a custom success/error message without leaving the page.
        const formData = new FormData(form);

        fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
          .then(response => {
            if (response.ok) {
              showStatus('success', '✓ Pesan berhasil terkirim! Tim kami akan segera menghubungi Anda.');
              form.reset();
            } else {
              showStatus('error', 'Terjadi kesalahan saat mengirim. Silakan coba lagi.');
            }
          })
          .catch(() => {
            showStatus('error', 'Gagal terhubung ke server. Periksa koneksi Anda dan coba lagi.');
          })
          .finally(() => {
            btn.disabled = false;
            btn.textContent = 'Kirim Pesan';
          });
      });
    })();
  


  
    (function ToponimiSliderModule() {
      'use strict';
      const CONFIG = {
        autoPlayDuration: 6000,
        autoPlay: true,
        resumeDelay: 9000,
        placeNames: ['Kebon Sirih', 'Bintaro', 'Kelapa Gading', 'Tanjung Duren']
      };

      const slides = document.querySelectorAll('#tpSlider .tp-slide');
      const dotsWrap = document.getElementById('tpDots');
      const tabsWrap = document.getElementById('tpTabs');
      const prevBtn = document.getElementById('tpPrev');
      const nextBtn = document.getElementById('tpNext');

      if (!slides.length) return;

      const total = slides.length;
      let current = 0;
      let autoTimer = null;
      let fillRaf = null;
      let fillStart = null;
      let resumeTimer = null;
      let isPlaying = false;

      const dots = [];
      const fills = [];
      const tabBtns = [];

      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        const fill = document.createElement('div');
        dot.className = 'tp-dot' + (i === 0 ? ' tp-dot-active' : '');
        fill.className = 'tp-dot-fill';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Slide ${i + 1}: ${CONFIG.placeNames[i]}`);
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.appendChild(fill);
        dot.addEventListener('click', () => manualGoTo(i));
        dotsWrap.appendChild(dot);
        dots.push(dot);
        fills.push(fill);

        const tb = document.createElement('button');
        tb.className = 'tp-place-tab' + (i === 0 ? ' tp-dot-active' : '');
        tb.textContent = CONFIG.placeNames[i];
        tb.addEventListener('click', () => manualGoTo(i));
        tabsWrap.appendChild(tb);
        tabBtns.push(tb);
      });

      function activateSlide(index) {
        slides.forEach(s => s.classList.remove('tp-active'));
        dots.forEach((d, i) => {
          const active = i === index;
          d.classList.toggle('tp-dot-active', active);
          d.setAttribute('aria-selected', active ? 'true' : 'false');
          fills[i].style.transition = 'none';
          fills[i].style.width = '0%';
        });
        tabBtns.forEach((t, i) => t.classList.toggle('tp-dot-active', i === index));

        slides[index].classList.add('tp-active');
        current = index;
      }

      function startFill(duration) {
        cancelAnimationFrame(fillRaf);
        fillStart = null;

        const fill = fills[current];
        fill.style.transition = 'none';
        fill.style.width = '0%';

        function tick(ts) {
          if (!fillStart) fillStart = ts;
          const elapsed = ts - fillStart;
          const progress = Math.min(elapsed / duration, 1);
          fill.style.width = (progress * 100).toFixed(2) + '%';
          if (progress < 1) fillRaf = requestAnimationFrame(tick);
        }
        requestAnimationFrame(() => { fillRaf = requestAnimationFrame(tick); });
      }

      function stopFill() {
        cancelAnimationFrame(fillRaf);
      }

      function startAutoPlay() {
        if (!CONFIG.autoPlay) return;
        isPlaying = true;
        startFill(CONFIG.autoPlayDuration);
        autoTimer = setInterval(() => {
          activateSlide((current + 1) % total);
          startFill(CONFIG.autoPlayDuration);
        }, CONFIG.autoPlayDuration);
      }

      function stopAutoPlay() {
        isPlaying = false;
        clearInterval(autoTimer);
        stopFill();
      }

      function manualGoTo(index) {
        if (index === current) return;
        stopAutoPlay();
        activateSlide(index);
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          if (CONFIG.autoPlay) startAutoPlay();
        }, CONFIG.resumeDelay);
      }

      prevBtn.addEventListener('click', () => manualGoTo((current - 1 + total) % total));
      nextBtn.addEventListener('click', () => manualGoTo((current + 1) % total));

      document.getElementById('tpSlider').addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') manualGoTo((current + 1) % total);
        if (e.key === 'ArrowLeft') manualGoTo((current - 1 + total) % total);
      });

      let tx = 0;
      document.getElementById('tpSlider').addEventListener('touchstart', e => {
        tx = e.changedTouches[0].screenX;
      }, { passive: true });
      document.getElementById('tpSlider').addEventListener('touchend', e => {
        const diff = tx - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 48) manualGoTo(diff > 0 ? (current + 1) % total : (current - 1 + total) % total);
      }, { passive: true });

      const sec = document.getElementById('toponimi');
      sec.addEventListener('mouseenter', stopAutoPlay);
      sec.addEventListener('mouseleave', () => { if (CONFIG.autoPlay) startAutoPlay(); });
      sec.addEventListener('focusin', stopAutoPlay);
      sec.addEventListener('focusout', () => { if (CONFIG.autoPlay) startAutoPlay(); });

      activateSlide(0);
      if (CONFIG.autoPlay) startAutoPlay();
    })();
 
 