import { NAV_THEME } from '@/lib/constants';
import { useColorScheme } from '@/lib/useColorScheme';
import { useStreamQuickRecapApiNotesQuickRecapPostMutation } from '@/services/api';
import { QueryComponentWrapper } from '@/services/components';
import Markdown from '@ronradtke/react-native-markdown-display';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';

const RecapScreen = () => {
  const { colorScheme } = useColorScheme();
  const { ids } = useLocalSearchParams<'/(app)/(auth)/recap/[...ids]'>();
  const [getQuickRecap, { data, status }] = useStreamQuickRecapApiNotesQuickRecapPostMutation();

  useEffect(() => {
    const init = async () => {
      await getQuickRecap({ notesIds: ids }).unwrap();
    };
    init();
  }, []);

  return (
    <QueryComponentWrapper statuses={[status]}>
      <ScrollView contentContainerClassName="flex-grow" contentInsetAdjustmentBehavior="automatic">
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
          {data ?? ''}
        </Markdown>
      </ScrollView>
    </QueryComponentWrapper>
  );
};

export default RecapScreen;
