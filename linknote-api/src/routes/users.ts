import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authenticate';
import { supabase } from '../config/supabase';

const router = Router();

router.use(authenticate());

// Update User Profile
router.put('/me', [
    body('display_name').optional().isString().isLength({ max: 50 }),
    body('avatar_url').optional().isURL().withMessage('Invalid URL found')
], async (req: any, res: any) => {
    try {
        const userId = req.user.user_id;
        const { display_name, avatar_url } = req.body;

        const updates: any = {};
        if (display_name !== undefined) updates.display_name = display_name;
        if (avatar_url !== undefined) updates.avatar_url = avatar_url;

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
});

// Delete Account
router.delete('/me', async (req: any, res: any) => {
    try {
        const userId = req.user.user_id;

        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) throw error;

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete account' });
    }
});

export default router;
