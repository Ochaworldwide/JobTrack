import type { Interview, JobApplication, SavedJob, UserSettings } from '../types';
import { getRelativeDateString } from './formatters';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  displayName: 'Lazarus Gabriel',
  theme: 'light',
  sidebarCollapsed: false,
};

function makeIsoOffset(offsetDays: number, hourOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(d.getHours() + hourOffset);
  return d.toISOString();
}

export function createInitialApplications(): JobApplication[] {
  return [
    {
      id: 'app-1',
      companyName: 'Linear',
      jobTitle: 'Frontend Engineer',
      companyWebsite: 'https://linear.app',
      location: 'Remote (US / EU)',
      employmentType: 'Full-time',
      jobDescription:
        'Build fast, keyboard-first web interfaces using React, TypeScript, and modern web standards.',
      applicationDate: getRelativeDateString(-2),
      salaryRange: '$130,000 - $155,000',
      jobPostingUrl: 'https://linear.app/careers',
      status: 'Interview',
      notes: 'Completed initial recruiter chat. Technical UI pairing session scheduled.',
      createdAt: makeIsoOffset(-2, -3),
      updatedAt: makeIsoOffset(0, -1),
    },
    {
      id: 'app-2',
      companyName: 'Vercel',
      jobTitle: 'Design Engineer',
      companyWebsite: 'https://vercel.com',
      location: 'San Francisco, CA (Hybrid)',
      employmentType: 'Full-time',
      jobDescription:
        'Bridge design and engineering on the dashboard experience and design system components.',
      applicationDate: getRelativeDateString(-5),
      salaryRange: '$140,000 - $170,000',
      jobPostingUrl: 'https://vercel.com/careers',
      status: 'Under Review',
      notes: 'Submitted portfolio and interactive component case study.',
      createdAt: makeIsoOffset(-5),
      updatedAt: makeIsoOffset(-1, -2),
    },
    {
      id: 'app-3',
      companyName: 'Stripe',
      jobTitle: 'Junior Frontend Developer',
      companyWebsite: 'https://stripe.com',
      location: 'New York, NY',
      employmentType: 'Full-time',
      jobDescription:
        'Work on Checkout and merchant dashboard experiences with a focus on accessibility and reliability.',
      applicationDate: getRelativeDateString(-10),
      salaryRange: '$125,000 - $145,000',
      jobPostingUrl: 'https://stripe.com/jobs',
      status: 'Offer',
      notes: 'Received verbal offer after final panel. Reviewing compensation package.',
      createdAt: makeIsoOffset(-10),
      updatedAt: makeIsoOffset(-1, -5),
    },
    {
      id: 'app-4',
      companyName: 'Figma',
      jobTitle: 'Product Engineer Intern',
      companyWebsite: 'https://figma.com',
      location: 'San Francisco, CA',
      employmentType: 'Internship',
      jobDescription:
        'Collaborate with designers and engineers to ship collaborative web tooling features.',
      applicationDate: getRelativeDateString(-14),
      salaryRange: '$52/hr',
      jobPostingUrl: 'https://figma.com/careers',
      status: 'Applied',
      notes: 'Applied with referral from university alum.',
      createdAt: makeIsoOffset(-14),
      updatedAt: makeIsoOffset(-3),
    },
    {
      id: 'app-5',
      companyName: 'Notion',
      jobTitle: 'UI Engineer',
      companyWebsite: 'https://notion.so',
      location: 'New York, NY (Hybrid)',
      employmentType: 'Full-time',
      jobDescription:
        'Improve editor responsiveness, accessibility, and cross-browser rendering performance.',
      applicationDate: getRelativeDateString(-18),
      salaryRange: '$135,000 - $160,000',
      jobPostingUrl: 'https://notion.so/careers',
      status: 'Interview',
      notes: 'Hiring manager screen went great. Preparing for system design round.',
      createdAt: makeIsoOffset(-18),
      updatedAt: makeIsoOffset(-2, -4),
    },
    {
      id: 'app-6',
      companyName: 'Supabase',
      jobTitle: 'Frontend Developer (Contract)',
      companyWebsite: 'https://supabase.com',
      location: 'Remote',
      employmentType: 'Contract',
      jobDescription:
        'Contribute to open-source Studio dashboards, table editor, and documentation tooling.',
      applicationDate: getRelativeDateString(-22),
      salaryRange: '$85/hr',
      jobPostingUrl: 'https://supabase.com/careers',
      status: 'Applied',
      notes: 'Highlighted open-source TypeScript contributions in cover note.',
      createdAt: makeIsoOffset(-22),
      updatedAt: makeIsoOffset(-6),
    },
    {
      id: 'app-7',
      companyName: 'Shopify',
      jobTitle: 'Frontend Developer',
      companyWebsite: 'https://shopify.com',
      location: 'Remote (North America)',
      employmentType: 'Full-time',
      jobDescription:
        'Develop merchant admin workflows and reusable Polaris UI components.',
      applicationDate: getRelativeDateString(-27),
      salaryRange: '$115,000 - $135,000',
      jobPostingUrl: 'https://shopify.com/careers',
      status: 'Rejected',
      notes: 'Role filled internally; recruiter offered to keep resume on file for Q2.',
      createdAt: makeIsoOffset(-27),
      updatedAt: makeIsoOffset(-12),
    },
    {
      id: 'app-8',
      companyName: 'Raycast',
      jobTitle: 'Web Platform Engineer',
      companyWebsite: 'https://raycast.com',
      location: 'London / Remote',
      employmentType: 'Full-time',
      jobDescription:
        'Build and maintain the Raycast web store, developer docs, and extension ecosystem portal.',
      applicationDate: getRelativeDateString(-1),
      salaryRange: '$120,000 - $140,000',
      jobPostingUrl: 'https://raycast.com/careers',
      status: 'Wishlist',
      notes: 'Tailoring portfolio project write-up before submitting.',
      createdAt: makeIsoOffset(-1),
      updatedAt: makeIsoOffset(-1),
    },
  ];
}

