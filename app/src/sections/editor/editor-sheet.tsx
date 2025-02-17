import { BottomSheet, BottomSheetRef } from '@/components/bottom-sheet/bottom-sheet';
import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import {
  useGetVoiceRecordingsApiAttachmentsNoteIdVoiceGetQuery,
  VoiceRecordingSchema,
} from '@/services/api';
import { fDateTime, fMilliseconds } from '@/utils/format-time';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { AudioLines, Scroll } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { VoiceNodeProps } from '../../../editor-web/extensions/voice-node/types';
import { useLocales } from '@/locales';
import { H3 } from '@/components/ui/typography';

type Props = {
  id: string;
  isOpen: boolean;
  onClose: VoidFunction;
  onLinkVoice: (props: VoiceNodeProps) => void;
};

export const EditorSheet = ({ id, isOpen, onClose, onLinkVoice }: Props) => {
  const { t } = useLocales();
  const { data } = useGetVoiceRecordingsApiAttachmentsNoteIdVoiceGetQuery({ noteId: id });

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

  const renderItem = useCallback(
    // eslint-disable-next-line unused-imports/no-unused-vars
    ({ item }: { item: VoiceRecordingSchema }) => (
      <MotiPressable
        onPress={() => {
          router.push({
            pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
            params: { noteId: id, voiceId: item.id ?? '' },
          });
          onClose();
        }}
      >
        <Card>
          <CardContent className="py-3 pl-3">
            <View className="flex-row items-center gap-4">
              <AudioLines size={26} />
              <View className="flex-grow">
                <Text>{item.title}</Text>
                <Text className="text-sm">{fDateTime(item.created_at)}</Text>
              </View>
              <Button
                size="sm"
                onPress={() =>
                  onLinkVoice({
                    noteId: item.note_id ?? '',
                    voiceId: item.id ?? '',
                    title: item.title ?? '',
                    createdAt: fDateTime(item.created_at) ?? '',
                    duration: fMilliseconds((item.duration ?? 0) * 1000),
                    transcript: '',
                  })
                }
              >
                <Text>attach</Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      </MotiPressable>
    ),
    []
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
