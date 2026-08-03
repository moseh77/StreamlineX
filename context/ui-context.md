# UI Context

## Theme

Dark only. No light mode. The visual language is a dark technical workspace — near-black backgrounds, layered surfaces, and vivid accent colors for interactive elements.

All colors are defined as CSS custom properties in `globals.css` and mapped to Tailwind tokens via `@theme inline`. Components must use these tokens — no hardcoded hex values or raw Tailwind color classes like `zinc-*`.

| Role             | CSS Variable           | Hex / Value               |
| ---------------- | ---------------------- | ------------------------- |
| Page background  | `--bg-base`            | `#080809`                 |
| Surface          | `--bg-surface`         | `#111114`                 |
| Elevated surface | `--bg-elevated`        | `#18181c`                 |
| Subtle surface   | `--bg-subtle`          | `#1e1e23`                 |
| Default border   | `--border-default`     | `#2a2a30`                 |
| Subtle border    | `--border-subtle`      | `#3a3a42`                 |
| Primary text     | `--text-primary`       | `#f0f0f4`                 |
| Secondary text   | `--text-secondary`     | `#c0c0cc`                 |
| Muted text       | `--text-muted`         | `#808090`                 |
| Faint text       | `--text-faint`         | `#505060`                 |
| Brand accent     | `--accent-primary`     | `#00c8d4` (cyan)          |
| Brand dim        | `--accent-primary-dim` | `rgba(0, 200, 212, 0.12)` |
| AI accent        | `--accent-ai`          | `#6457f9` (indigo-purple) |
| AI text          | `--accent-ai-text`     | `#8b82ff`                 |
| Error            | `--state-error`        | `#ff4d4f`                 |
| Success          | `--state-success`      | `#34d399`                 |
| Warning          | `--state-warning`      | `#fbbf24`                 |

Tailwind utility names map to these variables. Use `bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.

## Text Contrast

Every piece of user-facing text must stay legible against the surface it renders on. Rules:

- Never use `text-copy-faint` for anything informational or interactive (form previews, hints, status text). Reserve it for purely decorative text where legibility doesn't matter. Default to `text-copy-secondary` or `text-copy-muted` instead.
- Disabled states must never rely on a blanket `opacity-*` applied to an element that combines a bright background with near-black/near-white text on top of it (e.g. the `Button` `default` variant: `bg-primary` + `text-primary-foreground`). Dimming both together crushes contrast rather than reducing it evenly. Instead, give the disabled state its own explicit background and text color pairing (e.g. a dimmed background token paired with a still-readable text token like `text-copy-secondary`), and cancel the opacity dimming for that combination.
- When adding a new interactive component (buttons, inputs, badges) or wiring appearance overrides for a third-party component (e.g. Clerk), check the actual rendered contrast of every text/background pairing it introduces — including non-default states like `disabled`, `hover`, and `loading` — not just the resting state.
- When in doubt, prefer `text-copy-primary` or `text-copy-secondary` over the muted/faint tokens.

## Typography

| Role      | Font       | CSS Variable        |
| --------- | ---------- | ------------------- |
| UI text   | Geist Sans | `--font-geist-sans` |
| Code/mono | Geist Mono | `--font-geist-mono` |

Both fonts are loaded via `next/font/google` and applied as CSS variables on the `<html>` element. The base `body` uses Geist Sans with `antialiased`.

### Minimum Sizes & Weights

Small, thin, dim text is the default failure mode in this app — it has already shipped twice (Clerk's default button text, a dialog title/description) before being caught. Treat these as floors, not just defaults:

| Role                              | Minimum          | Default color            |
| ---------------------------------- | ---------------- | ------------------------- |
| Page / screen heading (h1)         | `text-2xl` `font-bold`   | `text-copy-primary`       |
| Dialog / section title             | `text-lg` `font-semibold` | `text-copy-primary`       |
| Body copy / descriptions           | `text-sm` (never smaller as the primary read) | `text-copy-secondary`     |
| Buttons                            | `text-sm` `font-medium` | inherits variant           |
| Incidental annotations (slugs, timestamps, code previews) | `text-xs` `font-mono` allowed | `text-copy-muted` minimum — never `text-copy-faint` |

Never use `text-muted-foreground` (shadcn's default, maps to a dim gray) for anything meant to be read as primary or secondary content — use the app's own `text-copy-secondary` / `text-copy-primary` tokens instead. When adding or editing a **shared** `components/ui/*` primitive (Dialog, Card, etc.), fix its typography defaults there — a fix applied only to one call site will resurface the next time that primitive is used elsewhere.

## Border Radius

Radius increases with surface depth — smaller for inner elements, larger for outer containers.

| Context           | Class         |
| ----------------- | ------------- |
| Inline / small UI | `rounded-xl`  |
| Cards / panels    | `rounded-2xl` |
| Modal / overlay   | `rounded-3xl` |

## Canvas

### Node Color Palette

8 defined color pairs. Each pair specifies a dark node fill and a vivid contrasting text color tuned for readability on the dark canvas. Defined in `types/canvas.ts` as `NODE_COLORS`.

| Node fill | Text color | Character              |
| --------- | ---------- | ---------------------- |
| `#1F1F1F` | `#EDEDED`  | Neutral dark (default) |
| `#10233D` | `#52A8FF`  | Blue                   |
| `#2E1938` | `#BF7AF0`  | Purple                 |
| `#331B00` | `#FF990A`  | Orange                 |
| `#3C1618` | `#FF6166`  | Red                    |
| `#3A1726` | `#F75F8F`  | Pink                   |
| `#0F2E18` | `#62C073`  | Green                  |
| `#062822` | `#0AC7B4`  | Teal                   |

Default node color: `#1F1F1F` with `#EDEDED` text.

### Edge Style

Smooth-step path with an arrow marker. Default edge color: `#f8fafc`. Stroke width is thin — edges are visually secondary to nodes.

### Node Shapes

6 supported shapes, defined in `types/canvas.ts` as `NODE_SHAPES`. Complex shapes (diamond, hexagon, cylinder) are rendered as inline SVGs rather than CSS borders.

- `rectangle` — default general-purpose node
- `diamond` — decision / gateway
- `circle` — event / endpoint
- `pill` — service / process
- `cylinder` — database / storage
- `hexagon` — external system / boundary

### Connection Handles

Small white circular handles, hidden by default, revealed on node hover. Appear at all four sides of a node.

### Canvas Background

React Flow `<Background>` component. Canvas sits on the base background color.

## Component Library

shadcn/ui on top of Tailwind. No custom design system. Components live in `components/ui/`. Use the `shadcn` CLI to add new components rather than writing them from scratch.

## Layout Patterns

- Editor workspace: full-viewport layout — floating sidebar overlay on the left, center canvas, slide-over AI sidebar on the right.
- Sidebars: floating overlay with dark semi-transparent background and subtle border.
- Modals and dialogs: centered overlay, `rounded-3xl`, dark background with backdrop blur.
- Navbar: top bar with dark background and bottom border.

## Icons

Lucide React. Stroke-based icons only — no filled variants. Icon sizes: `h-4 w-4` for inline, `h-5 w-5` for buttons, `h-8 w-8` for feature icons in empty states.
