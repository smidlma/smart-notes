import React, { PropsWithChildren } from 'react';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { FirstFetchOnlyNotProps, FirstFetchOnlyProps } from '../types';
import { useQueryStatuses } from '../hooks/use-query-statuses';
import { ActivityIndicator, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { H1 } from '@/components/ui/typography';
import { useHeaderHeight } from '@react-navigation/elements';
import { MotiView } from 'moti';

type MainProps = {
  LoadingSkeleton?: React.ReactNode;
  statuses: QueryStatus[] | QueryStatus;
  errorMessage?: string;
  errorComponent?: React.ReactNode;
  actionText?: string;
  onRetry?: VoidFunction;
};
type Props = MainProps & (FirstFetchOnlyProps | FirstFetchOnlyNotProps);

export const QueryComponentWrapper = ({
  LoadingSkeleton,
  statuses,
  errorMessage,
  children,
  firstFetchLoadingOnly,
  isFetchingFirstTime,
  errorComponent,
  actionText,
  onRetry,
}: PropsWithChildren<Props>) => {
  const { someQueryError, someQueryPending } = useQueryStatuses(
    statuses,
    firstFetchLoadingOnly,
    isFetchingFirstTime
  );

  const height = useHeaderHeight();

  if (someQueryPending) {
    return (
      <>
        {LoadingSkeleton || (
          <View className="h-screen-safe justify-center items-center">
            <ActivityIndicator size="large" style={{ paddingBottom: height }} />
          </View>
        )}
      </>
    );
  }

  if (someQueryError) {
    return (
      errorComponent ?? (
        <View className="flex-1 justify-center items-center">
          <H1>{errorMessage}</H1>
          <Button onPress={onRetry}>
            <Text>{actionText}</Text>
          </Button>
        </View>
      )
    );
  }

  return (
    <MotiView className="flex-1" from={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {children}
    </MotiView>
  );
};
