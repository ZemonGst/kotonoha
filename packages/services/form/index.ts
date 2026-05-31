import { db, eq, and, asc } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";

import { 
    CreateFormInputType, 
    createFormOutputSchema,
    GetFormByIdInputType,
    getFormByIdInputSchema,
    getFormByIdOutputSchema,
    CreateFieldInputType,
    createFieldInputSchema,
    createFieldOutputSchema,
    GetFieldsInputType,
    getFieldsInputSchema,
    getFieldsOutputSchema,
    UpdateFieldInputType,
    updateFieldInputSchema,
    updateFieldOutputSchema,
    DeleteFieldInputType,
    deleteFieldInputSchema
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

    // Helper to generate a unique label key for a form
    private async generateUniqueLabelKey(formId: string, label: string): Promise<string> {
        let baseSlug = label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        
        if (!baseSlug) {
            baseSlug = "field";
        }

        let labelKey = baseSlug;
        let counter = 1;
        let isUnique = false;

        while (!isUnique) {
            const existingField = await db
                .select({ id: formFieldsTable.id })
                .from(formFieldsTable)
                .where(
                    and(
                        eq(formFieldsTable.formId, formId),
                        eq(formFieldsTable.labelKey, labelKey)
                    )
                );
            
            if (existingField.length === 0) {
                isUnique = true;
            } else {
                labelKey = `${baseSlug}-${counter}`;
                counter++;
            }
        }

        return labelKey;
    }

    public async createField(payload: CreateFieldInputType) {
        const validatedPayload = await createFieldInputSchema.parseAsync(payload);
        
        // Check if form exists
        const formResult = await db
            .select({ id: formsTable.id })
            .from(formsTable)
            .where(eq(formsTable.id, validatedPayload.formId));

        if (!formResult || formResult.length === 0) {
            throw new Error("Form not found");
        }

        const labelKey = await this.generateUniqueLabelKey(validatedPayload.formId, validatedPayload.label);

        const insertResult = await db
            .insert(formFieldsTable)
            .values({
                ...validatedPayload,
                labelKey,
                order: validatedPayload.order.toString(),
            })
            .returning();

        if (!insertResult || insertResult.length === 0 || !insertResult[0]) {
            throw new Error("Something went wrong while creating the field");
        }

        return createFieldOutputSchema.parseAsync({
            ...insertResult[0],
            order: Number(insertResult[0].order)
        });
    }

    public async getFields(payload: GetFieldsInputType) {
        const { formId } = await getFieldsInputSchema.parseAsync(payload);

        const fields = await db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(asc(formFieldsTable.order));

        return getFieldsOutputSchema.parseAsync(
            fields.map(f => ({ ...f, order: Number(f.order) }))
        );
    }

    public async updateField(payload: UpdateFieldInputType) {
        const validatedPayload = await updateFieldInputSchema.parseAsync(payload);
        const { fieldId, formId, ...updateData } = validatedPayload;

        // Ensure field exists and belongs to form
        const fieldResult = await db
            .select({ id: formFieldsTable.id })
            .from(formFieldsTable)
            .where(
                and(
                    eq(formFieldsTable.id, fieldId),
                    eq(formFieldsTable.formId, formId)
                )
            );

        if (!fieldResult || fieldResult.length === 0) {
            throw new Error("Field not found or does not belong to this form");
        }

        // We explicitly omit labelKey from updateData even if it was somehow provided,
        // to strictly enforce its immutability.
        const { ...safeUpdateData } = updateData;
        
        // Explicitly remove labelKey if it's there (TypeScript handles it but just in case of any runtime bypasses)
        if ('labelKey' in safeUpdateData) {
            delete (safeUpdateData as any).labelKey;
        }

        // If nothing to update, return the current field
        if (Object.keys(safeUpdateData).length === 0) {
             const currentField = await db
                .select()
                .from(formFieldsTable)
                .where(eq(formFieldsTable.id, fieldId));
             
             const field = currentField[0];
             if (!field) {
                 throw new Error("Field not found");
             }
             
             return updateFieldOutputSchema.parseAsync({
                 ...field,
                 order: Number(field.order)
             });
        }

        const { order, ...restUpdateData } = safeUpdateData;

        const updateResult = await db
            .update(formFieldsTable)
            .set({
                ...restUpdateData,
                ...(order !== undefined ? { order: order.toString() } : {})
            })
            .where(eq(formFieldsTable.id, fieldId))
            .returning();

        if (!updateResult || updateResult.length === 0 || !updateResult[0]) {
            throw new Error("Something went wrong while updating the field");
        }

        return updateFieldOutputSchema.parseAsync({
            ...updateResult[0],
            order: Number(updateResult[0].order)
        });
    }

    public async deleteField(payload: DeleteFieldInputType) {
        const { fieldId, formId } = await deleteFieldInputSchema.parseAsync(payload);

        const deleteResult = await db
            .delete(formFieldsTable)
            .where(
                and(
                    eq(formFieldsTable.id, fieldId),
                    eq(formFieldsTable.formId, formId)
                )
            )
            .returning();

        if (!deleteResult || deleteResult.length === 0 || !deleteResult[0]) {
            throw new Error("Field not found or already deleted");
        }

        return true;
    }
}

export default FormService;
