import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import { defaultTemplateService } from "../../services";

import {
    getAllTemplatesOutputSchema,
    getTemplatePreviewInputSchema,
    getTemplatePreviewOutputSchema,
    cloneTemplateInputSchema,
    cloneTemplateOutputSchema
} from "./model";

const TAGS = ["DefaultTemplate"];
const getPath = generatePath("/default-template");

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

export const defaultTemplateRouter = router({
    
    // Get all templates (could be public or protected, going with protected to match form patterns usually, or public if templates are shown on a marketing page)
    // Assuming protected as users need an account to clone anyway.
    getAllTemplates: protectedProcedure
        .meta(getMeta("/getAllTemplates", "Get a list of all available default templates"))
        .output(getAllTemplatesOutputSchema)
        .query(async () => {
            return await defaultTemplateService.getAllTemplates();
        }),

    // Get template preview
    getTemplatePreview: protectedProcedure
        .meta(getMeta("/getTemplatePreview", "Get full template details, source form, and fields for preview"))
        .input(getTemplatePreviewInputSchema)
        .output(getTemplatePreviewOutputSchema)
        .query(async ({ input }) => {
            return await defaultTemplateService.getTemplatePreview(input);
        }),

    // Clone template
    cloneTemplate: protectedProcedure
        .meta(postMeta("/cloneTemplate", "Clone a template into a user-owned draft form"))
        .input(cloneTemplateInputSchema.omit({ userId: true }))
        .output(cloneTemplateOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { userId } = ctx;
            
            return await defaultTemplateService.cloneTemplate({
                templateId: input.templateId,
                userId: userId,
            });
        }),
});
