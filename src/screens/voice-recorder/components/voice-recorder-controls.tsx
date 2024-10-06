import { fMilliseconds } from '@/utils/format-time';
import { View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';

type Props = {
  onRecordStart: () => void;
  onRecordStop: () => void;
  onPause: () => void;
  duration?: number;
  isRecording?: boolean;
  isDoneRecording?: boolean;
  canRecord?: boolean;
};

export const VoiceRecorderControls = ({
  onRecordStart,
  onRecordStop,
  onPause,
  duration,
  isRecording,
  isDoneRecording,
}: Props) => {
  const isNewRecording = isRecording === undefined;

  return (
    <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}>
      <Text variant="displayMedium">{fMilliseconds(duration ?? 0)}</Text>
      <View
        style={{ paddingBottom: 24, flexDirection: 'row', width: '100%', alignItems: 'center' }}
      >
        <IconButton icon="text" style={{ width: 80 }} />
        <Button
          mode="contained"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
          onPress={isRecording ? onPause : onRecordStart}
        >
          {isNewRecording
            ? 'Start Record'
            : isDoneRecording === false || isRecording
              ? 'Pause'
              : 'Continue'}
        </Button>
        <Button
          style={{ width: 80 }}
          onPress={onRecordStop}
          disabled={isNewRecording || isRecording}
        >
          Done
        </Button>
      </View>
    </View>
  );
};
