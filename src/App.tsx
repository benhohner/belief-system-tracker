import React, { useEffect } from 'react';
import { supabase, signIn, signOut, getSessionUser } from './state/supabaseClient';
import { useStore } from './state/store';
import './App.css';
import { Header } from './components/Header/Header';
import { BeliefForm } from './components/BeliefForm/BeliefForm';
import { BeliefList } from './components/BeliefList/BeliefList';
import { ReviewSection } from './components/ReviewSection/ReviewSection';

const App = () => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const fetchBeliefs = useStore((state) => state.fetchBeliefs);
  const fetchCategories = useStore((state) => state.fetchCategories);
  const beliefs = useStore((state) => state.beliefs);
  const categories = useStore((state) => state.categories);

  // Handle user authentication state changes
  useEffect(() => {
    getSessionUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      console.log(event);
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        console.log("fetching beliefs and categories", user);
        await Promise.all([fetchBeliefs(), fetchCategories()]);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, fetchBeliefs, fetchCategories]);

  return (
    <div className="App">
      <Header onSignIn={signIn} onSignOut={signOut} />
      {user ? (
        <>
          <BeliefForm />
          <BeliefList />
          <ReviewSection />
        </>
      ) : (
        <div>Please sign in to manage and review your beliefs and predictions.</div>
      )}
    </div>
  );
};

export default App;
