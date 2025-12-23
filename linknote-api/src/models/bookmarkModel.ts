import { supabase } from '../config/supabase';

export interface Bookmark {
    id: string;
    user_id: string;
    title: string;
    url: string;
    note?: string;
    favicon_url?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateBookmarkDTO {
    user_id: string;
    title: string;
    url: string;
    note?: string;
    favicon_url?: string;
}

export interface UpdateBookmarkDTO {
    title?: string;
    url?: string;
    note?: string;
    favicon_url?: string;
}

export const BookmarkModel = {
    async findAllByUserId(userId: string, page: number = 1, limit: number = 20) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabase
            .from('bookmarks')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;
        return { data, count };
    },

    async findById(id: string) {
        const { data, error } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(bookmark: CreateBookmarkDTO) {
        const { data, error } = await supabase
            .from('bookmarks')
            .insert([bookmark])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async search(userId: string, query: string, page: number = 1, limit: number = 20) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Provide a simple search using ILIKE
        // Note: For complex search, consider Full Text Search capabilities in Supabase/Postgres
        const { data, error, count } = await supabase
            .from('bookmarks')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .or(`title.ilike.%${query}%,url.ilike.%${query}%,note.ilike.%${query}%`)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;
        return { data, count };
    },

    async update(id: string, updates: UpdateBookmarkDTO) {
        const { data, error } = await supabase
            .from('bookmarks')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
