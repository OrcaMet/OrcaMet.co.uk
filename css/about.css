/**
 * OrcaMet About Page - Complete JavaScript
 * Handles navigation, animations, and all interactive elements
 * Version: 1.0.0
 */

(function() {
  'use strict';

  // ===================================
  // CONFIGURATION
  // ===================================
  const config = {
    navbarShrinkThreshold: 50,
    scrollOffset: 80,
    animationDuration: 600,
    debounceDelay: 10,
    throttleDelay: 100,
    mobileBreakpoint: 768
  };

  // ===================================
  // STATE MANAGEMENT
  // ===================================
  const state = {
    isMenuOpen: false,
    isScrolling: false,
    lastScrollPosition: 0,
    animatedElements: new Set()
  };

  // ===================================
  // UTILITY FUNCTIONS
  // ===================================
  
  /**
   * Debounce function to limit function call frequency
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
   * Throttle function for scroll events
   */
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Check if element exists
   */
  function elementExists(selector) {
    return document.querySelector(selector) !== null;
  }

  /**
   * Check if element is in viewport
   */
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom > 0 &&
      rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right > 0
    );
  }

  /**
   * Smooth scroll to element
   */
  function smoothScrollTo(element, offset = config.scrollOffset) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
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

    const scrolled = window.pageYOffset > config.navbarShrinkThreshold;
    
    if (scrolled && !navbar.classList.contains('shrink')) {
      navbar.classList.add('shrink');
    } else if (!scrolled && navbar.classList.contains('shrink')) {
      navbar.classList.remove('shrink');
    }
    
    state.lastScrollPosition = window.pageYOffset;
  }

  /**
   * Initialize navbar behavior
   */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Initial check
    handleNavbarScroll();
    
    // Throttled scroll handler
    const throttledScrollHandler = throttle(handleNavbarScroll, config.throttleDelay);
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
  }

  // ===================================
  // MOBILE MENU FUNCTIONALITY
  // ===================================
  
  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu(force = null) {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav-menu');
    
    if (!burger || !nav) return;
    
    const shouldOpen = force !== null ? force : !state.isMenuOpen;
    
    if (shouldOpen) {
      nav.classList.add('active');
      burger.classList.add('active');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      state.isMenuOpen = true;
    } else {
      nav.classList.remove('active');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      state.isMenuOpen = false;
    }
  }

  /**
   * Initialize mobile menu
   */
  function initMobileMenu() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav-menu');
    
    if (!burger || !nav) return;

    // Burger click handler
    burger.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (state.isMenuOpen && !nav.contains(e.target) && !burger.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });

    // Close menu when clicking nav links
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= config.mobileBreakpoint) {
          toggleMobileMenu(false);
        }
      });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth > config.mobileBreakpoint && state.isMenuOpen) {
          toggleMobileMenu(false);
        }
      }, 250);
    });
  }

  // ===================================
  // SMOOTH SCROLLING
  // ===================================
  
  /**
   * Initialize smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    document.addEventListener('click', function(e) {
      // Check if clicked element is or is within an anchor link
      const link = e.target.closest('a[href^="#"]');
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Ensure it's a valid anchor link
      if (href && href !== '#' && href.length > 1) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Calculate offset (account for fixed navbar)
          const navbar = document.querySelector('.navbar');
          const offset = navbar ? navbar.offsetHeight : config.scrollOffset;
          
          // Smooth scroll to target
          smoothScrollTo(targetElement, offset);
          
          // Update URL without jumping
          history.pushState(null, null, href);
          
          // Set focus for accessibility
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
          
          // Remove tabindex after focus
          targetElement.addEventListener('blur', function() {
            targetElement.removeAttribute('tabindex');
          }, { once: true });
        }
      }
    });
  }

  // ===================================
  // SCROLL ANIMATIONS
  // ===================================
  
  /**
   * Initialize scroll-triggered animations
   */
  function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all content immediately
      document.querySelectorAll('.section, .stat-card, .focus-item, .method-item').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && !state.animatedElements.has(entry.target)) {
          // Add animation class
          entry.target.classList.add('animate-in');
          
          // Set final styles
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Track animated elements
          state.animatedElements.add(entry.target);
          
          // Stop observing this element
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Prepare sections for animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      // Check if section is already in viewport
      if (!isInViewport(section)) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `opacity ${config.animationDuration}ms ease, transform ${config.animationDuration}ms ease`;
        observer.observe(section);
      } else {
        // If already in view, ensure it's visible
        section.style.opacity = '1';
        section.style.transform = 'none';
        state.animatedElements.add(section);
      }
    });

    // Prepare individual animated elements
    const animatedElements = document.querySelectorAll('.stat-card, .focus-item, .method-item');
    animatedElements.forEach((element, index) => {
      if (!isInViewport(element)) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity ${config.animationDuration}ms ease ${index * 50}ms, transform ${config.animationDuration}ms ease ${index * 50}ms`;
        observer.observe(element);
      } else {
        element.style.opacity = '1';
        element.style.transform = 'none';
        state.animatedElements.add(element);
      }
    });
  }

  // ===================================
  // KEYBOARD NAVIGATION
  // ===================================
  
  /**
   * Initialize keyboard navigation support
   */
  function initKeyboardNav() {
    document.addEventListener('keydown', function(e) {
      // ESC key closes mobile menu
      if (e.key === 'Escape' && state.isMenuOpen) {
        toggleMobileMenu(false);
        
        // Return focus to burger button
        const burger = document.getElementById('burger');
        if (burger) burger.focus();
      }
      
      // Tab trap for mobile menu when open
      if (e.key === 'Tab' && state.isMenuOpen) {
        const nav = document.getElementById('nav-menu');
        if (!nav) return;
        
        const focusableElements = nav.querySelectorAll(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  // ===================================
  // PERFORMANCE OPTIMIZATIONS
  // ===================================
  
  /**
   * Initialize lazy loading for images
   */
  function initLazyLoading() {
    // Check for native lazy loading support
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    } else {
      // Use Intersection Observer for lazy loading
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Preload critical resources
   */
  function preloadResources() {
    // Preload logo if not already loaded
    const logo = document.querySelector('.logo');
    if (logo && logo.src) {
      const img = new Image();
      img.src = logo.src;
    }
  }

  // ===================================
  // ERROR HANDLING & RECOVERY
  // ===================================
  
  /**
   * Ensure all content is visible (fallback)
   */
  function ensureContentVisible() {
    // This runs as a fallback to ensure content is visible
    setTimeout(function() {
      document.querySelectorAll('.section, .focus-item, .method-item').forEach(element => {
        if (window.getComputedStyle(element).opacity === '0') {
          element.style.opacity = '1';
          element.style.transform = 'none';
        }
      });
    }, 2000);
  }

  // ===================================
  // INITIALIZATION
  // ===================================
  
  /**
   * Initialize all functionality
   */
  function init() {
    try {
      // Core functionality
      initNavbar();
      initMobileMenu();
      initSmoothScroll();
      initKeyboardNav();
      
      // Animations and enhancements
      initScrollAnimations();
      initLazyLoading();
      
      // Performance optimizations
      preloadResources();
      
      // Fallback to ensure content is visible
      ensureContentVisible();
      
      // Clean up on page navigation
      window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
          // Page was restored from cache
          document.body.style.overflow = '';
          toggleMobileMenu(false);
        }
      });
      
      // Log successful initialization
      console.log('OrcaMet About page initialized successfully');
      
    } catch (error) {
      console.error('Error initializing page:', error);
      // Ensure content is visible even if there's an error
      document.querySelectorAll('.section, .focus-item, .method-item').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM is already ready
    init();
  }

  // ===================================
  // PUBLIC API (Optional)
  // ===================================
  
  // Expose some functions globally if needed
  window.OrcaMet = window.OrcaMet || {};
  window.OrcaMet.about = {
    toggleMenu: toggleMobileMenu,
    scrollTo: smoothScrollTo,
    reinitialize: init
  };

})();
