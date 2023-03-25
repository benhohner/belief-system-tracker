import { createClient } from '@supabase/supabase-js';
import { useStore } from '../state/store';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!(SUPABASE_URL && SUPABASE_ANON_KEY)) {
  throw Error("Couldn't find Supabase Env Variables.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getSessionUser = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error signing in:', error.message);
  } else {
    console.log(data.session)
    useStore.getState().setUser(data.session?.user ?? null);
  }
};

export const signIn = async () => {
  const email = prompt('Please enter your email:');

  if (email) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'https://example.com/welcome'
      }
    })

    if (error) {
      console.error('Error signing in:', error.message);
    } else {
      console.log('Magic link sent to', email);
      useStore.getState().setUser(data.user ?? null);
    }
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    useStore.getState().setUser(null);
  }
};