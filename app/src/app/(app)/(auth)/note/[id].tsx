import { EditorView } from '@/sections/editor/editor-view';
import { useLocalSearchParams } from 'expo-router';

const EditorScreen = () => {
  const { id } = useLocalSearchParams();

  return <EditorView id={id as string} />;
};

export default EditorScreen;
