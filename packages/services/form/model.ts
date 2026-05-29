import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared base schemas — single source of truth for common field definitions
// ---------------------------------------------------------------------------

const formBaseSchema = z.object({
    title: z.string().min(1).max(100)
        .describe("The title of the form"),

    description: z.string().max(500).optional()
        .describe("An optional description for the form"),
});

// ---------------------------------------------------------------------------
// Form entity schema
// ---------------------------------------------------------------------------

// Represents the complete form entity record.
// Reused as the returned output type for create operations instead of duplicating.
export const formSchema = formBaseSchema.extend({
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

export type FormType = z.infer<typeof formSchema>;

// ---------------------------------------------------------------------------
// Create form schemas
// ---------------------------------------------------------------------------

// Validates incoming data specifically for the initial create form flow
export const createFormInputSchema = formBaseSchema;

export type CreateFormInputType = z.infer<typeof createFormInputSchema>;
