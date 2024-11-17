import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess, AVPlaybackStatusToSet } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { useEffect, useState } from 'react';

type Props = {
  uri?: string;
  options?: AVPlaybackStatusToSet;
};

export const useAudioPlayer = ({ uri, options = {} }: Props) => {
  const [sound, setSound] = useState<Sound>();
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<AVPlaybackStatusSuccess>();

  const handleStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setStatus(status);
    } else {
      if (status.error) {
        setError(status.error);
      }
    }
  };

  const play = async () => {
    if (uri) {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri,
        },
        options,
        handleStatusUpdate
      );
      setSound(sound);

      try {
        await sound.playAsync();
      } catch (err: any) {
        setError(err);
      }
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return {
    play,
    error,
    status,
  };
};
