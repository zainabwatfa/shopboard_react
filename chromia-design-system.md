# Chromia — Design System ("Sticker" UI)

> Reverse-engineered from the live production site **chromia.com** (all marketing pages, use-case pages, Explorer, Chat, CHR 2.0 Simulator, and the Vault dApp).
> Every token below was read from the site's computed CSS custom properties and component rules — not estimated from screenshots.
> Audit date: 2026-11-03.

---

## 0. Table of Contents

1. Design Language & Principles
2. Typography
3. Color System (Light)
4. Color System (Dark)
5. Gradients, Alphas & Data-Viz Colors
6. Spacing, Layout & Grid
7. Radius, Borders & Shadows
8. Motion & Interaction States
9. Breakpoints
10. Components (full catalogue)
11. Iconography & Illustration
12. Content & Voice Patterns
13. Page Inventory (which components each page uses)
14. Accessibility Notes
15. Vault dApp Palette (separate product skin)
16. Implementation: CSS Tokens + Tailwind v4 `@theme`
17. Do / Don't

---

## 1. Design Language & Principles

**Style name (internal prefix `st-`):** "Sticker" — a soft **neo-brutalist** system.

| Principle                       | How it shows up                                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Ink outline on everything**   | Every interactive surface has a `2px solid #1F1A23` border.                                                          |
| **Hard offset shadow, no blur** | `box-shadow: 8px 8px 0 <shade>` — the shadow is a _colored_ flat slab, never a blurred drop-shadow.                  |
| **Tint + Shade pairs**          | Each pastel fill (lavender / pink / green / yellow) has a darker "shade" used only for its offset shadow.            |
| **Paper, not white**            | Page background is warm off-white `#F5EEEE`; cards are `#FFF8F8`. Pure white is never used as a surface.             |
| **Poster display type**         | Headlines use a heavy, wide, ink-trap serif (`battlefin`, 900) with tight tracking and line-height < 1.              |
| **Mono for metadata**           | Labels, eyebrows, table headers, hashes and stats captions use `NB International Mono`, uppercase, +0.08em tracking. |
| **One accent word**             | H1/H2 typically end with 1–2 words colored in accent purple `#7D42AB`, followed by a black period.                   |
| **Hand-drawn illustration**     | Monoline black-ink doodles with handwritten annotations and pink highlights, inside a sticker frame.                 |
| **Tactile motion**              | Hover lifts the element up-left and grows the shadow; active presses it down-right and shrinks the shadow.           |

---

## 2. Typography

### 2.1 Font families

| Token                                                        | Family                    | Weights loaded                        | Fallback stack                                            | Role                                                    |
| ------------------------------------------------------------ | ------------------------- | ------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| `--font-poster` → `--font-battlefin`                         | **battlefin**             | 400–900 (used at 900)                 | `Battlefin Fallback, Impact, Arial Black, sans-serif`     | H1, H2, big numbers, stat values, number badges         |
| `--font-sans` / `--font-display` → `--font-nb-international` | **NB International**      | 400, 500, 600–900                     | `NB International Fallback, Helvetica, Arial, sans-serif` | H3, H4, body, buttons, nav                              |
| `--font-mono` → `--font-nb-international-mono`               | **NB International Mono** | 400–700                               | `ui-monospace, SFMono-Regular, Menlo, monospace`          | Eyebrows, labels, table headers, code, hashes, captions |
| `--font-display-serif`                                       | Fraunces                  | 900 (declared, not actively rendered) | `Fraunces Fallback`                                       | Reserve / fallback display serif                        |

> ⚠️ **Licensing:** battlefin and NB International are commercial typefaces. If you rebuild this system without a license, the closest free substitutes are:
> poster → **Fraunces 900** (already in their stack) or _DM Serif Display_; sans → **Inter** / _Space Grotesk_; mono → **JetBrains Mono** / _Space Mono_. Re-tune letter-spacing after swapping.

### 2.2 Semantic type scale (custom classes)

| Class            | Font   | Size                       | Weight | Line-height  | Letter-spacing    | Notes                                      |
| ---------------- | ------ | -------------------------- | ------ | ------------ | ----------------- | ------------------------------------------ |
| `.text-h1-hero`  | poster | `clamp(50px, 7vw, 112px)`  | 900    | 0.92         | -0.015em          | Home hero only                             |
| `.text-h1`       | poster | `clamp(46px, 6vw, 88px)`   | 900    | 0.94         | -0.015em          | Page heroes                                |
| `.text-h2`       | poster | `clamp(36px, 4.6vw, 68px)` | 900    | 0.96         | -0.015em          | Section titles                             |
| `.text-h3`       | sans   | `clamp(26px, 3vw, 42px)`   | 700    | 1.08         | -0.02em           | Sub-section titles                         |
| `.text-h4`       | sans   | `24px`                     | 600    | normal       | -0.02em           | Card titles                                |
| `.st-lede`       | sans   | `clamp(18px, 1.7vw, 22px)` | 400    | 1.45         | 0                 | Hero/intro paragraph, max-width 560px      |
| `.st-body`       | sans   | `16px`                     | 400    | 1.55         | 0                 | Default body                               |
| `.st-label`      | mono   | `12px`                     | 400    | —            | 0.08em, UPPERCASE | Field / stat labels, color `smoke`         |
| `.st-eyebrow`    | mono   | `13px`                     | 400    | —            | 0.08em, UPPERCASE | Pill above headings                        |
| `.st-mono`       | mono   | `12px`                     | 400    | —            | 0.02em            | Captions, meta, color `smoke`              |
| `.st-hash`       | mono   | `13px`                     | 400    | —            | 0                 | Tx hashes / IDs, `overflow-wrap: anywhere` |
| `.st-stat-value` | poster | `clamp(38px, 4vw, 60px)`   | 900    | 0.95         | —                 | `tabular-nums`; unit in accent             |
| Table header     | mono   | `11px`                     | 400    | —            | 0.08em, UPPERCASE | color `smoke`                              |
| Code (`pre`)     | mono   | `13px`                     | 400    | 1.7 (22.1px) | —                 | padding 20px                               |
| Nav links        | sans   | `14px`                     | 700    | —            | 0                 | Header nav                                 |
| Button           | sans   | `16px` (sm: 14px)          | 700    | 1            | 0                 |                                            |

### 2.3 Base utility scale (Tailwind v4 defaults, kept as-is)

`xs 12/16 · sm 14/20 · base 16/24 · lg 18/28 · xl 20/28 · 2xl 24/32 · 3xl 30/36 · 4xl 36/40 · 5xl 48/1 · 6xl 60/1 · 7xl 72/1 · 8xl 96/1`
Weights: `500 medium · 600 semibold · 700 bold · 800 extrabold · 900 black`
Tracking: `tight -0.025em · widest 0.1em` — Leading: `tight 1.25 · snug 1.375 · normal 1.5 · relaxed 1.625`

