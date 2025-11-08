/**
 * Portfolio Website - Main JavaScript
 * Handles: theme switching, navigation, scroll tracking, animations, and interactive features
*/
(() => {
  // ============================================
  // UTILITIES & INITIALIZATION
  // ============================================
  
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  
  // EmailJS Configuration
  // TODO: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key
  // Get it from: https://dashboard.emailjs.com/admin/integration
  if (typeof emailjs !== 'undefined') {
    emailjs.init('uvGkkNDzLXy5JoPsi');
  }
  
  // DOM References
  const body = document.body;
  const navbar = $('#navbar');
  const navToggle = $('#nav-toggle');
  const navLinks = $('#nav-links');
  const revealEls = $$('.reveal');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const avatarCard = document.getElementById('avatar-card');

  // Enable CSS transitions after first paint to prevent flash on load
  requestAnimationFrame(() => body.classList.remove('no-transitions'));

  // ============================================
  // SKILL DROPDOWN ANIMATIONS
  // ============================================
  // Animate skill bars on dropdown hover with staggered timing
  const skillDropdowns = document.querySelectorAll('.skills-dropdown');
  skillDropdowns.forEach(dropdown => {
    const parent = dropdown.closest('.nav-item-dropdown');
    if (!parent) return;
    
    let hasAnimated = false;
    
    parent.addEventListener('mouseenter', () => {
      if (hasAnimated) return;
      
      const skillBars = dropdown.querySelectorAll('.skill-bar-fill[data-width]');
      skillBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        if (!width) return;
        
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 100 + (index * 80));
      });
      
      hasAnimated = true;
    });
    
    parent.addEventListener('mouseleave', () => {
      setTimeout(() => {
        hasAnimated = false;
      }, 300);
    });
  });

  // ============================================
  // THEME SWITCHING
  // ============================================
  const STORAGE_KEY = 'c1ten-theme';
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  const saved = localStorage.getItem(STORAGE_KEY);
  const initialDark = saved ? saved === 'dark' : false;

  /**
   * Apply theme to body and update UI
   * @param {boolean} isDark - Whether to apply dark theme
   * @param {boolean} save - Whether to save preference to localStorage
   */
  function applyTheme(isDark, save = true) {
    body.classList.remove('dark', 'light');
    body.classList.add(isDark ? 'dark' : 'light');
    
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
      themeSwitch.setAttribute('aria-checked', isDark ? 'true' : 'false');
    }
    
    if (save) {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    }
    
    // Update mobile browser theme color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', isDark ? '#05060a' : '#ffffff');
    }
  }

  // Initialize theme on page load (don't save on initial load)
  applyTheme(initialDark, false);

  // Initialize theme switch button
  let themeSwitchInitialized = false;
  function initThemeSwitch() {
    if (themeSwitchInitialized) return;
    
    const themeSwitch = document.getElementById('theme-switch');
    if (!themeSwitch) {
      setTimeout(initThemeSwitch, 100);
      return;
    }
    
    const isDark = body.classList.contains('dark');
    themeSwitch.setAttribute('aria-checked', isDark ? 'true' : 'false');
    
    themeSwitch.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const currentIsDark = body.classList.contains('dark');
      applyTheme(!currentIsDark, true);
    }, false);
    
    themeSwitch.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const currentIsDark = body.classList.contains('dark');
        applyTheme(!currentIsDark, true);
      }
    });
    
    themeSwitch.style.cursor = 'pointer';
    themeSwitch.style.pointerEvents = 'auto';
    themeSwitch.setAttribute('tabindex', '0');
    
    themeSwitchInitialized = true;
  }
  
  // Initialize theme switch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeSwitch);
  } else {
    initThemeSwitch();
  }
  
  // Fallback initialization after page load
  window.addEventListener('load', () => {
    if (!themeSwitchInitialized) {
      initThemeSwitch();
    }
  });

  // Listen for system theme changes (only if user hasn't set explicit preference)
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches, false);
      }
    });
  }

  // ============================================
  // HERO TYPING ANIMATION
  // ============================================
  const typedEl = document.getElementById('skill-typed');
  if (typedEl) {
    const skills = ['TypeScript','React','FastAPI','Rust','Go','LLM integrations'];
    const typeSpeed = 60;    // ms per character
    const eraseSpeed = 35;   // ms per character
    const pauseAfter = 1300; // ms pause after completing word
    let idx = 0, char = 0, deleting = false;

    const tick = () => {
      const current = skills[idx % skills.length];
      if (!deleting) {
        char++;
        typedEl.textContent = current.slice(0, char);
        if (char === current.length) {
          deleting = true;
          setTimeout(tick, pauseAfter);
          return;
        }
        setTimeout(tick, typeSpeed + Math.random() * 40);
      } else {
        char--;
        typedEl.textContent = current.slice(0, char);
        if (char === 0) {
          deleting = false;
          idx++;
          setTimeout(tick, 220);
          return;
        }
        setTimeout(tick, eraseSpeed + Math.random() * 30);
      }
    };

    setTimeout(tick, 600);
  }

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  if (navToggle && navLinks) {
    let mobileBackdrop = null;
    
    const openMobileMenu = () => {
      navLinks.classList.add('mobile');
      navToggle.setAttribute('aria-expanded', 'true');
      
      // Clone nav-right into mobile menu if it exists
      const navRight = document.querySelector('.nav-right');
      if (navRight && !navRight.parentElement.classList.contains('nav-links')) {
        navLinks.appendChild(navRight.cloneNode(true));
      }
      
      // Create and show backdrop
      if (!mobileBackdrop) {
        mobileBackdrop = document.createElement('div');
        mobileBackdrop.className = 'mobile-menu-backdrop';
        mobileBackdrop.style.cssText = `
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(4px);
          z-index: 997;
          opacity: 0;
          transition: opacity 300ms ease;
        `;
        document.body.appendChild(mobileBackdrop);
        
        mobileBackdrop.addEventListener('click', closeMobileMenu);
        requestAnimationFrame(() => {
          mobileBackdrop.style.opacity = '1';
        });
      }
      
      document.body.style.overflow = 'hidden';
      
      // Focus first link for keyboard navigation
      const first = navLinks.querySelector('a[data-target]');
      first && first.focus();
    };
    
    const closeMobileMenu = () => {
      navLinks.classList.remove('mobile');
      navToggle.setAttribute('aria-expanded', 'false');
      
      const clonedNavRight = navLinks.querySelector('.nav-right');
      if (clonedNavRight) {
        clonedNavRight.remove();
      }
      
      if (mobileBackdrop) {
        mobileBackdrop.style.opacity = '0';
        setTimeout(() => {
          if (mobileBackdrop && mobileBackdrop.parentNode) {
            mobileBackdrop.parentNode.removeChild(mobileBackdrop);
            mobileBackdrop = null;
          }
        }, 300);
      }
      
      document.body.style.overflow = '';
      navToggle.focus();
    };
    
    
    navToggle.addEventListener('click', () => {
      if (navLinks.classList.contains('mobile')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when nav link is clicked
    navLinks.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-target]');
      if (!a) return;
      if (navLinks.classList.contains('mobile')) {
        closeMobileMenu();
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('mobile')) {
        closeMobileMenu();
      }
    });
  }

  // ============================================
  // SMOOTH SCROLL NAVIGATION
  // ============================================
  document.querySelectorAll('.nav-links a[data-target]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = a.getAttribute('data-target');
      const section = document.getElementById(target);
      if (!section) return;
      
      e.preventDefault();
      body.classList.add('section-transitioning');
      
      const navH = navbar ? navbar.offsetHeight : 0;
      const rect = section.getBoundingClientRect();
      const top = window.scrollY + rect.top - navH - 12;
      
      // Update active state immediately for visual feedback
      document.querySelectorAll('.nav-links a').forEach(n => n.classList.remove('active'));
      a.classList.add('active');
      
      window.scrollTo({ top, behavior: 'smooth' });
      
      setTimeout(() => {
        body.classList.remove('section-transitioning');
      }, 800);
      
      // Close mobile menu if open
      if (navLinks && navLinks.classList.contains('mobile')) {
        navLinks.classList.remove('mobile');
        navToggle && navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ============================================
  // PROJECT FILTERING
  // ============================================
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = btn.getAttribute('data-filter');
        // update active states
        filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
        // show/hide cards
        projectCards.forEach(card => {
          const cats = (card.getAttribute('data-category') || '').split(/\s+/);
          if (filter === 'all' || cats.includes(filter)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
        // trigger rebuild of dots and progress after filtering
        const track = document.querySelector('.projects-track');
        if (track) {
          // use a small delay to ensure DOM updates are complete
          setTimeout(() => {
            // dispatch a custom event that the scroller can listen to
            track.dispatchEvent(new CustomEvent('filterchange'));
            // also trigger a resize event to update buttons visibility
            window.dispatchEvent(new Event('resize'));
          }, 50);
        }
      });
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
    });
  }

  // Projects horizontal track: scroll buttons, keyboard support, and visibility toggles
  (function wireProjectScroller() {
    const scrollWrap = document.querySelector('.projects-scroll');
    if (!scrollWrap) return;
    const track = scrollWrap.querySelector('.projects-track');
    const btnLeft = scrollWrap.querySelector('.scroll-btn.left');
    const btnRight = scrollWrap.querySelector('.scroll-btn.right');

    const getStep = () => {
      // prefer visible card width
      const card = track && track.querySelector('.project-card:not(.hidden)');
      if (!card) return Math.min(window.innerWidth * 0.8, 320);
      const rect = card.getBoundingClientRect();
      const style = getComputedStyle(track);
      // account for CSS gap property (gap between flex items)
      const gap = parseFloat(style.gap || 0) || 18; // fallback to 18px if gap not found
      return rect.width + gap;
    };

    const scrollBy = (delta) => {
      if (!track) return;
      // Use scrollBy for smooth scrolling - CSS scroll-snap will handle alignment
      track.scrollBy({ left: delta, behavior: 'smooth' });
    };

    btnLeft && btnLeft.addEventListener('click', () => scrollBy(-getStep()));
    btnRight && btnRight.addEventListener('click', () => scrollBy(getStep()));

    // keyboard support when focused
    scrollWrap.setAttribute('tabindex', '0');
    scrollWrap.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollBy(getStep()); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollBy(-getStep()); }
      if (e.key === 'Home') { e.preventDefault(); track && track.scrollTo({ left: 0, behavior: 'smooth' }); }
      if (e.key === 'End') { e.preventDefault(); track && track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' }); }
    });

    // toggle visibility class when overflow present
    const updateButtons = () => {
      if (!track) return;
      const hasOverflow = track.scrollWidth > track.clientWidth + 6;
      scrollWrap.classList.toggle('has-scroll', hasOverflow);
    };
    window.addEventListener('resize', updateButtons);
    // observe track size changes or content changes
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(updateButtons);
      ro.observe(track);
    }
    updateButtons();
    
    /* ---------- page indicator dots ---------- */
    const dotsWrap = scrollWrap.querySelector('.projects-dots');
    let dots = [];

    const buildDots = () => {
      if (!dotsWrap || !track) return;
      dotsWrap.innerHTML = '';
      const visibleCards = Array.from(track.querySelectorAll('.project-card:not(.hidden)'));
      visibleCards.forEach((card, i) => {
        const btn = document.createElement('button');
        btn.className = 'dot-btn';
        btn.setAttribute('aria-label', `Go to project ${i+1}`);
        btn.addEventListener('click', () => {
          const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) * 0 / 2; // align start
          track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
        });
        dotsWrap.appendChild(btn);
      });
      dots = Array.from(dotsWrap.querySelectorAll('button'));
      updateActiveDot();
    };

    const updateActiveDot = () => {
      if (!track || !dotsWrap) return;
      const visibleCards = Array.from(track.querySelectorAll('.project-card:not(.hidden)'));
      if (!visibleCards.length) return;
      const left = track.scrollLeft;
      // find nearest card by left offset
      let nearest = 0, nearestDist = Infinity;
      visibleCards.forEach((card, idx) => {
        const dist = Math.abs(card.offsetLeft - left);
        if (dist < nearestDist) { nearest = idx; nearestDist = dist; }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === nearest));
    };

    // progress bar update function (define before use)
    const progressBar = scrollWrap.querySelector('.projects-progress__bar');
    const updateProgress = () => {
      if (!track || !progressBar) return;
      const max = track.scrollWidth - track.clientWidth;
      const pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    };

    // update dots on resize/content change
    const rebuildWhenNeeded = () => { buildDots(); updateButtons(); updateProgress(); };
    if (window.MutationObserver) {
      const mo = new MutationObserver(rebuildWhenNeeded);
      mo.observe(track, { childList: true, subtree: true, attributes: true });
    }
    if (window.ResizeObserver) {
      const ro2 = new ResizeObserver(rebuildWhenNeeded);
      ro2.observe(track);
    }

    // throttle scroll events with rAF - combine dots and progress updates
    let ticking = false;
    const updateOnScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { 
        updateActiveDot();
        updateProgress();
        ticking = false; 
      });
    };
    track.addEventListener('scroll', updateOnScroll, { passive: true });

    // listen for filter changes to rebuild dots and update progress
    track.addEventListener('filterchange', () => {
      buildDots();
      updateProgress();
      updateButtons();
      // reset scroll position to start when filtering
      track.scrollTo({ left: 0, behavior: 'smooth' });
    });

    // initial build
    buildDots();
    updateProgress();

    // make track pointer-drag friendly - only activate on mouse, let touch use native scrolling
    let isDown = false, startX = 0, scrollLeftStart = 0, hasMoved = false;
    const onMouseDown = (e) => {
      // Only handle mouse events, not touch (let touch use native scrolling)
      if (e.type === 'touchstart') return;
      // Don't interfere with clicks on cards, links, or buttons
      if (e.target.closest('.project-card a, .project-card button, .view-project-btn')) return;
      // Don't start drag if clicking on a card (let card click handler work)
      if (e.target.closest('.project-card')) return;
      isDown = true;
      hasMoved = false;
      scrollWrap.classList.add('dragging');
      startX = e.pageX - track.getBoundingClientRect().left;
      scrollLeftStart = track.scrollLeft;
      track.style.scrollBehavior = 'auto';
      e.preventDefault();
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      const x = e.pageX - track.getBoundingClientRect().left;
      const walk = (startX - x);
      if (Math.abs(walk) > 5) hasMoved = true; // Only consider it a drag if moved more than 5px
      track.scrollLeft = scrollLeftStart + walk;
    };
    const onMouseUp = (e) => {
      if (!isDown) return;
      isDown = false;
      scrollWrap.classList.remove('dragging');
      track.style.scrollBehavior = '';
      // If we didn't move much, it was probably a click - allow card click
      if (!hasMoved) {
        // Allow click to propagate normally
        return;
      }
    };
    // Only attach mouse handlers, not touch (native touch scrolling works better)
    track.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    // Remove any existing touch handlers that might interfere

    // hover/focus reveal: centralised handlers to avoid flicker and duplication
    const cards = Array.from(track.querySelectorAll('.project-card'));
  let pointerOverCard = false;
  let pointerOverPopup = false;
  let hoverClearTimer = null;
    const setHoverState = (card, isHover) => {
      if (isHover) {
        // clear focused state from other cards so only one appears focused at a time
        track.querySelectorAll('.project-card.focused').forEach(c => { if (c !== card) c.classList.remove('focused'); });
        card.classList.add('focused');
        scrollWrap.classList.add('card-focused');
      } else {
        card.classList.remove('focused');
        // only remove the overall focused state when neither card nor popup are hovered
        if (!pointerOverCard && !pointerOverPopup) scrollWrap.classList.remove('card-focused');
      }
    };

    cards.forEach(card => {
      // support keyboard focus (keep these for accessibility)
      card.addEventListener('focusin', () => { pointerOverCard = true; setHoverState(card, true); });
      card.addEventListener('focusout', () => { pointerOverCard = false; setHoverState(card, false); });
      // on touch, toggle focused to act as tap-to-reveal
      card.addEventListener('touchend', (ev) => {
        if (!card.classList.contains('focused')) {
          ev.preventDefault();
          // clear others
          track.querySelectorAll('.project-card.focused').forEach(c => c.classList.remove('focused'));
          pointerOverCard = true;
          setHoverState(card, true);
        }
      }, { passive: false });
    });

    // Simple hover effect - just visual feedback, no popups
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        setHoverState(card, true);
      });
      card.addEventListener('mouseleave', () => {
        setHoverState(card, false);
      });
    });

    // when the pointer leaves the projects area entirely, remove focus/blur
    scrollWrap.addEventListener('pointerleave', () => {
      scrollWrap.classList.remove('card-focused');
      track.querySelectorAll('.project-card.focused').forEach(c => c.classList.remove('focused'));
    });
  })();

  // SCROLL: navbar transform (glass -> colored on scroll) + progress indicator
  const scrollProgress = document.querySelector('.scroll-progress');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 16);
    
    // Update scroll progress indicator
    if (scrollProgress) {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      scrollProgress.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Animate progress bars when skill cards come into view
  const animateProgressBars = () => {
    const progressBars = document.querySelectorAll('.prog i');
    progressBars.forEach((bar, index) => {
      // Get width from inline style attribute
      const styleAttr = bar.getAttribute('style') || '';
      const widthMatch = styleAttr.match(/width:\s*(\d+%)/);
      const targetWidth = widthMatch ? widthMatch[1] : '0%';
      
      // Reset and animate
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 100 + (index * 50)); // Stagger animation
    });
  };

  // IntersectionObserver reveals (staggered via delay-* classes)
  // First, show all reveals immediately as fallback
  revealEls.forEach(el => {
    if (el) el.classList.add('in-view');
  });
  
  // Then set up IntersectionObserver for proper animation on scroll
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    // Remove in-view class initially to allow animation
    revealEls.forEach(el => {
      if (el) el.classList.remove('in-view');
    });
    
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          // Animate progress bars when skills section is visible
          if (e.target.closest('#skills') || e.target.closest('.skill-card')) {
            setTimeout(animateProgressBars, 300);
          }
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '50px' });

    revealEls.forEach(el => {
      if (el) io.observe(el);
    });
    
    // Emergency fallback: show all reveals after 1 second if they're still hidden
    setTimeout(() => {
      revealEls.forEach(el => {
        if (el && !el.classList.contains('in-view')) {
          el.classList.add('in-view');
        }
      });
    }, 1000);
  }
  
  body.classList.add('loaded');

  // ============================================
  // SCROLL SPY - ACTIVE NAVIGATION HIGHLIGHTING
  // ============================================
  const navLinksMap = new Map();
  const allNavLinks = document.querySelectorAll('.nav-links a[data-target]');
  allNavLinks.forEach(a => navLinksMap.set(a.getAttribute('data-target'), a));
  
  let currentActiveSection = null;
  let isScrolling = false;
  
  /**
   * Update active nav link with smooth transition animation
   * @param {string} sectionId - ID of the section to highlight
   */
  function updateActiveNavLink(sectionId) {
    if (currentActiveSection === sectionId) return;
    
    const link = navLinksMap.get(sectionId);
    if (!link) return;
    
    // Animate out previous active link
    allNavLinks.forEach(n => {
      if (n.classList.contains('active')) {
        n.classList.add('nav-link-exiting');
        setTimeout(() => {
          n.classList.remove('active', 'nav-link-exiting');
        }, 150);
      }
    });
    
    // Animate in new active link
    setTimeout(() => {
      link.classList.add('nav-link-entering');
      link.classList.add('active');
      setTimeout(() => {
        link.classList.remove('nav-link-entering');
      }, 300);
    }, 50);
    
    currentActiveSection = sectionId;
  }
  
  if ('IntersectionObserver' in window && sections.length) {
    // Track section positions for accurate scroll detection
    const sectionData = new Map();
    sections.forEach(s => {
      sectionData.set(s.id, {
        element: s,
        top: 0,
        bottom: 0,
        height: 0
      });
    });
    
    // Update section positions dynamically
    const updateSectionPositions = () => {
      const navH = navbar ? navbar.offsetHeight : 0;
      sectionData.forEach((data, id) => {
        const rect = data.element.getBoundingClientRect();
        data.top = window.scrollY + rect.top - navH;
        data.bottom = window.scrollY + rect.bottom - navH;
        data.height = rect.height;
      });
    };
    updateSectionPositions();
    window.addEventListener('resize', updateSectionPositions, { passive: true });
    window.addEventListener('scroll', updateSectionPositions, { passive: true });
    
    // IntersectionObserver for scroll-based section detection
    const activeIo = new IntersectionObserver((entries) => {
      if (isScrolling) return; // Skip during programmatic scroll
      
      // Find section with highest visibility score
      let bestSection = null;
      let bestScore = 0;
      
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        
        const sectionId = e.target.id;
        const data = sectionData.get(sectionId);
        if (!data) return;
        
        // Calculate visibility: how much of section is in viewport
        const viewportTop = window.scrollY;
        const viewportBottom = window.scrollY + window.innerHeight;
        const navH = navbar ? navbar.offsetHeight : 0;
        
        const visibleTop = Math.max(viewportTop + navH, data.top);
        const visibleBottom = Math.min(viewportBottom, data.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityRatio = visibleHeight / data.height;
        
        // Prefer sections near top of viewport
        const distanceFromTop = Math.abs(data.top - (viewportTop + navH));
        const distanceScore = 1 / (1 + distanceFromTop / 200);
        
        const score = visibilityRatio * 0.7 + distanceScore * 0.3;
        
        if (score > bestScore) {
          bestScore = score;
          bestSection = e.target;
        }
      });
      
      if (bestSection) {
        updateActiveNavLink(bestSection.id);
      }
    }, { 
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      rootMargin: `-${navbar ? navbar.offsetHeight : 0}px 0px -50% 0px`
    });

    sections.forEach(s => activeIo.observe(s));
    
    // Handle edge cases: top of page and footer area
    const handleScroll = () => {
      if (isScrolling) return;
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const navH = navbar ? navbar.offsetHeight : 0;
      
      // At top of page: highlight home
      if (scrollY < 100) {
        const homeLink = navLinksMap.get('home');
        if (homeLink && currentActiveSection !== 'home') {
          updateActiveNavLink('home');
        }
        return;
      }
      
      // Near bottom: highlight last section (prevents home from being active in footer)
      const distanceFromBottom = documentHeight - (scrollY + windowHeight);
      if (distanceFromBottom < 200 && sections.length > 0) {
        const lastSection = sections[sections.length - 1];
        if (lastSection && currentActiveSection !== lastSection.id) {
          const lastSectionBottom = sectionData.get(lastSection.id)?.bottom || 0;
          if (scrollY + navH > lastSectionBottom) {
            updateActiveNavLink(lastSection.id);
          }
        }
        return;
      }
      
      // Fallback: find section closest to viewport center
      let activeSection = null;
      let minDistance = Infinity;
      
      sectionData.forEach((data, id) => {
        const viewportCenter = scrollY + navH + windowHeight / 3;
        
        if (viewportCenter >= data.top && viewportCenter <= data.bottom) {
          const distance = Math.abs(viewportCenter - (data.top + data.height / 2));
          if (distance < minDistance) {
            minDistance = distance;
            activeSection = document.getElementById(id);
          }
        }
      });
      
      if (activeSection && currentActiveSection !== activeSection.id) {
        updateActiveNavLink(activeSection.id);
      }
    };
    
    // Throttled scroll handler (50ms debounce)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 50);
    }, { passive: true });
    
    handleScroll(); // Initial check
    
    // Prevent scroll spy updates during programmatic scrolling
    document.querySelectorAll('.nav-links a[data-target]').forEach(a => {
      a.addEventListener('click', () => {
        isScrolling = true;
        setTimeout(() => {
          isScrolling = false;
          handleScroll();
        }, 800);
      });
    });
    
  } else {
    // Fallback: scroll position-based detection (for browsers without IntersectionObserver)
    window.addEventListener('scroll', () => {
      if (isScrolling) return;
      
      let current = '';
      const navH = navbar ? navbar.offsetHeight : 0;
      const scrollY = window.scrollY;
      
      if (scrollY < 100) {
        updateActiveNavLink('home');
        return;
      }
      
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      if (scrollY + windowHeight >= documentHeight - 100 && sections.length > 0) {
        const lastSection = sections[sections.length - 1];
        updateActiveNavLink(lastSection.id);
        return;
      }
      
      sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        const top = scrollY + rect.top - navH - 100;
        if (scrollY >= top) current = s.id;
      });
      
      if (current && currentActiveSection !== current) {
        updateActiveNavLink(current);
      }
    }, { passive: true });
  }

  // ============================================
  // PARALLAX EFFECT (Avatar Card)
  // ============================================
  if (avatarCard && window.matchMedia && !window.matchMedia('(pointer: coarse)').matches) {
    avatarCard.addEventListener('mousemove', (e) => {
      const rect = avatarCard.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width/2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height/2)) / rect.height;
      avatarCard.style.transform = `translate3d(${dx * 8}px, ${dy * 6}px, 0) rotateX(${dy * 2}deg) rotateY(${dx * 2}deg)`;
    });
    avatarCard.addEventListener('mouseleave', () => {
      avatarCard.style.transform = '';
    });
  }

  // HERO subtle parallax on scroll (affects elements with data-parallax)
  const hero = document.getElementById('home') || document.getElementById('hero');
  if (hero) {
    const onHeroScroll = () => {
      const rect = hero.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, 1 - (rect.top / (window.innerHeight || 1))));
      hero.style.setProperty('--hero-parallax', String(pct * 10)); // can be used in CSS
    };
    window.addEventListener('scroll', onHeroScroll, { passive: true });
    onHeroScroll();
  }

  // Profession typing for hero (small typing effect)
  // Typing animation for profession
  const profEl = document.getElementById('profession-typed');
  if (profEl) {
    const words = ['Full-Stack Developer', 'React Specialist', 'Node.js Expert', 'PostgreSQL Developer'];
    let pIdx = 0, pChar = 0, pDel = false;
    const pTypeSpeed = 60, pEraseSpeed = 35, pPause = 1500;
    const pTick = () => {
      const cur = words[pIdx % words.length];
      if (!pDel) {
        pChar++;
        profEl.textContent = cur.slice(0, pChar);
        if (pChar === cur.length) { pDel = true; setTimeout(pTick, pPause); return; }
        setTimeout(pTick, pTypeSpeed + Math.random() * 20);
      } else {
        pChar--;
        profEl.textContent = cur.slice(0, pChar);
        if (pChar === 0) { pDel = false; pIdx++; setTimeout(pTick, 300); return; }
        setTimeout(pTick, pEraseSpeed);
      }
    };
    setTimeout(pTick, 1000);
  }

  // CONTACT form: simple mailto demo
  // Enhanced Contact Form Handling
  const form = document.getElementById('contact-form');
  if (form) {
    const formGroups = form.querySelectorAll('.form-group');
    const statusEl = document.getElementById('form-status');
    
    // Real-time validation
    const validateField = (field) => {
      const formGroup = field.closest('.form-group');
      const errorEl = formGroup?.querySelector('.form-error');
      let isValid = true;
      let errorMsg = '';
      
      if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMsg = 'This field is required';
      } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address';
      }
      
      if (formGroup) {
        formGroup.classList.toggle('error', !isValid);
        if (errorEl) {
          errorEl.textContent = errorMsg;
        }
      }
      
      return isValid;
    };
    
    // Add validation on blur
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        const formGroup = field.closest('.form-group');
        if (formGroup?.classList.contains('error')) {
          validateField(field);
        }
      });
    });
    
    // Form submission
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      
      // Clear previous errors
      formGroups.forEach(group => group.classList.remove('error'));
      
      // Validate all fields
      const nameField = form.querySelector('#name');
      const emailField = form.querySelector('#email');
      const messageField = form.querySelector('#message');
      
      const isNameValid = validateField(nameField);
      const isEmailValid = validateField(emailField);
      const isMessageValid = validateField(messageField);
      
      if (!isNameValid || !isEmailValid || !isMessageValid) {
        if (statusEl) {
          statusEl.textContent = 'Please fix the errors above';
          statusEl.className = 'form-status error';
          setTimeout(() => {
            statusEl.className = 'form-status';
            statusEl.textContent = '';
          }, 5000);
        }
        return;
      }
      
      const formData = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        subject: form.querySelector('#subject')?.value.trim() || '',
        message: messageField.value.trim()
      };
      
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';
      
      // EmailJS integration
      // To use EmailJS:
      // 1. Sign up at https://www.emailjs.com/
      // 2. Create an email service and template
      // 3. Get your Public Key, Service ID, and Template ID
      // 4. Replace the values below and uncomment the EmailJS code
      
      // Option 1: EmailJS (recommended - free tier available)
      if (typeof emailjs !== 'undefined') {
        emailjs.send(
          'YOUR_SERVICE_ID',      // Replace with your EmailJS Service ID
          'YOUR_TEMPLATE_ID',     // Replace with your EmailJS Template ID
          {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject || 'Contact Form Submission',
            message: formData.message,
            to_name: 'Ian Hnk'
          },
          'YOUR_PUBLIC_KEY'       // Replace with your EmailJS Public Key
        )
        .then(() => {
        if (statusEl) {
          statusEl.textContent = 'Message sent successfully! I\'ll get back to you soon.';
          statusEl.className = 'form-status success';
        }
        form.reset();
        formGroups.forEach(group => group.classList.remove('error'));
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
          setTimeout(() => {
            if (statusEl) {
              statusEl.className = 'form-status';
              statusEl.textContent = '';
            }
          }, 5000);
        })
        .catch((error) => {
          console.error('EmailJS Error:', error);
          if (statusEl) {
            statusEl.textContent = 'Failed to send message. Please try again or email me directly at ianhnk01@gmail.com';
            statusEl.className = 'form-status error';
          }
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          setTimeout(() => {
            if (statusEl) {
              statusEl.className = 'form-status';
              statusEl.textContent = '';
            }
          }, 7000);
        });
      } else {
        // Fallback: mailto link if EmailJS is not configured
        const mailtoLink = `mailto:ianhnk01@gmail.com?subject=${encodeURIComponent(formData.subject || 'Contact from Portfolio')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
        window.location.href = mailtoLink;
        
        if (statusEl) {
          statusEl.textContent = 'Opening email client... If it doesn\'t open, please email ianhnk01@gmail.com directly.';
          statusEl.className = 'form-status success';
        }
        form.reset();
        formGroups.forEach(group => group.classList.remove('error'));
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        setTimeout(() => {
          if (statusEl) {
            statusEl.className = 'form-status';
            statusEl.textContent = '';
          }
        }, 5000);
      }
    });
    
    // Form reset handler
    form.addEventListener('reset', () => {
      formGroups.forEach(group => {
        group.classList.remove('error');
        const errorEl = group.querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
      });
      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.textContent = '';
      }
    });
  }
  

  // Accessibility: ESC closes mobile nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('mobile')) {
      navLinks.classList.remove('mobile');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // POLISH: animate skill/progress bars when visible
  setTimeout(() => {
    document.querySelectorAll('.prog i').forEach(el => {
      const w = el.style.width;
      el.style.width = '0';
      setTimeout(() => { el.style.width = w; el.style.transition = 'width 900ms cubic-bezier(.2,.9,.3,1)'; }, 80);
    });
  }, 300);

  /* ---------- PERSONAL ASSISTANT UI ---------- */
  const openBtn = document.getElementById('open-assistant');
  const modal = document.getElementById('assistant-modal');
  const closeBtn = document.getElementById('assistant-close');
  const assistantForm = document.getElementById('assistant-form');
  const assistantInput = document.getElementById('assistant-input');
  const assistantMessages = document.getElementById('assistant-messages');

  let previousActive = null;
  // Better open/close with animation and focus trap
  function setModalOpen(open) {
    if (!modal) return;
    if (open) {
      previousActive = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      // ensure visible for assistive tech
      modal.style.display = 'flex';
      // focus the input after transition starts
      setTimeout(() => assistantInput && assistantInput.focus(), 80);
      // set up focus trap
      document.addEventListener('focus', trapFocus, true);
    } else {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      // wait for transition to finish before hiding
      const onEnd = () => {
        modal.style.display = 'none';
        modal.removeEventListener('transitionend', onEnd);
      };
      modal.addEventListener('transitionend', onEnd);
      document.removeEventListener('focus', trapFocus, true);
      previousActive && previousActive.focus();
    }
  }

  function trapFocus(e) {
    if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
    const panel = modal.querySelector('.assistant-panel');
    if (!panel) return;
    if (panel.contains(e.target)) return; // allowed
    // otherwise move focus to first focusable element
    const focusable = panel.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
    else panel.focus();
    e.preventDefault && e.preventDefault();
  }

  // simple helper to append messages
  function appendMessage(text, who = 'bot') {
    if (!assistantMessages) return;
    const el = document.createElement('div');
    el.className = `assistant-message ${who}`;
    el.textContent = text;
    assistantMessages.appendChild(el);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
  }

  // basic mock responder that searches the about section for keywords
  function mockRespond(question) {
    const about = document.querySelector('#about .content');
    const txt = about ? about.innerText.toLowerCase() : '';
    const q = question.toLowerCase();
    // small heuristics
    if (q.includes('experience') || q.includes('years')) return 'I have 7+ years of professional experience across backend and platform engineering.';
    if (q.includes('stack') || q.includes('tech')) return 'Common stacks: Python (FastAPI), React, Go, Postgres, Redis. See the Projects section for details.';
    if (q.includes('nova') || q.includes('novaboard')) return 'NovaBoard is an AI Task Intelligence dashboard; it synthesizes task telemetry and uses LLMs for summaries.';
    if (q.includes('contact') || q.includes('email')) return 'You can contact me via the Contact form or email link in the Contact section.';
    // fallback: echo and suggest persona
    return "I'm a demo assistant. For richer answers, configure ASSISTANT_ENDPOINT to your assistant service that has been trained on Ian's data.";
  }

  if (openBtn && modal && assistantForm) {
    openBtn.addEventListener('click', () => setModalOpen(true));
    closeBtn && closeBtn.addEventListener('click', () => setModalOpen(false));

    // close on backdrop click
    modal.addEventListener('click', (e) => {
      const close = e.target.getAttribute && e.target.getAttribute('data-close');
      if (close) setModalOpen(false);
    });

    // handle submit
    assistantForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const q = (assistantInput.value || '').trim();
      if (!q) return;
      appendMessage(q, 'user');
      assistantInput.value = '';
      appendMessage('Thinking…', 'bot');
      // if an endpoint is configured, call it (assumes JSON API)
      if (ASSISTANT_ENDPOINT) {
        try {
          const res = await fetch(ASSISTANT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q }) });
          const data = await res.json();
          // replace the last 'Thinking…' message
          assistantMessages.lastElementChild && assistantMessages.lastElementChild.remove();
          appendMessage(data.answer || JSON.stringify(data), 'bot');
        } catch (err) {
          assistantMessages.lastElementChild && assistantMessages.lastElementChild.remove();
          appendMessage('Error contacting assistant. See console for details.', 'bot');
          console.error(err);
        }
      } else {
        // mock response
        // replace the last 'Thinking…' message
        assistantMessages.lastElementChild && assistantMessages.lastElementChild.remove();
        const reply = mockRespond(q);
        appendMessage(reply, 'bot');
      }
    });

    // keyboard escape closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') setModalOpen(false);
    });
  }

  // Stats counter animation when visible
  const statsSection = document.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statEls = Array.from(statsSection.querySelectorAll('.stat-value'));
    const statIo = new IntersectionObserver((entries, io) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        statEls.forEach(el => {
          const targetAttr = el.getAttribute('data-target');
          if (!targetAttr) return;
          const isPercent = targetAttr.toString().includes('.');
          const target = parseFloat(targetAttr);
          const duration = 1200;
          const start = performance.now();
          const initial = 0;
          const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const val = initial + (target - initial) * t;
            if (isPercent) {
              el.textContent = (Math.round(val * 100) / 100).toFixed(2) + (targetAttr.toString().endsWith('%') ? '' : '%');
            } else {
              el.textContent = Math.round(val).toLocaleString();
            }
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    statIo.observe(statsSection);
  }

})();



  // ============================================
  // PROJECT ICON PLACEHOLDERS
  // ============================================
  // Map projects to Font Awesome icons based on category/tech stack
  const projectIcons = {
    'novaboard': { icon: 'fa-chart-line', color: 'linear-gradient(135deg, #4f46e5, #6366f1)' },
    'fluxapi': { icon: 'fa-server', color: 'linear-gradient(135deg, #10b981, #059669)' },
    'persona': { icon: 'fa-file-code', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    'sentra': { icon: 'fa-shield-alt', color: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    'ai-notes': { icon: 'fa-robot', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    'atlasviz': { icon: 'fa-chart-bar', color: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    'beacon': { icon: 'fa-rocket', color: 'linear-gradient(135deg, #f97316, #ea580c)' },
    'aurora': { icon: 'fa-sun', color: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
    'helix': { icon: 'fa-sync-alt', color: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
    'pulse': { icon: 'fa-heartbeat', color: 'linear-gradient(135deg, #ec4899, #db2777)' },
    'quasar': { icon: 'fa-brain', color: 'linear-gradient(135deg, #a855f7, #9333ea)' },
    'mercury': { icon: 'fa-lock', color: 'linear-gradient(135deg, #64748b, #475569)' },
    'lumen': { icon: 'fa-lightbulb', color: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
    'orbit': { icon: 'fa-satellite', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    'nimbus': { icon: 'fa-cloud', color: 'linear-gradient(135deg, #94a3b8, #64748b)' },
    'forge': { icon: 'fa-hammer', color: 'linear-gradient(135deg, #78716c, #57534e)' },
    'quill': { icon: 'fa-pen-fancy', color: 'linear-gradient(135deg, #6366f1, #4f46e5)' }
  };

  // Fallback icon mapping by category
  const categoryIcons = {
    'ai': { icon: 'fa-brain', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    'web': { icon: 'fa-globe', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    'python': { icon: 'fa-python', color: 'linear-gradient(135deg, #3776ab, #306998)' },
    'backend': { icon: 'fa-server', color: 'linear-gradient(135deg, #10b981, #059669)' },
    'security': { icon: 'fa-shield-alt', color: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    'go': { icon: 'fa-code', color: 'linear-gradient(135deg, #00add8, #007d9c)' }
  };

  /**
   * Get icon for a project based on its ID or category
   */
  function getProjectIcon(projectId, categories) {
    // Try project-specific icon first
    if (projectIcons[projectId]) {
      return projectIcons[projectId];
    }
    
    // Try category-based icon
    if (categories) {
      const categoryList = categories.split(' ');
      for (const cat of categoryList) {
        if (categoryIcons[cat]) {
          return categoryIcons[cat];
        }
      }
    }
    
    // Default icon
    return { icon: 'fa-code', color: 'linear-gradient(135deg, #4f46e5, #6366f1)' };
  }

  /**
   * Create icon placeholder for a project card
   */
  function createIconPlaceholder(card, iconData) {
    const cardMedia = card.querySelector('.card-media');
    if (!cardMedia || cardMedia.classList.contains('icon-placeholder')) return;
    
    const img = cardMedia.querySelector('img');
    if (img) img.style.display = 'none';
    
    const iconPlaceholder = document.createElement('div');
    iconPlaceholder.className = 'project-icon-placeholder';
    iconPlaceholder.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${iconData.color};
      position: relative;
      overflow: hidden;
    `;
    
    const icon = document.createElement('i');
    icon.className = `fas ${iconData.icon}`;
    icon.style.cssText = `
      font-size: 48px;
      color: white;
      z-index: 2;
      position: relative;
      text-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    
    const pattern = document.createElement('div');
    pattern.style.cssText = `
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%);
      z-index: 1;
    `;
    
    iconPlaceholder.appendChild(icon);
    iconPlaceholder.appendChild(pattern);
    
    cardMedia.classList.add('icon-placeholder');
    cardMedia.appendChild(iconPlaceholder);
  }

  /**
   * Replace missing images with icon placeholders
   */
  function setupProjectIcons() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const img = card.querySelector('.card-media img');
      const projectId = card.getAttribute('data-project');
      const categories = card.getAttribute('data-category');
      const iconData = getProjectIcon(projectId || '', categories || '');
      
      if (!img) {
        // No image element, create icon directly
        createIconPlaceholder(card, iconData);
        return;
      }
      
      // Check if image file likely doesn't exist
      const imgSrc = img.src || img.getAttribute('src') || '';
      const knownMissingImages = [
        'atlasviz.jpg',
        'beacon.jpg'
      ];
      
      const isKnownMissing = knownMissingImages.some(missing => imgSrc.includes(missing));
      const isWrongImage = imgSrc.includes('project-persona.jpg') && projectId && projectId !== 'persona';
      
      // Handle image load error
      img.addEventListener('error', function() {
        createIconPlaceholder(card, iconData);
      }, { once: true });
      
      // Replace immediately if we know the image is missing
      if (isKnownMissing || isWrongImage || (img.complete && img.naturalWidth === 0 && img.naturalHeight === 0)) {
        createIconPlaceholder(card, iconData);
      } else if (img.complete) {
        // Image loaded successfully, check if it's actually valid
        if (img.naturalWidth === 0 && img.naturalHeight === 0) {
          createIconPlaceholder(card, iconData);
        }
      }
    });
  }

  // Initialize project icons on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupProjectIcons);
  } else {
    setupProjectIcons();
  }

  // ============================================
  // PROJECT CARDS CLEANUP
  // ============================================
  // Remove legacy event listeners by cloning cards
(function cleanupCards(){
  try {
    const track = document.querySelector('.projects-track');
    if (!track) return;
      
    const cards = Array.from(track.querySelectorAll('.project-card'));
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.__v4bound = false;
      card.replaceWith(clone);
    });
      
      // Re-setup icons after cleanup
      setTimeout(setupProjectIcons, 100);
    } catch(e) {
      console.warn('cleanupCards failed', e);
    }
})();

  // ============================================
  // BYT AI ASSISTANT (About Section)
  // ============================================
(() => {
  const bytMessages = document.getElementById('byt-messages');
  const bytInput = document.getElementById('byt-input');
  const bytSendBtn = document.getElementById('byt-send');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  if (!bytMessages || !bytInput || !bytSendBtn) return;

  // Knowledge base about Ian
  const knowledgeBase = {
    experience: "Ian has 7+ years of professional experience building scalable web platforms. He specializes in full-stack development with React, Node.js, and PostgreSQL, creating systems that prioritize speed, reliability, and developer productivity.",
    tech: "Ian's tech stack includes React, TypeScript, Next.js for frontend; Node.js, Python, FastAPI for backend; PostgreSQL, MongoDB, Redis for databases; and Docker, Git, AWS, CI/CD for DevOps. He's proficient across the entire development stack.",
    projects: "Ian has worked on 50+ projects including NovaBoard (AI dashboard), FluxAPI (microservices toolkit), and various open-source contributions. His projects serve 120k+ monthly active users with 99.99% uptime.",
    achievements: "Ian's achievements include serving 120k+ monthly active users, maintaining 99.99% uptime, contributing to open-source with 200+ users, and building 50+ projects. He focuses on performance engineering and scalable system design.",
    skills: "Ian excels in systems design, performance engineering, LLM integrations, and developer experience. He builds observable services, automates workflows, and ships with empathy.",
    approach: "Ian's core approach: design small, observable services; automate everything; and ship with empathy. He loves conversations that move from UX constraints to data schema to CI/CD pipelines."
  };

  // Simple keyword matching for responses
  function getResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('experience') || lowerQuery.includes('years') || lowerQuery.includes('professional')) {
      return knowledgeBase.experience;
    }
    if (lowerQuery.includes('tech') || lowerQuery.includes('technology') || lowerQuery.includes('stack') || lowerQuery.includes('skill')) {
      return knowledgeBase.tech;
    }
    if (lowerQuery.includes('project') || lowerQuery.includes('work') || lowerQuery.includes('built')) {
      return knowledgeBase.projects;
    }
    if (lowerQuery.includes('achievement') || lowerQuery.includes('accomplish') || lowerQuery.includes('metric')) {
      return knowledgeBase.achievements;
    }
    if (lowerQuery.includes('approach') || lowerQuery.includes('method') || lowerQuery.includes('philosophy')) {
      return knowledgeBase.approach;
    }
    if (lowerQuery.includes('who') || lowerQuery.includes('what') || lowerQuery.includes('tell me about')) {
      return `${knowledgeBase.experience} ${knowledgeBase.skills}`;
    }
    
    // Default response
    return "I can tell you about Ian's experience, tech stack, projects, achievements, or approach. Try asking about any of these topics! 💡";
  }

  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `byt-message ${isUser ? 'byt-message-user' : 'byt-message-bot'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const p = document.createElement('p');
    p.textContent = text;
    contentDiv.appendChild(p);
    
    messageDiv.appendChild(contentDiv);
    bytMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    bytMessages.scrollTop = bytMessages.scrollHeight;
    
    return messageDiv;
  }

  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'byt-typing';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    bytMessages.appendChild(typingDiv);
    bytMessages.scrollTop = bytMessages.scrollHeight;
    return typingDiv;
  }

  function removeTyping(typingDiv) {
    if (typingDiv && typingDiv.parentNode) {
      typingDiv.remove();
    }
  }

  function sendMessage() {
    const query = bytInput.value.trim();
    if (!query) return;

    // Add user message
    addMessage(query, true);
    bytInput.value = '';
    bytSendBtn.disabled = true;

    // Show typing indicator
    const typing = showTyping();

    // Simulate AI thinking time
    setTimeout(() => {
      removeTyping(typing);
      
      // Get response
      const response = getResponse(query);
      
      // Add bot response with typing effect
      addMessage(response);
      
      bytSendBtn.disabled = false;
      bytInput.focus();
    }, 800 + Math.random() * 400);
  }

  // Event listeners
  bytSendBtn.addEventListener('click', sendMessage);
  
  bytInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Suggestion chips
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query) {
        bytInput.value = query;
        sendMessage();
      }
    });
  });

  // Focus input on load
  setTimeout(() => {
    bytInput.focus();
  }, 500);
})();

