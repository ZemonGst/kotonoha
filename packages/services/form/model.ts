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
    
    status: z.enum(["draft", "published", "archived"])
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
