#!/usr/bin/env node
/**
 * scripts/generate-pptx.js
 * Generate a native PPTX presentation using PptxGenJS.
 *
 * Usage:
 *   node scripts/generate-pptx.js [output.pptx]          # generate demo deck
 *   node scripts/generate-pptx.js --input spec.json [output.pptx]
 *
 * Spec JSON format (--input):
 *   {
 *     "title": "Deck Title",
 *     "author": "Author Name",
 *     "slides": [
 *       { "type": "title",   "title": "...", "subtitle": "...", "date": "..." },
 *       { "type": "content", "heading": "...", "bullets": ["...", "..."] },
 *       { "type": "two-col", "heading": "...",
 *         "left":  { "label": "...", "value": "...", "caption": "..." },
 *         "right": { "label": "...", "value": "...", "caption": "..." } },
 *       { "type": "chart",   "heading": "...", "chartType": "BAR|LINE|PIE",
 *         "data": [{ "name":"Series","labels":["A","B"],"values":[1,2] }] },
 *       { "type": "divider", "label": "Section Title", "number": "01" },
 *       { "type": "closing", "title": "...", "subtitle": "..." }
 *     ]
 *   }
 *
 * Requires:
 *   npm install -g pptxgenjs     (already at /opt/homebrew/lib/node_modules)
 */

"use strict";

const path  = require("path");
const fs    = require("fs");

// ── Resolve pptxgenjs from global install ───────────────────────────────────
let PptxGenJS;
try {
  PptxGenJS = require("pptxgenjs");
} catch {
  PptxGenJS = require("/opt/homebrew/lib/node_modules/pptxgenjs");
}

// ── Resolve sharp from global install (for SVG → PNG icon rendering) ────────
let sharp;
try {
  sharp = require("sharp");
} catch {
  try { sharp = require("/opt/homebrew/lib/node_modules/sharp"); } catch { sharp = null; }
}

// ════════════════════════════════════════════════════════════════════════════
// Brand Tokens — Sinochem Signature
// ════════════════════════════════════════════════════════════════════════════
const T = {
  brandGreen:      "00A758",
  brandGreenDark:  "007A3E",
  brandGreenSoft:  "E6F5ED",
  brandNavy:       "024097",
  brandNavyDark:   "02306F",
  brandNavySoft:   "E8EDF6",
  bgPrimary:       "FFFFFF",
  bgSecondary:     "F7FAF8",
  textPrimary:     "0F1A13",
  textSecondary:   "5A6B60",
  textTertiary:    "8A9B90",
  divider:         "E5EBE7",
  white:           "FFFFFF",
  // Alias
  accent:          "00A758",
  accentAlt:       "024097",
};

// Font stacks available in most systems (PowerPoint falls back gracefully)
const FONT_DISPLAY = "Manrope";
const FONT_BODY    = "Noto Sans SC";

// Slide canvas: LAYOUT_WIDE = 13.33 × 7.50 inches (matches 中宏PPT模版)
const W = 13.33;
const H = 7.50;

// Template-derived safe zones (from 中宏PPT模版 slide master inspection)
const MX   = 0.51;   // left & right margin  (master title placeholder x)
const TY   = 0.52;   // heading top y        (master title placeholder y)
const TH   = 0.87;   // heading height       (master title placeholder h)
const CY   = 1.65;   // content area top     (TY+TH + 0.26 gap)
const CEND = 6.50;   // content area bottom  (above master logo at 6.60)
const CW   = 12.31;  // usable content width (W - 2*MX)
const CH   = 4.85;   // usable content height (CEND - CY)

// ════════════════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════════════════

/** Always return a fresh shadow object — PptxGenJS mutates options in-place */
const makeShadow = () => ({
  type: "outer", color: "000000", opacity: 0.1, blur: 8, offset: 3, angle: 135
});

const makeShadowStrong = () => ({
  type: "outer", color: "000000", opacity: 0.18, blur: 12, offset: 4, angle: 135
});

// ════════════════════════════════════════════════════════════════════════════
// Icon System — Tabler Icons (MIT license, flat outline style)
// https://tabler.io/icons
// SVGs are converted to PNG at runtime using sharp + librsvg.
// ════════════════════════════════════════════════════════════════════════════

/** Map internal icon names → Tabler Icons filename (outline set) */
const TABLER_MAP = {
  "brain":        "brain",
  "cpu":          "cpu",
  "shield-check": "shield-check",
  "bar-chart-2":  "chart-bar",
  "shield":       "shield",
  "zap":          "bolt",
  "users":        "users",
  "monitor":      "device-desktop",
  "briefcase":    "briefcase",
  "globe":        "world",
  "calendar":     "calendar",
  "arrow-right":  "arrow-right",
};

/** Resolve the Tabler Icons outline SVG directory */
const TABLER_DIR = (() => {
  const candidates = [
    "/opt/homebrew/lib/node_modules/@tabler/icons/icons/outline",
    path.join(__dirname, "../node_modules/@tabler/icons/icons/outline"),
    path.join(__dirname, "node_modules/@tabler/icons/icons/outline"),
  ];
  for (const d of candidates) {
    try { if (fs.existsSync(d)) return d; } catch { /* skip */ }
  }
  return null;
})();

/** In-memory cache: "<iconName>_<colorHex>" → "data:image/png;base64,..." */
const _iconCache = {};

