// Observe sections for active state (fade in when visible)
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove("active");
      }
    });
  },
  { threshold: 0.5 }
);

// Observe parts for active state (fade in when scrolled to)
const partObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { root: null, rootMargin: "-100px", threshold: 0.2 }
);

// Initialize observers
document.querySelectorAll(".section").forEach((el) => sectionObserver.observe(el));
document.querySelectorAll(".part").forEach((el) => partObserver.observe(el));

// Scroll hint: show on first visit, hide after first horizontal scroll
const HINT_KEY = "portfolio-scroll-hint-dismissed";
const scrollHint = document.getElementById("scroll-hint");

if (scrollHint && !localStorage.getItem(HINT_KEY)) {
  scrollHint.classList.remove("hidden");

  document.querySelectorAll(".section-carousel").forEach((carousel) => {
    carousel.addEventListener("scroll", () => {
      scrollHint.classList.add("hidden");
      localStorage.setItem(HINT_KEY, "1");
    }, { once: true });
  });
}
