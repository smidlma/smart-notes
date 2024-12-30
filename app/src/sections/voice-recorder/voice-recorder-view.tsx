import { ActivityIndicator, Alert, View } from 'react-native';
import { VoiceRecorderHeader } from './components/voice-recorder-header';
import { fMilliseconds } from '@/utils/format-time';
import {
  useAudioRecorder,
  RecordingPresets,
  AudioModule,
  useAudioRecorderState,
  AudioRecorder,
} from 'expo-audio';
import { useEffect } from 'react';
import { useBoolean } from '@/hooks';
import { H4 } from '@/components/ui/typography';
import { VoiceRecorderControls } from './components/voice-recorder-controls';
import { uploadHandler } from '@/utils/upload';
import { Text } from '@/components/ui/text';

export const VoiceRecorderView = ({ id }: { id: string }) => {
  const isDoneRecording = useBoolean(false);
  const isRecording = useBoolean(false);
  const isNewRecording = useBoolean(true);
  const isUploading = useBoolean(false);

  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
  });

  const record = () => {
    audioRecorder.record();
    isRecording.onTrue();
    isNewRecording.onFalse();
  };

  const pauseRecording = () => {
    isRecording.onFalse();
    audioRecorder.pause();
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    isRecording.onFalse();
    isDoneRecording.onTrue();
    if (audioRecorder.uri) {
      await handleFinishRecording(audioRecorder.uri);
    }
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();

      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    })();
  }, []);

  const handleFinishRecording = async (recordingUri: string) => {
    isUploading.onTrue();

    await uploadHandler({
      fileUri: recordingUri,
      type: 'voice',
      pathParam: id,
    });

    isUploading.onFalse();
  };

  return (
    <View className="flex-1 px-4">
      {isUploading.value && <ActivityIndicator size="large" />}
      <VoiceRecorderHeader />

      <DurationTimer player={audioRecorder} />

      <VoiceRecorderControls
        isNewRecording={isNewRecording.value}
        isRecording={isRecording.value}
        onStart={record}
        onFinish={stopRecording}
        onPause={pauseRecording}
        isDoneRecording={isDoneRecording.value}
      />
    </View>
  );
};

const DurationTimer = ({ player }: { player: AudioRecorder }) => {
  const { durationMillis, metering } = useAudioRecorderState(player, 500);

  return (
    <View className="flex-grow justify-center pb-52">
      <Text className="self-center text-7xl">{fMilliseconds(durationMillis ?? 0)}</Text>
      <H4 className="self-center">Metering: {metering ?? 0}</H4>
    </View>
  );
};
