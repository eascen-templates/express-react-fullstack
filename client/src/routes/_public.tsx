import Navbar from "@/components/Navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2025</p>
      </footer>
    </>
  );
}
