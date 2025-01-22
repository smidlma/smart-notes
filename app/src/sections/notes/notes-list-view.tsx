import { useBoolean } from '@/hooks';
import { NoteItem } from './note-item';
import { useReadNotesApiNotesGetQuery } from '@/services/api';
import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SearchBarProps } from 'react-native-screens';
import { SmartSearchList } from './smart-search-list';
import { QueryComponentWrapper } from '@/services/components';

export const NotesListView = () => {
  const navigation = useNavigation();
  const { data: notes, status, isLoading } = useReadNotesApiNotesGetQuery();
  const [search, setSearch] = useState('');

  const showSmartSearch = useBoolean(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onFocus: showSmartSearch.onTrue,
        onCancelButtonPress: showSmartSearch.onFalse,
        placeholder: 'Search...',
        onChangeText: (event: NativeSyntheticEvent<TextInputFocusEventData>) =>
          setSearch(event.nativeEvent.text),
      } as SearchBarProps,
    });
  }, [navigation]);

  const handleOpenNote = (id: string) => {
    router.push({ pathname: '/(app)/(auth)/note/[id]', params: { id } });
  };

  return showSmartSearch.value ? (
    <SmartSearchList search={search} />
  ) : (
    <QueryComponentWrapper
      statuses={[status]}
      firstFetchLoadingOnly
      isFetchingFirstTime={isLoading}
    >
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
    </QueryComponentWrapper>
  );
};
