import { z } from "zod";

export const getFormAnalyticsInputSchema = z.object({
    formId: z.string().uuid(),
});

export const getResponseTrendsInputSchema = z.object({
    formId: z.string().uuid().optional(),
});

export const getQuestionAnalyticsInputSchema = z.object({
    formId: z.string().uuid(),
});
