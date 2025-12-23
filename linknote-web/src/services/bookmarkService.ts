import api from './authService';
import { Bookmark, CreateBookmarkData, UpdateBookmarkData } from '../types/bookmark';

export const getBookmarks = async (page = 1, limit = 20) => {
    const response = await api.get(`/bookmarks?page=${page}&limit=${limit}`);
    return response.data;
};

export const createBookmark = async (data: CreateBookmarkData) => {
    const response = await api.post('/bookmarks', data);
    return response.data;
};

export const updateBookmark = async (id: string, data: UpdateBookmarkData) => {
    const response = await api.put(`/bookmarks/${id}`, data);
    return response.data;
};

export const deleteBookmark = async (id: string) => {
    const response = await api.delete(`/bookmarks/${id}`);
    return response.data;
};

// Utility to fetch metadata (mocked for now or call backend if implemented)
// The prompt said 'GET /api/meta?url={url}' but we haven't implemented that yet in backend.
// For now, we can rely on manual input or implement it later.
// We'll skip for this iteration or assume user inputs title.
