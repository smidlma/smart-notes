import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Captions } from 'lucide-react-native';
import { MotiPressable } from '@/components/moti-pressable/moti-pressable';

type Props = {
  onStart: () => void;
  onFinish: () => void;
  onPause: () => void;

  isRecording?: boolean;
  isNewRecording: boolean;
  canRecord?: boolean;
};

export const VoiceRecorderControls = ({
  onStart,
  onFinish,
  onPause,
  isRecording,
  isNewRecording,
}: Props) => {
  return (
    <View className=" flex-row pb-14 items-center">
      {/* <VoiceRecorderButton onPress={isRecording ? onPause : onStart} /> */}
      <View className="flex-1">
        <MotiPressable>
          <Captions size={28} />
        </MotiPressable>
      </View>

      <Button onPress={isRecording ? onPause : onStart}>
        <Text>{isRecording ? 'Stop' : 'Start'}</Text>
      </Button>

      <View className="flex-1 items-end">
        <MotiPressable onPress={onFinish} disabled={isNewRecording || isRecording}>
          <Text>Done</Text>
        </MotiPressable>
      </View>
    </View>
  );
};
