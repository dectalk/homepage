import type { Route } from "./+types/ust";
import { USTPage } from "../pages/ust/ust";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "UST to DECtalk Converter" },
    { name: "description", content: "Convert UST files to DECtalk phonemes" },
  ];
}

export default function UST() {
  return <USTPage />;
}
