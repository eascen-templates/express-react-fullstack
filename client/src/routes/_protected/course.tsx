import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/course')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/course"!</div>
}
