import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken, setAuthCookies, UserPayload } from '../utils/tokenUtils';

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

interface AuthOptions {
    optional?: boolean;
}

export const authenticate = (options: AuthOptions = { optional: false }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;

        // 1. Check Access Token
        if (accessToken) {
            const payload = verifyAccessToken(accessToken);
            if (payload) {
                req.user = payload;
                return next();
            }
        }

        // 2. If Access Token invalid/missing, check Refresh Token
        if (refreshToken) {
            const payload = verifyRefreshToken(refreshToken);
            if (payload) {
                // Issue new Access Token
                const newAccessToken = generateAccessToken({
                    user_id: payload.user_id,
                    email: payload.email
                });

                // We can also rotate refresh token here if we want strictly secure 
                // but for now let's just refresh access token.
                // Re-set cookies
                setAuthCookies(res, newAccessToken, refreshToken);

                req.user = { user_id: payload.user_id, email: payload.email };
                return next();
            }
        }

        // 3. If no valid tokens
        if (options.optional) {
            return next();
        }

        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
            error: 'AUTH_REQUIRED'
        });
    };
};
