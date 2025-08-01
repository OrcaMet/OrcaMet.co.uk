// Shrink navbar on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('shrink');
  } else {
    navbar.classList.remove('shrink');
  }
});

// Smooth scroll only for anchor links within the same page
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
  const href = link.getAttribute('href');

  // Only apply smooth scroll for internal anchors like "#contact"
  if (href && href.startsWith('#')) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const nav = document.querySelector("nav");

  burger.addEventListener("click", () => {
    nav.classList.toggle("active");
    burger.classList.toggle("toggle");
  });
});
