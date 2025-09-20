/**
 * OrcaMet About Page JavaScript
 * Handles navigation, animations, and interactive elements
 */

(function() {
  'use strict';

  // ===================================
  // CONFIGURATION
  // ===================================
  const config = {
    navbarShrinkThreshold: 50,
    scrollOffset: 80, // Height of fixed navbar
    animationDuration: 300,
    debounceDelay: 10
  };

  // ===================================
  // UTILITY FUNCTIONS
  // ===================================
  
  /**
   * Debounce function to limit rate of function calls
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Check if element exists in DOM
   */
  function elementExists(selector) {
    return document.querySelector(selector) !== null;
  }

  // ===================================
  // NAVBAR FUNCTIONALITY
  // ===================================
  
  /**
   * Handle navbar shrink on scroll
   */
  function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const scrolled = window.scrollY > config.navbarShrinkThreshold;
    
    if (scrolled) {
      navbar.classList.add('shrink');
    } else {
      navbar.classList.remove('shrink');
    }
  }

  // Optimized scroll handler with debouncing
  const debouncedScrollHandler = debounce(handleNavbarScroll, config.debounceDelay);

  /**
   * Initialize mobile menu functionality
   */
  function initMobileMenu() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav-menu');
    
    if (!burger || !nav) return;

    burger.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Toggle active classes
      nav.classList.toggle('active');
      burger.classList.toggle('active');
      
      // Update ARIA attributes for accessibility
      const isExpanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !isExpanded);
      
      // Prevent body scroll when menu is open (mobile)
      if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking on a nav link (mobile)
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          nav.classList.remove('active');
          burger.classList.remove('active');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // ===================================
  // SMOOTH SCROLLING
  // ===================================
  
  /**
   * Initialize smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    // Handle all anchor links, not just nav links
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Check if it's an internal anchor link
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const navbar = document.querySelector('.navbar');
          const navHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition = targetElement.offsetTop - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, href);
          
          // Set focus for accessibility
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }
      }
    });
  }

  // ===================================
  // KEYBOARD NAVIGATION
  // ===================================
  
  /**
   * Enhanced keyboard navigation support
   */
  function initKeyboardNav() {
    document.addEventListener('keydown', function(e) {
      const burger = document.getElementById('burger');
      const nav = document.getElementById('nav-menu');
      
      // ESC key closes mobile menu
      if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        if (burger) {
          burger.classList.remove('active');
          burger.setAttribute('aria-expanded', 'false');
          burger.focus(); // Return focus to burger button
        }
        document.body.style.overflow = '';
      }
    });
  }

  // ===================================
  // INTERSECTION OBSERVER ANIMATIONS
  // ===================================
  
  /**
   * Initialize scroll-triggered animations
   */
  function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;

    const animatedElements = document.querySelectorAll('.stat-card, .focus-item, .method-item');
    
    if (animatedElements.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Optionally unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Prepare elements and observe
    animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }

  // ===================================
  // PAGE LOADING OPTIMIZATIONS
  // ===================================
  
  /**
   * Optimize image loading
   */
  function initLazyLoading() {
    // Native lazy loading support check
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    } else {
      // Fallback for browsers without native lazy loading
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
      document.body.appendChild(script);
    }
  }

  /**
   * Handle window resize events
   */
  function handleResize() {
    const nav = document.getElementById('nav-menu');
    const burger = document.getElementById('burger');
    
    // Reset mobile menu state on desktop resize
    if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
      nav.classList.remove('active');
      if (burger) {
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  }

  const debouncedResizeHandler = debounce(handleResize, 250);

  // ===================================
  // INITIALIZATION
  // ===================================
  
  /**
   * Initialize all functionality when DOM is ready
   */
  function init() {
    // Core functionality
    initMobileMenu();
    initSmoothScroll();
    initKeyboardNav();
    handleNavbarScroll(); // Initial check
    
    // Enhanced features
    initScrollAnimations();
    initLazyLoading();
    
    // Event listeners
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
    window.addEventListener('resize', debouncedResizeHandler);
    
    // Clean up body overflow on page navigation
    window.addEventListener('pageshow', function() {
      document.body.style.overflow = '';
    });
    
    console.log('OrcaMet About page initialized successfully');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM is already ready
    init();
  }

  // ===================================
  // PUBLIC API (if needed)
  // ===================================
  
  // Expose certain functions globally if needed
  window.OrcaMet = window.OrcaMet || {};
  window.OrcaMet.reinitialize = init;
  window.OrcaMet.closeMenu = function() {
    const nav = document.getElementById('nav-menu');
    const burger = document.getElementById('burger');
    if (nav && nav.classList.contains('active')) {
      nav.classList.remove('active');
      if (burger) {
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  };

})();
