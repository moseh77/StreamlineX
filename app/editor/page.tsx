import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"

import { DataUnavailable } from "@/components/editor/data-unavailable"
import { EditorHome } from "@/components/editor/editor-home"
import { getEditorProjects } from "@/lib/projects"

export default async function EditorPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? null

  let ownedProjects
  let sharedProjects
  try {
    ;({ ownedProjects, sharedProjects } = await getEditorProjects(
      userId,
      email
    ))
  } catch (error) {
    console.error("Failed to load projects for /editor:", error)
    return (
      <DataUnavailable
        message="We couldn't load your projects. Check your connection and try again."
        retryHref="/editor"
      />
    )
  }

  return (
    <EditorHome ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
  )
}
