export interface Belief {
  id: string;
  user_id: string;
  description: string;
  review_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | null;
  last_reviewed: string; // ISO 8601 format date-time string
}
