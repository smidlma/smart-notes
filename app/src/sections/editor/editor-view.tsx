import { Editor } from '@/components/editor';
import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { useBoolean } from '@/hooks';

import { QueryComponentWrapper } from '@/services/components';
import { router, useNavigation } from 'expo-router';
import { AudioLines, Paperclip, WandSparkles } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { EditorSheet } from './editor-sheet';
import { useEditor } from '@/components/editor/hooks/use-editor';

type Props = {
  id: string;
};

export const EditorView = ({ id }: Props) => {
  const navigation = useNavigation();

  const showAttachments = useBoolean(false);

  const { editor, status, isLoading, handleAttachVoice } = useEditor({
    noteId: id,
  });

  const handleShowAttachments = useCallback(() => {
    showAttachments.onToggle();
    editor.blur();
  }, [showAttachments, editor]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row gap-4">
          <MotiPressable
            onPress={() =>
              router.push({ pathname: '/(app)/(auth)/note/summary', params: { id: id } })
            }
          >
            <WandSparkles />
          </MotiPressable>
          <MotiPressable
            onPress={() =>
              router.push({
                pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
                params: { noteId: id, voiceId: '' },
              })
            }
          >
            <AudioLines />
          </MotiPressable>

          <MotiPressable onPress={handleShowAttachments}>
            <Paperclip />
          </MotiPressable>
        </View>
      ),
    });
  }, [id, navigation, handleShowAttachments]);

  return (
    <View className="flex-grow">
      <QueryComponentWrapper
        statuses={[status]}
        firstFetchLoadingOnly
        isFetchingFirstTime={isLoading}
      >
        <Editor editor={editor} noteId={id} />
        <EditorSheet
          onLinkVoice={handleAttachVoice}
          id={id as string}
          isOpen={showAttachments.value}
          onClose={showAttachments.onFalse}
        />
      </QueryComponentWrapper>
    </View>
  );
};
