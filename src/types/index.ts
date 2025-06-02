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
};

export type EventFormData = Omit<Event, 'id' | 'createdAt' | 'communityName'> & {
  id?: string;
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