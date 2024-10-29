import { StyleSheet, View } from 'react-native';
import { VoiceRecorderHeader } from './components/voice-recorder-header';
import { useAppTheme } from '@/theme/theme-context';
import { VoiceRecorderControls } from './components/voice-recorder-controls';
import { useAudioRecorder } from '@/hooks/audio/use-audio-recorder';
import * as FileSystem from 'expo-file-system';
import { Button } from 'react-native-paper';

export const VoiceRecorderScreen = () => {
  const { theme } = useAppTheme();
  const handleFinishRecording = async (recordingUri: string) => {
    console.log('Recording finished', recordingUri);

    const fileName = `recording-${Date.now()}.m4a`;

    // Move the recording to the new directory with the new file name
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', {
      intermediates: true,
    });
    await FileSystem.moveAsync({
      from: recordingUri,
      to: FileSystem.documentDirectory + 'recordings/' + `${fileName}`,
    });
  };

  const getDirectoryFiles = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory + 'recordings/'
      );
      console.log('Files in the directory', files);
    } catch (e) {
      console.log(e);
    }
  };

  const { finishRecording, startOrResumeRecording, pauseRecording, status } = useAudioRecorder({
    onFinished: handleFinishRecording,
  });

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
      <Button onPress={getDirectoryFiles}>Get Directory Files</Button>
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
