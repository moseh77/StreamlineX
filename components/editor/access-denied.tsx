import Link from "next/link"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-elevated text-copy-muted">
        <Lock className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-copy-primary">
          You don&apos;t have access to this project
        </h1>
        <p className="text-sm text-copy-secondary">
          Ask the owner to share it with you, or head back to your projects.
        </p>
      </div>
      <Button nativeButton={false} render={<Link href="/editor" />}>
        Back to editor
      </Button>
    </div>
  )
}
