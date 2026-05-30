import { z } from 'zod';

// Shared base fields for form requests
const formBaseSchema = z.object({
    title: z.string().min(1).max(100).describe('The title of the form'),
    description: z.string().max(500).optional().describe('An optional description for the form'),
});

// Full form entity representation
const formEntitySchema = formBaseSchema.extend({
    id: z.string().uuid().describe('Unique identifier of the form'),
    status: z.enum(['draft', 'published', 'archived']).describe('Current status of the form'),
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
