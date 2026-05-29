import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared base schemas — single source of truth for common field definitions
// ---------------------------------------------------------------------------

const dashboardUserBaseSchema = z.object({
    fullName: z.string().describe("Full name of the user"),

    email: z.email().describe("Email address of the user"),

    profileImageUrl: z.string().url().nullable()
        .describe("URL of the user's profile image, or null if not set"),

    emailVerified: z.boolean()
        .describe("Whether the user's email address has been verified"),
});

// ---------------------------------------------------------------------------
// Dashboard User entity schema
// ---------------------------------------------------------------------------

// Represents the safe user shape returned to the client.
// passwordHash is intentionally excluded.
export const dashboardUserSchema = dashboardUserBaseSchema.extend({
    id: z.string().describe("Unique identifier of the user"),
});

export type DashboardUserType = z.infer<typeof dashboardUserSchema>;
