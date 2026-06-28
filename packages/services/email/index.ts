import { Resend } from "resend";

import { env } from "../env";

import {
    sendOtpEmailInputSchema,
    SendOtpEmailInputType,
    sendForgotPasswordEmailInputSchema,
    SendForgotPasswordEmailInputType,
} from "./model";

class EmailService {
    private resend = new Resend(env.RESEND_API_KEY);

    /**
     * Send OTP email to user
     *
     * Flow:
     * 1. Validate input
     * 2. Send email using Resend
     * 3. Check for sending errors
     * 4. Return email metadata
     */
    public async sendOtpEmail(
        payload: SendOtpEmailInputType
    ) {
        const { email, otp } =
            await sendOtpEmailInputSchema.parseAsync(payload);

        const result = await this.resend.emails.send({
            from: "noreply@kotonoha.soumyaditya.in",
            to: email,
            subject: "Verify your Kotonoha account",
            html: `
                <h2>Your verification code</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This code expires in 10 minutes.</p>
            `,
        });

        if (result.error) {
            throw new Error(result.error.message);
        }

        return result.data;
    }

    /**
     * Send forgot password email to user
     */
    public async sendForgotPasswordEmail(
        payload: SendForgotPasswordEmailInputType
    ) {
        const { email, otp } =
            await sendForgotPasswordEmailInputSchema.parseAsync(payload);

        const result = await this.resend.emails.send({
            from: "noreply@kotonoha.soumyaditya.in",
            to: email,
            subject: "Reset your Kotonoha password",
            html: `
                <h2>Password Reset Request</h2>
                <p>Your password reset OTP is:</p>
                <h1>${otp}</h1>
                <p>This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
            `,
        });

        if (result.error) {
            throw new Error(result.error.message);
        }

        return result.data;
    }
}

export default EmailService;