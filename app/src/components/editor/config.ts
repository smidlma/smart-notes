import { NAV_THEME } from '@/lib/constants';

export const baseEditorCSS = `
   * {
      font-family: sans-serif;
    }
     body {
      background-color: '#fff';
      padding-right: 80px !important;
      padding-left: 24px !important;
  
    }
    img {
      margin-left: auto;
      margin-right: auto;
      height: auto;
      padding: 0 10%;
      display: block;
    }
    react-component .ProseMirror-selectednode {
      outline: 3px solid #45FF !important;
    }
  
    .ProseMirror-selectednode  {
      outline: 3px solid blue !important;
    }
  `;

export const editorBasicCSS = (colorScheme: 'light' | 'dark') => `
  * {
      font-family: sans-serif;
      background-color: ${NAV_THEME[colorScheme].background};
    }
`;
