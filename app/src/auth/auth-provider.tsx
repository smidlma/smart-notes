import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './auth-context';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useBoolean } from '@/hooks';
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN_KEY } from './types';
import { isValidToken } from './utils';
import { UserSchema } from '@/services/api';
import { useLazyGetUserDetailApiUsersGetQuery } from '@/services/api/custom-endpoints';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const loading = useBoolean(false);
  const authenticated = useBoolean(false);
  const [user, setUser] = useState<UserSchema | null>(null);
  const [getUserDetail] = useLazyGetUserDetailApiUsersGetQuery();

  const initialize = useCallback(async () => {
    try {
      loading.onTrue();
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (accessToken && isValidToken(accessToken)) {
        // get user and save it to state
        const currentUser = await getUserDetail().unwrap();

        setUser(currentUser);
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.onFalse();
    }
  }, [getUserDetail, loading]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const signInGoogle = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        // setState({ userInfo: response.data });
        console.log(response);
        if (response.data.idToken) {
          await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.data.idToken);
          authenticated.onTrue();
        } else {
          // Error no id_token
        }
      } else {
        // sign in was cancelled by user
        console.log('cancelled');
      }
    } catch (error) {
      console.log(error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  }, [authenticated]);

  const signOut = useCallback(async () => {
    try {
      // await GoogleSignin.signOut();
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      authenticated.onFalse();
    } catch (error) {
      console.error(error);
    }
  }, [authenticated]);

  const memoizedValue = useMemo(
    () => ({
      authenticated: authenticated.value,
      loading: loading.value,
      signInGoogle: signInGoogle,
      signOut,
      user,
    }),
    [authenticated.value, loading.value, signInGoogle, signOut, user]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
};
