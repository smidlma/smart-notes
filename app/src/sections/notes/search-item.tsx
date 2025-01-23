import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { NoteSearchResponse, VoiceSearchResponse } from '@/services/api';
import { fMilliseconds } from '@/utils/format-time';
import { router } from 'expo-router';
import { AudioLines, Notebook } from 'lucide-react-native';
import { View } from 'react-native';

export const SearchItem = (props: NoteSearchResponse | VoiceSearchResponse) => {
  if (props.type === 'voice') {
    const { voice_id, note_id, title, type, time_start, search_match_text } = props;

    const handlePress = () => {
      router.push({
        pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
        params: { noteId: note_id, voiceId: voice_id, timeStart: time_start },
      });
    };

    return (
      <PressableSearchItem
        onPress={handlePress}
        title={title}
        type={type}
        FooterComponent={
          <Text>{`At time: ${fMilliseconds(time_start)}, ${search_match_text}`}</Text>
        }
      />
    );
  }

  const handlePress = () => {
    router.push({
      pathname: '/(app)/(auth)/note/[id]',
      params: { id: props.note_id },
    });
  };

  return (
    <PressableSearchItem
      onPress={handlePress}
      title={props.title}
      type={props.type}
      FooterComponent={<Text>{`${props.search_match_text}`}</Text>}
    />
  );
};

type Props = {
  onPress: VoidFunction;
  type: 'note' | 'voice';
  title: string;
  FooterComponent?: React.ReactNode;
};

const PressableSearchItem = ({ onPress, title, type, FooterComponent }: Props) => {
  return (
    <MotiPressable onPress={onPress}>
      <Card>
        <CardContent className="py-3 pl-3">
          <View className="flex-row items-center gap-2">
            {type === 'voice' ? <AudioLines size={26} /> : <Notebook size={26} />}
            <Text>{title}</Text>
          </View>
        </CardContent>
        {FooterComponent && <CardFooter>{FooterComponent}</CardFooter>}
      </Card>
    </MotiPressable>
  );
};
