import { Audio } from 'expo-av';
import { Recording, RecordingStatus } from 'expo-av/build/Audio';
import { useState } from 'react';

type Props = {
  onFinished?: (uri: string) => void;
};

export const useAudioRecorder = ({ onFinished }: Props) => {
  const [recording, setRecording] = useState<Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [status, setStatus] = useState<RecordingStatus>();
  const [uri, setUri] = useState<string | null | undefined>();

  const _onStatusUpdate = (status: RecordingStatus) => {
    setStatus(status);
  };

  const startOrResumeRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      if (status && !status.isDoneRecording) {
        // resume existing one
        await recording?.startAsync();
      } else {
        // start new recording
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          _onStatusUpdate,
          1000
        );
        setRecording(recording);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const pauseRecording = async () => {
    await recording?.pauseAsync();
    const uri = recording?.getURI();
    setUri(uri);
  };

  const finishRecording = async () => {
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI();
    setUri(uri);

    onFinished?.(uri ?? '');
  };

  return {
    startOrResumeRecording,
    finishRecording,
    pauseRecording,
    recording,
    permissionResponse,
    status,
    uri,
  };
};
