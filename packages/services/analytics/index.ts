import { db, eq, and, desc, count, sql, inArray } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { publishedFormsTable } from "@repo/database/models/published-form";
import { formFieldsTable } from "@repo/database/models/form-field";
import { responsesTable } from "@repo/database/models/response";

import {
    DashboardAnalyticsOutputType,
    dashboardAnalyticsOutputSchema,
    GetFormAnalyticsInputType,
    formAnalyticsOutputSchema,
    GetResponseTrendsInputType,
    responseTrendsOutputSchema,
    GetTopPerformingFormsInputType,
    topPerformingFormsOutputSchema,
    GetQuestionAnalyticsInputType,
    questionAnalyticsOutputSchema,
} from "./model";

class AnalyticsService {
    public async getDashboardAnalytics(userId: string): Promise<DashboardAnalyticsOutputType> {
        // Query form counts by status
        const formCounts = await db
            .select({
                status: formsTable.status,
                count: count(formsTable.id),
            })
            .from(formsTable)
            .where(eq(formsTable.createdBy, userId))
            .groupBy(formsTable.status);

        let totalForms = 0;
        let draftForms = 0;
        let activeForms = 0;
        let archivedForms = 0;

        for (const row of formCounts) {
            const countNum = Number(row.count);
            totalForms += countNum;
            if (row.status === "draft") draftForms += countNum;
            if (row.status === "active") activeForms += countNum;
            if (row.status === "archived") archivedForms += countNum;
        }

        // To get total responses, we need to join forms -> published_forms -> responses
        const responsesCountQuery = await db
            .select({
                count: count(responsesTable.id),
            })
            .from(responsesTable)
            .innerJoin(publishedFormsTable, eq(responsesTable.publishedFormId, publishedFormsTable.id))
            .innerJoin(formsTable, eq(publishedFormsTable.formId, formsTable.id))
            .where(eq(formsTable.createdBy, userId));

        const totalResponses = Number(responsesCountQuery[0]?.count || 0);

        return dashboardAnalyticsOutputSchema.parseAsync({
            totalForms,
            draftForms,
            activeForms,
            archivedForms,
            totalResponses,
        });
    }

    public async getFormAnalytics(payload: GetFormAnalyticsInputType) {
        const { formId, userId } = payload;

        // Verify form ownership
        const formCheck = await db
            .select({ id: formsTable.id })
            .from(formsTable)
            .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)));

        if (!formCheck.length) {
            throw new Error("Form not found or you do not have permission");
        }

        // Get total responses for this form
        const responsesCountQuery = await db
            .select({
                count: count(responsesTable.id),
            })
            .from(responsesTable)
            .innerJoin(publishedFormsTable, eq(responsesTable.publishedFormId, publishedFormsTable.id))
            .where(eq(publishedFormsTable.formId, formId));

        const totalResponses = Number(responsesCountQuery[0]?.count || 0);

        return formAnalyticsOutputSchema.parseAsync({
            totalResponses,
        });
    }

    public async getResponseTrends(payload: GetResponseTrendsInputType) {
        const { userId, formId } = payload;

        const whereCondition = formId
            ? and(eq(formsTable.createdBy, userId), eq(formsTable.id, formId))
            : eq(formsTable.createdBy, userId);

        // Group responses by date
        const trends = await db
            .select({
                date: sql<string>`DATE(responses.created_at)::text`,
                count: count(responsesTable.id),
            })
            .from(responsesTable)
            .innerJoin(publishedFormsTable, eq(responsesTable.publishedFormId, publishedFormsTable.id))
            .innerJoin(formsTable, eq(publishedFormsTable.formId, formsTable.id))
            .where(whereCondition)
            .groupBy(sql`DATE(responses.created_at)`)
            .orderBy(sql`DATE(responses.created_at) ASC`);

        return responseTrendsOutputSchema.parseAsync(
            trends.map((t) => ({
                date: t.date,
                count: Number(t.count),
            }))
        );
    }

    public async getTopPerformingForms(payload: GetTopPerformingFormsInputType) {
        const { userId } = payload;

        const topForms = await db
            .select({
                formId: formsTable.id,
                title: formsTable.title,
                responseCount: count(responsesTable.id),
            })
            .from(formsTable)
            .leftJoin(publishedFormsTable, eq(formsTable.id, publishedFormsTable.formId))
            .leftJoin(responsesTable, eq(publishedFormsTable.id, responsesTable.publishedFormId))
            .where(eq(formsTable.createdBy, userId))
            .groupBy(formsTable.id, formsTable.title)
            .orderBy(desc(count(responsesTable.id)))
            .limit(5);

        return topPerformingFormsOutputSchema.parseAsync(
            topForms.map((f) => ({
                formId: f.formId,
                title: f.title,
                responseCount: Number(f.responseCount),
            }))
        );
    }

    public async getQuestionAnalytics(payload: GetQuestionAnalyticsInputType) {
        const { formId, userId } = payload;

        // Verify form ownership
        const formCheck = await db
            .select({ id: formsTable.id })
            .from(formsTable)
            .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)));

        if (!formCheck.length) {
            throw new Error("Form not found or you do not have permission");
        }

        // Fetch form fields
        const fields = await db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId));

        // Fetch all responses for the form
        const responses = await db
            .select({
                responseData: responsesTable.responseData,
            })
            .from(responsesTable)
            .innerJoin(publishedFormsTable, eq(responsesTable.publishedFormId, publishedFormsTable.id))
            .where(eq(publishedFormsTable.formId, formId));

        const analytics = fields.map((field) => {
            const stats: Record<string, any> = {};

            if (["select", "radio", "checkbox"].includes(field.type)) {
                // Count occurrences of each option
                for (const row of responses) {
                    const data = row.responseData as Record<string, any>;
                    const answer = data[field.labelKey];

                    if (answer) {
                        if (Array.isArray(answer)) {
                            answer.forEach((opt) => {
                                stats[opt] = (stats[opt] || 0) + 1;
                            });
                        } else {
                            stats[answer] = (stats[answer] || 0) + 1;
                        }
                    }
                }
            } else if (["number", "rating"].includes(field.type)) {
                // Calculate average
                let sum = 0;
                let count = 0;
                for (const row of responses) {
                    const data = row.responseData as Record<string, any>;
                    const answer = data[field.labelKey];
                    if (answer !== undefined && answer !== null) {
                        sum += Number(answer);
                        count++;
                    }
                }
                stats["average"] = count > 0 ? (sum / count).toFixed(2) : 0;
                stats["count"] = count;
            } else {
                // Text, Email, etc. - Just count submissions for now
                let count = 0;
                for (const row of responses) {
                    const data = row.responseData as Record<string, any>;
                    const answer = data[field.labelKey];
                    if (answer !== undefined && answer !== null && answer !== "") {
                        count++;
                    }
                }
                stats["submitted"] = count;
            }

            return {
                fieldId: field.id,
                label: field.label,
                type: field.type,
                stats,
            };
        });

        return questionAnalyticsOutputSchema.parseAsync(analytics);
    }
}

export default AnalyticsService;