export function createInitialSavedJobs(): SavedJob[] {
  return [
    {
      id: 'saved-1',
      companyName: 'Datadog',
      jobTitle: 'Software Engineer - Frontend',
      location: 'New York, NY',
      employmentType: 'Full-time',
      jobPostingUrl: 'https://careers.datadoghq.com',
      dateSaved: getRelativeDateString(-1),
      notes: 'Strong visualization and React performance team.',
    },
    {
      id: 'saved-2',
      companyName: 'Cloudflare',
      jobTitle: 'UI Systems Engineer',
      location: 'Austin, TX (Hybrid)',
      employmentType: 'Full-time',
      jobPostingUrl: 'https://cloudflare.com/careers',
      dateSaved: getRelativeDateString(-4),
      notes: 'Check if TypeScript and accessibility focus aligns with resume.',
    },
    {
      id: 'saved-3',
      companyName: 'Loom',
      jobTitle: 'Frontend Developer Intern',
      location: 'Remote',
      employmentType: 'Internship',
      jobPostingUrl: 'https://loom.com/careers',
      dateSaved: getRelativeDateString(-7),
      notes: 'Applications close at the end of the month.',
    },
  ];
}

export function createInitialInterviews(): Interview[] {
  return [
    {
      id: 'int-1',
      companyName: 'Linear',
      jobTitle: 'Frontend Engineer',
      interviewDate: getRelativeDateString(2),
      interviewTime: '14:00',
      interviewType: 'Online',
      locationOrLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Live React & TypeScript component pairing session. Review keyboard accessibility patterns.',
      completed: false,
      createdAt: makeIsoOffset(-1),
    },
    {
      id: 'int-2',
      companyName: 'Notion',
      jobTitle: 'UI Engineer',
      interviewDate: getRelativeDateString(5),
      interviewTime: '11:30',
      interviewType: 'On-site',
      locationOrLink: '2300 Harrison St, San Francisco, CA',
      notes: 'Architecture discussion and team lunch with frontend platform leads.',
      completed: false,
      createdAt: makeIsoOffset(-2),
    },
    {
      id: 'int-3',
      companyName: 'Stripe',
      jobTitle: 'Junior Frontend Developer',
      interviewDate: getRelativeDateString(-6),
      interviewTime: '15:00',
      interviewType: 'Online',
      locationOrLink: 'https://zoom.us/j/987654321',
      notes: 'Final panel interview covering debugging, state management, and product sense.',
      completed: true,
      createdAt: makeIsoOffset(-10),
    },
  ];
}

