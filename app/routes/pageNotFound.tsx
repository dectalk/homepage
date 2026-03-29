import { PageNotFoundPage } from "~/pages/pageNotFound/pageNotFound";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Page Not Found - DECtalk Community" },
    { name: "description", content: "unofficial dectalk website" },
  ];
}

export default function PageNotFound() {
  return <PageNotFoundPage />;
}
