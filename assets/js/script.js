'use strict';

// ===================================
// IMPROVED PORTFOLIO JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function () {
  
  // ===================================
  // 1. UTILITY FUNCTIONS
  // ===================================
  
  const elementToggleFunc = function (elem) {
    if (elem) elem.classList.toggle("active");
  };

  const debounce = function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const smoothScrollTo = function (targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  };

  // ===================================
  // 2. SIDEBAR FUNCTIONALITY
  // ===================================
  
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");
  
  if (sidebarBtn) {
    sidebarBtn.addEventListener("click", function () {
      elementToggleFunc(sidebar);
      
      // Update button text
      const btnText = sidebarBtn.querySelector('span');
      if (btnText) {
        btnText.textContent = sidebar.classList.contains('active') 
          ? 'Hide Contacts' 
          : 'Show Contacts';
      }
      
      // Add animation class
      sidebar.style.animation = 'slideInRight 0.3s ease';
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(e) {
    if (window.innerWidth < 1024) {
      if (sidebar && sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && !sidebarBtn.contains(e.target)) {
          sidebar.classList.remove('active');
          const btnText = sidebarBtn.querySelector('span');
          if (btnText) btnText.textContent = 'Show Contacts';
        }
      }
    }
  });

  // ===================================
  // 3. TESTIMONIAL MODAL (if needed)
  // ===================================
  
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  const testimonialsModalFunc = function () {
    if (modalContainer && overlay) {
      modalContainer.classList.toggle("active");
      overlay.classList.toggle("active");
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = modalContainer.classList.contains("active") 
        ? 'hidden' 
        : '';
    }
  };

  testimonialsItem.forEach(item => {
    item.addEventListener("click", function () {
      if (modalImg && modalTitle && modalText) {
        const avatar = this.querySelector("[data-testimonials-avatar]");
        const title = this.querySelector("[data-testimonials-title]");
        const text = this.querySelector("[data-testimonials-text]");
        
        if (avatar) {
          modalImg.src = avatar.src;
          modalImg.alt = avatar.alt;
        }
        if (title) modalTitle.innerHTML = title.innerHTML;
        if (text) modalText.innerHTML = text.innerHTML;
        
        testimonialsModalFunc();
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  }
  
  if (overlay) {
    overlay.addEventListener("click", testimonialsModalFunc);
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalContainer && modalContainer.classList.contains('active')) {
      testimonialsModalFunc();
    }
  });

  // ===================================
  // 4. PORTFOLIO FILTERING SYSTEM
  // ===================================
  
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");

  const filterFunc = function (selectedValue) {
    let visibleCount = 0;
    
    filterItems.forEach((item, index) => {
      const categories = item.dataset.category 
        ? item.dataset.category.split(',').map(cat => cat.trim().toLowerCase())
        : [];
      
      const shouldShow = selectedValue === "all" || categories.includes(selectedValue);
      
      // Smooth animation
      if (shouldShow) {
        setTimeout(() => {
          item.classList.add("active");
          item.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;
        }, 10);
        visibleCount++;
      } else {
        item.classList.remove("active");
      }
    });

    // Show message if no items match
    const noResultsMsg = document.querySelector('.no-results-message');
    if (visibleCount === 0 && !noResultsMsg) {
      const message = document.createElement('div');
      message.className = 'no-results-message';
      message.style.cssText = 'text-align: center; padding: 40px; color: hsl(0, 0%, 70%); font-size: 1.1rem;';
      message.textContent = 'No projects found in this category.';
      document.querySelector('.project-list')?.appendChild(message);
    } else if (visibleCount > 0 && noResultsMsg) {
      noResultsMsg.remove();
    }
  };

  // Custom select dropdown
  if (select) {
    select.addEventListener("click", function () {
      elementToggleFunc(this);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (select && select.classList.contains('active')) {
        if (!select.contains(e.target)) {
          select.classList.remove('active');
        }
      }
    });
  }

  selectItems.forEach(item => {
    item.addEventListener("click", function (e) {
      e.stopPropagation();
      const selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      if (select) select.classList.remove('active');
      filterFunc(selectedValue);
      
      // Update button states
      filterBtn.forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === selectedValue);
      });
    });
  });

  // Filter buttons
  let lastClickedBtn = filterBtn[0];

  filterBtn.forEach(btn => {
    btn.addEventListener("click", function () {
      const selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });

  // Initialize with "All" filter
  if (filterBtn.length > 0) {
    filterFunc("all");
  }

  // ===================================
  // 5. CONTACT FORM VALIDATION
  // ===================================
  
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  const validateForm = debounce(function() {
    if (form && formBtn) {
      const isValid = form.checkValidity();
      formBtn.toggleAttribute("disabled", !isValid);
      
      // Add visual feedback
      formBtn.style.opacity = isValid ? '1' : '0.5';
      formBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }
  }, 100);

  formInputs.forEach(input => {
    // Real-time validation
    input.addEventListener("input", validateForm);
    
    // Add focus styling
    input.addEventListener('focus', function() {
      this.parentElement?.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement?.classList.remove('focused');
      
      // Show error message if invalid
      if (!this.validity.valid) {
        this.classList.add('error');
      } else {
        this.classList.remove('error');
      }
    });
  });

  // Form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (this.checkValidity()) {
        // Add loading state
        if (formBtn) {
          formBtn.disabled = true;
          formBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';
        }
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
          if (formBtn) {
            formBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon><span>Sent!</span>';
          }
          
          // Reset form after 2 seconds
          setTimeout(() => {
            form.reset();
            if (formBtn) {
              formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
              formBtn.disabled = true;
            }
          }, 2000);
        }, 1500);
      }
    });
  }

  // ===================================
  // 6. NAVIGATION SYSTEM
  // ===================================
  
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  navigationLinks.forEach((link, linkIndex) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetPage = this.dataset.navLink;

      // Update active states
      pages.forEach((page, pageIndex) => {
        const match = page.dataset.page === targetPage;
        
        // Remove active from all first
        page.classList.remove("active");
        navigationLinks[pageIndex].classList.remove("active");
        
        // Add active to matched
        if (match) {
          // Small delay for smooth transition
          setTimeout(() => {
            page.classList.add("active");
            navigationLinks[linkIndex].classList.add("active");
            
            // Add page transition animation
            page.style.animation = 'fadeIn 0.5s ease';
          }, 50);
        }
      });

      // Smooth scroll to top
      smoothScrollTo(0, 400);
      
      // Update URL hash without scrolling
      history.pushState(null, null, `#${targetPage}`);
      
      // Close mobile sidebar if open
      if (sidebar && window.innerWidth < 1024) {
        sidebar.classList.remove('active');
        const btnText = sidebarBtn?.querySelector('span');
        if (btnText) btnText.textContent = 'Show Contacts';
      }
    });
  });

  // Handle page load with hash
  window.addEventListener('load', function() {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const targetLink = document.querySelector(`[data-nav-link="${hash}"]`);
      if (targetLink) {
        targetLink.click();
      }
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function() {
    const hash = window.location.hash.slice(1) || 'about';
    const targetLink = document.querySelector(`[data-nav-link="${hash}"]`);
    if (targetLink) {
      targetLink.click();
    }
  });

  // ===================================
  // 7. SKILL CATEGORIES ACCORDION
  // ===================================
  
  const skillCategories = document.querySelectorAll('[data-skill-category]');
  
  // Open first category by default
  if (skillCategories.length > 0) {
    skillCategories[0].classList.add('active');
    const firstContent = skillCategories[0].querySelector('.skill-content');
    if (firstContent) {
      firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    }
  }
  
  skillCategories.forEach(category => {
    const header = category.querySelector('.skill-header');
    const content = category.querySelector('.skill-content');
    
    if (header) {
      header.addEventListener('click', function () {
        const isActive = category.classList.contains('active');
        
        // Close all categories
        skillCategories.forEach(cat => {
          cat.classList.remove('active');
          const catContent = cat.querySelector('.skill-content');
          if (catContent) {
            catContent.style.maxHeight = '0';
          }
        });
        
        // Toggle current category
        if (!isActive) {
          category.classList.add('active');
          if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        }
      });
    }
  });

  // ===================================
  // 8. LAZY LOADING IMAGES
  // ===================================
  
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // ===================================
  // 9. SCROLL ANIMATIONS
  // ===================================
  
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.service-item, .skill-item, .project-item, .blog-post-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            entry.target.style.transition = 'all 0.6s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  };

  // Initialize scroll animations
  animateOnScroll();

  // ===================================
  // 10. SCROLL TO TOP BUTTON
  // ===================================
  
  const createScrollToTopButton = function() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '<ion-icon name="arrow-up-outline"></ion-icon>';
    button.setAttribute('aria-label', 'Scroll to top');
    button.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, hsl(45, 100%, 72%), hsl(35, 100%, 68%));
      color: hsl(240, 1%, 17%);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 4px 15px rgba(255, 178, 36, 0.3);
    `;
    
    document.body.appendChild(button);
    
    // Show/hide button on scroll
    window.addEventListener('scroll', debounce(function() {
      if (window.pageYOffset > 300) {
        button.style.opacity = '1';
        button.style.visibility = 'visible';
      } else {
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
      }
    }, 100));
    
    // Scroll to top on click
    button.addEventListener('click', function() {
      smoothScrollTo(0, 800);
    });
    
    // Hover effect
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 8px 25px rgba(255, 178, 36, 0.5)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 15px rgba(255, 178, 36, 0.3)';
    });
  };

  createScrollToTopButton();

  // ===================================
  // 11. TYPING EFFECT FOR NAME/TITLE
  // ===================================
  
  const typeEffect = function(element, text, speed = 100) {
    if (!element) return;
    
    let index = 0;
    element.textContent = '';
    
    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      }
    }
    
    type();
  };

  // Optional: Add typing effect to title
  // const titleElement = document.querySelector('.name');
  // if (titleElement) {
  //   const originalText = titleElement.textContent;
  //   typeEffect(titleElement, originalText, 100);
  // }

  // ===================================
  // 12. PERFORMANCE OPTIMIZATIONS
  // ===================================
  
  // Reduce unnecessary repaints
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        // Handle scroll-based operations here
        ticking = false;
      });
      ticking = true;
    }
  });

  // ===================================
  // 13. ACCESSIBILITY IMPROVEMENTS
  // ===================================
  
  // Add keyboard navigation for custom elements
  document.querySelectorAll('.navbar-link, .filter-btn').forEach(element => {
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Announce page changes to screen readers
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);

  navigationLinks.forEach(link => {
    link.addEventListener('click', function() {
      const pageName = this.dataset.navLink;
      announcer.textContent = `Navigated to ${pageName} page`;
    });
  });

  // ===================================
  // 14. CONSOLE MESSAGE
  // ===================================
  
  console.log('%c👋 Welcome to Akaash Hakim\'s Portfolio!', 'color: #ffdb70; font-size: 20px; font-weight: bold;');
  console.log('%cInterested in the code? Check out the repository!', 'color: #fff; font-size: 14px;');
  
  // ===================================
  // END OF IMPROVED JAVASCRIPT
  // ===================================
  
});