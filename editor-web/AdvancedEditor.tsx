import React from 'react';
import { EditorContent } from '@tiptap/react';
import { useTenTap, TenTapStartKit } from '@10play/tentap-editor';
// import Document from '@tiptap/extension-document';
// import Paragraph from '@tiptap/extension-paragraph';
// import BulletList from '@tiptap/extension-bullet-list';
// import Text from '@tiptap/extension-text';
import ReactComponent from '../src/tiptap/extension';

export const AdvancedEditor = () => {
  const editor = useTenTap({
    bridges: [...TenTapStartKit],
    tiptapOptions: {
      extensions: [ReactComponent],
    },
  });

  return <EditorContent editor={editor} />;
};
