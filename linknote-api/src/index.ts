import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from './config/passport';
import authRoutes from './routes/auth';
import bookmarkRoutes from './routes/bookmarks';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(helmet());
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/bookmarks', bookmarkRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('LinkNote API Server is running');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
