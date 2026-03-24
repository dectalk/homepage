import type { Route } from "./+types/home";
import { HomePage } from "~/pages/home/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "dectalk.de/ctalk" },
    { name: "description", content: "unofficial dectalk website" },
  ];
}

export default function Home() {
  return <HomePage />;
}
