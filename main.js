/* =========================================================
   Burger Bliss — Scripts
   1. Activation du mode JS
   2. Header au scroll
   3. Révélation des éléments au scroll
   4. Compteurs animés
   5. Timeline (index des courbes)
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Mode JS : permet au CSS de masquer les éléments avant leur révélation */
  document.documentElement.classList.add("js");

  /* 2. Header : ombre + réduction après un léger scroll */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 3. Révélation au scroll */
  const revealables = document.querySelectorAll("[data-reveal]");
  revealables.forEach((el) => el.style.setProperty("--delay", el.dataset.delay || 0));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      if (entry.target.matches(".stat")) animateCounter(entry.target.querySelector("[data-count]"));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  revealables.forEach((el) => revealObserver.observe(el));

  /* 4. Compteurs : data-count, data-prefix, data-suffix */
  function animateCounter(el) {
    if (!el || reduceMotion) return;
    const { count, prefix = "", suffix = "" } = el.dataset;
    const target = Number(count);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* 5. Timeline : numérote les courbes/points (délais d’animation en cascade) + longueur normalisée */
  document.querySelectorAll(".timeline__curves path").forEach((path, i) => {
    path.setAttribute("pathLength", "1");
    path.style.setProperty("--i", i);
  });
  document.querySelectorAll(".timeline__step").forEach((step, i) => step.style.setProperty("--i", i));
})();