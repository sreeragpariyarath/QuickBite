export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}
