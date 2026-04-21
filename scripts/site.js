(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const THEME_STORAGE_KEY = "portfolio-theme";

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

  function readTheme() {
    const attributeTheme = document.documentElement.getAttribute("data-theme");
    if (attributeTheme === "dark" || attributeTheme === "light") {
      return attributeTheme;
    }
    return "light";
  }

  function updateThemeMeta(theme) {
    let themeMeta = document.querySelector("meta[name='theme-color']:not([media])");
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.setAttribute("name", "theme-color");
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute("content", theme === "dark" ? "#0d1016" : "#f5f7fc");
  }

  function syncThemeToggle(theme) {
    const toggleButtons = document.querySelectorAll("[data-theme-toggle]");
    if (!toggleButtons.length) return;

    const darkModeActive = theme === "dark";
    const nextThemeLabel = darkModeActive ? "Light" : "Dark";
    const ariaLabel = darkModeActive ? "Switch to light mode" : "Switch to dark mode";

    toggleButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(darkModeActive));
      button.setAttribute("aria-label", ariaLabel);
      const textNode = button.querySelector(".theme-toggle-text");
      if (textNode) {
        textNode.textContent = nextThemeLabel;
      }
    });
  }

  function setTheme(theme, options = {}) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    const persist = options.persist !== false;

    document.documentElement.setAttribute("data-theme", nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
    updateThemeMeta(nextTheme);
    syncThemeToggle(nextTheme);

    if (!persist) return;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      // Ignore storage failures in private mode or restricted environments.
    }
  }

  function initThemeToggle() {
    const toggleButtons = document.querySelectorAll("[data-theme-toggle]");
    if (!toggleButtons.length) return;

    setTheme(readTheme(), { persist: false });

    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = readTheme() === "dark" ? "light" : "dark";
        setTheme(nextTheme);
      });
    });
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

  initThemeToggle();
  applyReveal();
  initNav();
})();
