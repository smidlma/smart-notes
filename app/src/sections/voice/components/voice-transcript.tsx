import { Text } from '@/components/ui/text';
import { useBoolean } from '@/hooks';
import { useGetVoiceTranscriptionApiAttachmentsVoiceVoiceIdTranscriptionGetQuery } from '@/services/api';
import { QueryComponentWrapper } from '@/services/components';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';

type Props = { voiceId: string; currentTime: number };

export const VoiceTranscript = ({ voiceId, currentTime }: Props) => {
  const shouldPool = useBoolean(false);

  const { data, status } = useGetVoiceTranscriptionApiAttachmentsVoiceVoiceIdTranscriptionGetQuery(
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
    }
  }, [data]);

  const renderTranscription = (
    <ScrollView className="flex-1">
      <View className="px-8 gap-1 flex-row flex-wrap">
        {data?.words?.map(({ start, end, word }) => (
          <Text
            key={start}
            className={`${currentTime >= start && currentTime <= end ? 'text-xl text-primary' : 'text-xl text-muted-foreground'} `}
          >
            {word}
          </Text>
        ))}
      </View>
    </ScrollView>
  );

  const renderProcessing = (
    <View>
      <Text>Processing...</Text>
    </View>
  );

  const renderFailed = (
    <View>
      <Text>Failed to fetch transcription</Text>
    </View>
  );

  return (
    <QueryComponentWrapper statuses={[status]}>
      {(data?.status === 'processing' || data?.status === 'new') && renderProcessing}
      {data?.status === 'done' && renderTranscription}
      {data?.status === 'failed' && renderFailed}
    </QueryComponentWrapper>
  );
};
