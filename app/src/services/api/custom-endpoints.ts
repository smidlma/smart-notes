import { api } from './api';

const customEndpoints = api;

export const {
  useLazyGetUserDetailApiUsersGetQuery,
  useLazyGetSummaryApiNotesSummaryNoteIdGetQuery,
} = customEndpoints;
