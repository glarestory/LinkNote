import { Request, Response } from 'express';
import { BookmarkModel, CreateBookmarkDTO, UpdateBookmarkDTO } from '../models/bookmarkModel';
import { validationResult } from 'express-validator';

// Helper to extract favicon (simple version)
const getFaviconUrl = (url: string) => {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
        return null;
    }
};

export const bookmarkController = {
    async getBookmarks(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const userId = req.user!.user_id;

            const { data, count } = await BookmarkModel.findAllByUserId(userId, page, limit);

            res.json({
                success: true,
                data,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: count ? Math.ceil(count / limit) : 0
                }
            });
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch bookmarks' });
        }
    },

    async searchBookmarks(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const query = req.query.q as string;
            const userId = req.user!.user_id;

            if (!query) {
                return res.status(400).json({ success: false, message: 'Search query is required' });
            }

            const { data, count } = await BookmarkModel.search(userId, query, page, limit);

            res.json({
                success: true,
                data,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: count ? Math.ceil(count / limit) : 0
                }
            });
        } catch (error) {
            console.error('Error searching bookmarks:', error);
            res.status(500).json({ success: false, message: 'Failed to search bookmarks' });
        }
    },

    async getBookmarkById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user!.user_id;

            const bookmark = await BookmarkModel.findById(id);

            if (!bookmark || bookmark.user_id !== userId) {
                return res.status(404).json({ success: false, message: 'Bookmark not found' });
            }

            res.json({ success: true, data: bookmark });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch bookmark' });
        }
    },

    async createBookmark(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const { title, url, note } = req.body;
            const userId = req.user!.user_id;
            const faviconUrl = getFaviconUrl(url) || undefined;

            const newBookmark: CreateBookmarkDTO = {
                user_id: userId,
                title,
                url,
                note,
                favicon_url: faviconUrl
            };

            const bookmark = await BookmarkModel.create(newBookmark);
            res.status(201).json({ success: true, data: bookmark });
        } catch (error) {
            console.error('Create bookmark error:', error);
            res.status(500).json({ success: false, message: 'Failed to create bookmark' });
        }
    },

    async updateBookmark(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const { id } = req.params;
            const { title, url, note } = req.body;
            const userId = req.user!.user_id;

            // Verify ownership
            const existing = await BookmarkModel.findById(id);
            if (!existing || existing.user_id !== userId) {
                return res.status(404).json({ success: false, message: 'Bookmark not found' });
            }

            const updates: UpdateBookmarkDTO = {
                title,
                url,
                note,
                favicon_url: url ? getFaviconUrl(url) || undefined : undefined
            };

            const updatedBookmark = await BookmarkModel.update(id, updates);
            res.json({ success: true, data: updatedBookmark });
        } catch (error) {
            console.error('Update bookmark error:', error);
            res.status(500).json({ success: false, message: 'Failed to update bookmark' });
        }
    },

    async deleteBookmark(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user!.user_id;

            // Verify ownership
            const existing = await BookmarkModel.findById(id);
            if (!existing || existing.user_id !== userId) {
                return res.status(404).json({ success: false, message: 'Bookmark not found' });
            }

            await BookmarkModel.delete(id);
            res.json({ success: true, message: 'Bookmark deleted' });
        } catch (error) {
            console.error('Delete bookmark error:', error);
            res.status(500).json({ success: false, message: 'Failed to delete bookmark' });
        }
    }
};
