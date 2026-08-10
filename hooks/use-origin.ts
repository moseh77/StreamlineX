import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

export function useOrigin() {
  return useSyncExternalStore(
    emptySubscribe,
    () => window.location.origin,
    () => ""
  )
}
