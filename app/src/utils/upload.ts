import { ACCESS_TOKEN_KEY } from '@/auth/types';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, STORAGE_UPLOAD_URL } from '../../config-global';

type UploadHandlerProps = {
  fileUri: string;
  type: 'voice' | 'image' | 'document';
  pathParam: string;
  callback?: (params: FileSystem.UploadProgressData) => void;
};
export const uploadHandler = async <T>({
  fileUri,
  type,
  pathParam,
  callback,
}: UploadHandlerProps) => {
  try {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const url = `${API_BASE_URL}${STORAGE_UPLOAD_URL}/${type}/${pathParam}`;

    const uploadTask = FileSystem.createUploadTask(
      url,
      fileUri,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        httpMethod: 'POST',
        fieldName: 'file',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      },
      callback
    );

    const result = await uploadTask.uploadAsync();

    return JSON.parse(result?.body as string) as T;
  } catch (e) {
    console.log(e);
  }
};
