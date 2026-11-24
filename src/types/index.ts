export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Under Review'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Internship'
  | 'Contract';

export type InterviewType = 'Online' | 'On-site';

export type ThemeMode = 'light' | 'dark';

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  companyWebsite?: string;
  location: string;
  employmentType: EmploymentType;
  jobDescription?: string;
  applicationDate: string; // YYYY-MM-DD
  salaryRange?: string;
  jobPostingUrl?: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface SavedJob {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  employmentType: EmploymentType;
  jobPostingUrl?: string;
  dateSaved: string; // YYYY-MM-DD
  notes?: string;
}

export interface Interview {
  id: string;
  companyName: string;
  jobTitle: string;
  interviewDate: string; // YYYY-MM-DD
  interviewTime: string; // HH:mm
  interviewType: InterviewType;
  locationOrLink: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface UserSettings {
  displayName: string;
  theme: ThemeMode;
  sidebarCollapsed: boolean;
}

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Wishlist',
  'Applied',
  'Under Review',
  'Interview',
  'Offer',
  'Rejected',
];

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Internship',
  'Contract',
];

export const INTERVIEW_TYPES: InterviewType[] = ['Online', 'On-site'];

