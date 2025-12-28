import { supabase, supabaseAdmin } from '../config/supabase';
import { AuthResponse, User, Session } from '@supabase/supabase-js';

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

class AuthService {
  /**
   * Register a new user with email and password
   */
  async register(data: RegisterData): Promise<{ user: User | null; session: Session | null; error: any }> {
    try {
      const { email, password, displayName } = data;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName
          }
        }
      });

      if (authError) {
        return { user: null, session: null, error: authError };
      }

      return { user: authData.user, session: authData.session, error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { user: null, session: null, error };
    }
  }

  /**
   * Sign in with email and password
   */
  async login(data: LoginData): Promise<{ user: User | null; session: Session | null; error: any }> {
    try {
      const { email, password } = data;

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return { user: null, session: null, error: authError };
      }

      return { user: authData.user, session: authData.session, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, session: null, error };
    }
  }

  /**
   * Sign out the current user
   */
  async logout(): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Logout error:', error);
      return { error };
    }
  }

  /**
   * Get the current user session
   */
  async getSession(): Promise<{ session: Session | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data.session, error };
    } catch (error) {
      console.error('Get session error:', error);
      return { session: null, error };
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<{ user: User | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { user: data.user, error };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error };
    }
  }

  /**
   * Get user profile from profiles table
   */
  async getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      return { profile: data, error };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { profile: null, error };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ profile: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      return { profile: data, error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { profile: null, error };
    }
  }

  /**
   * Verify JWT token (server-side)
   */
  async verifyToken(token: string): Promise<{ user: User | null; error: any }> {
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      return { user: data.user, error };
    } catch (error) {
      console.error('Verify token error:', error);
      return { user: null, error };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.REACT_APP_URL || 'http://localhost:3000'}/reset-password`
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return { error };
    }
  }
}

export default new AuthService();
