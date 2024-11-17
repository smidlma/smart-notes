import { StyleSheet, View } from 'react-native';
import { VoiceRecorderHeader } from './components/voice-recorder-header';
import { VoiceRecorderControls } from './components/voice-recorder-controls';
import * as FileSystem from 'expo-file-system';

export const VoiceRecorderView = () => {
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

  // const { finishRecording, startOrResumeRecording, pauseRecording, duration, isRecording } =
  //   useAudioRecorder({
  //     onFinished: handleFinishRecording,
  //   });

  return (
    <View style={{ ...styles.container }}>
      {/* <VoiceRecorderHeader />
      <View
        style={{
          ...styles.preview,
          backgroundColor: theme.colors.backdrop,
          width: '100%',
        }}
      />
      <Text variant="displayMedium">{fMilliseconds(duration ?? 0)}</Text>
      <VoiceRecorderControls
        isRecording={isRecording}
        onRecordStart={startOrResumeRecording}
        onRecordStop={finishRecording}
        onPause={pauseRecording}
        isDoneRecording={true}
      /> */}
      {/* <Button onPress={getDirectoryFiles}>Get Directory Files</Button> */}
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
