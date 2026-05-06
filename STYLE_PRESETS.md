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

**Layout:** Pure white canvas with generous whitespace. Logo watermark top-left, page index bottom-right, brand-green accent rule beneath every heading. Strict two-column or single-column layouts — never decorative splits.

**Typography:**
- Display: `Noto Sans SC` (700) + `Manrope` (700/800) for English fallback
- Body: `Noto Sans SC` (400/500) + `Manrope` (400/500)
- Numbers/Stats: `Manrope` (800) — always in brand green or navy

**Colors:**
```css
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f7f9f8;      /* Near-white tint for content blocks */
    --brand-green: #00A758;       /* Primary brand color */
    --brand-green-dark: #007a3e;  /* Hover / pressed states */
    --brand-green-soft: #e6f5ed;  /* Callout / tag backgrounds */
    --accent-navy: #1e3a5f;       /* Secondary accent from logo "30" */
    --text-primary: #0f1a13;
    --text-secondary: #5a6b60;
    --divider: #e5ebe7;
}
```

**Signature Elements:**
- **Brand accent rule** beneath every heading: 48px green bar (`width: clamp(40px, 4vw, 64px); height: 3px; background: var(--brand-green);`)
- **Logo watermark** at top-left of every slide (`max-height: clamp(28px, 4vh, 44px)`) — **MUST embed as base64 data URI** (do NOT use relative file paths). Use this exact img tag with the complete base64 data below:
  ```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXYAAAGsCAIAAABGmRt7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAgAElEQVR4nO3deWBU5b3/8ffMyWQnYcnCFlZZZamyqSCLirYuVWvVX63W6u+2Xndr64ooirhXtC71uvRWW70q2mq9dWtRQFlEAQVZRZawBwiQBRImk7l/nIBJm4Qs85xnls/rz2Qyz5eCJ++eOec8vnA4jIiIGX7bA4hIPNMhRkQM0iFGRAxKsj2AxL/Sqkpg5p7VwDm5Q2yPY9y6A7uA7ZUlwAlte9kex7iPitcA/TLygS4p2f/yXVWMiBikihGDykKVQNbc+4BL8wbGfcVsOFAM9J41Gfjj0MvivmJmFX8DTJwzBVh16mP1vkYVIyIGqWLECLdf2nx6HxAo+hIgb6DtoQxy+6XnrElAoGyr7XGMc/vl5Dl3AU6wvJFXqmJExCBVjESY2y/Zc2v1S1zbWLEb6DlrcoL0y+zitU3sF5cqRkQMUsVIxBzql/sBZ0ei9EuPj91+2WJ7HOPcfjmpyf3iUsWIiEGqGImAuv2yxPY4xiVav8zZU7tfypr1s6oYETFIFSOtsj90EMie+0BC9UuvWYnVLxNmt6RfXKoYETFIFSMt5PZLm5rzL4ttj2NcYcWew/3ilMZ/v3yy59tW9otLFSMiBqlipNncfsmYdz8QSJh+6TnrjgTpl7l71gFj59wJBFrRLy5VjIgYpIqRZjjULw8Age3x3y+bKvbW6pfNtscxzu2XMXMmA4GDre0XlypGRAxSxUiT1O2XRbbHMc7tlx6zJqlfWkkVIyIGqWLkCA6EgkDW/ETrl0Q5/zJvr9svd0a8X1yqGBExSBUjDXL7pc38+wH/tvjvl82Ve4Fus+8AAqWbbI9jnNsvo2e7/VJqaBVVjIgYpIqRehzqlwcSql8KZt0BBEriv1/m713vQb+4VDEiYpAqRuo41C8PAv5tX9gex7hD/TI5ofrlhNl3edAvLlWMiBikipEadfvlc9vjGLelcl+tfim0PY5xC/ZuqNUv+zxbVxUjIgapYoSK6iCQvuBBIJAw/dK15vOjROmX42s+P/KuX1yqGBExSBWT0Nx+SZv/IBDYmjj9cleC9Mtn+2z2i0sVIyIGqWIS1KF+eShB+mVbZUmtfllvexzj3H45Ybb7/JcSi5OoYkTEIFVMwjnULw8Dga0LbY9jXE2/uL/PSzbYHse4hfs2Hu4Xp9Jmv7hUMSJikCom4Ty2cQ4Q2PqZ7UE8cv7K1wBnX/z3i2vU4meBQBT0i0sVIyIGqWISzsFwyPYInjqQYH9ef7jK9gh1qGJExCAdYkTEIB1iRMQgHWJExCAdYkTEIB1iRMQgHWJExCAdYkTEIB1iRMQgHWJExCAdYkTEIB1iYsCBUNDd5Egk5ugQIyIG6U7rqPPFvkLgpW2LgKe2LwI4WA6ETp1uezSRZlPFiIhBqhhrSqsqgb/u/AqYvm0x8OW2RUBgf9Hh1zgAhNoUWJxTpDVUMSJikCrGI2HCwP/uWg5csH4mcHDTPMAJVRx+TcDqhCImqGJExCBVjEHfHtgJ3L9xFvDC+plAoGzb4e86VmcT8YYqRkQMUsVETChcDfxh6wLgl+v+Afh3LAGccFjnWSRhqWJExCBVTKscrA4B0wtnAbeufBMIlG1Rs4gcpooREYNUMc3m3vQ8bcM/gWmr3gIC+7erXETqpYoREYNUMU1SUlUB3LnufeDx1W8DgYpilYvIEaliRMQgVUyD3LuKHiucDdz41YsqF5EWUMWIiEGqmHrM3bMOGPPls0Bg10qVi0iLqWJExCBVTI0dB0uBiV//GVi+7gMgEA7bHkok5qliRMSghK6Y6nD48NUu077+MxA4WKYnuYhEkCpGRAxK0IpZd2AX0Hvh40CgaKk+MxIxRBUjIgYlXMX8fvOnwFWLfn/4zIuImKOKERGDEqJi9gT3A3lLngN8Gz/SmRcRz6hiRMSgOK+Y93evBM74bDrglO+wPY5IwlHFiIhBcVsxv/nmb8D0r/5weCcjEfGeKkZEDIqrinF3NTp6yTPAxnUf6m4jEetUMSJiUJxUjPu0l87zHgScnctsjyMiNVQxImJQzFfM4pJNwIhPpwFO+Tbb45iRlGp7ApEWUsWIiEExXDGv71gCXDjvYSBQVW57nIjx+QNAdZeRwAvdxwMX5h9reyiRFlLFiIhBMVkxz2+ZD1wx/xEgEK6yPU4EBHMGAdN6TAD+s8sJQPvkdNtDiUSAKkZEDIqxinGfWXfNgumAE7P9EvI5QHXBaGB237OBse2Osj2UiBGqGBExKGYq5neFc4BfLXwMcMIh2+M0WzApFTip12nAM33OBPqk59keSsQ4VYyIGBQDFfPbjR8DN3/+eMw9+cW9wmVcnzOAl/ufD+QmZ9oeSsRTqhgRMSiqK+aB9TOBO794EnCIpX4JF4wGvhr8M2BARkfb44hYo4oREYOitGKe2zLvcL9Ate1xmiTUoR/w/tDLgYkd+tseRyQqqGJExKCoq5h/7l4N/OdnjwFO1PdLyEkFbhpyMXBf7zMBv89neyiRKKKKERGDoqhiVpRvA06bey/ghCptj3MEwbwhwIrhV+szI5FGqGJExKCoqJiiyjJg8CdTAaeyxPY4DXLvM5o85DLg7t6nAT505kWkMaoYETHIcsVUVAeB/Hn3A4HSLXaHaUQwqyewdPRNwODMLrbHEYkZqhgRMchyxaR9/iQQ2PW13TEaEew2Ftg37GogS/sZiTSTKkZEDLJWMVO+/QAIFM6yNUAjQr4k4FdDLwUe6fND2+OIxDBVjIgYZKFiFu7bCEz96gXA8X75RgWT2wB/H307cHrOQNvjiMQ8VYyIGORpxZSFKoFRCx4BAlF2F1IoLRdYNPYu4NisAtvjiMQJVYyIGORpxYz66gUgUFLo5aJHFGpTAKwZdxfQOy3X9jgicUUVIyIGeVQxz26eB3zz7QfeLNdE7tN2t46ZDOQnt7E9jkgcUsWIiEHGK2bt/p3AlV88FVVXwQRzBgElJ94JtElKsT2OSNxSxYiIQcYrps+SZ4FAsMz0Qk0UatcbKB4zSf0i4gFVjIgYZLBiXty6EAhsXWhuiWZxr3/ZMnYK0C6QbnsckYSgihERg4xUTGlVJfDzJc8BARMLNFMwvSPw7bgpQMfkLNvjiCQQVYyIGGSkYi5Z+ToQ2F9k4s2bxX3+y7JxdwG90nJsjyOScFQxImJQhCtmUUkh8M7qt6xfyxvy+YAZx90EDMrsbHUWkcSlihERgyJWMWHCwMjFzwBOuCpSb9tiVw+6FPhx/lDbg4gkNFWMiBgUsYp5YcsCwNm5PFJv2GLu/o2/63+u7UFERBUjIiZFoGLcszBXLH/d+qdIwbY9gdLh11idQkS+o4oREYMiUDHPbZ4POPvWRWKeFvL5A8AXo24EMh09BUYkWqhiRMSgVlVMdTgMXLniNetnYa4cfDEwLKub1SlE5F+pYkTEoFZVzLNb5gHOvg2Rm6fZQrlHA4/2OdviDCLSEFWMiBjUwoqpOQuzfIbF59oFk9KAVSOuB/w+n6UpRKQxqhgRMaiFFeOehQmUrI/0PM0wacilQL+MfIsziEjjVDEiYlALK+bqNe9YvBYm2LY3cHev0yytLyJNpYoREYOaXTEL920EnN0rzczTJH875nLA8en4KBLt9F+piBjU7Iq5bt0HZiZpknDBaOCsnEEWZxCRplPFiIhBzagYd6fqzzfOsvJZUshJAVYN+bnnK4tIy6liRMSgZlTME5s+AZxgucl5GnRWn7OAPul5VlYXkZZRxYiIQc2omEnr3rdyX7V7Fuapvj/0fGURaS1VjIgY1KSKmbtnHRAo/sb8PPUY1esUoEtKtpXVRaQ1VDEiYlCTKubhzXPNT1KPkC8JeKmvdqcWiVWqGBExqEkV886WBVau6M3tPh44Kj3X85VFJDJUMSJi0BEqZmnpFsAp3ezVPHW82+8cK+uKSKSoYkTEoCNUzPNbFno1SR2hDgOAY7MKrKwuIpGiihERg45QMU9s+8zKfUlTe57i+ZoiEnmqGBExqMGK2VK5D/DvXuXtPIScVODqgtEerysiJqhiRMSgBivmT1u/AJxw2Nt5yC0YA2QnpXm8rpjkB05p28v2GB4JJqUBQ9p0sj2IR0IZnYDcQJt6v6uKERGDGqyY24q+tPJZ0h96nuz5mmKOH3hg5PXAxZ1G2B7GOLdf/jH2buCYNvF/VZfbL6vHTwXaBur/fx6qGBExqOHrYnZ5/llSSlvg+x0GeLyumPFdv9zYfbztYYyr3S+ndOhnexzjavdL489CUMWIiEH1VMymir1AYH+Rx6PkdhoO+H0+j9eVSPMD94+8LqH65cOxU9Qv9VLFiIhB9VTMzOLVNiZhaudhVtaVyPED00ZeC/y6+wTbwxjn9ssHJ04BJnbob3sc49x+WTX+nmY9i1IVIyIG1VMxbxev8XgInz8JOD/vGI/Xlcj5rl9u6n6S7WGMCyalHu6XU3MSoV/yD/dLc/eVV8WIiEH1VMxbu9d4fF1vVe6gRq4OlOjmB+4dkWj9cneC9cu9LegXlypGRAyqUzGhcDWA5+diru2oszCx6Lt+ubmH+iXetL5fXKoYETGoTsUsKtkEBKoqPB7itA59PV5RWi/R+uW9sVOAUxPg+pdgekdgzfiprewXlypGRAyqUzFLy7Z6vHzI5wNGZyfK89Diw9QR1yVUv7w79q4EeQaA2y+rJ7Tk+peGqGJExKA6FbOsbIfX62d1B7KSUr1eV1rE7ZdbesT/kwlr98sPOgy0PY5xtfulb3p+BN9ZFSMiBtWpmPn7va6Yru37eLyitMw9wxOlX9ydvBKpX/IO338U2X5xqWJExKA6FfN52Q6P7066rJ0qJtpNGX4tcGsC7Azh9ss7Cdcv9wL9MiLfLy5VjIgYVKdi/OXbPV5+VNv432smdrn9cnvPU2wPYlztfjk9R/0SSaoYETGopmKqw2EgqbwI8HIX675NfgKoeOmu4dckVL/8beydCdUvK8ZP9aBfXKoYETGopmI2VOwGwtVBzxZ2n9fbI7WDZytKU7j9MqnnRNuDGFe7X87IOdr2OMYF03MO98uAjI6erauKERGDaipm3f7dHi9clZYLOD4d46LF5GGJ0y8pCdkv0zzuF5f+CxcRg2oqZk/VAY8XrvbkbLY0xR3DrgYm90qUfnkrwfpl+fh7rfSLSxUjIgbVVEyJ58/r7Z0RmWdqSWu4/XJnr1NtD2Jc7X45K2eQ7XGMC6XlAsvHTwUGZnSyOIkqRkQMOlQxIa8rZnBqlscrisuHD5g07KoE6ZdcJxX464mJ0i/+9A7AV6NusN4vNfPYHkBE4tnhczGVHi/cLinF4xXFdV23MUB2UqLsIP7awAsT6s+7a/i1UfXnVcWIiEE1FbPX80+Usv2qGDui5/ebN/TntUsVIyIGHaqYkNfnYtpq7ySRBKCKERGDDt+j5HXFZOkTJZEEoIoREYNqKqbUw+fduarC1cCOg6UerysiJqT5A/XuT6+KERGDfOFwGJj41X8Ds9e8ZXseEYlJmT1OBopHXPcvX1fFiIhBNediAnqGroi0QpsGjiE6soiIQTUVk+FPOtIrRUQa1L6BY4gqRkQMOlQxjipGRFoux6n/en1VjIgYVBMvbRs4AomINEWHBu46VMWIiEE1FZMXyLQ9iYjEsDyn/qftqWJExKCaislPVsWISMvlp9R/DFHFiIhBh87FNHAEEhFpik4pber9uipGRAzSJ0oiEgEFKW3r/boqRkQMqqmYzg0cgUREmqJbart6v66KERGDaiqma2o2EHJSAMfznSFFJHaFfA7QMy2n3u+qYkTEoJqK8eEDSM8DKN1kdyYRiSHVablAst+p97uqGBExqM7D7nyZ+ahiRKRZMvMa+aYqRkQMqlMxwzPygcX2phGRmNMtI7+R76piRMSgOhVzUpuuqhgRaZZzs7o28l1VjIgYVLdi2vUGHrE3jYjEnDHZPRv5ripGRAyqUzEntO0JhHxJgBOusjeViMSM49p2b+S7qhgRMahOxaQ7yUB1dnfA2futvalEJAYEU7OBro0+bUoVIyIGJf37l37U6VjgL1UHbMwjIs1XdQAIVOzxeFmnXd8jvkYVIyIG+cLhsO0ZRKRVLlj+MvDWitc9XveqoZcBj/U9p5HXqGJExKB6zsWISGx5c9M8oP6nzpl0fu6QI75GFSMiBqliRGLYF/sKAad0s8frBpPbAMe3bezuJJcqRkQMUsWIxLAnt863s3DeIMDv8x3xhaoYETFIFSMSw/60aYGVz5Juzx3axFeqYkTEIFWMSEz6snQz4OxbZ2X18/IGNfGVqhgRMUgVIxKTblj3vpV1g6ntgGOzCpr4elWMiBikihGJMSVVFcAn6z+y8llSUn5TP0tyqWJExCBVjEiMmV44G3CC5VZWf6rzqGa9XhUjIgapYkRizD1r37VyFiaYnAlc0mlEs35KFSMiBqliRGLGu7tWAM6+DVZWH1wwBkhzAs36KVWMiBikihGJGWesfANoXkVEziPdJrTgp1QxImKQKkYkBrhnYQLbF1lZPZjZCTg1p38LflYVIyIGqWJEYsAZy162eBbmku4tOQvjUsWIiEGqGJGo9vqOJUBg19cWZ7it+7gW/6wqRkQMUsWIRKkwYeAny162ckeSK5gzEBiQ0bHF76CKERGDVDEiUeox97kwe76xOMNDvSa28h1UMSJikC8cDtueQUTqKKosAzp9cCXgVJZYmSGY3hGo/MHTQLK/5eeCVDEiYpDOxYhEnROWvWixX1yT+5/byn5xqWJExCBVjEgUce+oLlz/ocUZgqntgdt6nByRd1PFiIhBraqYFeXbgKO//p/IzdNsF2Z2BF49+iKLM4i0XmV1FXDGoqct3lHtur7f2S14Rm9DVDEiYlCrKmZgRifAX14EOLtXRm6qZvgLAI9mdgZu7D7eygwirXf+8leAQMkmizMEk7OBe3p9P4LvqYoREYMi8InSW0MuBs77eFIk5mmhXy9+FjgzdwDQNz3f4iQizfU/2xcD76/6q+1B+HnfM4GspNQIvqcqRkQMitg9Ss6cuwFnx+KIvFvLhHKPBg6OuxdwfDp6SrTbcKAY6P2P661fyxtMygB2nvEckJOcEcF31n+HImJQxK7u/XjwT4FTrFaMs3M5cMHyV4A3B11scRKRxgXDIaD3Z49Y7xfXpf3Pjni/uFQxImJQxCpmbLujgGDXMUBg86eRetsWeGflDOD5dr2B/+hyvMVJRBpy0fJXD3e3Xe5Oj7/v+yND76+KERGDInyn9YohlwCDtn0OOKHKyL55s/xi4ePAsSd3BY7NKrA4iUhtj26cBby98nXbg9R49ZgrInhH0r9TxYiIQUae3fsfq2YALy37c8TfubmCmV2ATSfdB3RNaWt7HElob+9cBlwwZwoQrq6yPQ7BrscD4eNvNbqKKkZEDDJSMe6TL9I/vAFwSm3eOeoKZfcCto2bCuSlZNoeRxLOF/sKgVEf3wo4wXLb4xByUoE1P3gS6J2Wa3QtVYyIGGRwH6V3dn1t/Q7s2oLt+wDFY+8B2gXSbY8jCWFjxW6gx8ybgcD+XbbHqfGLoZcCTxm7FqY2VYyIGGR8N8i0zx8HQhs+MrpK0wVzBgIlJ04B2iSl2B5H4tamir1At9mTgUBJoe1xagSzugGVEx+LyB5JTaGKERGDjFfM9oMlQKcPrgECFfuMrtV0ofzvAWWj7zB6XaMkppqnwMy+A3BKt9gep443J0wDzsoZ5NmKqhgRMch4xbhe274EuOSTKR6s1XTBziOAiuNvBVL82hhTWmvt/p1AH/f8S9k22+PUcUq/HwHvDrnU43VVMSJikEcV4xr/1fPAvDXveLZiUwS7ngDsH3mjzstIi60s3w4MnHUXENi/3fY4dYQ69AcOjL/Ps0+RalPFiIhBnlZMRXUQSJt5ExDYu96zdZsi1KEfsOGE24GCVN2TLU01q/gbYMLc+4BARbHtceoIJmcCayZOB/qk51mZQRUjIgZ5WjGuxSWbgBH//LX1J+P9u1BaLjBr9G3Aie162x5HotrTmz4Frv38d1H4L9n13OhJwKWdR1qcQRUjIgZZqBjX1HX/AKYuetLK6o0LOSnAEyOuA64qGGN7HIkiYcLAT5e/Cryx4lXb4zToxL5nAzOHXm57EFWMiJhkrWJcI5f8F/Dl2nctztC4cwZeALx29EWAD5/tccSakqoKIPvzJ6zvFNa4YPu+QMWE+6PkmnVVjIgYZLli3J19k+dMAQJFSy1O0rjqLscBu0feAGQnpdkeRzw1c/ca4JSFj0bhnUe1hQKZwIqJjwL9MvJtj1NDFSMiBlmuGFdRZRmQ/9Fvov23RJuuwIcjrgdO7tDX9jhikNvXl6+cAbyy4nXACYdsD9Ugnz8A/HXcPcDpOQNtj1OHKkZEDIqKinEtKd0EHPvPW4BAlf29ZhoS8jnAOf1/BLw88EIg1a/7s+PH8rJtwJCF0wFn92rb4xxByOcDnjvhVuDyzsfZHqceqhgRMSiKKsb1+o4lwCWf3hsl+/42LpTdA/hw2NU6OxPT3GcAXLfmbeCFFTMAJ1Rhe6gmmTzsGmByr4m2B2mQKkZEDIq6inE9u3kecOWCR6L8TP4hfqBTz5OBBYN/BnRKybI9kjTJy9sWARd/+TwQKNtqe5xmuGjQRcAfB1xoe5AjUMWIiEFRWjGuhzd+BExa+AQA1bbHaRL3CstbBv0UmNLrNCtPS5XGrSjfBhz95R+AwNaFtsdptu8ddTqw8JgrbA/SJKoYETEoqivGNWnte8DDS56xPUizhTI6AfcPvAD4VfdxQMCnorFjzf4dwI9X/QVYvX4mEK4O2h6q2cIFo4HKUTcBfl9s3PevihERg2KgYlxXrn4TeGHpS7YHaaFgZhdg+tEXAlcXjFHReMC9TvfUVW8A2zfMApxwtF9p1ZBg55HAgeNvjrmryVUxImJQzFSM64Y1bwFPf/XftgdplWB6DnDlUWcAd/c8FchNzrQ9VJxwdzWauPbvQHXhnBi5rqox7XucAmwaflWMlq8qRkQMirGKcT204SPgti+ejIPfUe5uB0f3mAA81uNk4KT2utepqXYeLAN+W/gx8OD6mVG4y2hrfL//ecDbgy+J6edGq2JExKCYrBjXi1sXAr+c/1CMXuPQEPfZepf1GA/c3G0s0Dc9Wp7DaldldRXwzs7lwE82fgT4N82Ns79911VDLwMe63uO7UEiQBUjIgbFcMW4/r5rOXDmJ9Oi/Fl5LeUHQu16Axd1Hg78/47DgLHtjoqh6ztbZvvBEuCVbYuBW7YtBKq2fRmnf8scfpriQyOuBX7dfYLtcSJGFSMiBsV8xbgW7N0AjJ73AOCUR+8eBpESTM0GkvKPAW7p0B84o0N/YGR2d8DxxdJvjk0Ve4GPitcAf9/zDTCjaBng370KcOLi32fj3E8VXzr+FuCnnYbZHifCYunfoojEnDipGJe7H1Onz34LODsW2x7HgqC7U2X7fsC4tgXAhDYFwPCsrsD32nQFuqRkezaPe93KmvIiYNX+ImBx+Vbg6d3fAP7d3wDOgZ2ezRNtQhn5wEfH3QyMa3+U7XGMUMWIiEFxVTGuULgaOPfrPwPvr3rT9jhRJxTIAEjPB6rT2gJJKW2BsSltgM6BdKC9kwpkOMlAss8BqgkD+6oqgD2hSqA4VAEUVVUAy6oqgGCwHAiVFwH+8iLACcbnpz+t5+6Svn34dUBOcobtcQxSxYiIQXFYMbU9s3kucPXC38XQzjgSr3z+JODaIZcCj/T5oe1xPKKKERGD4rxiXO5u2cM/mw44e761PY4kHPeTo5nH3QSMb9/H9jieUsWIiEEJUTGug9Uh4GcrXwNmrHwjDp41I9EvcT45aogqRkQMSqCKqW3m7jXAKQunx9xOxhL93Gusbx98KTDtqB/YHscyVYyIGJSgFeMqraoEJi57EVi89j2ImZ2zJTqFC8YCa7/3c6B7agfb40QFVYyIGJTQFVPb7OK1wPglzwKB4tW2x5GY4e7zOePYK4Af5w+1PU7UUcWIiEGqmDqqw2HggQ0zgcnLXgScyhLbQ0nUcZ9T97MBPwZ+3+/cmNtn2kuqGBExSBXToF0Hy4EfrngZ+Gzt+7oaWIDqTsOBZcf8AhiQ0dH2ODFAFSMiBqlimmRZ2Rbg2BVvANWFHyfIk/HFFcwbArw18ALg7NzBtseJMaoYETFIFdNsh4pmBlBdOEtFE5fccy7vDTgfmNihv+1xYpgqRkQMUsW0ytLSLcCwlW7RfAI44SrbQ0kL+IFg11HAp/0vAEa362V7pDihihERg1QxEVNYsQe4c/2HwJ++fR9wDhTbHkoaFPIlAdUFY4AvBpwHDMvqZnuoOKSKERGDVDFGBMMh4I9bPwN+ufY9IFC01PZQQqhdb+A33U8Gbuh2ItApJcv2UHFOFSMiBqliPOLu5fRw4afAa5s+AZzSLbaHinPB1PbAGT3GA1O6TQCGZ+tsi9dUMSJikCrGmgV7NwCPbpkLzCj8VHshtJL7DBd336LXekwAzssbCjg+/R61Sf/ri4hBqpgoMn/veuBPO5YA/7VjKcCuFYATqrQ9WhSpuZ6lQx/gJ3lDgf+XNxiY2L4fkObo6XPRRRUjIgapYqJaRXUQmFm8BnilaCnwyo6lQHLxN0C4Omh7QKP8QKhdT+C0vKHAJXmDgdNzBgDZSWm2x5MmUcWIiEGqmJh0sDp0+D7v+SUbgJl7NwL/u289ENqzHghURPsdUj5/EnAwqwBIyu4JXJXdHRjTtgcwru1RQF5Kpu0xpVVUMSJikCombhVVlgHfHtgJrK/YDazdXwysOrAbmH1gF7B9/26AgyUAVZVAdegg4A9VHP6KE3LP+NS/27d7NQpJKUB1IBMgORNwUrKBLqltgQkZucDg9DxgQEY+0Dc9F+iZ1kHXrcQ9/e2KiEGqGGmSA6HvPr1yuyPg9wM+fFbnkminihERg1QxImKQKkZEDNIhRkQM0iFGROuPiXoAAAARSURBVAzSIUZEDNIhRkQM+j+vzs0GufYXgQAAAABJRU5ErkJggg==" alt="中宏保险" style="max-height: clamp(28px, 4vh, 44px); width: auto;" />
  ```
  The above contains the complete inline logo (PNG format, 374×428px). Copy the entire `src` attribute value as-is into generated HTML. Do NOT attempt to read from any external file.
- **Page index** at bottom-right in small Manrope mono-spaced digits: `01 / 12` with divider in brand green
- **Stat emphasis**: large numbers always in `--brand-green` or `--accent-navy`, body text stays dark
- **Callout pills** with `--brand-green-soft` background + `--brand-green-dark` text
- **Hairline dividers** at `1px solid var(--divider)` — no heavy borders, no drop shadows
- **Entrance animation**: subtle 0.4s fade-up (translateY 12px) — NEVER bouncy or playful
- **No gradients**, **no glassmorphism**, **no decorative shapes** — this style's power is in restraint

**Required Font Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
```

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

