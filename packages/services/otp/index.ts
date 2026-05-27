import bcrypt from "bcrypt";

import { db, eq } from "@repo/database";

import { emailVerificationOtpsTable } from "@repo/database/models/userOtp";
import { usersTable } from "@repo/database/models/user";


import {
    createOtpForUserInputSchema,
    CreateOtpForUserInputType,

    verifyOtpInputSchema,
    VerifyOtpInputType,

    resendOtpInputSchema,
    ResendOtpInputType,
} from "./model";

class OtpService {
    // Get otp record for a user
    private async getOtpByUserId(userId: string) {
        const result = await db
            .select()
            .from(emailVerificationOtpsTable)
            .where(eq(emailVerificationOtpsTable.userId, userId));

        if (!result || result.length === 0) {
            return null;
        }

        return result[0];
    }
    // Deletes OTP record for a user
    private async deleteOtpByUserId(userId: string) {
        await db
            .delete(emailVerificationOtpsTable)
            .where(
                eq(emailVerificationOtpsTable.userId, userId)
            );
    }

    // Create otp for the user
    public async createOtpForUser(
        payload: CreateOtpForUserInputType
    ) {
        // Validate payload
        const { userId } =
            await createOtpForUserInputSchema.parseAsync(payload);

        // Generate random 6 digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Hash OTP before storing
        const otpHash = await bcrypt.hash(otp, 10);

        // OTP expires after 10 minutes
        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // Check if user already has an OTP record
        const existingOtp = await this.getOtpByUserId(userId);

        if (existingOtp) {
            // Update existing OTP
            await db
                .update(emailVerificationOtpsTable)
                .set({
                    otpHash,
                    attempts: 0,
                    expiresAt,
                })
                .where(
                    eq(
                        emailVerificationOtpsTable.userId,
                        userId
                    )
                );
        } else {
            // Create new OTP record in db
            await db
                .insert(emailVerificationOtpsTable)
                .values({
                    userId,
                    otpHash,
                    attempts: 0,
                    expiresAt,
                });
        }

        // Return plain OTP for email sending
        return {
            otp,
        };
    }


    // Verify otp for the user
    public async verifyOtp(
        payload: VerifyOtpInputType
    ) {
        const { userId, otp } =
            await verifyOtpInputSchema.parseAsync(payload);

        // Check user exists
        const userResult = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId));

        const user = userResult[0];

        if (!user) {
            throw new Error("User not found");
        }

        if (user.emailVerified) {
            throw new Error("Email already verified");
        }

        const otpRecord =
            await this.getOtpByUserId(userId);

        if (!otpRecord) {
            throw new Error("OTP not found");
        }

        // Block verification after 5 failed attempts
        if (otpRecord.attempts >= 5) {
            throw new Error(
                "Too many failed attempts. Please request a new OTP."
            );
        }

        // Check OTP expiry
        if (otpRecord.expiresAt < new Date()) {
            throw new Error("OTP has expired");
        }

        // Compare entered OTP with stored hash
        const isValid = await bcrypt.compare(
            otp,
            otpRecord.otpHash
        );

        if (!isValid) {
            await db
                .update(emailVerificationOtpsTable)
                .set({
                    attempts: otpRecord.attempts + 1,
                })
                .where(
                    eq(
                        emailVerificationOtpsTable.userId,
                        userId
                    )
                );

            throw new Error("Invalid OTP");
        }

        // Mark user email as verified
        await db
            .update(usersTable)
            .set({
                emailVerified: true,
            })
            .where(eq(usersTable.id, userId));

        // Remove OTP record after successful verification
        await this.deleteOtpByUserId(userId);

        return {
            success: true,
        };
    }

    // Resend otp for the user
    public async resendOtp(
        payload: ResendOtpInputType
    ) {
        const { userId } =
            await resendOtpInputSchema.parseAsync(payload);

        const otpRecord =
            await this.getOtpByUserId(userId);

        if (!otpRecord) {
            throw new Error("OTP record not found");
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpHash = await bcrypt.hash(otp, 10);

        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await db
            .update(emailVerificationOtpsTable)
            .set({
                otpHash,
                attempts: 0,
                expiresAt,
            })
            .where(
                eq(
                    emailVerificationOtpsTable.userId,
                    userId
                )
            );

        return {
            otp,
        };
    }

}

export default OtpService;