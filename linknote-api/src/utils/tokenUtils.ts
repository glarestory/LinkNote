import jwt from 'jsonwebtoken';
import { Response } from 'express';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

// Duration: 15 minutes for access, 7 days for refresh
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface UserPayload {
    user_id: string;
    email: string;
}

export const generateAccessToken = (payload: UserPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (payload: UserPayload): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

export const verifyAccessToken = (token: string): UserPayload | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as UserPayload;
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token: string): UserPayload | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as UserPayload;
    } catch (error) {
        return null;
    }
};

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction, // Set to true in production (HTTPS)
        sameSite: 'lax', // or 'none' if backend/frontend on different domains and secure is true
        maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const clearAuthCookies = (res: Response) => {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax'
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax'
    });
}
