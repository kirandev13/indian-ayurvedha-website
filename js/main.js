/**
 * Navajeevanam Kalari Vaidyamadam - Core Interactions, Accessibility & Form Management
 * Conforms to WCAG AA, Keyboard Accessibility, and Clinically Responsible Healthcare Flows
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Pill Navigation Scroll Effect
  const navPill = document.querySelector('.nav-pill');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navPill?.classList.add('scrolled');
    } else {
      navPill?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Drawer Navigation (Accessible Dialog Semantics)
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  let lastActiveElementBeforeDrawer = null;

  if (mobileMenuBtn) {
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-controls', 'mobileDrawer');
  }

  const openDrawer = () => {
    if (!mobileDrawer) return;
    lastActiveElementBeforeDrawer = document.activeElement;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileDrawerClose?.focus();
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastActiveElementBeforeDrawer && typeof lastActiveElementBeforeDrawer.focus === 'function') {
      lastActiveElementBeforeDrawer.focus();
    }
  };

  mobileMenuBtn?.addEventListener('click', openDrawer);
  mobileDrawerClose?.addEventListener('click', closeDrawer);
  mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // 3. FAQ Accordion (Accessible ARIA & Dynamic Height Calculation)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      const qId = question.id || `faq-q-${index}`;
      const aId = answer.id || `faq-a-${index}`;
      question.id = qId;
      answer.id = aId;
      question.setAttribute('aria-controls', aId);
      answer.setAttribute('role', 'region');
      answer.setAttribute('aria-labelledby', qId);

      const isInitiallyActive = item.classList.contains('active');
      question.setAttribute('aria-expanded', isInitiallyActive ? 'true' : 'false');
      if (isInitiallyActive) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question');
            const otherAns = other.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          question.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        }
      });
    }
  });

  // Re-measure open accordion heights on window resize
  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-item.active .faq-answer').forEach(ans => {
      ans.style.maxHeight = ans.scrollHeight + 'px';
    });
  });

  // 4. Modals: Exit Intent (Polite & Dismissible)
  const exitIntentModal = document.getElementById('exitIntentModal');
  const exitIntentClose = document.getElementById('exitIntentClose');
  let lastActiveElementBeforeModal = null;

  const openModal = (modal) => {
    if (!modal) return;
    lastActiveElementBeforeModal = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn?.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElementBeforeModal && typeof lastActiveElementBeforeModal.focus === 'function') {
      lastActiveElementBeforeModal.focus();
    }
  };

  exitIntentClose?.addEventListener('click', () => closeModal(exitIntentModal));

  // Close modal when clicking backdrop
  exitIntentModal?.addEventListener('click', (e) => {
    if (e.target === exitIntentModal) closeModal(exitIntentModal);
  });

  // Global Escape Key Listener for Modals & Mobile Drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (exitIntentModal?.classList.contains('open')) closeModal(exitIntentModal);
      if (mobileDrawer?.classList.contains('open')) closeDrawer();
    }
  });

  // Polite Exit Intent Trigger (Desktop only, fires only once per session)
  let exitIntentFired = sessionStorage.getItem('navajeevanam_exit_modal_shown');
  document.addEventListener('mouseleave', (e) => {
    if (exitIntentFired) return;
    if (e.clientY <= 10 && window.innerWidth > 920) {
      exitIntentFired = true;
      sessionStorage.setItem('navajeevanam_exit_modal_shown', 'true');
      openModal(exitIntentModal);
    }
  });

  // Gallery Category Filtering
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card-item');
  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Dynamic Current Year for Footer Copyright
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = currentYear;
  });

  // Fade/Slide In on Scroll Animation for Blocks
  const animatedElements = document.querySelectorAll('.fade-in-scroll');
  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animatedElements.forEach(el => scrollObserver.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }

  // 2012 Inauguration Archive Toggle Handler
  const toggleInaugurationBtn = document.getElementById('toggleInaugurationArchiveBtn');
  const extendedInauguration = document.getElementById('inaugurationExtendedArchive');
  const inaugurationBtnText = document.getElementById('inaugurationBtnText');
  const inaugurationBtnIcon = document.getElementById('inaugurationBtnIcon');

  if (toggleInaugurationBtn && extendedInauguration) {
    toggleInaugurationBtn.addEventListener('click', () => {
      const isVisible = extendedInauguration.style.display !== 'none';
      if (isVisible) {
        extendedInauguration.style.display = 'none';
        if (inaugurationBtnText) inaugurationBtnText.textContent = 'View Complete Ceremony Archive (8 Photos)';
        if (inaugurationBtnIcon) inaugurationBtnIcon.style.transform = 'rotate(0deg)';
      } else {
        extendedInauguration.style.display = 'block';
        if (inaugurationBtnText) inaugurationBtnText.textContent = 'Collapse Extended Archive';
        if (inaugurationBtnIcon) inaugurationBtnIcon.style.transform = 'rotate(180deg)';
        extendedInauguration.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});
