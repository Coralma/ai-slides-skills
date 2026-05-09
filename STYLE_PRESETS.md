# Style Presets Reference

Curated visual styles for Frontend Slides. Each preset is inspired by real design references — no generic "AI slop" aesthetics. **Abstract shapes only — no illustrations.**

**Viewport CSS:** For mandatory base styles, see [viewport-base.css](viewport-base.css). Include in every presentation.

---

## Dark Themes

### 1. Bold Signal

**Vibe:** Confident, bold, modern, high-impact

**Layout:** Colored card on dark gradient. Number top-left, navigation top-right, title bottom-left.

**Typography:**
- Display: `Archivo Black` (900)
- Body: `Space Grotesk` (400/500)

**Colors:**
```css
:root {
    --bg-primary: #1a1a1a;
    --bg-gradient: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
    --card-bg: #FF5722;
    --text-primary: #ffffff;
    --text-on-card: #1a1a1a;
}
```

**Signature Elements:**
- Bold colored card as focal point (orange, coral, or vibrant accent)
- Large section numbers (01, 02, etc.)
- Navigation breadcrumbs with active/inactive opacity states
- Grid-based layout for precise alignment

---

### 2. Electric Studio

**Vibe:** Bold, clean, professional, high contrast

**Layout:** Split panel—white top, blue bottom. Brand marks in corners.

**Typography:**
- Display: `Manrope` (800)
- Body: `Manrope` (400/500)

**Colors:**
```css
:root {
    --bg-dark: #0a0a0a;
    --bg-white: #ffffff;
    --accent-blue: #4361ee;
    --text-dark: #0a0a0a;
    --text-light: #ffffff;
}
```

**Signature Elements:**
- Two-panel vertical split
- Accent bar on panel edge
- Quote typography as hero element
- Minimal, confident spacing

---

### 3. Creative Voltage

**Vibe:** Bold, creative, energetic, retro-modern

**Layout:** Split panels—electric blue left, dark right. Script accents.

**Typography:**
- Display: `Syne` (700/800)
- Mono: `Space Mono` (400/700)

**Colors:**
```css
:root {
    --bg-primary: #0066ff;
    --bg-dark: #1a1a2e;
    --accent-neon: #d4ff00;
    --text-light: #ffffff;
}
```

**Signature Elements:**
- Electric blue + neon yellow contrast
- Halftone texture patterns
- Neon badges/callouts
- Script typography for creative flair

---

### 4. Dark Botanical

**Vibe:** Elegant, sophisticated, artistic, premium

**Layout:** Centered content on dark. Abstract soft shapes in corner.

**Typography:**
- Display: `Cormorant` (400/600) — elegant serif
- Body: `IBM Plex Sans` (300/400)

**Colors:**
```css
:root {
    --bg-primary: #0f0f0f;
    --text-primary: #e8e4df;
    --text-secondary: #9a9590;
    --accent-warm: #d4a574;
    --accent-pink: #e8b4b8;
    --accent-gold: #c9b896;
}
```

**Signature Elements:**
- Abstract soft gradient circles (blurred, overlapping)
- Warm color accents (pink, gold, terracotta)
- Thin vertical accent lines
- Italic signature typography
- **No illustrations—only abstract CSS shapes**

---

## Light Themes

### 5. Notebook Tabs

**Vibe:** Editorial, organized, elegant, tactile

**Layout:** Cream paper card on dark background. Colorful tabs on right edge.

**Typography:**
- Display: `Bodoni Moda` (400/700) — classic editorial
- Body: `DM Sans` (400/500)

**Colors:**
```css
:root {
    --bg-outer: #2d2d2d;
    --bg-page: #f8f6f1;
    --text-primary: #1a1a1a;
    --tab-1: #98d4bb; /* Mint */
    --tab-2: #c7b8ea; /* Lavender */
    --tab-3: #f4b8c5; /* Pink */
    --tab-4: #a8d8ea; /* Sky */
    --tab-5: #ffe6a7; /* Cream */
}
```

**Signature Elements:**
- Paper container with subtle shadow
- Colorful section tabs on right edge (vertical text)
- Binder hole decorations on left
- Tab text must scale with viewport: `font-size: clamp(0.5rem, 1vh, 0.7rem)`

---

### 6. Pastel Geometry

**Vibe:** Friendly, organized, modern, approachable

**Layout:** White card on pastel background. Vertical pills on right edge.

