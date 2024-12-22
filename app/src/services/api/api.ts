import { emptyApi as api } from "./empty-api";
export const addTagTypes = ["token", "users", "notes"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      openIdLoginApiTokenPost: build.mutation<
        OpenIdLoginApiTokenPostApiResponse,
        OpenIdLoginApiTokenPostApiArg
      >({
        query: (queryArg) => ({
          url: `/api/token/`,
          method: "POST",
          body: queryArg.tokenRequest,
        }),
        invalidatesTags: ["token"],
      }),
      getUserDetailApiUsersGet: build.query<
        GetUserDetailApiUsersGetApiResponse,
        GetUserDetailApiUsersGetApiArg
      >({
        query: () => ({ url: `/api/users/` }),
        providesTags: ["users"],
      }),
      readNotesApiNotesGet: build.query<
        ReadNotesApiNotesGetApiResponse,
        ReadNotesApiNotesGetApiArg
      >({
        query: () => ({ url: `/api/notes/` }),
        providesTags: ["notes"],
      }),
      createNoteApiNotesPost: build.mutation<
        CreateNoteApiNotesPostApiResponse,
        CreateNoteApiNotesPostApiArg
      >({
        query: (queryArg) => ({
          url: `/api/notes/`,
          method: "POST",
          body: queryArg.noteCreate,
        }),
        invalidatesTags: ["notes"],
      }),
      readNoteApiNotesNoteIdGet: build.query<
        ReadNoteApiNotesNoteIdGetApiResponse,
        ReadNoteApiNotesNoteIdGetApiArg
      >({
        query: (queryArg) => ({ url: `/api/notes/${queryArg.noteId}` }),
        providesTags: ["notes"],
      }),
      updateNoteApiNotesNoteIdPatch: build.mutation<
        UpdateNoteApiNotesNoteIdPatchApiResponse,
        UpdateNoteApiNotesNoteIdPatchApiArg
      >({
        query: (queryArg) => ({
          url: `/api/notes/${queryArg.noteId}`,
          method: "PATCH",
          body: queryArg.noteUpdate,
        }),
        invalidatesTags: ["notes"],
      }),
      getSummaryApiNotesSummaryNoteIdGet: build.query<
        GetSummaryApiNotesSummaryNoteIdGetApiResponse,
        GetSummaryApiNotesSummaryNoteIdGetApiArg
      >({
        query: (queryArg) => ({ url: `/api/notes/summary/${queryArg.noteId}` }),
        providesTags: ["notes"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as api };
export type OpenIdLoginApiTokenPostApiResponse =
  /** status 200 Successful Response */ Token | null;
export type OpenIdLoginApiTokenPostApiArg = {
  tokenRequest: TokenRequest;
};
export type GetUserDetailApiUsersGetApiResponse =
  /** status 200 Successful Response */ UserSchema;
export type GetUserDetailApiUsersGetApiArg = void;
export type ReadNotesApiNotesGetApiResponse =
  /** status 200 Successful Response */ NoteSchema[];
export type ReadNotesApiNotesGetApiArg = void;
export type CreateNoteApiNotesPostApiResponse =
  /** status 200 Successful Response */ NoteSchema;
export type CreateNoteApiNotesPostApiArg = {
  noteCreate: NoteCreate;
};
export type ReadNoteApiNotesNoteIdGetApiResponse =
  /** status 200 Successful Response */ NoteSchema;
export type ReadNoteApiNotesNoteIdGetApiArg = {
  noteId: string;
};
export type UpdateNoteApiNotesNoteIdPatchApiResponse =
  /** status 200 Successful Response */ NoteSchema;
export type UpdateNoteApiNotesNoteIdPatchApiArg = {
  noteId: string;
  noteUpdate: NoteUpdate;
};
export type GetSummaryApiNotesSummaryNoteIdGetApiResponse =
  /** status 200 Successful Response */ NoteSummary;
export type GetSummaryApiNotesSummaryNoteIdGetApiArg = {
  noteId: string;
};
export type Token = {
  access_token: string;
  token_type: string;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type TokenRequest = {
  id_token: string;
};
export type UserSchema = {
  created_at?: string;
  updated_at?: string;
  id?: string;
  email: string;
  given_name: string;
  family_name: string;
};
export type NoteSchema = {
  created_at?: string;
  updated_at?: string;
  id?: string;
  title: string;
  rich_text: string;
  description: string | null;
  user_id?: string | null;
};
export type NoteCreate = {
  title: string;
};
export type NoteUpdate = {
  title?: string | null;
  rich_text?: string | null;
  description?: string | null;
};
export type NoteSummary = {
  note_id: string;
  note_title: string;
  summary: string;
};
export const {
  useOpenIdLoginApiTokenPostMutation,
  useGetUserDetailApiUsersGetQuery,
  useReadNotesApiNotesGetQuery,
  useCreateNoteApiNotesPostMutation,
  useReadNoteApiNotesNoteIdGetQuery,
  useUpdateNoteApiNotesNoteIdPatchMutation,
  useGetSummaryApiNotesSummaryNoteIdGetQuery,
} = injectedRtkApi;