/**
 * Load a Tabler icon as a base64 PNG data URL (async, cached).
 * @param {string} iconName  internal name, e.g. "brain"
 * @param {string} colorHex  6-char hex without #, default "FFFFFF"
 * @param {number} size      render size in pixels, default 64
 * @returns {Promise<string|null>}
 */
async function loadIcon(iconName, colorHex = "FFFFFF", size = 64) {
  const key = `${iconName}_${colorHex}`;
  if (_iconCache[key]) return _iconCache[key];
  if (!sharp || !TABLER_DIR) return null;
  const file = path.join(TABLER_DIR, `${TABLER_MAP[iconName] || iconName}.svg`);
  if (!fs.existsSync(file)) { console.warn(`[icons] not found: ${file}`); return null; }
  let svg = fs.readFileSync(file, "utf8");
  svg = svg.replace(/currentColor/g, `#${colorHex}`);
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  _iconCache[key] = `data:image/png;base64,${buf.toString("base64")}`;
  return _iconCache[key];
}

/**
 * Pre-load all known icons in white so slide builders can read them
 * synchronously via getIcon().
 */
async function preloadIcons() {
  if (!sharp || !TABLER_DIR) {
    console.warn("[icons] sharp or @tabler/icons not available — icons will be omitted");
    return;
  }
  await Promise.all(Object.keys(TABLER_MAP).map(n => loadIcon(n, "FFFFFF", 64)));
  console.log(`[icons] Loaded ${Object.keys(_iconCache).length} Tabler icons`);
}

/**
 * Return cached PNG data URL synchronously (call preloadIcons() first).
 * Always returns white version — place on a colored background shape.
 */
function getIcon(iconName) {
  return _iconCache[`${iconName}_FFFFFF`] || null;
}

/**
 * Header bar: heading + divider line aligned to master title placeholder.
 * Matches master Title Placeholder 1: pos=(0.51, 0.52) size=(12.33, 0.87).
 */
function addHeaderBar(slide, heading) {
  slide.addText(heading, {
    x: MX, y: TY, w: CW, h: TH,
    fontSize: 24, fontFace: FONT_DISPLAY, bold: true,
    color: T.textPrimary, margin: 0, valign: "middle"
  });
  slide.addShape("line", {
    x: MX, y: TY + TH + 0.04, w: CW, h: 0,
    line: { color: T.divider, width: 1 }
  });
}

/**
 * Subtitle row — placed between heading and content zone.
 * Call after addHeaderBar; content should start at CY.
 */
function addSubtitleRow(slide, subtitle) {
  slide.addText(subtitle, {
    x: MX, y: TY + TH + 0.04, w: CW, h: 0.27,
    fontSize: 12, fontFace: FONT_BODY, color: T.textSecondary, margin: 0
  });
}

/** Footer bar with page number — intentionally empty (template provides footer) */
// eslint-disable-next-line no-unused-vars
/** Footer — removed; the company template provides its own footer. */
function addFooter(_slide, _pageNum, _total) {}

// ════════════════════════════════════════════════════════════════════════════
// Slide Builders
// ════════════════════════════════════════════════════════════════════════════

/**
 * TITLE SLIDE
 * Full-bleed branded hero with title, subtitle and date.
 */
function buildTitleSlide(pres, spec) {
  const slide = pres.addSlide();
  slide.background = { color: T.brandNavy };

  // Decorative green band at top
  slide.addShape("rect", {
    x: 0, y: 0, w: W, h: 0.24,
    fill: { color: T.brandGreen }, line: { color: T.brandGreen, width: 0 }
  });

  // Decorative circles (brand feel — right side)
  slide.addShape("ellipse", {
    x: 9.60, y: -0.67, w: 5.33, h: 5.33,
    fill: { color: T.brandGreen, transparency: 88 },
    line: { color: T.brandGreen, width: 0 }
  });
  slide.addShape("ellipse", {
    x: 10.40, y: 2.93, w: 3.33, h: 3.33,
    fill: { color: T.white, transparency: 94 },
    line: { color: T.white, width: 0 }
  });

  // Eyebrow / brand label
  const eyebrowText = spec.eyebrow || "MANULIFE · SINOCHEM";
  slide.addText(eyebrowText, {
    x: 0.73, y: 0.60, w: 8.00, h: 0.47,
    fontSize: 10, fontFace: FONT_DISPLAY, bold: true,
    color: T.brandGreen, charSpacing: 2, margin: 0
  });

  // Title
  slide.addText(spec.title || "Presentation Title", {
    x: 0.73, y: 1.33, w: 9.07, h: 2.40,
    fontSize: 40, fontFace: FONT_DISPLAY, bold: true,
    color: T.white, margin: 0, lineSpacingMultiple: 1.15
  });

  // Divider accent line
  slide.addShape("line", {
    x: 0.73, y: 3.79, w: 1.60, h: 0,
    line: { color: T.brandGreen, width: 2 }
  });

  // Subtitle
  if (spec.subtitle) {
    slide.addText(spec.subtitle, {
      x: 0.73, y: 3.93, w: 8.67, h: 0.80,
      fontSize: 16, fontFace: FONT_BODY,
      color: "A8C8DC", margin: 0
    });
  }

  // Date / metadata
  const dateStr = spec.date || new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
  slide.addText(dateStr, {
    x: 0.73, y: H - 0.96, w: 6.67, h: 0.43,
    fontSize: 12, fontFace: FONT_BODY, color: T.textTertiary, margin: 0
  });

  // Bottom accent bar
  slide.addShape("rect", {
    x: 0, y: H - 0.27, w: W, h: 0.27,
    fill: { color: T.brandGreen }, line: { color: T.brandGreen, width: 0 }
  });

  return slide;
}

