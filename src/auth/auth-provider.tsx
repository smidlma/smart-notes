import { PropsWithChildren, useMemo } from 'react';
import { AuthContext } from './auth-context';
import { useBoolean } from '@/hooks';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const loading = useBoolean(false);
  const authenticated = useBoolean(false);

  // const registerOrVerify = async (email: string) => {
  //   // if user does not exist, register
  // };

  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        // setState({ userInfo: response.data });
        console.log(response);
        authenticated.onTrue();
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
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      authenticated.onFalse();
    } catch (error) {
      console.error(error);
    }
  };

  const memoizedValue = useMemo(
    () => ({
      authenticated: authenticated.value,
      loading: loading.value,
      signInGoogle,
      signOut,
      user: null,
    }),
    [authenticated.value, loading.value]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
};
