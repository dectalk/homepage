import type { Route } from "./+types/home";
import { LintalkerPage } from "~/pages/lintalker/lintalkerPage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "LinTalker for Web - DECtalk Community" }, { name: "description", content: "lintalker" }];
}

export default function Lintalker() {
  return <LintalkerPage />;
}
