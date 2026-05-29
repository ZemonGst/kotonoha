import { z } from "zod";

// ---------------------------------------------------------------------------
// getMe output schema — safe user shape returned to the client.
// passwordHash is intentionally excluded.
// ---------------------------------------------------------------------------

export const getMeOutputSchema = z.object({
    id: z.string().describe("Unique identifier of the user"),

    fullName: z.string().describe("Full name of the user"),

    email: z.email().describe("Email address of the user"),

    profileImageUrl: z.string().url().nullable()
        .describe("URL of the user's profile image, or null if not set"),

    emailVerified: z.boolean()
        .describe("Whether the user's email address has been verified"),
});

export type GetMeOutputType = z.infer<typeof getMeOutputSchema>;
