import { z } from "zod";

const envSchema = z.object({
    JWT_SECRET: z.string().describe("secret key for signing the jwt token"),
    ACCESS_TOKEN_EXPIRES_IN: z.string().describe("expiry time for the jwt token"),
    REFRESH_TOKEN_EXPIRES_IN: z.string().describe("expiry time for the jwt token"),
    RESEND_API_KEY: z.string().describe("API key for resend email service"),
    FRONTEND_URL: z.string().url().describe("Base URL of the hosted frontend (used to generate shareable form links)"),
});

function createEnv(env: NodeJS.ProcessEnv) {
    const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
