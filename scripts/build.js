const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SITE_URL = (process.env.SITE_URL || "https://pelumioladokun.xyz").replace(/\/$/, "");

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(relativePath, content) {
  const destination = path.join(DIST, relativePath);
  ensureDir(destination);
  fs.writeFileSync(destination, content);
}

function copyFile(sourceRelativePath, destinationRelativePath) {
  const source = path.join(ROOT, sourceRelativePath);
  const destination = path.join(DIST, destinationRelativePath);
  ensureDir(destination);
  fs.copyFileSync(source, destination);
}

function loadContent() {
  const contentPath = path.join(ROOT, "data/content.js");
  delete require.cache[require.resolve(contentPath)];
  return require(contentPath);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(dateString) {
  if (!dateString) return "";
  let parsed;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-").map(Number);
    parsed = new Date(Date.UTC(year, month - 1, day, 12));
  } else {
    parsed = new Date(dateString);
  }

  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  });
}

function withBase(basePath, targetPath) {
  if (!targetPath) return "";
  if (/^(https?:)?\/\//.test(targetPath) || targetPath.startsWith("mailto:") || targetPath.startsWith("#")) {
    return targetPath;
  }
  return `${basePath}${targetPath}`;
}

function toAbsoluteUrl(targetPath) {
  if (!targetPath) return "";
  if (/^(https?:)?\/\//.test(targetPath)) return targetPath;
  return `${SITE_URL}/${targetPath.replace(/^\//, "")}`;
}

function assetPath(targetPath) {
  if (!targetPath || /^(https?:)?\/\//.test(targetPath)) return targetPath;

  if (/\.(png|jpe?g)$/i.test(targetPath)) {
    const candidate = targetPath.replace(/\.(png|jpe?g)$/i, ".webp");
    if (fs.existsSync(path.join(ROOT, candidate))) {
      return candidate;
    }
  }

  return targetPath;
}

function collectDeployAssets(content) {
  const assetPaths = new Set();
  const addAsset = (value) => {
    if (!value) return;
    const resolved = assetPath(value);
    if (resolved && resolved.startsWith("assets/")) {
      assetPaths.add(resolved);
    }
  };

  (content.products || []).forEach((product) => {
    addAsset(product.coverImage);
    addAsset(product.secondaryCoverImage);
  });

  (content.projects || []).forEach((project) => {
    if (project.status === "published") {
      addAsset(project.coverImage);
    }
  });

  (content.writing || []).forEach((entry) => {
    if (entry.status === "published") {
      addAsset(entry.coverImage);
    }
  });

  return Array.from(assetPaths);
}

function createChips(values) {
  return (values || []).map((value) => `<span class="chip">${escapeHtml(value)}</span>`).join("");
}

function entrySeriesLabel(entry) {
  return entry.seriesLabel || entry.series;
}

function stripDuplicateTitle(markdown, title) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const firstHeading = lines.findIndex((line) => /^#\s+/.test(line.trim()));

  if (firstHeading === -1) return markdown;

  const headingText = lines[firstHeading].replace(/^#\s+/, "").trim();
  const normalizedHeading = headingText.toLowerCase();
  const normalizedTitle = String(title || "").trim().toLowerCase();
  const titleCandidates = new Set([
    normalizedTitle,
    normalizedTitle.replace(/^the grid[:,]?\s*prelude\s+[—-]\s*/i, "").trim(),
    normalizedTitle.split(": ").slice(1).join(": ").trim()
  ].filter(Boolean));

  if (!titleCandidates.has(normalizedHeading)) {
    return markdown;
  }

  lines.splice(firstHeading, 1);

  while (lines[0] === "") {
    lines.shift();
  }

  return lines.join("\n");
}

function formatInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function markdownToHtml(markdown, title) {
  const normalized = stripDuplicateTitle(markdown, title).replace(/\r\n/g, "\n");
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

function markdownToText(markdown, title) {
  return stripDuplicateTitle(markdown, title)
    .replace(/\r\n/g, "\n")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^---+$/gm, " ")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readSourceDocument(entry) {
  if (!entry.sourcePath) return "";
  const sourcePath = path.join(ROOT, entry.sourcePath);
  if (!fs.existsSync(sourcePath)) return "";
  return fs.readFileSync(sourcePath, "utf8");
}

function assertPublishedWritingSources(content) {
  const missing = (content.writing || [])
    .filter((entry) => entry.status === "published" && entry.type !== "substack-feature")
    .filter((entry) => !entry.sourcePath || !fs.existsSync(path.join(ROOT, entry.sourcePath)));

  if (!missing.length) return;

  const details = missing.map((entry) => `${entry.slug}: ${entry.sourcePath || "missing sourcePath"}`).join("\n");
  throw new Error(`Published writing entries require a readable source document:\n${details}`);
}

function getCertificationIcon(iconValue) {
  const iconMap = {
    "</>": "</>",
    Brain: "🧠",
    Teach: "🎓",
    Care: "🤝"
  };

  return iconMap[iconValue] || iconValue;
}

function buildDescription({ dek, excerpt, summary, bodyText }) {
  const preferred = dek || excerpt || summary || bodyText || "";
  return preferred.length > 165 ? `${preferred.slice(0, 162).trim()}...` : preferred;
}

function renderSeo({
  title,
  description,
  pagePath,
  imagePath,
  type = "website",
  noindex = false
}) {
  const canonical = pagePath === "index.html" ? `${SITE_URL}/` : toAbsoluteUrl(pagePath);
  const imageUrl = imagePath ? toAbsoluteUrl(assetPath(imagePath)) : "";
  const twitterCard = imageUrl ? "summary_large_image" : "summary";

  return `
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="${escapeHtml(type)}">
  <meta property="og:site_name" content="Pelumi Oladokun">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  ${imageUrl ? `<meta property="og:image" content="${escapeHtml(imageUrl)}">` : ""}
  <meta name="twitter:card" content="${twitterCard}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  ${imageUrl ? `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">` : ""}
  ${noindex ? `<meta name="robots" content="noindex, nofollow">` : ""}`;
}

function renderNav(basePath, pageType) {
  const writingHref = pageType === "home" ? "writing/index.html" : `${basePath}writing/index.html`;
  const expertiseHref = pageType === "home" ? "#projects" : `${basePath}index.html#projects`;
  const contactHref = pageType === "home" ? "#contact" : `${basePath}index.html#contact`;
  const aboutHref = pageType === "home" ? "#about" : `${basePath}index.html#about`;
  const productsHref = pageType === "home" ? "#products" : `${basePath}index.html#products`;

  const homeNav = `
      <a href="${aboutHref}">About</a>
      <a href="${productsHref}">Products</a>
      <a href="${expertiseHref}">Expertise</a>
      <a href="${writingHref}">Writing</a>
      <a href="${contactHref}">Contact</a>
  `;

  const subNav = `
      <a href="${expertiseHref}">Expertise</a>
      <a href="${writingHref}">Writing</a>
      <a href="${contactHref}">Contact</a>
  `;

  return `
  <nav class="site-nav">
    <a class="nav-logo" href="${pageType === "home" ? "index.html" : `${basePath}index.html`}">Pelumi<span>.</span></a>
    <button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav-links">
      <span></span>
    </button>
    <div class="nav-links" id="site-nav-links">
      ${pageType === "home" ? homeNav : subNav}
    </div>
    <a class="nav-cta" href="mailto:oladokunpelumi07@gmail.com">Get in Touch</a>
  </nav>`;
}

function renderFooter(basePath, pageType) {
  const homeHref = pageType === "home" ? "index.html" : `${basePath}index.html`;
  const writingHref = pageType === "home" ? "writing/index.html" : `${basePath}writing/index.html`;
  const extraLink = pageType === "home"
    ? `<a href="https://www.yourgbedu.com" target="_blank" rel="noreferrer">YourGbedu</a>`
    : `<a href="https://substack.com/@pelumioladokun" target="_blank" rel="noreferrer">Substack</a>`;

  return `
  <footer class="site-footer">
    <div class="page-shell footer-inner">
      <span>© 2026 Pelumi Oladokun. All rights reserved.</span>
      <div class="footer-links">
        <a href="${homeHref}">Home</a>
        <a href="${writingHref}">Writing</a>
        ${extraLink}
        <a href="mailto:oladokunpelumi07@gmail.com">Email</a>
      </div>
    </div>
  </footer>`;
}

function renderProductCard(product, basePath) {
  const inset = product.secondaryCoverImage
    ? `<div class="cover-inset" style="background-image: url('${escapeHtml(withBase(basePath, assetPath(product.secondaryCoverImage)))}');" aria-hidden="true"></div>`
    : "";

  return `
    <article class="product-card reveal">
      <div class="product-cover">
        <img class="cover-image" src="${escapeHtml(withBase(basePath, assetPath(product.coverImage)))}" alt="${escapeHtml(product.coverAlt || `${product.title} product preview`)}" loading="lazy" decoding="async">
        <span class="cover-pill">Live product</span>
        ${inset}
        <div class="cover-mark">${escapeHtml(product.title)}</div>
      </div>
      <div class="product-content">
        <p class="card-type">${escapeHtml(product.homepageCategory || "Live Product")}</p>
        <h3>${escapeHtml(product.title)}</h3>
        <p>${escapeHtml(product.homepageDescription || "")}</p>
        <div class="chip-row">${createChips(product.homepageChips || [])}</div>
        <a class="text-link" href="${escapeHtml(product.url)}" target="_blank" rel="noreferrer">View live product</a>
      </div>
    </article>
  `;
}

function renderCertificationProofCard(certification) {
  const icon = getCertificationIcon(certification.icon);

  return `
    <article class="proof-cert-card reveal">
      <span class="proof-cert-icon" aria-hidden="true">${escapeHtml(icon)}</span>
      <div class="proof-cert-body">
        <strong>${escapeHtml(certification.title)}</strong>
        <span>${escapeHtml(certification.issuer)} · ${escapeHtml(certification.issued)}</span>
      </div>
    </article>
  `;
}

function renderTechnicalKeywordCard(item) {
  return `
    <article class="tech-card reveal">
      <div class="tech-card-icon" aria-hidden="true">${escapeHtml(item.icon)}</div>
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.copy)}</p>
      </div>
      <div class="chip-row">${createChips(item.tags)}</div>
    </article>
  `;
}

function renderContactCard(item) {
  return `
    <a class="contact-card" href="${escapeHtml(item.href)}"${item.external ? ` target="_blank" rel="noreferrer"` : ""}>
      <span class="contact-icon" aria-hidden="true">${escapeHtml(item.icon)}</span>
      <div>
        <small>${escapeHtml(item.label)}</small>
        <strong>${escapeHtml(item.value)}</strong>
      </div>
    </a>
  `;
}

function renderFeaturedProjectCard(project, basePath) {
  const externalCtas = [];
  if (project.videoUrl) {
    externalCtas.push(`<a class="button-ghost" href="${escapeHtml(project.videoUrl)}" target="_blank" rel="noreferrer">Watch demo</a>`);
  }
  if (project.articleUrl) {
    externalCtas.push(`<a class="button-ghost" href="${escapeHtml(project.articleUrl)}" target="_blank" rel="noreferrer">View article</a>`);
  }

  return `
    <article class="feature-card reveal">
      <div class="project-cover">
        <img class="cover-image" src="${escapeHtml(withBase(basePath, assetPath(project.coverImage)))}" alt="${escapeHtml(`${project.title} project cover`)}" loading="lazy" decoding="async">
        <div class="cover-caption">
          <small>${escapeHtml(project.category)}</small>
          <span>${escapeHtml(project.title)}</span>
        </div>
      </div>
      <div class="feature-card-body">
        <div class="feature-card-title-row">
          <div>
            <p class="card-type">${escapeHtml(project.category)}</p>
            <h3>${escapeHtml(project.title)}</h3>
          </div>
        </div>
        <p>${escapeHtml(project.summary)}</p>
        <p class="feature-card-impact">${escapeHtml(project.impact)}</p>
        <div class="chip-row">${createChips(project.stack)}</div>
        <div class="cta-row">
          <a class="button button-primary" href="${escapeHtml(withBase(basePath, project.detailPage))}">Read case study</a>
          ${externalCtas.join("")}
        </div>
      </div>
    </article>
  `;
}

function renderArchiveCard(entry, basePath) {
  const tags = (entry.tags || []).map((tag) => escapeHtml(tag)).join("|");
  return `
    <article class="archive-card reveal" data-entry-card data-series="${escapeHtml(entry.series)}" data-tags="${tags}">
      <div class="archive-meta">
        <span>${escapeHtml(entrySeriesLabel(entry))}</span>
        <span>${escapeHtml(formatDate(entry.publishDate))}</span>
        <span>${escapeHtml(entry.type)}</span>
      </div>
      <h3>${escapeHtml(entry.title)}</h3>
      <p>${escapeHtml(entry.excerpt)}</p>
      <div class="chip-row">${createChips(entry.tags)}</div>
      <a class="text-link" href="${escapeHtml(withBase(basePath, entry.detailPage))}">Read article</a>
    </article>
  `;
}

function renderWritingSpotlightCard(entry, basePath) {
  return `
    <article class="spotlight-story-card">
      <div class="spotlight-story-meta">
        <span>${escapeHtml(entrySeriesLabel(entry))}</span>
        <span>${escapeHtml(formatDate(entry.publishDate))}</span>
        <span>${escapeHtml(entry.type)}</span>
      </div>
      <h3>${escapeHtml(entry.title)}</h3>
      <p>${escapeHtml(entry.excerpt)}</p>
      <div class="chip-row">${createChips(entry.tags)}</div>
      <div class="spotlight-story-actions">
        <a class="button button-primary" href="${escapeHtml(withBase(basePath, entry.detailPage))}">Read the story</a>
        <a class="text-link" href="${escapeHtml(withBase(basePath, "writing/index.html"))}">Browse the archive</a>
      </div>
    </article>
  `;
}

function renderWritingButtons(writingEntries) {
  const tags = Array.from(new Set(writingEntries.flatMap((entry) => entry.tags || [])));
  const buttons = [
    { key: "all", label: "All published" },
    { key: "The Grid", label: "The Grid" },
    ...tags.map((tag) => ({ key: tag, label: tag }))
  ];

  return buttons.map((button, index) => `
    <button class="filter-button${index === 0 ? " active" : ""}" type="button" data-filter="${escapeHtml(button.key)}" aria-pressed="${index === 0 ? "true" : "false"}">
      ${escapeHtml(button.label)}
    </button>
  `).join("");
}

function renderArticleBody(entry) {
  const markdown = readSourceDocument(entry);

  if (markdown) {
    return `
      <article class="article-prose-card reveal">
        <div class="article-prose-meta">
          <p class="card-type">${escapeHtml(entrySeriesLabel(entry))}</p>
          <span class="article-source-label">${escapeHtml(entry.status === "published" ? "Source document" : "Queued draft")}</span>
        </div>
        <div class="article-prose">
          ${markdownToHtml(markdown, entry.title)}
        </div>
      </article>
    `;
  }

  return `
    <article class="article-prose-card reveal">
      <div class="article-prose-meta">
        <p class="card-type">${escapeHtml(entrySeriesLabel(entry))}</p>
        <span class="article-source-label">${escapeHtml(entry.status === "queued" ? "Queued entry" : "Unavailable")}</span>
      </div>
      <div class="article-prose">
        <p>${escapeHtml(entry.dek || entry.excerpt || "This writing entry is not available yet.")}</p>
        <p>${escapeHtml(entry.status === "queued"
          ? "This entry is queued for publication and is not yet part of the public archive."
          : "The source document for this entry could not be loaded.")}</p>
      </div>
    </article>
  `;
}

function renderArticlePage(entry, writingEntries) {
  const siblings = writingEntries
    .filter((item) => item.slug !== entry.slug && item.status === "published" && item.type !== "substack-feature")
    .slice(0, 2);
  const markdown = readSourceDocument(entry);
  const bodyText = markdown ? markdownToText(markdown, entry.title) : "";
  const description = buildDescription({
    dek: entry.dek,
    excerpt: entry.excerpt,
    bodyText
  });
  const pageTitle = `${entry.title} | Pelumi Oladokun`;
  const noindex = entry.status !== "published";

  const articleVisual = entry.coverImage
    ? `
      <div class="article-cover-frame">
        <img class="article-cover-image" src="${escapeHtml(withBase("../", assetPath(entry.coverImage)))}" alt="${escapeHtml(entry.coverAlt || `${entry.title} cover image`)}" loading="eager" decoding="async">
      </div>
    `
    : `
      <div class="article-atmosphere" aria-hidden="true">
        <div class="article-atmosphere-mark">
          <small>${escapeHtml(entrySeriesLabel(entry))}</small>
          <span>${escapeHtml(entry.title)}</span>
        </div>
      </div>
    `;

  return `<!DOCTYPE html>
<html lang="en" data-base="../">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${renderSeo({
    title: pageTitle,
    description,
    pagePath: entry.detailPage,
    imagePath: entry.coverImage,
    type: "article",
    noindex
  })}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles/site.css">
</head>
<body>
  <div class="noise-layer"></div>
  ${renderNav("../", "article")}
  <main>
    <section class="page-hero page-shell">
      <a class="article-back" href="index.html">← Back to writing</a>
    </section>
    <section class="section page-shell article-page-shell">
      <div class="article-layout">
        <div class="article-main">
          <article class="article-hero-card article-hero-card-reading reveal">
            ${articleVisual}
            <div class="article-hero-content article-hero-content-reading">
              <div class="article-hero-meta-row">
                <p class="card-type">${escapeHtml(entrySeriesLabel(entry))}</p>
                <span class="article-hero-date">${escapeHtml(formatDate(entry.publishDate))}</span>
              </div>
              <h1>${escapeHtml(entry.title)}</h1>
              <p class="article-dek">${escapeHtml(entry.dek || entry.excerpt)}</p>
              <div class="chip-row article-chip-row">${createChips(entry.tags)}</div>
            </div>
          </article>
          ${renderArticleBody(entry)}
        </div>
        <aside class="article-sidebar article-sidebar-reading">
          <article class="article-sidebar-card reveal">
            <span class="sidebar-label">Article Notes</span>
            <div class="meta-list">
              <div>
                <strong>Published</strong>
                <span>${escapeHtml(formatDate(entry.publishDate))}</span>
              </div>
              <div>
                <strong>Series</strong>
                <span>${escapeHtml(entrySeriesLabel(entry))}</span>
              </div>
              <div>
                <strong>Tags</strong>
                <span>${escapeHtml(entry.tags.join(" · "))}</span>
              </div>
            </div>
          </article>
          <article class="article-sidebar-card reveal">
            <span class="sidebar-label">More from the archive</span>
            ${siblings.map((item) => `
              <div class="article-card">
                <small class="card-type">${escapeHtml(item.series)}</small>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.excerpt)}</p>
                <a class="text-link" href="${escapeHtml(withBase("../", item.detailPage))}">Read article</a>
              </div>
            `).join("") || `<p>No other published entries yet.</p>`}
          </article>
        </aside>
      </div>
    </section>
  </main>
  ${renderFooter("../", "article")}
  <script src="../scripts/site.js"></script>
</body>
</html>`;
}

function renderProjectPage(project, projects) {
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const description = buildDescription({
    summary: project.summary,
    excerpt: project.outcome
  });

  return `<!DOCTYPE html>
<html lang="en" data-base="../">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${renderSeo({
    title: `${project.title} | Pelumi Oladokun`,
    description,
    pagePath: project.detailPage,
    imagePath: project.coverImage,
    type: "article"
  })}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles/site.css">
</head>
<body>
  <div class="noise-layer"></div>
  ${renderNav("../", "project")}
  <main>
    <section class="page-hero page-shell">
      <a class="project-back" href="../index.html#projects">← Back to projects</a>
    </section>
    <section class="section page-shell">
      <div class="project-layout">
        <div class="project-main">
          <article class="project-hero-card reveal">
            <div class="cover-art">
              <img class="cover-image" src="${escapeHtml(withBase("../", assetPath(project.coverImage)))}" alt="${escapeHtml(`${project.title} project cover`)}" decoding="async">
              <div class="cover-caption">
                <small>${escapeHtml(project.category)}</small>
                <span>${escapeHtml(project.title)}</span>
              </div>
            </div>
            <div class="project-hero-content">
              <p class="card-type">${escapeHtml(project.category)}</p>
              <h1>${escapeHtml(project.title)}</h1>
              <p>${escapeHtml(project.summary)}</p>
              <p class="feature-card-impact">${escapeHtml(project.outcome)}</p>
              <div class="chip-row">${createChips(project.stack)}</div>
              <div class="snapshot-grid">
                ${(project.snapshot || []).map((item) => `
                  <article class="snapshot-item">
                    <strong>${escapeHtml(item.value)}</strong>
                    <span>${escapeHtml(item.label)}</span>
                  </article>
                `).join("")}
              </div>
            </div>
          </article>
          <article class="project-section reveal">
            <p class="card-type">Problem</p>
            <h2>What needed to be solved.</h2>
            ${(project.problem || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          </article>
          <article class="project-section reveal">
            <p class="card-type">Approach</p>
            <h2>How the system was framed.</h2>
            ${(project.approach || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          </article>
          <article class="project-section reveal">
            <p class="card-type">Build Details</p>
            <h2>Architecture, tooling, and operating logic.</h2>
            <ul class="detail-list">
              ${(project.buildDetails || []).map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
            </ul>
          </article>
          <article class="project-section reveal">
            <p class="card-type">Results</p>
            <h2>Operational outcome.</h2>
            <ul class="detail-list">
              ${(project.results || []).map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
            </ul>
          </article>
        </div>
        <aside class="project-sidebar">
          <article class="project-sidebar-card reveal">
            <span class="sidebar-label">Role</span>
            <p>${escapeHtml(project.role)}</p>
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
                <span>${escapeHtml(project.category)}</span>
              </div>
              <div>
                <strong>Stack</strong>
                <span>${escapeHtml(project.stack.join(" · "))}</span>
              </div>
            </div>
          </article>
          <article class="project-sidebar-card reveal">
            <span class="sidebar-label">Media & Links</span>
            <div class="project-nav-links">
              ${(project.links || []).map((link) => `
                <a class="button-ghost" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>
              `).join("") || "<p>No external links available for this case study yet.</p>"}
            </div>
          </article>
          <article class="project-sidebar-card reveal">
            <span class="sidebar-label">Next Project</span>
            <div class="article-card">
              <small class="card-type">${escapeHtml(nextProject.category)}</small>
              <strong>${escapeHtml(nextProject.title)}</strong>
              <p>${escapeHtml(nextProject.summary)}</p>
              <a class="text-link" href="${escapeHtml(withBase("../", nextProject.detailPage))}">Open next case study</a>
            </div>
          </article>
        </aside>
      </div>
    </section>
  </main>
  ${renderFooter("../", "project")}
  <script src="../scripts/site.js"></script>
</body>
</html>`;
}

function renderHomePage(content) {
  const featuredProjects = content.projects.filter((project) => project.status === "published" && project.featured);
  const publishedProjects = content.projects.filter((project) => project.status === "published");
  const publishedWriting = content.writing
    .filter((entry) => entry.status === "published" && entry.type !== "substack-feature")
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  const latestGrid = publishedWriting
    .filter((entry) => entry.type === "grid")
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))[0];
  const certifications = content.certifications || [];
  const heroMetrics = [
    { value: String(content.products.length), label: "Deployed Products" },
    { value: String(certifications.length), label: "Anthropic Certifications" },
    { value: `${publishedProjects.length}+`, label: "Technical Projects" },
    { value: "2+", label: "Years Building" }
  ];
  const operatingPrinciple = {
    acronym: "LENS",
    copy: "Look closely, extract what matters, narrow the noise, ship what works."
  };
  const technicalOverview = [
    {
      icon: "🧠",
      title: "AI Retrieval & Research Systems",
      copy: "Grounded knowledge flows, financial research pipelines, and context-first assistants.",
      tags: ["RAG", "Knowledge Workflows", "OpenAI API", "LangChain"]
    },
    {
      icon: "🔁",
      title: "Automation & Operations",
      copy: "Business processes rebuilt into reliable multi-step systems with reporting, retries, and clear outputs.",
      tags: ["n8n", "Zapier", "REST APIs", "Webhooks"]
    },
    {
      icon: "⛓",
      title: "Blockchain & Signal Infrastructure",
      copy: "Monitoring, filtering, and analysis across fast-moving ecosystems where timing and relevance matter.",
      tags: ["Multi-Chain", "Telegram", "Smart Contracts", "Signal Capture"]
    },
    {
      icon: "📈",
      title: "Data Science & Quantitative Models",
      copy: "Applied machine learning and financial modeling work shaped around real screening and decision tasks.",
      tags: ["Python", "TensorFlow", "Machine Learning", "Forecasting"]
    }
  ];
  const contactItems = [
    {
      icon: "✉",
      label: "Email",
      value: "oladokunpelumi07@gmail.com",
      href: "mailto:oladokunpelumi07@gmail.com"
    },
    {
      icon: "💼",
      label: "LinkedIn",
      value: "oladokun-pelumi-a168aa201",
      href: "https://linkedin.com/in/oladokun-pelumi-a168aa201",
      external: true
    },
    {
      icon: "𝕏",
      label: "Twitter / X",
      value: "@pelumioladokun_",
      href: "https://x.com/pelumioladokun_",
      external: true
    },
    {
      icon: "✍",
      label: "Substack",
      value: "@pelumioladokun",
      href: "https://substack.com/@pelumioladokun",
      external: true
    }
  ];
  const description = "Portfolio website for Pelumi Oladokun featuring AI automation work, shipped products, selected case studies, and writing.";

  return `<!DOCTYPE html>
<html lang="en" data-base="">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${renderSeo({
    title: "Pelumi Oladokun | AI Automation Developer",
    description,
    pagePath: "index.html"
  })}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/site.css">
</head>
<body>
  <div class="noise-layer"></div>
  ${renderNav("", "home")}
  <header class="hero" id="top">
    <div class="hero-orb hero-orb-a"></div>
    <div class="hero-orb hero-orb-b"></div>
    <div class="page-shell">
      <div class="hero-copy hero-copy-legacy reveal">
        <div class="eyebrow-pill">
          <span class="status-dot"></span>
          Available for opportunities
        </div>
        <h1 class="hero-name"><span>Pelumi</span> <strong>Oladokun.</strong></h1>
        <p class="hero-kicker">AI Automation Developer &amp; Systems Architect</p>
        <p class="hero-text">
          I build intelligent systems, deploy real products, and turn technical complexity into working outputs people can actually use.
        </p>
        <div class="hero-actions">
          <a class="button button-primary" href="#projects">See My Work</a>
          <a class="button button-secondary" href="#contact">Get in Touch</a>
        </div>
        <div class="hero-divider" aria-hidden="true"></div>
        <div class="hero-metrics hero-metrics-legacy">
          ${heroMetrics.map((item) => `
            <article>
              <strong>${escapeHtml(item.value)}</strong>
              <span>${escapeHtml(item.label)}</span>
            </article>
          `).join("")}
        </div>
      </div>
    </div>
  </header>
  <main>
    <section class="section page-shell" id="about">
      <div class="section-heading reveal">
        <span class="section-tag">About</span>
        <h2>Builder. Thinker. Operator.</h2>
        <p>I care about how work gets framed, how decisions get made, and whether the final system can survive beyond a polished first impression.</p>
      </div>
      <div class="editorial-split">
        <article class="story-card reveal">
          <p>I did not wait for a classroom to teach me how to build.</p>
          <p>While studying Agricultural Economics at FUNAAB, I was already teaching myself how systems work, how interfaces shape behavior, and how to move from curiosity into practical execution.</p>
          <p>That path made me comfortable working across both technical detail and business context. I like understanding the pressure underneath the request, not just the request itself.</p>
          <p>My edge is being able to listen to a messy problem, reduce it to what actually matters, and turn that into something clear, usable, and operational.</p>
          <p class="story-footnote">B.Sc. Agricultural Economics — FUNAAB, 2024 · Second Class Upper (2:1) · CGPA 4.26/5.0 · NYSC completed</p>
        </article>
        <div class="principles-stack reveal">
          <p class="card-type">Operating Principle</p>
          <article class="acronym-card lens-principle-card">
            <div class="lens-wordmark" aria-hidden="true">
              <span class="lens-letter">L</span>
              <span class="lens-letter">E</span>
              <span class="lens-letter lens-focus-letter">
                N
                <span class="lens-symbol">
                  <span class="lens-ring"></span>
                  <span class="lens-core"></span>
                  <span class="lens-glint"></span>
                </span>
              </span>
              <span class="lens-letter">S</span>
            </div>
            <p class="acronym-copy">${escapeHtml(operatingPrinciple.copy)}</p>
          </article>
        </div>
      </div>
    </section>
    <section class="section page-shell" id="products">
      <div class="section-heading reveal">
        <span class="section-tag">Deployed Products</span>
        <h2>Built &amp; Shipped. Live in the World.</h2>
        <p>Independent products taken from concept and design all the way through launch, deployment, and real-world usage.</p>
      </div>
      <div class="product-stack">
        ${content.products.map((product) => renderProductCard(product, "")).join("")}
      </div>
    </section>
    <section class="section page-shell" id="projects">
      <div class="section-heading reveal">
        <span class="section-tag">Expertise</span>
        <h2>Technical Projects. Certified Depth.</h2>
        <p>Broad expertise built through real systems work and reinforced by formal Anthropic certification across AI fluency, teaching, and Claude API implementation.</p>
      </div>
      <div class="expertise-layout">
        <div class="expertise-head reveal">
          <p class="card-type">Technical Projects</p>
          <h3>The problem spaces I build in most often.</h3>
          <p>These lanes summarize the systems, research workflows, and decision tools I keep returning to in client work and independent builds, while the proof strip shows formal Anthropic depth behind the AI side of that work.</p>
        </div>
        <div class="tech-grid">
          ${technicalOverview.map((item) => renderTechnicalKeywordCard(item)).join("")}
        </div>
        <div class="proof-strip reveal">
          <div class="proof-strip-copy">
            <p class="card-type">Certified Proof</p>
            <h3>Anthropic-certified across fluency, teaching, foundations, and Claude API implementation.</h3>
          </div>
          <div class="proof-strip-grid">
            ${certifications.map((certification) => renderCertificationProofCard(certification)).join("")}
          </div>
        </div>
      </div>
      <div class="case-study-cluster">
      <div class="featured-layout">
        <aside class="featured-intro reveal">
          <p class="card-type">Case Studies</p>
          <h3>Case studies that show the expertise in practice.</h3>
          <p>The breakdowns below connect the overview above to real delivery work: the problem, the architecture, the operating logic, and the outcome.</p>
          <div class="proof-stack">
            <div>
              <strong>AI Systems</strong>
              <span>RAG, research flows, and grounded assistants</span>
            </div>
            <div>
              <strong>Automation</strong>
              <span>workflow orchestration, reporting, and operational delivery</span>
            </div>
            <div>
              <strong>Data &amp; Quant</strong>
              <span>screening models, analytics, and decision support</span>
            </div>
          </div>
        </aside>
        <div class="case-study-grid">
          ${featuredProjects.map((project) => renderFeaturedProjectCard(project, "")).join("")}
        </div>
      </div>
      </div>
    </section>
    <section class="section page-shell" id="writing">
      <div class="section-heading reveal">
        <span class="section-tag">Writing</span>
        <h2>The Grid.</h2>
        <p>The main writing on this site is <em>The Grid</em>, a fiction series built around AI, energy, automation, robotics, and automated finance.</p>
      </div>
      <div class="writing-spotlight">
        <section class="grid-spotlight reveal">
          <div class="grid-spotlight-shell">
            <div class="grid-spotlight-top">
              ${latestGrid && latestGrid.coverImage ? `
                <div class="grid-spotlight-media">
                  <img class="grid-spotlight-image" src="${escapeHtml(withBase("", assetPath(latestGrid.coverImage)))}" alt="${escapeHtml(latestGrid.coverAlt || "The Grid series cover")}" loading="lazy" decoding="async">
                </div>
              ` : ""}
              <div class="grid-spotlight-copy-block">
                <div class="grid-preview-head grid-spotlight-head">
                  <div class="grid-preview-identity grid-spotlight-identity">
                    <p class="card-type">Site Series</p>
                    <h3>The Grid</h3>
                  </div>
                  <a class="button-ghost" href="writing/index.html">Open writing archive</a>
                </div>
                <p class="grid-preview-copy grid-spotlight-copy">A fiction series about infrastructure, power, and the systems that quietly run modern life. This archive is centered on the world, logic, and pressure systems inside <em>The Grid</em>.</p>
              </div>
            </div>
            <div class="spotlight-story-wrap">
              ${latestGrid
                ? renderWritingSpotlightCard(latestGrid, "")
                : `
                  <article class="spotlight-story-card">
                    <div class="spotlight-story-meta">
                      <span>The Grid</span>
                      <span>Coming soon</span>
                    </div>
                    <h3>New fiction is on the way.</h3>
                    <p>The archive is being shaped into a longer-running series around systems, power, and the pressure beneath modern infrastructure.</p>
                    <div class="spotlight-story-actions">
                      <a class="button button-primary" href="writing/index.html">Open the archive</a>
                    </div>
                  </article>
                `}
            </div>
          </div>
        </section>
      </div>
    </section>
    <section class="section page-shell" id="contact">
      <div class="section-heading reveal">
        <span class="section-tag">Contact</span>
        <h2>Let&apos;s Build Something.</h2>
        <p>If you&apos;re building a product, untangling an operational mess, or exploring an idea that needs sharp execution, let&apos;s talk.</p>
      </div>
      <div class="contact-grid">
        <div class="contact-list reveal">
          ${contactItems.map((item) => renderContactCard(item)).join("")}
        </div>
        <article class="availability-card reveal">
          <p class="card-type">Start Here</p>
          <h3>Bring the problem, the rough brief, or the idea that still needs shape.</h3>
          <p>I like conversations that begin with a real constraint and end with a clear plan, working prototype, or shipped system. Based in Lagos, collaborating remotely across time zones.</p>
          <a class="button button-primary" href="mailto:oladokunpelumi07@gmail.com">Send a Message</a>
        </article>
      </div>
    </section>
  </main>
  ${renderFooter("", "home")}
  <script src="scripts/site.js"></script>
</body>
</html>`;
}

