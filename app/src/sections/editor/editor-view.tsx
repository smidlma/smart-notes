import { Editor } from '@/components/editor';
import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { useBoolean } from '@/hooks';

import { QueryComponentWrapper } from '@/services/components';
import { router, useNavigation } from 'expo-router';
import {
  AudioLines,
  ChevronLeft,
  Paperclip,
  Redo2,
  Undo2,
  WandSparkles,
} from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { EditorSheet } from './editor-sheet';
import { useEditor } from '@/components/editor/hooks/use-editor';
import { Text } from '@/components/ui/text';
import { useLocales } from '@/locales';
import { Button } from '@/components/ui/button';
import { useBridgeState } from '@10play/tentap-editor';
import { Share } from '@/lib/icons';
import { sharePdfFile } from '@/utils/share';

type Props = {
  id: string;
};

export const EditorView = ({ id }: Props) => {
  const navigation = useNavigation();
  const { t } = useLocales();

  const showAttachments = useBoolean(false);

  const { editor, status, isLoading, handleAttachVoice } = useEditor({
    noteId: id,
  });

  const editorState = useBridgeState(editor);

  const handleShowAttachments = useCallback(() => {
    showAttachments.onToggle();
    editor.blur();
  }, [showAttachments, editor]);

  const handleSharePdf = useCallback(async () => {
    const content = await editor.getHTML();
    await sharePdfFile(content);
  }, [editor]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="flex-row gap-6 items-center">
          <MotiPressable onPress={router.back}>
            <View className="flex-row justify-center items-center">
              <ChevronLeft />
              <Text className="text-xl text-primary">{t('back')}</Text>
            </View>
          </MotiPressable>
          {(editorState.canUndo || editorState.canRedo) && (
            <View className="flex-row gap-2 items-center">
              <MotiPressable>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!editorState.canUndo}
                  onPress={editor.undo}
                >
                  <Undo2 />
                </Button>
              </MotiPressable>
              <MotiPressable>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!editorState.canRedo}
                  onPress={editor.redo}
                >
                  <Redo2 />
                </Button>
              </MotiPressable>
            </View>
          )}
        </View>
      ),
      headerRight: () => (
        <View className="flex-row gap-4">
          <MotiPressable onPress={handleSharePdf}>
            <Share />
          </MotiPressable>
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
  }, [id, navigation, handleShowAttachments, editorState, editor, t, handleSharePdf]);

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
