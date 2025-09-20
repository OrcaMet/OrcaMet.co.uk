/**
 * OrcaMet About Page - Simple Reliable JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // FIX VISIBILITY FIRST
  // ===================================
  // Ensure all content is visible immediately
  document.querySelectorAll('.section, .focus-item, .method-item, .stat-card').forEach(function(element) {
    element.style.opacity = '1';
    element.style.transform = 'none';
  });

  // ===================================
  // NAVBAR SHRINK
  // ===================================
  const navbar = document.querySelector('.navbar');
  
  function handleScroll() {
    if (!navbar) return;
    
    if (window.scrollY > 50) {
      navbar.classList.add('shrink');
    } else {
      navbar.classList.remove('shrink');
    }
  }
  
  // Initial check
  handleScroll();
  
  // Add scroll listener
  window.addEventListener('scroll', handleScroll);

  // ===================================
  // MOBILE MENU
  // ===================================
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav-menu');
  
  if (burger && nav) {
    burger.addEventListener('click', function() {
      nav.classList.toggle('active');
      burger.classList.toggle('active');
      
      // Update aria-expanded
      const isExpanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // ===================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ===================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only handle valid anchor links
      if (href && href !== '#') {
        e.preventDefault();
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ===================================
  // CLOSE MOBILE MENU WITH ESC KEY
  // ===================================
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
      nav.classList.remove('active');
      if (burger) {
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // ===================================
  // SIMPLE FADE IN ANIMATION (OPTIONAL)
  // ===================================
  // Only animate if IntersectionObserver exists and elements are below fold
  if ('IntersectionObserver' in window) {
    const elementsToAnimate = document.querySelectorAll('.stat-card, .focus-item, .method-item');
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1
    });
    
    elementsToAnimate.forEach(function(element) {
      // Only animate elements not currently visible
      const rect = element.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
      }
    });
  }

});
