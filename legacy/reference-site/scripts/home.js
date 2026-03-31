(function () {
  const { projects, writing } = window.PORTFOLIO_CONTENT || {};
  const helpers = window.PortfolioSite;
  const writingEntries = Array.isArray(writing) ? writing : [];

  if (!projects || !helpers) return;

  const featuredContainer = document.getElementById("featured-projects");
  const substackContainer = document.getElementById("substack-feature");
  const gridPreviewContainer = document.getElementById("grid-preview-posts");

  if (featuredContainer) {
    const featuredProjects = projects.filter((project) => project.status === "published" && project.featured);

    featuredContainer.innerHTML = featuredProjects.map((project) => {
      const externalCtas = [];
      if (project.videoUrl) {
        externalCtas.push(`<a class="button-ghost" href="${helpers.escapeHtml(project.videoUrl)}" target="_blank" rel="noreferrer">Watch demo</a>`);
      }
      if (project.articleUrl) {
        externalCtas.push(`<a class="button-ghost" href="${helpers.escapeHtml(project.articleUrl)}" target="_blank" rel="noreferrer">View article</a>`);
      }

      return `
        <article class="feature-card reveal">
          <div class="project-cover" style="${helpers.createCoverStyle(project)}">
            <div class="cover-caption">
              <small>${helpers.escapeHtml(project.category)}</small>
              <span>${helpers.escapeHtml(project.title)}</span>
            </div>
          </div>
          <div class="feature-card-body">
            <div class="feature-card-title-row">
              <div>
                <p class="card-type">${helpers.escapeHtml(project.category)}</p>
                <h3>${helpers.escapeHtml(project.title)}</h3>
              </div>
            </div>
            <p>${helpers.escapeHtml(project.summary)}</p>
            <p class="feature-card-impact">${helpers.escapeHtml(project.impact)}</p>
            <div class="chip-row">${helpers.createChips(project.stack)}</div>
            <div class="cta-row">
              <a class="button button-primary" href="${helpers.withBase(project.detailPage)}">Read case study</a>
              ${externalCtas.join("")}
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  if (substackContainer) {
    const substack = writingEntries.find((entry) => entry.type === "substack-feature");
    if (substack) {
      substackContainer.classList.add("reveal");
      substackContainer.innerHTML = `
        <p class="card-type">External Writing Platform</p>
        <h3>${helpers.escapeHtml(substack.title)}</h3>
        <p>${helpers.escapeHtml(substack.excerpt)}</p>
        <div class="chip-row">${helpers.createChips(substack.tags)}</div>
        <a class="button button-primary" href="${helpers.escapeHtml(substack.externalUrl)}" target="_blank" rel="noreferrer">Read on Substack</a>
      `;
    }
  }

  if (gridPreviewContainer) {
    const publishedGrid = helpers.getPublishedWriting()
      .filter((entry) => entry.type === "grid")
      .slice(0, 1);

    gridPreviewContainer.innerHTML = publishedGrid.map((entry) => `
      <article class="archive-card reveal">
        <div class="archive-meta">
          <span>${helpers.escapeHtml(entry.series)}</span>
          <span>${helpers.formatDate(entry.publishDate)}</span>
        </div>
        <h3>${helpers.escapeHtml(entry.title)}</h3>
        <p>${helpers.escapeHtml(entry.excerpt)}</p>
        <div class="chip-row">${helpers.createChips(entry.tags)}</div>
        <a class="text-link" href="${helpers.withBase(entry.detailPage)}">Read entry</a>
      </article>
    `).join("");
  }

  helpers.applyReveal(document);
})();
