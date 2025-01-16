import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { NoteSearchResponse, VoiceSearchResponse } from '@/services/api';
import { router } from 'expo-router';
import { AudioLines, Notebook } from 'lucide-react-native';
import { View } from 'react-native';

export const SearchItem = (props: NoteSearchResponse | VoiceSearchResponse) => {
  if (props.type === 'voice') {
    const { voice_id, note_id, title, type } = props;

    const handlePress = () => {
      router.push({
        pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
        params: { noteId: note_id, voiceId: voice_id },
      });
    };

    return <PressableSearchItem onPress={handlePress} title={title} type={type} />;
  }

  const handlePress = () => {
    router.push({
      pathname: '/(app)/(auth)/note/[id]',
      params: { id: props.note_id },
    });
  };

  return <PressableSearchItem onPress={handlePress} title={props.title} type={props.type} />;
};

type Props = {
  onPress: VoidFunction;
  type: 'note' | 'voice';
  title: string;
};

const PressableSearchItem = ({ onPress, title, type }: Props) => {
  return (
    <MotiPressable onPress={onPress}>
      <Card>
        <CardContent className="py-3 pl-3">
          <View className="flex-row items-center gap-2">
            {type === 'voice' ? <AudioLines size={26} /> : <Notebook size={26} />}
            <Text>{title}</Text>
          </View>
        </CardContent>
      </Card>
    </MotiPressable>
  );
};
