import { Alert, View } from 'react-native';
import { VoiceRecorderHeader } from './components/voice-recorder-header';
import { fMilliseconds } from '@/utils/format-time';
import { VoiceRecorderControls } from './components/voice-recorder-controls';
import {
  useAudioRecorder,
  RecordingPresets,
  AudioModule,
  useAudioRecorderState,
  AudioRecorder,
} from 'expo-audio';
import { useEffect } from 'react';
import { useBoolean } from '@/hooks';
import { H3 } from '@/components/ui/typography';

export const VoiceRecorderView = () => {
  const isDoneRecording = useBoolean(false);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  // const audioRecorderState = useAudioRecorderState(audioRecorder, 5000);

  const record = () => audioRecorder.record();

  const pauseRecording = () => audioRecorder.pause();

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
    console.log(audioRecorder.uri);
    isDoneRecording.onTrue();
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    })();
  }, []);

  // const handleFinishRecording = async (recordingUri: string) => {
  //   console.log('Recording finished', recordingUri);

  //   const fileName = `recording-${Date.now()}.m4a`;

  //   // Move the recording to the new directory with the new file name
  //   await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', {
  //     intermediates: true,
  //   });
  //   await FileSystem.moveAsync({
  //     from: recordingUri,
  //     to: FileSystem.documentDirectory + 'recordings/' + `${fileName}`,
  //   });
  // };

  // const getDirectoryFiles = async () => {
  //   try {
  //     const files = await FileSystem.readDirectoryAsync(
  //       FileSystem.documentDirectory + 'recordings/'
  //     );
  //     console.log('Files in the directory', files);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const { finishRecording, startOrResumeRecording, pauseRecording, duration, isRecording } =
  //   useAudioRecorder({
  //     onFinished: handleFinishRecording,
  //   });

  return (
    <View className="h-full">
      <VoiceRecorderHeader />
      <DurationTimer player={audioRecorder} />
      <VoiceRecorderControls
        isRecording={audioRecorder.isRecording}
        onRecordStart={record}
        onRecordStop={stopRecording}
        onPause={pauseRecording}
        isDoneRecording={true}
      />
    </View>
  );
};

const DurationTimer = ({ player }: { player: AudioRecorder }) => {
  const { durationMillis } = useAudioRecorderState(player, 1000);

  return <H3 className="self-center">{fMilliseconds(durationMillis ?? 0)}</H3>;
};
