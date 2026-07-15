const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const content = require(path.join(ROOT, "data/content.js"));

const failures = [];

function fail(message) {
  failures.push(message);
}

function exists(relativePath) {
  return fs.existsSync(path.join(DIST, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(DIST, relativePath), "utf8");
}

function routeHref(route) {
  return route.replace(/index\.html$/, "");
}

function projectRoute(project) {
  return project.canonicalPath || `work/${project.slug}/index.html`;
}

function assertFile(relativePath) {
  if (!exists(relativePath)) fail(`Missing generated file: ${relativePath}`);
}

function assertIncludes(relativePath, needle) {
  if (!exists(relativePath)) {
    fail(`Cannot inspect missing file: ${relativePath}`);
    return;
  }
  if (!read(relativePath).includes(needle)) {
    fail(`${relativePath} does not include expected text: ${needle}`);
  }
}

function assertNotIncludes(relativePath, needle) {
  if (!exists(relativePath)) return;
  if (read(relativePath).includes(needle)) {
    fail(`${relativePath} includes banned text: ${needle}`);
  }
}

assertFile("index.html");
assertFile("writing/index.html");
assertFile("writing/the-grid-the-review.html");
assertFile("work/index.html");
assertFile("work/analytics-documentation-practice/index.html");
assertFile("styles/site.css");
assertFile("scripts/site.js");
assertFile("scripts/writing.js");
assertFile("assets/hero/pelumi-paper-cutout.webp");
assertIncludes("styles/site.css", ".episode-row[hidden]");

(content.writing || [])
  .filter((entry) => entry.status === "published" && entry.type !== "substack-feature")
  .forEach((entry) => {
    if (!entry.sourcePath || !fs.existsSync(path.join(ROOT, entry.sourcePath))) {
      fail(`Published writing entry has missing source: ${entry.slug}`);
    }
    if (entry.detailPage) assertFile(entry.detailPage);
  });

(content.projects || [])
  .filter((project) => project.status === "published")
  .forEach((project) => {
    const route = projectRoute(project);
    assertFile(route);
    assertIncludes(route, `<link rel="canonical" href="https://pelumioladokun.xyz/${routeHref(route)}">`);

    if (project.detailPage && project.detailPage !== route) {
      assertFile(project.detailPage);
      assertIncludes(project.detailPage, `../${routeHref(route)}`);
    }

    [project.coverImage, project.heroImage]
      .filter(Boolean)
      .forEach((asset) => assertFile(asset));

    (project.previewImages || []).forEach((image) => assertFile(image.path));
    (project.documents || []).forEach((document) => assertFile(document.path));
  });

assertIncludes("index.html", "Currently in production");
assertIncludes("index.html", "Portfolio / Remote / 2026");
assertIncludes("index.html", "data-current-edition");
assertIncludes("index.html", "Volume 3");
assertIncludes("index.html", "dateline-location");
assertIncludes("index.html", "Remote");
assertIncludes("index.html", "hero-title-line-first");
assertIncludes("index.html", "aria-label=\"Pelumi Oladokun\"");
assertIncludes("index.html", "href=\"#grid\"");
assertIncludes("index.html", "href=\"#work\"");
assertIncludes("index.html", "AI Builder");
assertIncludes("index.html", "The Grid");
assertIncludes("index.html", "Analytics Documentation Practice");
assertIncludes("work/analytics-documentation-practice/index.html", "10 DOCUMENTS");
assertIncludes("work/analytics-documentation-practice/index.html", "Source repository");
assertIncludes("writing/the-grid-the-review.html", "Signal Decoder");

[
  "LENS",
  "Builder. Thinker. Operator.",
  "Built &amp; Shipped",
  "#45dee7",
  "#00a7b1",
  "🧠",
  "🔁",
  "⛓",
  "📈"
].forEach((needle) => {
  assertNotIncludes("index.html", needle);
  assertNotIncludes("styles/site.css", needle);
});

assertNotIncludes("index.html", "hero-mark");
assertNotIncludes("styles/site.css", "hero-mark");
assertNotIncludes("index.html", "Volume I · Issue 14 · May 2026 · Lagos");

if (failures.length) {
  console.error("Build validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Build validation passed.");