---

## 3. Color System — Light Theme (default)

### 3.1 Sticker palette (brand fills) — the heart of the system

| Name         | Tint (fill)                   | Shade (shadow / hover)              | Used for                                                                      |
| ------------ | ----------------------------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| **Lavender** | `#C98CF0` `--color-st-lav`    | `#9E5ECF` `--color-st-lav-shade`    | Default card shadow, ghost-button shadow, active nav, sliders, "info" chip    |
| **Pink**     | `#FFB0C2` `--color-st-pink`   | `#FF7EA3` `--color-st-pink-shade`   | Primary CTA button, tags, "bad/BLOCK" chip, community CTA block               |
| **Green**    | `#93F091` `--color-st-green`  | `#4FCD4C` `--color-st-green-shade`  | "ok/ALLOW" chip, success stickers, Vault card                                 |
| **Yellow**   | `#FFB500` `--color-st-yellow` | `#FF9100` `--color-st-yellow-shade` | "warn/REVIEW" chip, hex star sticker, stat units on dark strip, Explorer card |

Text on any sticker fill is always **`--color-on-fill: #1F1A23`** (ink). Mono text inside fills uses `rgb(44, 42, 58)` (`#2C2A3A`).

### 3.2 Neutrals (surfaces & text)

| Token                  | HEX       | Role                                                        |
| ---------------------- | --------- | ----------------------------------------------------------- |
| `--color-surface`      | `#F5EEEE` | Page background                                             |
| `--color-surface-grid` | `#FAF5F5` | Subtle grid / alt background                                |
| `--color-paper`        | `#ECE3E5` | Wells, table header bg, disabled input bg, slider track     |
| `--color-paper-2`      | `#E3D8DB` | Deeper paper (inactive presets, before-cards)               |
| `--color-card`         | `#FFF8F8` | Card surface, ghost button, inputs                          |
| `--color-ink`          | `#1F1A23` | Primary text, borders (`line`), default shadow, dark panels |
| `--color-ink-2`        | `#2A2430` | Secondary dark                                              |
| `--color-graphite`     | `#3A3340` | Dark text alt                                               |
| `--color-smoke`        | `#5C5466` | Secondary text, labels, captions                            |
| `--color-ash`          | `#6B6474` | Placeholders, tertiary text                                 |
| `--color-pencil`       | `#9A90A0` | Disabled / faint text                                       |
| `--color-hairline`     | `#DCCFD3` | Light dividers, chart gridlines                             |
| `--color-hairline-2`   | `#C7B8BE` | Well borders, empty-state dashed border                     |
| `--color-white`        | `#FFFFFF` | (rarely used)                                               |

### 3.3 Structural aliases

| Token                                        | Value                                         | Role                                             |
| -------------------------------------------- | --------------------------------------------- | ------------------------------------------------ |
| `--color-line`                               | `#1F1A23`                                     | All 2px outlines                                 |
| `--color-shadow`                             | `#1F1A23`                                     | Default hard shadow                              |
| `--color-panel`                              | `#1F1A23`                                     | Dark strips, terminal, eyebrow pill, footer card |
| `--color-on-panel`                           | `#FFF8F8`                                     | Text on dark panels                              |
| `--color-on-panel-muted`                     | `#CDC4CC`                                     | Muted text on dark panels                        |
| `--color-panel-line`                         | `#4A4050`                                     | Dividers inside dark panels                      |
| `--color-midnight` / `-2` / `-line` / `-ash` | `#1F1A23` / `#2A2430` / `#4A4050` / `#A99CB2` | Dark-section set                                 |

### 3.4 Semantic

| Token               | HEX       | Meaning                                                                              |
| ------------------- | --------- | ------------------------------------------------------------------------------------ |
| `--color-accent`    | `#7D42AB` | Brand purple: accent words in headings, focus rings, `.unit`, accented table headers |
| `--color-live`      | `#0B7A52` | Live / positive / "operational" (alias `green-100`)                                  |
| `--color-warn`      | `#8F5F00` | Warning text (alias `--color-yellow`)                                                |
| `--color-down`      | `#B42F2F` | Error / negative / outage (alias `red-100/200`)                                      |
| `--color-code-bg`   | `#1A1520` | Code block background                                                                |
| `--color-code-text` | `#F0E8EE` | Code block text                                                                      |

### 3.5 Extra hues found in components

| Token / usage                                                 | HEX       |
| ------------------------------------------------------------- | --------- |
| `--color-chroma-coral` / `--color-orange`                     | `#FF6B4A` |
| `--color-chroma-amber`                                        | `#FFB500` |
| `--color-green-300` (mint) — status dots, about-page timeline | `#5BE9B0` |
| Timeline active node (About)                                  | `#7C3AED` |
| Roadmap "done" node                                           | `#22C55E` |
| `--color-blue-500`                                            | `#3080FF` |
| `--color-red-500`                                             | `#FB2C36` |
| `--color-pink-200` / `--color-purple-bright`                  | `#FF5C8A` |

> ⚠️ **Naming quirk (legacy):** `--color-purple`, `--color-purple-600/800/900` and `--color-pink-100` all resolve to **pink** `#FF7EA3`, not purple. Treat them as aliases of `st-pink-shade`. The real purple is `--color-accent` (`#7D42AB`) and the lavender pair. Don't propagate this naming into a new codebase.

---

## 4. Color System — Dark Theme

Activated by `:root[data-theme="dark"]`, or by `prefers-color-scheme: dark` when `data-theme` is not set (3-way switch: System / Light / Dark).

| Token            | Light     | **Dark**                       |
| ---------------- | --------- | ------------------------------ |
| surface          | `#F5EEEE` | **`#15111A`**                  |
| surface-grid     | `#FAF5F5` | **`#1A1520`**                  |
| paper            | `#ECE3E5` | **`#1D1723`**                  |
| paper-2          | `#E3D8DB` | **`#272030`**                  |
| card             | `#FFF8F8` | **`#221B29`**                  |
| ink              | `#1F1A23` | **`#F5EEEE`**                  |
| ink-2            | `#2A2430` | **`#E8DFE4`**                  |
| graphite         | `#3A3340` | **`#D0C5D3`**                  |
| smoke            | `#5C5466` | **`#C3B8CC`**                  |
| ash              | `#6B6474` | **`#A99CB2`**                  |
| pencil           | `#9A90A0` | **`#6F6378`**                  |
| hairline         | `#DCCFD3` | **`#3A3042`**                  |
| hairline-2       | `#C7B8BE` | **`#4A3F53`**                  |
| line (outlines)  | `#1F1A23` | **`#6B5A7C`**                  |
| shadow (default) | `#1F1A23` | **`#9E5ECF`** (lavender shade) |
| panel            | `#1F1A23` | **`#2C2433`**                  |
| on-panel         | `#FFF8F8` | `#FFF8F8`                      |
| on-panel-muted   | `#CDC4CC` | `#CDC4CC`                      |
| panel-line       | `#4A4050` | **`#4F4459`**                  |
| accent           | `#7D42AB` | **`#D6A6F5`**                  |
| live             | `#0B7A52` | **`#3FD29A`**                  |
| warn             | `#8F5F00` | **`#E3B341`**                  |
| down             | `#B42F2F` | **`#FF8A8A`**                  |

