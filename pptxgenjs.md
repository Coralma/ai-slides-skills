# PptxGenJS Tutorial

## Setup & Basic Structure

```javascript
const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';  // or 'LAYOUT_16x10', 'LAYOUT_4x3', 'LAYOUT_WIDE'
pres.author = 'Your Name';
pres.title = 'Presentation Title';

let slide = pres.addSlide();
slide.addText("Hello World!", { x: 0.5, y: 0.5, fontSize: 36, color: "363636" });

pres.writeFile({ fileName: "Presentation.pptx" });
```

## Layout Dimensions

Slide dimensions (coordinates in inches):
- `LAYOUT_16x9`: 10" × 5.625" (default)
- `LAYOUT_16x10`: 10" × 6.25"
- `LAYOUT_4x3`: 10" × 7.5"
- `LAYOUT_WIDE`: 13.33" × 7.5" for the 中宏PPT模版 canvas

---

## 中宏PPT模版 Generation Rules

For Manulife-Sinochem decks, always generate a native PPTX from JSON via:

```bash
bash scripts/build-with-template.sh <spec.json> <output.pptx>
```

This pipeline uses `generate-pptx.js` for editable content slides, then `apply-template.py` merges the result into `中宏PPT模版.pptx`.

### Canvas & Safe Zones

Use `pres.layout = "LAYOUT_WIDE"` and design on a 13.33" × 7.50" canvas.

Template-derived constants:

| Constant | Value | Meaning |
|---|---:|---|
| `W` | `13.33` | slide width |
| `H` | `7.50` | slide height |
| `MX` | `0.51` | left/right content margin |
| `TY` | `0.52` | title placeholder top |
| `TH` | `0.87` | title placeholder height |
| `CY` | `1.65` | content area top |
| `CEND` | `6.50` | content area bottom, above template logo |
| `CW` | `12.31` | usable content width |
| `CH` | `4.85` | usable content height |

Title placeholders on standard content pages are at `x=0.51`, `y=0.52`, `w=12.33`, `h=0.87`. Do not place content below `y=6.50`; the template logo/footer occupies the lower band.

### Template Page Library

The company template has 12 pages. Use these as the visual vocabulary for JSON spec design and PptxGenJS layout decisions.

| Page | Layout / archetype | Template geometry | Current spec mapping |
|---:|---|---|---|
| 1 | `Title slide with subtitle` cover | Placeholders: title `idx=0`, subtitle/author `idx=1`, date `idx=10` | `title`; filled by `apply-template.py` |
| 2 | `Chapter` section title | Title placeholder `x=0.48`, `y=2.49`, `w=11.15`, `h=1.94` | `divider`; final PPTX uses this page |
| 3 | two-point split | Two blocks: left `x=1.43`, right `x=7.33`, `w≈4.56`; numbered circles around `y=2.07`; center rule at `x=6.66` | `two-col-list` / `two-col` |
| 4 | two stacked sections | Number boxes at `x=1.34`; text bands at `x=2.32`, `w=9.84`; rows start near `y=1.68` and `y=4.38` | `findings` with 2 items or `content` with 2 sections |
| 5 | left image + three right points | Image `x=0.38`, `y=2.05`, `w=4.10`, `h=4.10`; right items start at `x=5.00` | `learn-grid` / `findings` with 3 items; add images only when assets exist |
| 6 | three numbered rows | Number boxes at `x≈1.42`; text bands at `x=2.40`, `w=9.84`; row tops `1.67`, `3.42`, `5.17` | `findings` with 3 items |
| 7 | central visual + three callouts | Visual/rings on left `x≈0.76`; callout labels around `x=4.30`; descriptions at `x≈6.58` | `callout-grid` / `learn-grid` with 3 cards |
| 8 | four quadrant cards | Cards at `x=0.75/6.96`, `y=1.24/4.03`, `w=5.61`, `h=2.39` | `rec-grid` with 4 items |
| 9 | five-step horizontal process | Step circles along `y≈2.4–3.5`; five text columns `w≈2.05`; connectors between steps | `content` with 5 numbered bullets; split if verbose |
| 10 | six-step path | Six circles along `y=3.80`; top cards at steps 1/3/5, bottom cards at 2/4/6 | `content` with 6 short bullets or multiple `findings` slides |
| 11 | horizontal timeline | Main line at `y=4.38`; milestone text alternates above/below line | `chart` for numeric trend, otherwise `content` with dated milestones |
| 12 | `Closing slide` | Visuals are in the closing layout | `closing`; final PPTX keeps template closing |

