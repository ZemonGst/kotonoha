import { db, eq, and, asc, desc, inArray, sql } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";
import { defaultTemplatesTable } from "@repo/database/models/default_templates";
import { publishedFormsTable } from "@repo/database/models/published-form";
import { responsesTable } from "@repo/database/models/response";
import Papa from "papaparse";

import { 
    CreateFormInputType, 
    createFormOutputSchema,
    GetFormByIdInputType,
    getFormByIdInputSchema,
    getFormByIdOutputSchema,
    UpdateFormStatusInputType,
    updateFormStatusInputSchema,
    updateFormStatusOutputSchema,
    UpdateFormInputType,
    updateFormInputSchema,
    updateFormOutputSchema,
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
    deleteFieldInputSchema,
    SaveDeltaInputType,
    saveDeltaInputSchema,
    DeleteFormInputType,
    deleteFormInputSchema,
    ExportResponsesCsvInputType,
    exportResponsesCsvInputSchema,
    exportResponsesCsvOutputSchema
} from "./model";

class FormService {
    // Private helpers
    
    private async generateUniqueLabelKey(dbClient: any, formId: string, label: string, generatedKeys?: Set<string>): Promise<string> {
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
            if (generatedKeys?.has(labelKey)) {
                labelKey = `${baseSlug}-${counter}`;
                counter++;
                continue;
            }

            const existingField = await dbClient
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

    // Public functions

    public async saveDelta(payload: SaveDeltaInputType): Promise<{ newIds: Record<string, string> }> {
        const validatedPayload = await saveDeltaInputSchema.parseAsync(payload);
        const { formId, userId, newFields, updatedFields, deletedIds, meta } = validatedPayload;

        return await db.transaction(async (tx) => {
            // Verify form exists and belongs to userId
            const formResult = await tx
                .select({ id: formsTable.id })
                .from(formsTable)
                .where(
                    and(
                        eq(formsTable.id, formId),
                        eq(formsTable.createdBy, userId)
                    )
                );

            if (!formResult || formResult.length === 0) {
                throw new Error("Form not found or you do not have permission to modify it");
            }

            // UPDATE form title/description
            if (meta && (meta.title !== undefined || meta.description !== undefined)) {
                const updateSet: Record<string, any> = { updatedAt: new Date() };
                if (meta.title !== undefined) updateSet.title = meta.title;
                if (meta.description !== undefined) updateSet.description = meta.description;
                
                await tx
                    .update(formsTable)
                    .set(updateSet)
                    .where(eq(formsTable.id, formId));
            }

            // DELETE fields
            if (deletedIds && deletedIds.length > 0) {
                await tx
                    .delete(formFieldsTable)
                    .where(
                        and(
                            eq(formFieldsTable.formId, formId),
                            inArray(formFieldsTable.id, deletedIds)
                        )
                    );
            }

            // UPDATE fields
            if (updatedFields && updatedFields.length > 0) {
                const updateSet: Record<string, any> = {};
                const columnsToUpdate = ['type', 'label', 'description', 'placeholder', 'isRequired', 'order', 'config'] as const;

                for (const col of columnsToUpdate) {
                    const hasUpdate = updatedFields.some(f => f[col as keyof typeof f] !== undefined);
                    if (hasUpdate) {
                        let query = sql`(case `;
                        for (const field of updatedFields) {
                            if (field[col as keyof typeof field] !== undefined) {
                                const val = col === 'order' ? field[col as keyof typeof field]?.toString() : field[col as keyof typeof field];
                                
                                // If value is a plain object/array, we should stringify it for JSONB columns, but Drizzle usually handles JSON mapping if we use parameters properly. 
                                // However, using sql`` template literal means it passes values directly to pg driver as parameterized args, so json objects work fine.
                                query = sql`${query} when ${formFieldsTable.id} = ${field.id} then ${val} `;
                            }
                        }
                        query = sql`${query} else ${formFieldsTable[col as keyof typeof formFieldsTable]} end)`;
                        updateSet[col] = query;
                    }
                }

                if (Object.keys(updateSet).length > 0) {
                    updateSet.updatedAt = new Date();
                    await tx.update(formFieldsTable)
                        .set(updateSet)
                        .where(
                            and(
                                eq(formFieldsTable.formId, formId),
                                inArray(formFieldsTable.id, updatedFields.map(f => f.id))
                            )
                        );
                }
            }

            // INSERT new fields
            const idMapping: Record<string, string> = {};
            if (newFields && newFields.length > 0) {
                const valuesToInsert = [];
                const generatedKeys = new Set<string>();
                
                for (const field of newFields) {
                    const labelKey = await this.generateUniqueLabelKey(tx, formId, field.label, generatedKeys);
                    generatedKeys.add(labelKey);
                    // Strip tempId from insertion payload
                    const { tempId, ...fieldData } = field;
                    valuesToInsert.push({
                        ...fieldData,
                        formId,
                        labelKey,
                        order: fieldData.order.toString(),
                    });
                }
                const insertResult = await tx.insert(formFieldsTable)
                                            .values(valuesToInsert)
                                            .returning({ id: formFieldsTable.id, order: formFieldsTable.order });
                
                console.log('[saveDelta] insertResult:', insertResult);
                for (const row of insertResult) {
                    console.log(`[saveDelta] Mapping row.order (type: ${typeof row.order}, value: ${row.order})`);
                    const tempId = newFields.find(f => f.order === Number(row.order))?.tempId;
                    if (tempId) {
                        idMapping[tempId] = row.id;
                    }
                }
                console.log('[saveDelta] generated idMapping:', idMapping);
            }

            console.log('[saveDelta] returned newIds payload:', idMapping);
            return { newIds: idMapping };
        });
    }

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
                createdBy: formsTable.createdBy,
            })
            .from(formsTable)
            .where(eq(formsTable.id, formId));

        if (!result || result.length === 0 || !result[0]) {
            throw new Error("Form not found or you do not have permission to view it");
        }

        if (result[0].createdBy !== userId) {
            const templateCheck = await db
                .select({ id: defaultTemplatesTable.id })
                .from(defaultTemplatesTable)
                .where(eq(defaultTemplatesTable.formId, formId));
            
            if (templateCheck.length === 0) {
                throw new Error("Form not found or you do not have permission to view it");
            }
        }

        return getFormByIdOutputSchema.parseAsync(result[0]);
    }

    public async updateFormStatus(payload: UpdateFormStatusInputType) {
        const { formId, userId, status } = await updateFormStatusInputSchema.parseAsync(payload);

        // Verify form exists and belongs to the user
        const formResult = await db
            .select({ id: formsTable.id })
            .from(formsTable)
            .where(
                and(
                    eq(formsTable.id, formId),
                    eq(formsTable.createdBy, userId)
                )
            );

        if (!formResult || formResult.length === 0) {
            throw new Error("Form not found or you do not have permission to modify it");
        }

        const updateResult = await db
            .update(formsTable)
            .set({ status })
            .where(eq(formsTable.id, formId))
            .returning();

        if (!updateResult || updateResult.length === 0 || !updateResult[0]) {
            throw new Error("Something went wrong while updating the form status");
        }

        return updateFormStatusOutputSchema.parseAsync(updateResult[0]);
    }

    public async updateForm(payload: UpdateFormInputType) {
        const { formId, userId, title, description } = await updateFormInputSchema.parseAsync(payload);

        // Verify form exists and belongs to the user
        const formResult = await db
            .select({ id: formsTable.id })
            .from(formsTable)
            .where(
                and(
                    eq(formsTable.id, formId),
                    eq(formsTable.createdBy, userId)
                )
            );

        if (!formResult || formResult.length === 0) {
            throw new Error("Form not found or you do not have permission to modify it");
        }

        const updateSet: Record<string, any> = { updatedAt: new Date() };
        if (title !== undefined) updateSet.title = title;
        if (description !== undefined) updateSet.description = description;

        if (Object.keys(updateSet).length === 1) {
            // Nothing to update other than updatedAt, but let's just return the current form
            const currentForm = await db
                .select()
                .from(formsTable)
                .where(eq(formsTable.id, formId));
            
            return updateFormOutputSchema.parseAsync(currentForm[0]);
        }

        const updateResult = await db
            .update(formsTable)
            .set(updateSet)
            .where(eq(formsTable.id, formId))
            .returning();

        if (!updateResult || updateResult.length === 0 || !updateResult[0]) {
            throw new Error("Something went wrong while updating the form");
        }

        return updateFormOutputSchema.parseAsync(updateResult[0]);
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

        const labelKey = await this.generateUniqueLabelKey(db, validatedPayload.formId, validatedPayload.label);

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

        // First validate that the form exists
        const formResult = await db
            .select({ id: formsTable.id })
            .from(formsTable)
            .where(eq(formsTable.id, formId));

        if (formResult.length === 0) {
            throw new Error("Form not found");
        }

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

    public async deleteForm(payload: DeleteFormInputType) {
        const { formId, userId } = await deleteFormInputSchema.parseAsync(payload);

        // First check if form exists and user owns it
        const formResult = await db
            .select({ id: formsTable.id })
            .from(formsTable)
            .where(
                and(
                    eq(formsTable.id, formId),
                    eq(formsTable.createdBy, userId)
                )
            );

        if (!formResult || formResult.length === 0) {
            throw new Error("Form not found or you do not have permission to delete it");
        }

        // Delete all form fields first
        await db
            .delete(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId));

        // Then delete the form
        await db
            .delete(formsTable)
            .where(eq(formsTable.id, formId));

        return true;
    }

    public async exportResponsesToCsv(payload: ExportResponsesCsvInputType) {
        const { publishedFormId, userId } = await exportResponsesCsvInputSchema.parseAsync(payload);

        // Fetch published form to verify ownership and get parent formId
        const publishedFormResult = await db
            .select({
                formId: publishedFormsTable.formId,
                publishedBy: publishedFormsTable.publishedBy
            })
            .from(publishedFormsTable)
            .where(eq(publishedFormsTable.id, publishedFormId));

        const pForm = publishedFormResult[0];
        if (!pForm || pForm.publishedBy !== userId) {
            throw new Error("Form not found or you do not have permission to view its responses");
        }

        // Fetch parent form for title
        const formResult = await db
            .select({ title: formsTable.title })
            .from(formsTable)
            .where(eq(formsTable.id, pForm.formId));

        const formTitle = formResult[0]?.title || "Form";

        // Fetch fields to build column headers
        const fields = await db
            .select({
                id: formFieldsTable.id,
                label: formFieldsTable.label
            })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, pForm.formId))
            .orderBy(asc(formFieldsTable.order));

        // Create a mapping from field ID to label
        const fieldMap: Record<string, string> = {};
        for (const field of fields) {
            fieldMap[field.id] = field.label;
        }

        // Fetch all responses
        const responses = await db
            .select()
            .from(responsesTable)
            .where(eq(responsesTable.publishedFormId, publishedFormId))
            .orderBy(desc(responsesTable.submittedAt));

        // Construct CSV rows
        const rows = responses.map((r, index) => {
            const row: Record<string, any> = {
                "Response ID": r.id,
                "Submitted At": r.submittedAt.toISOString(),
            };

            const responseData = r.responseData as Record<string, unknown>;

            for (const field of fields) {
                const value = responseData[field.id];
                // Handle different value types (arrays for multiple choice, booleans, objects)
                if (value === null || value === undefined) {
                    row[field.label] = "";
                } else if (Array.isArray(value)) {
                    row[field.label] = value.join(", ");
                } else if (typeof value === "boolean") {
                    row[field.label] = value ? "Yes" : "No";
                } else if (typeof value === "object") {
                    row[field.label] = JSON.stringify(value);
                } else {
                    row[field.label] = String(value);
                }
            }
            return row;
        });

        // Generate CSV string using papaparse
        const csvString = Papa.unparse(rows);

        // Sanitize filename
        const safeTitle = formTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safeTitle}_responses.csv`;

        return exportResponsesCsvOutputSchema.parseAsync({
            csv: csvString,
            filename
        });
    }
}

export default FormService;