**Typography:**
- Display: `Plus Jakarta Sans` (700/800)
- Body: `Plus Jakarta Sans` (400/500)

**Colors:**
```css
:root {
    --bg-primary: #c8d9e6;
    --card-bg: #faf9f7;
    --pill-pink: #f0b4d4;
    --pill-mint: #a8d4c4;
    --pill-sage: #5a7c6a;
    --pill-lavender: #9b8dc4;
    --pill-violet: #7c6aad;
}
```

**Signature Elements:**
- Rounded card with soft shadow
- **Vertical pills on right edge** with varying heights (like tabs)
- Consistent pill width, heights: short → medium → tall → medium → short
- Download/action icon in corner

---

### 7. Split Pastel

**Vibe:** Playful, modern, friendly, creative

**Layout:** Two-color vertical split (peach left, lavender right).

**Typography:**
- Display: `Outfit` (700/800)
- Body: `Outfit` (400/500)

**Colors:**
```css
:root {
    --bg-peach: #f5e6dc;
    --bg-lavender: #e4dff0;
    --text-dark: #1a1a1a;
    --badge-mint: #c8f0d8;
    --badge-yellow: #f0f0c8;
    --badge-pink: #f0d4e0;
}
```

**Signature Elements:**
- Split background colors
- Playful badge pills with icons
- Grid pattern overlay on right panel
- Rounded CTA buttons

---

### 8. Vintage Editorial

**Vibe:** Witty, confident, editorial, personality-driven

**Layout:** Centered content on cream. Abstract geometric shapes as accent.

**Typography:**
- Display: `Fraunces` (700/900) — distinctive serif
- Body: `Work Sans` (400/500)

**Colors:**
```css
:root {
    --bg-cream: #f5f3ee;
    --text-primary: #1a1a1a;
    --text-secondary: #555;
    --accent-warm: #e8d4c0;
}
```

**Signature Elements:**
- Abstract geometric shapes (circle outline + line + dot)
- Bold bordered CTA boxes
- Witty, conversational copy style
- **No illustrations—only geometric CSS shapes**

---

## Specialty Themes

### 9. Neon Cyber

**Vibe:** Futuristic, techy, confident

**Typography:** `Clash Display` + `Satoshi` (Fontshare)