### Spec Type Selection

When writing `spec.json`, choose the closest template archetype first:

| Content need | Preferred supported type | Template page reference |
|---|---|---|
| Cover | `title` | page 1 |
| Section divider | `divider` | page 2 |
| Two options / contrast | `two-col-list` or `two-col` | page 3 |
| 2–3 findings | `findings` | pages 4 / 6 |
| Image plus 3 points | `learn-grid` or `findings` | page 5 |
| Three strategic callouts | `callout-grid` or `learn-grid` | page 7 |
| Four recommendations / modules | `rec-grid` | page 8 |
| Five or six sequential steps | `content` with numbered bullets, or split | pages 9 / 10 |
| Dated roadmap / trend | `chart` if numeric, otherwise `content` | page 11 |
| Closing | `closing` | page 12 |

Extra spec fields are ignored by `generate-pptx.js`, so do not invent unsupported `type` values unless the generator has been updated. Use existing supported types and keep the layout close to the template page library.

---

## Text & Formatting

```javascript
// Basic text
slide.addText("Simple Text", {
  x: 1, y: 1, w: 8, h: 2, fontSize: 24, fontFace: "Arial",
  color: "363636", bold: true, align: "center", valign: "middle"
});

// Character spacing (use charSpacing, not letterSpacing which is silently ignored)
slide.addText("SPACED TEXT", { x: 1, y: 1, w: 8, h: 1, charSpacing: 6 });

// Rich text arrays
slide.addText([
  { text: "Bold ", options: { bold: true } },
  { text: "Italic ", options: { italic: true } }
], { x: 1, y: 3, w: 8, h: 1 });

// Multi-line text (requires breakLine: true)
slide.addText([
  { text: "Line 1", options: { breakLine: true } },
  { text: "Line 2", options: { breakLine: true } },
  { text: "Line 3" }  // Last item doesn't need breakLine
], { x: 0.5, y: 0.5, w: 8, h: 2 });

// Text box margin (internal padding)
slide.addText("Title", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  margin: 0  // Use 0 when aligning text with other elements like shapes or icons
});
```

**Tip:** Text boxes have internal margin by default. Set `margin: 0` when you need text to align precisely with shapes, lines, or icons at the same x-position.

---

## Lists & Bullets

```javascript
// ✅ CORRECT: Multiple bullets
slide.addText([
  { text: "First item", options: { bullet: true, breakLine: true } },
  { text: "Second item", options: { bullet: true, breakLine: true } },
  { text: "Third item", options: { bullet: true } }
], { x: 0.5, y: 0.5, w: 8, h: 3 });

// ❌ WRONG: Never use unicode bullets
slide.addText("• First item", { ... });  // Creates double bullets

// Sub-items and numbered lists
{ text: "Sub-item", options: { bullet: true, indentLevel: 1 } }
{ text: "First", options: { bullet: { type: "number" }, breakLine: true } }
```

---

## Shapes

