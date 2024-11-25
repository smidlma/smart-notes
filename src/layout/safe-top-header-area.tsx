import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

export const SafeTopHeaderArea = ({ children }: PropsWithChildren) => {
  const height = useHeaderHeight();

  return <View style={{ paddingTop: height }}>{children}</View>;
};
