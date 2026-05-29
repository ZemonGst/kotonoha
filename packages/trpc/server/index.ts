import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { dashboardRouter } from "./routes/dashboard/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  dashboard: dashboardRouter,
});


export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
