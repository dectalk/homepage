import { GameBoyPage } from "~/pages/gameboy/gameboy";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "GBA - DECtalk Community" }, { name: "description", content: "gameboy emulator" }];
}

export default function GameBoy() {
  return <GameBoyPage />;
}
