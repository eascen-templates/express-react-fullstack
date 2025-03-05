import { RegisterForm } from '@/components/RegisterForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegisterForm className="fixed inset-0 m-auto sm:w-[30rem] max-w-full h-max"/>
}
