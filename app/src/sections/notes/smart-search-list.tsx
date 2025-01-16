import { useDebounce } from '@/hooks';
import { useSearchNotesApiSearchGetQuery } from '@/services/api';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SearchItem } from './search-item';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useLocales } from '@/locales';
import { LoadingOverlay } from '@/components/loading-overlay/loading-overlay';
import React from 'react';

type Props = {
  search: string;
};

export const SmartSearchList = ({ search }: Props) => {
  const searchDebounced = useDebounce(search, 1000);

  const { data, isFetching } = useSearchNotesApiSearchGetQuery(
    { query: searchDebounced.debouncedValue },
    { skip: searchDebounced.debouncedValue.length < 3 }
  );

  return (
    <>
      <Animated.FlatList
        style={{ paddingTop: 16 }}
        ListEmptyComponent={<EmptySearch />}
        contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="automatic"
        data={data?.results}
        keyExtractor={(item) => item.score.toString()}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => <SearchItem {...item} />}
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
