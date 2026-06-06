import { db, eq, and, sql } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { publishedFormsTable } from "@repo/database/models/published-form";
import { responsesTable } from "@repo/database/models/response";

import {
    SubmitResponseInputType,
    submitResponseInputSchema,
    GetResponsesInputType,
    getResponsesInputSchema,
    responseSchema,
    ResponseType
} from "./model";

class ResponseService {
    public async submitResponse(payload: SubmitResponseInputType): Promise<boolean> {
        const { publishedFormId, responseData } = await submitResponseInputSchema.parseAsync(payload);

        return await db.transaction(async (tx) => {
            // Load Published Form
            const publishedFormResult = await tx
                .select({
                    id: publishedFormsTable.id,
                    formId: publishedFormsTable.formId,
                    expiresAt: publishedFormsTable.expiresAt,
                })
                .from(publishedFormsTable)
                .where(eq(publishedFormsTable.id, publishedFormId));

            const publishedForm = publishedFormResult[0];
            if (!publishedForm) {
                throw new Error("Published form not found");
            }

            // Validate Not Expired
            if (publishedForm.expiresAt && publishedForm.expiresAt < new Date()) {
                throw new Error("This form has expired and is no longer accepting responses");
            }

            // Load Parent Form and Validate Status
            const formResult = await tx
                .select({ status: formsTable.status })
                .from(formsTable)
                .where(eq(formsTable.id, publishedForm.formId));

            const form = formResult[0];
            if (!form) {
                throw new Error("Parent form not found");
            }

            if (form.status !== "active") {
                throw new Error("This form is not active and cannot accept responses");
            }

            // Store Response
            await tx
                .insert(responsesTable)
                .values({
                    publishedFormId,
                    responseData,
                });

            return true;
        });
    }

    public async getResponsesByPublishedForm(payload: GetResponsesInputType, userId: string): Promise<ResponseType[]> {
        const { publishedFormId } = await getResponsesInputSchema.parseAsync(payload);

        // Verify ownership
        const publishedFormResult = await db
            .select({ publishedBy: publishedFormsTable.publishedBy })
            .from(publishedFormsTable)
            .where(eq(publishedFormsTable.id, publishedFormId));

        const pForm = publishedFormResult[0];
        if (!pForm || pForm.publishedBy !== userId) {
            throw new Error("You do not have permission to view these responses");
        }

        const result = await db
            .select()
            .from(responsesTable)
            .where(eq(responsesTable.publishedFormId, publishedFormId));

        return Promise.all(result.map(row => responseSchema.parseAsync(row)));
    }

    public async getResponseCount(payload: GetResponsesInputType, userId: string): Promise<number> {
        const { publishedFormId } = await getResponsesInputSchema.parseAsync(payload);

        // Verify ownership
        const publishedFormResult = await db
            .select({ publishedBy: publishedFormsTable.publishedBy })
            .from(publishedFormsTable)
            .where(eq(publishedFormsTable.id, publishedFormId));

        const pForm = publishedFormResult[0];
        if (!pForm || pForm.publishedBy !== userId) {
            throw new Error("You do not have permission to view this form's responses");
        }

        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(responsesTable)
            .where(eq(responsesTable.publishedFormId, publishedFormId));

        return Number(result[0]?.count || 0);
    }
}

export default ResponseService;
