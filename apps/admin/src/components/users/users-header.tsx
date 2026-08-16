'use client';

interface UsersHeaderProps {
  title?: string;
  subtitle?: string;
}

export function UsersHeader({
  title = 'User Management',
  subtitle = 'Manage system roles, permissions, and identity verification',
}: UsersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
