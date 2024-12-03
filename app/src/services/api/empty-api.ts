import { createApi } from '@reduxjs/toolkit/query/react';

import { getBaseQuery } from '../utils/get-base-query';
import { API_BASE_URL } from '@/../config-global';

export const emptyApi = createApi({
  baseQuery: getBaseQuery(API_BASE_URL),
  endpoints: () => ({}),
});
