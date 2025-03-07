import { useDebounce } from '@/hooks';
import {
  useSearchNotesApiSearchGetQuery,
  NoteSearchResponse,
  VoiceSearchResponse,
  DocumentSearchResponse,
} from '@/services/api';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SearchItemWrapper } from './search-item-wrapper';
import { ListRenderItemInfo, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useLocales } from '@/locales';
import { LoadingOverlay } from '@/components/loading-overlay/loading-overlay';
import React, { useCallback, useMemo } from 'react';
import { getSectionByItemType } from './utils';

type Props = {
  search: string;
};

export const SmartSearchList = ({ search }: Props) => {
  const searchDebounced = useDebounce(search, 1000);

  const { data, isFetching } = useSearchNotesApiSearchGetQuery(
    { query: searchDebounced.debouncedValue },
    { skip: searchDebounced.debouncedValue.length < 3 }
  );

  const sections = useMemo(() => {
    const notes = data?.results?.filter((item) => item.type === 'note') as NoteSearchResponse[];
    const voices = data?.results?.filter((item) => item.type === 'voice') as VoiceSearchResponse[];
    const documents = data?.results?.filter(
      (item) => item.type === 'document'
    ) as DocumentSearchResponse[];

    return [
      ...getSectionByItemType(notes),
      ...getSectionByItemType(voices),
      ...getSectionByItemType(documents),
    ];
  }, [data?.results]);

  const renderItem = useCallback(
    ({
      item,
    }: ListRenderItemInfo<
      NoteSearchResponse | VoiceSearchResponse | DocumentSearchResponse | { section: string }
    >) => {
      if ('section' in item) {
        return <Text className="text-xl font-bold text-primary">{item.section}</Text>;
      }

      return <SearchItemWrapper {...item} />;
    },
    []
  );

  return (
    <>
      <Animated.FlatList
        style={{ paddingTop: 16 }}
        ListEmptyComponent={<EmptySearch />}
        contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="automatic"
        data={sections}
        keyExtractor={(item) => {
          if ('section' in item) return item.section;

          return item.id;
        }}
        itemLayoutAnimation={LinearTransition}
        renderItem={renderItem}
      />
      <LoadingOverlay show={isFetching || searchDebounced.isDebouncing} />
    </>
  );
};

const EmptySearch = () => {
  const { t } = useLocales();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Text style={{ fontSize: 16, color: 'gray' }}>{t('initiate_search')} </Text>
    </View>
  );
};
