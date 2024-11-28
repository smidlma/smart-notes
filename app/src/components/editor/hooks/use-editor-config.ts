import { darkEditorCss } from '@10play/tentap-editor';
import { baseEditorCSS } from '../config';

export const useEditorConfig = () => {
  const editorCSS = `${baseEditorCSS} ${darkEditorCss}`;

  return {
    editorCSS,
  };
};
