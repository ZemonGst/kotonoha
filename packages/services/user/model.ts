import { z } from "zod";

// Shared base schemas — single source of truth for common field definitions

// Both createUser and signIn require email + password with the same rules.
// Defined once here; each schema either uses it directly or extends it.
const credentialsSchema = z.object({
    email: z.email()
        .describe("Email of the user"),

    password: z.string().min(8).max(100)
        .describe("Password of the user"),
});

export const createUserWithEmailAndPasswordInputSchema = credentialsSchema.extend({
    fullName: z.string().min(2).max(80)
        .describe("Full name of the user"),
});

export type CreateUserWithEmailAndPasswordInputType =
    z.infer<typeof createUserWithEmailAndPasswordInputSchema>;

// signIn uses exactly the same fields as the base credentials schema.
export const signInWithEmailAndPasswordInputSchema = credentialsSchema;

export type SignInWithEmailAndPasswordInputType =
    z.infer<typeof signInWithEmailAndPasswordInputSchema>;

// JWT token schemas

// Token type discriminator — embedded in every JWT so we can validate
// the token is being used for its intended purpose without a DB lookup.
export const tokenTypeSchema = z.enum(["access", "refresh"])
    .describe("Type of the JWT token");

export type TokenType = z.infer<typeof tokenTypeSchema>;

// Payload passed into generateUserToken — what we sign into the JWT body.
export const generateUserTokenPayloadSchema = z.object({
    userId: z.string().describe("Id of the user"),
    tokenType: tokenTypeSchema,
});

export type GenerateUserTokenPayloadType =
    z.infer<typeof generateUserTokenPayloadSchema>;

// Schema for validating a decoded JWT after JWT.verify().
// Extends generateUserTokenPayloadSchema — iat and exp are added automatically
// by JWT.sign() and are always present on every decoded token.
export const jwtPayloadSchema = generateUserTokenPayloadSchema.extend({
    iat: z.number().describe("Issued at (unix timestamp)"),
    exp: z.number().describe("Expiration (unix timestamp)"),
});

export type JwtPayloadType = z.infer<typeof jwtPayloadSchema>;

// Schema for validating a decoded access token specifically.
// Refines jwtPayloadSchema to assert the token was issued as an access token —
// prevents a refresh token from being accepted on protected routes.
export const requiredAuthSchema = jwtPayloadSchema.refine(
    (payload) => payload.tokenType === "access",
    { message: "Token is not an access token" }
);

export type RequiredAuthType = z.infer<typeof requiredAuthSchema>;

// Refresh / logout schemas

// Used by the service's validateRefreshToken helper to accept
// the raw refresh token string extracted from the cookie.
export const requestTokenRefreshInputSchema = z.object({
    refreshToken: z.string()
        .describe("Refresh token (read from HTTP-only cookie)"),
});

export type RequestTokenRefreshInputType =
    z.infer<typeof requestTokenRefreshInputSchema>;

export const logoutOutputSchema = z.object({
    message: z.string().describe("Logout successful"),
});

export type LogoutOutputType = z.infer<typeof logoutOutputSchema>;