/**
 * SECTION DIVIDER SLIDE
 * Dark-green background with large section number and label.
 */
function buildDividerSlide(pres, spec, pageNum, total) {
  const slide = pres.addSlide();
  slide.background = { color: T.brandGreenDark };

  // Large ghost number (decorative)
  if (spec.number) {
    slide.addText(spec.number, {
      x: -0.40, y: -0.53, w: 5.33, h: 4.00,
      fontSize: 240, fontFace: FONT_DISPLAY, bold: true,
      color: T.white, transparency: 92, margin: 0
    });
  }

  // Vertical accent line
  slide.addShape("line", {
    x: 1.47, y: 2.13, w: 0, h: 2.67,
    line: { color: T.brandGreen, width: 4 }
  });

  // Section label
  slide.addText(spec.label || "Section", {
    x: 2.00, y: 2.27, w: 10.00, h: 2.40,
    fontSize: 40, fontFace: FONT_DISPLAY, bold: true,
    color: T.white, margin: 0
  });

  addFooter(slide, pageNum, total);
  return slide;
}

/**
 * CONTENT SLIDE — bulleted list
 */
function buildContentSlide(pres, spec, pageNum, total) {
  const slide = pres.addSlide();
  slide.background = { color: T.bgPrimary };

  addHeaderBar(slide, spec.heading || "Content");

  const bullets = (spec.bullets || []).slice(0, 6);
  const items = bullets.map((b, i) => ({
    text: typeof b === "string" ? b : b.text,
    options: {
      bullet: { type: "bullet", characterCode: "25A0" },
      color: T.textPrimary,
      fontSize: 16,
      fontFace: FONT_BODY,
      breakLine: i < bullets.length - 1,
      paraSpaceAfter: 10
    }
  }));

  slide.addText(items, {
    x: MX, y: CY, w: CW, h: CH,
    valign: "top", margin: [0, 12, 0, 12]
  });

  addFooter(slide, pageNum, total);
  return slide;
}

/**
 * TWO-COLUMN STAT SLIDE
 * Left and right panels each with a KPI number and caption.
 */
function buildTwoColSlide(pres, spec, pageNum, total) {
  const slide = pres.addSlide();
  slide.background = { color: T.bgPrimary };

  addHeaderBar(slide, spec.heading || "Key Metrics");

  // 2 columns × 6.0" + 0.31" gap = CW = 12.31"
  const COL_W   = 6.00;
  const COL_H   = CH;
  const COL_Y   = CY;
  const LEFT_X  = MX;
  const RIGHT_X = MX + COL_W + 0.31;

  [{ data: spec.left, x: LEFT_X }, { data: spec.right, x: RIGHT_X }].forEach(({ data, x }) => {
    if (!data) return;
    // Card background
    slide.addShape("rect", {
      x, y: COL_Y, w: COL_W, h: COL_H,
      fill: { color: T.bgSecondary },
      shadow: makeShadow(),
      line: { color: T.divider, width: 1 }
    });
    // Top accent stripe
    slide.addShape("rect", {
      x, y: COL_Y, w: COL_W, h: 0.09,
      fill: { color: T.brandGreen }, line: { color: T.brandGreen, width: 0 }
    });
    // Label
    slide.addText(data.label || "", {
      x: x + 0.29, y: COL_Y + 0.27, w: COL_W - 0.58, h: 0.53,
      fontSize: 16, fontFace: FONT_BODY, color: T.textSecondary,
      bold: false, margin: 0
    });
    // Value (big number)
    slide.addText(data.value || "", {
      x: x + 0.29, y: COL_Y + 0.87, w: COL_W - 0.58, h: 2.00,
      fontSize: 68, fontFace: FONT_DISPLAY, bold: true,
      color: T.brandGreen, margin: 0
    });
    // Caption / description
    slide.addText(data.caption || "", {
      x: x + 0.29, y: COL_Y + 3.00, w: COL_W - 0.58, h: 1.40,
      fontSize: 14, fontFace: FONT_BODY, color: T.textSecondary,
      wrap: true, margin: 0, lineSpacingMultiple: 1.3
    });
  });

  addFooter(slide, pageNum, total);
  return slide;
}

/**
 * CHART SLIDE
 * Bar, Line, or Pie chart with heading.
 */
