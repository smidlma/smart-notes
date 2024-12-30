import { Editor } from '@/components/editor';
import {
  useReadNoteApiNotesNoteIdGetQuery,
  useUpdateNoteApiNotesNoteIdPatchMutation,
} from '@/services/api';
import { QueryComponentWrapper } from '@/services/components';
import { useCallback } from 'react';

type Props = {
  id: string;
};

export const EditorView = ({ id }: Props) => {
  const { data, status, isLoading } = useReadNoteApiNotesNoteIdGetQuery({ noteId: id });
  const [updateNote] = useUpdateNoteApiNotesNoteIdPatchMutation();

  const handleContentChange = useCallback(
    async (content: string) => {
      await updateNote({ noteId: id, noteUpdate: { content } }).unwrap();
    },
    [id, updateNote]
  );

  return (
    <QueryComponentWrapper
      statuses={[status]}
      firstFetchLoadingOnly
      isFetchingFirstTime={isLoading}
    >
      <Editor onContentChange={handleContentChange} initialContent={data?.content} />
    </QueryComponentWrapper>
  );
};
