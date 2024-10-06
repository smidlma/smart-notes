import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { DismissSymbol } from '../dismiss-symbol/dismiss-symbol';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ModalWrapper = ({ children }: PropsWithChildren) => {
  return (
    <View style={styles.container}>
      <DismissSymbol />
      <SafeAreaView>{children}</SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
