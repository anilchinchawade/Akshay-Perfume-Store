import { Link, useRouteError } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";

export function NotFoundPage() {
  const error = useRouteError();
  const isRouteError = Boolean(error);

  return (
    <Container>
      <section className="flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow">{isRouteError ? "Something went wrong" : "404 · Page not found"}</p>
        <h1 className="section-heading mt-4">A different path awaits.</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-muted">
          The page you are looking for may have moved, or the address may be incorrect.
        </p>
        <Link to="/" className="mt-8"><Button>Return home</Button></Link>
      </section>
    </Container>
  );
}
