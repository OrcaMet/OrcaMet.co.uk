/**
 * OrcaMet About Page JavaScript
 * Fixed version - ensures all content is visible
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // CRITICAL: ENSURE ALL CONTENT IS VISIBLE FIRST
  // ===================================
  function ensureContentVisible() {
    // Make absolutely sure all content is visible
    const allElements = document.querySelectorAll('.section, .focus-item, .method-item, .stat-card, .focus-icon, .method-icon');
    allElements.forEach(function(element) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.visibility = 'visible';
      element.style.display = ''; // Reset display if it was set to none
    });
    
    // Specifically ensure text content is visible
    const textElements = document.querySelectorAll('.focus-item h3, .focus-item p, .method-item h3, .method-item p');
    textElements.forEach(function(element) {
      element.style.opacity = '1';
      element.style.color = ''; // Reset to CSS default
      element.style.visibility = 'visible';
    });
  }
  
  // Run immediately
  ensureContentVisible();
  
  // Run again after a short delay to catch any late-loading elements
  setTimeout(ensureContentVisible, 100);
  setTimeout(ensureContentVisible, 500);

  // ===================================
  // NAVBAR SHRINK ON SCROLL
  // ===================================
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;
  
  function handleNavbarScroll() {
    if (!navbar) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      navbar.classList.add('shrink');
    } else {
      navbar.classList.remove('shrink');
    }
    
    lastScrollTop = scrollTop;
  }
  
  // Check initial scroll position
  handleNavbarScroll();
  
  // Add scroll event listener
  let scrollTimer;
  window.addEventListener('scroll', function() {
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
    scrollTimer = setTimeout(handleNavbarScroll, 10);
  });

  // ===================================
  // MOBILE MENU TOGGLE
  // ===================================
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav-menu');
  let menuOpen = false;
  
  function toggleMenu(shouldOpen) {
    if (!burger || !nav) return;
    
    if (shouldOpen === undefined) {
      shouldOpen = !menuOpen;
    }
    
    if (shouldOpen) {
      nav.classList.add('active');
      burger.classList.add('active');
      burger.setAttribute('aria-expanded', 'true');
      menuOpen = true;
    } else {
      nav.classList.remove('active');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      menuOpen = false;
    }
  }
  
  if (burger) {
    burger.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (menuOpen && nav && !nav.contains(e.target) && !burger.contains(e.target)) {
      toggleMenu(false);
    }
  });
  
  // Close menu when clicking on nav links
  if (nav) {
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          toggleMenu(false);
        }
      });
    });
  }

  // ===================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ===================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href && href !== '#' && href.length > 1) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ===================================
  // KEYBOARD NAVIGATION (ESC KEY)
  // ===================================
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuOpen) {
      toggleMenu(false);
      if (burger) {
        burger.focus();
      }
    }
  });

  // ===================================
  // SIMPLE FADE-IN FOR ELEMENTS (OPTIONAL)
  // ===================================
  function initSimpleAnimations() {
    // Only if IntersectionObserver is available
    if (!('IntersectionObserver' in window)) {
      return;
    }
    
    const elementsToAnimate = document.querySelectorAll('.stat-card, .focus-item, .method-item');
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Add a class for CSS animations if you want
          entry.target.classList.add('visible');
          // Ensure it's visible
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    elementsToAnimate.forEach(function(element) {
      // Check if element is currently in viewport
      const rect = element.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInViewport) {
        // Already in view, make sure it's visible
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.classList.add('visible');
      } else {
        // Below the fold, can animate when scrolled to
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
      }
    });
  }
  
  // Initialize animations after ensuring content is visible
  setTimeout(function() {
    initSimpleAnimations();
  }, 200);

  // ===================================
  // HANDLE WINDOW RESIZE
  // ===================================
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Close mobile menu if window is resized to desktop
      if (window.innerWidth > 768 && menuOpen) {
        toggleMenu(false);
      }
      // Ensure content stays visible
      ensureContentVisible();
    }, 250);
  });

  // ===================================
  // FINAL SAFETY CHECK
  // ===================================
  // One more check after everything should be loaded
  window.addEventListener('load', function() {
    ensureContentVisible();
    
    // Check if Focus Areas and How I Work have content
    const focusItems = document.querySelectorAll('.focus-item');
    const methodItems = document.querySelectorAll('.method-item');
    
    if (focusItems.length > 0) {
      focusItems.forEach(function(item) {
        const hasContent = item.querySelector('h3') && item.querySelector('p');
        if (!hasContent) {
          console.warn('Focus item missing content:', item);
        }
      });
    }
    
    if (methodItems.length > 0) {
      methodItems.forEach(function(item) {
        const hasContent = item.querySelector('h3') && item.querySelector('p');
        if (!hasContent) {
          console.warn('Method item missing content:', item);
        }
      });
    }
  });
  
  // Log that script has loaded
  console.log('About.js loaded - content should be visible');
  
});
