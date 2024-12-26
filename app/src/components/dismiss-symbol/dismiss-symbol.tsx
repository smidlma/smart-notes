import { StyleSheet, View } from 'react-native';

type Props = {
  width?: number;
};

export const DismissSymbol = ({ width = 70 }: Props) => {
  return (
    <View style={{ ...styles.container }}>
      <View style={{ width }} className="h-1.5 rounded-md bg-primary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
