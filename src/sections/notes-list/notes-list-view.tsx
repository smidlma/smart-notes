import { faker } from '@faker-js/faker';
import { FlatList } from 'react-native';
import { NoteItem } from './note-item';

const DATA = Array.from({ length: 10 }).map(() => ({
  id: faker.string.uuid(),
  title: faker.lorem.word(),
  description: faker.lorem.sentence(),
  date: faker.date.recent(),
}));

export const NotesListView = () => {
  return (
    <FlatList
      style={{ paddingTop: 16 }}
      contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
      keyboardDismissMode="on-drag"
      contentInsetAdjustmentBehavior="automatic"
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NoteItem {...item} onPress={() => console.log('Pressed', item.id)} />
      )}
    />
  );
};
