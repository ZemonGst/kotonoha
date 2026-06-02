import { z } from "zod";

const formBaseSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional().nullable(),
});

export const formEntitySchema = formBaseSchema.extend({
    id: z.string().uuid(),
    status: z.enum(["draft", "active", "archived"]),
    createdBy: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const getAllFormsInputSchema = z.object({
    userId: z.string().uuid(),
    status: z.enum(["draft", "active", "archived"]).optional(),
});

export type GetAllFormsInputType = z.infer<typeof getAllFormsInputSchema>;

export const getAllFormsOutputSchema = z.array(formEntitySchema);

export type GetAllFormsOutputType = z.infer<typeof getAllFormsOutputSchema>;
