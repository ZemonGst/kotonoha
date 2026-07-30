import bcrypt from "bcrypt";
import * as JWT from "jsonwebtoken";

import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import { env } from "../env";

import {
    CreateUserWithEmailAndPasswordInputType,
    GenerateUserTokenPayloadType,
    JwtPayloadType,
    SignInWithEmailAndPasswordInputType,
    RequestTokenRefreshInputType,
    LogoutOutputType,
    createUserWithEmailAndPasswordInputSchema,
    generateUserTokenPayloadSchema,
    jwtPayloadSchema,
    requiredAuthSchema,
    signInWithEmailAndPasswordInputSchema,
    requestTokenRefreshInputSchema,
    logoutOutputSchema,
    resetUserPasswordInputSchema,
    ResetUserPasswordInputType,
} from "./model";

class UserService {
    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    public async getUserByEmail(email: string) {
        const result = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!result || result.length === 0) {
            return null;
        }

        return result[0];
    }

    // Signs a JWT with the provided payload (userId + tokenType) and expiry.
    // The tokenType claim lets validateRefreshToken reject misused tokens
    // without touching the database.
    private async generateUserToken(
        payload: GenerateUserTokenPayloadType,
        expiresIn: string
    ) {
        const { userId, tokenType } =
            await generateUserTokenPayloadSchema.parseAsync(payload);

        const token = JWT.sign(
            { userId, tokenType },
            env.JWT_SECRET,
            {
                expiresIn: expiresIn as JWT.SignOptions["expiresIn"],
            }
        );

        return { token };
    }

    // Typed convenience wrappers — single source of truth for each token's
    // tokenType + expiresIn pairing. Callers only need to pass userId.
    private generateAccessToken(userId: string) {
        return this.generateUserToken(
            { userId, tokenType: "access" },
            env.ACCESS_TOKEN_EXPIRES_IN
        );
    }

    private generateRefreshToken(userId: string) {
        return this.generateUserToken(
            { userId, tokenType: "refresh" },
            env.REFRESH_TOKEN_EXPIRES_IN
        );
    }

    // Validates a refresh token from the cookie — fully stateless.
    // Steps:
    //   1. Parse input schema
    //   2. Verify JWT signature + expiration (JWT.verify throws if invalid)
    //   3. Parse decoded payload with jwtPayloadSchema
    //   4. Assert token was issued as a refresh token — not an access token
    //
    // NO database call is made here.
    private async validateRefreshToken(
        payload: RequestTokenRefreshInputType
    ) {
        console.log("[DEBUG validateRefreshToken] Entry");
        let refreshToken: string;
        try {
            const parsed = await requestTokenRefreshInputSchema.parseAsync(payload);
            refreshToken = parsed.refreshToken;
            console.log("[DEBUG validateRefreshToken] Input schema parsed successfully");
        } catch (error) {
            console.error("[DEBUG validateRefreshToken] Failed to parse input schema:", error);
            throw error;
        }

        let decoded: unknown;
        try {
            console.log("[DEBUG validateRefreshToken] Before JWT verify");
            decoded = JWT.verify(refreshToken, env.JWT_SECRET);
            console.log("[DEBUG validateRefreshToken] After JWT verify");
        } catch (error) {
            console.error("[DEBUG validateRefreshToken] JWT verify failed:", error);
            throw new Error("Invalid or expired refresh token");
        }

        console.log("[DEBUG validateRefreshToken] Before payload shape validation");
        const parseResult = jwtPayloadSchema.safeParse(decoded);
        if (!parseResult.success) {
            console.error("[DEBUG validateRefreshToken] Payload shape validation failed:", parseResult.error);
            throw new Error("Malformed token payload");
        }
        console.log("[DEBUG validateRefreshToken] After payload shape validation");

        const jwtPayload: JwtPayloadType = parseResult.data;

        if (jwtPayload.tokenType !== "refresh") {
            console.error("[DEBUG validateRefreshToken] Invalid token type:", jwtPayload.tokenType);
            throw new Error("Invalid token type");
        }

        console.log("[DEBUG validateRefreshToken] Validation successful for userId:", jwtPayload.userId);
        return { userId: jwtPayload.userId };
    }

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------

    // Still used by the resendOtp route — DB lookup is intentional there.
    public async getUserById(userId: string) {
        const result = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId));

        if (!result || result.length === 0) {
            return null;
        }

        return result[0];
    }

    public async createUserWithEmailAndPassword(
        payload: CreateUserWithEmailAndPasswordInputType
    ) {
        const { fullName, email, password } =
            await createUserWithEmailAndPasswordInputSchema.parseAsync(payload);

        // Check if user already exists
        const existingUserWithEmail = await this.getUserByEmail(email);

        if (existingUserWithEmail) {
            throw new Error(`User with email ${email} already exists`);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user in the db
        const userInsertResult = await db
            .insert(usersTable)
            .values({
                fullName,
                email: email.toLowerCase(),
                passwordHash,
            })
            .returning({
                id: usersTable.id,
            });

        if (
            !userInsertResult ||
            userInsertResult.length === 0 ||
            !userInsertResult[0]?.id
        ) {
            throw new Error("Something went wrong while creating a user");
        }

        return userInsertResult[0].id;
    }

    // DB is touched here — intentional. This is the only place credentials
    // are validated. Tokens issued here carry all state needed for subsequent
    // stateless refreshes.
    public async signInWithEmailAndPassword(
        payload: SignInWithEmailAndPasswordInputType
    ) {
        const { email, password } =
            await signInWithEmailAndPasswordInputSchema.parseAsync(payload);

        // Verify user exists
        const user = await this.getUserByEmail(email);

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            throw new Error("Invalid password");
        }

        // Generate access token (short-lived) and refresh token (long-lived).
        // This token is NOT rotated — it lives until it expires, at which
        // point the user must log in again.
        const { token: accessToken } = await this.generateAccessToken(user.id);
        const { token: refreshToken } = await this.generateRefreshToken(user.id);

        return {
            id: user.id,
            accessToken,
            refreshToken,
        };
    }

    // Fully stateless — no DB call.
    // Reads the refresh token from the cookie (supplied by the route),
    // validates JWT signature + expiration + tokenType, and issues a new
    // access token using only the verified payload data.
    // The refresh token is NOT rotated — same cookie lives until expiry.
    public async refreshAccessToken(payload: RequestTokenRefreshInputType) {
        console.log("[DEBUG UserService.refreshAccessToken] Entry");
        try {
            const { userId } = await this.validateRefreshToken(payload);
            
            console.log("[DEBUG UserService.refreshAccessToken] Before generateAccessToken");
            const { token: newAccessToken } = await this.generateAccessToken(userId);
            console.log("[DEBUG UserService.refreshAccessToken] After generateAccessToken");
            
            return { accessToken: newAccessToken };
        } catch (error) {
            console.error("[DEBUG UserService.refreshAccessToken] Caught error:", error);
            throw error;
        }
    }

    // Validates an access token and returns the verified payload — fully stateless.
    // Called by the tRPC isAuthed middleware to protect routes.
    // Steps: verify JWT signature → parse with requiredAuthSchema → assert tokenType === "access".
    // No database call is made here.
    public async requireAuth(accessToken: string) {
        let decoded: unknown;
        try {
            decoded = JWT.verify(accessToken, env.JWT_SECRET);
        } catch {
            throw new Error("Invalid or expired access token");
        }

        const parseResult = requiredAuthSchema.safeParse(decoded);
        if (!parseResult.success) {
            throw new Error("Malformed token payload");
        }

        return { userId: parseResult.data.userId };
    }

    public async logout(payload: LogoutOutputType) {
        const { message } = await logoutOutputSchema.parseAsync(payload);
        return { message };
    }

    public async resetUserPassword(
        payload: ResetUserPasswordInputType
    ) {
        const { userId, newPassword } =
            await resetUserPasswordInputSchema.parseAsync(payload);

        // Check user exists
        const user = await this.getUserById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Check if new password is the same as the old password
        const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
        if (isSamePassword) {
            throw new Error("Please enter a new password that is different from your current one");
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update password in db
        await db
            .update(usersTable)
            .set({ passwordHash })
            .where(eq(usersTable.id, userId));

        return {
            success: true
        };
    }
}

export default UserService;