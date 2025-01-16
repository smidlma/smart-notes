import { useLocalSearchParams } from 'expo-router';
import { SummaryView } from '@/sections/summary/summary-view';

const SummaryScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    // <ModalWrapper>
    <SummaryView noteId={id} />
    // </ModalWrapper>
  );
};

export default SummaryScreen;
