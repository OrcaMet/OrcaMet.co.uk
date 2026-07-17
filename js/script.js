/* Mobile menu */

const menu = document.querySelector("header nav");
const openMenu = document.querySelector("#open-menu");
const closeMenu = document.querySelector("#close-menu");

openMenu.addEventListener("click", () => {
  menu.classList.add("active");
});

closeMenu.addEventListener("click", () => {
  menu.classList.remove("active");
});

/* Reveal on scroll */

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -100px 0px",
    },
  );

  document
    .querySelectorAll(".container, .hero-content, .banner h1")
    .forEach((el) => observer.observe(el));
});

/* Prevents navigation transition on resize */

let resizeTimer;
window.addEventListener("resize", () => {
  if (!menu.classList.contains("no-transition")) {
    menu.classList.add("no-transition");
  }

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    menu.classList.remove("no-transition");
  }, 300);
});