**Colors:** Deep navy (#0a0f1c), cyan accent (#00ffcc), magenta (#ff00aa)

**Signature:** Particle backgrounds, neon glow, grid patterns

---

### 10. Terminal Green

**Vibe:** Developer-focused, hacker aesthetic

**Typography:** `JetBrains Mono` (monospace only)

**Colors:** GitHub dark (#0d1117), terminal green (#39d353)

**Signature:** Scan lines, blinking cursor, code syntax styling

---

### 11. Swiss Modern

**Vibe:** Clean, precise, Bauhaus-inspired

**Typography:** `Archivo` (800) + `Nunito` (400)

**Colors:** Pure white, pure black, red accent (#ff3300)

**Signature:** Visible grid, asymmetric layouts, geometric shapes

---

### 12. Paper & Ink

**Vibe:** Editorial, literary, thoughtful

**Typography:** `Cormorant Garamond` + `Source Serif 4`

**Colors:** Warm cream (#faf9f7), charcoal (#1a1a1a), crimson accent (#c41e3a)

**Signature:** Drop caps, pull quotes, elegant horizontal rules

---

## Custom Brand Themes

### 13. Sinochem Signature

**Vibe:** Trustworthy, clean, institutional, corporate-grade (financial/insurance aesthetic)

**Layout:** Pure white canvas locked to **16:9 aspect ratio (letterbox)** — slides NEVER stretch to fit arbitrary browser sizes. Generous whitespace. Logo watermark bottom-left, page index bottom-right, brand-green accent rule beneath every heading. Strict two-column or single-column layouts — never decorative splits.

**Canvas & Title Rules (NON-NEGOTIABLE for this preset, override viewport-base.css):**
- Slide canvas is **locked to 16:9** via a `.deck` container. The deck uses `width: min(100vw, calc(100vh * 16 / 9))` + `height: min(100vh, calc(100vw * 9 / 16))`. The letterbox area (outside the 16:9 deck) uses a **white** `body` background (`#ffffff`).
- Every `.slide` uses `width: 100%; height: 100%; aspect-ratio: 16/9;` relative to `.deck` — never `100vw/100vh`.
- The deck declares `container-type: size; container-name: deck;` so inner sizes use **`cqw` / `cqh`** (container query units) instead of `vw` / `vh`. This guarantees preview fidelity regardless of browser aspect ratio AND guarantees PPTX export fidelity (Playwright opens at 1920×1080 → deck fills viewport → `cqw`/`cqh` == `vw`/`vh` → pixel-perfect `_px2emu` mapping in `scripts/export-pptx.py`).
- **Title is ALWAYS at the top** of every slide: put eyebrow / `<h1>` / accent-rule / subtitle inside `.slide-header` (grid row 1, `flex-direction: column; align-items: flex-start;` — no vertical centering). `.slide-body` uses `justify-content: flex-start;` so content flows top-down.

**Typography:**
- Display: `Noto Sans SC` (700) + `Manrope` (700/800) for English fallback
- Body: `Noto Sans SC` (400/500) + `Manrope` (400/500)
- Numbers/Stats: `Manrope` (800) — always in brand green or navy

**Colors (locked to the official Manulife-Sinochem palette — green + navy on white):**
```css
:root {
    /* Surfaces — pure white canvas, near-white tint for blocks */
    --bg-primary:          #ffffff;
    --bg-secondary:        #f7faf8;       /* Near-white tint for content blocks */
    --bg-tertiary:         #fbfcfb;       /* Even softer tint for nested cards */

    /* Primary brand — Sinochem green */
    --brand-green:         #00A758;       /* Primary brand color */
    --brand-green-dark:    #007a3e;       /* Hover / pressed / heading-on-soft */
    --brand-green-soft:    #e6f5ed;       /* Callout / tag backgrounds */
    --brand-green-ultra:   rgba(0,167,88,0.06);  /* Glow / highlight bg */

    /* Auxiliary brand — Manulife deep navy */
    --accent-navy:         #024097;       /* Secondary brand color */
    --accent-navy-dark:    #02306f;       /* Pressed / dark surface */
    --accent-navy-soft:    #e8edf6;       /* Cool callout / chart bg */
    --accent-navy-ultra:   rgba(2,64,151,0.06); /* Glow / highlight bg */

    /* Brand gradient — green → navy. Use ONLY for hero focal points */
    --brand-gradient:      linear-gradient(135deg, #00A758 0%, #024097 100%);
    --brand-gradient-soft: linear-gradient(135deg, #e6f5ed 0%, #e8edf6 100%);

    /* Type & dividers */
    --text-primary:        #0f1a13;
    --text-secondary:      #5a6b60;
    --text-tertiary:       #8a9b90;
    --divider:             #e5ebe7;
    --divider-cool:        #dde3ec;       /* paired with navy surfaces */
}
```

**Signature Elements:**
- **Twin-bar accent rule** beneath every heading — the visual signature of this preset. A short bold green bar joined to a thinner navy continuation, expressing the green/navy duality:
  ```html
  <div class="brand-rule" aria-hidden="true"></div>
  ```
  ```css
  .brand-rule {
    display: inline-flex; align-items: center; gap: clamp(3px, 0.4cqw, 6px);
  }
  .brand-rule::before {
    content: ''; display: block;
    width: clamp(36px, 4cqw, 60px); height: 3px;
    background: var(--brand-green); border-radius: 2px;
  }
  .brand-rule::after {
    content: ''; display: block;
    width: clamp(14px, 1.6cqw, 24px); height: 3px;
    background: var(--accent-navy); border-radius: 2px; opacity: 0.85;
  }
  ```
  (Backwards-compatible single-bar fallback: a plain `width: clamp(36px, 4cqw, 60px); height: 3px; background: var(--brand-green);` div still works.)
- **Hero gradient text** — on cover/closing titles, wrap the focal phrase in `<em>` and apply `background: var(--brand-gradient); -webkit-background-clip: text; background-clip: text; color: transparent;` so the emphasized word reads as a green→navy diagonal gradient. Reserve for the cover word and closing CTA only — never body text.
- **Logo watermark with company name** at bottom-left of every slide — **MUST embed as base64 data URI** (do NOT use relative file paths). Use a flex container wrapping the logo image and company name text, positioned at the bottom-left corner with `position: absolute; left: var(--slide-padding); bottom: var(--slide-padding);`. Use this exact HTML with the complete base64 data below:
  ```html
<div style="display: flex; align-items: center; gap: 8px;">
  <img src="data:image/png;base64,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" alt="中宏保险" style="max-height: clamp(28px, 4vh, 44px); width: auto;" />
  <b class="company-name" style="display: inline-block; vertical-align: middle;">
    <span style="display: block; font-size: 18px; color: #00A758; font-weight: bold; letter-spacing: 2px;">中宏保险</span>
    <span style="display: block; font-size: 8px; color: #00A758; font-weight: normal;">MANULIFE-SINOCHEM</span>
  </b>
</div>
  ```
  The above contains the complete inline logo with company name (PNG format, 76×88px, optimized for embedding). Copy the entire block as-is into generated HTML. The flex container ensures the logo and "中宏保险" text are vertically centered. Do NOT attempt to read from any external file.
- **Page index** at bottom-right in small Manrope mono-spaced digits: `01 / 12` with a 1px tall divider that itself uses `var(--brand-gradient)` (green→navy) for a tiny brand cue
- **Stat emphasis**: large numbers alternate between `--brand-green` and `--accent-navy` across a row (e.g., card 1 green, card 2 navy, card 3 green) — body text stays dark. Optional accent dot above the number using the brand color of that card
- **Dual-tone callout pills**: green pills use `--brand-green-soft` bg + `--brand-green-dark` text; navy pills use `--accent-navy-soft` bg + `--accent-navy-dark` text. Pair them when contrasting two ideas
- **Highlight boxes** come in two flavors: green (`border-left: 3px solid var(--brand-green); background: var(--brand-green-ultra);`) and navy (`border-left: 3px solid var(--accent-navy); background: var(--accent-navy-ultra);`). Use navy for data/regulatory callouts, green for customer/product callouts
- **Subtle corner glow** ONLY on cover and closing slides: two large soft radial gradients using `--brand-green-ultra` (top-left, ~40cqw) and `--accent-navy-ultra` (bottom-right, ~40cqw), `pointer-events: none; z-index: 0;`. Adds depth without busyness — content sits at `z-index: 1`
- **Hairline dividers** at `1px solid var(--divider)` — no heavy borders, no drop shadows on content cards
- **Entrance animation**: subtle 0.45s fade-up (translateY 14px) with `cubic-bezier(0.16, 1, 0.3, 1)` — NEVER bouncy or playful
- **Reserve gradients** for: (a) the twin-bar accent rule emphasis, (b) hero `<em>` text on cover/closing, (c) corner glows on cover/closing, (d) the page-index divider. Do NOT apply gradients to body cards, buttons, or interior content — restraint is what makes the hero moments land
- **No glassmorphism**, **no realistic illustrations**, **no decorative shapes inside content slides** — corporate-grade trust is built on consistent restraint

**Required Font Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
```

**Required Canvas CSS (copy verbatim — overrides viewport-base.css for this preset):**
```css
/* 16:9 letterbox canvas. Slides do NOT auto-fit browser; they stay 16:9
   so HTML→PPTX export (export-pptx.py runs at 1920×1080) never distorts. */
html, body {
  height: 100%; margin: 0; overflow: hidden;
  background: #ffffff;                /* letterbox bars — white */
  font-family: var(--font-body);
  color: var(--text-primary);
}
body { display: flex; align-items: center; justify-content: center; }

/* .deck-shell: 16:9 positioning anchor — nav-dots and any overlays sit
   position:absolute INSIDE this element, never leaking into the letterbox. */
.deck-shell {
  position: relative;
  width:  min(100vw, calc(100vh * 16 / 9));
  height: min(100vh, calc(100vw * 9 / 16));
  container-type: size;               /* enables cqw / cqh for all descendants */
  container-name: deck;
}

/* .deck: scrollable slide canvas, 100% of .deck-shell */
.deck {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;                 /* prevent inner vw-sized elements from bleeding out */
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  background: var(--bg-primary);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.08);  /* subtle border visible on white bg */
}

.slide {
  width: 100%;
  height: 100%;                       /* = 100cqh = 16:9 */
  aspect-ratio: 16 / 9;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr auto;  /* header(title) / body / footer */
  row-gap: clamp(1rem, 2cqw, 2rem);
  padding: clamp(2rem, 5cqw, 5rem);
  padding-bottom: calc(clamp(2rem, 5cqw, 5rem) + clamp(40px, 6cqh, 68px));
  position: relative;
  background: var(--bg-primary);
  scroll-snap-align: start;
}

/* TITLE ALWAYS AT THE TOP — no vertical centering ever */
.slide-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(0.5rem, 1cqw, 1rem);
}
.slide-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;        /* top-down, never centered */
  gap: clamp(1rem, 2cqw, 1.75rem);
  overflow: hidden;
}
/* Override viewport-base.css — all sizing inside the 16:9 canvas MUST use cqw/cqh */
.card, .container, .content-box {
  max-width: min(90cqw, 1000px);
  max-height: min(80cqh, 700px);
}
img, .image-container {
  max-width: 100%;
  max-height: min(50cqh, 400px);
}

/* NAV DOTS — position:absolute inside .deck-shell, NEVER position:fixed.
   position:fixed is relative to the browser viewport; when the browser is
   wider than 16:9 the dots land in the white letterbox outside the slide.
   position:absolute inside .deck-shell keeps them within the 16:9 canvas. */
.nav-dots {
  position: absolute;
  right: clamp(6px, 1.2cqw, 14px);
  top: 50%; transform: translateY(-50%);
  display: flex; flex-direction: column;
  gap: clamp(5px, 0.9cqh, 9px);
  z-index: 999;
  pointer-events: auto;
}
```

**Required HTML structure — nav-dots and progress bars go inside `.deck-shell`, not `<body>`:**
```html
<body>
  <div class="deck-shell">          <!-- 16:9 size anchor + container-type -->
    <div class="deck" id="deck">   <!-- scrollable canvas -->
      <section class="slide">…</section>
      <!-- more slides -->
    </div>
    <!-- nav-dots INSIDE .deck-shell so position:absolute keeps them within 16:9 -->
    <nav class="nav-dots" id="navDots" aria-label="幻灯片导航"></nav>
  </div>
</body>
```

**Inside slides, ALWAYS use `cqw`/`cqh` instead of `vw`/`vh`.** When the browser is wider than 16:9, `vw > cqw`, so any `vw`-sized element overflows the 16:9 deck and gets clipped. Before generating or editing, audit every `clamp()`, `min()`, `max()`, and standalone length that uses `vw`/`vh` and replace with the `cqw`/`cqh` equivalent. Pattern: `clamp(0.85rem, 1.2cqw, 1.05rem)`. The only exceptions are `.deck-shell` itself (which correctly uses `vw`/`vh` to size against the browser) and `.deck` (100% of shell).

**When to use this preset:**
- 中宏保险内部分享、客户路演、合规培训
- 任何以"专业 / 值得信赖 / 稳健"为主旋律的品牌演示
- 需要中英文混排的企业级场景

**When NOT to use:**
- 产品创意发布（不够张扬）
- 面向消费者的营销内容（不够亲和）
- 技术黑客马拉松风格（不够极客）

---

## Font Pairing Quick Reference

| Preset | Display Font | Body Font | Source |
|--------|--------------|-----------|--------|
| Bold Signal | Archivo Black | Space Grotesk | Google |
| Electric Studio | Manrope | Manrope | Google |
| Creative Voltage | Syne | Space Mono | Google |
| Dark Botanical | Cormorant | IBM Plex Sans | Google |
| Notebook Tabs | Bodoni Moda | DM Sans | Google |
| Pastel Geometry | Plus Jakarta Sans | Plus Jakarta Sans | Google |
| Split Pastel | Outfit | Outfit | Google |
| Vintage Editorial | Fraunces | Work Sans | Google |
| Neon Cyber | Clash Display | Satoshi | Fontshare |
| Terminal Green | JetBrains Mono | JetBrains Mono | JetBrains |
| Sinochem Signature | Noto Sans SC + Manrope | Noto Sans SC + Manrope | Google |

---

## DO NOT USE (Generic AI Patterns)

**Fonts:** Inter, Roboto, Arial, system fonts as display

**Colors:** `#6366f1` (generic indigo), purple gradients on white

**Layouts:** Everything centered, generic hero sections, identical card grids

**Decorations:** Realistic illustrations, gratuitous glassmorphism, drop shadows without purpose

---

## CSS Gotchas

### Negating CSS Functions

**WRONG — silently ignored by browsers (no console error):**
```css
right: -clamp(28px, 3.5vw, 44px);   /* Browser ignores this */
margin-left: -min(10vw, 100px);      /* Browser ignores this */
```

**CORRECT — wrap in `calc()`:**
```css
right: calc(-1 * clamp(28px, 3.5vw, 44px));  /* Works */
margin-left: calc(-1 * min(10vw, 100px));     /* Works */
```

CSS does not allow a leading `-` before function names. The browser silently discards the entire declaration — no error, the element just appears in the wrong position. **Always use `calc(-1 * ...)` to negate CSS function values.**

