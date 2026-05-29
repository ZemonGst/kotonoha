import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import { dashboardService } from "../../services";

import { getMeOutputSchema } from "./model";

const TAGS = ["Dashboard"];
const getPath = generatePath("/dashboard");

// Every route in this router is a GET under /dashboard — getMeta
// captures the repeated openapi shape so each procedure only declares its path + summary.
function getMeta(path: string, summary: string) {
    return {
        openapi: {
            method: "GET" as const,
            path: getPath(path),
            tags: TAGS,
            summary,
        },
    };
}

export const dashboardRouter = router({
    // Get the authenticated user's profile — no input needed, userId comes from ctx.
    getMe: protectedProcedure
        .meta(getMeta("/getMe", "Get the authenticated user's profile"))
        .output(getMeOutputSchema)
        .query(async ({ ctx }) => {
            const { userId } = ctx;
            return dashboardService.getMe(userId);
        }),
});
