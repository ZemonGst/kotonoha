import { z } from 'zod';

export const getAllFormsInputSchema = z.object({
    status: z.enum(["draft", "active", "archived"]).optional(),
});

export const formEntitySchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional().nullable(),
    status: z.enum(["draft", "active", "archived"]),
    createdBy: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const getAllFormsOutputSchema = z.array(formEntitySchema);
