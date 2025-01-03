import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Captions } from 'lucide-react-native';
import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { useLocales } from '@/locales';

type Props = {
  onStart: () => void;
  onFinish: () => void;
  onPause: () => void;
  onTranscribe?: () => void;

  isRecording?: boolean;
  isNewRecording: boolean;
};

export const VoiceRecorderControls = ({
  onStart,
  onFinish,
  onPause,
  onTranscribe,
  isRecording,
  isNewRecording,
}: Props) => {
  const { t } = useLocales();

  return (
    <View className="flex-row pb-14 items-center">
      {/* <VoiceRecorderButton onPress={isRecording ? onPause : onStart} /> */}
      <View className="flex-1">
        {onTranscribe && (
          <MotiPressable onPress={onTranscribe} disabled={isNewRecording || isRecording}>
            <Captions size={28} />
          </MotiPressable>
        )}
      </View>

      <Button onPress={isRecording ? onPause : onStart}>
        <Text>{isRecording ? 'Stop' : 'Start'}</Text>
      </Button>

      <View className="flex-1 items-end">
        <Button variant="ghost" onPress={onFinish} disabled={isNewRecording || isRecording}>
          <Text>{t('save')}</Text>
        </Button>
      </View>
    </View>
  );
};
