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
            const { otp } = await otpService.createOtpForUser({ userId: id });
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
            return otpService.verifyOtp({ userId, otp });
        }),

    // Resend OTP
    resendOtp: publicProcedure
        .meta(postMeta("/resendOtp", "Resend email verification OTP"))
        .input(resendOtpInputSchema)
        .output(resendOtpOutputSchema)
        .mutation(async ({ input }) => {
            const { userId } = input;

            const { otp } = await otpService.resendOtp({ userId });
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
});