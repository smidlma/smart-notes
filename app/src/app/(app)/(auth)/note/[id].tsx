import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { useBoolean } from '@/hooks';
import { EditorSheet } from '@/sections/editor/editor-sheet';
import { EditorView } from '@/sections/editor/editor-view';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { AudioLines, Paperclip, WandSparkles } from 'lucide-react-native';
import React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';

const EditorScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const showAttachments = useBoolean(false);

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

          <MotiPressable onPress={showAttachments.onToggle}>
            <Paperclip />
          </MotiPressable>
        </View>
      ),
    });
  }, [id, navigation, showAttachments.onToggle]);

  return (
    <>
      <EditorView id={id as string} />
      <EditorSheet
        id={id as string}
        isOpen={showAttachments.value}
        onClose={showAttachments.onFalse}
      />
    </>
  );
};

export default EditorScreen;
