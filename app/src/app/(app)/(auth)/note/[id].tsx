import { NoteEditorView } from '@/sections/note-editor/note-editor-view';
import { useLocalSearchParams } from 'expo-router';

const EditorScreen = () => {
  const { id } = useLocalSearchParams();

  return <NoteEditorView id={id as string} />;
};

export default EditorScreen;
