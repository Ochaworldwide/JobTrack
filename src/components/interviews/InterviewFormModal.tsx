import { useState, type FormEvent } from 'react';
import {
  INTERVIEW_TYPES,
  type Interview,
  type InterviewType,
} from '../../types';
import { getTodayDateString, isValidOptionalUrl } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';

interface InterviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Interview, 'id' | 'createdAt' | 'completed'>) => void;
  initialData?: Interview | null;
}

interface FormValues {
  companyName: string;
  jobTitle: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: InterviewType;
  locationOrLink: string;
  notes: string;
}

interface FormErrors {
  companyName?: string;
  jobTitle?: string;
  interviewDate?: string;
  interviewTime?: string;
  locationOrLink?: string;
}

function getDefaults(initialData?: Interview | null): FormValues {
  if (initialData) {
    return {
      companyName: initialData.companyName,
      jobTitle: initialData.jobTitle,
      interviewDate: initialData.interviewDate,
      interviewTime: initialData.interviewTime,
      interviewType: initialData.interviewType,
      locationOrLink: initialData.locationOrLink,
      notes: initialData.notes ?? '',
    };
  }
  return {
    companyName: '',
    jobTitle: '',
    interviewDate: getTodayDateString(),
    interviewTime: '10:00',
    interviewType: 'Online',
    locationOrLink: '',
    notes: '',
  };
}

export function InterviewFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: InterviewFormModalProps) {
  if (!isOpen) return null;

  return (
    <InterviewFormModalContent
      key={initialData?.id ?? 'new'}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
    />
  );
}

function InterviewFormModalContent({
  onClose,
  onSubmit,
  initialData,
}: Omit<InterviewFormModalProps, 'isOpen'>) {
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
    if (!values.interviewDate) {
      nextErrors.interviewDate = 'Interview date is required.';
    }
    if (!values.interviewTime) {
      nextErrors.interviewTime = 'Interview time is required.';
    }
    if (!values.locationOrLink.trim()) {
      nextErrors.locationOrLink =
        values.interviewType === 'Online'
          ? 'Meeting link is required for online interviews.'
          : 'Physical address is required for on-site interviews.';
    } else if (
      values.interviewType === 'Online' &&
      !isValidOptionalUrl(values.locationOrLink)
    ) {
      nextErrors.locationOrLink = 'Please enter a valid meeting URL.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      companyName: values.companyName.trim(),
      jobTitle: values.jobTitle.trim(),
      interviewDate: values.interviewDate,
      interviewTime: values.interviewTime,
      interviewType: values.interviewType,
      locationOrLink: values.locationOrLink.trim(),
      notes: values.notes.trim() || undefined,
    });
    onClose();
  };

  const isEditing = Boolean(initialData);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? 'Edit Interview' : 'Schedule Interview'}
      description="Keep track of upcoming interview dates, links, and preparation notes."
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="interview-form">
            {isEditing ? 'Save Changes' : 'Schedule Interview'}
          </Button>
        </>
      }
    >
      <form id="interview-form" onSubmit={handleSubmit} noValidate className="space-y-4">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Interview Date"
            type="date"
            required
            value={values.interviewDate}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, interviewDate: e.target.value }))
            }
            error={errors.interviewDate}
          />
          <Input
            label="Interview Time"
            type="time"
            required
            value={values.interviewTime}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, interviewTime: e.target.value }))
            }
            error={errors.interviewTime}
          />
          <Select
            label="Interview Type"
            value={values.interviewType}
            onChange={(e) => {
              setValues((prev) => ({
                ...prev,
                interviewType: e.target.value as InterviewType,
              }));
              if (errors.locationOrLink) {
                setErrors((prev) => ({ ...prev, locationOrLink: undefined }));
              }
            }}
            options={INTERVIEW_TYPES.map((t) => ({ label: t, value: t }))}
          />
        </div>

        <Input
          label={values.interviewType === 'Online' ? 'Meeting Link' : 'Physical Address'}
          required
          placeholder={
            values.interviewType === 'Online'
              ? 'https://meet.google.com/...'
              : '123 Market St, Suite 400, San Francisco, CA'
          }
          value={values.locationOrLink}
          onChange={(e) => {
            setValues((prev) => ({ ...prev, locationOrLink: e.target.value }));
            if (errors.locationOrLink) {
              setErrors((prev) => ({ ...prev, locationOrLink: undefined }));
            }
          }}
          error={errors.locationOrLink}
        />

        <Textarea
          label="Additional Notes"
          rows={3}
          placeholder="Interviewer names, topics to prepare, questions to ask..."
          value={values.notes}
          onChange={(e) => setValues((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </form>
    </Modal>
  );
}
