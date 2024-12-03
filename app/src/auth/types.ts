export type AuthContextType = {
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  authenticated: boolean;
  user: unknown;
};

export const ACCESS_TOKEN_KEY = 'accessToken_CFaVhieprI2wE9nAA2hOpx_F3ZiPJaBf5u1eO6e1ygf';
