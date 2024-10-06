export type AuthContextType = {
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  authenticated: boolean;
  user: unknown;
};
