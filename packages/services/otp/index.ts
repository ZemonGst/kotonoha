import bcrypt from "bcrypt";

import { db, eq, and } from "@repo/database";

import { userOtpsTable } from "@repo/database/models/userOtp";
import { usersTable } from "@repo/database/models/user";

import {
    createOtpInputSchema,
    CreateOtpInputType,
    verifyOtpInputSchema,
    VerifyOtpInputType,
    resendOtpInputSchema,
    ResendOtpInputType,
    checkOtpInputSchema,
    CheckOtpInputType,
    consumeOtpInputSchema,
    ConsumeOtpInputType,
    OtpPurpose,
} from "./model";

class OtpService {
    // Get otp record for a user and purpose
    private async getOtpByUserIdAndPurpose(userId: string, purpose: OtpPurpose) {
        const result = await db
            .select()
            .from(userOtpsTable)
            .where(
                and(
                    eq(userOtpsTable.userId, userId),
                    eq(userOtpsTable.purpose, purpose)
                )
            );

        if (!result || result.length === 0) {
            return null;
        }

        return result[0];
    }

    // Deletes OTP record for a user and purpose
    private async deleteOtpByUserIdAndPurpose(userId: string, purpose: OtpPurpose) {
        await db
            .delete(userOtpsTable)
            .where(
                and(
                    eq(userOtpsTable.userId, userId),
                    eq(userOtpsTable.purpose, purpose)
                )
            );
    }

    public async createOtp(payload: CreateOtpInputType) {
        const { userId, purpose } = await createOtpInputSchema.parseAsync(payload);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const existingOtp = await this.getOtpByUserIdAndPurpose(userId, purpose);

        if (existingOtp) {
            await db
                .update(userOtpsTable)
                .set({ otpHash, attempts: 0, expiresAt })
                .where(and(eq(userOtpsTable.userId, userId), eq(userOtpsTable.purpose, purpose)));
        } else {
            await db
                .insert(userOtpsTable)
                .values({ userId, purpose, otpHash, attempts: 0, expiresAt });
        }

        return { otp };
    }

    public async checkOtp(payload: CheckOtpInputType) {
        const { userId, otp, purpose } = await checkOtpInputSchema.parseAsync(payload);
        const otpRecord = await this.getOtpByUserIdAndPurpose(userId, purpose);

        if (!otpRecord) throw new Error("OTP not found");
        if (otpRecord.attempts >= 5) throw new Error("Too many failed attempts. Please request a new OTP.");
        if (otpRecord.expiresAt < new Date()) throw new Error("OTP has expired");

        const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

        if (!isValid) {
            await db
                .update(userOtpsTable)
                .set({ attempts: otpRecord.attempts + 1 })
                .where(and(eq(userOtpsTable.userId, userId), eq(userOtpsTable.purpose, purpose)));
            throw new Error("Invalid OTP");
        }

        return { success: true };
    }

    public async consumeOtp(payload: ConsumeOtpInputType) {
        const { userId, otp, purpose } = await consumeOtpInputSchema.parseAsync(payload);
        await this.checkOtp({ userId, otp, purpose });
        await this.deleteOtpByUserIdAndPurpose(userId, purpose);
        return { success: true };
    }

    // Verify otp for email verification (wraps consumeOtp to also update user status)
    public async verifyOtp(payload: VerifyOtpInputType) {
        const { userId, otp, purpose } = await verifyOtpInputSchema.parseAsync(payload);
        
        if (purpose !== "EMAIL_VERIFICATION") {
            throw new Error("verifyOtp is only for email verification");
        }

        const userResult = await db.select().from(usersTable).where(eq(usersTable.id, userId));
        const user = userResult[0];
        if (!user) throw new Error("User not found");
        if (user.emailVerified) throw new Error("Email already verified");

        await this.consumeOtp({ userId, otp, purpose });

        await db
            .update(usersTable)
            .set({ emailVerified: true })
            .where(eq(usersTable.id, userId));

        return { success: true };
    }

    public async resendOtp(payload: ResendOtpInputType) {
        const { userId, purpose } = await resendOtpInputSchema.parseAsync(payload);
        const otpRecord = await this.getOtpByUserIdAndPurpose(userId, purpose);

        if (!otpRecord) throw new Error("OTP record not found");

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await db
            .update(userOtpsTable)
            .set({ otpHash, attempts: 0, expiresAt })
            .where(and(eq(userOtpsTable.userId, userId), eq(userOtpsTable.purpose, purpose)));

        return { otp };
    }
}

export default OtpService;