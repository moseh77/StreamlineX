"use client"

import { Check, Link as LinkIcon, Mail, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useOrigin } from "@/hooks/use-origin"
import { useShareDialog } from "@/hooks/use-share-dialog"
import type { Collaborator } from "@/types/collaborator"

interface ShareDialogProps {
  projectId: string
  projectName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareDialog({
  projectId,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const {
    collaborators,
    isOwner,
    isLoadingList,
    email,
    setEmail,
    isInviting,
    inviteError,
    inviteCollaborator,
    removingEmail,
    removeCollaborator,
    isCopied,
    copyLink,
  } = useShareDialog(projectId, open)

  const origin = useOrigin()
  const projectLink = origin ? `${origin}/editor/${projectId}` : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            Invite collaborators, copy the workspace link, and manage access.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-elevated/40 px-3 py-2.5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-medium text-copy-primary">
              Workspace link
            </span>
            <span className="truncate text-xs text-copy-muted">
              Share a direct link with teammates after you grant them access.
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            className="shrink-0 rounded-full"
            onClick={copyLink}
            disabled={!projectLink}
          >
            {isCopied ? <Check /> : <LinkIcon />}
            {isCopied ? "Copied!" : "Copy link"}
          </Button>
        </div>

        {isOwner && (
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              inviteCollaborator()
            }}
          >
            <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-full border border-input bg-transparent px-3">
              <Mail className="size-3.5 shrink-0 text-copy-muted" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-copy-primary outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="shrink-0 rounded-full"
              disabled={!email.trim() || isInviting}
            >
              {isInviting ? "Inviting…" : "Invite"}
            </Button>
          </form>
        )}
        {inviteError && <p className="text-xs text-error">{inviteError}</p>}

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide text-copy-muted uppercase">
              People with access
            </span>
            <span className="text-xs text-copy-muted">
              {collaborators.length} total
            </span>
          </div>
          {isLoadingList ? (
            <p className="text-sm text-copy-secondary">Loading…</p>
          ) : collaborators.length === 0 ? (
            <p className="text-sm text-copy-secondary">No collaborators yet.</p>
          ) : (
            <ul className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
              {collaborators.map((collaborator) => (
                <li
                  key={collaborator.email}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-elevated"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <CollaboratorAvatar collaborator={collaborator} />
                    <div className="flex min-w-0 flex-col leading-tight">
                      <span className="flex items-center gap-1.5 truncate text-sm text-copy-primary">
                        <span className="truncate">
                          {collaborator.name ?? collaborator.email}
                        </span>
                        {collaborator.role === "owner" && (
                          <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-medium tracking-wide text-primary uppercase">
                            Owner
                          </span>
                        )}
                      </span>
                      {collaborator.name && (
                        <span className="truncate text-xs text-copy-muted">
                          {collaborator.email}
                        </span>
                      )}
                    </div>
                  </div>
                  {isOwner && collaborator.role !== "owner" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Remove ${collaborator.email}`}
                      disabled={removingEmail === collaborator.email}
                      onClick={() => removeCollaborator(collaborator.email)}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}

function CollaboratorAvatar({ collaborator }: { collaborator: Collaborator }) {
  if (collaborator.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external Clerk avatar URL, next/image would need remote-pattern config for a placeholder feature
      <img
        src={collaborator.imageUrl}
        alt=""
        className="size-8 shrink-0 rounded-full"
      />
    )
  }

  const initial = (collaborator.name ?? collaborator.email)
    .charAt(0)
    .toUpperCase()

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-elevated text-xs font-medium text-copy-secondary">
      {initial}
    </div>
  )
}
