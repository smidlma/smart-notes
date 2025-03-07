import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { EditorTabButton } from './editor-tab-button';
import { EditorBridge } from '@10play/tentap-editor';
import { AudioLines, FilePlus2, WandSparkles } from '@/lib';
import { router } from 'expo-router';
import { useLocales } from '@/locales';
import * as DocumentPicker from 'expo-document-picker';
import { uploadHandler } from '@/utils/upload';
import { LoadingOverlay } from '../loading-overlay/loading-overlay';
import { useBoolean } from '@/hooks';
export type TabItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

type Props = {
  noteId: string;
  editor: EditorBridge;
};

export const EditorBottomTab = ({ editor: _, noteId }: Props) => {
  const { t } = useLocales();

  const isUploading = useBoolean(false);

  const handleDocumentPicker = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf'],
    });
    console.log(result);

    if (result.canceled) {
      return;
    }

    const file = result.assets?.[0];

    isUploading.onTrue();
    await uploadHandler({
      fileUri: file.uri,
      type: 'document',
      pathParam: `${noteId}?name=${file.name}`,
      callback: (progress) => {
        console.log(progress);
      },
    });
    isUploading.onFalse();
  }, [noteId, isUploading]);

  const handleVoiceRecorder = useCallback(() => {
    router.push({
      pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
      params: { noteId: noteId, voiceId: '' },
    });
  }, [noteId]);

  const handleSummary = useCallback(() => {
    router.push({
      pathname: '/(app)/(auth)/note/summary',
      params: { id: noteId },
    });
  }, [noteId]);

  const tabs: TabItem[] = useMemo(
    () => [
      {
        key: 'audio',
        icon: <AudioLines className="text-primary" />,
        label: t('record'),
        onPress: handleVoiceRecorder,
      },
      {
        key: 'attach',
        icon: <FilePlus2 className="text-primary" />,
        label: t('attach'),
        onPress: handleDocumentPicker,
      },
      {
        key: 'summary',
        icon: <WandSparkles className="text-primary" />,
        label: t('summary'),
        onPress: handleSummary,
      },
    ],
    [t, handleVoiceRecorder, handleDocumentPicker, handleSummary]
  );

  return (
    <>
      <View className="flex-row justify-between pb-7 pt-2 bg-card px-2 items-center">
        {tabs.map(({ icon, key, label, onPress }) => (
          <EditorTabButton key={key} icon={icon} label={label} onPress={onPress} />
        ))}
      </View>
      <LoadingOverlay show={isUploading.value} />
    </>
  );
};
