import { BottomSheet, BottomSheetRef } from '@/components/bottom-sheet/bottom-sheet';
import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import {
  useGetVoiceRecordingsApiAttachmentsNoteIdVoiceGetQuery,
  VoiceRecordingSchema,
} from '@/services/api';
import { fDateTime } from '@/utils/format-time';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { AudioLines, FileSymlink } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';

type Props = { id: string; isOpen: boolean; onClose: VoidFunction };

export const EditorSheet = ({ id, isOpen, onClose }: Props) => {
  const { data } = useGetVoiceRecordingsApiAttachmentsNoteIdVoiceGetQuery({ noteId: id });

  const sheetRef = useRef<BottomSheetRef>(null);

  const snapPoints = useMemo(() => ['20%', '50%', '70%'], []);

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
              <Button size="default" variant="ghost">
                <FileSymlink />
                {/* <Text>Attach</Text> */}
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
        ListHeaderComponent={<Text className="text-2xl font-bold">Attachments</Text>}
        data={data}
        keyExtractor={(i) => i.id!}
        renderItem={renderItem}
      />
    </BottomSheet>
  );
};
