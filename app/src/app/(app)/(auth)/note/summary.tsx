import { ModalWrapper } from '@/components/modal-wrapper/modal-wrapper';
import { useLocalSearchParams } from 'expo-router';
import { SummaryView } from '@/sections/summary/summary-view';

const SummaryScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  // const gradient = [
  //   alpha('hsl(0 0% 100%)', 0.1),
  //   alpha('hsl(0 0% 100%)', 0.5),
  //   alpha('hsl(0 0% 100%)', 0.1),
  // ];

  return (
    <ModalWrapper className="px-4 flex-1 ">
      <SummaryView noteId={id} />

      {/* <View className="gap-4">
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
      </View> */}
    </ModalWrapper>
  );
};

export default SummaryScreen;
