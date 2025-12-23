import axios from 'axios';

// Create axios instance with credentials (cookies)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true,
});

export interface User {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string;
}

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const response = await api.get('/auth/me');
        return response.data.data;
    } catch (error) {
        return null;
    }
};

export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};

export const loginWithGoogle = () => {
    // Redirect to backend auth endpoint
    window.location.href = `${api.defaults.baseURL}/auth/google`;
};

export default api;
