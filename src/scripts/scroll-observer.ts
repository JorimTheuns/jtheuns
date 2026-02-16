// --- State ---
const sections = Array.from(document.querySelectorAll(".section"));
const scrollParent = document.getElementById("scroll-parent");
let currentSectionIndex = 0;

// --- Nav buttons ---
const navUp = document.getElementById("nav-up");
const navDown = document.getElementById("nav-down");
const navLeft = document.getElementById("nav-left");
const navRight = document.getElementById("nav-right");

// --- Observe sections for active state (fade in when visible) ---
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        const idx = sections.indexOf(entry.target as HTMLElement);
        if (idx !== -1) currentSectionIndex = idx;
        updateNavState();
      } else {
        entry.target.classList.remove("active");
      }
    });
  },
  { threshold: 0.5 }
);

// --- Observe parts for active state (fade in when scrolled to) ---
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

// --- Initialize observers ---
sections.forEach((el) => sectionObserver.observe(el));
document.querySelectorAll(".part").forEach((el) => partObserver.observe(el));

// --- Scroll hint: show on first visit, hide after first horizontal scroll ---
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

// --- Navigation functions ---
function goToSection(index: number) {
  if (index < 0 || index >= sections.length || !scrollParent) return;
  const target = sections[index] as HTMLElement;
  scrollParent.scrollTo({ top: target.offsetTop, behavior: "smooth" });
}

function getActiveCarousel(): HTMLElement | null {
  const active = sections[currentSectionIndex];
  if (!active) return null;
  return active.querySelector(".section-carousel") as HTMLElement | null;
}

function goToPart(direction: "left" | "right") {
  const carousel = getActiveCarousel();
  if (!carousel) return;

  // Find the first .part to measure width
  const part = carousel.querySelector(".part") as HTMLElement | null;
  if (!part) return;

  const scrollAmount = part.offsetWidth + parseFloat(getComputedStyle(carousel.querySelector(".section-content")!).gap || "0");
  carousel.scrollBy({
    left: direction === "right" ? scrollAmount : -scrollAmount,
    behavior: "smooth",
  });
}

// --- Boundary state ---
function updateNavState() {
  // Up/Down boundaries
  if (navUp) {
    navUp.classList.toggle("disabled", currentSectionIndex <= 0);
  }
  if (navDown) {
    navDown.classList.toggle("disabled", currentSectionIndex >= sections.length - 1);
  }

  // Left/Right boundaries
  const carousel = getActiveCarousel();
  if (carousel) {
    const atStart = carousel.scrollLeft <= 1;
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1;
    if (navLeft) navLeft.classList.toggle("disabled", atStart);
    if (navRight) navRight.classList.toggle("disabled", atEnd);
  }
}

// --- Wire up button clicks ---
navUp?.addEventListener("click", () => goToSection(currentSectionIndex - 1));
navDown?.addEventListener("click", () => goToSection(currentSectionIndex + 1));
navLeft?.addEventListener("click", () => goToPart("left"));
navRight?.addEventListener("click", () => goToPart("right"));

// --- Keyboard navigation ---
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") { e.preventDefault(); goToSection(currentSectionIndex - 1); }
  if (e.key === "ArrowDown") { e.preventDefault(); goToSection(currentSectionIndex + 1); }
  if (e.key === "ArrowLeft") { e.preventDefault(); goToPart("left"); }
  if (e.key === "ArrowRight") { e.preventDefault(); goToPart("right"); }
});

// --- Listen to carousel scroll events for boundary updates ---
document.querySelectorAll(".section-carousel").forEach((carousel) => {
  carousel.addEventListener("scroll", updateNavState);
});

// --- Initial state ---
updateNavState();
