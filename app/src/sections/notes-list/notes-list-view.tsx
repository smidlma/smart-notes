import { FlatList } from 'react-native';
import { NoteItem } from './note-item';
import { useReadNotesApiNotesGetQuery } from '@/services/api';
import { router } from 'expo-router';

export const NotesListView = () => {
  const { data: notes } = useReadNotesApiNotesGetQuery();

  const handleOpenNote = (id: string) => {
    router.push({ pathname: '/(app)/(auth)/note/[id]', params: { id } });
  };

  return (
    <FlatList
      style={{ paddingTop: 16 }}
      contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
      keyboardDismissMode="on-drag"
      contentInsetAdjustmentBehavior="automatic"
      data={notes}
      keyExtractor={(item) => item.id!}
      renderItem={({ item }) => (
        <NoteItem
          date={item.edited_at!}
          description="description"
          id={item.id!}
          title={item.title}
          onPress={() => handleOpenNote(item.id!)}
        />
      )}
    />
  );
};
