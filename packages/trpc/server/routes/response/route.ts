import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import ResponseService from "../../../../services/response";
import {
    submitResponseRouteInputSchema,
    submitResponseRouteOutputSchema,
    getResponsesRouteInputSchema,
    getResponsesRouteOutputSchema,
    getResponseCountRouteInputSchema,
    getResponseCountRouteOutputSchema,
} from "./model";

const responseService = new ResponseService();

const TAGS = ["Response"];
const getPath = generatePath("/response");

function postMeta(path: string, summary: string) {
    return {
        openapi: {
            method: "POST" as const,
            path: getPath(path),
            tags: TAGS,
            summary,
        },
    };
}

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

export const responseRouter = router({
    submitResponse: publicProcedure
        .meta(postMeta("/submitResponse", "Submit a response to a published form"))
        .input(submitResponseRouteInputSchema)
        .output(submitResponseRouteOutputSchema)
        .mutation(async ({ input }) => {
            const success = await responseService.submitResponse(input);
            return { success };
        }),

    getResponsesByPublishedForm: protectedProcedure
        .meta(getMeta("/getResponsesByPublishedForm", "Get all responses for a published form"))
        .input(getResponsesRouteInputSchema)
        .output(getResponsesRouteOutputSchema)
        .query(async ({ input, ctx }) => {
            const { userId } = ctx;
            const responses = await responseService.getResponsesByPublishedForm(input, userId);
            return responses;
        }),

    getResponseCount: protectedProcedure
        .meta(getMeta("/getResponseCount", "Get total count of responses for a published form"))
        .input(getResponseCountRouteInputSchema)
        .output(getResponseCountRouteOutputSchema)
        .query(async ({ input, ctx }) => {
            const { userId } = ctx;
            const count = await responseService.getResponseCount(input, userId);
            return { count };
        }),
});
