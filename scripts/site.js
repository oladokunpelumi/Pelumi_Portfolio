(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const themeKey = "portfolio-theme";

  const revealObserver = !reducedMotion.matches && "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -48px 0px" })
    : {
      observe(target) {
        target.classList.add("visible");
      },
      unobserve() {}
    };

  function applyReveal(root = document) {
    root.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateThemeMeta(theme) {
    let meta = document.querySelector("meta[name='theme-color']:not([media])");
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", theme === "dark" ? "#0F1419" : "#F5F1E8");
  }

  function syncThemeToggle(theme) {
    const isDark = theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      const label = button.querySelector(".theme-toggle-text");
      if (label) label.textContent = isDark ? "Light" : "Dark";
    });
  }

  function setTheme(theme, persist = true) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
    updateThemeMeta(nextTheme);
    syncThemeToggle(nextTheme);

    if (!persist) return;
    try {
      window.localStorage.setItem(themeKey, nextTheme);
    } catch (error) {
      // Storage can be unavailable in private or hardened browser contexts.
    }
  }

  function initTheme() {
    setTheme(currentTheme(), false);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        setTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    });
  }

  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

    function focusableItems() {
      return Array.from(links.querySelectorAll(focusableSelector))
        .filter((item) => !item.hasAttribute("hidden"));
    }

    function closeMenu(restoreFocus = false) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      if (restoreFocus) toggle.focus();
    }

    function openMenu() {
      links.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
      const first = focusableItems()[0];
      if (first) first.focus();
    }

    toggle.addEventListener("click", () => {
      if (links.classList.contains("open")) {
        closeMenu(true);
      } else {
        openMenu();
      }
    });

    links.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!links.classList.contains("open")) return;
      if (links.contains(event.target) || toggle.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (!links.classList.contains("open")) return;
      if (event.key === "Escape") {
        closeMenu(true);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusableItems();
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
      if (window.innerWidth > 760) closeMenu();
    });
  }

  function ordinalDay(day) {
    const suffix = day % 100 >= 11 && day % 100 <= 13
      ? "th"
      : { 1: "st", 2: "nd", 3: "rd" }[day % 10] || "th";
    return `${day}${suffix}`;
  }

  function localIsoDate(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function initEditionDateline() {
    const issue = document.querySelector("[data-current-issue]");
    if (!issue) return;

    const now = new Date();
    const monthYear = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    issue.textContent = `Issue ${ordinalDay(now.getDate())} · ${monthYear}`;
    issue.setAttribute("datetime", localIsoDate(now));
  }

  window.PortfolioSite = { applyReveal };

  initTheme();
  initNav();
  initEditionDateline();
  applyReveal();
})();
