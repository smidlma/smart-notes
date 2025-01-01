import { ActivityIndicator, View } from 'react-native';

type Props = {
  show: boolean;
};

export const LoadingOverlay = ({ show }: Props) => {
  return show ? (
    <View className="absolute top-0 left-0 w-full h-full justify-center bg-muted/80 pb-20">
      <ActivityIndicator size="large" className="text-primary" />
    </View>
  ) : null;
};
