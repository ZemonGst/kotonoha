import { initTRPC } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";

// Single source of truth for the tRPC instance.
// Imported by trpc.ts (router/procedures) and utils that need .middleware().
export const tRPCContext = initTRPC
    .meta<OpenApiMeta>()
    .context<typeof createContext>()
    .create({});