```javascript
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 0.8, w: 1.5, h: 3.0,
  fill: { color: "FF0000" }, line: { color: "000000", width: 2 }
});

slide.addShape(pres.shapes.OVAL, { x: 4, y: 1, w: 2, h: 2, fill: { color: "0000FF" } });

slide.addShape(pres.shapes.LINE, {
  x: 1, y: 3, w: 5, h: 0, line: { color: "FF0000", width: 3, dashType: "dash" }
});

// With transparency
slide.addShape(pres.shapes.RECTANGLE, {
  x: 1, y: 1, w: 3, h: 2,
  fill: { color: "0088CC", transparency: 50 }
});

// Rounded rectangle (rectRadius only works with ROUNDED_RECTANGLE, not RECTANGLE)
// ⚠️ Don't pair with rectangular accent overlays — they won't cover rounded corners. Use RECTANGLE instead.
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 1, y: 1, w: 3, h: 2,
  fill: { color: "FFFFFF" }, rectRadius: 0.1
});

// With shadow
slide.addShape(pres.shapes.RECTANGLE, {
  x: 1, y: 1, w: 3, h: 2,
  fill: { color: "FFFFFF" },
  shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.15 }
});
```

Shadow options:

| Property | Type | Range | Notes |
|----------|------|-------|-------|
| `type` | string | `"outer"`, `"inner"` | |
| `color` | string | 6-char hex (e.g. `"000000"`) | No `#` prefix, no 8-char hex — see Common Pitfalls |
| `blur` | number | 0-100 pt | |
| `offset` | number | 0-200 pt | **Must be non-negative** — negative values corrupt the file |
| `angle` | number | 0-359 degrees | Direction the shadow falls (135 = bottom-right, 270 = upward) |
| `opacity` | number | 0.0-1.0 | Use this for transparency, never encode in color string |

To cast a shadow upward (e.g. on a footer bar), use `angle: 270` with a positive offset — do **not** use a negative offset.

**Note**: Gradient fills are not natively supported. Use a gradient image as a background instead.

---

## Images

### Image Sources

```javascript
// From file path
slide.addImage({ path: "images/chart.png", x: 1, y: 1, w: 5, h: 3 });

// From URL
slide.addImage({ path: "https://example.com/image.jpg", x: 1, y: 1, w: 5, h: 3 });

// From base64 (faster, no file I/O)
slide.addImage({ data: "image/png;base64,iVBORw0KGgo...", x: 1, y: 1, w: 5, h: 3 });
```

### Image Options

```javascript
slide.addImage({
  path: "image.png",
  x: 1, y: 1, w: 5, h: 3,
  rotate: 45,              // 0-359 degrees
  rounding: true,          // Circular crop
  transparency: 50,        // 0-100
  flipH: true,             // Horizontal flip
  flipV: false,            // Vertical flip
  altText: "Description",  // Accessibility
  hyperlink: { url: "https://example.com" }
});
```

### Image Sizing Modes

```javascript
// Contain - fit inside, preserve ratio
{ sizing: { type: 'contain', w: 4, h: 3 } }

// Cover - fill area, preserve ratio (may crop)
{ sizing: { type: 'cover', w: 4, h: 3 } }

// Crop - cut specific portion
{ sizing: { type: 'crop', x: 0.5, y: 0.5, w: 2, h: 2 } }
```

### Calculate Dimensions (preserve aspect ratio)

```javascript
const origWidth = 1978, origHeight = 923, maxHeight = 3.0;
const calcWidth = maxHeight * (origWidth / origHeight);
const centerX = (10 - calcWidth) / 2;

slide.addImage({ path: "image.png", x: centerX, y: 1.2, w: calcWidth, h: maxHeight });
```

### Supported Formats

- **Standard**: PNG, JPG, GIF (animated GIFs work in Microsoft 365)
- **SVG**: Works in modern PowerPoint/Microsoft 365

---

## Icons

For 中宏 PPTX generation, use Tabler Icons (MIT) from `@tabler/icons`. Convert SVGs to PNG with `sharp` before calling `slide.addImage()`; embedding SVG data URIs directly is not reliable in PowerPoint/WPS.

### Setup

