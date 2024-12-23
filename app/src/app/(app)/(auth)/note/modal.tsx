import { ModalWrapper } from '@/components/modal-wrapper/modal-wrapper';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useLazyGetSummaryApiNotesSummaryNoteIdGetQuery } from '@/services/api/custom-endpoints';
import { useLocalSearchParams } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import { useState } from 'react';
import { View } from 'react-native';
import Markdown from '@ronradtke/react-native-markdown-display';
import { MotiView } from 'moti';
import { alpha } from '@/utils/alpha';

const SummaryScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [summary, setSummary] = useState('');

  const [generateSummary, { isLoading }] = useLazyGetSummaryApiNotesSummaryNoteIdGetQuery();

  const handleGenerateSummary = async () => {
    try {
      const result = await generateSummary({ noteId: id }).unwrap();
      console.log(result);
      setSummary(result.summary);
    } catch (e) {
      console.log(e);
    }
  };

  const gradient = [
    alpha('hsl(0 0% 100%)', 0.1),
    alpha('hsl(0 0% 100%)', 0.5),
    alpha('hsl(0 0% 100%)', 0.1),
  ];

  return (
    <ModalWrapper className="px-4">
      <View className="gap-4">
        <Text>SmartModal {id}</Text>
        <Button disabled={isLoading} onPress={handleGenerateSummary}>
          <Text>Generate</Text>
        </Button>

        {isLoading ? (
          <MotiView className="gap-4">
            <Skeleton width="30%" height={20} radius={16} colors={gradient} />
            <Skeleton
              width="80%"
              height={20}
              backgroundColor="0 0% 100%"
              radius={'round'}
              colors={gradient}
            />
            <Skeleton
              width="100%"
              height={20}
              backgroundColor="0 0% 100%"
              radius={'round'}
              colors={gradient}
            />
            <Skeleton
              width="60%"
              height={20}
              backgroundColor="0 0% 100%"
              radius={'round'}
              colors={gradient}
            />
            <Skeleton
              width="100%"
              height={20}
              backgroundColor="0 0% 100%"
              radius={'round'}
              colors={gradient}
            />
          </MotiView>
        ) : (
          <Markdown style={{ body: { color: '#fff' } }}>{summary}</Markdown>
        )}
      </View>
    </ModalWrapper>
  );
};

export default SummaryScreen;