**Unchanged in dark:** all four sticker tint/shade pairs and `on-fill #1F1A23` (pastel stickers stay pastel with ink text — that's what keeps the brand recognizable in dark mode). The `dark-500…900` ramp is inverted (`#C3B8CC → #F5EEEE`). Illustrations get a radial lavender glow behind them in dark mode.

---

## 5. Gradients, Alphas & Data-Viz Colors

### 5.1 Gradients

```css
--gradient-chroma: linear-gradient(
  90deg,
  #9e5ecf 0%,
  #ff7ea3 50%,
  #ffb500 100%
);
--gradient-spectrum: linear-gradient(
  90deg,
  #c98cf0 0%,
  #9e5ecf 30%,
  #ff7ea3 62%,
  #ffb500 100%
);
--gradient-violet: linear-gradient(135deg, #ff7ea3 0%, #9e5ecf 100%);
```

Used sparingly (logo "Chr", shimmer text, progress bars). Never as large background fills.

### 5.2 Alpha tokens

| Token                    | Value                                                                          |
| ------------------------ | ------------------------------------------------------------------------------ |
| `--color-purple-ghost`   | `#FF7EA31A` (pink @ 10%)                                                       |
| `--color-purple-glow`    | `#FF7EA324` (pink @ 14%)                                                       |
| `--color-warn-ghost`     | `#B07A001F`                                                                    |
| `--color-down-ghost`     | `#DA3A3A1A`                                                                    |
| `--hd-hover` (nav hover) | `color-mix(in srgb, #C98CF0 30%, transparent)` ≈ `#C98CF04D`                   |
| Menu item hover          | `color-mix(in srgb, #C98CF0 26%, transparent)`                                 |
| Header background        | `color-mix(in srgb, #F5EEEE 92%, transparent)` + `backdrop-filter: blur(16px)` |

### 5.3 Charts (CHR 2.0 Simulator)

| Series                     | Style                                                                      |
| -------------------------- | -------------------------------------------------------------------------- |
| Actual / historic line     | stroke `#1F1A23`, ~3px                                                     |
| Simulated / primary series | stroke `#FF5C8A`, ~3px, area fill with pink fade gradient + dotted texture |
| Ceiling / reference        | stroke `#6B6474`, 1.5px, dash `6 4`                                        |
| Baseline / marker line     | stroke `#6B6474`, 1px, dash `4 4`                                          |
| Gridlines                  | stroke `#DCCFD3`, 0.5px                                                    |
| Bars (minted)              | fill `#FFB500` (dotted texture)                                            |
| Bars (burned)              | fill `#FF6B4A` (dotted texture)                                            |
| Net line                   | `#0B7A52`                                                                  |
| Axis labels / legend       | mono 11–12px, `smoke`                                                      |
| Value callout              | small card, 1px hairline-2 border, mono text                               |

---

## 6. Spacing, Layout & Grid

| Token / rule                          | Value                                                                      |
| ------------------------------------- | -------------------------------------------------------------------------- |
| Base unit `--spacing`                 | `0.25rem` (4px) — all spacing is a multiple of 4                           |
| Container `.st-wrap`                  | `max-width: 1280px`, gutters `20px` → `40px` at ≥1000px                    |
| Section `.st-sec`                     | padding `64px 0` → `88px 0` at ≥1000px                                     |
| Section tight `.st-sec.tight`         | padding `40px 0`                                                           |
| Section head `.st-head`               | flex column, gap `22px`, paragraph max-width `600px`                       |
| Split head `.st-head.split` (≥1000px) | grid `1.1fr 0.9fr`, column-gap `64px`, items `end`; eyebrow spans full row |
| Lede max-width                        | `560px`                                                                    |
| Stat grid `.st-stats`                 | gap `20px`                                                                 |
| Stat card `.st-stat`                  | padding `24px 24px 22px`, inner gap `12px`                                 |
| Card grids                            | 2, 3, or 4 columns; ~24px gap; collapse to 1 column on mobile              |
| Containers (Tailwind)                 | `lg 32rem · 2xl 42rem · 3xl 48rem · 5xl 64rem · 7xl 80rem`                 |
| Header height                         | `60px`, `position: fixed`                                                  |

**Typical page rhythm:** Hero (split text/illustration) → stat strip → feature sections (eyebrow + H2 + lede, then 3–4 numbered cards) → CTA sticker block → "Join the community" pink block → footer.

---

## 7. Radius, Borders & Shadows

### 7.1 Radius

| Token               | Value                                             | Used on                                                    |
| ------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| `--st-radius`       | `28px`                                            | Large cards, strips, CTA blocks                            |
| `--st-radius-sm`    | `18px`                                            | Small cards, tables, code, popovers, empty states          |
| `--st-radius-xs`    | `12px`                                            | XS cards, wells, FAQ `<details>`                           |
| Input radius        | `14px`                                            | `.st-input/.st-select/.st-textarea`                        |
| Menu item           | `10px`                                            | Dropdown items                                             |
| Terminal `.st-term` | `24px`                                            |                                                            |
| Chat composer       | `22px`                                            |                                                            |
| Footer card         | `32px`                                            |                                                            |
| Illustration inner  | `16px`                                            |                                                            |
| Pill                | `999px`                                           | Buttons, tags, chips, eyebrows, nav triggers, icon buttons |
| Circle              | `50%`                                             | Number badges, circle stickers                             |
| Tailwind scale      | `xs 2 · sm 4 · md 6 · lg 8 · xl 12 · 2xl 16` (px) | utilities                                                  |

### 7.2 Borders

| Use                                | Spec                                                            |
| ---------------------------------- | --------------------------------------------------------------- |
| Default outline                    | `--st-border: 2px solid var(--color-line)`                      |
| Small tag                          | `1.5px solid line`                                              |
| Well                               | `1.5px solid hairline-2`                                        |
| Header bottom                      | `2px solid line`                                                |
| Disabled / empty / "before" states | `2px dashed` (line or hairline-2)                               |
| Inner dividers                     | `1px` hairline (dashed variants used in cards: `divide-dashed`) |

### 7.3 Shadows (hard offset, zero blur)

| Token            | Value                               | Applies to                                    |
| ---------------- | ----------------------------------- | --------------------------------------------- |
| `--st-shadow-lg` | `8px` → `8px 8px 0 var(--st-shade)` | `.st-card`, `.st-term`, footer card           |
| `--st-shadow-md` | `5px` → `5px 5px 0 …`               | Buttons, tables, code, popovers               |
| `--st-shadow-sm` | `3px` → `3px 3px 0 …`               | `.st-card.sm/.xs`, header button, badges, FAQ |
| Sticker shapes   | `4px 4px 0 line`                    | `.st-stk`                                     |
| Range thumb      | `2px 2px 0 line`                    | slider                                        |
| Chat composer    | `6px 6px 0 ink`                     |                                               |

`--st-shade` is set per color class (`.c-*` / `.s-*`) and falls back to `--color-shadow` (ink). **Shadows always go bottom-right.**

---

## 8. Motion & Interaction States

| Token                                  | Value                             |
| -------------------------------------- | --------------------------------- |
| `--default-transition-duration`        | `150ms`                           |
| `--default-transition-timing-function` | `cubic-bezier(.4, 0, .2, 1)`      |
| `--ease-out`                           | `cubic-bezier(0, 0, .2, 1)`       |
| `--ease-in-out`                        | `cubic-bezier(.4, 0, .2, 1)`      |
| Button transition                      | `transform .15s, box-shadow .15s` |
| Icon button transition                 | `transform .12s, box-shadow .12s` |
| `--blur-sm / --blur-md`                | `8px / 12px`                      |

### 8.1 The "press" model (core interaction)

| State         | Transform                                   | Shadow                                                                       |
| ------------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| Rest          | none                                        | `5px 5px 0 shade` (button) / `8px 8px` (card)                                |
| Hover         | `translate(-2px,-2px)` (cards: `-3px,-3px`) | grows to `7px` (cards: `11px`; sm card `8px`; xs `5px`)                      |
| Active        | `translate(3px,3px)`                        | shrinks to `2px 2px 0 shade`                                                 |
| Focus-visible | —                                           | `outline: 3px solid accent; outline-offset: 3px` (nav: 2px/2px)              |
| Disabled      | none                                        | none, `border-style: dashed`, bg `card`, text `smoke`, `cursor: not-allowed` |

### 8.2 Keyframes in use

`hero-fade` (hero entrance) · `illus-in` / `illus-float` (illustration entrance & idle float) · `ticker-scroll` (marquee) · `text-shimmer` (gradient text) · `pulse-live / pulse-purple / pulse-warn / pulse-down` (status dots) · `chr2-ping` (live ping) · `st-skel` (skeleton, 1.4s ease-in-out infinite, `background-size: 200% 100%`) · `spin` · `pulse` · animated count-up on stat numbers (digits roll in).

All looping animations are disabled under `@media (prefers-reduced-motion: reduce)`.

---

## 9. Breakpoints

| Name                                                    | Min-width           |
| ------------------------------------------------------- | ------------------- |
| xs                                                      | `30rem` (480px)     |
| sm                                                      | `40rem` (640px)     |
| md                                                      | `48rem` (768px)     |
| lg (site switch: gutters, section padding, split heads) | `62.5rem` (1000px)  |
| xl `--breakpoint-xl`                                    | `68.75rem` (1100px) |
| 2xl                                                     | `87.5rem` (1400px)  |

Mobile: header collapses to `.st-mnav` (full-screen menu with grouped sections `.st-mnav-group` + mono `.st-mnav-title`); sticker shapes shrink (circle 92→64px, hex 100×88→70×62).

---

## 10. Components

> Notation: `$x` = `var(--color-x)`. All components inherit the global rules: 2px ink outline, hard shadow, pill/rounded geometry.

### 10.1 Header `header.st-header`

- Fixed, `60px` high, bg `surface @ 92%` + `blur(16px)`, bottom border `2px line`.
- Left: wordmark (gradient "Chr" + ink "omia"). Center: nav (14px/700). Right: theme switch + compact CTA.
- **Nav trigger / top link** `.st-trigger, .st-top-link`: height `36px`, pill, `2px solid transparent`, padding `0 12px`, gap `6px`, chevron `⌄`; external links show `↗`.
  - Hover / open: bg `lav @ 30%`. Expanded: border `line`, bg `card`. **Active section:** lavender pill with a small dot `•` before the label.
- **Header CTA** `.st-btn` (pink): padding `9px 16px`, 14px, shadow `3px 3px 0 pink-shade` → hover `4px`.
- Explorer adds a secondary tab bar (Home · Chains · Top dapps · Assets · Providers · Nodes · Bridge · Proposals): pill tabs, active = lavender fill + ink border.

### 10.2 Dropdown / Popover `.st-panel-card, .st-popover`

- bg `card`, border `2px line`, radius `18px`, shadow `5px 5px 0 lav-shade`, padding `10px`.
- Section label `.st-panel-label`: mono uppercase 11–12px `smoke`, separated by a hairline.
- **Menu item** `.st-menu-item`: radius `10px`, padding `8px 10px`, 14px, gap `8px`; hover/active bg `lav @ 26%`. External items get `↗`.

### 10.3 Theme switch `.st-theme-seg`

- Pill container, `2px line`, card bg; 3 options (🖥 System · ☀ Light · ☾ Dark) `.st-theme-opt`.
- Selected option = lavender filled circle with ink outline.

### 10.4 Buttons `.st-btn`

**Base:** pill, `2px solid line`, padding `14px 24px`, 16px/700, line-height 1, gap `10px`, trailing arrow `→` (or `↗` for external).

| Variant               | Background                      | Text  | Shadow (rest → hover → active)                               |
| --------------------- | ------------------------------- | ----- | ------------------------------------------------------------ |
| **Primary (default)** | `#FFB0C2` pink                  | ink   | `5px pink-shade #FF7EA3` → `7px` → `2px`                     |
| `.ghost`              | `#FFF8F8` card                  | ink   | `5px lav-shade #9E5ECF` → `7px` → `2px`                      |
| `.lav`                | `#C98CF0`                       | ink   | `5px #9E5ECF` → `7px`                                        |
| `.green`              | `#93F091`                       | ink   | `5px #4FCD4C` → `7px`                                        |
| `.yellow`             | `#FFB500`                       | ink   | `5px #FF9100` → `7px`                                        |
| `.link`               | transparent, border transparent | ink   | none; underline `2px #FF7EA3`, offset `5px`, padding-x `4px` |
| `[disabled]`          | card                            | smoke | none, **dashed border**, not-allowed                         |

**Sizes:** default `14×24 / 16px` · `.sm` `9×16 / 14px` with `3px` shadow (ghost-sm keeps lav shade).
**Pattern:** primary pink + ghost side-by-side in heroes; carousels use square-ish ghost arrow buttons (`←` `→`), disabled one is dashed.

### 10.5 Icon button `.st-icon-btn`

`36×36`, circle, `2px line`, bg `card`; hover `translate(-1px,-1px)` + `2px 2px 0 lav-shade`; active resets. Focus `2px accent` ring.

### 10.6 Eyebrow `.st-eyebrow`

Dark pill above headings: bg `panel #1F1A23`, text `on-panel`, mono 13px UPPERCASE, `0.08em`, padding `9px 16px`, gap `10px`, leading colored dot (pink/green/lav pulsing). Copy pattern: `LABEL · DETAIL` (e.g. `USE CASE: GAMING`, `CASE STUDY · CLAWCHAIN.AI`, `LIVE ON MAINNET SINCE JULY 2024`).
`.ghost` variant: card bg + ink text (e.g. `DEVELOPER INTEGRATION`, `LANGUAGES`).

### 10.7 Tag `.st-tag`

Pill, `2px line`, bg pink (default), text on-fill 13px/700, line-height 1.1, padding `5px 12px`, `white-space: nowrap`.
Variants: `.ghost` (card), `.lav`, `.green`, `.yellow`; `.sm` → `1.5px` border, `3px 9px`, 12px. Some marketing tags are **rotated ~-4°** ("Listed on Binance ↗") for a hand-placed sticker feel.

### 10.8 Status chip `.st-chip`

Pill, `2px #1F1A23`, 12px/700, line-height 1.4, padding `2px 10px`.

| Class                    | Fill               | Meaning           |
| ------------------------ | ------------------ | ----------------- |
| `.is-ok` / `.v-ALLOW`    | green `#93F091`    | Allowed / success |
| `.is-bad` / `.v-BLOCK`   | pink `#FFB0C2`     | Blocked / failure |
| `.is-warn` / `.v-REVIEW` | yellow `#FFB500`   | Needs review      |
| `.is-info`               | lavender `#C98CF0` | Info              |
| `.is-idle`               | card               | Neutral / idle    |

### 10.9 Number badge `.st-num`

`48×48` circle, `2px line`, poster font 24px, color on-fill, fill = the card's tint. Positioned `absolute; top:-22px; left:22px` — it **overlaps the card's top edge**. `.inline` = static; `.sm` = `32×32 / 16px`.

### 10.10 Sticker shapes `.st-stk` (decorative floaters)

Ink border + `4px 4px 0 line` shadow, 700 weight, centered icon at 40%.

- `.circle` — 92px (mobile 64px), e.g. pink circle with ⚡, green circle with ✓.
- `.hex` — 100×88 (mobile 70×62), `clip-path` hexagon, **no border/shadow**, usually yellow with ★.
- `.pill` — 48px high pill, padding `0 20px`, 16px.
  Placed overlapping the corners of hero illustrations and CTA blocks, with idle float animation.

### 10.11 Cards `.st-card`

- bg `card`, text ink, `2px line`, radius `28px`, shadow `8px 8px 0 var(--st-shade, ink)`, `position: relative`.
- Sizes: default (lg) · `.sm` (radius 18, shadow 3) · `.xs` (radius 12, shadow 3).
- `.flat` = no shadow. `.st-lift` / `a.st-card` = hover lift (see §8.1).
- **Color modifiers:**
  - `.c-lav / .c-pink / .c-green / .c-yellow` → **filled** card: bg = tint, shadow = shade, all text forced to `on-fill`.
  - `.s-lav / .s-pink / .s-green / .s-yellow` → **shadow-only**: card stays `#FFF8F8`, only the offset shadow takes the shade color.
- **Feature card anatomy:** number badge (overlapping top-left) → H4 (24/600) → body 16px. Grids of 3–4, cycling shadow colors (lav → pink → green → yellow).
- **Logo card (Partners):** large square card, centered partner logo, ink shadow, category tag.
- **Link card (Press / Explorer / Vault):** dark rounded-square icon tile (`#1F1A23`, ~radius 16) + title + `↗`/`→` aligned right.
- **dApp card:** category tag, logo tile, title, body, dashed divider, footer row `live on mainnet … visit →` in mono.
- **Before / After compare:** "Before" card = `paper` bg + **dashed hairline border, no shadow** + ghost mono tag `BEFORE`; "After" card = solid card + lavender shade + lav tag `WITH CHROMIA`. Bullets use `–` for before and `→` (pink) for after.

### 10.12 Well `.st-well`

Recessed surface: bg `paper`, `1.5px solid hairline-2`, radius `12px`. For inline readouts, notices (e.g. simulator disclaimer strip in yellow-tinted variant).

### 10.13 Dark stat strip `.st-strip`

bg `panel`, text `on-panel`, `2px line`, radius `28px`. 4 columns split by `panel-line` vertical dividers. Each column: colored dot + mono UPPERCASE label → `.st-big` poster number (unit/suffix like `%`, `M+`, `K+` in **yellow `#FFB500`**) → muted caption (`on-panel-muted`, e.g. `since mainnet launch · jul 2024`). Numbers animate (rolling digits).

### 10.14 Stat card `.st-stat` / `.st-stat-value`

Inside a card: mono label (smoke) → poster value `clamp(38px,4vw,60px)`, tabular numbers, unit colored `accent` → mono caption. On colored fills (`.c-*`) everything goes on-fill. Simulator KPI tiles use mono values instead of poster (e.g. `1,386M`), positive values in `live` green.

### 10.15 Terminal / activity feed `.st-term`

Dark panel (`panel`), `2px line`, radius `24px`, shadow `8px 8px 0 lav-shade`. Rows separated by dashed `panel-line`: round status icon (✕ pink / ✓ green / ⏸ yellow) → mono function name in **lavender** (`export_dataset`) + body caption → status chip (BLOCK/ALLOW/REVIEW) → mono timestamp (`2s`).

### 10.16 Table `.st-table-wrap` / `.st-table`

- Wrapper: card bg, `2px line`, radius `18px`, shadow `5px 5px 0 shade`, `overflow-x: auto`.
- `thead th`: mono 11px UPPERCASE `0.08em`, color smoke, bg `paper`, padding `14px 18px`; `.is-accent` header in accent purple (used for the "Chromia" column).
- `tbody td`: ink, vertical-align top, hairline row dividers; comparison columns often set in mono.
- Modifiers: `.num` (right-aligned tabular), `.mono`, `.dense`.

### 10.17 Readout list `.st-readout` (dl)

Two-column key/value: `dt` mono 12px UPPERCASE `0.06em` smoke, padding `12px 16px 12px 0`; `dd` mono 14px ink, padding `12px 0`, hairline dividers. Used for tx/block details and payment receipts.

### 10.18 Forms

- **Field** `.st-field`: column, gap `8px`. Label 14px/700 ink. Hint 13px smoke. Error 13px/700 `down`.
- **Input / Select / Textarea**: `min-height: 48px`, bg card, `2px line`, radius `14px`, padding `12px 16px`, 16px; placeholder `ash`.
  - Focus: `4px 4px 0 lav-shade` + `translate(-1px,-1px)`, no outline.
  - Error (`[aria-invalid]` / `.is-error`): border `down`, shadow `3px 3px 0 down`.
  - Disabled: bg paper, text smoke, dashed border.
  - `.mono` variant: mono font 15px (hashes/addresses).
- **Input group** `.st-input-group`: pill container, padding `6px 6px 6px 16px`, gap 8, borderless inner input + trailing button (Explorer search).
- **Underline search** (Partners): borderless input with hairline bottom border + square outlined icon button.
- **Range slider** `.chr2-range`: height 28; track `paper`, `2px line`, pill, 10px tall; thumb `22×22` lavender circle, `2px line`, shadow `2px 2px 0 line`; focus `2px accent` ring. Paired with label left + mono value right.
- **Preset buttons (segmented grid):** inactive = `paper-2` fill, hairline border, no shadow; active = lavender fill + ink border + shadow.
- **Filter tabs (Partners):** horizontal scroll row of outlined pills, UPPERCASE 13px/600; active = lavender fill; a thin progress-style scrollbar underneath.

### 10.19 Code block `.st-code`

bg `#1A1520`, text `#F0E8EE`, `2px line`, radius `18px`, shadow `5px 5px 0 lav-shade`. Top bar `.st-code-bar`: padding `10px 18px`, gap 12, divider below, mono UPPERCASE step title (`1 · CREATE THE PAYMENT`). `pre`: mono 13px / 22.1px, padding `20px`. **No syntax highlighting** — monochrome by design.

### 10.20 States

- **Empty** `.st-state`: centered, `2px dashed hairline-2`, radius 18, bg surface, text smoke, padding `40px 24px`, gap 12; title 16/700 ink.
- **Error** `.st-state.is-error`: solid border `down`, bg `pink @ 16%` mixed with card (`≈ #FFECEF`), title in `down`.
- **Offline / unavailable pill:** dashed pill, smoke text (e.g. `clawchain.ai — temporarily offline`).
- **Skeleton** `.st-skel`: radius 8, min-height 1em, shimmering gradient 200% wide, 1.4s loop.

### 10.21 FAQ / Accordion (`<details>`)

Card bg, `2px line`, radius `12px`, shadow `3px 3px 0 ink`. `summary`: mono 11px UPPERCASE, padding `14px 16px`, with `▸` marker; also used for "▸ MORE ASSUMPTIONS".

### 10.22 Timeline carousel (Roadmap / About)

Horizontal line (pink on Roadmap, ink with a hand-drawn squiggle intro on About) with nodes: active node = large lavender/violet circle (`#C98CF0` / `#7C3AED`) inside a soft halo; done = green circle with ✓ (`#22C55E` on `#93F091` halo); upcoming = small node. Year pill above each node (green for done, filled for current, faded for future). Title in poster font, centered body. Non-active items are faded (~45% opacity). Navigation via ghost arrow buttons.

### 10.23 Illustration frame `.st-illus`

Large card (cream fill, ink outline, colored shade) with padding `18px`; inner radius `16px`. Decorated with overlapping sticker shapes on corners. Dark mode adds a radial lavender glow.

### 10.24 CTA blocks

- **Big sticker CTA:** full-width `.st-card` (often `.c-pink` / lav shade) with H2 + lede + buttons + sticker shapes.
- **"Join the community"** (every page bottom): pink filled card `#FFB0C2`, H2 poster, avatar stack + "270k users…" line, social buttons = small dark tiles with brand icon (X, Telegram `#24A1DE`, Discord `#5865F2`, YouTube `#FF0033`) and lavender shade.

### 10.25 Footer `footer.st-footer`

Footer card: bg `#1F1A23`, text `#FFF8F8`, `2px line`, radius `32px`, shadow `8px 8px 0 #9E5ECF`. Layout: brand column (logo + one-paragraph tagline) + 4 link columns with **mono UPPERCASE lavender headings** (PROTOCOL · ECOSYSTEM · COMPANY · SIGNAL). Bottom bar `.st-foot-bar`: mono uppercase `CHROMIA · MAINNET` | `STATUS · ● OPERATIONAL` (live dot + text in green `#93F091`) | `© 2026 CHROMAWAY AB`.

### 10.26 App shell — Chat (`/chat`)

Left sidebar (240px, card bg, right hairline) with mono section labels (CHAT / CHATS / RESOURCES), nav items as pills (active = pink fill + ink border), "New chat" outlined pill input. Main: centered poster H1 + mono UPPERCASE subtitle (`LOCAL · WEBASSEMBLY · NO SERVER`), composer card (card bg, 2px ink, radius 22, shadow `6px 6px 0 ink`) with a mono status bar on top, pill tool buttons below, circular send button; suggestion cards = `.st-card.sm` with lift.

### 10.27 Payment widget (Chromia Pay hero)

Card with merchant row (avatar + name + green status chip) → mono label `CUSTOMER PAYS` → poster amount `1,250.00` + mono `CHR` → readout rows (Order / Pay with / Settles to) → full-width pink CTA → mono footnote `DIRECT SETTLEMENT · NO POOLED CUSTODY`.

---

## 11. Iconography & Illustration

- **UI icons:** thin outline glyphs (Lucide-like, ~1.5–2px stroke), ink color; inside stickers at 40% size.
- **Arrows as language:** `→` internal action, `↗` external link, `←/→` carousel, `⌄` dropdown, `▸` disclosure.
- **Status glyphs:** ✓ (green), ✕ (pink), ⏸ (yellow), ★ (yellow hex), ⚡ (pink circle), 🛡 (lavender circle).
- **Illustrations:** monoline black-ink hand-drawn doodles — little round characters, filing cabinets, ledgers, receipts — with **handwritten lowercase annotations and curved arrows**, minimal pink highlights. Always framed inside a sticker card; never full-bleed photos. In dark mode, line art inverts to light strokes on a purple-tinted frame.
- **Logo:** wordmark "Chromia" — "Chr" in pink→lavender gradient with a small lavender dot above "C", "omia" in ink.

---

## 12. Content & Voice Patterns

| Pattern                                                                     | Example                                                                                             |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| H1 = short declarative sentence, ends with a period, accent words in purple | "Fully on-chain **worlds**." / "Where dapps **live**." / "The token that pays for **block space**." |
| Eyebrow = mono UPPERCASE, `LABEL · DETAIL`                                  | `CASE STUDY · EVALENGINE.AI`                                                                        |
| Lede = plain language, concrete, 2–4 sentences                              | "Players never pay gas, and every game gets a chain of its own."                                    |
| Card title = outcome-oriented, sentence case                                | "It keeps a record you can trust"                                                                   |
| CTAs = verb + arrow                                                         | "Start building →", "Trade on Binance ↗", "Read the proposal →"                                     |
| Numbers = big, with unit split out                                          | `180M+`, `100%`, `726M`                                                                             |
| Honesty microcopy                                                           | "temporarily offline", "figures are final; the proposal is not yet ratified"                        |

---

## 13. Page Inventory

| Page                                              | Hero type                             | Key components                                                                                                                                             |
| ------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/` Home                                          | Text + framed illustration + stickers | stat strip, filled KPI cards, terminal feed, numbered feature cards (×4 sets), case studies, dApp cards, token CTA card, Explorer/Vault link cards, footer |
| `/architecture`                                   | Text + illustration                   | split heads, before/after compare cards, table (comparison), strip readouts, tags                                                                          |
| `/chromia-pay`                                    | Text + payment widget                 | code blocks ×2, numbered steps, chips                                                                                                                      |
| `/chat`                                           | App shell                             | sidebar, composer, suggestion cards                                                                                                                        |
| `/use-cases/{ai, gaming, data, rwa, dapps, nfts}` | Shared template                       | eyebrow `USE CASE: X`, feature cards, partner/game cards                                                                                                   |
| `/robotics`                                       | Text + illustration                   | numbered cards (13 badges), illus frames                                                                                                                   |
| `/explorer`                                       | Search hero                           | secondary tab bar, input group, cluster/chain cards, labels, chips                                                                                         |
| `/vault`                                          | Separate dApp (see §15)               | dark app shell, side rail, banner carousel, dApp grid                                                                                                      |
| `/token`                                          | Text + stickers                       | mono-heavy data cards, exchange cards, distribution charts, FAQ                                                                                            |
| `/chr-2`                                          | Text + stickers                       | stat cards, tables, FAQ `<details>`, filled cards                                                                                                          |
| `/chr-2/simulator`                                | Tool                                  | range sliders, preset grid, KPI tiles, SVG charts, share button                                                                                            |
| `/developers`                                     | Text + illustration                   | 35 cards, 8 illus, tags, blog cards                                                                                                                        |
| `/whitepaper`                                     | Full-width eyebrow bar + H1           | language cards                                                                                                                                             |
| `/roadmap`                                        | —                                     | timeline carousel, 32 tags                                                                                                                                 |
| `/partners`                                       | —                                     | filter tabs, underline search, 70+ logo cards                                                                                                              |
| `/about`                                          | Text                                  | squiggle timeline, team cards, social cards                                                                                                                |
| `/press`                                          | —                                     | link cards with icon tiles                                                                                                                                 |
| `/privacy-notice`, `/terms-of-service`            | Text                                  | long-form prose                                                                                                                                            |

---

## 14. Accessibility Notes

- Focus is always visible: `3px solid #7D42AB` outline, 3px offset (buttons); 2px for nav/icon buttons/sliders.
- Ink `#1F1A23` on all pastel fills keeps text contrast high (pink/green/yellow/lavender are all light enough).
- Secondary text `smoke #5C5466` on `#F5EEEE` stays readable for body sizes; avoid `pencil #9A90A0` for anything that must be read.
- Disabled states are communicated by **dashed borders + removed shadow**, not color alone.
- `prefers-reduced-motion` kills skeleton, float, pulse and ticker animations.
- ⚠️ Watch-outs if you reuse it: accent `#7D42AB` on dark `#15111A` is low-contrast — that's why dark mode swaps accent to `#D6A6F5`. Faded timeline items (~45% opacity) fail contrast; keep them non-essential.

---

## 15. Vault dApp Palette (`/vault`, product skin `--cw-*`)

Vault is a separate React app (dark by default) using the ChromaWay core palette:

| Name         | Light     | Dark      |
| ------------ | --------- | --------- |
| chromia-dark | `#1F1A23` | `#17111B` |
| off-white    | `#FFF8F8` | `#F5EEEE` |
| red          | `#FF405E` | `#D41A45` |
| orange       | `#FF702B` | `#EB4521` |
| steel-blue   | `#4D617D` | `#2F4968` |
| purple       | `#CC91F0` | `#9E5ECF` |
| soft-pink    | `#FFB0C2` | `#FF87A6` |
| yellow       | `#FFB500` | `#FF9100` |
| green        | `#93F091` | `#4FCD4C` |

Grays: `#7B7B7B · #393939 · #1E191E · #292529 · #FFFFFF`
Off-white alphas: 72% `#FFF8F8B2` · 36% `#FFF8F85C` · 18% `#FFF8F82E` · 9% `#FFF8F817` · 3% `#FFF8F808` (opaque equivalents on dark: `#C0BABC · #706A70 · #474249 · #332E36 · #262129`).
Shadows: card `0 4px 128px rgba(0,0,0,.09), 0 4px 16px rgba(0,0,0,.18)` — **soft** shadows here, unlike the marketing site. Body bg `#15111A`, side rail with lavender shade edge, pink "Connect" CTA.

---

## 16. Implementation

### 16.1 CSS tokens (drop-in)

```css
:root {
  /* fonts */
  --font-poster: "battlefin", "Fraunces", Impact, "Arial Black", sans-serif;
  --font-sans: "NB International", Inter, Helvetica, Arial, sans-serif;
  --font-mono:
    "NB International Mono", "JetBrains Mono", ui-monospace, Menlo, monospace;

  /* sticker palette */
  --color-st-lav: #c98cf0;
  --color-st-lav-shade: #9e5ecf;
  --color-st-pink: #ffb0c2;
  --color-st-pink-shade: #ff7ea3;
  --color-st-green: #93f091;
  --color-st-green-shade: #4fcd4c;
  --color-st-yellow: #ffb500;
  --color-st-yellow-shade: #ff9100;
  --color-on-fill: #1f1a23;

  /* neutrals (light) */
  --color-surface: #f5eeee;
  --color-surface-grid: #faf5f5;
  --color-paper: #ece3e5;
  --color-paper-2: #e3d8db;
  --color-card: #fff8f8;
  --color-ink: #1f1a23;
  --color-ink-2: #2a2430;
  --color-graphite: #3a3340;
  --color-smoke: #5c5466;
  --color-ash: #6b6474;
  --color-pencil: #9a90a0;
  --color-hairline: #dccfd3;
  --color-hairline-2: #c7b8be;
  --color-line: #1f1a23;
  --color-shadow: #1f1a23;
  --color-panel: #1f1a23;
  --color-on-panel: #fff8f8;
  --color-on-panel-muted: #cdc4cc;
  --color-panel-line: #4a4050;

  /* semantic */
  --color-accent: #7d42ab;
  --color-live: #0b7a52;
  --color-warn: #8f5f00;
  --color-down: #b42f2f;
  --color-code-bg: #1a1520;
  --color-code-text: #f0e8ee;

  /* gradients */
  --gradient-chroma: linear-gradient(
    90deg,
    #9e5ecf 0%,
    #ff7ea3 50%,
    #ffb500 100%
  );
  --gradient-spectrum: linear-gradient(
    90deg,
    #c98cf0 0%,
    #9e5ecf 30%,
    #ff7ea3 62%,
    #ffb500 100%
  );
  --gradient-violet: linear-gradient(135deg, #ff7ea3 0%, #9e5ecf 100%);

  /* geometry */
  --st-radius: 28px;
  --st-radius-sm: 18px;
  --st-radius-xs: 12px;
  --st-border: 2px;
  --st-shadow-lg: 8px;
  --st-shadow-md: 5px;
  --st-shadow-sm: 3px;
  --st-shade: var(--color-st-lav-shade);
  --st-tint: var(--color-st-lav);
}

:root[data-theme="dark"] {
  --color-surface: #15111a;
  --color-surface-grid: #1a1520;
  --color-paper: #1d1723;
  --color-paper-2: #272030;
  --color-card: #221b29;
  --color-ink: #f5eeee;
  --color-ink-2: #e8dfe4;
  --color-graphite: #d0c5d3;
  --color-smoke: #c3b8cc;
  --color-ash: #a99cb2;
  --color-pencil: #6f6378;
  --color-hairline: #3a3042;
  --color-hairline-2: #4a3f53;
  --color-line: #6b5a7c;
  --color-shadow: #9e5ecf;
  --color-panel: #2c2433;
  --color-panel-line: #4f4459;
  --color-accent: #d6a6f5;
  --color-live: #3fd29a;
  --color-warn: #e3b341;
  --color-down: #ff8a8a;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* same values as [data-theme="dark"] */
  }
}
```

### 16.2 Core component CSS

```css
.st-card {
  background: var(--color-card);
  color: var(--color-ink);
  border: var(--st-border) solid var(--color-line);
  border-radius: var(--st-radius);
  box-shadow: var(--st-shadow-lg) var(--st-shadow-lg) 0
    var(--st-shade, var(--color-shadow));
  position: relative;
}
.st-lift {
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.st-lift:hover {
  transform: translate(-3px, -3px);
  box-shadow: calc(var(--st-shadow-lg) + 3px) calc(var(--st-shadow-lg) + 3px) 0
    var(--st-shade, var(--color-shadow));
}
.c-pink {
  background: var(--color-st-pink);
  --st-shade: var(--color-st-pink-shade);
  --st-tint: var(--color-st-pink);
}
.s-pink {
  --st-shade: var(--color-st-pink-shade);
  --st-tint: var(--color-st-pink);
}
/* repeat for lav / green / yellow */

.st-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 999px;
  border: var(--st-border) solid var(--color-line);
  background: var(--color-st-pink);
  color: var(--color-on-fill);
  font: 700 16px/1 var(--font-sans);
  box-shadow: 5px 5px 0 var(--color-st-pink-shade);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
  cursor: pointer;
}
.st-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 var(--color-st-pink-shade);
}
.st-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 2px 2px 0 var(--color-st-pink-shade);
}
.st-btn:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}
.st-btn.ghost {
  background: var(--color-card);
  color: var(--color-ink);
  box-shadow: 5px 5px 0 var(--color-st-lav-shade);
}
.st-btn[disabled] {
  background: var(--color-card);
  color: var(--color-smoke);
  box-shadow: none;
  border-style: dashed;
  transform: none;
  cursor: not-allowed;
}

.st-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  border-radius: 999px;
  border: var(--st-border) solid var(--color-line);
  background: var(--color-panel);
  color: var(--color-on-panel);
  font: 400 13px var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.text-h1 {
  font: 900 clamp(46px, 6vw, 88px)/0.94 var(--font-poster);
  letter-spacing: -0.015em;
}
.text-h2 {
  font: 900 clamp(36px, 4.6vw, 68px)/0.96 var(--font-poster);
  letter-spacing: -0.015em;
}
.text-h3 {
  font: 700 clamp(26px, 3vw, 42px)/1.08 var(--font-sans);
  letter-spacing: -0.02em;
}
.text-h4 {
  font: 600 24px var(--font-sans);
  letter-spacing: -0.02em;
}
.st-acc {
  color: var(--color-accent);
}
```

### 16.3 Tailwind v4 `@theme` mapping

```css
@theme {
  --font-poster: var(--font-poster);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --color-surface: var(--color-surface);
  --color-card: var(--color-card);
  --color-ink: var(--color-ink);
  --color-smoke: var(--color-smoke);
  --color-accent: var(--color-accent);
  --color-st-lav: #c98cf0;
  --color-st-lav-shade: #9e5ecf;
  --color-st-pink: #ffb0c2;
  --color-st-pink-shade: #ff7ea3;
  --color-st-green: #93f091;
  --color-st-green-shade: #4fcd4c;
  --color-st-yellow: #ffb500;
  --color-st-yellow-shade: #ff9100;
  --breakpoint-lg: 62.5rem;
  --breakpoint-xl: 68.75rem;
  --radius-sticker: 28px;
  --radius-sticker-sm: 18px;
  --radius-sticker-xs: 12px;
}
```

---

## 17. Do / Don't

| ✅ Do                                                                   | ❌ Don't                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Use 2px ink outlines + flat offset shadows on every interactive surface | Use blurred drop-shadows on the marketing UI (only Vault does that) |
| Pair each tint with its own shade for the shadow                        | Put a pink shadow under a green card                                |
| Keep text on pastel fills **ink** (`#1F1A23`) in both themes            | Use white text on pastel fills                                      |
| Use poster font only for H1/H2 and big numbers                          | Set body copy or buttons in battlefin                               |
| Put labels, captions, table headers in mono UPPERCASE                   | Uppercase the sans body                                             |
| Accent 1–2 words per headline in `#7D42AB`                              | Color whole headlines purple                                        |
| Show disabled with dashed border + no shadow                            | Show disabled by opacity alone                                      |
| Let stickers overlap card corners                                       | Stack stickers inside content flow                                  |
| Use `#F5EEEE` / `#FFF8F8` for surfaces                                  | Use pure `#FFFFFF` backgrounds                                      |
| Cycle shadow colors (lav → pink → green → yellow) across card grids     | Mix more than 4 sticker hues on one screen                          |
