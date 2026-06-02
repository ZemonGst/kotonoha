import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { dashboardRouter } from "./routes/dashboard/route";
import { formRouter } from "./routes/form/route";
import { draftRouter } from "./routes/draft/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  dashboard: dashboardRouter,
  form: formRouter,
  draft: draftRouter,
});


export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
