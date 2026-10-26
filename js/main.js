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

  // 4. Modals: User-Initiated & Exit Intent
  const consultModal = document.getElementById('consultModal');
  const consultModalClose = document.getElementById('consultModalClose');
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

  consultModalClose?.addEventListener('click', () => closeModal(consultModal));
  exitIntentClose?.addEventListener('click', () => closeModal(exitIntentModal));

  // Close modals when clicking backdrop
  [consultModal, exitIntentModal].forEach(modal => {
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Trigger modal from any element with class .trigger-consult-modal
  document.querySelectorAll('.trigger-consult-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(consultModal);
    });
  });

  // Global Escape Key Listener for Modals & Mobile Drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (consultModal?.classList.contains('open')) closeModal(consultModal);
      if (exitIntentModal?.classList.contains('open')) closeModal(exitIntentModal);
      if (mobileDrawer?.classList.contains('open')) closeDrawer();
    }
  });

  // Polite Exit Intent Trigger (Desktop only, fires only once per session, never interrupts active form filling)
  let exitIntentFired = sessionStorage.getItem('navajeevanam_exit_modal_shown');
  document.addEventListener('mouseleave', (e) => {
    if (exitIntentFired) return;
    // Don't show if user is actively filling an input
    const isInteractingWithForm = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
    if (!isInteractingWithForm && e.clientY <= 10 && window.innerWidth > 920) {
      exitIntentFired = true;
      sessionStorage.setItem('navajeevanam_exit_modal_shown', 'true');
      openModal(exitIntentModal);
    }
  });

  // 5. Booking Form WhatsApp Sync & Accessible Validation
  const bookingForms = document.querySelectorAll('.consultation-form');
  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = form.querySelector('[name="name"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const conditionInput = form.querySelector('[name="condition"]');
      const messageInput = form.querySelector('[name="message"]');

      const name = nameInput?.value.trim() || '';
      const phone = phoneInput?.value.trim() || '';
      const condition = conditionInput?.value.trim() || 'General Consultation';
      const message = messageInput?.value.trim() || '';

      // Clear any prior errors
      form.querySelectorAll('.form-error-msg').forEach(err => err.remove());

      // Validation: Name must have at least 2 chars
      if (name.length < 2) {
        showFieldError(nameInput, 'Please enter your full name (at least 2 characters).');
        nameInput?.focus();
        return;
      }

      // Validation: Phone must have at least 10 digits
      const digitsOnly = phone.replace(/[^0-9]/g, '');
      if (digitsOnly.length < 10) {
        showFieldError(phoneInput, 'Please enter a valid 10-digit phone or WhatsApp number.');
        phoneInput?.focus();
        return;
      }

      // Construct draft WhatsApp text with clear healthcare guidance
      const waText = encodeURIComponent(
        `*New Consultation Enquiry - Navajeevanam Kalari Vaidyamadam*\n\n` +
        `*Patient Name:* ${name}\n` +
        `*Contact Phone:* ${phone}\n` +
        `*Condition / Treatment Interest:* ${condition}\n` +
        `*Message / Notes:* ${message || 'Seeking doctor consultation and treatment guidance'}\n\n` +
        `_(Please tap Send to deliver this message directly to the clinic)_`
      );

      // Open WhatsApp web or app with prepared draft
      const waUrl = `https://wa.me/919188278888?text=${waText}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Display transparent, reassuring confirmation explaining WhatsApp handoff
      form.innerHTML = `
        <div style="text-align: center; padding: 32px 16px; background: #FAF7F2; border-radius: 16px; border: 1px solid var(--forest-border);">
          <div style="width: 54px; height: 54px; background: #EBF2ED; color: #1C3829; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">✓</div>
          <h3 style="font-family: var(--font-serif); color: var(--forest-dark); font-size: 1.3rem; margin-bottom: 8px;">WhatsApp Draft Prepared</h3>
          <p style="color: var(--text-body); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 14px;">
            Thank you, <strong>${escapeHtml(name)}</strong>. We have opened WhatsApp on your device with your drafted details.
          </p>
          <p style="color: var(--text-muted); font-size: 0.84rem; line-height: 1.5; margin-bottom: 20px;">
            <strong>Next Step:</strong> Please review and tap <strong>Send</strong> inside WhatsApp to deliver your enquiry directly to our Vaidyar. Our clinic team reviews and responds to messages during consultation hours.
          </p>
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display: inline-flex;">
            <span>Re-open WhatsApp Chat</span>
          </a>
        </div>
      `;
    });
  });

  function showFieldError(input, errorText) {
    if (!input) return;
    input.classList.add('has-error');
    const errDiv = document.createElement('div');
    errDiv.className = 'form-error-msg';
    errDiv.style.color = '#B91C1C';
    errDiv.style.fontSize = '0.78rem';
    errDiv.style.marginTop = '4px';
    errDiv.textContent = errorText;
    input.parentNode.appendChild(errDiv);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});
