import { z } from "zod";

// Shared base schema for common form fields
const formBaseSchema = z.object({
    title: z.string().min(1).max(100)
        .describe("The title of the form"),

    description: z.string().max(500).optional()
        .describe("An optional description for the form"),
});

// Output schema representing the completed form returned after creation
export const createFormOutputSchema = formBaseSchema.extend({
    id: z.string().uuid()
        .describe("Unique identifier of the form"),
    
    status: z.enum(["draft", "active", "archived"])
        .describe("Current status of the form"),
    
    createdBy: z.string().uuid()
        .describe("ID of the user who created the form"),
    
    createdAt: z.date()
        .describe("When the form was created"),
    
    updatedAt: z.date()
        .describe("When the form was last updated"),
});

export type CreateFormOutputType = z.infer<typeof createFormOutputSchema>;

// Input schema for creating a new form
export const createFormInputSchema = formBaseSchema;

export type CreateFormInputType = z.infer<typeof createFormInputSchema>;

// Input schema for getting a form by ID
export const getFormByIdInputSchema = z.object({
    formId: z.string().uuid().describe("Unique identifier of the form"),
    userId: z.string().uuid().describe("ID of the user requesting the form"),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInputSchema>;

// Output schema for getting a form by ID
export const getFormByIdOutputSchema = z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
});

export type GetFormByIdOutputType = z.infer<typeof getFormByIdOutputSchema>;

export const updateFormStatusInputSchema = z.object({
    formId: z.string().uuid().describe("Unique identifier of the form"),
    userId: z.string().uuid().describe("ID of the user requesting the status update"),
    status: z.enum(["draft", "active", "archived"]).describe("New status for the form"),
});

export type UpdateFormStatusInputType = z.infer<typeof updateFormStatusInputSchema>;

export const updateFormStatusOutputSchema = createFormOutputSchema;

export type UpdateFormStatusOutputType = z.infer<typeof updateFormStatusOutputSchema>;

export const updateFormInputSchema = z.object({
    formId: z.string().uuid().describe("Unique identifier of the form"),
    userId: z.string().uuid().describe("ID of the user requesting the update"),
    title: z.string().min(1).max(100).optional().describe("New title for the form"),
    description: z.string().max(500).optional().nullable().describe("New description for the form"),
});

export type UpdateFormInputType = z.infer<typeof updateFormInputSchema>;

export const updateFormOutputSchema = createFormOutputSchema;

export type UpdateFormOutputType = z.infer<typeof updateFormOutputSchema>;

export const formFieldTypes = [
    "text",
    "number",
    "email",
    "phone",
    "textarea",
    "select",
    "yes_no",
    "password",
    "checkbox",
    "radio",
    "date",
    "time",
    "datetime",
    "rating",
] as const;

// Shared base schema for common form field properties
const formFieldBaseSchema = z.object({
    type: z.enum(formFieldTypes).describe("Type of the field"),
    label: z.string().min(1).max(100).describe("User-facing field title"),
    description: z.string().nullable().optional().describe("Helper text below the label"),
    placeholder: z.string().nullable().optional().describe("Temporary text inside the input"),
    isRequired: z.boolean().default(false).describe("Whether the field must be completed"),
    order: z.number().describe("Field position within the form"),
    config: z.record(z.string(), z.unknown()).default({}).describe("Type-specific settings"),
});

export const createFieldInputSchema = formFieldBaseSchema.extend({
    formId: z.string().uuid().describe("ID of the form this field belongs to"),
});

export type CreateFieldInputType = z.infer<typeof createFieldInputSchema>;

export const createFieldOutputSchema = formFieldBaseSchema.extend({
    id: z.string().uuid(),
    formId: z.string().uuid(),
    labelKey: z.string().max(100),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type CreateFieldOutputType = z.infer<typeof createFieldOutputSchema>;

export const updateFieldInputSchema = formFieldBaseSchema.partial().extend({
    fieldId: z.string().uuid(),
    formId: z.string().uuid(),
});

export type UpdateFieldInputType = z.infer<typeof updateFieldInputSchema>;

export const updateFieldOutputSchema = createFieldOutputSchema;

export const getFieldsInputSchema = z.object({
    formId: z.string().uuid(),
});

export type GetFieldsInputType = z.infer<typeof getFieldsInputSchema>;

export const getFieldsOutputSchema = z.array(createFieldOutputSchema);

export const deleteFieldInputSchema = z.object({
    fieldId: z.string().uuid(),
    formId: z.string().uuid(),
});

export type DeleteFieldInputType = z.infer<typeof deleteFieldInputSchema>;

export const saveDeltaInputSchema = z.object({
    formId: z.string().uuid(),
    userId: z.string().uuid(),
    newFields: z.array(formFieldBaseSchema.extend({
        tempId: z.string().uuid(),
    })),
    updatedFields: z.array(
        formFieldBaseSchema.partial().extend({
            id: z.string().uuid(),
        })
    ),
    deletedIds: z.array(z.string().uuid()),
    meta: z.object({
        title: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
    }).optional(),
});

export type SaveDeltaInputType = z.infer<typeof saveDeltaInputSchema>;

export const saveDeltaOutputSchema = z.object({
    newIds: z.record(z.string().uuid(), z.string().uuid()).describe("Mapping of tempId to real database ID for newly created fields"),
});

export type SaveDeltaOutputType = z.infer<typeof saveDeltaOutputSchema>;

export const deleteFormInputSchema = z.object({
    formId: z.string().uuid().describe("Unique identifier of the form"),
    userId: z.string().uuid().describe("ID of the user requesting to delete the form"),
});

export type DeleteFormInputType = z.infer<typeof deleteFormInputSchema>;

export const exportResponsesCsvInputSchema = z.object({
    publishedFormId: z.string().uuid().describe("Unique identifier of the published form"),
    userId: z.string().uuid().describe("ID of the user requesting the export"),
});

export type ExportResponsesCsvInputType = z.infer<typeof exportResponsesCsvInputSchema>;

export const exportResponsesCsvOutputSchema = z.object({
    csv: z.string().describe("The generated CSV data as a string"),
    filename: z.string().describe("The suggested filename for the CSV download"),
});

export type ExportResponsesCsvOutputType = z.infer<typeof exportResponsesCsvOutputSchema>;