// Enhanced Projects Section - Filtering & Modal
(() => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectsTrack = document.querySelector('.projects-track');
  const viewProjectBtns = document.querySelectorAll('.view-project-btn');
  const projectModal = document.getElementById('project-modal');
  const modalClose = projectModal?.querySelector('.modal-close');
  const modalBackdrop = projectModal?.querySelector('.modal-backdrop');

  if (!filterBtns.length || !projectCards.length) return;

  // Project data for modal
  const projectData = {
    novaboard: {
      title: 'NovaBoard',
      subtitle: 'AI-Powered Realtime Insights Dashboard',
      description: 'A comprehensive realtime insights dashboard that synthesizes telemetry data and summarizes blockers using LLMs. Built for product teams to quickly identify issues and optimize workflows.',
      tech: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'TypeScript'],
      features: [
        'Real-time telemetry synthesis',
        'LLM-powered blocker summarization',
        'Interactive data visualization',
        'Multi-tenant architecture',
        'High-performance caching layer'
      ],
      images: ['assets/images/project-novaboard.jpg'],
      live: '#',
      github: '#',
      docs: null
    },
    fluxapi: {
      title: 'FluxAPI',
      subtitle: 'Microservice Toolkit',
      description: 'A comprehensive microservice toolkit with built-in observability, graceful shutdown, and pluggable caching. Designed to accelerate backend development with production-ready patterns.',
      tech: ['Python', 'FastAPI', 'Celery', 'Redis'],
      features: [
        'Observability out of the box',
        'Graceful shutdown handling',
        'Pluggable caching layer',
        'Async task processing',
        'Production-ready patterns'
      ],
      images: ['assets/images/project-fluxapi.jpg'],
      live: null,
      github: '#',
      docs: '#'
    },
    persona: {
      title: 'Persona',
      subtitle: 'Static Site Generator',
      description: 'A modern static-site generator focused on tiny bundles, SEO optimization, and progressive hydration. Built for performance and developer experience.',
      tech: ['Vanilla JS', 'SCSS', 'Node.js'],
      features: [
        'Tiny bundle sizes',
        'SEO optimized',
        'Progressive hydration',
        'Fast builds',
        'Developer-friendly API'
      ],
      images: ['assets/images/project-persona.jpg'],
      live: '#',
      github: '#',
      docs: null
    },
    sentra: {
      title: 'Sentra',
      subtitle: 'Cloud-Native Security Monitoring',
      description: 'A cloud-native monitoring suite that detects anomalous API behavior using machine learning models. Built for security teams to identify threats in real-time.',
      tech: ['Go', 'Kafka', 'ClickHouse', 'ML'],
      features: [
        'Real-time anomaly detection',
        'ML-powered threat identification',
        'Scalable architecture',
        'Cloud-native design',
        'Comprehensive alerting'
      ],
      images: ['assets/images/project-sentra.jpg'],
      live: null,
      github: '#',
      docs: '#'
    },
    'ai-notes': {
      title: 'AI Notes Assistant',
      subtitle: 'Concept Project - Productivity Tool',
      description: 'A Flask-based notes assistant that summarizes and organizes content using AI APIs. Designed as a productivity tool for students.',
      tech: ['Python', 'Flask', 'OpenAI API'],
      features: [
        'Text summarization using AI',
        'Content organization',
        'Student-focused productivity features',
        'Flask-based backend',
        'OpenAI API integration'
      ],
      images: ['assets/images/project-persona.jpg'],
      live: null,
      github: '#',
      docs: null,
      codeSnippet: '# Example snippet: Summarize text\nfrom openai import OpenAI\n\nclient = OpenAI(api_key="your-key")\n\nresponse = client.responses.create(\n  model="gpt-3.5-turbo",\n  input="Summarize the following text..."\n)'
    }
  };

  // Update filter counts
  function updateFilterCounts() {
    const counts = {
      all: projectCards.length,
      web: 0,
      python: 0,
      ai: 0,
      security: 0
    };

    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category')?.split(' ') || [];
      categories.forEach(cat => {
        if (counts.hasOwnProperty(cat)) {
          counts[cat]++;
        }
      });
    });

    filterBtns.forEach(btn => {
      const filter = btn.getAttribute('data-filter');
      const countEl = btn.querySelector('.filter-count');
      if (countEl && counts[filter]) {
        countEl.textContent = counts[filter];
      }
    });
  }

  // Filter projects
  function filterProjects(filter) {
    filterBtns.forEach(btn => {
      const isActive = btn.getAttribute('data-filter') === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });

    projectCards.forEach((card, index) => {
      const categories = card.getAttribute('data-category')?.toLowerCase() || '';
      const shouldShow = filter === 'all' || categories.includes(filter);
      
      if (shouldShow) {
        card.classList.remove('hidden');
        card.style.animationDelay = `${index * 50}ms`;
      } else {
        card.classList.add('hidden');
      }
    });

    // Scroll to start
    if (projectsTrack) {
      projectsTrack.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  // Open modal
  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data || !projectModal) return;

    // Set modal content
    document.getElementById('modal-title').textContent = data.title;
    document.querySelector('.modal-subtitle').textContent = data.subtitle;
    document.getElementById('modal-description').textContent = data.description;
    
    // Set tech stack
    const techStack = document.getElementById('modal-tech-stack');
    techStack.innerHTML = '';
    data.tech.forEach(tech => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = tech;
      techStack.appendChild(tag);
    });

    // Set features
    const features = document.getElementById('modal-features');
    features.innerHTML = '';
    data.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      features.appendChild(li);
    });

    // Set images
    const mainImg = document.getElementById('modal-main-image');
    if (data.images && data.images[0]) {
      mainImg.src = data.images[0];
      mainImg.alt = `${data.title} screenshot`;
    }

    // Set links
    const liveLink = document.getElementById('modal-live-link');
    const githubLink = document.getElementById('modal-github-link');
    const docsLink = document.getElementById('modal-docs-link');

    if (data.live) {
      liveLink.href = data.live;
      liveLink.style.display = 'inline-flex';
    } else {
      liveLink.style.display = 'none';
    }

    if (data.github) {
      githubLink.href = data.github;
      githubLink.style.display = 'inline-flex';
    } else {
      githubLink.style.display = 'none';
    }

    if (data.docs) {
      docsLink.href = data.docs;
      docsLink.style.display = 'inline-flex';
    } else {
      docsLink.style.display = 'none';
    }

    // Show modal
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function closeModal() {
    if (!projectModal) return;
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event listeners
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterProjects(filter);
    });
  });

  viewProjectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      const projectId = card?.getAttribute('data-project');
      if (projectId) {
        openModal(projectId);
      }
    });
  });

  // Open modal on card click or "View Details" button
  projectCards.forEach(card => {
    // Handle card click - but not on links or buttons
    card.addEventListener('click', (e) => {
      // Don't open if clicking on links or buttons
      if (e.target.closest('.project-link, .view-project-btn, button, a')) return;
      const projectId = card.getAttribute('data-project');
      if (projectId) {
        e.preventDefault();
        e.stopPropagation();
        openModal(projectId);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal?.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Initialize
  updateFilterCounts();
})();

// Skills Section - Animate Skill Bars on Scroll
(() => {
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (!skillBars.length) return;

  const animateSkillBars = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        if (width) {
          fill.style.width = `${width}%`;
          fill.style.setProperty('--bar-width', `${width}%`);
        }
        observer.unobserve(fill);
      }
    });
  };

  const observer = new IntersectionObserver(animateSkillBars, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  skillBars.forEach(bar => {
    observer.observe(bar);
  });
})();

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
(function() {
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (!scrollToTopBtn) return;

  // Show/hide button based on scroll position
  function toggleScrollButton() {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }

  // Scroll to top function
  function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Event listeners
  window.addEventListener('scroll', toggleScrollButton, { passive: true });
  scrollToTopBtn.addEventListener('click', scrollToTop);

  // Initial check
  toggleScrollButton();
})();
