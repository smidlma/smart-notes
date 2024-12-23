import { NoteItem } from './note-item';
import { useReadNotesApiNotesGetQuery } from '@/services/api';
import { router } from 'expo-router';
import Animated, { LinearTransition } from 'react-native-reanimated';

export const NotesListView = () => {
  const { data: notes } = useReadNotesApiNotesGetQuery();

  const handleOpenNote = (id: string) => {
    router.push({ pathname: '/(app)/(auth)/note/[id]', params: { id } });
  };

  return (
    <Animated.FlatList
      style={{ paddingTop: 16 }}
      contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
      keyboardDismissMode="on-drag"
      contentInsetAdjustmentBehavior="automatic"
      data={notes}
      keyExtractor={(item) => item.id!}
      itemLayoutAnimation={LinearTransition}
      renderItem={({ item }) => (
        <NoteItem
          date={item.updated_at!}
          description={item.description ?? ''}
          id={item.id!}
          title={item.title}
          onPress={() => handleOpenNote(item.id!)}
        />
      )}
    />
  );
};
