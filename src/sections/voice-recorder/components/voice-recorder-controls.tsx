import { View } from 'react-native';
import { VoiceRecorderButton } from './voice-recorder-button';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

type Props = {
  onRecordStart: () => void;
  onRecordStop: () => void;
  onPause: () => void;

  isRecording?: boolean;
  isDoneRecording?: boolean;
  canRecord?: boolean;
};

export const VoiceRecorderControls = ({
  onRecordStart,
  onRecordStop,
  onPause,
  isRecording = false,
  isDoneRecording,
}: Props) => {
  const isNewRecording = isRecording === undefined;

  return (
    <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}>
      <View
        style={{ paddingBottom: 24, flexDirection: 'row', width: '100%', alignItems: 'center' }}
      >
        <VoiceRecorderButton onPress={isRecording ? onPause : onRecordStart} />
        {/* <Button
          mode="contained"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
          onPress={isRecording ? onPause : onRecordStart}
        >
          {isNewRecording
            ? 'Start Record'
            : isDoneRecording === false || isRecording
              ? 'Pause'
              : 'Continue'}
        </Button> */}
        <Button variant="ghost" onPress={onRecordStop} disabled={isNewRecording || isRecording}>
          <Text>Done</Text>
        </Button>
      </View>
    </View>
  );
};
