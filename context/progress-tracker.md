# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor chrome (context/feature-specs/02-editor-chrome.md)

## Current Goal

- Build the base chrome components reused by every editor screen: the top navbar and the floating left project sidebar, plus confirm the dialog pattern (title/description/footer, token-based styling) is ready for later dialogs.

## Completed

- Design system / UI primitives (01-design-system.md): shadcn/ui installed (`base-nova` style, neutral base, Base UI primitives), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added to `components/ui/`, `lucide-react` installed, `cn()` helper at `lib/utils.ts`. `app/globals.css` theme tokens replaced with the dark-only palette from `context/ui-context.md` (`--bg-base`, `--bg-surface`, `--accent-primary`, etc.) mapped onto shadcn's semantic vars and exposed as extra utilities (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-accent-dim`, ...). `<html>` forced to `dark` in `app/layout.tsx` since there is no light mode. Verified with `tsc --noEmit` and `next build` (both pass).
- Editor chrome (02-editor-chrome.md): `components/editor/editor-navbar.tsx` — fixed-height (`h-14`) top navbar with left/center/right sections, sidebar toggle button (`isSidebarOpen`/`onToggleSidebar` props) swapping `PanelLeftOpen`/`PanelLeftClose`, dark `bg-surface` with bottom border. `components/editor/project-sidebar.tsx` — floating overlay (`fixed`, does not push layout), slides in/out from the left via `translate-x` transition driven by `isOpen`/`onClose` props, header with "Projects" title + close button, shadcn `Tabs` (My Projects / Shared) each with an empty placeholder state, full-width `New Project` button with `Plus` icon pinned at the bottom. Dialog pattern: existing `components/ui/dialog.tsx` (from 01) already supports title/description/footer using token-based styling (`bg-popover`, `border`, etc.) — no new component needed; confirmed ready for the real dialogs in 04-project-dialogs.md. Neither component is wired into a page yet (no `/editor` route exists). Verified with `tsc --noEmit`, `eslint`, and `next build` (all pass).

## In Progress

- None yet.

## Next Up

- Wire `EditorNavbar` / `ProjectSidebar` into an actual `/editor` route (see 07-wire-editor-home.md / 08-editor-workspace-shell.md) and build the real project dialogs (04-project-dialogs.md).

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Add context needed to resume work in the next session.