```javascript
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const TABLER_DIR = "/opt/homebrew/lib/node_modules/@tabler/icons/icons/outline";
const TABLER_MAP = {
  brain: "brain",
  cpu: "cpu",
  "shield-check": "shield-check",
  "bar-chart-2": "chart-bar",
  shield: "shield",
  zap: "bolt",
  users: "users",
  monitor: "device-desktop",
  briefcase: "briefcase",
  globe: "world",
  calendar: "calendar",
  "arrow-right": "arrow-right",
};

async function tablerIconToPng(iconName, colorHex = "FFFFFF", size = 64) {
  const file = path.join(TABLER_DIR, `${TABLER_MAP[iconName] || iconName}.svg`);
  let svg = fs.readFileSync(file, "utf8");
  svg = svg.replace(/currentColor/g, `#${colorHex}`);
  const pngBuffer = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  return "data:image/png;base64," + pngBuffer.toString("base64");
}
```

### Add Icon to Slide

```javascript
const iconData = await tablerIconToPng("shield-check", "FFFFFF", 64);

slide.addImage({
  data: iconData,
  x: 1, y: 1, w: 0.5, h: 0.5  // Size in inches
});
```

**Note**: Use white icons on solid 中宏 green/navy accent squares for stronger contrast and a closer match to the template's flat visual style. The raster size controls image quality; the displayed size is set by `w` and `h` in inches.

### Icon Libraries

Install: `npm install -g @tabler/icons sharp`

Supported icon keys in `generate-pptx.js`:
- `brain`, `cpu`, `shield-check`, `bar-chart-2`
- `shield`, `zap`, `users`, `monitor`
- `briefcase`, `globe`, `calendar`, `arrow-right`

---

## Slide Backgrounds

```javascript
// Solid color
slide.background = { color: "F1F1F1" };

// Color with transparency
slide.background = { color: "FF3399", transparency: 50 };

// Image from URL
slide.background = { path: "https://example.com/bg.jpg" };

// Image from base64
slide.background = { data: "image/png;base64,iVBORw0KGgo..." };
```

---

## Tables

```javascript
slide.addTable([
  ["Header 1", "Header 2"],
  ["Cell 1", "Cell 2"]
], {
  x: 1, y: 1, w: 8, h: 2,
  border: { pt: 1, color: "999999" }, fill: { color: "F1F1F1" }
});

// Advanced with merged cells
let tableData = [
  [{ text: "Header", options: { fill: { color: "6699CC" }, color: "FFFFFF", bold: true } }, "Cell"],
  [{ text: "Merged", options: { colspan: 2 } }]
];
slide.addTable(tableData, { x: 1, y: 3.5, w: 8, colW: [4, 4] });
```

---

## Charts

```javascript
// Bar chart
slide.addChart(pres.charts.BAR, [{
  name: "Sales", labels: ["Q1", "Q2", "Q3", "Q4"], values: [4500, 5500, 6200, 7100]
}], {
  x: 0.5, y: 0.6, w: 6, h: 3, barDir: 'col',
  showTitle: true, title: 'Quarterly Sales'
});

// Line chart
slide.addChart(pres.charts.LINE, [{
  name: "Temp", labels: ["Jan", "Feb", "Mar"], values: [32, 35, 42]
}], { x: 0.5, y: 4, w: 6, h: 3, lineSize: 3, lineSmooth: true });

// Pie chart
slide.addChart(pres.charts.PIE, [{
  name: "Share", labels: ["A", "B", "Other"], values: [35, 45, 20]
}], { x: 7, y: 1, w: 5, h: 4, showPercent: true });
```

### Better-Looking Charts

Default charts look dated. Apply these options for a modern, clean appearance:

```javascript
slide.addChart(pres.charts.BAR, chartData, {
  x: 0.5, y: 1, w: 9, h: 4, barDir: "col",

  // Custom colors (match your presentation palette)
  chartColors: ["0D9488", "14B8A6", "5EEAD4"],

  // Clean background
  chartArea: { fill: { color: "FFFFFF" }, roundedCorners: true },

  // Muted axis labels
  catAxisLabelColor: "64748B",
  valAxisLabelColor: "64748B",

  // Subtle grid (value axis only)
  valGridLine: { color: "E2E8F0", size: 0.5 },
  catGridLine: { style: "none" },

  // Data labels on bars
  showValue: true,
  dataLabelPosition: "outEnd",
  dataLabelColor: "1E293B",

  // Hide legend for single series
  showLegend: false,
});
```

**Key styling options:**
- `chartColors: [...]` - hex colors for series/segments
- `chartArea: { fill, border, roundedCorners }` - chart background
- `catGridLine/valGridLine: { color, style, size }` - grid lines (`style: "none"` to hide)
- `lineSmooth: true` - curved lines (line charts)
- `legendPos: "r"` - legend position: "b", "t", "l", "r", "tr"

---

## Slide Masters

```javascript
pres.defineSlideMaster({
  title: 'TITLE_SLIDE', background: { color: '283A5E' },
  objects: [{
    placeholder: { options: { name: 'title', type: 'title', x: 1, y: 2, w: 8, h: 2 } }
  }]
});

