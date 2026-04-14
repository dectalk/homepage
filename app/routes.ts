import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("webspeak", "routes/webSpeak.tsx"),
  route("gameboy", "routes/gameboy.tsx"),
  route("ust", "routes/ust.tsx"),
  route("lintalker", "routes/lintalker.tsx"),
  route("*", "routes/pageNotFound.tsx"),
] satisfies RouteConfig;
