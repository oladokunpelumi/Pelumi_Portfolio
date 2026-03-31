(function () {
  const helpers = window.PortfolioSite;
  const archive = document.getElementById("writing-archive");
  const filters = document.getElementById("writing-filters");
  const emptyState = document.getElementById("writing-empty-state");

  if (!helpers || !archive) return;

  const cards = Array.from(archive.querySelectorAll("[data-entry-card]"));

  if (filters && cards.length) {
    let activeFilter = "all";

    function renderArchive() {
      let visibleCount = 0;

      cards.forEach((card) => {
        const series = card.dataset.series || "";
        const tags = (card.dataset.tags || "").split("|").filter(Boolean);
        const isVisible = activeFilter === "all" || series === activeFilter || tags.includes(activeFilter);

        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    }

    filters.addEventListener("click", (event) => {
      const target = event.target.closest("[data-filter]");
      if (!target) return;

      activeFilter = target.dataset.filter;
      filters.querySelectorAll(".filter-button").forEach((button) => {
        const isActive = button.dataset.filter === activeFilter;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
      renderArchive();
    });

    renderArchive();
  }

  helpers.applyReveal(document);
})();
