import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { fDateTime } from '@/utils/format-time';
import { View } from 'react-native';

type Props = {
  onPress: VoidFunction;
  icon: React.ReactNode;
  title: string;
  RightActionComponent?: React.ReactNode;
  date: Date | string;
};

export const AttachmentItem = ({ onPress, icon, title, RightActionComponent, date }: Props) => {
  return (
    <MotiPressable onPress={onPress}>
      <Card>
        <CardContent className="py-3 pl-3">
          <View className="flex-row items-center gap-4">
            {icon}
            <View className="flex-grow">
              <Text>{title}</Text>
              <Text className="text-sm">{fDateTime(date)}</Text>
            </View>
            {RightActionComponent}
          </View>
        </CardContent>
      </Card>
    </MotiPressable>
  );
};
