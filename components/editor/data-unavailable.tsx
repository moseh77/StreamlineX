import Link from "next/link"
import { WifiOff } from "lucide-react"

import { Button } from "@/components/ui/button"

interface DataUnavailableProps {
  message?: string
  retryHref: string
}

export function DataUnavailable({
  message = "We couldn't reach the database. Check your connection and try again.",
  retryHref,
}: DataUnavailableProps) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-elevated text-copy-muted">
        <WifiOff className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-copy-primary">
          Couldn&apos;t load this page
        </h1>
        <p className="max-w-sm text-sm text-copy-secondary">{message}</p>
      </div>
      <Button nativeButton={false} render={<Link href={retryHref} />}>
        Try again
      </Button>
    </div>
  )
}