function renderWritingArchivePage(content) {
  const publishedWriting = content.writing
    .filter((entry) => entry.status === "published" && entry.type !== "substack-feature")
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  const description = "Writing archive for Pelumi Oladokun centered on The Grid, a site-native fiction series about AI, energy, automation, robotics, and automated finance.";

  return `<!DOCTYPE html>
<html lang="en" data-base="../">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${renderSeo({
    title: "Writing | Pelumi Oladokun",
    description,
    pagePath: "writing/index.html"
  })}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles/site.css">
</head>
<body>
  <div class="noise-layer"></div>
  ${renderNav("../", "writing-archive")}
  <main id="writing-page">
    <section class="page-hero page-shell page-hero-compact">
      <div class="page-intro page-intro-compact reveal">
        <span class="section-tag">Writing Archive</span>
        <h1>The Grid and site-native fiction.</h1>
        <p>This archive is centered on <em>The Grid</em>, the fictional series exploring AI, infrastructure, power, robotics, and automated finance.</p>
      </div>
    </section>
    <section class="section page-shell section-tight-top">
      <div class="writing-archive-shell">
        <div class="filters-panel reveal">
          <p class="card-type">Filters</p>
          <div class="filter-row" id="writing-filters">
            ${renderWritingButtons(publishedWriting)}
          </div>
        </div>
        <div class="archive-grid" id="writing-archive">
          ${publishedWriting.map((entry) => renderArchiveCard(entry, "../")).join("")}
        </div>
        <p class="empty-state" id="writing-empty-state" hidden>No published posts match this filter yet.</p>
      </div>
    </section>
  </main>
  ${renderFooter("../", "writing-archive")}
  <script src="../scripts/site.js"></script>
  <script src="../scripts/writing.js"></script>
</body>
</html>`;
}

function buildSite() {
  const content = loadContent();
  assertPublishedWritingSources(content);

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  copyFile("styles/site.css", "styles/site.css");
  copyFile("scripts/site.js", "scripts/site.js");
  copyFile("scripts/writing.js", "scripts/writing.js");
  collectDeployAssets(content).forEach((asset) => copyFile(asset, asset));

  writeFile("index.html", renderHomePage(content));
  writeFile("writing/index.html", renderWritingArchivePage(content));

  const writingEntries = content.writing.filter((entry) => entry.status === "published" && entry.type !== "substack-feature" && entry.detailPage);
  for (const entry of writingEntries) {
    writeFile(entry.detailPage, renderArticlePage(entry, writingEntries));
  }

  const projects = content.projects.filter((project) => project.status === "published");
  for (const project of projects) {
    writeFile(project.detailPage, renderProjectPage(project, projects));
  }
}

buildSite();
