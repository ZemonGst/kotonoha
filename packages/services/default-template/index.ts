import { db, eq, asc } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";
import { defaultTemplatesTable } from "@repo/database/models/default_templates";
import { randomUUID } from "crypto";

import {
    getAllTemplatesOutputSchema,
    GetTemplatePreviewInputType,
    getTemplatePreviewInputSchema,
    getTemplatePreviewOutputSchema,
    CloneTemplateInputType,
    cloneTemplateInputSchema,
    cloneTemplateOutputSchema
} from "./model";

class DefaultTemplateService {
    
    // 1. Get all templates
    public async getAllTemplates() {
        const templates = await db
            .select()
            .from(defaultTemplatesTable)
            .orderBy(asc(defaultTemplatesTable.name));
            
        console.log("Fetched templates:", templates);
            
        return getAllTemplatesOutputSchema.parseAsync(templates);
    }

    // 2. Get template preview by ID
    public async getTemplatePreview(payload: GetTemplatePreviewInputType) {
        const { templateId } = await getTemplatePreviewInputSchema.parseAsync(payload);

        // Fetch Template
        const templateResult = await db
            .select()
            .from(defaultTemplatesTable)
            .where(eq(defaultTemplatesTable.id, templateId));

        const template = templateResult[0];
        if (!template) {
            throw new Error("Template not found");
        }

        // Fetch Source Form
        const formResult = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description
            })
            .from(formsTable)
            .where(eq(formsTable.id, template.formId));
            
        const form = formResult[0];
        if (!form) {
            throw new Error("Template form data is missing");
        }

        // Fetch Source Form Fields
        const fieldsResult = await db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, template.formId))
            .orderBy(asc(formFieldsTable.order));

        return getTemplatePreviewOutputSchema.parseAsync({
            template,
            form,
            fields: fieldsResult.map(f => ({ ...f, order: Number(f.order) }))
        });
    }

    // 3. Clone template into a user-owned draft form
    public async cloneTemplate(payload: CloneTemplateInputType) {
        const { templateId, userId } = await cloneTemplateInputSchema.parseAsync(payload);

        return await db.transaction(async (tx) => {
            // Find template to get the source formId
            const templateResult = await tx
                .select({ formId: defaultTemplatesTable.formId })
                .from(defaultTemplatesTable)
                .where(eq(defaultTemplatesTable.id, templateId));

            const template = templateResult[0];
            if (!template) {
                throw new Error("Template not found");
            }
            
            const sourceFormId = template.formId;

            // Fetch the source form
            const sourceFormResult = await tx
                .select({ title: formsTable.title, description: formsTable.description })
                .from(formsTable)
                .where(eq(formsTable.id, sourceFormId));

            const sourceForm = sourceFormResult[0];
            if (!sourceForm) {
                throw new Error("Source form data missing");
            }

            // 1. Create a new form owned by the user (as a draft)
            const insertFormResult = await tx
                .insert(formsTable)
                .values({
                    title: sourceForm.title,
                    description: sourceForm.description,
                    createdBy: userId,
                    status: "draft"
                })
                .returning({ id: formsTable.id });
            const newForm = insertFormResult[0];
            if (!newForm) {
                throw new Error("Failed to insert form");
            }
            const newFormId = newForm.id;

            // 2. Fetch all source form fields
            const sourceFieldsResult = await tx
                .select()
                .from(formFieldsTable)
                .where(eq(formFieldsTable.formId, sourceFormId));
                
            if (sourceFieldsResult.length > 0) {
                // 3. Pre-generate new field IDs so we can remap logic references
                const oldIdToNewIdMap: Record<string, string> = {};
                for (const field of sourceFieldsResult) {
                    oldIdToNewIdMap[field.id] = randomUUID();
                }

                // 4. Remap field fields and correct conditional logic rules
                const newFields = sourceFieldsResult.map((field) => {
                    const newFieldId = oldIdToNewIdMap[field.id];
                    let configCopy: any = field.config ? JSON.parse(JSON.stringify(field.config)) : {};

                    // Check if there is conditional logic that needs remapping
                    if (configCopy.logic && Array.isArray(configCopy.logic.rules)) {
                        configCopy.logic.rules = configCopy.logic.rules.map((rule: any) => {
                            if (rule.sourceFieldId && oldIdToNewIdMap[rule.sourceFieldId]) {
                                // Remap to the newly generated ID in the cloned form
                                return {
                                    ...rule,
                                    sourceFieldId: oldIdToNewIdMap[rule.sourceFieldId]
                                };
                            }
                            return rule;
                        });
                    }

                    return {
                        ...field,
                        id: newFieldId,
                        formId: newFormId,
                        config: configCopy
                    };
                });

                // 5. Insert all new fields
                await tx.insert(formFieldsTable).values(newFields);
            }

            // Return the newly created form ID
            return cloneTemplateOutputSchema.parseAsync({ formId: newFormId });
        });
    }
}

export default DefaultTemplateService;
