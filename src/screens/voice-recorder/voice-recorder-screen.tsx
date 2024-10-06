import { StyleSheet, View } from 'react-native';
import { VoiceRecorderHeader } from './components/voice-recorder-header';
import { useAppTheme } from '@/theme/theme-context';
import { VoiceRecorderControls } from './components/voice-recorder-controls';
import { useAudioRecorder } from '@/hooks/audio/use-audio-recorder';

export const VoiceRecorderScreen = () => {
  const { theme } = useAppTheme();
  const { finishRecording, startOrResumeRecording, pauseRecording, status } = useAudioRecorder({});

  return (
    <View style={{ ...styles.container }}>
      <VoiceRecorderHeader />
      <View
        style={{
          ...styles.preview,
          backgroundColor: theme.colors.backdrop,
          width: '100%',
        }}
      />
      <VoiceRecorderControls
        isRecording={status?.isRecording}
        onRecordStart={startOrResumeRecording}
        onRecordStop={finishRecording}
        onPause={pauseRecording}
        duration={status?.durationMillis}
        isDoneRecording={status?.isDoneRecording}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 24,
    height: '100%',
  },
  preview: {
    height: 300,
  },
});
