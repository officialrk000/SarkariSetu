export interface Job {
  id: string;
  title: string;
  organization: string;
  postDate: string;
  deadline: string;
  officialLink: string;
  category: 'Latest Job' | 'Admit Card' | 'Result' | 'Syllabus' | 'Answer Key' | 'Admission' | 'Scholarship' | 'Important Update';
  description?: string;
  imageUrl?: string;
  isNew?: boolean;
  isTrending?: boolean;
  // Supabase specific fields (new schema)
  post_name?: string;
  department?: string;
  important_dates?: string;
  application_fees?: string;
  age_limit?: string;
  apply_link?: string;
  notification_link?: string;
  official_website?: string;
  how_to_fill?: string;
  image_url?: string;
  created_at?: string;
}

export interface PushSubscription {
  token: string;
  createdAt: number;
}
