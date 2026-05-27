import { TRPCError } from "@trpc/server";

import { tRPCContext } from "../init";
import { getAuthenticationCookie } from "./cookie";
import { userService } from "../services";

// Reads the access token from the HTTP-only cookie, delegates validation to
// userService.requireAuth (stateless, no DB call), and enriches ctx with userId.
// Throws UNAUTHORIZED for missing, invalid, or expired tokens.
export const protectedMiddleware = tRPCContext.middleware(async ({ ctx, next }) => {
    const { accessToken } = getAuthenticationCookie(ctx);

    if (!accessToken) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Access token not found. Please log in.",
        });
    }

    try {
        const { userId } = await userService.requireAuth(accessToken);
        return next({ ctx: { ...ctx, userId } });
    } catch {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid or expired access token. Please log in.",
        });
    }
});
