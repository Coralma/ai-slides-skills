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

// Slide canvas: LAYOUT_16x9 = 10 × 5.625 inches
const W = 10;
const H = 5.625;

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
// Lucide Icon SVGs  (stroke="#STROKE#" replaced at render time)
// ════════════════════════════════════════════════════════════════════════════
const LUCIDE_SVGS = {
  "brain":        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>',
  "cpu":          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
  "shield-check": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>',
  "bar-chart-2":  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>',
  "shield":       '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>',
  "zap":          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  "users":        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  "monitor":      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>',
  "briefcase":    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  "globe":        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  "calendar":     '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
  "arrow-right":  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#STROKE#" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
};

/**
 * Return a base64 SVG data URI for the given Lucide icon name.
 * strokeHex: 6-char hex color (no leading #), e.g. "00A758"
 * Returns null if the icon is not found in the lookup table.
 */
function lucideImg(name, strokeHex) {
  const svg = LUCIDE_SVGS[name];
  if (!svg) return null;
  const colored = svg.replace(/#STROKE#/g, "#" + strokeHex);
  return "data:image/svg+xml;base64," + Buffer.from(colored).toString("base64");
}

/** Header bar shared by content slides */
function addHeaderBar(slide, heading) {
  // Heading
  slide.addText(heading, {
    x: 0.28, y: 0.3, w: W - 0.56, h: 0.55,
    fontSize: 22, fontFace: FONT_DISPLAY, bold: true,
    color: T.textPrimary, margin: 0
  });
  // Divider line
  slide.addShape("line", {
    x: 0.28, y: 0.92, w: W - 0.56, h: 0,
    line: { color: T.divider, width: 1 }
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
 * Full-bleed gradient hero with title, subtitle and date.
 */
function buildTitleSlide(pres, spec) {
  const slide = pres.addSlide();
  slide.background = { color: T.brandNavy };

  // Decorative green band at top
  slide.addShape("rect", {
    x: 0, y: 0, w: W, h: 0.18,
    fill: { color: T.brandGreen }, line: { color: T.brandGreen, width: 0 }
  });

  // Decorative circles (brand feel)
  slide.addShape("ellipse", {
    x: 7.2, y: -0.5, w: 4, h: 4,
    fill: { color: T.brandGreen, transparency: 88 },
    line: { color: T.brandGreen, width: 0 }
  });
  slide.addShape("ellipse", {
    x: 7.8, y: 2.2, w: 2.5, h: 2.5,
    fill: { color: T.white, transparency: 94 },
    line: { color: T.white, width: 0 }
  });

  // Eyebrow / brand label
  const eyebrowText = spec.eyebrow || "MANULIFE · SINOCHEM";
  slide.addText(eyebrowText, {
    x: 0.55, y: 0.45, w: 6, h: 0.35,
    fontSize: 10, fontFace: FONT_DISPLAY, bold: true,
    color: T.brandGreen, charSpacing: 2, margin: 0
  });

  // Title
  slide.addText(spec.title || "Presentation Title", {
    x: 0.55, y: 1.0, w: 6.8, h: 1.8,
    fontSize: 36, fontFace: FONT_DISPLAY, bold: true,
    color: T.white, margin: 0, lineSpacingMultiple: 1.15
  });

  // Subtitle
  if (spec.subtitle) {
    slide.addText(spec.subtitle, {
      x: 0.55, y: 2.95, w: 6.5, h: 0.6,
      fontSize: 15, fontFace: FONT_BODY,
      color: "A8C8DC", margin: 0
    });
  }

  // Divider accent line
  slide.addShape("line", {
    x: 0.55, y: 2.82, w: 1.2, h: 0,
    line: { color: T.brandGreen, width: 2 }
  });

  // Date / metadata
  const dateStr = spec.date || new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
  slide.addText(dateStr, {
    x: 0.55, y: H - 0.72, w: 5, h: 0.32,
    fontSize: 11, fontFace: FONT_BODY, color: T.textTertiary, margin: 0
  });

  // Bottom accent bar
  slide.addShape("rect", {
    x: 0, y: H - 0.2, w: W, h: 0.2,
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

  // Large ghost number
  if (spec.number) {
    slide.addText(spec.number, {
      x: -0.3, y: -0.4, w: 4, h: 3,
      fontSize: 180, fontFace: FONT_DISPLAY, bold: true,
      color: T.white, transparency: 92, margin: 0
    });
  }

  // Vertical accent line
  slide.addShape("line", {
    x: 1.1, y: 1.6, w: 0, h: 2.0,
    line: { color: T.brandGreen, width: 3 }
  });

  // Section label
  slide.addText(spec.label || "Section", {
    x: 1.5, y: 1.7, w: 7.5, h: 1.8,
    fontSize: 34, fontFace: FONT_DISPLAY, bold: true,
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
      fontSize: 14,
      fontFace: FONT_BODY,
      breakLine: i < bullets.length - 1,
      paraSpaceAfter: 8
    }
  }));

  slide.addText(items, {
    x: 0.4, y: 1.1, w: W - 0.8, h: H - 1.6,
    valign: "top", margin: [0, 10, 0, 10]
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

  const COL_W   = 4.3;
  const COL_H   = 3.6;
  const COL_Y   = 1.1;
  const LEFT_X  = 0.3;
  const RIGHT_X = 5.4;

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
      x, y: COL_Y, w: COL_W, h: 0.07,
      fill: { color: T.brandGreen }, line: { color: T.brandGreen, width: 0 }
    });
    // Label
    slide.addText(data.label || "", {
      x: x + 0.22, y: COL_Y + 0.2, w: COL_W - 0.44, h: 0.4,
      fontSize: 12, fontFace: FONT_BODY, color: T.textSecondary,
      bold: false, margin: 0
    });
    // Value (big number)
    slide.addText(data.value || "", {
      x: x + 0.22, y: COL_Y + 0.65, w: COL_W - 0.44, h: 1.5,
      fontSize: 52, fontFace: FONT_DISPLAY, bold: true,
      color: T.brandGreen, margin: 0
    });
    // Caption / description
    slide.addText(data.caption || "", {
      x: x + 0.22, y: COL_Y + 2.25, w: COL_W - 0.44, h: 1.1,
      fontSize: 12, fontFace: FONT_BODY, color: T.textSecondary,
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
    x: 0.4, y: 1.1, w: W - 0.8, h: H - 1.7,
    chartColors: ["00A758", "024097", "5EEAD4", "93C5FD", "FCA5A5"],
    chartArea: { fill: { color: T.bgPrimary }, roundedCorners: false },
    catAxisLabelColor: T.textSecondary,
    valAxisLabelColor: T.textSecondary,
    catAxisLabelFontSize: 11,
    valAxisLabelFontSize: 11,
    valGridLine: { color: T.divider, size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelColor: T.textPrimary,
    dataLabelFontSize: 11,
    dataLabelFontBold: true,
    showLegend: data.length > 1,
    legendPos: "b",
    legendFontSize: 11,
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
    slide.addText(spec.subtitle, {
      x: 0.28, y: 0.95, w: W - 0.56, h: 0.22,
      fontSize: 10, fontFace: FONT_BODY, color: T.textSecondary, margin: 0
    });
  }

  const stats  = (spec.stats || []).slice(0, 4);
  const n      = stats.length;
  const CARD_W = 2.1, GAP = 0.13;
  const totalW = n * CARD_W + (n - 1) * GAP;
  const startX = (W - totalW) / 2;
  const CARD_Y = spec.subtitle ? 1.32 : 1.1;
  const CARD_H = W - CARD_Y - 0.4;  // fill remaining

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
      x, y: CARD_Y, w: CARD_W, h: 0.07,
      fill: { color: topColor }, line: { color: topColor, width: 0 }
    });
    slide.addText(s.value || "", {
      x: x + 0.12, y: CARD_Y + 0.16, w: CARD_W - 0.24, h: 1.05,
      fontSize: 38, fontFace: FONT_DISPLAY, bold: true,
      color: numColor, margin: 0
    });
    slide.addText(s.label || "", {
      x: x + 0.12, y: CARD_Y + 1.28, w: CARD_W - 0.24, h: CARD_H - 1.7,
      fontSize: 11, fontFace: FONT_BODY, color: T.textSecondary,
      wrap: true, margin: 0, lineSpacingMultiple: 1.3, valign: "top"
    });
    slide.addText(s.source || "", {
      x: x + 0.12, y: CARD_Y + CARD_H - 0.38, w: CARD_W - 0.24, h: 0.28,
      fontSize: 9, fontFace: FONT_BODY, color: T.textTertiary, margin: 0
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
    slide.addText(spec.subtitle, {
      x: 0.28, y: 0.95, w: W - 0.56, h: 0.22,
      fontSize: 10, fontFace: FONT_BODY, color: T.textSecondary, margin: 0
    });
  }

  const findings = (spec.findings || []).slice(0, 5);
  const startY   = spec.subtitle ? 1.32 : 1.1;
  const ITEM_H   = 0.77;
  const GAP      = 0.12;

  findings.forEach((f, i) => {
    const isEven      = i % 2 === 1;
    const borderColor = isEven ? T.brandNavy : T.brandGreen;
    const iconBg      = isEven ? T.brandNavySoft : T.brandGreenSoft;
    const y           = startY + i * (ITEM_H + GAP);
    const iconName    = f.icon || null;
    const iconData    = iconName ? lucideImg(iconName, borderColor) : null;

    slide.addShape("rect", {
      x: 0.35, y, w: W - 0.7, h: ITEM_H,
      fill: { color: T.bgSecondary }, line: { color: T.divider, width: 1 }
    });
    slide.addShape("rect", {
      x: 0.35, y, w: 0.055, h: ITEM_H,
      fill: { color: borderColor }, line: { color: borderColor, width: 0 }
    });
    if (iconData) {
      // Colored icon background square
      slide.addShape("rect", {
        x: 0.44, y: y + 0.165, w: 0.38, h: 0.38,
        fill: { color: iconBg }, line: { color: iconBg, width: 0 }
      });
      // Icon image (inset slightly inside the bg)
      slide.addImage({ data: iconData, x: 0.48, y: y + 0.195, w: 0.30, h: 0.30 });
    }
    const textX = iconData ? 0.90 : 0.56;
    const textW = iconData ? W - 1.25 : W - 0.9;
    slide.addText(f.title || "", {
      x: textX, y: y + 0.08, w: textW, h: 0.3,
      fontSize: 13, fontFace: FONT_BODY, bold: true,
      color: T.textPrimary, margin: 0
    });
    slide.addText(f.desc || "", {
      x: textX, y: y + 0.40, w: textW, h: 0.34,
      fontSize: 11, fontFace: FONT_BODY, color: T.textSecondary,
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

  const cards  = (spec.cards || []).slice(0, 3);
  const n      = cards.length;
  const CARD_W = 2.85, GAP = 0.175;
  const totalW = n * CARD_W + (n - 1) * GAP;
  const startX = (W - totalW) / 2;
  const CARD_Y = 1.1, CARD_H = 3.7;

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
      x, y: CARD_Y, w: CARD_W, h: 0.07,
      fill: { color: th.top }, line: { color: th.top, width: 0 }
    });
    slide.addText(c.value || "", {
      x: x + 0.15, y: CARD_Y + 0.16, w: CARD_W - 0.3, h: 1.1,
      fontSize: 46, fontFace: FONT_DISPLAY, bold: true,
      color: th.num, margin: 0
    });
    slide.addText(c.title || "", {
      x: x + 0.15, y: CARD_Y + 1.38, w: CARD_W - 0.3, h: 0.38,
      fontSize: 13, fontFace: FONT_BODY, bold: true,
      color: T.textPrimary, margin: 0, wrap: true
    });
    slide.addText(c.desc || "", {
      x: x + 0.15, y: CARD_Y + 1.84, w: CARD_W - 0.3, h: 1.72,
      fontSize: 11, fontFace: FONT_BODY, color: T.textSecondary,
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

  const COL_W  = 4.5, GAP = 0.2;
  const startX = (W - 2 * COL_W - GAP) / 2;
  const COL_Y  = 1.1, COL_H = 3.7;

  [{ data: spec.left, x: startX, accent: T.brandGreen },
   { data: spec.right, x: startX + COL_W + GAP, accent: T.brandNavy }]
  .forEach(({ data, x, accent }) => {
    if (!data) return;

    slide.addShape("rect", {
      x, y: COL_Y, w: COL_W, h: COL_H,
      fill: { color: T.bgSecondary }, line: { color: T.divider, width: 1 }
    });
    slide.addShape("rect", {
      x, y: COL_Y, w: COL_W, h: 0.07,
      fill: { color: accent }, line: { color: accent, width: 0 }
    });
    // Icon beside column title
    const iconData = data.icon ? lucideImg(data.icon, accent) : null;
    const titleX   = iconData ? x + 0.52 : x + 0.2;
    const titleW   = iconData ? COL_W - 0.72 : COL_W - 0.4;
    if (iconData) {
      slide.addImage({ data: iconData, x: x + 0.2, y: COL_Y + 0.155, w: 0.26, h: 0.26 });
    }
    slide.addText(data.title || "", {
      x: titleX, y: COL_Y + 0.14, w: titleW, h: 0.38,
      fontSize: 14, fontFace: FONT_BODY, bold: true,
      color: T.textPrimary, margin: 0
    });

    const bullets  = (data.bullets || []).slice(0, 5);
    const richText = bullets.map((b, idx) => ({
      text: b,
      options: {
        bullet: true,
        color: T.textSecondary,
        fontSize: 11,
        fontFace: FONT_BODY,
        breakLine: idx < bullets.length - 1,
        paraSpaceAfter: 7
      }
    }));
    slide.addText(richText, {
      x: x + 0.18, y: COL_Y + 0.65, w: COL_W - 0.36, h: COL_H - 0.8,
      valign: "top", margin: [0, 6, 0, 6]
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

  const cards  = (spec.cards || []).slice(0, 3);
  const n      = cards.length;
  const CARD_W = 2.85, GAP = 0.175;
  const totalW = n * CARD_W + (n - 1) * GAP;
  const startX = (W - totalW) / 2;
  const CARD_Y = 1.1, CARD_H = 3.7;

  const THEMES = {
    green:   { iconBg: "E6F5ED", barColor: T.brandGreen,  valColor: T.brandGreen  },
    navy:    { iconBg: "E8EDF6", barColor: T.brandNavy,   valColor: T.brandNavy   },
    neutral: { iconBg: T.bgSecondary, barColor: T.textPrimary, valColor: T.textPrimary }
  };

  cards.forEach((c, i) => {
    const th     = THEMES[c.theme] || THEMES.neutral;
    const x      = startX + i * (CARD_W + GAP);
    const barY   = CARD_Y + CARD_H - 0.72;
    const pct    = Math.max(0, Math.min(100, c.pct || 0));
    const fillW  = (CARD_W - 0.3) * (pct / 100);

    slide.addShape("rect", {
      x, y: CARD_Y, w: CARD_W, h: CARD_H,
      fill: { color: T.bgSecondary }, line: { color: T.divider, width: 1 }
    });
    // Icon background square
    slide.addShape("rect", {
      x: x + 0.18, y: CARD_Y + 0.2, w: 0.42, h: 0.42,
      fill: { color: th.iconBg }, line: { color: T.divider, width: 1 }
    });
    // Icon image (if provided)
    const iconData = c.icon ? lucideImg(c.icon, th.valColor) : null;
    if (iconData) {
      slide.addImage({ data: iconData, x: x + 0.24, y: CARD_Y + 0.26, w: 0.30, h: 0.30 });
    }
    slide.addText(c.title || "", {
      x: x + 0.15, y: CARD_Y + 0.74, w: CARD_W - 0.3, h: 0.36,
      fontSize: 13, fontFace: FONT_BODY, bold: true,
      color: T.textPrimary, margin: 0
    });
    slide.addText(c.desc || "", {
      x: x + 0.15, y: CARD_Y + 1.14, w: CARD_W - 0.3, h: CARD_H - 1.98,
      fontSize: 11, fontFace: FONT_BODY, color: T.textSecondary,
      margin: 0, wrap: true, lineSpacingMultiple: 1.35, valign: "top"
    });
    // Bar track
    slide.addShape("rect", {
      x: x + 0.15, y: barY, w: CARD_W - 0.3, h: 0.06,
      fill: { color: T.divider }, line: { color: T.divider, width: 0 }
    });
    // Bar fill
    if (fillW > 0) {
      slide.addShape("rect", {
        x: x + 0.15, y: barY, w: fillW, h: 0.06,
        fill: { color: th.barColor }, line: { color: th.barColor, width: 0 }
      });
    }
    // Label + value
    slide.addText(c.label || "", {
      x: x + 0.15, y: barY + 0.1, w: CARD_W * 0.6, h: 0.26,
      fontSize: 9, fontFace: FONT_BODY, color: T.textTertiary, margin: 0
    });
    slide.addText(`~${pct}%`, {
      x: x + 0.15 + CARD_W * 0.6, y: barY + 0.1, w: CARD_W * 0.4 - 0.15, h: 0.26,
      fontSize: 10, fontFace: FONT_BODY, bold: true,
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

  const recs   = (spec.recs || []).slice(0, 4);
  const COL_W  = 4.5, GAP_X = 0.2;
  const ROW_H  = 1.72, GAP_Y = 0.15;
  const startX = (W - 2 * COL_W - GAP_X) / 2;
  const startY = 1.1;

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
      x, y, w: 0.055, h: ROW_H,
      fill: { color: accentColor }, line: { color: accentColor, width: 0 }
    });
    slide.addText(r.num || `0${i + 1}`, {
      x: x + 0.17, y: y + 0.1, w: 0.7, h: 0.48,
      fontSize: 22, fontFace: FONT_DISPLAY, bold: true,
      color: numColor, margin: 0
    });
    slide.addText(r.title || "", {
      x: x + 0.17, y: y + 0.6, w: COL_W - 0.32, h: 0.3,
      fontSize: 13, fontFace: FONT_BODY, bold: true,
      color: T.textPrimary, margin: 0
    });
    slide.addText(r.desc || "", {
      x: x + 0.17, y: y + 0.93, w: COL_W - 0.32, h: 0.68,
      fontSize: 11, fontFace: FONT_BODY, color: T.textSecondary,
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
    x: 0, y: 0, w: W, h: 0.18,
    fill: { color: T.brandGreen }, line: { color: T.brandGreen, width: 0 }
  });

  // Decorative circle
  slide.addShape("ellipse", {
    x: -1, y: 1.5, w: 5, h: 5,
    fill: { color: T.brandGreen, transparency: 92 },
    line: { color: T.brandGreen, width: 0 }
  });

  // Main message
  slide.addText(spec.title || "谢谢", {
    x: 1.5, y: 1.4, w: 7, h: 1.4,
    fontSize: 44, fontFace: FONT_DISPLAY, bold: true,
    color: T.white, align: "center", margin: 0
  });

  // Subtitle
  if (spec.subtitle) {
    slide.addText(spec.subtitle, {
      x: 1.5, y: 3.0, w: 7, h: 0.6,
      fontSize: 14, fontFace: FONT_BODY,
      color: "A8C8DC", align: "center", margin: 0
    });
  }

  // Brand line
  slide.addShape("line", {
    x: 3.8, y: 2.95, w: 2.4, h: 0,
    line: { color: T.brandGreen, width: 2 }
  });

  // Branding footer
  slide.addText("MANULIFE · SINOCHEM  中宏保险", {
    x: 0, y: H - 0.55, w: W, h: 0.3,
    fontSize: 10, fontFace: FONT_DISPLAY, bold: true,
    color: T.textTertiary, align: "center", charSpacing: 2, margin: 0
  });

  // Bottom accent bar
  slide.addShape("rect", {
    x: 0, y: H - 0.2, w: W, h: 0.2,
    fill: { color: T.brandGreen }, line: { color: T.brandGreen, width: 0 }
  });

  return slide;
}

// ════════════════════════════════════════════════════════════════════════════
// Main — assemble deck from spec
// ════════════════════════════════════════════════════════════════════════════

function buildDeck(spec) {
  const pres = new PptxGenJS();
  pres.layout  = "LAYOUT_16x9";
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
  const pres = buildDeck(spec);

  await pres.writeFile({ fileName: outputFile });
  console.log(`✓ Saved: ${path.resolve(outputFile)}`);
}

main().catch(err => {
  console.error("✗ Error:", err.message);
  process.exit(1);
});
