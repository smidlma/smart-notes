import { MotiPressable } from '@/components/moti-pressable/moti-pressable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useLocales } from '@/locales';
import { fDateTime } from '@/utils/format-time';
import { View } from 'react-native';
import { FileSymlink } from '@/lib/icons/icons';
type Props = {
  onPress: VoidFunction;
  icon: React.ReactNode;
  title: string;
  onActionPress: VoidFunction;
  date: Date | string;
};

export const AttachmentItem = ({ onPress, icon, title, onActionPress, date }: Props) => {
  const { t } = useLocales();

  return (
    <MotiPressable onPress={onPress}>
      <Card>
        <CardContent className="py-3 pl-3">
          <View className="flex-row items-center gap-4">
            {icon}
            <View className="flex-1">
              <Text numberOfLines={1}>{title}</Text>
              <Text className="text-sm">{fDateTime(date)}</Text>
            </View>
            <Button size="sm" onPress={onActionPress} variant="ghost" className="flex-row gap-2">
              <FileSymlink className="text-primary" />
              <Text>{t('attach')}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </MotiPressable>
  );
};
