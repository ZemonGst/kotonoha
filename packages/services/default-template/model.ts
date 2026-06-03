import { z } from "zod";
import { createFormOutputSchema, createFieldOutputSchema } from "../form/model";

// --- Output Schemas for Read Operations ---

export const defaultTemplateSchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(100),
    description: z.string().max(500).nullable().optional(),
    category: z.string().max(100).nullable().optional(),
    icon: z.string().max(100).nullable().optional(),
    formId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type DefaultTemplateType = z.infer<typeof defaultTemplateSchema>;

export const getAllTemplatesOutputSchema = z.array(defaultTemplateSchema);

export type GetAllTemplatesOutputType = z.infer<typeof getAllTemplatesOutputSchema>;

// --- Template Preview Schemas ---

export const getTemplatePreviewInputSchema = z.object({
    templateId: z.string().uuid().describe("Unique identifier of the template"),
});

export type GetTemplatePreviewInputType = z.infer<typeof getTemplatePreviewInputSchema>;

export const getTemplatePreviewOutputSchema = z.object({
    template: defaultTemplateSchema,
    form: z.object({
        id: z.string().uuid(),
        title: z.string(),
        description: z.string().nullable().optional(),
    }),
    fields: z.array(z.object({
        id: z.string().uuid(),
        type: z.string(),
        label: z.string(),
        description: z.string().nullable().optional(),
        placeholder: z.string().nullable().optional(),
        isRequired: z.boolean(),
        order: z.number(),
        config: z.record(z.string(), z.unknown()),
    })),
});

export type GetTemplatePreviewOutputType = z.infer<typeof getTemplatePreviewOutputSchema>;

// --- Clone Template Schemas ---

export const cloneTemplateInputSchema = z.object({
    templateId: z.string().uuid().describe("ID of the template to clone"),
    userId: z.string().uuid().describe("ID of the user cloning the template"),
});

export type CloneTemplateInputType = z.infer<typeof cloneTemplateInputSchema>;

export const cloneTemplateOutputSchema = z.object({
    formId: z.string().uuid().describe("ID of the newly created draft form"),
});

export type CloneTemplateOutputType = z.infer<typeof cloneTemplateOutputSchema>;
