import { meQueryOptions } from "@/api/auth";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;

    const user = await queryClient.fetchQuery(meQueryOptions);

    if (!user) throw redirect({ to: "/login" });

    return { user: user };
  },
});

function RouteComponent() {
  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <Outlet />
      </SidebarProvider>
    </main>
  );
}
