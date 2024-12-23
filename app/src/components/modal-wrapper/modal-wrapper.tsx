import { PropsWithChildren } from 'react';
import { View, ViewProps } from 'react-native';
import { DismissSymbol } from '../dismiss-symbol/dismiss-symbol';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ModalWrapper = ({ children, ...props }: PropsWithChildren<ViewProps>) => {
  return (
    <View {...props}>
      <DismissSymbol />
      <SafeAreaView className="mt-12">{children}</SafeAreaView>
    </View>
  );
};
