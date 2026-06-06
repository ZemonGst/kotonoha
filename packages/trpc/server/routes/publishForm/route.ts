import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { z } from "zod";

import PublishFormService from "../../../../services/publishForm";
import {
    publishFormRouteInputSchema,
    publishFormRouteOutputSchema,
    getMyPublishedFormsOutputSchema,
    endPublishedFormRouteInputSchema,
    endPublishedFormRouteOutputSchema,
    getPublishedFormByIdRouteInputSchema,
    getPublishedFormByIdRouteOutputSchema,
    getPublicFormWithFieldsRouteInputSchema,
    getPublicFormWithFieldsRouteOutputSchema,
} from "./model";

const publishFormService = new PublishFormService();

const TAGS = ["PublishForm"];
const getPath = generatePath("/publishForm");

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

export const publishFormRouter = router({
    publishForm: protectedProcedure
        .meta(postMeta("/publishForm", "Publish a form to make it active"))
        .input(publishFormRouteInputSchema)
        .output(publishFormRouteOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { userId } = ctx;
            const publishedForm = await publishFormService.publishForm({
                ...input,
                userId,
            });
            return publishedForm;
        }),

    getMyPublishedForms: protectedProcedure
        .meta(getMeta("/getMyPublishedForms", "Get all published forms for the current user"))
        .output(getMyPublishedFormsOutputSchema)
        .query(async ({ ctx }) => {
            const { userId } = ctx;
            const forms = await publishFormService.getPublishedFormsByUser(userId);
            return forms;
        }),

    endPublishedForm: protectedProcedure
        .meta(postMeta("/endPublishedForm", "Archive a published form"))
        .input(endPublishedFormRouteInputSchema)
        .output(endPublishedFormRouteOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { userId } = ctx;
            const success = await publishFormService.endPublishedForm(input.formId, userId);
            return { success };
        }),

    getPublishedFormById: publicProcedure
        .meta(getMeta("/getPublishedFormById", "Get a published form by its ID (Public)"))
        .input(getPublishedFormByIdRouteInputSchema)
        .output(getPublishedFormByIdRouteOutputSchema)
        .query(async ({ input }) => {
            const form = await publishFormService.getPublishedFormById({ id: input.id });
            return form;
        }),

    getPublicFormWithFields: publicProcedure
        .meta(getMeta("/getPublicFormWithFields", "Get a published form along with its fields (Public)"))
        .input(getPublicFormWithFieldsRouteInputSchema)
        .output(getPublicFormWithFieldsRouteOutputSchema)
        .query(async ({ input }) => {
            const form = await publishFormService.getPublicFormWithFields({ id: input.id });
            return form;
        }),
});
