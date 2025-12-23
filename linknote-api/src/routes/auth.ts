import { Router } from 'express';
import passport from 'passport';
import { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies } from '../utils/tokenUtils';
import { authenticate } from '../middlewares/authenticate';
import { getUserById } from '../services/authService';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 1. Start Google OAuth
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 2. Google OAuth Callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login?error=auth_failed`, session: false }),
    (req, res) => {
        // req.user is populated by passport (from authService return value)
        const user = req.user as any;

        // Generate tokens
        const accessToken = generateAccessToken({ user_id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ user_id: user.id, email: user.email });

        // Set cookies
        setAuthCookies(res, accessToken, refreshToken);

        // Redirect to frontend dashboard
        res.redirect(`${FRONTEND_URL}/dashboard`);
    }
);

// 3. Logout
router.post('/logout', (req, res) => {
    clearAuthCookies(res);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// 4. Get Current User (Me)
router.get('/me', authenticate(), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await getUserById(req.user.user_id);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
        success: true,
        data: {
            id: user.id,
            email: user.email,
            display_name: user.display_name,
            avatar_url: user.avatar_url
        }
    });
});

export default router;
