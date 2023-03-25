import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer'
import { supabase } from './supabaseClient';

interface User {
  id: string;
  email: string;
}

interface Category {
  id: string;
  user_id: string;
  name: string;
}

interface Belief {
  id: string;
  user_id: string;
  description: string;
  review_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | null;
  last_reviewed: string; // ISO 8601 format date-time string
}

interface Evidence {
  id: string;
  belief_id: string;
  is_prediction: boolean;
  confidence: number; // 0 to 100
  description: string;
}

export const useStore = create(immer((set) => ({
  user: null,
  beliefs: [],
  categories: [],
  evidence: [],

  setUser: (user: User) => set({ user }),

  fetchBeliefs: async () => {
    const { data, error } = await supabase.from('beliefs').select('*').order('id');
    if (!error && data) {
      set({ beliefs: data });
      console.log(data);
    } else {
      console.error('Error fetching beliefs:', error.message);
    }
  },

  fetchCategories: async () => {
    const { data, error } = await supabase.from('categories').select('*').order('id');
    if (!error && data) {
      set({ categories: data });
    } else {
      console.error('Error fetching categories:', error.message);
    }
  },

  fetchEvidence: async () => {
    const { data, error } = await supabase.from('evidence').select('*').order('id');
    if (!error && data) {
      set({ evidence: data });
    } else {
      console.error('Error fetching evidence:', error.message);
    }
  },


  addBelief: async (belief: Partial<Belief>) => {
    const { data, error } = await supabase
      .from('beliefs')
      .insert([belief]);

    if (error) {
      throw error;
    }

    if (data) {
      set((state) => {
        state.beliefs.push(data[0]);
      });
    }
  },

  updateBelief: async (beliefId: string, updatedData: Partial<Belief>) => {
    console.log("updateddata", updatedData);
    const {status, error} = await supabase
      .from('beliefs')
      .update(updatedData)
      .match({ id: beliefId });

    if (error) {
      throw error;
    }

    if (status === 204) {
      set((state) => {
        const index = state.beliefs.findIndex((belief: Belief) => belief.id === beliefId);
        if (index !== -1) {
          state.beliefs[index].description = updatedData.description;
        }
      });
    }
  },

  deleteBelief: async (beliefId: string) => {
    const { status, error } = await supabase
      .from('beliefs')
      .delete()
      .match({ id: beliefId });

    if (error) {
      throw error;
    }

    if (status === 204) {
      set((state) => {
        const index = state.beliefs.findIndex((belief: Belief) => belief.id === beliefId);
        if (index !== -1) {
          state.beliefs.splice(index, 1);
        }
      });
    }
  },

  addCategory: async (category) => {
    // Add your implementation to add a category to the database
  },

  updateCategory: async (category) => {
    // Add your implementation to update a category in the database
  },

  deleteCategory: async (categoryId) => {
    // Add your implementation to delete a category from the database
  },

  addEvidence: async (evidence) => {
    // Add your implementation to add evidence to the database
  },

  updateEvidence: async (evidence) => {
    // Add your implementation to update evidence in the database
  },

  deleteEvidence: async (evidenceId) => {
    // Add your implementation to delete evidence from the database
  },
})));
