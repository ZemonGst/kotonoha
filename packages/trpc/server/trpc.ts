import { tRPCContext } from "./init";
import { protectedMiddleware } from "./utils/protectedMiddleware";

export const router = tRPCContext.router;

// Open to all — no authentication required.
export const publicProcedure = tRPCContext.procedure;

// Protected — requires a valid access token cookie.
// ctx.userId is guaranteed to be a string inside protected mutations/queries.
export const protectedProcedure = tRPCContext.procedure.use(protectedMiddleware);
