import { Compass } from "lucide-react"

export function CanvasPlaceholder() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-base bg-[radial-gradient(circle,var(--border-subtle)_1px,transparent_1px)] bg-[length:28px_28px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-accent-dim to-transparent"
      />
      <div className="relative flex max-w-md flex-col items-center gap-4 px-6 text-center animate-in fade-in-50 duration-500">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-dim ring-1 ring-brand/30">
          <Compass className="size-6 text-brand" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs tracking-widest text-copy-muted uppercase">
            Workspace shell
          </span>
          <h2 className="text-2xl font-bold text-copy-primary">
            The canvas lands here next
          </h2>
          <p className="text-sm text-copy-secondary">
            This room is wired for navigation and project access. Real-time
            diagramming and AI-generated architecture connect to it next.
          </p>
        </div>
      </div>
    </div>
  )
}
