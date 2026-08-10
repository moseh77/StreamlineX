import { NextRequest, NextResponse } from "next/server"

import {
  enrichCollaboratorEmail,
  getOwnerCollaborator,
  listCollaborators,
} from "@/lib/collaborators"
import { getCurrentIdentity } from "@/lib/project-access"
import { prisma } from "@/lib/prisma"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 320

type RouteContextType = RouteContext<"/api/projects/[projectId]/collaborators">

export async function GET(_request: NextRequest, context: RouteContextType) {
  const identity = await getCurrentIdentity()

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const isOwner = project.ownerId === identity.userId
  const isCollaborator =
    !isOwner &&
    identity.email !== null &&
    (await prisma.projectCollaborator.findUnique({
      where: {
        projectId_collaboratorEmail: {
          projectId,
          collaboratorEmail: identity.email,
        },
      },
    })) !== null

  if (!isOwner && !isCollaborator) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const [owner, members] = await Promise.all([
    getOwnerCollaborator(project.ownerId),
    listCollaborators(projectId),
  ])

  const collaborators = owner
    ? [
        owner,
        ...members.filter(
          (member) => member.email.toLowerCase() !== owner.email.toLowerCase()
        ),
      ]
    : members

  return NextResponse.json({ collaborators, isOwner })
}

export async function POST(request: NextRequest, context: RouteContextType) {
  const identity = await getCurrentIdentity()

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== identity.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""

  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required" },
      { status: 400 }
    )
  }

  await prisma.projectCollaborator.upsert({
    where: {
      projectId_collaboratorEmail: { projectId, collaboratorEmail: email },
    },
    update: {},
    create: { projectId, collaboratorEmail: email },
  })

  const collaborator = await enrichCollaboratorEmail(email)

  return NextResponse.json({ collaborator }, { status: 201 })
}

export async function DELETE(request: NextRequest, context: RouteContextType) {
  const identity = await getCurrentIdentity()

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== identity.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 })
  }

  const { count } = await prisma.projectCollaborator.deleteMany({
    where: { projectId, collaboratorEmail: email },
  })

  if (count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return new NextResponse(null, { status: 204 })
}
