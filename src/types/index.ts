export type EventType = 'Hackathon' | 'Workshop' | 'Meetup' | 'Talk' | 'Conference' | 'Other';

export type City = {
  id: string;
  name: string;
  state: string;
};

export type Community = {
  id: string;
  name: string;
  logo?: string;
  cityId: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  website?: string;
  social_links?: string[];
  size?: number;
  year_founded?: number;
  previous_events?: string[];
  contact_email?: string;
  contact_phone?: string;
};

export type Sponsor = {
  id?: string;
  name: string;
  banner_url: string;
  website_url?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  endDate?: string;
  venue: string;
  isOnline: boolean;
  eventType: EventType;
  communityId: string;
  communityName: string;
  communityLogo?: string;
  organizerName?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  registrationUrl: string;
  createdAt: string;
  cityId: string;
  sponsors?: Sponsor[];
  featured?: boolean;
  registrationClicks: number;
};

export type EventFormData = Omit<Event, 'id' | 'createdAt' | 'communityName'> & {
  id?: string;
  sponsors?: Array<{
    name: string;
    banner: File | null;
    website_url?: string;
  }>;
};

export type ArchivedEvent = {
  id: string;
  title: string;
  date: string;
  end_date?: string;
  venue: string;
  is_online: boolean;
  event_type: string;
  community_id: string;
  community_name: string;
  communityLogo?: string;
  city_id: string;
  featured: boolean;
  created_at: string;
  archived_at: string;
  imageUrl?: string;
  registrationClicks: number;
};

export type FilterOptions = {
  date?: string;
  community?: string;
  eventType?: EventType;
  cityId?: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  organizerId?: string;
};

export type CommunityVerificationStatus = 'pending' | 'approved' | 'rejected';

export type CommunityVerification = {
  id: string;
  userId: string;
  communityName: string;
  communityDescription: string;
  proofOfExistence: string; 
  socialMediaLinks: string[];
  status: CommunityVerificationStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
};