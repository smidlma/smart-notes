import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H3 } from '@/components/ui/typography';
import { useBoolean } from '@/hooks';
import { useLocales } from '@/locales';
import {
  api,
  useGetVoiceTranscriptionApiAttachmentsVoiceVoiceIdTranscriptionGetQuery,
  WordSchema,
} from '@/services/api';
import { QueryComponentWrapper } from '@/services/components';
import { BrainCog, CloudAlert } from 'lucide-react-native';
import { MotiText } from 'moti';
import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

type Props = { voiceId: string; currentTime: number };

export const VoiceTranscript = ({ voiceId, currentTime = 0 }: Props) => {
  const dispatch = useDispatch();
  const { t } = useLocales();

  const shouldPool = useBoolean(false);

  const flatListRef = useRef<FlatList>(null);

  const [currentWordIndex, setCurrentWordIndex] = useState(1);

  const shouldAutoScroll = useBoolean(true);

  const { data, status, isLoading, refetch } =
    useGetVoiceTranscriptionApiAttachmentsVoiceVoiceIdTranscriptionGetQuery(
      {
        voiceId,
      },
      { pollingInterval: shouldPool.value ? 2500 : undefined }
    );

  useEffect(() => {
    if (data?.status === 'new' || data?.status === 'processing') {
      shouldPool.onTrue();
    } else {
      shouldPool.onFalse();
      dispatch(api.util.invalidateTags(['attachments']));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // useEffect(() => {
  //   if (shouldAutoScroll.value) {
  //     flatListRef?.current?.scrollToIndex({
  //       index: currentWordIndex,
  //       animated: true,
  //       viewPosition: 0.5,
  //     });
  //   }
  // }, [currentWordIndex, shouldAutoScroll.value]);

  const chunkedWords = useMemo(
    () =>
      data?.words?.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 10);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      }, [] as WordSchema[][]) ?? [],
    [data?.words]
  );

  const renderTranscription = (
    <FlatList
      onTouchStart={() => shouldAutoScroll.onFalse()}
      onTouchEnd={() =>
        setTimeout(() => {
          shouldAutoScroll.onTrue();
        }, 3000)
      }
      ref={flatListRef}
      className="px-4"
      data={chunkedWords}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item: words, index }: { item: WordSchema[]; index: number }) => (
        <Text style={{ flexWrap: 'wrap' }}>
          {words.map(({ start, end, word }, idx) => {
            const isCurrent = currentTime >= start && currentTime <= end;
            const isPast = currentTime > end;

            // if (isCurrent && currentWordIndex !== index) {
            //   setCurrentWordIndex(index);
            // }

            return (
              <Text
                key={idx}
                className={`text-xl font-semibold text-muted-foreground ${isCurrent && 'text-primary'} ${isPast && 'text-secondary'}`}
              >
                {word}{' '}
              </Text>
            );
          })}
        </Text>
      )}
    />
  );

  const renderProcessing = (
    <View className="flex-grow gap-6 items-center justify-center">
      <BrainCog size={128} />
      <MotiText
        from={{ opacity: 0.2 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 1500, loop: true }}
      >
        <H3>{t('processing')}</H3>
      </MotiText>
    </View>
  );

  const renderFailed = (
    <View className="flex-grow gap-6 items-center justify-center">
      <CloudAlert size={128} />
      <H3>{t('failed_transcript')}</H3>
      <Button onPress={refetch} variant="default">
        <Text>{t('retry')}</Text>
      </Button>
    </View>
  );

  return (
    <QueryComponentWrapper
      statuses={[status]}
      isFetchingFirstTime={isLoading}
      firstFetchLoadingOnly
    >
      {(data?.status === 'processing' || data?.status === 'new') && renderProcessing}
      {data?.status === 'done' && renderTranscription}
      {data?.status === 'failed' && renderFailed}
    </QueryComponentWrapper>
  );
};
