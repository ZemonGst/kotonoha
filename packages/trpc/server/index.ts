import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { dashboardRouter } from "./routes/dashboard/route";
import { formRouter } from "./routes/form/route";
import { draftRouter } from "./routes/draft/route";
import { defaultTemplateRouter } from "./routes/default-template/route";

import { publishFormRouter } from "./routes/publishForm/route";
import { responseRouter } from "./routes/response/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  dashboard: dashboardRouter,
  form: formRouter,
  draft: draftRouter,
  defaultTemplate: defaultTemplateRouter,
  publishForm: publishFormRouter,
  response: responseRouter,
});


export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
