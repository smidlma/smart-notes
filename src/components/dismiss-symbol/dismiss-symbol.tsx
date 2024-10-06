import { useAppTheme } from '@/theme/theme-context';
import { StyleSheet, View } from 'react-native';

type Props = {
  width?: number;
};

export const DismissSymbol = ({ width = 70 }: Props) => {
  const { theme } = useAppTheme();

  return (
    <View style={{ ...styles.container }}>
      <View
        style={{ ...styles.symbol, width, backgroundColor: theme.colors.surfaceVariant }}
      ></View>
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
  symbol: {
    width: 40,
    height: 6,
    borderRadius: 4,
  },
});
