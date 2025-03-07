import { API_BASE_URL } from '../../config-global';
import * as WebBrowser from 'expo-web-browser';

export const openPdfFile = async (fileName: string, page?: number) => {
  const url = `${API_BASE_URL}/storage/document/${fileName}${page ? `#page${page}` : ''}`;
  console.log('url', url);

  await WebBrowser.openBrowserAsync(url);
};
