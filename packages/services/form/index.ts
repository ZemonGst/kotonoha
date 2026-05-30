import { db, eq, and } from "@repo/database";
import { formsTable } from "@repo/database/models/form";

import { 
    CreateFormInputType, 
    createFormOutputSchema,
    GetFormByIdInputType,
    getFormByIdInputSchema,
    getFormByIdOutputSchema
} from "./model";

class FormService {
    // Creates a new form record associated with the authenticated user
    public async createForm(userId: string, payload: CreateFormInputType) {
        const { title, description } = payload;

        // Insert the new form into the database
        const insertResult = await db
            .insert(formsTable)
            .values({
                title,
                description,
                createdBy: userId,
            })
            .returning();

        if (!insertResult || insertResult.length === 0 || !insertResult[0]) {
            throw new Error("Something went wrong while creating the form");
        }

        const createdForm = insertResult[0];

        // Return the newly created form entity validated against the output schema
        // Defaulting status to 'draft' as it is part of the output schema
        return createFormOutputSchema.parseAsync({
            ...createdForm,
            status: "draft",
        });
    }

    // Fetches a form by its ID, verifying it belongs to the requesting user
    public async getFormById(payload: GetFormByIdInputType) {
        const { formId, userId } = await getFormByIdInputSchema.parseAsync(payload);

        const result = await db
            .select({
                title: formsTable.title,
                description: formsTable.description,
            })
            .from(formsTable)
            .where(
                and(
                    eq(formsTable.id, formId),
                    eq(formsTable.createdBy, userId)
                )
            );

        if (!result || result.length === 0 || !result[0]) {
            throw new Error("Form not found or you do not have permission to view it");
        }

        return getFormByIdOutputSchema.parseAsync(result[0]);
    }
}

export default FormService;
