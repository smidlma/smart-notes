import { PropsWithChildren, useCallback, useEffect, useMemo, useReducer } from 'react';
import { AuthContext } from './auth-context';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN_KEY } from './types';
import { isValidToken } from './utils';
import { useOpenIdLoginApiTokenPostMutation, UserSchema } from '@/services/api';
import { useLazyGetUserDetailApiUsersGetQuery } from '@/services/api/custom-endpoints';

export type AuthUserType = null | UserSchema;

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: AuthUserType;
};

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }

  return state;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [getUserDetail] = useLazyGetUserDetailApiUsersGetQuery();

  const [openIdLogin] = useOpenIdLoginApiTokenPostMutation();

  const initialize = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

      if (accessToken && isValidToken(accessToken)) {
        const user = await getUserDetail().unwrap();

        dispatch({
          type: Types.INITIAL,
          payload: {
            user,
          },
        });

        return;
      }

      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    } catch (error) {
      console.log(error);

      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, [getUserDetail]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const signInGoogle = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        if (response.data.idToken) {
          const tokenResponse = await openIdLogin({
            tokenRequest: { id_token: response.data.idToken },
          }).unwrap();

          await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokenResponse?.access_token || '');

          const user = await getUserDetail().unwrap();
          dispatch({
            type: Types.LOGIN,
            payload: {
              user,
            },
          });
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
  }, [openIdLogin, getUserDetail]);

  // LOGOUT
  const signOut = useCallback(async () => {
    // await GoogleSignin.signOut();
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      signInGoogle,
      signOut,
    }),
    [signInGoogle, signOut, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
};
