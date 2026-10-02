import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const DEPLOYMENT_BASE_PATH = "/afterhours-1.0";

function getBasePath() {
  if (typeof window === "undefined") return DEPLOYMENT_BASE_PATH;
  return window.location.pathname === DEPLOYMENT_BASE_PATH ||
    window.location.pathname.startsWith(`${DEPLOYMENT_BASE_PATH}/`)
    ? DEPLOYMENT_BASE_PATH
    : "/";
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    basepath: getBasePath(),
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
