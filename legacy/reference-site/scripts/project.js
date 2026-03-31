(function () {
  const helpers = window.PortfolioSite;
  const projects = helpers?.getPublishedProjects() || [];
  const slug = document.documentElement.dataset.projectSlug;
  const project = projects.find((item) => item.slug === slug);
  const mount = document.getElementById("project-mount");

  if (!mount || !helpers) return;

  if (!project) {
    mount.innerHTML = `
      <section class="section page-shell">
        <article class="not-found-card reveal">
          <p class="card-type">Case Study</p>
          <h1>Project not found.</h1>
          <p>The requested case study could not be loaded from the shared content source.</p>
          <a class="button button-primary" href="${helpers.withBase("index.html")}">Return home</a>
        </article>
      </section>
    `;
    return;
  }

  const currentIndex = projects.findIndex((item) => item.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  const links = project.links || [];

  mount.innerHTML = `
    <section class="page-hero page-shell">
      <a class="project-back" href="${helpers.withBase("index.html#case-studies")}">← Back to case studies</a>
    </section>
    <section class="section page-shell">
      <div class="project-layout">
        <div class="project-main">
          <article class="project-hero-card reveal">
            <div class="cover-art" style="${helpers.createCoverStyle(project)}">
              <div class="cover-caption">
                <small>${helpers.escapeHtml(project.category)}</small>
                <span>${helpers.escapeHtml(project.title)}</span>
              </div>
            </div>
            <div class="project-hero-content">
              <p class="card-type">${helpers.escapeHtml(project.category)}</p>
              <h1>${helpers.escapeHtml(project.title)}</h1>
              <p>${helpers.escapeHtml(project.summary)}</p>
              <p class="feature-card-impact">${helpers.escapeHtml(project.outcome)}</p>
              <div class="chip-row">${helpers.createChips(project.stack)}</div>
              <div class="snapshot-grid">
                ${(project.snapshot || []).map((item) => `
                  <article class="snapshot-item">
                    <strong>${helpers.escapeHtml(item.value)}</strong>
                    <span>${helpers.escapeHtml(item.label)}</span>
                  </article>
                `).join("")}
              </div>
            </div>
          </article>

          <article class="project-section reveal">
            <p class="card-type">Problem</p>
            <h2>What needed to be solved.</h2>
            ${project.problem.map((paragraph) => `<p>${helpers.escapeHtml(paragraph)}</p>`).join("")}
          </article>

          <article class="project-section reveal">
            <p class="card-type">Approach</p>
            <h2>How the system was framed.</h2>
            ${project.approach.map((paragraph) => `<p>${helpers.escapeHtml(paragraph)}</p>`).join("")}
          </article>

          <article class="project-section reveal">
            <p class="card-type">Build Details</p>
            <h2>Architecture, tooling, and operating logic.</h2>
            <ul class="detail-list">
              ${(project.buildDetails || []).map((detail) => `<li>${helpers.escapeHtml(detail)}</li>`).join("")}
            </ul>
          </article>

          <article class="project-section reveal">
            <p class="card-type">Results</p>
            <h2>Operational outcome.</h2>
            <ul class="detail-list">
              ${(project.results || []).map((detail) => `<li>${helpers.escapeHtml(detail)}</li>`).join("")}
            </ul>
          </article>
        </div>

        <aside class="project-sidebar">
          <article class="project-sidebar-card reveal">
            <span class="sidebar-label">Role</span>
            <p>${helpers.escapeHtml(project.role)}</p>
          </article>

          <article class="project-sidebar-card reveal">
            <span class="sidebar-label">Quick Facts</span>
            <div class="meta-list">
              <div>
                <strong>Status</strong>
                <span>Published case study</span>
              </div>
              <div>
                <strong>Category</strong>
                <span>${helpers.escapeHtml(project.category)}</span>
              </div>
              <div>
                <strong>Stack</strong>
                <span>${helpers.escapeHtml(project.stack.join(" · "))}</span>
              </div>
            </div>
          </article>

          <article class="project-sidebar-card reveal">
            <span class="sidebar-label">Media & Links</span>
            <div class="project-nav-links">
              ${links.map((link) => `<a class="button-ghost" href="${helpers.escapeHtml(link.url)}" target="_blank" rel="noreferrer">${helpers.escapeHtml(link.label)}</a>`).join("") || "<p>No external links available for this case study yet.</p>"}
            </div>
          </article>

          <article class="project-sidebar-card reveal">
            <span class="sidebar-label">Next Project</span>
            <div class="article-card">
              <small class="card-type">${helpers.escapeHtml(nextProject.category)}</small>
              <strong>${helpers.escapeHtml(nextProject.title)}</strong>
              <p>${helpers.escapeHtml(nextProject.excerpt || nextProject.summary)}</p>
              <a class="text-link" href="${helpers.withBase(nextProject.detailPage)}">Open next case study</a>
            </div>
          </article>
        </aside>
      </div>
    </section>
  `;

  helpers.applyReveal(mount);
})();
