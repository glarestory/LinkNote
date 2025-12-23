import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authenticate';
import { bookmarkController } from '../controllers/bookmarkController';

const router = Router();

// Validation Rules
const bookmarkValidation = [
    body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required (max 255 chars)'),
    body('url').isURL().withMessage('Valid URL is required'),
    body('note').optional().isLength({ max: 500 }).withMessage('Note max 500 chars')
];

// Routes
router.use(authenticate()); // Protect all routes

router.get('/search', bookmarkController.searchBookmarks);
router.get('/', bookmarkController.getBookmarks);
router.get('/:id', bookmarkController.getBookmarkById);
router.post('/', bookmarkValidation, bookmarkController.createBookmark);
router.put('/:id', bookmarkValidation, bookmarkController.updateBookmark);
router.delete('/:id', bookmarkController.deleteBookmark);

export default router;
