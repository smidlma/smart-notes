import { api } from './api';

const customEndpoints = api;

// .injectEndpoints({
//   endpoints: (build) => ({
//     uploadFile: build.mutation({
//       queryFn: async ({ type, data }: { hash: 'voice' | 'file'; data: FormData }, reduxApi) => {
//         try {
//           return {};
//         } catch (axiosError) {
//           const err = axiosError as any;

//           return {};
//         } finally {
//         }
//       },
//     }),
//   }),
// });

export const { useLazyGetUserDetailApiUsersGetQuery } = customEndpoints;
