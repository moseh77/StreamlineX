# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Auth (context/feature-specs/03-auth.md)

## Current Goal

- Wire Clerk into the Next.js app end-to-end: `ClerkProvider`, sign-in/sign-up pages, `proxy.ts` route protection, `/` redirect logic, and the `UserButton` in the editor navbar.

## Completed

- Design system / UI primitives (01-design-system.md): shadcn/ui installed (`base-nova` style, neutral base, Base UI primitives), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added to `components/ui/`, `lucide-react` installed, `cn()` helper at `lib/utils.ts`. `app/globals.css` theme tokens replaced with the dark-only palette from `context/ui-context.md` (`--bg-base`, `--bg-surface`, `--accent-primary`, etc.) mapped onto shadcn's semantic vars and exposed as extra utilities (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-accent-dim`, ...). `<html>` forced to `dark` in `app/layout.tsx` since there is no light mode. Verified with `tsc --noEmit` and `next build` (both pass).
- Editor chrome (02-editor-chrome.md): `components/editor/editor-navbar.tsx` — fixed-height (`h-14`) top navbar with left/center/right sections, sidebar toggle button (`isSidebarOpen`/`onToggleSidebar` props) swapping `PanelLeftOpen`/`PanelLeftClose`, dark `bg-surface` with bottom border. `components/editor/project-sidebar.tsx` — floating overlay (`fixed`, does not push layout), slides in/out from the left via `translate-x` transition driven by `isOpen`/`onClose` props, header with "Projects" title + close button, shadcn `Tabs` (My Projects / Shared) each with an empty placeholder state, full-width `New Project` button with `Plus` icon pinned at the bottom. Dialog pattern: existing `components/ui/dialog.tsx` (from 01) already supports title/description/footer using token-based styling (`bg-popover`, `border`, etc.) — no new component needed; confirmed ready for the real dialogs in 04-project-dialogs.md. Wired into a real `/editor` preview page (`app/editor/page.tsx`) with local toggle state. Verified with `tsc --noEmit`, `eslint`, and `next build` (all pass).
- Auth (03-auth.md): installed `@clerk/ui` (provides the `dark` theme at `@clerk/ui/themes`). `proxy.ts` at the project root (this Next.js version renamed `middleware.ts` → `proxy.ts`, confirmed in `node_modules/next/dist/docs`) uses `clerkMiddleware` + `createRouteMatcher` to protect every route except `/`, `/sign-in(.*)`, `/sign-up(.*)` (matcher paths sourced from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` env vars). `app/layout.tsx` wraps the tree in `ClerkProvider` using Clerk's `dark` theme as the base with `variables` overridden to the app's existing CSS custom properties (`colorPrimary: var(--accent-primary)`, `colorBackground: var(--bg-surface)`, etc.) — no hardcoded colors. `app/page.tsx` is now a server component that checks `auth()` and redirects: authenticated → `/editor`, unauthenticated → `/sign-in`. `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` render Clerk's `<SignIn />`/`<SignUp />` inside a shared `components/auth/auth-layout.tsx` (two-panel on `lg:`, form-only below that — left panel has logo/tagline/text-only feature list, no gradients/hero/cards). `UserButton` added to `EditorNavbar`'s right section. Env vars used: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (already provided by user in `.env.local`), plus `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`, `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/editor`, `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/editor` (added — didn't exist before). Verified with `tsc --noEmit`, `eslint`, `next build`, and a live `next dev` run: unauthenticated `/` → 307 to `/sign-in`, unauthenticated `/editor` → 307 to `/sign-in?redirect_url=...`, `/sign-in` and `/sign-up` → 200 and render the two-panel layout with the mapped CSS-variable theme.

## In Progress

- None yet.

## Next Up

- Build the real project dialogs and `/editor` home content (04-project-dialogs.md), then Prisma + project ownership (05-prisma.md), which is what the Clerk user ID from this phase will be mapped to.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Auth is Clerk, protected by default at the proxy level (`proxy.ts`, allow-list of public routes) rather than per-page checks — matches 03-auth.md's "protect everything else by default" requirement and keeps future routes secure without remembering to add checks.

## Session Notes

- Add context needed to resume work in the next session.
