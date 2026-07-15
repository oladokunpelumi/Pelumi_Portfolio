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

function copyFile(sourceRelativePath, destinationRelativePath = sourceRelativePath) {
  const source = path.join(ROOT, sourceRelativePath);
  if (!fs.existsSync(source)) return;

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
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(dateString, options = {}) {
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
    year: options.short ? undefined : "numeric",
    month: options.short ? "short" : "long",
    day: "numeric",
    timeZone: "UTC"
  });
}

function ordinalDay(day) {
  const suffix = day % 100 >= 11 && day % 100 <= 13
    ? "th"
    : { 1: "st", 2: "nd", 3: "rd" }[day % 10] || "th";
  return `${day}${suffix}`;
}

function localDateParts(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return {
    iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    issue: `Issue ${ordinalDay(day)}`,
    monthYear: date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  };
}

function withBase(basePath, targetPath) {
  if (!targetPath) return "";
  if (/^(https?:)?\/\//.test(targetPath) || targetPath.startsWith("mailto:") || targetPath.startsWith("#")) {
    return targetPath;
  }
  return `${basePath}${targetPath}`;
}

function routeHref(route) {
  if (!route) return "";
  return route.replace(/index\.html$/, "");
}

function projectRoute(project) {
  return project.canonicalPath || `work/${project.slug}/index.html`;
}

function projectHref(project, basePath = "") {
  return withBase(basePath, routeHref(projectRoute(project)));
}

