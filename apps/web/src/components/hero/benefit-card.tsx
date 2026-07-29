import React from 'react';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function BenefitCard({ icon, title, description, className = '' }: BenefitCardProps) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#335438]/5">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold text-zinc-900 tracking-tight">{title}</h4>
        <p className="text-[10px] font-medium text-zinc-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
