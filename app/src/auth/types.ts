import { UserSchema } from '@/services/api';

export type AuthContextType = {
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  authenticated: boolean;
  user: UserSchema | null;
};

export const ACCESS_TOKEN_KEY = 'accessToken_CFaVhieprI2wE9nAA2hOpx_F3ZiPJaBf5u1eO6e1ygf';
