import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/")({
  component: Index,
});

function Index() {
  const { user } = Route.useRouteContext();
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <p>{JSON.stringify(user)}</p>
    </div>
  );
}
