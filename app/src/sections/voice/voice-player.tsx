import { Text } from '@/components/ui/text';
import { H4 } from '@/components/ui/typography';
import { fMilliseconds } from '@/utils/format-time';
import { AudioPlayer, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect } from 'react';
import { View } from 'react-native';
import { API_BASE_URL } from '../../../config-global';
import { useGetVoiceRecordingApiAttachmentsVoiceVoiceIdGetQuery } from '@/services/api';
import { QueryComponentWrapper } from '@/services/components';
import { VoiceHeader } from './components/voice-header';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { Pause, Play } from '@/lib/icons';
import { useColorScheme } from '@/lib/useColorScheme';
import { Button } from '@/components/ui/button';
import { Captions, CircleEllipsis } from 'lucide-react-native';
import { useBoolean } from '@/hooks';
import { VoiceTranscript } from './components/voice-transcript';
import { useLocales } from '@/locales';
import { router } from 'expo-router';
import * as DropdownMenu from 'zeego/dropdown-menu';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

type Props = {
  voiceId: string;
};

export const VoicePlayer = ({ voiceId }: Props) => {
  const { t } = useLocales();
  const { navTheme, colorScheme } = useColorScheme();
  const showTranscript = useBoolean(false);

  const { data, status, isLoading } = useGetVoiceRecordingApiAttachmentsVoiceVoiceIdGetQuery({
    voiceId,
  });

  const audioPlayer = useAudioPlayer(null, 250);
  const playerStatus = useAudioPlayerStatus(audioPlayer);

  const progress = useSharedValue(0);
  const duration = useSharedValue(100);

  useEffect(() => {
    const initAudio = async () => {
      if (audioPlayer && data) {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const uri = `${API_BASE_URL}/storage/voice/${data?.file_name}`;
        audioPlayer.replace({
          uri,
        });
      }
    };

    initAudio();
  }, [audioPlayer, voiceId, data]);

  useEffect(() => {
    if (playerStatus) {
      duration.value = playerStatus.duration ?? 0;
      progress.value = playerStatus.currentTime ?? 0;
    }
  }, [playerStatus]);

  const handleSeekTo = async (value: number) => {
    await audioPlayer.seekTo(value);
    audioPlayer.play();
  };

  const copyTranscript = async () => {
    await Clipboard.setStringAsync(data?.transcription ?? '');
    Toast.show({ type: 'success', text1: t('copied_transcript') });
  };

  return (
    <QueryComponentWrapper
      statuses={[status]}
      firstFetchLoadingOnly
      isFetchingFirstTime={isLoading}
    >
      <View className="flex-grow pb-14 gap-10 pt-6">
        <View className="flex-row justify-between px-6">
          <View className="flex-1" />
          <View className="flex-grow">
            <VoiceHeader date={data?.created_at} title={data?.title ?? undefined} />
          </View>
          <View className="flex-1 items-end">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <MotiPressable>
                  <CircleEllipsis size={26} />
                </MotiPressable>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content>
                <DropdownMenu.Item key="rename">
                  <DropdownMenu.ItemIcon
                    ios={{
                      name: 'pencil', // required
                      pointSize: 24,
                      weight: 'semibold',
                      scale: 'medium',
                      // can also be a color string. Requires iOS 15+
                      hierarchicalColor: {
                        dark: navTheme.primary,
                        light: navTheme.primary,
                      },
                    }}
                  />
                  <DropdownMenu.ItemTitle>{t('rename')}</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
                {data?.transcription && (
                  <DropdownMenu.Item key="copy" onSelect={copyTranscript}>
                    <DropdownMenu.ItemIcon
                      ios={{
                        name: 'list.clipboard', // required
                        pointSize: 24,
                        weight: 'semibold',
                        scale: 'medium',
                        // can also be a color string. Requires iOS 15+
                        hierarchicalColor: {
                          dark: navTheme.primary,
                          light: navTheme.primary,
                        },
                      }}
                    />
                    <DropdownMenu.ItemTitle>{t('copy_transcript')}</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </View>
        </View>
        {showTranscript.value ? (
          <VoiceTranscript voiceId={voiceId} currentTime={playerStatus.currentTime} />
        ) : (
          <DurationTimer player={audioPlayer} />
        )}
        <View className="px-8">
          <Slider
            theme={{
              bubbleBackgroundColor: navTheme.primary,
              bubbleTextColor: colorScheme === 'dark' ? '#000' : '#ffff',
              minimumTrackTintColor: navTheme.primary,
              maximumTrackTintColor: navTheme.border,
            }}
            containerStyle={{ borderRadius: 8 / 2, height: 8 }}
            onSlidingStart={() => audioPlayer.pause()}
            progress={progress}
            minimumValue={useSharedValue(0)}
            maximumValue={duration}
            renderThumb={() => null}
            bubble={(value) => fMilliseconds(value)}
            onSlidingComplete={handleSeekTo}
          />
        </View>

        <View className="flex-row items-center pb-12 justify-between px-8">
          <View className="flex-1">
            <Button
              size="icon"
              variant={showTranscript.value ? 'default' : 'ghost'}
              onPress={() => {
                showTranscript.onToggle();
              }}
            >
              <Captions size={32} />
            </Button>
          </View>
          <View className="flex-1 items-center">
            <MotiPressable
              onPress={() => {
                if (playerStatus.playing) {
                  audioPlayer.pause();
                } else {
                  audioPlayer.play();
                }
              }}
            >
              {playerStatus.playing ? (
                <Pause size={64} className="fill-primary text-primary" />
              ) : (
                <Play size={64} className="fill-primary text-primary" />
              )}
            </MotiPressable>
          </View>

          <View className="flex-1 items-end">
            <Button variant="ghost" onPress={() => router.back()}>
              <Text>{t('done')}</Text>
            </Button>
          </View>
        </View>
      </View>
    </QueryComponentWrapper>
  );
};

const DurationTimer = ({ player }: { player: AudioPlayer }) => {
  const status = useAudioPlayerStatus(player);

  return (
    <View className="flex-grow justify-center pb-52">
      <Text className="self-center text-7xl">{fMilliseconds(status.currentTime ?? 0)}</Text>
      <H4 className="self-center">Duration: {fMilliseconds(status.duration ?? 0)}</H4>
    </View>
  );
};
