import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import { userService, otpService, emailService } from "../../services";

import {
    setAuthenticationCookie,
    clearAuthenticationCookie,
    getAuthenticationCookie,
    setAccessTokenCookie,
} from "../../utils/cookie";

import {
    createUserWithEmailAndPasswordInputSchema,
    createUserWithEmailAndPasswordOutputSchema,
    verifyOtpInputSchema,
    verifyOtpOutputSchema,
    resendOtpInputSchema,
    resendOtpOutputSchema,
    signInWithEmailAndPasswordInputSchema,
    signInWithEmailAndPasswordOutputSchema,
    refreshAccessTokenOutputSchema,
    logoutOutputSchema,
    forgotPasswordRequestInputSchema,
    forgotPasswordRequestOutputSchema,
    forgotPasswordVerifyInputSchema,
    forgotPasswordVerifyOutputSchema,
    resetPasswordInputSchema,
    resetPasswordOutputSchema,
} from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

// Every route in this router is a POST under /authentication — postMeta
// captures the repeated openapi shape so each procedure only declares its path + summary.
function postMeta(path: string, summary: string) {
    return {
        openapi: {
            method: "POST" as const,
            path: getPath(path),
            tags: TAGS,
            summary,
        },
    };
}

export const authRouter = router({
    // Create user with email and password
    createUserWithEmailAndPassword: publicProcedure
        .meta(postMeta("/createUserWithEmailAndPassword", "Create user with email and password"))
        .input(createUserWithEmailAndPasswordInputSchema)
        .output(createUserWithEmailAndPasswordOutputSchema)
        .mutation(async ({ input }) => {
            const { fullName, email, password } = input;

            const id = await userService.createUserWithEmailAndPassword({ fullName, email, password });
            const { otp } = await otpService.createOtp({ userId: id, purpose: "EMAIL_VERIFICATION" });
            await emailService.sendOtpEmail({ email, otp });

            return { id, success: true };
        }),

    // Verify OTP
    verifyOtp: publicProcedure
        .meta(postMeta("/verifyOtp", "Verify email OTP"))
        .input(verifyOtpInputSchema)
        .output(verifyOtpOutputSchema)
        .mutation(async ({ input }) => {
            const { userId, otp } = input;
            return otpService.verifyOtp({ userId, otp, purpose: "EMAIL_VERIFICATION" });
        }),

    // Resend OTP
    resendOtp: publicProcedure
        .meta(postMeta("/resendOtp", "Resend email verification OTP"))
        .input(resendOtpInputSchema)
        .output(resendOtpOutputSchema)
        .mutation(async ({ input }) => {
            const { userId } = input;

            const { otp } = await otpService.resendOtp({ userId, purpose: "EMAIL_VERIFICATION" });
            const user = await userService.getUserById(userId);

            if (!user) throw new Error("User not found");

            await emailService.sendOtpEmail({ email: user.email, otp });

            return { success: true };
        }),

    // Sign in with email and password
    signInWithEmailAndPassword: publicProcedure
        .meta(postMeta("/signInWithEmailAndPassword", "Sign in with email and password"))
        .input(signInWithEmailAndPasswordInputSchema)
        .output(signInWithEmailAndPasswordOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { email, password } = input;

            const { id, accessToken, refreshToken } =
                await userService.signInWithEmailAndPassword({ email, password });

            setAuthenticationCookie(ctx, accessToken, refreshToken);

            return { id, success: true };
        }),

    // Refresh access token — reads refresh token from cookie, no request body needed.
    // Stateless: JWT signature + tokenType claim are trusted without a DB call.
    refreshAccessToken: publicProcedure
        .meta(postMeta("/refreshAccessToken", "Refresh access token (cookie-based, stateless)"))
        .output(refreshAccessTokenOutputSchema)
        .mutation(async ({ ctx }) => {
            const { refreshToken } = getAuthenticationCookie(ctx);

            if (!refreshToken) throw new Error("Refresh token not found. Please log in again.");

            const { accessToken } = await userService.refreshAccessToken({ refreshToken });

            // Only update the access token cookie — refresh token is not rotated.
            setAccessTokenCookie(ctx, accessToken);

            return { success: true };
        }),
    //logout the user
    logout: protectedProcedure
        .meta(postMeta("/logout", "Logout user"))
        .output(logoutOutputSchema)
        .mutation(async ({ ctx }) => {
            clearAuthenticationCookie(ctx);
            return { message: "Logged out successfully" };
        }),

    // Forgot Password Request
    forgotPasswordRequest: publicProcedure
        .meta(postMeta("/forgotPasswordRequest", "Request a password reset OTP"))
        .input(forgotPasswordRequestInputSchema)
        .output(forgotPasswordRequestOutputSchema)
        .mutation(async ({ input }) => {
            const { email } = input;
            
            const user = await userService.getUserByEmail(email);
            if (!user) {
                // To prevent email enumeration, we could just return a fake success, 
                // but usually returning an error or just proceeding is fine.
                throw new Error("User with this email not found");
            }

            const { otp } = await otpService.createOtp({ userId: user.id, purpose: "PASSWORD_RESET" });
            await emailService.sendForgotPasswordEmail({ email: user.email, otp });

            return { id: user.id, success: true };
        }),

    // Verify Forgot Password OTP
    forgotPasswordVerify: publicProcedure
        .meta(postMeta("/forgotPasswordVerify", "Verify password reset OTP validity"))
        .input(forgotPasswordVerifyInputSchema)
        .output(forgotPasswordVerifyOutputSchema)
        .mutation(async ({ input }) => {
            const { userId, otp } = input;
            return otpService.checkOtp({ userId, otp, purpose: "PASSWORD_RESET" });
        }),

    // Reset Password
    resetPassword: publicProcedure
        .meta(postMeta("/resetPassword", "Reset the user's password with a valid OTP"))
        .input(resetPasswordInputSchema)
        .output(resetPasswordOutputSchema)
        .mutation(async ({ input }) => {
            const { userId, otp, newPassword } = input;
            
            // 1. Verify the OTP is valid first (throws if invalid)
            await otpService.checkOtp({ userId, otp, purpose: "PASSWORD_RESET" });

            // 2. Try to update the user's password (throws if it's the old password)
            await userService.resetUserPassword({ userId, newPassword });

            // 3. Now that the password reset succeeded, consume (delete) the OTP
            await otpService.consumeOtp({ userId, otp, purpose: "PASSWORD_RESET" });

            return { success: true };
        }),
});