import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { alpha } from '@/utils/alpha';
import {
  useGenerateNewSummaryApiNotesSummaryNoteIdPostMutation,
  useGetSummaryApiNotesSummaryNoteIdGetQuery,
} from '@/services/api';
import { QueryComponentWrapper } from '@/services/components';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import Markdown from '@ronradtke/react-native-markdown-display';
import { useLocales } from '@/locales';
import { fToNow } from '@/utils/format-time';
import { useColorScheme } from '@/lib/useColorScheme';
import { NAV_THEME } from '@/lib/constants';
import { BlurView } from 'expo-blur';

type Props = { noteId: string };

export const SummaryView = ({ noteId }: Props) => {
  const { t } = useLocales();
  const { colorScheme } = useColorScheme();

  const { data: recentSummary, status: summaryStatus } = useGetSummaryApiNotesSummaryNoteIdGetQuery(
    {
      noteId,
    }
  );

  const [generateNewSummary, { status: generationStatus }] =
    useGenerateNewSummaryApiNotesSummaryNoteIdPostMutation();

  const handleNewSummary = async () => {
    await generateNewSummary({ noteId });
  };

  return (
    <QueryComponentWrapper statuses={[summaryStatus, generationStatus]}>
      <View className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow"
          contentInsetAdjustmentBehavior="automatic"
        >
          <Markdown
            style={{
              body: {
                fontSize: 16,
                color: NAV_THEME[colorScheme].text,
                paddingHorizontal: 16,
                paddingBottom: 112,
              },
            }}
          >
            {recentSummary?.summary_text ?? ''}
          </Markdown>
        </ScrollView>

        <View className="gap-2 justify-end" style={{ ...StyleSheet.absoluteFillObject }}>
          <BlurView intensity={50} className="pb-8 pt-4 px-12">
            <Button onPress={handleNewSummary}>
              <Text>{t('regenerate')}</Text>
            </Button>
            <Text className="text-muted-foreground text-sm self-center">
              {t('last_generated')}: {fToNow(recentSummary?.created_at)}
            </Text>
          </BlurView>
        </View>
      </View>
    </QueryComponentWrapper>
  );
};

const LoadingSkeleton = () => {
  const gradient = [
    alpha('hsl(0 0% 100%)', 0.1),
    alpha('hsl(0 0% 100%)', 0.5),
    alpha('hsl(0 0% 100%)', 0.1),
  ];

  return (
    <MotiView className="gap-4">
      <Skeleton width="30%" height={20} radius={16} colors={gradient} />
      <Skeleton width="80%" height={20} radius="round" colors={gradient} />
      <Skeleton width="100%" height={20} radius="round" colors={gradient} />
      <Skeleton width="60%" height={20} radius="round" colors={gradient} />
      <Skeleton width="60%" height={20} radius="round" colors={gradient} />
      <Skeleton width="100%" height={20} radius="round" colors={gradient} />
      <Skeleton width="100%" height={20} radius="round" colors={gradient} />
    </MotiView>
  );
};
