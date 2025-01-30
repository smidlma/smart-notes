import { useLocalSearchParams } from 'expo-router';
import { SummaryView } from '@/sections/summary/summary-view';

const SummaryScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <SummaryView noteId={id} />;
};

export default SummaryScreen;
