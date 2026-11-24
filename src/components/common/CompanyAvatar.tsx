import { getAvatarColorClass, getCompanyInitials } from '../../utils/formatters';

interface CompanyAvatarProps {
  companyName: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs rounded-lg',
  md: 'h-9 w-9 text-xs rounded-lg',
  lg: 'h-11 w-11 text-sm rounded-xl',
};

export function CompanyAvatar({ companyName, size = 'md' }: CompanyAvatarProps) {
  const initials = getCompanyInitials(companyName);
  const colorClass = getAvatarColorClass(companyName);

  return (
    <div
      className={`flex shrink-0 items-center justify-center font-semibold tracking-tight select-none ${SIZE_CLASSES[size]} ${colorClass}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

