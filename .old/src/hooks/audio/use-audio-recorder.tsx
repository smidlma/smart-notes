import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  onFinished?: (uri: string) => void;
};

export const useAudioRecorder = ({ onFinished }: Props) => {
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [uri, setUri] = useState<string | null | undefined>(null);

  const durationRef = useRef(0); // Use ref instead of state for duration to prevent re-renders
  const recordingRef = useRef<Audio.Recording | null>(null);
  const statusRef = useRef<Audio.RecordingStatus | null>(null);

  // Throttle duration updates for UI, e.g., every second
  const [displayDuration, setDisplayDuration] = useState(0);

  const _onStatusUpdate = useCallback(
    (status: Audio.RecordingStatus) => {
      statusRef.current = status;
      durationRef.current = status.durationMillis;
      setIsRecording(status.isRecording);

      // Throttle UI updates of displayDuration to avoid animation lag
      if (status.isRecording && status.durationMillis - displayDuration >= 1000) {
        setDisplayDuration(status.durationMillis);
      }
    },
    [displayDuration]
  );

  const startOrResumeRecording = useCallback(async () => {
    if (permissionResponse?.status !== 'granted') {
      await requestPermission();
    }
    if (statusRef.current && !statusRef.current.isDoneRecording) {
      // Resume existing recording
      await recordingRef.current?.startAsync();
    } else {
      // Start a new recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        _onStatusUpdate,
        1000
      );
      recordingRef.current = recording;
    }
  }, [permissionResponse, requestPermission, _onStatusUpdate]);

  const pauseRecording = useCallback(async () => {
    await recordingRef.current?.pauseAsync();
    setUri(recordingRef.current?.getURI());
  }, []);

  const finishRecording = useCallback(async () => {
    await recordingRef.current?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recordingRef.current?.getURI();
    setUri(uri);
    recordingRef.current = null;
    onFinished?.(uri ?? '');
  }, [onFinished]);

  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  return {
    startOrResumeRecording,
    finishRecording,
    pauseRecording,
    permissionResponse,
    uri,
    duration: displayDuration, // Use throttled displayDuration for smoother UI updates
    isRecording,
  };
};
