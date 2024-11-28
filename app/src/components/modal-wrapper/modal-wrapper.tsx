import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { DismissSymbol } from '../dismiss-symbol/dismiss-symbol';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ModalWrapper = ({ children }: PropsWithChildren) => {
  return (
    <View>
      <DismissSymbol />
      <SafeAreaView className="mt-12">{children}</SafeAreaView>
    </View>
  );
};