function buildChartSlide(pres, spec, pageNum, total) {
  const slide = pres.addSlide();
  slide.background = { color: T.bgPrimary };

  addHeaderBar(slide, spec.heading || "Chart");

  const chartType = (spec.chartType || "BAR").toUpperCase();
  const chartEnum = pres.charts[chartType] || pres.charts.BAR;

  const data = spec.data || [{
    name: "数据系列",
    labels: ["Q1", "Q2", "Q3", "Q4"],
    values: [42, 57, 68, 75]
  }];

  const chartOpts = {
    x: MX, y: CY, w: CW, h: CH,
    chartColors: ["00A758", "024097", "5EEAD4", "93C5FD", "FCA5A5"],
    chartArea: { fill: { color: T.bgPrimary }, roundedCorners: false },
    catAxisLabelColor: T.textSecondary,
    valAxisLabelColor: T.textSecondary,
    catAxisLabelFontSize: 12,
    valAxisLabelFontSize: 12,
    valGridLine: { color: T.divider, size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelColor: T.textPrimary,
    dataLabelFontSize: 12,
    dataLabelFontBold: true,
    showLegend: data.length > 1,
    legendPos: "b",
    legendFontSize: 12,
    legendColor: T.textSecondary,
  };

  if (chartType === "BAR") {
    chartOpts.barDir = spec.barDir || "col";
    chartOpts.barGrouping = "clustered";
    chartOpts.dataLabelPosition = "outEnd";
  }
  if (chartType === "LINE") {
    chartOpts.lineSize = 2.5;
    chartOpts.lineSmooth = false;
    chartOpts.showMarker = true;
    chartOpts.markerSize = 5;
  }
  if (chartType === "PIE" || chartType === "DOUGHNUT") {
    chartOpts.showPercent = true;
    chartOpts.dataLabelPosition = "bestFit";
    delete chartOpts.valGridLine;
    delete chartOpts.catGridLine;
  }

  slide.addChart(chartEnum, data, chartOpts);

  addFooter(slide, pageNum, total);
  return slide;
}

/**
 * STAT GRID SLIDE
 * 4 stat cards in a horizontal row (numbers + label + source).
 */
function buildStatGridSlide(pres, spec, pageNum, total) {
  const slide = pres.addSlide();
  slide.background = { color: T.bgPrimary };

  addHeaderBar(slide, spec.heading || "");

  if (spec.subtitle) {
    addSubtitleRow(slide, spec.subtitle);
  }

  // 4 cards × 2.80" + 3 × 0.37" gap = CW = 12.31"
  const stats  = (spec.stats || []).slice(0, 4);
  const n      = stats.length;
  const CARD_W = 2.80, GAP = 0.37;
  const totalW = n * CARD_W + (n - 1) * GAP;
  const startX = MX + (CW - totalW) / 2;
  const CARD_Y = CY;
  const CARD_H = CH;

  stats.forEach((s, i) => {
    const isEven   = i % 2 === 1;
    const numColor = isEven ? T.brandNavy  : T.brandGreen;
    const topColor = isEven ? T.brandNavy  : T.brandGreen;
    const x        = startX + i * (CARD_W + GAP);

    slide.addShape("rect", {
      x, y: CARD_Y, w: CARD_W, h: CARD_H,
      fill: { color: T.bgSecondary }, line: { color: T.divider, width: 1 }
    });
    slide.addShape("rect", {
      x, y: CARD_Y, w: CARD_W, h: 0.09,
      fill: { color: topColor }, line: { color: topColor, width: 0 }
    });
    slide.addText(s.value || "", {
      x: x + 0.16, y: CARD_Y + 0.21, w: CARD_W - 0.32, h: 1.40,
      fontSize: 52, fontFace: FONT_DISPLAY, bold: true,
      color: numColor, margin: 0
    });
    slide.addText(s.label || "", {
      x: x + 0.16, y: CARD_Y + 1.71, w: CARD_W - 0.32, h: CARD_H - 2.22,
      fontSize: 13, fontFace: FONT_BODY, color: T.textSecondary,
      wrap: true, margin: 0, lineSpacingMultiple: 1.3, valign: "top"
    });
    slide.addText(s.source || "", {
      x: x + 0.16, y: CARD_Y + CARD_H - 0.51, w: CARD_W - 0.32, h: 0.36,
      fontSize: 10, fontFace: FONT_BODY, color: T.textTertiary, margin: 0
    });
  });

  addFooter(slide, pageNum, total);
  return slide;
}

/**
 * FINDINGS LIST SLIDE
 * Bordered row items: left accent bar + bold heading + description.
 */
function buildFindingsSlide(pres, spec, pageNum, total) {
  const slide = pres.addSlide();
  slide.background = { color: T.bgPrimary };

  addHeaderBar(slide, spec.heading || "");

  if (spec.subtitle) {
    addSubtitleRow(slide, spec.subtitle);
  }

  const findings = (spec.findings || []).slice(0, 4);
  const startY   = CY;
  const ITEM_H   = 0.95;
  const GAP      = 0.20;

  findings.forEach((f, i) => {
    const isEven      = i % 2 === 1;
    const borderColor = isEven ? T.brandNavy : T.brandGreen;
    const y           = startY + i * (ITEM_H + GAP);
    const iconName    = f.icon || null;
    const iconData    = iconName ? getIcon(iconName) : null;

    // Card background
    slide.addShape("rect", {
      x: MX, y, w: CW, h: ITEM_H,
      fill: { color: T.bgSecondary }, line: { color: T.divider, width: 1 }
    });
    // Left accent border
    slide.addShape("rect", {
      x: MX, y, w: 0.075, h: ITEM_H,
      fill: { color: borderColor }, line: { color: borderColor, width: 0 }
    });
    if (iconData) {
      // Icon background square (solid accent color)
      slide.addShape("rect", {
        x: MX + 0.13, y: y + 0.22, w: 0.50, h: 0.50,
        fill: { color: borderColor }, line: { color: borderColor, width: 0 }
      });
      // Tabler icon PNG (white on colored bg)
      slide.addImage({ data: iconData, x: MX + 0.20, y: y + 0.29, w: 0.36, h: 0.36 });
    }
    const textX = iconData ? MX + 0.75 : MX + 0.20;
    const textW = iconData ? CW - 0.95  : CW - 0.35;
    slide.addText(f.title || "", {
      x: textX, y: y + 0.11, w: textW, h: 0.36,
      fontSize: 16, fontFace: FONT_BODY, bold: true,
      color: T.textPrimary, margin: 0
    });
    slide.addText(f.desc || "", {
      x: textX, y: y + 0.50, w: textW, h: 0.38,
      fontSize: 14, fontFace: FONT_BODY, color: T.textSecondary,
      margin: 0, wrap: true
    });
  });

  addFooter(slide, pageNum, total);
  return slide;
}

/**
 * CALLOUT GRID SLIDE
 * 3 large-percentage callout cards (green / neutral / navy themes).
 */
function buildCalloutGridSlide(pres, spec, pageNum, total) {
  const slide = pres.addSlide();
  slide.background = { color: T.bgPrimary };

  addHeaderBar(slide, spec.heading || "");

  // 3 cards × 3.80" + 2 × 0.255" gap = 11.91" < CW — centered
  const cards  = (spec.cards || []).slice(0, 3);
  const n      = cards.length;
  const CARD_W = 3.80, GAP = 0.255;
  const totalW = n * CARD_W + (n - 1) * GAP;
  const startX = MX + (CW - totalW) / 2;
  const CARD_Y = CY, CARD_H = CH;

  const THEMES = {
    green:   { bg: "E6F5ED", border: "00A758", top: "00A758", num: "007A3E" },
    neutral: { bg: "F7FAF8", border: T.divider, top: T.divider, num: T.textPrimary },
    navy:    { bg: "E8EDF6", border: "024097", top: "024097", num: "02306F" }
  };

  cards.forEach((c, i) => {
    const th = THEMES[c.theme] || THEMES.neutral;
    const x  = startX + i * (CARD_W + GAP);

    slide.addShape("rect", {
      x, y: CARD_Y, w: CARD_W, h: CARD_H,
      fill: { color: th.bg }, line: { color: th.border, width: 1 }
    });
    slide.addShape("rect", {
      x, y: CARD_Y, w: CARD_W, h: 0.09,
      fill: { color: th.top }, line: { color: th.top, width: 0 }
    });
    slide.addText(c.value || "", {
      x: x + 0.20, y: CARD_Y + 0.20, w: CARD_W - 0.40, h: 1.47,
      fontSize: 60, fontFace: FONT_DISPLAY, bold: true,
      color: th.num, margin: 0
    });
    slide.addText(c.title || "", {
      x: x + 0.20, y: CARD_Y + 1.84, w: CARD_W - 0.40, h: 0.50,
      fontSize: 17, fontFace: FONT_BODY, bold: true,
      color: T.textPrimary, margin: 0, wrap: true
    });
    slide.addText(c.desc || "", {
      x: x + 0.20, y: CARD_Y + 2.42, w: CARD_W - 0.40, h: 1.90,
      fontSize: 13, fontFace: FONT_BODY, color: T.textSecondary,
      margin: 0, wrap: true, lineSpacingMultiple: 1.35, valign: "top"
    });
  });

  addFooter(slide, pageNum, total);
  return slide;
}

/**
 * TWO-COL-LIST SLIDE
 * Two side-by-side columns, each with a title and bullet list.
 */
function buildTwoColListSlide(pres, spec, pageNum, total) {
  const slide = pres.addSlide();
  slide.background = { color: T.bgPrimary };

  addHeaderBar(slide, spec.heading || "");

  // 2 columns × 6.0" + 0.31" gap = CW = 12.31"
  const COL_W  = 6.00, GAP = 0.31;
  const startX = MX;
  const COL_Y  = CY, COL_H = CH;

  [{ data: spec.left, x: startX, accent: T.brandGreen },
   { data: spec.right, x: startX + COL_W + GAP, accent: T.brandNavy }]
  .forEach(({ data, x, accent }) => {
    if (!data) return;

    slide.addShape("rect", {
      x, y: COL_Y, w: COL_W, h: COL_H,
      fill: { color: T.bgSecondary }, line: { color: T.divider, width: 1 }
    });
    slide.addShape("rect", {
      x, y: COL_Y, w: COL_W, h: 0.09,
      fill: { color: accent }, line: { color: accent, width: 0 }
    });
    // Icon beside column title
    const iconData = data.icon ? getIcon(data.icon) : null;
    const titleX   = iconData ? x + 0.77 : x + 0.27;
    const titleW   = iconData ? COL_W - 1.04 : COL_W - 0.54;
    if (iconData) {
      // Small icon square with accent bg
      slide.addShape("rect", {
        x: x + 0.27, y: COL_Y + 0.20, w: 0.40, h: 0.40,
        fill: { color: accent }, line: { color: accent, width: 0 }
      });
      // Tabler icon PNG
      slide.addImage({ data: iconData, x: x + 0.32, y: COL_Y + 0.25, w: 0.30, h: 0.30 });
    }
    slide.addText(data.title || "", {
      x: titleX, y: COL_Y + 0.19, w: titleW, h: 0.50,
      fontSize: 18, fontFace: FONT_BODY, bold: true,
      color: T.textPrimary, margin: 0
    });

    const bullets  = (data.bullets || []).slice(0, 5);
    const richText = bullets.map((b, idx) => ({
      text: b,
      options: {
        bullet: true,
        color: T.textSecondary,
        fontSize: 14,
        fontFace: FONT_BODY,
        breakLine: idx < bullets.length - 1,
        paraSpaceAfter: 9
      }
    }));
    slide.addText(richText, {
      x: x + 0.24, y: COL_Y + 0.87, w: COL_W - 0.48, h: COL_H - 1.02,
      valign: "top", margin: [0, 8, 0, 8]
    });
  });

  addFooter(slide, pageNum, total);
  return slide;
}

/**
 * LEARN GRID SLIDE
 * 3 cards each with a title, description, and an effectiveness progress bar.
 */
function buildLearnGridSlide(pres, spec, pageNum, total) {
  const slide = pres.addSlide();
  slide.background = { color: T.bgPrimary };

  addHeaderBar(slide, spec.heading || "");

  // 3 cards × 3.80" + 2 × 0.255" gap = 11.91" — centered
  const cards  = (spec.cards || []).slice(0, 3);
  const n      = cards.length;
  const CARD_W = 3.80, GAP = 0.255;
  const totalW = n * CARD_W + (n - 1) * GAP;
  const startX = MX + (CW - totalW) / 2;
  const CARD_Y = CY, CARD_H = CH;

  const THEMES = {
    green:   { iconBg: T.brandGreen,  barColor: T.brandGreen,  valColor: T.brandGreen  },
    navy:    { iconBg: T.brandNavy,   barColor: T.brandNavy,   valColor: T.brandNavy   },
    neutral: { iconBg: T.textPrimary, barColor: T.textPrimary, valColor: T.textPrimary }
  };

  cards.forEach((c, i) => {
    const th     = THEMES[c.theme] || THEMES.neutral;
    const x      = startX + i * (CARD_W + GAP);
    const barY   = CARD_Y + CARD_H - 0.90;
    const pct    = Math.max(0, Math.min(100, c.pct || 0));
    const fillW  = (CARD_W - 0.40) * (pct / 100);

    slide.addShape("rect", {
      x, y: CARD_Y, w: CARD_W, h: CARD_H,
      fill: { color: T.bgSecondary }, line: { color: T.divider, width: 1 }
    });
    // Icon background square (solid accent color)
    slide.addShape("rect", {
      x: x + 0.24, y: CARD_Y + 0.27, w: 0.56, h: 0.56,
      fill: { color: th.iconBg }, line: { color: th.iconBg, width: 0 }
    });
    // Tabler icon PNG (white on colored bg)
    const iconData = c.icon ? getIcon(c.icon) : null;
    if (iconData) {
      slide.addImage({ data: iconData, x: x + 0.32, y: CARD_Y + 0.35, w: 0.40, h: 0.40 });
    }
    slide.addText(c.title || "", {
      x: x + 0.20, y: CARD_Y + 1.00, w: CARD_W - 0.40, h: 0.48,
      fontSize: 17, fontFace: FONT_BODY, bold: true,
      color: T.textPrimary, margin: 0
    });
    slide.addText(c.desc || "", {
      x: x + 0.20, y: CARD_Y + 1.55, w: CARD_W - 0.40, h: CARD_H - 2.55,
      fontSize: 13, fontFace: FONT_BODY, color: T.textSecondary,
      margin: 0, wrap: true, lineSpacingMultiple: 1.35, valign: "top"
    });
    // Bar track
    slide.addShape("rect", {
      x: x + 0.20, y: barY, w: CARD_W - 0.40, h: 0.09,
      fill: { color: T.divider }, line: { color: T.divider, width: 0 }
    });
    // Bar fill
    if (fillW > 0) {
      slide.addShape("rect", {
        x: x + 0.20, y: barY, w: fillW, h: 0.09,
        fill: { color: th.barColor }, line: { color: th.barColor, width: 0 }
      });
    }
    // Label + value
    slide.addText(c.label || "", {
      x: x + 0.20, y: barY + 0.14, w: CARD_W * 0.60, h: 0.30,
      fontSize: 11, fontFace: FONT_BODY, color: T.textTertiary, margin: 0
    });
    slide.addText(`~${pct}%`, {
      x: x + 0.20 + CARD_W * 0.60, y: barY + 0.14, w: CARD_W * 0.40 - 0.20, h: 0.30,
      fontSize: 12, fontFace: FONT_BODY, bold: true,
      color: th.valColor, margin: 0, align: "right"
    });
  });

  addFooter(slide, pageNum, total);
  return slide;
}

/**
 * REC GRID SLIDE
 * 2×2 recommendation cards with numbered items.
 */
function buildRecGridSlide(pres, spec, pageNum, total) {
  const slide = pres.addSlide();
  slide.background = { color: T.bgPrimary };

  addHeaderBar(slide, spec.heading || "");

  // 2 cols × 6.0" + 0.31" gap = CW = 12.31"
  // 2 rows × ROW_H + 0.22" gap = CH = 4.85"  → ROW_H = (4.85 - 0.22) / 2 = 2.315"
  const recs   = (spec.recs || []).slice(0, 4);
  const COL_W  = 6.00, GAP_X = 0.31;
  const ROW_H  = 2.315, GAP_Y = 0.22;
  const startX = MX;
  const startY = CY;

  recs.forEach((r, i) => {
    const col         = i % 2;
    const row         = Math.floor(i / 2);
    const isEven      = i % 2 === 1;
    const accentColor = isEven ? T.brandNavy : T.brandGreen;
    const numColor    = isEven ? T.brandNavy : T.brandGreen;
    const x           = startX + col * (COL_W + GAP_X);
    const y           = startY + row * (ROW_H + GAP_Y);

    slide.addShape("rect", {
      x, y, w: COL_W, h: ROW_H,
      fill: { color: T.bgSecondary }, line: { color: T.divider, width: 1 }
    });
    slide.addShape("rect", {
      x, y, w: 0.075, h: ROW_H,
      fill: { color: accentColor }, line: { color: accentColor, width: 0 }
    });
    slide.addText(r.num || `0${i + 1}`, {
      x: x + 0.22, y: y + 0.13, w: 0.93, h: 0.64,
      fontSize: 28, fontFace: FONT_DISPLAY, bold: true,
      color: numColor, margin: 0
    });
    slide.addText(r.title || "", {
      x: x + 0.22, y: y + 0.80, w: COL_W - 0.42, h: 0.40,
      fontSize: 17, fontFace: FONT_BODY, bold: true,
      color: T.textPrimary, margin: 0
    });
    slide.addText(r.desc || "", {
      x: x + 0.22, y: y + 1.24, w: COL_W - 0.42, h: 0.91,
      fontSize: 14, fontFace: FONT_BODY, color: T.textSecondary,
      margin: 0, wrap: true, lineSpacingMultiple: 1.3, valign: "top"
    });
  });

  addFooter(slide, pageNum, total);
  return slide;
}

/**
 * CLOSING SLIDE
 * Simple branded end slide.
 */
function buildClosingSlide(pres, spec) {
  const slide = pres.addSlide();
  slide.background = { color: T.brandNavy };

  // Top green bar
  slide.addShape("rect", {
    x: 0, y: 0, w: W, h: 0.24,
    fill: { color: T.brandGreen }, line: { color: T.brandGreen, width: 0 }
  });

  // Decorative circle (left side)
  slide.addShape("ellipse", {
    x: -1.33, y: 2.00, w: 6.67, h: 6.67,
    fill: { color: T.brandGreen, transparency: 92 },
    line: { color: T.brandGreen, width: 0 }
  });

  // Main message
  slide.addText(spec.title || "谢谢", {
    x: 2.00, y: 1.87, w: 9.33, h: 1.87,
    fontSize: 52, fontFace: FONT_DISPLAY, bold: true,
    color: T.white, align: "center", margin: 0
  });

  // Divider accent line
  slide.addShape("line", {
    x: 5.07, y: 3.93, w: 3.20, h: 0,
    line: { color: T.brandGreen, width: 2 }
  });

  // Subtitle
  if (spec.subtitle) {
    slide.addText(spec.subtitle, {
      x: 2.00, y: 4.00, w: 9.33, h: 0.80,
      fontSize: 17, fontFace: FONT_BODY,
      color: "A8C8DC", align: "center", margin: 0
    });
  }

  // Branding footer
  slide.addText("MANULIFE · SINOCHEM  中宏保险", {
    x: 0, y: H - 0.73, w: W, h: 0.40,
    fontSize: 11, fontFace: FONT_DISPLAY, bold: true,
    color: T.textTertiary, align: "center", charSpacing: 2, margin: 0
  });

  // Bottom accent bar
  slide.addShape("rect", {
    x: 0, y: H - 0.27, w: W, h: 0.27,
    fill: { color: T.brandGreen }, line: { color: T.brandGreen, width: 0 }
  });

  return slide;
}

// ════════════════════════════════════════════════════════════════════════════
// Main — assemble deck from spec
// ════════════════════════════════════════════════════════════════════════════

async function buildDeck(spec) {
  await preloadIcons();

  const pres = new PptxGenJS();
  pres.layout  = "LAYOUT_WIDE";
  pres.author  = spec.author  || "Manulife Sinochem";
  pres.title   = spec.title   || "Presentation";
  pres.subject = spec.subject || "";

  const slides     = spec.slides || [];
  const totalPages = slides.length; // excludes title from page numbering
  let pageNum = 0;

  for (const s of slides) {
    switch (s.type) {
      case "title":
        buildTitleSlide(pres, s);
        break;
      case "divider":
        pageNum++;
        buildDividerSlide(pres, s, pageNum, totalPages - 1);
        break;
      case "content":
        pageNum++;
        buildContentSlide(pres, s, pageNum, totalPages - 1);
        break;
      case "two-col":
        pageNum++;
        buildTwoColSlide(pres, s, pageNum, totalPages - 1);
        break;
      case "stat-grid":
        pageNum++;
        buildStatGridSlide(pres, s, pageNum, totalPages - 1);
        break;
      case "findings":
        pageNum++;
        buildFindingsSlide(pres, s, pageNum, totalPages - 1);
        break;
      case "callout-grid":
        pageNum++;
        buildCalloutGridSlide(pres, s, pageNum, totalPages - 1);
        break;
      case "two-col-list":
        pageNum++;
        buildTwoColListSlide(pres, s, pageNum, totalPages - 1);
        break;
      case "learn-grid":
        pageNum++;
        buildLearnGridSlide(pres, s, pageNum, totalPages - 1);
        break;
      case "rec-grid":
        pageNum++;
        buildRecGridSlide(pres, s, pageNum, totalPages - 1);
        break;
      case "chart":
        pageNum++;
        buildChartSlide(pres, s, pageNum, totalPages - 1);
        break;
      case "closing":
        buildClosingSlide(pres, s);
        break;
      default:
        console.warn(`⚠  Unknown slide type: "${s.type}" — skipped`);
    }
  }

  return pres;
}

// ════════════════════════════════════════════════════════════════════════════
// Demo Spec — generated when no --input is provided
// ════════════════════════════════════════════════════════════════════════════

const DEMO_SPEC = {
  title:   "2025 职场技能调研报告",
  author:  "中宏保险 · 人才发展部",
  subject: "年度调研",
  slides: [
    {
      type:     "title",
      title:    "2025 职场技能\n调研报告",
      subtitle: "洞察趋势 · 赋能成长",
      date:     "2025年5月"
    },
    {
      type:   "divider",
      number: "01",
      label:  "调研概况"
    },
    {
      type:    "two-col",
      heading: "核心数据一览",
      left: {
        label:   "参与员工总数",
        value:   "3,847",
        caption: "覆盖全国 28 个城市分公司，较去年同期增长 23%"
      },
      right: {
        label:   "技能提升意愿",
        value:   "91%",
        caption: "超九成员工表示愿意在未来 12 个月内参与技能培训"
      }
    },
    {
      type:    "content",
      heading: "调研方法与范围",
      bullets: [
        "问卷发放：通过企业微信向全体在职员工发送在线问卷",
        "有效回收率：89.4%，共计 3,847 份有效样本",
        "调研周期：2025年3月1日 — 3月31日",
        "数据验证：第三方机构复核，确保数据真实可靠",
        "覆盖层级：基层员工 62%、中层管理 28%、高层管理 10%"
      ]
    },
    {
      type:   "divider",
      number: "02",
      label:  "技能需求分析"
    },
    {
      type:      "chart",
      heading:   "各类技能培训需求占比（%）",
      chartType: "BAR",
      data: [{
        name:   "需求强度",
        labels: ["数字化工具", "AI应用能力", "客户沟通", "风险管理", "领导力", "数据分析"],
        values: [78, 72, 65, 58, 51, 44]
      }]
    },
    {
      type:      "chart",
      heading:   "技能提升意愿趋势（2023–2025）",
      chartType: "LINE",
      data: [
        {
          name:   "数字化",
          labels: ["2023 Q1","2023 Q3","2024 Q1","2024 Q3","2025 Q1"],
          values: [52, 58, 63, 70, 78]
        },
        {
          name:   "AI 应用",
          labels: ["2023 Q1","2023 Q3","2024 Q1","2024 Q3","2025 Q1"],
          values: [18, 28, 42, 60, 72]
        }
      ]
    },
    {
      type:      "chart",
      heading:   "员工首选培训形式分布",
      chartType: "PIE",
      data: [{
        name:   "培训形式",
        labels: ["在线自学", "线下课堂", "导师辅导", "实战项目", "其他"],
        values: [38, 24, 19, 14, 5]
      }]
    },
    {
      type:    "content",
      heading: "核心发现与洞察",
      bullets: [
        "AI 工具使用意愿同比增长 54%，成为增长最快的技能需求类别",
        "数字化能力需求连续三年排名首位，但供给侧缺口仍较明显",
        "基层员工更倾向在线自学（48%）；管理层偏好导师辅导（35%）",
        "跨部门协作技能需求上升至第三位，反映组织扁平化趋势",
        "45岁以上员工技能焦虑指数较去年下降 12 个百分点"
      ]
    },
    {
      type:   "divider",
      number: "03",
      label:  "行动建议"
    },
    {
      type:    "content",
      heading: "2025年技能发展优先事项",
      bullets: [
        "建立 AI 能力分级认证体系，覆盖全员基础 → 进阶路径",
        "推出「技能积分」激励机制，将学习与绩效评估挂钩",
        "设立数字化技能孵化营，每季度培养内部讲师 30 名",
        "与头部科技平台合作，上线 200+ 门在线微课",
        "构建跨部门技能共享社区，打破信息孤岛"
      ]
    },
    {
      type:     "closing",
      title:    "感谢参与",
      subtitle: "共建学习型组织 · 驱动持续成长"
    }
  ]
};

// ════════════════════════════════════════════════════════════════════════════
// CLI entry point
// ════════════════════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  let spec       = DEMO_SPEC;
  let outputFile = "output.pptx";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" && args[i + 1]) {
      const specPath = path.resolve(args[++i]);
      if (!fs.existsSync(specPath)) {
        console.error(`✗ Spec file not found: ${specPath}`);
        process.exit(1);
      }
      spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
    } else if (args[i].endsWith(".pptx")) {
      outputFile = args[i];
    }
  }

  console.log(`ℹ Generating: ${outputFile}`);
  const pres = await buildDeck(spec);

  await pres.writeFile({ fileName: outputFile });
  console.log(`✓ Saved: ${path.resolve(outputFile)}`);
}

main().catch(err => {
  console.error("✗ Error:", err.message);
  process.exit(1);
});
