import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { useLocales } from '@/locales';
import { BookOpen } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Markdown from '@ronradtke/react-native-markdown-display';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { alpha } from '@/utils/alpha';
import { useCreateSummaryApiNotesSummaryNoteIdPostMutation } from '@/services/api';
import Toast from 'react-native-toast-message';

type Props = { noteId: string };

export const SummaryView = ({ noteId }: Props) => {
  const { t } = useLocales();

  const [summary, setSummary] = useState<string | null | undefined>(null);

  const [generateSummary, { isLoading }] = useCreateSummaryApiNotesSummaryNoteIdPostMutation();

  const handleGenerateSummary = async () => {
    try {
      const result = await generateSummary({ noteId }).unwrap();

      setSummary(result?.summary_text);
    } catch (e) {
      console.log(e);

      Toast.show({ type: 'error', text1: t('error'), text2: (e as Error).message });
    }
  };

  return (
    <View className="h-full">
      <H1>{t('summary')}</H1>
      <ScrollView className="flex-grow">
        {!summary && !isLoading && (
          <View className="min-h-full justify-center items-center">
            <BookOpen size={76} />
          </View>
        )}
        {summary && <Markdown style={{ body: { color: '#fff' } }}>{summary}</Markdown>}
        {isLoading && <LoadingSkeleton />}
      </ScrollView>

      <View style={{ paddingBottom: 72 }}>
        <Button onPress={handleGenerateSummary} disabled={isLoading}>
          <Text>{t('generate')}</Text>
        </Button>
      </View>
    </View>
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
