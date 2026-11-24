import { useState, type FormEvent } from 'react';
import {
  EMPLOYMENT_TYPES,
  type EmploymentType,
  type SavedJob,
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

interface SavedJobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SavedJob, 'id'>) => void;
  initialData?: SavedJob | null;
}

interface FormValues {
  companyName: string;
  jobTitle: string;
  location: string;
  employmentType: EmploymentType;
  jobPostingUrl: string;
  dateSaved: string;
  notes: string;
}

interface FormErrors {
  companyName?: string;
  jobTitle?: string;
  jobPostingUrl?: string;
}

function getDefaults(initialData?: SavedJob | null): FormValues {
  if (initialData) {
    return {
      companyName: initialData.companyName,
      jobTitle: initialData.jobTitle,
      location: initialData.location,
      employmentType: initialData.employmentType,
      jobPostingUrl: initialData.jobPostingUrl ?? '',
      dateSaved: initialData.dateSaved,
      notes: initialData.notes ?? '',
    };
  }
  return {
    companyName: '',
    jobTitle: '',
    location: '',
    employmentType: 'Full-time',
    jobPostingUrl: '',
    dateSaved: getTodayDateString(),
    notes: '',
  };
}

export function SavedJobFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: SavedJobFormModalProps) {
  if (!isOpen) return null;

  return (
    <SavedJobFormModalContent
      key={initialData?.id ?? 'new'}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
    />
  );
}

function SavedJobFormModalContent({
  onClose,
  onSubmit,
  initialData,
}: Omit<SavedJobFormModalProps, 'isOpen'>) {
  const [values, setValues] = useState<FormValues>(() => getDefaults(initialData));
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: FormErrors = {};
    if (!values.companyName.trim()) {
      nextErrors.companyName = 'Company name is required.';
    }
    if (!values.jobTitle.trim()) {
      nextErrors.jobTitle = 'Job title is required.';
    }
    if (!isValidOptionalUrl(values.jobPostingUrl)) {
      nextErrors.jobPostingUrl = 'Please enter a valid job posting URL.';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      companyName: values.companyName.trim(),
      jobTitle: values.jobTitle.trim(),
      location: values.location.trim() || 'Remote',
      employmentType: values.employmentType,
      jobPostingUrl: normalizeUrl(values.jobPostingUrl),
      dateSaved: values.dateSaved || getTodayDateString(),
      notes: values.notes.trim() || undefined,
    });
    onClose();
  };

  const isEditing = Boolean(initialData);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? 'Edit Saved Job' : 'Save a Job Opportunity'}
      description="Bookmark roles you want to review and apply to later."
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="saved-job-form">
            {isEditing ? 'Save Changes' : 'Save Job'}
          </Button>
        </>
      }
    >
      <form id="saved-job-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Company Name"
          required
          placeholder="e.g., Datadog"
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
          placeholder="e.g., Software Engineer - Frontend"
          value={values.jobTitle}
          onChange={(e) => {
            setValues((prev) => ({ ...prev, jobTitle: e.target.value }));
            if (errors.jobTitle) setErrors((prev) => ({ ...prev, jobTitle: undefined }));
          }}
          error={errors.jobTitle}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Location"
            placeholder="e.g., New York, NY or Remote"
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Job Posting URL"
            type="url"
            placeholder="https://company.com/careers"
            value={values.jobPostingUrl}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, jobPostingUrl: e.target.value }));
              if (errors.jobPostingUrl) {
                setErrors((prev) => ({ ...prev, jobPostingUrl: undefined }));
              }
            }}
            error={errors.jobPostingUrl}
          />
          <Input
            label="Date Saved"
            type="date"
            value={values.dateSaved}
            onChange={(e) => setValues((prev) => ({ ...prev, dateSaved: e.target.value }))}
          />
        </div>
        <Textarea
          label="Notes"
          rows={2}
          placeholder="Why this role looks interesting or application deadline..."
          value={values.notes}
          onChange={(e) => setValues((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </form>
    </Modal>
  );
}
