import { Alert, View } from 'react-native';
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
import { useDispatch } from 'react-redux';
import { api, VoiceRecordingSchema } from '@/services/api';
import React from 'react';
import { LoadingOverlay } from '@/components/loading-overlay/loading-overlay';
import { router } from 'expo-router';
import { VoiceHeader } from './components/voice-header';

type Props = {
  noteId: string;
};

export const VoiceRecorder = ({ noteId }: Props) => {
  const isDoneRecording = useBoolean(false);
  const isRecording = useBoolean(false);
  const isNewRecording = useBoolean(true);
  const isUploading = useBoolean(false);

  const dispatch = useDispatch();

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
      isUploading.onTrue();

      const result = await uploadHandler<VoiceRecordingSchema>({
        fileUri: audioRecorder.uri,
        type: 'voice',
        pathParam: noteId,
      });

      console.log(result);

      isUploading.onFalse();

      dispatch(api.util.invalidateTags(['attachments']));

      if (result?.id) {
        router.push({
          pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
          params: { voiceId: result.id, noteId },
        });
      }
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

  return (
    <>
      <View className="flex-grow px-6">
        <VoiceHeader />
        <DurationTimer player={audioRecorder} />
        <VoiceRecorderControls
          isNewRecording={isNewRecording.value}
          isRecording={isRecording.value}
          onStart={record}
          onFinish={stopRecording}
          onPause={pauseRecording}
        />
      </View>
      <LoadingOverlay show={isUploading.value} />
    </>
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