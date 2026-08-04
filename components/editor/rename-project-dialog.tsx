"use client"

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
import type { Project } from "@/types/project"

interface RenameProjectDialogProps {
  open: boolean
  project: Project | null
  name: string
  isLoading: boolean
  onNameChange: (value: string) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function RenameProjectDialog({
  open,
  project,
  name,
  isLoading,
  onNameChange,
  onOpenChange,
  onSubmit,
}: RenameProjectDialogProps) {
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
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              Currently named “{project?.name}”.
            </DialogDescription>
          </DialogHeader>

          <Input
            autoFocus
            placeholder="Project name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
          />

          <DialogFooter>
            <Button type="submit" disabled={!name.trim() || isLoading}>
              {isLoading ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
