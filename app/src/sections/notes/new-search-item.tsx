import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

type Props = {
  onPress: VoidFunction;
  icon: React.ReactNode;
  title: string;
  RightTitleComponent?: React.ReactNode;
  previewText?: string;
};

export const NewSearchItem = ({
  icon,
  onPress,
  title,
  RightTitleComponent,
  previewText,
}: Props) => {
  return (
    <MotiPressable onPress={onPress}>
      <Card>
        <CardContent className="flex-row gap-3 items-center p-4">
          {icon}
          <View className="flex-1">
            <View className="flex-row items-center justify-between ">
              <Text className="text-left text-primary font-bold">{title}</Text>
              {RightTitleComponent}
            </View>
            {previewText && (
              <Text numberOfLines={2} className="text-wrap">
                {previewText}
              </Text>
            )}
          </View>
        </CardContent>
      </Card>
    </MotiPressable>
  );
};
