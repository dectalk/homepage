import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("gameboy", "routes/gameboy.tsx")] satisfies RouteConfig;