function toAbsoluteUrl(targetPath) {
  if (!targetPath) return "";
  if (/^(https?:)?\/\//.test(targetPath)) return targetPath;
  const clean = targetPath === "index.html" ? "" : routeHref(targetPath).replace(/^\//, "");
  return `${SITE_URL}/${clean}`;
}

function assetPath(targetPath) {
  if (!targetPath || /^(https?:)?\/\//.test(targetPath)) return targetPath;

  if (/\.(png|jpe?g)$/i.test(targetPath)) {
    const candidate = targetPath.replace(/\.(png|jpe?g)$/i, ".webp");
    if (fs.existsSync(path.join(ROOT, candidate))) return candidate;
  }

  return targetPath;
}

function addAsset(assetPaths, value) {
  if (!value) return;
  const resolved = assetPath(value);
  if (resolved && resolved.startsWith("assets/")) assetPaths.add(resolved);
}

function collectDeployAssets(content) {
  const assetPaths = new Set();

  (content.products || []).forEach((product) => {
    addAsset(assetPaths, product.coverImage);
    addAsset(assetPaths, product.secondaryCoverImage);
  });

  (content.projects || []).forEach((project) => {
    if (project.status !== "published") return;
    addAsset(assetPaths, project.coverImage);
    addAsset(assetPaths, project.heroImage);
    (project.previewImages || []).forEach((image) => addAsset(assetPaths, image.path));
    (project.documents || []).forEach((document) => addAsset(assetPaths, document.path));
  });

  (content.writing || []).forEach((entry) => {
    if (entry.status === "published") addAsset(assetPaths, entry.coverImage);
  });

  return Array.from(assetPaths);
}

function publishedProjects(content) {
  return (content.projects || []).filter((project) => project.status === "published");
}

function publishedWriting(content) {
  return (content.writing || [])
    .filter((entry) => entry.status === "published" && entry.type !== "substack-feature")
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
}

function latestGridEntry(content) {
  return publishedWriting(content)
    .filter((entry) => entry.type === "grid")
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))[0];
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

  if (!titleCandidates.has(normalizedHeading)) return markdown;

  lines.splice(firstHeading, 1);
  while (lines[0] === "") lines.shift();
  return lines.join("\n");
}

function formatInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function renderMarkdownBlock(block, state) {
  if (/^---+$/.test(block)) {
    state.sawRule = true;
    return `<hr class="article-rule">`;
  }

  const lines = block.split("\n");
  const headingMatch = lines[0].match(/^(#{2,6})\s+(.+)$/);

  if (headingMatch) {
    const heading = headingMatch[2].trim();
    if (/signal decoder/i.test(heading)) {
      state.inSignalDecoder = true;
      return `<section class="signal-decoder"><p class="signal-label">Signal Decoder</p><h2>${formatInlineMarkdown(heading.replace(/^SIGNAL DECODER\s*[—-]?\s*/i, ""))}</h2>`;
    }

    const level = state.inSignalDecoder ? 3 : Math.min(headingMatch[1].length + 1, 6);
    return `<h${level}>${formatInlineMarkdown(heading)}</h${level}>`;
  }

  const text = lines.join(" ");
  const openingClass = state.sawRule && !state.openingMarked && !state.inSignalDecoder
    ? ` class="article-opening"`
    : "";

  if (openingClass) state.openingMarked = true;

  return `<p${openingClass}>${formatInlineMarkdown(text)}</p>`;
}

function markdownToHtml(markdown, title) {
  const normalized = stripDuplicateTitle(markdown, title).replace(/\r\n/g, "\n");
  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const state = {
    sawRule: false,
    openingMarked: false,
    inSignalDecoder: false
  };
  const output = [];

  blocks.forEach((block) => {
    output.push(renderMarkdownBlock(block, state));
  });

  if (state.inSignalDecoder) output.push("</section>");
  return output.join("");
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
  const missing = publishedWriting(content)
    .filter((entry) => !entry.sourcePath || !fs.existsSync(path.join(ROOT, entry.sourcePath)));

  if (!missing.length) return;

  const details = missing.map((entry) => `${entry.slug}: ${entry.sourcePath || "missing sourcePath"}`).join("\n");
  throw new Error(`Published writing entries require a readable source document:\n${details}`);
}

function buildDescription({ dek, excerpt, summary, bodyText }) {
  const preferred = dek || excerpt || summary || bodyText || "";
  return preferred.length > 165 ? `${preferred.slice(0, 162).trim()}...` : preferred;
}

function renderSeo({ title, description, pagePath, imagePath, type = "website", noindex = false }) {
  const canonical = toAbsoluteUrl(pagePath);
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

function renderThemeBootstrapScript() {
  return `<script>
  (function () {
    var key = "portfolio-theme";
    var root = document.documentElement;
    var theme = "light";
    try {
      var saved = localStorage.getItem(key);
      if (saved === "light" || saved === "dark") {
        theme = saved;
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
      }
    } catch (error) {}
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
  })();
  </script>`;
}

function renderFontLinks() {
  return `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400;1,6..72,500;1,6..72,600&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">`;
}

function renderNav(basePath, pageType = "home") {
  const homeHref = pageType === "home" ? "#top" : withBase(basePath, "index.html");
  const writingHref = withBase(basePath, "writing/");
  const workHref = withBase(basePath, "work/");
  const contactHref = pageType === "home" ? "#contact" : withBase(basePath, "index.html#contact");

  return `
  <header class="masthead">
    <div class="container masthead-row">
      <a class="logo" href="${escapeHtml(homeHref)}">Pelumi.</a>
      <button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav-links">
        <span></span>
      </button>
      <nav class="nav-links" id="site-nav-links" aria-label="Primary navigation">
        <a href="${escapeHtml(homeHref)}">Home</a>
        <a href="${escapeHtml(workHref)}"${pageType === "work" || pageType === "project" ? " aria-current=\"page\"" : ""}>Work</a>
        <a href="${escapeHtml(writingHref)}"${pageType === "writing" || pageType === "article" ? " aria-current=\"page\"" : ""}>Writing</a>
        <a href="${escapeHtml(contactHref)}">Contact</a>
      </nav>
      <div class="nav-actions">
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode" aria-pressed="false">
          <span class="theme-toggle-icon" aria-hidden="true"></span>
          <span class="theme-toggle-text">Dark</span>
        </button>
        <a class="write-link" href="mailto:oladokunpelumi07@gmail.com">Write</a>
      </div>
    </div>
  </header>`;
}

function renderDateline(content) {
  return `<div class="dateline">${escapeHtml(content.site?.dateline || "Volume I · May 2026 · Lagos")}</div>`;
}

function renderHomeDateline(content) {
  const dateParts = localDateParts();
  const volume = content.site?.volume || "Volume 3";
  const location = content.site?.location || "Remote";

  return `<div class="dateline dateline-edition" data-current-edition>
    <span>${escapeHtml(volume)}</span>
    <span aria-hidden="true">·</span>
    <time data-current-issue datetime="${escapeHtml(dateParts.iso)}">${escapeHtml(dateParts.issue)} · ${escapeHtml(dateParts.monthYear)}</time>
    <span aria-hidden="true">·</span>
    <span class="dateline-location">
      <svg class="dateline-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
        <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"></path>
        <circle cx="12" cy="10" r="2.3"></circle>
      </svg>
      <span>${escapeHtml(location)}</span>
    </span>
  </div>`;
}

function renderFooter(basePath, pageType = "home") {
  return `
  <footer class="site-footer">
    <div class="container footer-inner">
      <span>© 2026 Pelumi Oladokun.</span>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="${escapeHtml(withBase(basePath, "work/"))}">Work</a>
        <a href="${escapeHtml(withBase(basePath, "writing/"))}">Writing</a>
        <a href="https://substack.com/@pelumioladokun" target="_blank" rel="noreferrer">Substack</a>
        <a href="mailto:oladokunpelumi07@gmail.com">Email</a>
      </nav>
    </div>
  </footer>`;
}

function renderDocumentShell({ basePath, pageType, title, description, pagePath, imagePath, type, body, extraScripts = "" }) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#F5F1E8" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0F1419" media="(prefers-color-scheme: dark)">
  ${renderSeo({ title, description, pagePath, imagePath, type })}
  ${renderThemeBootstrapScript()}
  ${renderFontLinks()}
  <link rel="stylesheet" href="${escapeHtml(withBase(basePath, "styles/site.css"))}">
</head>
<body>
  ${renderNav(basePath, pageType)}
  ${body}
  ${renderFooter(basePath, pageType)}
  <script src="${escapeHtml(withBase(basePath, "scripts/site.js"))}"></script>
  ${extraScripts}
</body>
</html>`;
}

function renderProductEntry(product, basePath) {
  return `
    <article class="product-entry reveal">
      <div class="product-copy">
        <p class="eyebrow">${escapeHtml(product.homepageCategory)}</p>
        <h3><em>${escapeHtml(product.title)}</em></h3>
        <p>${escapeHtml(product.homepageDescription)}</p>
        <a class="text-link mono-link" href="${escapeHtml(product.url)}" target="_blank" rel="noreferrer">Visit ${escapeHtml(product.title)} →</a>
      </div>
      <a class="product-cover" href="${escapeHtml(product.url)}" target="_blank" rel="noreferrer" aria-label="Visit ${escapeHtml(product.title)}">
        <img src="${escapeHtml(withBase(basePath, assetPath(product.coverImage)))}" alt="${escapeHtml(product.coverAlt || `${product.title} product preview`)}" loading="lazy" decoding="async">
      </a>
    </article>`;
}

function renderSelectedWorkEntry(project, basePath) {
  return `
    <article class="selected-work-entry reveal">
      <p class="eyebrow">${escapeHtml(project.category)}</p>
      <h3><a href="${escapeHtml(projectHref(project, basePath))}"><em>${escapeHtml(project.title)}</em></a></h3>
      <p>${escapeHtml(project.summary)} ${project.impact ? escapeHtml(project.impact) : ""}</p>
      <div class="entry-tags">${(project.stack || []).slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("<span>·</span>")}</div>
      <a class="text-link mono-link" href="${escapeHtml(projectHref(project, basePath))}">Read case study →</a>
    </article>`;
}

function renderHeroSection(content) {
  return `
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-inner container">
        <div class="hero-content">
          <p class="hero-kicker reveal">Portfolio / Remote / 2026</p>
          <div class="hero-title-wrap reveal">
            <h1 class="hero-title" id="hero-title" aria-label="Pelumi Oladokun">
              <span class="hero-title-line hero-title-line-first" aria-hidden="true">Pelumi</span>
              <span class="hero-title-line" aria-hidden="true">Oladokun</span>
            </h1>
          </div>
          <p class="hero-role reveal">AI Builder &middot; Writer of <em>The Grid</em></p>
          <p class="hero-copyline reveal">I build automation systems and independent products, and write <em>The Grid</em>: fiction about the infrastructure quietly running modern life.</p>
          <nav class="hero-meta reveal" aria-label="Hero links">
            <a href="#grid">Read The Grid</a>
            <span aria-hidden="true">/</span>
            <a href="#work">Selected Work</a>
            <span aria-hidden="true">/</span>
            <a href="mailto:oladokunpelumi07@gmail.com">Email</a>
          </nav>
        </div>
        <figure class="hero-portrait reveal">
          <img src="assets/hero/pelumi-paper-cutout.webp" alt="Pelumi Oladokun, AI builder and writer of The Grid" loading="eager" decoding="async" fetchpriority="high">
        </figure>
      </div>
    </section>`;
}

function renderHomePage(content) {
  const latestGrid = latestGridEntry(content);
  const selectedProjects = publishedProjects(content).filter((project) => project.selectedWork).slice(0, 3);

  const body = `
  <main id="top">
    ${renderHeroSection(content)}
    ${renderHomeDateline(content)}
    <section class="lead-section">
      <div class="container read-col">
        <p class="lead-eyebrow reveal">A note from the builder</p>
        <div class="lead prose-lead reveal">
          <p>Taught myself to build while studying agricultural economics outside Lagos. The path was sideways. Curiosity about how systems worked, then about how interfaces shaped behavior, then about how the AI models doing the new work were actually structured. Today I ship automation systems, deploy independent products, and write a fiction series called <em>The Grid</em> about the same infrastructure I work inside during the day. The work and the writing run on the same engine.</p>
        </div>
      </div>
    </section>

    <section class="movement" id="production">
      <div class="container editorial-grid">
        <div class="movement-head reveal">
          <p class="eyebrow">Currently in production</p>
          <h2><em>Two products with real users, real constraints, and no room for theatre.</em></h2>
        </div>
        <div class="movement-body product-list">
          ${(content.products || []).map((product) => renderProductEntry(product, "")).join("")}
        </div>
      </div>
    </section>

    <section class="grid-feature" id="grid">
      <div class="container">
        <div class="grid-feature-media reveal">
          ${latestGrid?.coverImage ? `<img src="${escapeHtml(assetPath(latestGrid.coverImage))}" alt="${escapeHtml(latestGrid.coverAlt || "The Grid series cover")}" loading="lazy" decoding="async">` : ""}
        </div>
        <div class="grid-feature-copy read-col reveal">
          <p class="eyebrow">The Grid</p>
          <h2><em>Fiction about infrastructure, with the receipt attached.</em></h2>
          <p><em>The Grid</em> is a fiction series about the infrastructure that quietly runs modern life: AI, automation, energy, robotics, automated finance. Each episode reads as a story; each one ends with a <em>Signal Decoder</em> that traces the fiction back to real signals from the same week.</p>
          ${latestGrid ? `
            <article class="latest-card">
              <span>Latest</span>
              <strong>${escapeHtml(latestGrid.title)}</strong>
              <p>${escapeHtml(latestGrid.excerpt)}</p>
              <a class="text-link mono-link" href="${escapeHtml(latestGrid.detailPage)}">Read the story →</a>
            </article>` : ""}
          <a class="text-link mono-link" href="writing/">Read the archive →</a>
        </div>
      </div>
    </section>

    <section class="movement" id="work">
      <div class="container editorial-grid">
        <div class="movement-head reveal">
          <p class="eyebrow">Selected work</p>
          <h2><em>Proof that the systems survive contact with the world.</em></h2>
        </div>
        <div class="movement-body selected-work-list">
          ${selectedProjects.map((project) => renderSelectedWorkEntry(project, "")).join("")}
          <a class="archive-link reveal" href="work/">All work →</a>
        </div>
      </div>
    </section>

    <section class="movement" id="notes">
      <div class="container read-col">
        <p class="eyebrow reveal">Workshop notes</p>
        <h2 class="section-title reveal"><em>I build like the handoff matters.</em></h2>
        <p class="body-large reveal">I work the way a careful older engineer would: small steps, real tests, refusal to ship something I have not watched run. My edge is listening to a messy problem, finding what actually matters, and turning it into something operational. The work runs in four lanes: AI retrieval, automation, blockchain monitoring, and applied modeling. Anthropic certified across the Claude API, AI Fluency, Teaching, and Nonprofit frameworks. Agricultural economics at FUNAAB, second class upper, 2024. NYSC completed. Lagos-based, working remotely across time zones.</p>
      </div>
    </section>

    <section class="movement contact-section" id="contact">
      <div class="container read-col">
        <p class="eyebrow reveal">Write</p>
        <h2 class="section-title reveal"><em>Start with the constraint.</em></h2>
        <p class="body-large reveal">I like conversations that begin with a real constraint and end with a clear plan, working prototype, or shipped system. If that is the shape of what you are working on, write.</p>
        <div class="contact-links reveal">
          <a href="mailto:oladokunpelumi07@gmail.com">Email</a>
          <span>·</span>
          <a href="https://linkedin.com/in/oladokun-pelumi-a168aa201" target="_blank" rel="noreferrer">LinkedIn</a>
          <span>·</span>
          <a href="https://x.com/pelumioladokun_" target="_blank" rel="noreferrer">X</a>
          <span>·</span>
          <a href="https://substack.com/@pelumioladokun" target="_blank" rel="noreferrer">Substack</a>
        </div>
      </div>
    </section>
  </main>`;

  return renderDocumentShell({
    basePath: "",
    pageType: "home",
    title: "Pelumi Oladokun — Builder, writer of The Grid",
    description: content.site?.description || "Portfolio website for Pelumi Oladokun.",
    pagePath: "index.html",
    imagePath: latestGrid?.coverImage,
    body
  });
}

function renderWritingArchiveEntry(entry, basePath) {
  const archiveLabel = entry.seriesLabel
    || (entry.type === "grid" ? entry.title.match(/Episode\s+(\d+)/)?.[1] || "Grid" : null)
    || (entry.type === "essay" ? "Essay" : entry.series || "Note");
  return `
    <article class="episode-row reveal" data-entry-card data-series="${escapeHtml(entry.series)}" data-tags="${escapeHtml((entry.tags || []).join("|"))}">
      <div class="episode-number">${escapeHtml(archiveLabel)}</div>
      <div class="episode-main">
        <p class="episode-meta">${escapeHtml(formatDate(entry.publishDate, { short: true }))} · ${escapeHtml((entry.tags || []).slice(0, 2).join(" · "))}</p>
        <h3><a href="${escapeHtml(withBase(basePath, entry.detailPage))}"><em>${escapeHtml(entry.title)}</em></a></h3>
        <p>${escapeHtml(entry.excerpt)}</p>
      </div>
      <a class="text-link mono-link" href="${escapeHtml(withBase(basePath, entry.detailPage))}">Read →</a>
    </article>`;
}

function renderWritingButtons(entries) {
  const series = Array.from(new Set(entries.map((entry) => entry.series).filter(Boolean)))
    .sort((a, b) => {
      const priority = { "The Grid": 0, Essays: 1 };
      return (priority[a] ?? 2) - (priority[b] ?? 2) || a.localeCompare(b);
    });
  const tags = Array.from(new Set(entries.flatMap((entry) => entry.tags || [])));
  const buttons = [
    { key: "all", label: "All" },
    ...series.map((name) => ({ key: name, label: name })),
    ...tags.filter((tag) => !series.includes(tag)).map((tag) => ({ key: tag, label: tag }))
  ];

  return buttons.map((button, index) => `
    <button class="filter-button${index === 0 ? " active" : ""}" type="button" data-filter="${escapeHtml(button.key)}" aria-pressed="${index === 0 ? "true" : "false"}">${escapeHtml(button.label)}</button>
  `).join("");
}

function renderWritingArchivePage(content) {
  const entries = publishedWriting(content);
  const latestGrid = latestGridEntry(content);
  const body = `
  ${renderDateline(content)}
  <main>
    <section class="archive-hero">
      <div class="container">
        <p class="eyebrow reveal">Writing archive</p>
        <h1 class="banner-title reveal"><em>Writing</em></h1>
        <p class="archive-intro read-col reveal"><em>The Grid</em> is the spine of this archive: fiction about people living inside the infrastructure that runs modern life. Essays and field notes sit beside it, showing the systems, builds, and evidence behind the daytime work.</p>
      </div>
    </section>
    <section class="series-feature">
      <div class="container series-grid">
        <div class="series-cover reveal">
          ${latestGrid?.coverImage ? `<img src="${escapeHtml(withBase("../", assetPath(latestGrid.coverImage)))}" alt="${escapeHtml(latestGrid.coverAlt || "The Grid series cover")}" loading="lazy" decoding="async">` : ""}
        </div>
        <div class="series-copy reveal">
          <p class="eyebrow">The Grid</p>
          <h2><em>Stories first. Receipts after.</em></h2>
          <p>AI review tools, automated finance, robotics, energy, surveillance: the series treats infrastructure as something people live inside, not a trend deck they admire from outside.</p>
          ${latestGrid ? `<a class="text-link mono-link" href="${escapeHtml(latestGrid.detailPage)}">Latest: ${escapeHtml(latestGrid.title)} →</a>` : ""}
        </div>
      </div>
    </section>
    <section class="archive-list-section">
      <div class="container">
        <div class="filters-panel reveal">
          <p class="eyebrow">Filter</p>
          <div class="filter-row" id="writing-filters">${renderWritingButtons(entries)}</div>
        </div>
        <div class="episode-list" id="writing-archive">
          ${entries.map((entry) => renderWritingArchiveEntry(entry, "../")).join("")}
        </div>
        <p class="empty-state" id="writing-empty-state" hidden>No published posts match this filter yet.</p>
      </div>
    </section>
  </main>`;

  return renderDocumentShell({
    basePath: "../",
    pageType: "writing",
    title: "Writing — Pelumi Oladokun",
    description: "The Grid fiction series, essays, and field notes about AI, automation, products, and the infrastructure behind the work.",
    pagePath: "writing/index.html",
    imagePath: latestGrid?.coverImage,
    body,
    extraScripts: `<script src="../scripts/writing.js"></script>`
  });
}

function renderArticlePage(entry, writingEntries) {
  const siblings = writingEntries
    .filter((item) => item.slug !== entry.slug)
    .slice(0, 2);
  const markdown = readSourceDocument(entry);
  const bodyText = markdown ? markdownToText(markdown, entry.title) : "";
  const description = buildDescription({ dek: entry.dek, excerpt: entry.excerpt, bodyText });

  const articleBody = markdown
    ? markdownToHtml(markdown, entry.title)
    : `<p>${escapeHtml(entry.dek || entry.excerpt || "This writing entry is not available yet.")}</p>`;

  const body = `
  ${renderDateline({ site: { dateline: `${entrySeriesLabel(entry)} · ${formatDate(entry.publishDate)} · Pelumi Oladokun` } })}
  <main>
    <article class="article-layout container">
      <div class="article-main">
        <a class="breadcrumb" href="index.html">← Back to the archive</a>
        <header class="article-header reveal">
          <p class="eyebrow">${escapeHtml(entrySeriesLabel(entry))}</p>
          <h1><em>${escapeHtml(entry.title)}</em></h1>
          <p class="article-dek">${escapeHtml(entry.dek || entry.excerpt)}</p>
        </header>
        ${entry.coverImage ? `<figure class="article-cover reveal"><img src="${escapeHtml(withBase("../", assetPath(entry.coverImage)))}" alt="${escapeHtml(entry.coverAlt || `${entry.title} cover image`)}" loading="eager" decoding="async"></figure>` : ""}
        <div class="article-prose">
          ${articleBody}
        </div>
      </div>
      <aside class="article-sidebar">
        <div class="sidebar-block reveal">
          <p class="sidebar-label">Article Notes</p>
          <dl class="meta-list">
            <div><dt>Published</dt><dd>${escapeHtml(formatDate(entry.publishDate))}</dd></div>
            <div><dt>Series</dt><dd>${escapeHtml(entrySeriesLabel(entry))}</dd></div>
            <div><dt>Tags</dt><dd>${escapeHtml((entry.tags || []).join(" · "))}</dd></div>
          </dl>
        </div>
        <div class="sidebar-block reveal">
          <p class="sidebar-label">More from the archive</p>
          ${siblings.map((item) => `
            <article class="sidebar-entry">
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.excerpt)}</p>
              <a class="text-link mono-link" href="${escapeHtml(withBase("../", item.detailPage))}">Read →</a>
            </article>
          `).join("")}
        </div>
      </aside>
    </article>
  </main>`;

  return renderDocumentShell({
    basePath: "../",
    pageType: "article",
    title: `${entry.title} | Pelumi Oladokun`,
    description,
    pagePath: entry.detailPage,
    imagePath: entry.coverImage,
    type: "article",
    body
  });
}

function renderProjectPreviewImages(project, basePath) {
  if (!project.previewImages?.length) return "";

  return `
    <section class="case-section reveal">
      <p class="eyebrow">Document previews</p>
      <h2><em>Artifacts from the work.</em></h2>
      <div class="preview-grid">
        ${project.previewImages.map((image) => `
          <figure class="preview-card">
            <img src="${escapeHtml(withBase(basePath, assetPath(image.path)))}" alt="${escapeHtml(image.alt || image.label)}" loading="lazy" decoding="async">
            <figcaption>${escapeHtml(image.label)}</figcaption>
          </figure>
        `).join("")}
      </div>
    </section>`;
}

function renderProjectDocuments(project, basePath) {
  if (!project.documents?.length) return "";

  const groups = Array.from(new Set(project.documents.map((document) => document.group)));

  return `
    <div class="sidebar-block reveal">
      <p class="sidebar-label">Documents</p>
      <div class="document-groups">
        ${groups.map((group) => `
          <div class="document-group">
            <strong>${escapeHtml(group)}</strong>
            ${project.documents.filter((document) => document.group === group).map((document) => `
              <a href="${escapeHtml(withBase(basePath, document.path))}" target="_blank" rel="noreferrer">${escapeHtml(document.title)} →</a>
            `).join("")}
          </div>
        `).join("")}
      </div>
    </div>`;
}

function renderProjectPage(project, projects) {
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProjects = projects
    .filter((item) => item.slug !== project.slug)
    .slice(currentIndex + 1)
    .concat(projects.filter((item) => item.slug !== project.slug).slice(0, currentIndex + 1))
    .slice(0, 2);
  const basePath = "../../";
  const description = buildDescription({ summary: project.summary, excerpt: project.outcome });
  const hero = project.heroImage || project.coverImage;

  const body = `
  ${renderDateline({ site: { dateline: `${project.category} · Case Study · Pelumi Oladokun` } })}
  <main>
    <article class="case-layout container">
      <aside class="case-sidebar">
        <div class="sidebar-block reveal">
          <a class="breadcrumb" href="../">← All work</a>
          <p class="sidebar-label">Project</p>
          <dl class="meta-list">
            <div><dt>Category</dt><dd>${escapeHtml(project.category)}</dd></div>
            <div><dt>Status</dt><dd>Published case study</dd></div>
            <div><dt>Stack</dt><dd>${escapeHtml((project.stack || []).join(" · "))}</dd></div>
          </dl>
        </div>
        ${renderProjectDocuments(project, basePath)}
        <div class="sidebar-block reveal">
          <p class="sidebar-label">Links</p>
          <div class="sidebar-links">
            ${(project.links || []).map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)} →</a>`).join("") || "<p>No external links available yet.</p>"}
            ${project.videoUrl ? `<a href="${escapeHtml(project.videoUrl)}" target="_blank" rel="noreferrer">Video walkthrough →</a>` : ""}
          </div>
        </div>
      </aside>
      <div class="case-main">
        <header class="case-header reveal">
          <p class="eyebrow">${escapeHtml(project.category)}</p>
          <h1><em>${escapeHtml(project.title)}</em></h1>
          <p class="case-subtitle">${escapeHtml(project.summary)}</p>
        </header>
        ${hero ? `<figure class="case-hero reveal"><img src="${escapeHtml(withBase(basePath, assetPath(hero)))}" alt="${escapeHtml(`${project.title} project visual`)}" loading="eager" decoding="async"></figure>` : ""}
        ${project.headlineStrip ? `<div class="headline-strip reveal">${escapeHtml(project.headlineStrip)}</div>` : ""}
        <section class="case-section reveal">
          <p class="eyebrow">The brief</p>
          <h2><em>What needed to be solved.</em></h2>
          ${(project.problem || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </section>
        <section class="case-section reveal">
          <p class="eyebrow">The constraint</p>
          <h2><em>What made it interesting.</em></h2>
          ${(project.approach || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </section>
        <section class="case-section reveal">
          <p class="eyebrow">The build</p>
          <h2><em>What was assembled.</em></h2>
          ${(project.buildDetails || []).map((detail) => `<p>${escapeHtml(detail)}</p>`).join("")}
        </section>
        <section class="case-section reveal">
          <p class="eyebrow">The result</p>
          <h2><em>What changed after it ran.</em></h2>
          ${(project.results || []).map((detail) => `<p>${escapeHtml(detail)}</p>`).join("")}
        </section>
        ${renderProjectPreviewImages(project, basePath)}
        <section class="case-section reveal">
          <p class="eyebrow">Stack</p>
          <div class="entry-tags stack-line">${(project.stack || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("<span>·</span>")}</div>
        </section>
        <section class="case-section read-next reveal">
          <p class="eyebrow">Read next</p>
          ${nextProjects.map((item) => renderSelectedWorkEntry(item, basePath)).join("")}
        </section>
      </div>
    </article>
  </main>`;

  return renderDocumentShell({
    basePath,
    pageType: "project",
    title: `${project.title} | Pelumi Oladokun`,
    description,
    pagePath: projectRoute(project),
    imagePath: hero,
    type: "article",
    body
  });
}

function renderWorkIndexPage(content) {
  const projects = publishedProjects(content);
  const body = `
  ${renderDateline(content)}
  <main>
    <section class="archive-hero">
      <div class="container">
        <p class="eyebrow reveal">Work archive</p>
        <h1 class="banner-title reveal"><em>Work</em></h1>
        <p class="archive-intro read-col reveal">Products, systems, data work, and case studies. The homepage shows only three; this page keeps the rest available for inspection.</p>
      </div>
    </section>
    <section class="work-index">
      <div class="container selected-work-list">
        ${projects.map((project) => renderSelectedWorkEntry(project, "../")).join("")}
      </div>
    </section>
  </main>`;

  return renderDocumentShell({
    basePath: "../",
    pageType: "work",
    title: "Work | Pelumi Oladokun",
    description: "Selected products, systems, data work, and technical case studies by Pelumi Oladokun.",
    pagePath: "work/index.html",
    body
  });
}

function renderRedirectPage(targetHref, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="0; url=${escapeHtml(targetHref)}">
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${escapeHtml(toAbsoluteUrl(targetHref.replace(/^\.\.\//, "")))}">
</head>
<body>
  <p>This page moved to <a href="${escapeHtml(targetHref)}">${escapeHtml(targetHref)}</a>.</p>
</body>
</html>`;
}

function buildSite() {
  const content = loadContent();
  assertPublishedWritingSources(content);

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  copyFile("styles/site.css");
  copyFile("scripts/site.js");
  copyFile("scripts/writing.js");
  copyFile("assets/hero/pelumi-paper-cutout.webp");
  collectDeployAssets(content).forEach((asset) => copyFile(asset));

  writeFile("index.html", renderHomePage(content));
  writeFile("writing/index.html", renderWritingArchivePage(content));
  writeFile("work/index.html", renderWorkIndexPage(content));

  const writingEntries = publishedWriting(content).filter((entry) => entry.detailPage);
  for (const entry of writingEntries) {
    writeFile(entry.detailPage, renderArticlePage(entry, writingEntries));
  }

  const projects = publishedProjects(content);
  for (const project of projects) {
    writeFile(projectRoute(project), renderProjectPage(project, projects));
    if (project.detailPage && project.detailPage !== projectRoute(project)) {
      writeFile(project.detailPage, renderRedirectPage(`../${routeHref(projectRoute(project))}`, `${project.title} moved`));
    }
  }
}

buildSite();
