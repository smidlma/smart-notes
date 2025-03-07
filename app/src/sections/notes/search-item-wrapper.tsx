import { DocumentSearchResponse, NoteSearchResponse, VoiceSearchResponse } from '@/services/api';
import { router } from 'expo-router';
import { NewSearchItem } from './new-search-item';
import { AudioLines, BookOpenText, FileText, NotebookPen, Play } from '@/lib';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { fMilliseconds } from '@/utils/format-time';
import { openPdfFile } from '@/utils/pdf';

export const SearchItemWrapper = (
  props: NoteSearchResponse | VoiceSearchResponse | DocumentSearchResponse
) => {
  if (props.type === 'voice') {
    const { voice_id, note_id, title, time_start, search_match_text } = props;

    const handlePress = () => {
      router.push({
        pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
        params: { noteId: note_id, voiceId: voice_id, timeStart: time_start },
      });
    };

    const rightTitleComponent = (
      <View className="flex-row items-center gap-1">
        <Play size={16} className="text-primary fill-primary" />
        <Text className="text-primary">{fMilliseconds(time_start)}</Text>
      </View>
    );

    return (
      <NewSearchItem
        onPress={handlePress}
        title={title}
        previewText={search_match_text}
        icon={<AudioLines size={30} className="text-primary" />}
        RightTitleComponent={rightTitleComponent}
      />
    );
  }

  if (props.type === 'document') {
    const { title, search_match_text, page_number } = props;

    const handlePress = () => {
      openPdfFile(title, page_number);
    };

    const rightTitleComponent = (
      <View className="flex-row items-center gap-1">
        <BookOpenText size={16} className="text-primary" />
        <Text>{page_number}</Text>
      </View>
    );

    return (
      <NewSearchItem
        onPress={handlePress}
        title={title}
        previewText={search_match_text}
        icon={<FileText size={30} className="text-primary" />}
        RightTitleComponent={rightTitleComponent}
      />
    );
  }

  const { title, search_match_text, note_id } = props;

  const handlePress = () => {
    router.push({
      pathname: '/(app)/(auth)/note/[id]',
      params: { id: note_id },
    });
  };

  return (
    <NewSearchItem
      onPress={handlePress}
      title={title}
      icon={<NotebookPen size={30} className="text-primary" />}
      previewText={search_match_text}
    />
  );
};
