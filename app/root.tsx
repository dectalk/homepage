import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import paul from "./assets/dectalk_buttons/pau16a.gif";

import type { Route } from "./+types/root";
import "./styles/index.scss";
import { PageNotFoundPage } from "./pages/pageNotFound/pageNotFound";
import { CriticalErrorPage } from "./pages/criticalError/crititalError";

export const links: Route.LinksFunction = () => [{ rel: "icon", type: "image/x-icon", href: paul }];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message: string | undefined;
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <PageNotFoundPage />;
    message = error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }

  return <CriticalErrorPage message={message} stack={stack} />;
}
