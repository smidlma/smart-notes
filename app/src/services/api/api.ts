import { emptyApi as api } from './empty-api';
export const addTagTypes = ['token', 'users', 'notes', 'attachments', 'search'] as const;
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
          method: 'POST',
          body: queryArg.tokenRequest,
        }),
        invalidatesTags: ['token'],
      }),
      getUserDetailApiUsersGet: build.query<
        GetUserDetailApiUsersGetApiResponse,
        GetUserDetailApiUsersGetApiArg
      >({
        query: () => ({ url: `/api/users/` }),
        providesTags: ['users'],
      }),
      readNotesApiNotesGet: build.query<
        ReadNotesApiNotesGetApiResponse,
        ReadNotesApiNotesGetApiArg
      >({
        query: () => ({ url: `/api/notes/` }),
        providesTags: ['notes'],
      }),
      createNoteApiNotesPost: build.mutation<
        CreateNoteApiNotesPostApiResponse,
        CreateNoteApiNotesPostApiArg
      >({
        query: (queryArg) => ({
          url: `/api/notes/`,
          method: 'POST',
          body: queryArg.noteCreate,
        }),
        invalidatesTags: ['notes'],
      }),
      readNoteApiNotesNoteIdGet: build.query<
        ReadNoteApiNotesNoteIdGetApiResponse,
        ReadNoteApiNotesNoteIdGetApiArg
      >({
        query: (queryArg) => ({ url: `/api/notes/${queryArg.noteId}` }),
        providesTags: ['notes'],
      }),
      updateNoteApiNotesNoteIdPatch: build.mutation<
        UpdateNoteApiNotesNoteIdPatchApiResponse,
        UpdateNoteApiNotesNoteIdPatchApiArg
      >({
        query: (queryArg) => ({
          url: `/api/notes/${queryArg.noteId}`,
          method: 'PATCH',
          body: queryArg.noteUpdate,
        }),
        invalidatesTags: ['notes'],
      }),
      deleteNoteApiNotesNoteIdDelete: build.mutation<
        DeleteNoteApiNotesNoteIdDeleteApiResponse,
        DeleteNoteApiNotesNoteIdDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/notes/${queryArg.noteId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['notes'],
      }),
      getSummaryApiNotesSummaryNoteIdGet: build.query<
        GetSummaryApiNotesSummaryNoteIdGetApiResponse,
        GetSummaryApiNotesSummaryNoteIdGetApiArg
      >({
        query: (queryArg) => ({ url: `/api/notes/summary/${queryArg.noteId}` }),
        providesTags: ['notes'],
      }),
      generateNewSummaryApiNotesSummaryNoteIdPost: build.mutation<
        GenerateNewSummaryApiNotesSummaryNoteIdPostApiResponse,
        GenerateNewSummaryApiNotesSummaryNoteIdPostApiArg
      >({
        query: (queryArg) => ({
          url: `/api/notes/summary/${queryArg.noteId}`,
          method: 'POST',
        }),
        invalidatesTags: ['notes'],
      }),
      streamQuickRecapApiNotesQuickRecapPost: build.mutation<
        StreamQuickRecapApiNotesQuickRecapPostApiResponse,
        StreamQuickRecapApiNotesQuickRecapPostApiArg
      >({
        query: (queryArg) => ({
          url: `/api/notes/quick-recap`,
          method: 'POST',
          body: queryArg.notesIds,
        }),
        invalidatesTags: ['notes'],
      }),
      getVoiceRecordingsApiAttachmentsNoteIdVoiceGet: build.query<
        GetVoiceRecordingsApiAttachmentsNoteIdVoiceGetApiResponse,
        GetVoiceRecordingsApiAttachmentsNoteIdVoiceGetApiArg
      >({
        query: (queryArg) => ({
          url: `/api/attachments/${queryArg.noteId}/voice`,
        }),
        providesTags: ['attachments'],
      }),
      getVoiceRecordingApiAttachmentsVoiceVoiceIdGet: build.query<
        GetVoiceRecordingApiAttachmentsVoiceVoiceIdGetApiResponse,
        GetVoiceRecordingApiAttachmentsVoiceVoiceIdGetApiArg
      >({
        query: (queryArg) => ({
          url: `/api/attachments/voice/${queryArg.voiceId}`,
        }),
        providesTags: ['attachments'],
      }),
      updateVoiceRecordingApiAttachmentsVoiceVoiceIdPut: build.mutation<
        UpdateVoiceRecordingApiAttachmentsVoiceVoiceIdPutApiResponse,
        UpdateVoiceRecordingApiAttachmentsVoiceVoiceIdPutApiArg
      >({
        query: (queryArg) => ({
          url: `/api/attachments/voice/${queryArg.voiceId}`,
          method: 'PUT',
          body: queryArg.voiceRecordingUpdate,
        }),
        invalidatesTags: ['attachments'],
      }),
      uploadVoiceApiAttachmentsUploadVoiceNoteIdPost: build.mutation<
        UploadVoiceApiAttachmentsUploadVoiceNoteIdPostApiResponse,
        UploadVoiceApiAttachmentsUploadVoiceNoteIdPostApiArg
      >({
        query: (queryArg) => ({
          url: `/api/attachments/upload/voice/${queryArg.noteId}`,
          method: 'POST',
          body: queryArg.bodyUploadVoiceApiAttachmentsUploadVoiceNoteIdPost,
        }),
        invalidatesTags: ['attachments'],
      }),
      getVoiceTranscriptionApiAttachmentsVoiceVoiceIdTranscriptionGet: build.query<
        GetVoiceTranscriptionApiAttachmentsVoiceVoiceIdTranscriptionGetApiResponse,
        GetVoiceTranscriptionApiAttachmentsVoiceVoiceIdTranscriptionGetApiArg
      >({
        query: (queryArg) => ({
          url: `/api/attachments/voice/${queryArg.voiceId}/transcription`,
        }),
        providesTags: ['attachments'],
      }),
      uploadImageApiAttachmentsUploadImageNoteIdPost: build.mutation<
        UploadImageApiAttachmentsUploadImageNoteIdPostApiResponse,
        UploadImageApiAttachmentsUploadImageNoteIdPostApiArg
      >({
        query: (queryArg) => ({
          url: `/api/attachments/upload/image/${queryArg.noteId}`,
          method: 'POST',
          body: queryArg.bodyUploadImageApiAttachmentsUploadImageNoteIdPost,
        }),
        invalidatesTags: ['attachments'],
      }),
      uploadDocumentApiAttachmentsUploadDocumentNoteIdPost: build.mutation<
        UploadDocumentApiAttachmentsUploadDocumentNoteIdPostApiResponse,
        UploadDocumentApiAttachmentsUploadDocumentNoteIdPostApiArg
      >({
        query: (queryArg) => ({
          url: `/api/attachments/upload/document/${queryArg.noteId}`,
          method: 'POST',
          body: queryArg.bodyUploadDocumentApiAttachmentsUploadDocumentNoteIdPost,
        }),
        invalidatesTags: ['attachments'],
      }),
      getDocumentSummaryApiAttachmentsDocumentDocumentIdSummaryGet: build.query<
        GetDocumentSummaryApiAttachmentsDocumentDocumentIdSummaryGetApiResponse,
        GetDocumentSummaryApiAttachmentsDocumentDocumentIdSummaryGetApiArg
      >({
        query: (queryArg) => ({
          url: `/api/attachments/document/${queryArg.documentId}/summary`,
        }),
        providesTags: ['attachments'],
      }),
      searchNotesApiSearchGet: build.query<
        SearchNotesApiSearchGetApiResponse,
        SearchNotesApiSearchGetApiArg
      >({
        query: (queryArg) => ({
          url: `/api/search/`,
          params: {
            query: queryArg.query,
          },
        }),
        providesTags: ['search'],
      }),
      readRootGet: build.query<ReadRootGetApiResponse, ReadRootGetApiArg>({
        query: () => ({ url: `/` }),
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as api };
export type OpenIdLoginApiTokenPostApiResponse = /** status 200 Successful Response */ Token | null;
export type OpenIdLoginApiTokenPostApiArg = {
  tokenRequest: TokenRequest;
};
export type GetUserDetailApiUsersGetApiResponse = /** status 200 Successful Response */ UserSchema;
export type GetUserDetailApiUsersGetApiArg = void;
export type ReadNotesApiNotesGetApiResponse = /** status 200 Successful Response */ NoteSchema[];
export type ReadNotesApiNotesGetApiArg = void;
export type CreateNoteApiNotesPostApiResponse = /** status 200 Successful Response */ NoteSchema;
export type CreateNoteApiNotesPostApiArg = {
  noteCreate: NoteCreate;
};
export type ReadNoteApiNotesNoteIdGetApiResponse = /** status 200 Successful Response */ NoteSchema;
export type ReadNoteApiNotesNoteIdGetApiArg = {
  noteId: string;
};
export type UpdateNoteApiNotesNoteIdPatchApiResponse =
  /** status 200 Successful Response */ NoteSchema;
export type UpdateNoteApiNotesNoteIdPatchApiArg = {
  noteId: string;
  noteUpdate: NoteUpdate;
};
export type DeleteNoteApiNotesNoteIdDeleteApiResponse = /** status 200 Successful Response */ {
  [key: string]: string;
};
export type DeleteNoteApiNotesNoteIdDeleteApiArg = {
  noteId: string;
};
export type GetSummaryApiNotesSummaryNoteIdGetApiResponse =
  /** status 200 Successful Response */ SummarySchema;
export type GetSummaryApiNotesSummaryNoteIdGetApiArg = {
  noteId: string;
};
export type GenerateNewSummaryApiNotesSummaryNoteIdPostApiResponse =
  /** status 200 Successful Response */ SummarySchema;
export type GenerateNewSummaryApiNotesSummaryNoteIdPostApiArg = {
  noteId: string;
};
export type StreamQuickRecapApiNotesQuickRecapPostApiResponse =
  /** status 200 Successful Response */ string;
export type StreamQuickRecapApiNotesQuickRecapPostApiArg = {
  notesIds: string[];
};
export type GetVoiceRecordingsApiAttachmentsNoteIdVoiceGetApiResponse =
  /** status 200 Successful Response */ VoiceRecordingSchema[];
export type GetVoiceRecordingsApiAttachmentsNoteIdVoiceGetApiArg = {
  noteId: string;
};
export type GetVoiceRecordingApiAttachmentsVoiceVoiceIdGetApiResponse =
  /** status 200 Successful Response */ VoiceRecordingSchema;
export type GetVoiceRecordingApiAttachmentsVoiceVoiceIdGetApiArg = {
  voiceId: string;
};
export type UpdateVoiceRecordingApiAttachmentsVoiceVoiceIdPutApiResponse =
  /** status 200 Successful Response */ VoiceRecordingSchema;
export type UpdateVoiceRecordingApiAttachmentsVoiceVoiceIdPutApiArg = {
  voiceId: string;
  voiceRecordingUpdate: VoiceRecordingUpdate;
};
export type UploadVoiceApiAttachmentsUploadVoiceNoteIdPostApiResponse =
  /** status 200 Successful Response */ VoiceRecordingSchema;
export type UploadVoiceApiAttachmentsUploadVoiceNoteIdPostApiArg = {
  noteId: string;
  bodyUploadVoiceApiAttachmentsUploadVoiceNoteIdPost: BodyUploadVoiceApiAttachmentsUploadVoiceNoteIdPost;
};
export type GetVoiceTranscriptionApiAttachmentsVoiceVoiceIdTranscriptionGetApiResponse =
  /** status 200 Successful Response */ VoiceTranscriptionResponse;
export type GetVoiceTranscriptionApiAttachmentsVoiceVoiceIdTranscriptionGetApiArg = {
  voiceId: string;
};
export type UploadImageApiAttachmentsUploadImageNoteIdPostApiResponse =
  /** status 200 Successful Response */ ImageSchema;
export type UploadImageApiAttachmentsUploadImageNoteIdPostApiArg = {
  noteId: string;
  bodyUploadImageApiAttachmentsUploadImageNoteIdPost: BodyUploadImageApiAttachmentsUploadImageNoteIdPost;
};
export type UploadDocumentApiAttachmentsUploadDocumentNoteIdPostApiResponse =
  /** status 200 Successful Response */ DocumentSchema;
export type UploadDocumentApiAttachmentsUploadDocumentNoteIdPostApiArg = {
  noteId: string;
  bodyUploadDocumentApiAttachmentsUploadDocumentNoteIdPost: BodyUploadDocumentApiAttachmentsUploadDocumentNoteIdPost;
};
export type GetDocumentSummaryApiAttachmentsDocumentDocumentIdSummaryGetApiResponse =
  /** status 200 Successful Response */ DocumentSchema;
export type GetDocumentSummaryApiAttachmentsDocumentDocumentIdSummaryGetApiArg = {
  documentId: string;
};
export type SearchNotesApiSearchGetApiResponse =
  /** status 200 Successful Response */ GlobalSearchResponse;
export type SearchNotesApiSearchGetApiArg = {
  query: string;
};
export type ReadRootGetApiResponse = /** status 200 Successful Response */ any;
export type ReadRootGetApiArg = void;
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
  user_id?: string | null;
  title: string;
  content: string;
  description: string | null;
};
export type NoteCreate = {
  title: string;
};
export type NoteUpdate = {
  title?: string | null;
  content?: string | null;
  description?: string | null;
};
export type SummarySchema = {
  created_at?: string;
  updated_at?: string;
  id?: string;
  note_id: string;
  summary_text?: string | null;
};
export type VoiceRecordingSchema = {
  created_at?: string;
  updated_at?: string;
  id?: string;
  note_id: string;
  title?: string | null;
  file_name: string;
  transcription?: string | null;
  words?: object[] | null;
  status?: 'new' | 'processing' | 'done' | 'failed';
  duration?: number | null;
};
export type VoiceRecordingUpdate = {
  title?: string | null;
  duration?: number | null;
};
export type BodyUploadVoiceApiAttachmentsUploadVoiceNoteIdPost = {
  file: Blob;
};
export type WordSchema = {
  word: string;
  start: number;
  end: number;
};
export type VoiceTranscriptionResponse = {
  transcription?: string | null;
  words?: WordSchema[] | null;
  status: 'new' | 'processing' | 'done' | 'failed';
};
export type ImageSchema = {
  created_at?: string;
  updated_at?: string;
  id?: string;
  note_id: string;
  file_name: string;
};
export type BodyUploadImageApiAttachmentsUploadImageNoteIdPost = {
  file: Blob;
};
export type DocumentSchema = {
  created_at?: string;
  updated_at?: string;
  id?: string;
  note_id: string;
  file_name: string;
  content: string;
  summary?: string | null;
  type?: 'pdf';
};
export type BodyUploadDocumentApiAttachmentsUploadDocumentNoteIdPost = {
  file: Blob;
};
export type NoteSearchResponse = {
  type: 'note';
  title: string;
  search_match_text: string;
  score: number;
  created_at: string;
  updated_at: string;
  note_id: string;
  description?: string | null;
};
export type VoiceSearchResponse = {
  type: 'voice';
  title: string;
  search_match_text: string;
  score: number;
  created_at: string;
  updated_at: string;
  note_id: string;
  voice_id: string;
  file_name: string;
  time_start: number;
  time_end: number;
};
export type DocumentSearchResponse = {
  type: 'document';
  title: string;
  search_match_text: string;
  score: number;
  created_at: string;
  updated_at: string;
  document_id: string;
  file_name: string;
  page_number: number;
};
export type GlobalSearchResponse = {
  results: (NoteSearchResponse | VoiceSearchResponse | DocumentSearchResponse)[];
  total: number;
};
export const {
  useOpenIdLoginApiTokenPostMutation,
  useGetUserDetailApiUsersGetQuery,
  useReadNotesApiNotesGetQuery,
  useCreateNoteApiNotesPostMutation,
  useReadNoteApiNotesNoteIdGetQuery,
  useUpdateNoteApiNotesNoteIdPatchMutation,
  useDeleteNoteApiNotesNoteIdDeleteMutation,
  useGetSummaryApiNotesSummaryNoteIdGetQuery,
  useGenerateNewSummaryApiNotesSummaryNoteIdPostMutation,
  useStreamQuickRecapApiNotesQuickRecapPostMutation,
  useGetVoiceRecordingsApiAttachmentsNoteIdVoiceGetQuery,
  useGetVoiceRecordingApiAttachmentsVoiceVoiceIdGetQuery,
  useUpdateVoiceRecordingApiAttachmentsVoiceVoiceIdPutMutation,
  useUploadVoiceApiAttachmentsUploadVoiceNoteIdPostMutation,
  useGetVoiceTranscriptionApiAttachmentsVoiceVoiceIdTranscriptionGetQuery,
  useUploadImageApiAttachmentsUploadImageNoteIdPostMutation,
  useUploadDocumentApiAttachmentsUploadDocumentNoteIdPostMutation,
  useGetDocumentSummaryApiAttachmentsDocumentDocumentIdSummaryGetQuery,
  useSearchNotesApiSearchGetQuery,
  useReadRootGetQuery,
} = injectedRtkApi;
