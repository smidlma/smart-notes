import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { marked } from 'marked';

const convertMarkdownToHtml = (markdown: string) => {
  try {
    const htmlContent = `
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
          h1, h2, h3 { color: #333; }
          pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
          code { font-family: "Courier New", monospace; color: #d63384; }
          blockquote { border-left: 4px solid #ccc; padding-left: 10px; color: #666; }
        </style>
      </head>
      <body>
        ${marked(markdown)} 
      </body>
      </html>
    `;

    return htmlContent;
  } catch (error) {
    console.error('Error converting markdown to html', error);

    return '';
  }
};

export const sharePdfFile = async (
  content: string,
  title: string,
  inputFormat: 'html' | 'markdown' = 'html'
) => {
  let htmlContent = content;
  if (inputFormat === 'markdown') {
    htmlContent = convertMarkdownToHtml(content);
  }

  const { uri } = await Print.printToFileAsync({ html: htmlContent });

  const newUri = FileSystem.cacheDirectory + `${title}.pdf`;
  await FileSystem.moveAsync({
    from: uri,
    to: newUri,
  });

  await shareAsync(newUri, { UTI: '.pdf', mimeType: 'application/pdf' });
};