let titleSlide = pres.addSlide({ masterName: "TITLE_SLIDE" });
titleSlide.addText("My Title", { placeholder: "title" });
```

---

## Common Pitfalls

⚠️ These issues cause file corruption, visual bugs, or broken output. Avoid them.

1. **NEVER use "#" with hex colors** - causes file corruption
   ```javascript
   color: "FF0000"      // ✅ CORRECT
   color: "#FF0000"     // ❌ WRONG
   ```

2. **NEVER encode opacity in hex color strings** - 8-char colors (e.g., `"00000020"`) corrupt the file. Use the `opacity` property instead.
   ```javascript
   shadow: { type: "outer", blur: 6, offset: 2, color: "00000020" }          // ❌ CORRUPTS FILE
   shadow: { type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.12 }  // ✅ CORRECT
   ```

3. **Use `bullet: true`** - NEVER unicode symbols like "•" (creates double bullets)

4. **Use `breakLine: true`** between array items or text runs together

5. **Avoid `lineSpacing` with bullets** - causes excessive gaps; use `paraSpaceAfter` instead

6. **Each presentation needs fresh instance** - don't reuse `pptxgen()` objects

7. **NEVER reuse option objects across calls** - PptxGenJS mutates objects in-place (e.g. converting shadow values to EMU). Sharing one object between multiple calls corrupts the second shape.
   ```javascript
   const shadow = { type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.15 };
   slide.addShape(pres.shapes.RECTANGLE, { shadow, ... });  // ❌ second call gets already-converted values
   slide.addShape(pres.shapes.RECTANGLE, { shadow, ... });

   const makeShadow = () => ({ type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.15 });
   slide.addShape(pres.shapes.RECTANGLE, { shadow: makeShadow(), ... });  // ✅ fresh object each time
   slide.addShape(pres.shapes.RECTANGLE, { shadow: makeShadow(), ... });
   ```

8. **Don't use `ROUNDED_RECTANGLE` with accent borders** - rectangular overlay bars won't cover rounded corners. Use `RECTANGLE` instead.
   ```javascript
   // ❌ WRONG: Accent bar doesn't cover rounded corners
   slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1, y: 1, w: 3, h: 1.5, fill: { color: "FFFFFF" } });
   slide.addShape(pres.shapes.RECTANGLE, { x: 1, y: 1, w: 0.08, h: 1.5, fill: { color: "0891B2" } });

   // ✅ CORRECT: Use RECTANGLE for clean alignment
   slide.addShape(pres.shapes.RECTANGLE, { x: 1, y: 1, w: 3, h: 1.5, fill: { color: "FFFFFF" } });
   slide.addShape(pres.shapes.RECTANGLE, { x: 1, y: 1, w: 0.08, h: 1.5, fill: { color: "0891B2" } });
   ```

---

## Quick Reference

- **Shapes**: RECTANGLE, OVAL, LINE, ROUNDED_RECTANGLE
- **Charts**: BAR, LINE, PIE, DOUGHNUT, SCATTER, BUBBLE, RADAR
- **Layouts**: LAYOUT_16x9 (10"×5.625"), LAYOUT_16x10, LAYOUT_4x3, LAYOUT_WIDE
- **Alignment**: "left", "center", "right"
- **Chart data labels**: "outEnd", "inEnd", "center"
