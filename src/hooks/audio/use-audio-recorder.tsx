import { Audio } from 'expo-av';
import { Recording, RecordingStatus } from 'expo-av/build/Audio';
import { useState } from 'react';

type Props = {
  onFinished?: (uri: string | null | undefined) => void;
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

    onFinished?.(uri);
  };

  // const [sound, setSound] = useState<Sound>();

  // async function playSound() {
  //   console.log('Loading Sound');
  //   const file =
  //     'file:///var/mobile/Containers/Data/Application/20DC67FB-C7E4-41BE-98EF-64054FDF7834/Library/Caches/AV/recording-5735E822-F291-4F97-B34F-621C1DCF8BE0.m4a';
  //   const { sound } = await Audio.Sound.createAsync({
  //     uri: file,
  //   });
  //   setSound(sound);

  //   console.log('Playing Sound');

  //   try {
  //     await sound.playAsync();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log('Unloading Sound');
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);

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
