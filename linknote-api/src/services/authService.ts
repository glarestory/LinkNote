import { supabase } from '../config/supabase';

interface CreateUserParams {
    email: string;
    googleId: string;
    displayName?: string;
    avatarUrl?: string;
}

export const findOrCreateUser = async (profile: CreateUserParams) => {
    // Check if user exists by google_id
    const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', profile.googleId)
        .single();

    if (existingUser) {
        return existingUser;
    }

    // Create new user
    // Note: Depending on RLS and Service Role, this insert should work.
    // Ideally, 'email' should also be unique.
    const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
            {
                email: profile.email,
                google_id: profile.googleId,
                display_name: profile.displayName,
                avatar_url: profile.avatarUrl,
            },
        ])
        .select()
        .single();

    if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
    }

    return newUser;
};

export const getUserById = async (userId: string) => {
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) return null;
    return user;
}
