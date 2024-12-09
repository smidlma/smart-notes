import { EditorContent } from '@tiptap/react';
import { useTenTap, TenTapStartKit } from '@10play/tentap-editor';
import ReactComponent from './extensions/extension';

export const AdvancedEditor = () => {
  const editor = useTenTap({
    bridges: [...TenTapStartKit],
    tiptapOptions: {
      extensions: [ReactComponent],
    },
  });

  return <EditorContent editor={editor} />;
};
