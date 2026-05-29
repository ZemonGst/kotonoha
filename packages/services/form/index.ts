import { db } from "@repo/database";
import { formsTable } from "@repo/database/models/form";

import { CreateFormInputType, createFormOutputSchema } from "./model";

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
}

export default FormService;
