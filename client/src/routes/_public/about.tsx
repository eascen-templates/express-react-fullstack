import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/about")({
  component: About,
});

function About() {
  return (
    <>
      <section className="container mx-auto grid place-content-center h-[40vh]">
        <h2 className="text-2xl">PLACEHOLDER</h2>
      </section>
      <section className="container mx-auto grid place-content-center h-[40vh]">
        <h2 className="text-2xl">PLACEHOLDER</h2>
      </section>
      <section className="container mx-auto grid place-content-center h-[40vh]">
        <h2 className="text-2xl">PLACEHOLDER</h2>
      </section>
      <section className="container mx-auto grid place-content-center h-[40vh]">
        <h2 className="text-2xl">PLACEHOLDER</h2>
      </section>
    </>
  );
}
