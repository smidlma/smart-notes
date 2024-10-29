import React from 'react';
import { EditorContent } from '@tiptap/react';
import { useTenTap, TenTapStartKit } from '@10play/tentap-editor';
import ReactComponent from '../src/tiptap/extension';
import { CounterBridge } from '../src/tiptap/counter-bridge';

export const AdvancedEditor = () => {
  const editor = useTenTap({
    bridges: [...TenTapStartKit, CounterBridge],
    tiptapOptions: {
      extensions: [ReactComponent],
    },
  });

  return <EditorContent editor={editor} />;
};
