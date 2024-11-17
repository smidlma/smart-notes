import { Button, View } from 'react-native';
import { VoiceRecorderButton } from './voice-recorder-button';

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
        <Button title="Done" onPress={onRecordStop} disabled={isNewRecording || isRecording} />
      </View>
    </View>
  );
};
