import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findOrCreateUser } from '../services/authService';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-client-id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'your-client-secret';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: `${BACKEND_URL}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(new Error('No email found in Google profile'));
                }

                const user = await findOrCreateUser({
                    email: email,
                    googleId: profile.id,
                    displayName: profile.displayName,
                    avatarUrl: profile.photos?.[0].value,
                });

                return done(null, user);
            } catch (error) {
                return done(error as Error);
            }
        }
    )
);

export default passport;
