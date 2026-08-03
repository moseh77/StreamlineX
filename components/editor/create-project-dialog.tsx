"use client"

import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { slugify } from "@/lib/utils"

interface CreateProjectDialogProps {
  open: boolean
  name: string
  isLoading: boolean
  onNameChange: (value: string) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function CreateProjectDialog({
  open,
  name,
  isLoading,
  onNameChange,
  onOpenChange,
  onSubmit,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>
              Give your architecture workspace a name.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Input
              autoFocus
              placeholder="Project name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
            />
            <div className="flex items-center gap-1.5 font-mono text-xs text-copy-muted">
              <span>{name.trim() ? slugify(name) : "your-project-slug"}</span>
              <Pencil className="size-3" />
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button type="submit" disabled={!name.trim() || isLoading}>
              {isLoading ? "Creating…" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
