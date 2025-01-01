import { Text } from '@/components/ui/text';
import { ScrollView } from 'react-native';

type Props = { status?: string; transcription: string };

export const VoiceTranscript = ({ status, transcription }: Props) => {
  return (
    <ScrollView className="flex-1">
      <Text className="px-8 text-xl">{transcription}</Text>
    </ScrollView>
  );
};
