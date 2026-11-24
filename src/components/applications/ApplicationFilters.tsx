import { RotateCcw, Search } from 'lucide-react';
import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  type ApplicationStatus,
  type EmploymentType,
} from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

export type SortOrder = 'newest' | 'oldest';

interface ApplicationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ApplicationStatus | '';
  onStatusFilterChange: (value: ApplicationStatus | '') => void;
  employmentTypeFilter: EmploymentType | '';
  onEmploymentTypeFilterChange: (value: EmploymentType | '') => void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function ApplicationFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  employmentTypeFilter,
  onEmploymentTypeFilterChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
  hasActiveFilters,
}: ApplicationFiltersProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-4">
          <Input
            type="search"
            placeholder="Search by company or job title..."
            aria-label="Search applications by company or job title"
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="lg:col-span-3">
          <Select
            aria-label="Filter by status"
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as ApplicationStatus | '')
            }
            options={APPLICATION_STATUSES.map((s) => ({ label: s, value: s }))}
          />
        </div>

        <div className="lg:col-span-2">
          <Select
            aria-label="Filter by employment type"
            placeholder="All Types"
            value={employmentTypeFilter}
            onChange={(e) =>
              onEmploymentTypeFilterChange(e.target.value as EmploymentType | '')
            }
            options={EMPLOYMENT_TYPES.map((t) => ({ label: t, value: t }))}
          />
        </div>

        <div className="lg:col-span-2">
          <Select
            aria-label="Sort by application date"
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
            options={[
              { label: 'Newest First', value: 'newest' },
              { label: 'Oldest First', value: 'oldest' },
            ]}
          />
        </div>

        <div className="flex items-center lg:col-span-1">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            title="Clear all filters"
            aria-label="Clear all filters"
            className="px-2.5"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="lg:hidden">Clear filters</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

