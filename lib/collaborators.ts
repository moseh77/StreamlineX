import { clerkClient } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"
import type { Collaborator } from "@/types/collaborator"

interface ClerkEnrichment {
  name: string | null
  imageUrl: string
}

async function enrichEmails(
  emails: string[]
): Promise<Map<string, ClerkEnrichment>> {
  const enrichmentByEmail = new Map<string, ClerkEnrichment>()

  if (emails.length === 0) return enrichmentByEmail

  const client = await clerkClient()
  const { data: users } = await client.users.getUserList({
    emailAddress: emails,
  })

  for (const user of users) {
    const enrichment: ClerkEnrichment = {
      name: user.fullName,
      imageUrl: user.imageUrl,
    }
    for (const emailAddress of user.emailAddresses) {
      enrichmentByEmail.set(emailAddress.emailAddress.toLowerCase(), enrichment)
    }
  }

  return enrichmentByEmail
}

function toCollaborator(
  email: string,
  enrichmentByEmail: Map<string, ClerkEnrichment>,
  role: Collaborator["role"] = "member"
): Collaborator {
  const enrichment = enrichmentByEmail.get(email.toLowerCase())

  return {
    email,
    name: enrichment?.name ?? null,
    imageUrl: enrichment?.imageUrl ?? null,
    role,
  }
}

export async function listCollaborators(
  projectId: string
): Promise<Collaborator[]> {
  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { collaboratorEmail: true },
  })

  const enrichmentByEmail = await enrichEmails(
    rows.map((row) => row.collaboratorEmail)
  )

  return rows.map((row) =>
    toCollaborator(row.collaboratorEmail, enrichmentByEmail)
  )
}

export async function enrichCollaboratorEmail(
  email: string
): Promise<Collaborator> {
  const enrichmentByEmail = await enrichEmails([email])
  return toCollaborator(email, enrichmentByEmail)
}

export async function getOwnerCollaborator(
  ownerId: string
): Promise<Collaborator | null> {
  const client = await clerkClient()
  const user = await client.users.getUser(ownerId).catch(() => null)

  if (!user) return null

  const email = user.primaryEmailAddress?.emailAddress ?? null
  if (!email) return null

  return {
    email,
    name: user.fullName,
    imageUrl: user.imageUrl,
    role: "owner",
  }
}
