module.exports = {
  site: {
    title: "Pelumi Oladokun",
    email: "oladokunpelumi07@gmail.com",
    location: "Remote",
    volume: "Volume 3",
    dateline: "Volume 3 · Issue 21st · May 2026 · Remote",
    description: "Pelumi Oladokun builds automation systems and writes The Grid, a fiction series about the infrastructure underneath modern work."
  },
  products: [
    {
      slug: "solarwise",
      title: "SolarWise",
      url: "https://solarwise-dun.vercel.app/",
      coverImage: "assets/covers/product-solarwise-main.webp",
      secondaryCoverImage: "assets/covers/product-solarwise-sub.webp",
      homepageCategory: "Energy Product",
      homepageDescription: "SolarWise sizes a solar power system in under a second. You enter your appliances, set your city, and three engineered designs come back with full component specs. It exists because most people deciding on solar in Lagos are forced to trust a salesperson's instinct. Now they do not have to.",
      homepageChips: ["Engineering Calculator", "55+ Cities", "Full-Stack"],
      coverAlt: "SolarWise product interface preview"
    },
    {
      slug: "yourgbedu",
      title: "YourGbedu",
      url: "https://www.yourgbedu.com",
      coverImage: "assets/covers/product-yourgbedu-real.webp",
      homepageCategory: "Music Product",
      homepageDescription: "YourGbedu is the platform for custom Afrobeats songs about real people. You fill out a brief, a producer composes the track, and the song goes where greeting cards used to live. The work is making each one feel inevitable, not produced.",
      homepageChips: ["AI Integration", "Brand System", "Full-Stack"],
      coverAlt: "YourGbedu product interface preview"
    }
  ],
  certifications: [
    {
      title: "Building with the Claude API",
      issuer: "Anthropic",
      issued: "March 2026",
      credentialId: "dcyx957e2dq5"
    },
    {
      title: "AI Fluency Framework & Foundations",
      issuer: "Anthropic",
      issued: "March 2026",
      credentialId: "d9dj8oqmawmc"
    },
    {
      title: "Teaching the AI Fluency Framework",
      issuer: "Anthropic",
      issued: "March 2026",
      credentialId: "isyfo4yy94d"
    },
    {
      title: "AI Fluency for Nonprofits",
      issuer: "Anthropic",
      issued: "March 2026",
      credentialId: "aq43ntueyu26"
    }
  ],
  projects: [
    {
      slug: "analytics-documentation-practice",
      title: "Analytics Documentation Practice",
      category: "Data Systems",
      summary: "Ten documents, eighty-seven pages, one shared template. Three case studies in how raw operational data becomes decision-ready output: a Nigerian marketplace, a distributor, and a retail bank.",
      impact: "The documentation discipline is what is being demonstrated: findings framed for executives, models explained for engineers, and runbooks written for the moment the analyst is not in the room.",
      stack: ["PostgreSQL 18", "Python", "Node.js", "Matplotlib", "Tableau Public", "LibreOffice"],
      canonicalPath: "work/analytics-documentation-practice/index.html",
      artifactRepo: "https://github.com/oladokunpelumi/analytics-documentation-practice",
      heroImage: "assets/cases/analytics/bank-star-schema.png",
      coverImage: "assets/cases/analytics/bank-star-schema.png",
      status: "published",
      featured: true,
      selectedWork: true,
      role: "Packaged three analytics projects as if they shipped to internal teams: one template, one writing register, and enough detail for another person to inspect the work without a handoff call.",
      outcome: "The bundle reads as work, not as a portfolio piece. That is the point.",
      headlineStrip: "10 DOCUMENTS · 87 PAGES · 1 SHARED TEMPLATE · 0 SLOP HITS",
      snapshot: [
        { label: "Documents", value: "10" },
        { label: "Pages", value: "87" },
        { label: "Template", value: "1" }
      ],
      problem: [
        "Three analytics projects, three audiences, three documentation requirements. A Nigerian e-commerce marketplace needed cleaned data and an executive memo. A distributor needed a dashboard with findings written for operators. A retail bank needed a dimensional warehouse with engineering documentation.",
        "The brief I gave myself was simple: package all three as if they shipped to internal teams. Same document template across all artifacts. Same writing register. Same standard for what counts as decision-ready output."
      ],
      approach: [
        "Most analytics portfolios show the output. Fewer show the documentation. This project treats documentation as the product: the place where methodology, limitations, query logic, model design, and operating risk become readable.",
        "The work is grouped into three case studies: Marketplace SQL Analytics, Distributor BI Dashboard, and Bank Warehouse Design. Each one includes browser-readable PDFs and editable source documents in the repository."
      ],
      buildDetails: [
        "Marketplace SQL Analytics: PostgreSQL cleaning, eight business queries, an executive memo, methodology report, data quality audit, and query documentation pack.",
        "Distributor BI Dashboard: Tableau dashboard work with a methodology report and a findings report built around six findings and five recommendations.",
        "Bank Warehouse Design: PostgreSQL star schema, SCD Type 2 logic, surrogate keys, a dimensional model design, data dictionary, and ETL operations runbook."
      ],
      results: [
        "Ten finished documents share one template, heading hierarchy, table of contents pattern, chart treatment, and footer system.",
        "Claims anchor to specific numbers and limitations are stated openly instead of hidden behind presentation language.",
        "Anti-slop checks across the bundle returned zero hits for the filler patterns called out in the project repository."
      ],
      previewImages: [
        {
          label: "Marketplace SQL Analytics",
          path: "assets/cases/analytics/marketplace-data-quality.png",
          alt: "Data quality audit chart from the marketplace SQL analytics documentation."
        },
        {
          label: "Distributor BI Dashboard",
          path: "assets/cases/analytics/distributor-findings.png",
          alt: "Dashboard findings chart from the distributor analytics documentation."
        },
        {
          label: "Bank Warehouse Design",
          path: "assets/cases/analytics/bank-star-schema.png",
          alt: "Star schema diagram from the bank warehouse design documentation."
        }
      ],
      documents: [
        { group: "Marketplace SQL Analytics", title: "Executive Memo", path: "assets/cases/analytics/01-executive-memo.pdf" },
        { group: "Marketplace SQL Analytics", title: "Technical Methodology Report", path: "assets/cases/analytics/02-technical-methodology.pdf" },
        { group: "Marketplace SQL Analytics", title: "Data Quality Audit", path: "assets/cases/analytics/03-data-quality-audit.pdf" },
        { group: "Marketplace SQL Analytics", title: "Query Documentation Pack", path: "assets/cases/analytics/04-query-documentation-pack.pdf" },
        { group: "Distributor BI Dashboard", title: "Executive Summary", path: "assets/cases/analytics/05-executive-summary.pdf" },
        { group: "Distributor BI Dashboard", title: "Dashboard Methodology Report", path: "assets/cases/analytics/06-dashboard-methodology.pdf" },
        { group: "Distributor BI Dashboard", title: "Dashboard Findings Report", path: "assets/cases/analytics/07-dashboard-findings.pdf" },
        { group: "Bank Warehouse Design", title: "Dimensional Model Design", path: "assets/cases/analytics/08-dimensional-model-design.pdf" },
        { group: "Bank Warehouse Design", title: "Data Dictionary", path: "assets/cases/analytics/09-data-dictionary.pdf" },
        { group: "Bank Warehouse Design", title: "ETL Operations Runbook", path: "assets/cases/analytics/10-etl-operations-runbook.pdf" }
      ],
      links: [
        { label: "Source repository", url: "https://github.com/oladokunpelumi/analytics-documentation-practice" }
      ]
    },
    {
      slug: "x-profile-scanning",
      title: "X Profile Scanning Pipeline",
      category: "Data Pipeline",
      summary: "A vetting workflow that ran for two days unattended and returned 20,509 X profiles with verification status, follower counts, and region data filled in.",
      impact: "Python, Playwright, openpyxl. Replaced a job that would have taken a small team weeks.",
      stack: ["Python", "Playwright", "openpyxl", "Automation Research"],
      coverImage: "assets/covers/project-xscan.svg",
      detailPage: "Projects/x-profile-scanning.html",
      canonicalPath: "work/x-profile-scanning/index.html",
      status: "published",
      featured: true,
      selectedWork: true,
      role: "Designed the scan flow, checkpoints, delays, retries, and spreadsheet output.",
      outcome: "The team got a usable creator list and a cleaned database.",
      snapshot: [
        { label: "Profiles", value: "20,509" },
        { label: "Runtime", value: "55 hours" },
        { label: "Verified", value: "395 found" }
      ],
      problem: [
        "A Web3 marketing team had more than 20,000 X usernames and needed three things for each one: verification status, follower count, and region. Manual checking would have taken weeks.",
        "The hard part was not opening one profile. It was keeping a long run alive, saving progress, and ending with a spreadsheet the team could use right away."
      ],
      approach: [
        "I used Playwright instead of the paid X API because this was a one-time job and accuracy mattered more than speed.",
        "The pipeline saved progress every 25 profiles, added random delays, retried failures, and skipped media downloads so the run could stay stable on a normal laptop."
      ],
      buildDetails: [
        "Checkpoint files so the run could restart without losing progress.",
        "Random delays and timed pauses to reduce rate-limit risk.",
        "Retry logic for broken pages and temporary failures.",
        "Spreadsheet output with filtered views for campaign use."
      ],
      results: [
        "20,509 profiles scanned in one unattended run.",
        "395 verified accounts found and 10,192 dead accounts flagged.",
        "The client saved outreach time because the scan cleaned the list while enriching it."
      ],
      links: [
        { label: "Source repository", url: "https://github.com/oladokunpelumi/Sheets_Automation" }
      ]
    },
    {
      slug: "rag-agent",
      title: "RAG Agent in n8n",
      category: "AI Retrieval System",
      summary: "An n8n workflow that pulls the right context from a source library before answering, so an assistant responds from actual reading instead of guessing.",
      impact: "Built so a domain expert can maintain it without touching code.",
      stack: ["n8n", "RAG", "LLM", "Knowledge Workflows"],
      coverImage: "assets/covers/project-rag.svg",
      detailPage: "Projects/rag-agent.html",
      canonicalPath: "work/rag-agent/index.html",
      videoUrl: "https://youtu.be/jRG0yjkZr7o?si=Zbh_2LtmUnvacVvD",
      status: "published",
      featured: true,
      selectedWork: true,
      role: "Built the workflow, retrieval flow, and response chain.",
      outcome: "The system answered from context instead of guessing.",
      snapshot: [
        { label: "Mode", value: "Retrieval QA" },
        { label: "Tooling", value: "n8n + LLM" },
        { label: "Focus", value: "Knowledge access" }
      ],
      problem: [
        "A normal chat flow falls apart when answers need to come from specific documents or stored knowledge.",
        "The job was to build a workflow that could fetch the right context first, then answer from that context."
      ],
      approach: [
        "I used n8n as the orchestration layer and treated retrieval as the center of the system.",
        "The workflow pulls context, sends it into the model, and returns answers with better grounding."
      ],
      buildDetails: [
        "n8n orchestration for request handling.",
        "Retrieval step for pulling relevant source material.",
        "LLM response stage built on the retrieved context.",
        "Video-based project walkthrough for public review."
      ],
      results: [
        "Made the assistant more reliable on source-based questions.",
        "Showed how low-code tooling can still support serious AI work.",
        "Added a clear RAG example to the portfolio."
      ],
      links: [
        { label: "Video walkthrough", url: "https://youtu.be/jRG0yjkZr7o?si=Zbh_2LtmUnvacVvD" }
      ]
    },
    {
      slug: "price-update",
      title: "Price Update",
      category: "Automation System",
      summary: "An n8n workflow that tracked price changes, calculated the deltas, and sent a clean report on schedule.",
      impact: "Replaced manual weekly checking with one repeatable reporting flow.",
      stack: ["n8n", "Webhooks", "API Integration", "Scheduled Workflows"],
      coverImage: "assets/covers/project-price-update.svg",
      detailPage: "Projects/price-update.html",
      canonicalPath: "work/price-update/index.html",
      articleUrl: "https://docs.google.com/document/d/10w4E2_XfC5D606YxlZd91z9TaQT1rapfha6VsMS2sOE/edit?tab=t.0#heading=h.f9afjb1rlxjg",
      videoUrl: "https://drive.google.com/file/d/1dzVhMygpjFZ7l84ajUHZozh7baegRWS5/view",
      status: "published",
      featured: true,
      role: "Built the workflow logic, integrations, and report output.",
      outcome: "The operator got the update without doing the weekly manual pass.",
      snapshot: [
        { label: "Cadence", value: "Weekly" },
        { label: "Workflow", value: "Fully automated" },
        { label: "Delivery", value: "Formatted report" }
      ],
      problem: [
        "The job started as a repeating manual task: check prices, find changes, write the update, send it out.",
        "The real issue was consistency. The report had to arrive on time and in a format someone else could use."
      ],
      approach: [
        "I set it up as a scheduled n8n workflow so the human work moved to setup and review, not weekly repetition.",
        "The flow fetches the data, checks what changed, formats the result, and sends one finished output."
      ],
      buildDetails: [
        "Scheduled triggers for recurring runs.",
        "Webhook and API steps for data retrieval.",
        "Change detection and formatting inside the workflow.",
        "Final report output built for reading, not debugging."
      ],
      results: [
        "Removed the weekly manual check from the workflow.",
        "Made the report format consistent from run to run.",
        "Created a system the client could keep using."
      ],
      links: [
        { label: "Project article", url: "https://docs.google.com/document/d/10w4E2_XfC5D606YxlZd91z9TaQT1rapfha6VsMS2sOE/edit?tab=t.0#heading=h.f9afjb1rlxjg" },
        { label: "Video demo", url: "https://drive.google.com/file/d/1dzVhMygpjFZ7l84ajUHZozh7baegRWS5/view" }
      ]
    },
    {
      slug: "twitter-to-telegram",
      title: "Twitter to Telegram",
      category: "Monitoring Pipeline",
      summary: "A monitoring pipeline that watched selected X accounts and pushed the important updates into Telegram.",
      impact: "Moved signal tracking from scattered feeds into one fast channel.",
      stack: ["Python", "Automation", "Data Processing", "Telegram"],
      coverImage: "assets/covers/project-twitter-telegram.svg",
      detailPage: "Projects/twitter-to-telegram.html",
      canonicalPath: "work/twitter-to-telegram/index.html",
      articleUrl: "https://drive.google.com/file/d/1sFFfjyxGr4rAmRV8CfbLNUr2HiZKw9Yu/view",
      videoUrl: "https://www.linkedin.com/posts/oladokun-pelumi-a168aa201_cryptotrading-machinelearning-ai-activity-7367277996799328258-epwU?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADORYzIBTkTZpT881s2WlIwe3WPY_mwSJ8A",
      status: "published",
      featured: true,
      role: "Built the monitoring logic, filters, and Telegram delivery loop.",
      outcome: "The user got one channel for the updates that mattered.",
      snapshot: [
        { label: "Channels", value: "2 platforms" },
        { label: "Latency", value: "Near real-time" },
        { label: "Use case", value: "Signal capture" }
      ],
      problem: [
        "Important posts in crypto and AI move fast, but the bigger problem is volume. Good updates disappear inside crowded feeds.",
        "The system had to cut down the monitoring work without turning into a spam bot."
      ],
      approach: [
        "I treated it as a signal-routing system, not a repost tool.",
        "The pipeline follows a curated source list, filters the noise, and pushes the useful updates into Telegram."
      ],
      buildDetails: [
        "Source monitoring across selected X accounts.",
        "Filtering rules before forwarding.",
        "Telegram posting automation for delivery.",
        "Built for continuous tracking instead of one-off scraping."
      ],
      results: [
        "Reduced the time needed to watch a fragmented topic space.",
        "Turned scattered updates into one feed.",
        "Made the research workflow easier to follow day to day."
      ],
      links: [
        { label: "Project article", url: "https://drive.google.com/file/d/1sFFfjyxGr4rAmRV8CfbLNUr2HiZKw9Yu/view" },
        { label: "Video walkthrough", url: "https://www.linkedin.com/posts/oladokun-pelumi-a168aa201_cryptotrading-machinelearning-ai-activity-7367277996799328258-epwU?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADORYzIBTkTZpT881s2WlIwe3WPY_mwSJ8A" }
      ]
    },
    {
      slug: "zapier-lead-automation",
      title: "Zapier Customer Lead Automation",
      category: "Lead Intelligence",
      summary: "A lead handling flow that sorted inbound contacts into clearer follow-up paths and reduced messy manual handling.",
      impact: "Turned lead capture into a working system instead of a spreadsheet chore.",
      stack: ["Zapier", "Python", "TensorFlow", "Data Science"],
      coverImage: "assets/covers/project-zapier.svg",
      detailPage: "Projects/zapier-lead-automation.html",
      canonicalPath: "work/zapier-lead-automation/index.html",
      articleUrl: "https://docs.google.com/document/d/1bWScID08DIYjWsa2NG6v8id3FDC__FXJcF8XSs-3AhI/edit?tab=t.0",
      status: "published",
      featured: true,
      role: "Built the flow and framed the segmentation logic around follow-up action.",
      outcome: "Leads moved into clearer buckets with less manual sorting.",
      snapshot: [
        { label: "Focus", value: "Lead routing" },
        { label: "Mode", value: "Automation-first" },
        { label: "Signal", value: "Segmentation logic" }
      ],
      problem: [
        "Lead systems slow down when every new contact lands in the same bucket.",
        "The job was to sort new leads in a way that made follow-up faster and more specific."
      ],
      approach: [
        "I built the flow around intake, sorting, and handoff.",
        "Each lead moves through the workflow and lands in the next action path that fits the signal."
      ],
      buildDetails: [
        "Zapier orchestration for intake and handoff.",
        "Segmentation rules for routing leads.",
        "Downstream paths for different follow-up cases.",
        "Built around response speed and cleaner handling."
      ],
      results: [
        "Made lead handling more structured.",
        "Improved the path from capture to follow-up.",
        "Added a business-facing automation case study to the portfolio."
      ],
      links: [
        { label: "Project article", url: "https://docs.google.com/document/d/1bWScID08DIYjWsa2NG6v8id3FDC__FXJcF8XSs-3AhI/edit?tab=t.0" }
      ]
    },
    {
      slug: "house-price-classification",
      title: "Machine Learning House Prediction",
      category: "Machine Learning",
      summary: "A neural network that grouped houses into price bands from their feature data.",
      impact: "Built to turn raw property listings into screening signals. The model and its trade-offs are written up alongside.",
      stack: ["Python", "TensorFlow", "Machine Learning", "Neural Networks"],
      coverImage: "assets/covers/project-house-price.svg",
      detailPage: "Projects/house-price-classification.html",
      canonicalPath: "work/house-price-classification/index.html",
      articleUrl: "https://drive.google.com/file/d/1XAPsiL5tMYXZbp2QljGS-z5PjeZfhS5U/view",
      status: "published",
      featured: true,
      role: "Built the model workflow and framed the result around real use.",
      outcome: "The model helped sort properties into usable market categories.",
      snapshot: [
        { label: "Model", value: "Neural network" },
        { label: "Task", value: "Classification" },
        { label: "Use", value: "Market screening" }
      ],
      problem: [
        "Property data is hard to scan quickly when the goal is to sort houses, not price every one by hand.",
        "The model needed to turn feature patterns into clear price categories."
      ],
      approach: [
        "I treated it as a classification problem with a real use case: faster screening and better market grouping.",
        "The work focused on making the model output easy to use in a property workflow."
      ],
      buildDetails: [
        "TensorFlow model experiments.",
        "Feature-based classification setup.",
        "Output shaped around price tiers.",
        "Project write-up aimed at applied ML work."
      ],
      results: [
        "Added a clear machine learning project to the portfolio.",
        "Showed model work tied to a practical decision task.",
        "Expanded the project mix beyond automation and workflows."
      ],
      links: [
        { label: "Project article", url: "https://drive.google.com/file/d/1XAPsiL5tMYXZbp2QljGS-z5PjeZfhS5U/view" }
      ]
    }
  ],
  writing: [
    {
      slug: "substack",
      title: "Pelumi on Substack",
      type: "substack-feature",
      series: "Nonfiction",
      excerpt: "Writing about AI automation, product building, systems taste, and the realities of technical work from a Nigerian perspective.",
      publishDate: "2026-03-01",
      status: "published",
      tags: ["AI", "Automation", "Systems Thinking"],
      externalUrl: "https://substack.com/@pelumioladokun"
    },
    {
      slug: "the-grid-the-spreadsheet-of-dreams",
      title: "The Grid, Episode 01: The Spreadsheet of Dreams",
      type: "grid",
      series: "The Grid",
      excerpt: "A compute economics lead must choose between keeping artists rendering and redirecting scarce GPU-hours to autonomous enterprise logistics.",
      publishDate: "2026-03-30",
      status: "published",
      tags: ["AI", "Energy", "Compute Economics"],
      detailPage: "writing/the-grid-the-spreadsheet-of-dreams.html",
      dek: "In Lagos, rising energy costs force a brutal question: what deserves the next unit of intelligence.",
      sourcePath: "writing/drafts/THE_GRID_002_2026-03-30.md",
      coverImage: "assets/covers/the-grid-series-cover.webp",
      coverAlt: "The Grid series cover showing a figure facing a glowing network above the ocean at night."
    },
    {
      slug: "the-grid-the-overide",
      title: "The Grid, Episode 02: The Overide",
      type: "grid",
      series: "The Grid",
      excerpt: "A studio animator faces an automated resource manager that will kill his final render unless he overrides the system.",
      publishDate: "2026-04-01",
      status: "published",
      tags: ["AI", "Energy", "Automation"],
      detailPage: "writing/the-grid-the-overide.html",
      dek: "In Yaba, one override pits creative survival against automated power controls.",
      sourcePath: "writing/drafts/THE_GRID_002_2026-04-01.md"
    },
    {
      slug: "the-grid-the-gesture-it-learned",
      title: "The Grid, Episode 03: The Gesture It Learned",
      type: "grid",
      series: "The Grid",
      excerpt: "A robotics plant manager ships a humanoid order using worker footage that trained the machines to replace them.",
      publishDate: "2026-04-03",
      status: "published",
      tags: ["AI", "Automation", "Robotics"],
      detailPage: "writing/the-grid-the-gesture-it-learned.html",
      dek: "In Shenzhen, the order ships on time, but the training data carries a debt no one asked to repay.",
      sourcePath: "writing/drafts/The_GRID_003_2026-04-03.md"
    },
    {
      slug: "the-grid-the-short-form",
      title: "The Grid, Episode 04: The Short Form",
      type: "grid",
      series: "The Grid",
      excerpt: "A cross-border courier stakes personal surety so medicine can clear a stalled smart-contract corridor.",
      publishDate: "2026-04-06",
      status: "published",
      tags: ["AI", "Automation", "Energy"],
      detailPage: "writing/the-grid-the-short-form.html",
      dek: "At a flooded border checkpoint, the future moves only when someone is willing to sign.",
      sourcePath: "writing/drafts/# THE GRID — Installment 004: \"The Short.md",
      coverImage: "assets/covers/the-grid-series-cover.webp",
      coverAlt: "The Grid series cover showing a figure facing a glowing network above the ocean at night."
    },
    {
      slug: "the-grid-zero",
      title: "The Grid, Episode 05: Zero",
      type: "grid",
      series: "The Grid",
      excerpt: "A consortium inference lead watches AI costs collapse to zero at the low end while the most powerful systems lock behind closed access.",
      publishDate: "2026-04-10",
      status: "published",
      tags: ["AI", "Compute Economics", "Automation"],
      detailPage: "writing/the-grid-zero.html",
      dek: "In Lagos, the economics of intelligence split in two and leave no obvious place to stand.",
      sourcePath: "writing/drafts/THE_GRID_005_2026-04-10.md",
      coverImage: "assets/covers/the-grid-series-cover.webp",
      coverAlt: "The Grid series cover showing a figure facing a glowing network above the ocean at night."
    },
    {
      slug: "the-grid-the-freeze-function",
      title: "The Grid, Episode 06: The Freeze Function",
      type: "grid",
      series: "The Grid",
      excerpt: "A compliance hold on a lifesaving remittance forces a cross-border operator to decide whether to stay inside regulated rails or route around them.",
      publishDate: "2026-04-13",
      status: "published",
      tags: ["AI", "Automated Finance", "Policy"],
      detailPage: "writing/the-grid-the-freeze-function.html",
      dek: "At the port in Apapa, one frozen payment exposes what programmable financial infrastructure was designed to do.",
      sourcePath: "writing/drafts/The_GRID_006_2026-04-13.md",
      coverImage: "assets/covers/the-grid-series-cover.webp",
      coverAlt: "The Grid series cover showing a figure facing a glowing network above the ocean at night."
    },
    {
      slug: "the-grid-the-plumber-has-a-day",
      title: "The Grid, Episode 07: The Plumber Has a Day",
      type: "grid",
      series: "The Grid",
      excerpt: "Kona spends an unplanned day in Accra and sees how formal settlement rails and informal markets solve the same coordination problem.",
      publishDate: "2026-04-15",
      status: "published",
      tags: ["AI", "Automated Finance", "Infrastructure"],
      detailPage: "writing/the-grid-the-plumber-has-a-day.html",
      dek: "From a trotro seat to Kantamanto, a systems builder recognizes that mechanism design has always been street-level infrastructure.",
      sourcePath: "writing/drafts/THE_GRID_007_2026-04-15.md",
      coverImage: "assets/covers/the-grid-series-cover.webp",
      coverAlt: "The Grid series cover showing a figure facing a glowing network above the ocean at night."
    },
    {
      slug: "the-grid-the-review",
      title: "The Grid, Episode 08: The Review",
      type: "grid",
      series: "The Grid",
      excerpt: "A factory lead must decide whether to trust his team's two-week signoff or an AI review tool that finds a critical flaw in forty minutes.",
      publishDate: "2026-04-17",
      status: "published",
      tags: ["AI", "Robotics", "Automation"],
      detailPage: "writing/the-grid-the-review.html",
      dek: "In Bay 12, the real deadline is not shipment day, but the moment someone chooses who owns the risk.",
      sourcePath: "writing/drafts/The_GRID_008_2026-04-17.md",
      coverImage: "assets/covers/the-grid-series-cover.webp",
      coverAlt: "The Grid series cover showing a figure facing a glowing network above the ocean at night."
    },
    {
      slug: "the-grid-prologue",
      title: "The Grid, Episode 09: Prologue to a Managed Future",
      type: "grid",
      series: "The Grid",
      excerpt: "A quiet city starts making decisions before its operators know which system is making them.",
      publishDate: "2026-04-02",
      status: "queued",
      tags: ["AI", "Automation", "Energy"],
      detailPage: "writing/the-grid-prologue.html",
      dek: "An opening episode about invisible infrastructure, soft control, and a city learning to obey its own dashboards.",
      sourcePath: "writing/drafts/the-grid-prologue-2026-04-02.md"
    },
    {
      slug: "the-grid-signal-in-the-static",
      title: "The Grid, Episode 10: Signal in the Static",
      type: "grid",
      series: "The Grid",
      excerpt: "A robotics maintenance team discovers that the predictive system is not only forecasting failures, but reshaping who gets work and who gets ignored.",
      publishDate: "2026-04-09",
      status: "queued",
      tags: ["Robotics", "AI", "Automated Finance"],
      detailPage: "writing/the-grid-signal-in-the-static.html",
      dek: "A field report from a future where reliability scoring quietly becomes labor policy.",
      sourcePath: "writing/drafts/the-grid-signal-in-the-static-2026-04-09.md"
    },
    {
      slug: "the-grid-what-the-grid-wont-carry",
      title: "The Grid: Prelude — What the Grid Won't Carry",
      type: "grid",
      series: "The Grid",
      seriesLabel: "Prelude",
      excerpt: "A warehouse owner weighs cheaper AI control against the cost of giving a machine the last word on power.",
      publishDate: "2026-03-28",
      status: "published",
      tags: ["AI", "Energy", "Automation"],
      detailPage: "writing/the-grid-what-the-grid-wont-carry.html",
      sourcePath: "writing/drafts/THE_GRID_001_2026-03-28.md",
      dek: "In Ikeja, the robots work. The power bill is the real threat."
    },
    {
      slug: "the-grid-queued-energy-markets",
      title: "The Grid, Episode 11: Energy Markets After Midnight",
      type: "grid",
      series: "The Grid",
      excerpt: "A queued post about autonomous demand response, private microgrids, and markets that never sleep.",
      publishDate: "2026-04-16",
      status: "queued",
      tags: ["Energy", "Automation", "AI"],
      detailPage: "writing/the-grid-queued-energy-markets.html"
    },
    {
      slug: "the-second-map-inside-a-remote-job",
      title: "The Second Map Inside a Remote Job",
      type: "essay",
      series: "Essays",
      excerpt: "What 24,080 listings revealed about the hiring boundaries hidden inside remote job labels.",
      publishDate: "2026-07-15",
      status: "published",
      tags: ["Career Systems", "Remote Work", "Nigeria"],
      detailPage: "writing/the-second-map-inside-a-remote-job.html",
      dek: "From Lagos, every remote listing carries a second map: the places where the employer can actually hire.",
      sourcePath: "writing/drafts/the-second-map-inside-a-remote-job-2026-07-15.md"
    }
  ]
};
