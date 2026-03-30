(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const revealObserver = !reducedMotion.matches && typeof window.IntersectionObserver === "function"
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 })
    : {
      observe(target) {
        target.classList.add("visible");
      },
      unobserve() {}
    };

  function applyReveal(root = document) {
    const items = root.querySelectorAll(".reveal");
    if (!items.length) return;
    items.forEach((item) => revealObserver.observe(item));
  }

  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");

    if (!toggle || !links) return;

    if (!links.id) {
      links.id = "site-nav-links";
    }

    if (!toggle.getAttribute("aria-controls")) {
      toggle.setAttribute("aria-controls", links.id);
    }

    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(",");

    function getFocusableItems() {
      return Array.from(links.querySelectorAll(focusableSelector))
        .filter((item) => !item.hasAttribute("hidden") && item.offsetParent !== null);
    }

    function closeMenu({ restoreFocus = false } = {}) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");

      if (restoreFocus) {
        toggle.focus();
      }
    }

    function openMenu() {
      links.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");

      const firstLink = getFocusableItems()[0];
      if (firstLink) {
        firstLink.focus();
      }
    }

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeMenu({ restoreFocus: true });
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (links.classList.contains("open") && !links.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    links.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!links.classList.contains("open")) return;

      if (event.key === "Escape") {
        closeMenu({ restoreFocus: true });
        return;
      }

      if (event.key !== "Tab") return;

      const items = getFocusableItems();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  window.PortfolioSite = {
    applyReveal
  };

  applyReveal();
  initNav();
})();
