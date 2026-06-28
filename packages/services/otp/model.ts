import { z } from "zod";

export const otpPurposeSchema = z.enum(["EMAIL_VERIFICATION", "PASSWORD_RESET"])
    .describe("Purpose of the OTP");

export type OtpPurpose = z.infer<typeof otpPurposeSchema>;

export const createOtpInputSchema = z.object({
    userId: z.string().describe("ID of the user"),
    purpose: otpPurposeSchema,
});

export type CreateOtpInputType = z.infer<typeof createOtpInputSchema>;

export const verifyOtpInputSchema = z.object({
    userId: z.string().describe("ID of the user"),
    otp: z.string().length(6).describe("6 digit OTP"),
    purpose: otpPurposeSchema,
});

export type VerifyOtpInputType = z.infer<typeof verifyOtpInputSchema>;

export const resendOtpInputSchema = z.object({
    userId: z.string().describe("ID of the user"),
    purpose: otpPurposeSchema,
});

export type ResendOtpInputType = z.infer<typeof resendOtpInputSchema>;

export const checkOtpInputSchema = z.object({
    userId: z.string().describe("ID of the user"),
    otp: z.string().length(6).describe("6 digit OTP"),
    purpose: otpPurposeSchema,
});

export type CheckOtpInputType = z.infer<typeof checkOtpInputSchema>;

export const consumeOtpInputSchema = z.object({
    userId: z.string().describe("ID of the user"),
    otp: z.string().length(6).describe("6 digit OTP"),
    purpose: otpPurposeSchema,
});

export type ConsumeOtpInputType = z.infer<typeof consumeOtpInputSchema>;