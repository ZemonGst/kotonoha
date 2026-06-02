import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { draftService } from "../../services";
import { getAllFormsInputSchema, getAllFormsOutputSchema } from "./model";

const TAGS = ["Draft"];
const getPath = generatePath("/draft");

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

export const draftRouter = router({
    getAllForms: protectedProcedure
        .meta(getMeta("/getAllForms", "Get all forms for the current user"))
        .input(getAllFormsInputSchema)
        .output(getAllFormsOutputSchema)
        .query(async ({ input, ctx }) => {
            const { userId } = ctx;
            return draftService.getAllForms({
                userId,
                status: input.status,
            });
        }),
});
