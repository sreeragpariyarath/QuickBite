import { useAuth as useAuthCtx } from '@/context/auth-context';

export function useAuth() {
  return useAuthCtx();
}
