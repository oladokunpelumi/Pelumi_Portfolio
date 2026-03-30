(function () {
  const helpers = window.PortfolioSite;
  const slug = document.documentElement.dataset.articleSlug;
  const entries = helpers?.getPublishedWriting() || [];
  const entry = entries.find((item) => item.slug === slug);
  const mount = document.getElementById("article-mount");

  if (!helpers || !mount) return;

  function formatInlineMarkdown(text) {
    return helpers.escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }

  function stripDuplicateTitle(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const firstHeading = lines.findIndex((line) => /^#\s+/.test(line.trim()));

    if (firstHeading === -1) return markdown;

    const headingText = lines[firstHeading].replace(/^#\s+/, "").trim();
    if (headingText.toLowerCase() !== String(entry.title || "").trim().toLowerCase()) {
      return markdown;
    }

    lines.splice(firstHeading, 1);

    while (lines[0] === "") {
      lines.shift();
    }

    return lines.join("\n");
  }

  function renderMarkdown(markdown) {
    const normalized = stripDuplicateTitle(markdown).replace(/\r\n/g, "\n");
    const blocks = normalized
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean);

    return blocks.map((block) => {
      if (/^---+$/.test(block)) {
        return `<hr class="article-rule">`;
      }

      const lines = block.split("\n");
      const headingMatch = lines[0].match(/^(#{2,6})\s+(.+)$/);

      if (headingMatch) {
        const level = Math.min(headingMatch[1].length + 1, 6);
        return `<h${level}>${formatInlineMarkdown(headingMatch[2].trim())}</h${level}>`;
      }

      return `<p>${formatInlineMarkdown(lines.join(" "))}</p>`;
    }).join("");
  }

  function renderSectionCards() {
    return (entry.content || []).map((section) => `
      <article class="article-section reveal">
        <p class="card-type">${helpers.escapeHtml(entry.series)}</p>
        <h2>${helpers.escapeHtml(section.title)}</h2>
        ${section.paragraphs.map((paragraph) => `<p>${helpers.escapeHtml(paragraph)}</p>`).join("")}
      </article>
    `).join("");
  }

  function renderContinuousArticle(bodyHtml, sourceLabel) {
    return `
      <article class="article-prose-card reveal">
        <div class="article-prose-meta">
          <p class="card-type">${helpers.escapeHtml(entry.series)}</p>
          ${sourceLabel ? `<span class="article-source-label">${helpers.escapeHtml(sourceLabel)}</span>` : ""}
        </div>
        <div class="article-prose">
          ${bodyHtml}
        </div>
      </article>
    `;
  }

  function renderPage(mainContent) {
    const siblings = entries.filter((item) => item.slug !== slug).slice(0, 2);

    mount.innerHTML = `
      <section class="page-hero page-shell">
        <a class="article-back" href="${helpers.withBase("writing/index.html")}">← Back to writing</a>
      </section>
      <section class="section page-shell">
        <div class="project-layout">
          <div class="article-main">
            <article class="article-hero-card reveal">
              <div class="cover-art" style="background: linear-gradient(135deg, #09131a 0%, #1a2a4a 52%, #45dee7 100%);">
                <div class="cover-caption">
                  <small>${helpers.escapeHtml(entry.series)}</small>
                  <span>${helpers.escapeHtml(entry.title)}</span>
                </div>
              </div>
              <div class="article-hero-content">
                <p class="card-type">${helpers.escapeHtml(entry.series)}</p>
                <h1>${helpers.escapeHtml(entry.title)}</h1>
                <p>${helpers.escapeHtml(entry.dek || entry.excerpt)}</p>
                <div class="chip-row">${helpers.createChips(entry.tags)}</div>
              </div>
            </article>

            ${mainContent}
          </div>

          <aside class="article-sidebar">
            <article class="article-sidebar-card reveal">
              <span class="sidebar-label">Published</span>
              <p>${helpers.formatDate(entry.publishDate)}</p>
            </article>
            <article class="article-sidebar-card reveal">
              <span class="sidebar-label">Series</span>
              <p>${helpers.escapeHtml(entry.series)}</p>
            </article>
            <article class="article-sidebar-card reveal">
              <span class="sidebar-label">Tags</span>
              <div class="chip-row">${helpers.createChips(entry.tags)}</div>
            </article>
            <article class="article-sidebar-card reveal">
              <span class="sidebar-label">More from the archive</span>
              ${siblings.map((item) => `
                <div class="article-card">
                  <small class="card-type">${helpers.escapeHtml(item.series)}</small>
                  <strong>${helpers.escapeHtml(item.title)}</strong>
                  <p>${helpers.escapeHtml(item.excerpt)}</p>
                  <a class="text-link" href="${helpers.withBase(item.detailPage)}">Read article</a>
                </div>
              `).join("")}
            </article>
          </aside>
        </div>
      </section>
    `;

    helpers.applyReveal(mount);
  }

  async function init() {
    if (!entry) {
      mount.innerHTML = `
        <section class="section page-shell">
          <article class="not-found-card reveal">
            <p class="card-type">Writing</p>
            <h1>Article not found.</h1>
            <p>The writing entry you requested is not published in the shared content source.</p>
            <a class="button button-primary" href="${helpers.withBase("writing/index.html")}">Open writing archive</a>
          </article>
        </section>
      `;
      return;
    }

    if (entry.sourcePath) {
      try {
        const response = await fetch(helpers.withBase(entry.sourcePath));
        if (!response.ok) {
          throw new Error(`Failed to load article source: ${response.status}`);
        }

        const markdown = await response.text();
        renderPage(renderContinuousArticle(renderMarkdown(markdown), "Source document"));
        return;
      } catch (error) {
        console.warn(error);
      }
    }

    renderPage(renderSectionCards());
  }

  init();
})();
