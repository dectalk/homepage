import type { Route } from "./+types/home";
import { WebSpeakPage } from "~/pages/webSpeak/webSpeak";

export function meta({}: Route.MetaArgs) {
  return [{ title: "DECtalk for Web - DECtalk Community" }, { name: "description", content: "webspeak" }];
}

export default function WebSpeak() {
  return <WebSpeakPage />;
}
