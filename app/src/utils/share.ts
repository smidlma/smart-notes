import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

export const sharePdfFile = async (content: string) => {
  const { uri } = await Print.printToFileAsync({ html: content });
  console.log('File has been saved to:', uri);
  await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
};
