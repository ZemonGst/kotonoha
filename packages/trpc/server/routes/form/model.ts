import { z } from 'zod';

// Shared base fields for form requests
const formBaseSchema = z.object({
    title: z.string().min(1).max(100).describe('The title of the form'),
    description: z.string().max(500).optional().describe('An optional description for the form'),
});

// Full form entity representation
const formEntitySchema = formBaseSchema.extend({
    id: z.string().uuid().describe('Unique identifier of the form'),
    status: z.enum(['draft', 'active', 'archived']).describe('Current status of the form'),
    createdBy: z.string().uuid().describe('ID of the user who created the form'),
    createdAt: z.date().describe('When the form was created'),
    updatedAt: z.date().describe('When the form was last updated'),
});

export const createFormInputSchema = formBaseSchema;

export const createFormOutputSchema = formEntitySchema;

export const getFormByIdInputSchema = z.object({
    formId: z.string().uuid().describe('Unique identifier of the form'),
});

export const getFormByIdOutputSchema = z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
});

export const updateFormStatusInputSchema = z.object({
    formId: z.string().uuid().describe('Unique identifier of the form'),
    status: z.enum(['draft', 'active', 'archived']).describe('New status for the form'),
});

export const updateFormStatusOutputSchema = formEntitySchema;

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
] as const;

const formFieldBaseSchema = z.object({
    type: z.enum(formFieldTypes).describe("Type of the field"),
    label: z.string().min(1).max(100).describe("User-facing field title"),
    description: z.string().nullable().optional().describe("Helper text below the label"),
    placeholder: z.string().nullable().optional().describe("Temporary text inside the input"),
    isRequired: z.boolean().default(false).describe("Whether the field must be completed"),
    order: z.number().describe("Field position within the form"),
    config: z.record(z.string(), z.unknown()).default({}).describe("Type-specific settings"),
});

const formFieldEntitySchema = formFieldBaseSchema.extend({
    id: z.string().uuid(),
    formId: z.string().uuid(),
    labelKey: z.string().max(100),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const createFieldInputSchema = formFieldBaseSchema.extend({
    formId: z.string().uuid().describe("ID of the form this field belongs to"),
});

export const createFieldOutputSchema = formFieldEntitySchema;

export const getFieldsInputSchema = z.object({
    formId: z.string().uuid(),
});

export const getFieldsOutputSchema = z.array(formFieldEntitySchema);

export const updateFieldInputSchema = formFieldBaseSchema.partial().extend({
    fieldId: z.string().uuid(),
    formId: z.string().uuid(),
});

export const updateFieldOutputSchema = formFieldEntitySchema;

export const deleteFieldInputSchema = z.object({
    fieldId: z.string().uuid(),
    formId: z.string().uuid(),
});

export const deleteFieldOutputSchema = z.boolean();

export const saveDeltaInputSchema = z.object({
    formId: z.string().uuid(),
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

export const saveDeltaOutputSchema = z.object({
    newIds: z.record(z.string().uuid(), z.string().uuid()).describe("Mapping of tempId to real database ID for newly created fields"),
});

export const deleteFormInputSchema = z.object({
    formId: z.string().uuid().describe('Unique identifier of the form to delete'),
});

export const deleteFormOutputSchema = z.boolean();
