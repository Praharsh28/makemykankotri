/**
 * AuthContext - Global authentication state
 * Manages user session with Supabase Auth
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '@/core/template-system/supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  email: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ data: AuthResponse['data'] | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  async function fetchProfile(userId: string, userEmail: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        console.log('✅ Profile loaded:', data.full_name);
        setProfile({
          id: data.id,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          role: data.role,
          email: userEmail,
        });
      } else if (error && error.code === 'PGRST116') {
        // Profile doesn't exist - create one for existing users
        console.log('⚠️ Profile not found, creating...');
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            full_name: 'User',
            role: 'user',
          })
          .select()
          .single();

        if (newProfile) {
          console.log('✅ Profile created:', newProfile.full_name);
          setProfile({
            id: newProfile.id,
            full_name: newProfile.full_name,
            avatar_url: newProfile.avatar_url,
            role: newProfile.role,
            email: userEmail,
          });
        } else {
          console.error('❌ Failed to create profile:', insertError?.message || insertError);
          console.log('💡 This is normal if RLS policies prevent profile creation. Using fallback profile.');
          // Still set fallback profile so user can continue
          setProfile({
            id: userId,
            full_name: 'User',
            role: 'user',
            email: userEmail,
          });
        }
      } else {
        console.error('❌ Profile error:', error);
        // Set fallback profile
        setProfile({
          id: userId,
          full_name: 'User',
          role: 'user',
          email: userEmail,
        });
      }
    } catch (err) {
      console.error('❌ Error in fetchProfile:', err);
      // Set minimal profile to prevent infinite loading
      setProfile({
        id: userId,
        full_name: 'User',
        role: 'user',
        email: userEmail,
      });
    }
  }

  useEffect(() => {
    console.log('🔄 Auth initializing...');
    
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('📡 Initial session:', session ? `Found (user: ${session.user?.email})` : 'None');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 Fetching profile for:', session.user.email);
        await fetchProfile(session.user.id, session.user.email || '');
      } else {
        // No session - ensure profile is null
        setProfile(null);
      }
      
      console.log('✅ Auth loading complete. Authenticated:', !!session?.user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth event:', event, session ? 'Session exists' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email || '');
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        // For development: auto-confirm users (no email confirmation needed)
        // In production: remove this to require email confirmation
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    // Return both data and error so we can check if email confirmation is required
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
