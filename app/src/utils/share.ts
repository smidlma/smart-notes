import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export const sharePdfFile = async (content: string, title: string) => {
  const { uri } = await Print.printToFileAsync({ html: content });

  const newUri = FileSystem.cacheDirectory + `${title}.pdf`;
  await FileSystem.moveAsync({
    from: uri,
    to: newUri,
  });

  await shareAsync(newUri, { UTI: '.pdf', mimeType: 'application/pdf' });
};
