import { meQueryOptions } from "@/api/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;

    const user = await queryClient.fetchQuery(meQueryOptions);
    if (user) throw redirect({ to: "/" });
  },
});

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
