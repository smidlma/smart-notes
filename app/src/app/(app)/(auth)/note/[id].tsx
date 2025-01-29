import { EditorView } from '@/sections/editor/editor-view';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const EditorScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <EditorView id={id as string} />;
};

export default EditorScreen;
