import { z } from "zod";

export const dashboardAnalyticsOutputSchema = z.object({
    totalForms: z.number(),
    draftForms: z.number(),
    activeForms: z.number(),
    archivedForms: z.number(),
    totalResponses: z.number(),
});
export type DashboardAnalyticsOutputType = z.infer<typeof dashboardAnalyticsOutputSchema>;

export const getFormAnalyticsInputSchema = z.object({
    formId: z.string().uuid(),
    userId: z.string().uuid(),
});
export type GetFormAnalyticsInputType = z.infer<typeof getFormAnalyticsInputSchema>;

export const formAnalyticsOutputSchema = z.object({
    totalResponses: z.number(),
    // additional form-specific stats could go here
});
export type FormAnalyticsOutputType = z.infer<typeof formAnalyticsOutputSchema>;

export const getResponseTrendsInputSchema = z.object({
    userId: z.string().uuid(),
    formId: z.string().uuid().optional(),
});
export type GetResponseTrendsInputType = z.infer<typeof getResponseTrendsInputSchema>;

export const responseTrendDataPointSchema = z.object({
    date: z.string(), // ISO date string or formatted date
    count: z.number(),
});
export const responseTrendsOutputSchema = z.array(responseTrendDataPointSchema);
export type ResponseTrendsOutputType = z.infer<typeof responseTrendsOutputSchema>;

export const getTopPerformingFormsInputSchema = z.object({
    userId: z.string().uuid(),
});
export type GetTopPerformingFormsInputType = z.infer<typeof getTopPerformingFormsInputSchema>;

export const topPerformingFormSchema = z.object({
    formId: z.string().uuid(),
    title: z.string(),
    responseCount: z.number(),
});
export const topPerformingFormsOutputSchema = z.array(topPerformingFormSchema);
export type TopPerformingFormsOutputType = z.infer<typeof topPerformingFormsOutputSchema>;

export const getQuestionAnalyticsInputSchema = z.object({
    formId: z.string().uuid(),
    userId: z.string().uuid(),
});
export type GetQuestionAnalyticsInputType = z.infer<typeof getQuestionAnalyticsInputSchema>;

export const questionAnalyticsDataSchema = z.object({
    fieldId: z.string().uuid(),
    label: z.string(),
    type: z.string(),
    stats: z.record(z.string(), z.any()), // flexible for counts vs averages
});
export const questionAnalyticsOutputSchema = z.array(questionAnalyticsDataSchema);
export type QuestionAnalyticsOutputType = z.infer<typeof questionAnalyticsOutputSchema>;
