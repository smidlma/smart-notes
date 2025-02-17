import { ActionSheetIOS, Alert, View } from 'react-native';
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
import {
  api,
  useUpdateVoiceRecordingApiAttachmentsVoiceVoiceIdPutMutation,
  VoiceRecordingSchema,
} from '@/services/api';
import React from 'react';
import { LoadingOverlay } from '@/components/loading-overlay/loading-overlay';
import { router } from 'expo-router';
import { VoiceHeader } from './components/voice-header';
import { useLocales } from '@/locales';
import { usePreventRemove } from '@react-navigation/native';

type Props = {
  noteId: string;
};

export const VoiceRecorder = ({ noteId }: Props) => {
  const { t } = useLocales();

  const [updateVoice] = useUpdateVoiceRecordingApiAttachmentsVoiceVoiceIdPutMutation();

  const isDoneRecording = useBoolean(false);
  const isRecording = useBoolean(false);
  const isNewRecording = useBoolean(true);
  const isUploading = useBoolean(false);

  usePreventRemove(isRecording.value || isUploading.value || !isNewRecording.value, () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [t('cancel'), t('save_and_leave'), t('discard')],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          await saveRecording();
        }
        if (buttonIndex === 2) {
          await discardRecording();
          router.back();
        }
      }
    );
  });

  const dispatch = useDispatch();

  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
  });

  const discardRecording = async () => {
    isRecording.onFalse();
    isNewRecording.onTrue();
    await audioRecorder.stop();
  };

  const record = () => {
    audioRecorder.record();
    isRecording.onTrue();
    isNewRecording.onFalse();
  };

  const pauseRecording = () => {
    isRecording.onFalse();
    audioRecorder.pause();
  };

  const saveRecording = async () => {
    const time = audioRecorder.currentTime ?? 0;
    await audioRecorder.stop();
    isRecording.onFalse();
    isDoneRecording.onTrue();
    if (audioRecorder.uri) {
      isUploading.onTrue();

      try {
        const result = await uploadHandler<VoiceRecordingSchema>({
          fileUri: audioRecorder.uri,
          type: 'voice',
          pathParam: noteId,
        });

        await updateVoice({
          voiceId: result?.id ?? '',
          voiceRecordingUpdate: {
            duration: time,
            title: 'New recording',
          },
        }).unwrap();

        isUploading.onFalse();

        dispatch(api.util.invalidateTags(['attachments']));

        if (result?.id) {
          router.push({
            pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
            params: { voiceId: result.id, noteId },
          });
        }
      } catch (e) {
        console.log(e);
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
      <View className="px-6 pb-6 pt-6 h-screen-safe">
        <VoiceHeader />
        <DurationTimer player={audioRecorder} />
        <VoiceRecorderControls
          isNewRecording={isNewRecording.value}
          isRecording={isRecording.value}
          onStart={record}
          onFinish={saveRecording}
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
