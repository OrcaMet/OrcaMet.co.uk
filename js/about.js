/**
 * OrcaMet About Page JavaScript - FIXED VERSION
 * Handles navigation, animations, and interactive elements
 */

(function() {
  'use strict';

  // ===================================
  // CONFIGURATION
  // ===================================
  const config = {
    navbarShrinkThreshold: 50,
    scrollOffset: 80,
    animationDuration: 300,
    debounceDelay: 10
  };

  // ===================================
  // UTILITY FUNCTIONS
  // ===================================
  
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

  // ===================================
  // NAVBAR FUNCTIONALITY
  // ===================================
  
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
      
      nav.classList.toggle('active');
      burger.classList.toggle('active');
      
      const isExpanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !isExpanded);
      
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

    // Close menu when clicking on a nav link
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
  
  function initSmoothScroll() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      
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
          
          history.pushState(null, null, href);
          
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }
      }
    });
  }

  // ===================================
  // KEYBOARD NAVIGATION
  // ===================================
  
  function initKeyboardNav() {
    document.addEventListener('keydown', function(e) {
      const burger = document.getElementById('burger');
      const nav = document.getElementById('nav-menu');
      
      if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        if (burger) {
          burger.classList.remove('active');
          burger.setAttribute('aria-expanded', 'false');
          burger.focus();
        }
        document.body.style.overflow = '';
      }
    });
  }

  // ===================================
  // FIXED ANIMATION SYSTEM
  // ===================================
  
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    // Only animate individual cards, not entire sections
    const animatedElements = document.querySelectorAll('.stat-card, .focus-item, .method-item');
    
    if (animatedElements.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
          entry.target.classList.add('visible');
          // Keep observing in case user scrolls back up
        }
      });
    }, observerOptions);

    // Add animation class to elements, but DON'T set opacity inline
    animatedElements.forEach((element, index) => {
      element.classList.add('scroll-animate');
      element.style.animationDelay = `${index * 0.1}s`;
      observer.observe(element);
    });
  }

  // ===================================
  // HANDLE RESIZE
  // ===================================
  
  function handleResize() {
    const nav = document.getElementById('nav-menu');
    const burger = document.getElementById('burger');
    
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
  
  function init() {
    // Core functionality
    initMobileMenu();
    initSmoothScroll();
    initKeyboardNav();
    handleNavbarScroll();
    
    // Animations - with the fix
    initScrollAnimations();
    
    // Event listeners
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
    window.addEventListener('resize', debouncedResizeHandler);
    
    window.addEventListener('pageshow', function() {
      document.body.style.overflow = '';
    });
    
    console.log('OrcaMet About page initialized successfully');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
