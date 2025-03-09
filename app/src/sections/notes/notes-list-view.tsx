import { useBoolean } from '@/hooks';
import { NoteItem } from './note-item';
import { useCreateNoteApiNotesPostMutation, useReadNotesApiNotesGetQuery } from '@/services/api';
import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData, View } from 'react-native';
import { SearchBarProps } from 'react-native-screens';
import { SmartSearchList } from './smart-search-list';
import { QueryComponentWrapper } from '@/services/components';
import { getSectionsByDate } from './utils';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { NoteItemSection } from './note-item-section';
import Toast from 'react-native-toast-message';
import { useLocales } from '@/locales';
import { H4 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export const NotesListView = () => {
  const navigation = useNavigation();

  const { data: notes, status, isLoading } = useReadNotesApiNotesGetQuery();
  const [search, setSearch] = useState('');

  const [createNote] = useCreateNoteApiNotesPostMutation();

  const { t } = useLocales();
  const handleCreatePress = async () => {
    try {
      const { data } = await createNote({ noteCreate: { title: t('new_note') } });
      router.push({ pathname: '/(app)/(auth)/note/[id]', params: { id: data?.id ?? '' } });
    } catch {
      Toast.show({ type: 'error', text1: t('create_note_error') });
    }
  };

  const renderEmptyContent = (
    <View className="flex-1 items-center justify-center gap-4 mt-40 ">
      <H4>{t('start_building_your_knowledge')}</H4>
      <Button onPress={handleCreatePress}>
        <Text>{t('create_your_first_note')}</Text>
      </Button>
    </View>
  );

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
        ListEmptyComponent={renderEmptyContent}
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
