import { z } from "zod";

/**
 * Reusable User ID validation
 */
const userIdSchema = z
    .uuid()
    .describe("ID of the user");

/**
 * Create OTP
 */
export const createOtpForUserInputSchema = z.object({
    userId: userIdSchema,
});

export type CreateOtpForUserInputType =
    z.infer<typeof createOtpForUserInputSchema>;

/**
 * Verify OTP
 */
export const verifyOtpInputSchema = z.object({
    userId: userIdSchema,

    otp: z.string()
        .length(6)
        .describe("6 digit OTP entered by user"),
});

export type VerifyOtpInputType =
    z.infer<typeof verifyOtpInputSchema>;

/**
 * Resend OTP
 */
export const resendOtpInputSchema = z.object({
    userId: userIdSchema,
});

export type ResendOtpInputType =
    z.infer<typeof resendOtpInputSchema>;