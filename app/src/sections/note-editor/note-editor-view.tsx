import { Editor } from '@/components/editor';
import { Text } from '@/components/ui/text';
import { useReadNoteApiNotesNoteIdGetQuery } from '@/services/api';

type Props = {
  id: string;
};

export const NoteEditorView = ({ id }: Props) => {
  const { data, isLoading } = useReadNoteApiNotesNoteIdGetQuery({ noteId: id });

  const handleContentChange = (content: string) => {
    console.log(content);
  };

  return isLoading ? (
    <Text>Loading</Text>
  ) : (
    <Editor
      onContentChange={handleContentChange}
      initialContent={data?.rich_text ?? '<h1>New Note</h1>'}
    />
  );
};
