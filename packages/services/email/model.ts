import { z } from "zod";

export const sendOtpEmailInputSchema = z.object({
    email: z.email().describe("Email address of the user"),

    otp: z.string()
        .length(6)
        .describe("6 digit OTP"),
});

export type SendOtpEmailInputType =
    z.infer<typeof sendOtpEmailInputSchema>;