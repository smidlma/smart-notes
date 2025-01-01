import { ACCESS_TOKEN_KEY } from '@/auth/types';
import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';

export const getBaseQuery =
  (endpoint: string) => async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    const result = await baseQuery(endpoint)(args, api, extraOptions);

    return result;
  };

export const baseQuery = (endpoint: string) =>
  fetchBaseQuery({
    timeout: 25000,
    baseUrl: endpoint,
    prepareHeaders: async (headers) => {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      return headers;
    },
  });
