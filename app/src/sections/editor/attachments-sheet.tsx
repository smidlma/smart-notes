import { BottomSheet, BottomSheetRef } from '@/components/bottom-sheet/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  DocumentSchema,
  useGetDocumentsApiAttachmentsNoteIdDocumentsGetQuery,
  useGetVoiceRecordingsApiAttachmentsNoteIdVoiceGetQuery,
  VoiceRecordingSchema,
} from '@/services/api';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { VoiceNodeProps } from '../../../editor-web/extensions/voice-node/types';
import { useLocales } from '@/locales';
import { H3 } from '@/components/ui/typography';
import { AttachmentItem } from './attachment-item';
import { AudioLines, FileText, Scroll } from '@/lib';
import { openPdfFile } from '../../utils/pdf';
import { fDateTime, fMilliseconds } from '@/utils/format-time';

type Props = {
  noteId: string;
  isOpen: boolean;
  onClose: VoidFunction;
  onLinkVoice: (props: VoiceNodeProps) => void;
};

export const AttachmentsSheet = ({ noteId, isOpen, onClose, onLinkVoice }: Props) => {
  const { t } = useLocales();
  const { data: recordings } = useGetVoiceRecordingsApiAttachmentsNoteIdVoiceGetQuery({
    noteId,
  });

  const { data: documents } = useGetDocumentsApiAttachmentsNoteIdDocumentsGetQuery({
    noteId,
  });

  const data = useMemo(
    () => [...(recordings ?? []), ...(documents ?? [])],
    [recordings, documents]
  );

  const sheetRef = useRef<BottomSheetRef>(null);
  const snapPoints = useMemo(() => ['30%', '50%', '70%'], []);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.open();
    } else {
      sheetRef.current?.close();
    }
  }, [isOpen]);

  const handleChange = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, []);

  const renderAudioItem = useCallback(
    ({ title, created_at, id, duration, transcription }: VoiceRecordingSchema) => (
      <AttachmentItem
        onPress={() => {
          router.push({
            pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
            params: { noteId: id, voiceId: id ?? '' },
          });
          onClose();
        }}
        icon={<AudioLines size={26} />}
        title={title ?? ''}
        date={created_at ?? ''}
        RightActionComponent={
          <Button
            size="sm"
            onPress={() =>
              onLinkVoice({
                title: title ?? '',
                createdAt: fDateTime(created_at) ?? '',
                duration: fMilliseconds((duration ?? 0) * 1000),
                noteId,
                transcript: transcription ?? '',
                voiceId: id ?? '',
              })
            }
          >
            <Text>attach</Text>
          </Button>
        }
      />
    ),
    []
  );

  const renderDocumentItem = useCallback(
    ({ file_name, created_at }: DocumentSchema) => (
      <AttachmentItem
        onPress={() => {
          openPdfFile(file_name);
        }}
        icon={<FileText size={26} />}
        title={file_name ?? ''}
        date={created_at ?? ''}
      />
    ),
    []
  );

  const renderItem = useCallback(
    // eslint-disable-next-line unused-imports/no-unused-vars
    ({ item }: { item: VoiceRecordingSchema | DocumentSchema }) =>
      'duration' in item ? renderAudioItem(item) : renderDocumentItem(item as DocumentSchema),
    [renderAudioItem, renderDocumentItem]
  );

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      onChange={handleChange}
    >
      <BottomSheetFlatList
        className="px-4"
        contentContainerStyle={{ gap: 8, paddingBottom: 32 }}
        ListHeaderComponent={<Text className="text-2xl font-bold">{t('attachments')}</Text>}
        data={data}
        keyExtractor={(i) => i.id!}
        ListEmptyComponent={
          <View className="items-center justify-center pt-7">
            <Scroll size={64} />
            <H3>{t('no_attachments')}</H3>
          </View>
        }
        renderItem={renderItem}
      />
    </BottomSheet>
  );
};
