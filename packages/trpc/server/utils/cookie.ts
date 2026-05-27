import type { CookieOptions, Response, Request } from "express";
import { TRPCContext } from "../context";

// ---------------------------------------------------------------------------
// Time constants
// ---------------------------------------------------------------------------

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR   = 60 * ONE_MINUTE;
const ONE_DAY    = 24 * ONE_HOUR;
const ONE_WEEK   = 7  * ONE_DAY;
const ONE_MONTH  = 30 * ONE_DAY;
const ONE_YEAR   = 365 * ONE_DAY;

// ---------------------------------------------------------------------------
// Base cookie options — shared security flags applied to every cookie.
// Individual cookies extend this with their own maxAge.
// ---------------------------------------------------------------------------

const BASE_COOKIE_OPTIONS: CookieOptions = {
    path:     "/",
    httpOnly: true,
    secure:   true,
    sameSite: "strict",
};

// Named option sets — single source of truth for each token's lifetime.
// Any change to security flags or expiry only needs to happen here.
const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 900 * 1000, // 15 minutes
};

const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
    ...BASE_COOKIE_OPTIONS,
    maxAge: ONE_WEEK,   // 7 days
};

// ---------------------------------------------------------------------------
// Low-level cookie factories — used in context.ts
// ---------------------------------------------------------------------------

export function createCookieFactory(res: Response) {
    return function createCookie(
        name: string,
        value: string,
        opts: CookieOptions = BASE_COOKIE_OPTIONS
    ) {
        res.cookie(name, value, opts);
    };
}

export function getCookieFactory(req: Request) {
    return function getCookie(name: string) {
        return req.cookies[name];
    };
}

export function clearCookieFactory(res: Response) {
    return function clearCookie(name: string) {
        res.clearCookie(name);
    };
}

// ---------------------------------------------------------------------------
// Authentication cookie helpers
// ---------------------------------------------------------------------------

const ACCESS_TOKEN_COOKIE_NAME  = "authentication-token";
const REFRESH_TOKEN_COOKIE_NAME = "refresh-token";

// Sets both cookies on login — the only place the refresh token is issued.
export function setAuthenticationCookie(
    ctx: TRPCContext,
    accessToken: string,
    refreshToken: string
) {
    ctx.createCookie(ACCESS_TOKEN_COOKIE_NAME,  accessToken,  ACCESS_TOKEN_COOKIE_OPTIONS);
    ctx.createCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
}

// Used by the stateless refresh flow — updates only the access token cookie.
// The refresh token is NOT rotated; it lives until its original expiry,
// at which point the user must log in again.
export function setAccessTokenCookie(ctx: TRPCContext, accessToken: string) {
    ctx.createCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
}

export function clearAuthenticationCookie(ctx: TRPCContext) {
    ctx.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    ctx.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}

export function getAuthenticationCookie(ctx: TRPCContext) {
    return {
        accessToken:  ctx.getCookie(ACCESS_TOKEN_COOKIE_NAME),
        refreshToken: ctx.getCookie(REFRESH_TOKEN_COOKIE_NAME),
    };
}