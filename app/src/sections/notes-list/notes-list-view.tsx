import { faker } from '@faker-js/faker';
import { FlatList } from 'react-native';
import { NoteItem } from './note-item';
import { useReadNotesApiNotesGetQuery } from '@/services/api';

const DATA = Array.from({ length: 10 }).map(() => ({
  id: faker.string.uuid(),
  title: faker.lorem.word(),
  description: faker.lorem.sentence(),
  date: faker.date.recent(),
}));

export const NotesListView = () => {
  const { data: notes } = useReadNotesApiNotesGetQuery();
  console.log(notes);

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
          onPress={() => console.log('Pressed', item.id)}
        />
      )}
    />
  );
};
