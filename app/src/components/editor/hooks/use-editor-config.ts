import { darkEditorCss } from '@10play/tentap-editor';
import { editorBasicCSS } from '../config';
import { useColorScheme } from '@/lib/useColorScheme';

export const useEditorConfig = () => {
  const { colorScheme } = useColorScheme();

  const editorCSS = `${colorScheme === 'dark' ? darkEditorCss : ''} 
  ${editorBasicCSS(colorScheme)} `;

  return {
    editorCSS,
  };
};
