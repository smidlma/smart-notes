import { useVoiceRecorder } from '@/components/voice-recorder/hooks/use-voice-recorder';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export const VoiceRecorderScreen = () => {
  const { startRecording, stopRecording } = useVoiceRecorder();

  return (
    <View>
      <Text>Record your voice</Text>
      <Button onPress={startRecording}>Start recording</Button>
      <Button onPress={stopRecording}>Stop recording</Button>
    </View>
  );
};
