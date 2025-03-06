import { useBoolean } from '@/hooks';
import { NoteItem } from './note-item';
import { useReadNotesApiNotesGetQuery } from '@/services/api';
import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { SearchBarProps } from 'react-native-screens';
import { SmartSearchList } from './smart-search-list';
import { QueryComponentWrapper } from '@/services/components';
import { getSectionsByDate } from './utils';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { NoteItemSection } from './note-item-section';

export const NotesListView = () => {
  const navigation = useNavigation();
  const { data: notes, status, isLoading } = useReadNotesApiNotesGetQuery();
  const [search, setSearch] = useState('');

  const sections = useMemo(() => getSectionsByDate(notes), [notes]);

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
  }, [navigation, showSmartSearch.onFalse, showSmartSearch.onTrue]);

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
        data={sections}
        keyExtractor={(item) => ('section' in item ? item.section : item.id!)}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => {
          if ('section' in item) {
            return <NoteItemSection section={item.section} notes={item.notes} />;
          }

          return (
            <NoteItem
              date={item?.updated_at ?? ''}
              description={item.description ?? ''}
              id={item.id!}
              title={item.title}
              onPress={handleOpenNote}
              content={item.content}
            />
          );
        }}
      />
    </QueryComponentWrapper>
  );
};
