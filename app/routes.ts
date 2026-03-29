import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("webspeak", "routes/webSpeak.tsx"),
  route("gameboy", "routes/gameboy.tsx"),
  route("*", "routes/pageNotFound.tsx"),
] satisfies RouteConfig;
