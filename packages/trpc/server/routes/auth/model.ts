import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared base schemas
// ---------------------------------------------------------------------------

// Shared email + password fields used by both create and sign-in schemas.
const credentialsSchema = z.object({
    email: z.email().describe('Email of the user'),
    password: z.string().min(8).max(100).describe('Password of the user'),
});

// Shared userId field used by OTP schemas.
const userIdSchema = z.object({
    userId: z.uuid().describe('ID of the user'),
});

// Most mutations return { success: boolean } — defined once, reused everywhere.
const successOutputSchema = z.object({
    success: z.boolean().describe('Whether the operation succeeded'),
});

// Sign-up and sign-in both return { id, success }.
const userSuccessOutputSchema = successOutputSchema.extend({
    id: z.string().describe('ID of the user'),
});

// ---------------------------------------------------------------------------
// Create user
// ---------------------------------------------------------------------------

export const createUserWithEmailAndPasswordInputSchema = credentialsSchema.extend({
    fullName: z.string().min(2).max(80).describe('Full name of the user'),
});

export const createUserWithEmailAndPasswordOutputSchema = userSuccessOutputSchema;

// ---------------------------------------------------------------------------
// OTP
// ---------------------------------------------------------------------------

export const verifyOtpInputSchema = userIdSchema.extend({
    otp: z.string().length(6).describe('6 digit OTP'),
});

export const verifyOtpOutputSchema = successOutputSchema;

export const resendOtpInputSchema = userIdSchema;

export const resendOtpOutputSchema = successOutputSchema;

// ---------------------------------------------------------------------------
// Sign in
// ---------------------------------------------------------------------------

export const signInWithEmailAndPasswordInputSchema = credentialsSchema;

export const signInWithEmailAndPasswordOutputSchema = userSuccessOutputSchema;

// ---------------------------------------------------------------------------
// Refresh / logout
// ---------------------------------------------------------------------------

export const refreshAccessTokenOutputSchema = successOutputSchema;

export const logoutOutputSchema = z.object({
    message: z.string().describe('Logout successful'),
});