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
      background-color: transparent;
    }
  .voice-node {
      background-color: ${colorScheme === 'light' ? NAV_THEME[colorScheme].border : NAV_THEME[colorScheme].card};
      width: 85%;
      border-radius: 16px;
      padding: 16px;
    }
    .voice-node-play {
      background-color: ${NAV_THEME[colorScheme].primary};
      color: ${NAV_THEME[colorScheme].background};
      padding: 8px 24px;
      border-radius: 16px;
      cursor: pointer;
    }

    .my-custom-class{
      width: 320px;
      height: 240px;
    }
 `;
