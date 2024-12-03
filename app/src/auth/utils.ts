import { jwtDecode } from 'jwt-decode';

export const isValidToken = (token: string) => {
  if (!token) {
    return false;
  }

  const decoded = jwtDecode(token);

  const currentTime = Date.now() / 1000;

  return (decoded?.exp as number) > currentTime;
};
