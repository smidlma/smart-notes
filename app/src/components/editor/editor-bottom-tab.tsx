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
import { api, DocumentSchema } from '@/services/api';
import { useDispatch } from 'react-redux';
import { FileNodeProps, MediaType } from '../../../editor-web/extensions/voice-node/types';
import { fDateTime } from '@/utils/format-time';
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

export const EditorBottomTab = ({ editor, noteId }: Props) => {
  const { t } = useLocales();

  const isUploading = useBoolean(false);
  const dispatch = useDispatch();

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
    try {
      const document = await uploadHandler<DocumentSchema>({
        fileUri: file.uri,
        type: 'document',
        pathParam: `${noteId}?name=${file.name}`,
        callback: (progress) => {
          console.log(progress);
        },
      });
      dispatch(api.util.invalidateTags(['attachments']));
      if (document) {
        editor.addMediaNode({
          id: document.id ?? '',
          noteId,
          title: document.file_name,
          createdAt: fDateTime(document.created_at),
          mediaType: MediaType.File,
          pages: document.pages,
        } as FileNodeProps);
      }
    } catch (error) {
      console.log(error);
    } finally {
      isUploading.onFalse();
    }
  }, [noteId, isUploading, dispatch]);

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
