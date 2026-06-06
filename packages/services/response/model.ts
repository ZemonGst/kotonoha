import { z } from "zod";

export const responseSchema = z.object({
    id: z.string().uuid(),
    publishedFormId: z.string().uuid(),
    responseData: z.record(z.string(), z.unknown()),
    submittedAt: z.date(),
    createdAt: z.date(),
});

export type ResponseType = z.infer<typeof responseSchema>;

export const submitResponseInputSchema = z.object({
    publishedFormId: z.string().uuid(),
    responseData: z.record(z.string(), z.unknown()),
});

export type SubmitResponseInputType = z.infer<typeof submitResponseInputSchema>;

export const getResponsesInputSchema = z.object({
    publishedFormId: z.string().uuid(),
});

export type GetResponsesInputType = z.infer<typeof getResponsesInputSchema>;
