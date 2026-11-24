import { useState, type FormEvent } from 'react';
import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  type ApplicationStatus,
  type EmploymentType,
  type JobApplication,
} from '../../types';
import {
  getTodayDateString,
  isValidOptionalUrl,
  normalizeUrl,
} from '../../utils/formatters';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';

export interface ApplicationFormValues {
  companyName: string;
  jobTitle: string;
  companyWebsite: string;
  location: string;
  employmentType: EmploymentType;
  jobDescription: string;
  applicationDate: string;
  salaryRange: string;
  jobPostingUrl: string;
  status: ApplicationStatus;
  notes: string;
}

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: JobApplication | null;
}

interface FormErrors {
  companyName?: string;
  jobTitle?: string;
  companyWebsite?: string;
  jobPostingUrl?: string;
  applicationDate?: string;
}

function getDefaultValues(initialData?: JobApplication | null): ApplicationFormValues {
  if (initialData) {
    return {
      companyName: initialData.companyName,
      jobTitle: initialData.jobTitle,
      companyWebsite: initialData.companyWebsite ?? '',
      location: initialData.location,
      employmentType: initialData.employmentType,
      jobDescription: initialData.jobDescription ?? '',
      applicationDate: initialData.applicationDate,
      salaryRange: initialData.salaryRange ?? '',
      jobPostingUrl: initialData.jobPostingUrl ?? '',
      status: initialData.status,
      notes: initialData.notes ?? '',
    };
  }
  return {
    companyName: '',
    jobTitle: '',
    companyWebsite: '',
    location: '',
    employmentType: 'Full-time',
    jobDescription: '',
    applicationDate: getTodayDateString(),
    salaryRange: '',
    jobPostingUrl: '',
    status: 'Applied',
    notes: '',
  };
}

export function ApplicationFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ApplicationFormModalProps) {
  if (!isOpen) return null;

  return (
    <ApplicationFormModalContent
      key={initialData?.id ?? 'new'}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
    />
  );
}

function ApplicationFormModalContent({
  onClose,
  onSubmit,
  initialData,
}: Omit<ApplicationFormModalProps, 'isOpen'>) {
  const [values, setValues] = useState<ApplicationFormValues>(() =>
    getDefaultValues(initialData)
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!values.companyName.trim()) {
      nextErrors.companyName = 'Company name is required.';
    }
    if (!values.jobTitle.trim()) {
      nextErrors.jobTitle = 'Job title is required.';
    }
    if (!values.applicationDate) {
      nextErrors.applicationDate = 'Application date is required.';
    }
    if (!isValidOptionalUrl(values.companyWebsite)) {
      nextErrors.companyWebsite = 'Please enter a valid website URL (e.g., https://company.com).';
    }
    if (!isValidOptionalUrl(values.jobPostingUrl)) {
      nextErrors.jobPostingUrl = 'Please enter a valid job posting URL.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      companyName: values.companyName.trim(),
      jobTitle: values.jobTitle.trim(),
      companyWebsite: normalizeUrl(values.companyWebsite),
      location: values.location.trim() || 'Remote',
      employmentType: values.employmentType,
      jobDescription: values.jobDescription.trim() || undefined,
      applicationDate: values.applicationDate,
      salaryRange: values.salaryRange.trim() || undefined,
      jobPostingUrl: normalizeUrl(values.jobPostingUrl),
      status: values.status,
      notes: values.notes.trim() || undefined,
    });
    onClose();
  };

  const isEditing = Boolean(initialData);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? 'Edit Application' : 'Add New Application'}
      description={
        isEditing
          ? 'Update the details for this job application.'
          : 'Track a new job opportunity and keep all details organized.'
      }
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="application-form">
            {isEditing ? 'Save Changes' : 'Add Application'}
          </Button>
        </>
      }
    >
      <form id="application-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Company Name"
            required
            placeholder="e.g., Linear"
            value={values.companyName}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, companyName: e.target.value }));
              if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: undefined }));
            }}
            error={errors.companyName}
          />
          <Input
            label="Job Title"
            required
            placeholder="e.g., Frontend Engineer"
            value={values.jobTitle}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, jobTitle: e.target.value }));
              if (errors.jobTitle) setErrors((prev) => ({ ...prev, jobTitle: undefined }));
            }}
            error={errors.jobTitle}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Job Location"
            placeholder="e.g., San Francisco, CA or Remote"
            value={values.location}
            onChange={(e) => setValues((prev) => ({ ...prev, location: e.target.value }))}
          />
          <Select
            label="Employment Type"
            value={values.employmentType}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                employmentType: e.target.value as EmploymentType,
              }))
            }
            options={EMPLOYMENT_TYPES.map((type) => ({ label: type, value: type }))}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Application Date"
            type="date"
            required
            value={values.applicationDate}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, applicationDate: e.target.value }))
            }
            error={errors.applicationDate}
          />
          <Select
            label="Application Status"
            value={values.status}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                status: e.target.value as ApplicationStatus,
              }))
            }
            options={APPLICATION_STATUSES.map((status) => ({
              label: status,
              value: status,
            }))}
          />
          <Input
            label="Salary Range"
            placeholder="e.g., $110k - $135k"
            value={values.salaryRange}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, salaryRange: e.target.value }))
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Company Website"
            type="url"
            placeholder="https://company.com"
            value={values.companyWebsite}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, companyWebsite: e.target.value }));
              if (errors.companyWebsite) {
                setErrors((prev) => ({ ...prev, companyWebsite: undefined }));
              }
            }}
            error={errors.companyWebsite}
          />
          <Input
            label="Job Posting URL"
            type="url"
            placeholder="https://company.com/careers/role"
            value={values.jobPostingUrl}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, jobPostingUrl: e.target.value }));
              if (errors.jobPostingUrl) {
                setErrors((prev) => ({ ...prev, jobPostingUrl: undefined }));
              }
            }}
            error={errors.jobPostingUrl}
          />
        </div>

        <Textarea
          label="Job Description"
          rows={3}
          placeholder="Key responsibilities, tech stack, or role summary..."
          value={values.jobDescription}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, jobDescription: e.target.value }))
          }
        />

        <Textarea
          label="Notes"
          rows={3}
          placeholder="Referrals, interview prep reminders, follow-up dates..."
          value={values.notes}
          onChange={(e) => setValues((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </form>
    </Modal>
  );
}
