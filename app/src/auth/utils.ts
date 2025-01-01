import { jwtDecode } from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN_KEY } from './types';

export const isValidToken = (token: string | null) => {
  if (!token) {
    return false;
  }

  const decoded = jwtDecode(token);

  const currentTime = Date.now() / 1000;

  return (decoded?.exp as number) > currentTime;
};

export const getAccessToken = async () => {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

  if (!isValidToken(token)) {
    return null;
  }

  return token;
};
