export type UserRole = 'worker' | 'master';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  location?: string;
  age?: number;
  createdAt: Date;
  penaltyAmount?: number;
}

export interface Worker extends User {
  role: 'worker';
  specialties: string[];
  bio?: string;
  hourlyRate?: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  completedJobs: number;
  matchScore?: number;
}

export interface Master extends User {
  role: 'master';
}

export type BookingStatus = 'pending' | 'accepted' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  masterId: string;
  workerId: string;
  masterName: string;
  workerName: string;
  specialty: string;
  location: string;
  jobDetails: string;
  status: BookingStatus;
  quotedPrice?: number;
  createdAt: Date;
  scheduledDate?: Date;
  rating?: number;
  review?: string;
  cancellationReason?: string;
}

export const SPECIALTIES = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'Cleaner',
  'AC Repair',
  'Appliance Repair',
  'Mason',
  'Welder',
  'Gardener',
  'Driver',
  'Cook',
  'Security Guard',
  'Home Tutor',
  'Pest Control',
] as const;

export type Specialty = typeof SPECIALTIES[number];
