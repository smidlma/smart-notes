import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Captions } from 'lucide-react-native';
import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { useLocales } from '@/locales';
import { Mic, CircleStop } from '@/lib/icons/';

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

      {/* <MotiView
        from={{ scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ type: 'timing', duration: 1000, loop: true }}
      > */}
      <Button onPress={isRecording ? onPause : onStart} size="icon" className="p-10 rounded-full ">
        {isRecording ? (
          <CircleStop size={48} className="text-destructive" />
        ) : (
          <Mic size={40} className="text-primary-foreground" />
        )}
      </Button>
      {/* </MotiView> */}

      <View className="flex-1 items-end">
        <Button variant="ghost" onPress={onFinish} disabled={isNewRecording || isRecording}>
          <Text>{t('save')}</Text>
        </Button>
      </View>
    </View>
  );
};
