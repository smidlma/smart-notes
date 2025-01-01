import { Editor } from '@/components/editor';
import {
  useReadNoteApiNotesNoteIdGetQuery,
  useUpdateNoteApiNotesNoteIdPatchMutation,
} from '@/services/api';
import { QueryComponentWrapper } from '@/services/components';
import { useHeaderHeight } from '@react-navigation/elements';
import { useCallback } from 'react';
import { View } from 'react-native';

type Props = {
  id: string;
};

export const EditorView = ({ id }: Props) => {
  const height = useHeaderHeight();

  const { data, status, isLoading } = useReadNoteApiNotesNoteIdGetQuery({ noteId: id });
  const [updateNote] = useUpdateNoteApiNotesNoteIdPatchMutation();

  const handleContentChange = useCallback(
    async (content: string) => {
      await updateNote({ noteId: id, noteUpdate: { content } }).unwrap();
    },
    [id, updateNote]
  );

  return (
    <View className="flex-grow" style={{ paddingTop: height }}>
      <QueryComponentWrapper
        statuses={[status]}
        firstFetchLoadingOnly
        isFetchingFirstTime={isLoading}
      >
        <Editor onContentChange={handleContentChange} initialContent={data?.content} />
      </QueryComponentWrapper>
    </View>
  );
};
