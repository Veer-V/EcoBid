
import { supabase } from '../lib/supabaseClient';
import { User } from './types';

export const AuthService = {

    async register(email: string, password: string, fullName: string, role: 'user' | 'admin' = 'user') {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, user: data.user };
    },

    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        const user: User = {
            id: data.user.id,
            email: data.user.email || '',
            fullName: data.user.user_metadata?.full_name,
            role: data.user.user_metadata?.role || 'user',
            createdAt: data.user.created_at
        };

        return { success: true, user, role: user.role };
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        return { success: !error, error: error?.message };
    },

    async getCurrentUser() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name,
            role: session.user.user_metadata?.role || 'user',
            createdAt: session.user.created_at
        };
        return user;
    },

    // Admin only: Get all users (This uses a specific table 'profiles' if it existed, but we'll try to list users securely if possible
    // NOTE: client-side listUsers() is usually restricted. 
    // For this demo, since we don't have a backend to proxy this, we might rely on a public 'profiles' table or similar.
    // I will assume there is a 'users_public' view or table for this, otherwise I'll return mock data for Admin Dashboard to prevent crash.
    async getUsers() {
        // Try to fetch from a hypothetic public profiles table
        const { data, error } = await supabase.from('profiles').select('*');
        if (error || !data) {
            console.warn("Could not fetch real users (table might be missing), using local state/empty");
            return [];
        }
        return data;
    },

    async updateUserStatus(email: string, status: 'active' | 'disabled') {
        // This requires admin privileges / edge function in a real app
        console.log(`Mocking status update for ${email} to ${status}`);
        return true;
    }
};
