import { MessageSquareOff, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function AiPanelPlaceholder() {
  return (
    <div className="flex w-96 shrink-0 flex-col border-l border-surface-border bg-surface">
      <div className="flex items-start justify-between gap-2 border-b border-surface-border px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-copy-primary">
            AI Copilot
          </span>
          <span className="text-xs tracking-wide text-copy-muted uppercase">
            Placeholder panel
          </span>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="AI panel settings">
          <SlidersHorizontal />
        </Button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <Card>
          <CardContent className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ai/15 text-ai-text">
              <MessageSquareOff className="size-4" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-copy-primary">
                Chat surface pending
              </span>
              <span className="text-sm text-copy-secondary">
                The toggle is wired. Messaging and generation are
                intentionally out of scope here.
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-1 px-1">
          <span className="text-xs font-medium tracking-wide text-copy-muted uppercase">
            Future hooks
          </span>
          <p className="text-sm text-copy-secondary">
            Prompt composer, run status, and architecture guidance will
            attach to this sidebar.
          </p>
        </div>
      </div>
    </div>
  )
}
