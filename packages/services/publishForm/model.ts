import { z } from "zod";

export const publishedFormSchema = z.object({
    id: z.string().uuid().describe("Unique identifier of the published form record"),
    formId: z.string().uuid().describe("ID of the base form"),
    publishedBy: z.string().uuid().describe("ID of the user who published the form"),
    publishedAt: z.date().describe("When the form was published"),
    expiresAt: z.date().nullable().optional().describe("When the published form expires"),
    createdAt: z.date().describe("When the record was created"),
    updatedAt: z.date().describe("When the record was last updated"),
});

export type PublishedFormType = z.infer<typeof publishedFormSchema>;

export const publishFormInputSchema = z.object({
    formId: z.string().uuid().describe("Unique identifier of the form to publish"),
    userId: z.string().uuid().describe("ID of the user requesting the publish action"),
    expiresAt: z.coerce.date().nullable().optional().describe("Optional expiration date for the published form"),
});

export type PublishFormInputType = z.infer<typeof publishFormInputSchema>;

export const getPublishedFormSchema = z.object({
    id: z.string().uuid().describe("Unique identifier of the published form"),
});

export type GetPublishedFormInputType = z.infer<typeof getPublishedFormSchema>;

export const getPublicFormWithFieldsOutputSchema = z.object({
    id: z.string().uuid(),
    formId: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable().optional(),
    status: z.string(),
    expiresAt: z.date().nullable().optional(),
    fields: z.array(z.any())
});
