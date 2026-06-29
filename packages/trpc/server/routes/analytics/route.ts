import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import { analyticsService } from "../../services";

import {
    dashboardAnalyticsOutputSchema,
    formAnalyticsOutputSchema,
    responseTrendsOutputSchema,
    topPerformingFormsOutputSchema,
    questionAnalyticsOutputSchema,
} from "@repo/services/analytics/model";

import {
    getFormAnalyticsInputSchema,
    getResponseTrendsInputSchema,
    getQuestionAnalyticsInputSchema,
} from "./model";

const TAGS = ["Analytics"];
const getPath = generatePath("/analytics");

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

export const analyticsRouter = router({
    getDashboardAnalytics: protectedProcedure
        .meta(getMeta("/dashboard", "Get analytics for the user dashboard"))
        .output(dashboardAnalyticsOutputSchema)
        .query(async ({ ctx }) => {
            const { userId } = ctx;
            return analyticsService.getDashboardAnalytics(userId);
        }),

    getFormAnalytics: protectedProcedure
        .meta(getMeta("/form/{formId}", "Get analytics for a specific form"))
        .input(getFormAnalyticsInputSchema)
        .output(formAnalyticsOutputSchema)
        .query(async ({ ctx, input }) => {
            const { userId } = ctx;
            const { formId } = input;
            return analyticsService.getFormAnalytics({ userId, formId });
        }),

    getResponseTrends: protectedProcedure
        .meta(getMeta("/trends", "Get response trends for the dashboard or a specific form"))
        .input(getResponseTrendsInputSchema)
        .output(responseTrendsOutputSchema)
        .query(async ({ ctx, input }) => {
            const { userId } = ctx;
            const { formId } = input;
            return analyticsService.getResponseTrends({ userId, formId });
        }),

    getTopPerformingForms: protectedProcedure
        .meta(getMeta("/top-forms", "Get top performing forms for the user"))
        .output(topPerformingFormsOutputSchema)
        .query(async ({ ctx }) => {
            const { userId } = ctx;
            return analyticsService.getTopPerformingForms({ userId });
        }),

    getQuestionAnalytics: protectedProcedure
        .meta(getMeta("/question/{formId}", "Get question-level analytics for a specific form"))
        .input(getQuestionAnalyticsInputSchema)
        .output(questionAnalyticsOutputSchema)
        .query(async ({ ctx, input }) => {
            const { userId } = ctx;
            const { formId } = input;
            return analyticsService.getQuestionAnalytics({ userId, formId });
        }),
});
