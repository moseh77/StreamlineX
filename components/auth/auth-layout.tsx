import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Boxes, Sparkles, Users } from "lucide-react"

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Boxes,
    title: "Visual system diagrams",
    description: "Map architecture onto a live, shareable canvas.",
  },
  {
    icon: Users,
    title: "Real-time collaboration",
    description: "Live cursors and presence across your whole team.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted architecture",
    description: "Describe a system in plain English and refine it visually.",
  },
]

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-base">
      <div className="hidden w-full max-w-xl flex-col border-r border-surface-border bg-surface px-12 py-12 lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-brand" />
          <span className="text-sm font-semibold text-copy-primary">
            StreamlineX
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl leading-[1.15] font-bold tracking-tight text-copy-primary">
              Design systems at the speed of thought.
            </h1>
            <p className="max-w-sm text-sm text-copy-muted">
              Describe your architecture in plain English and map it to a
              shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="flex flex-col gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-surface-border bg-elevated text-brand">
                  <Icon className="size-4" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-copy-primary">
                    {title}
                  </span>
                  <span className="text-sm text-copy-muted">
                    {description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-copy-faint">
          © {new Date().getFullYear()} StreamlineX. All rights reserved.
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  )
}
