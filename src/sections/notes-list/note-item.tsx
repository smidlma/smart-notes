import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useLocales } from '@/locales';
import { fDate } from '@/utils/format-time';
import { Pressable } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

type Props = {
  id: string;
  title: string;
  description?: string;
  date: string | Date;
  onPress: VoidFunction;
};

export const NoteItem = ({ id, title, date, description, onPress }: Props) => {
  return (
    <Card>
      <ReanimatedSwipeable
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        overshootRight={false}
        renderRightActions={(_prog, drag) => (
          <RightAction drag={drag} onPress={() => console.log('Delete', id)} titleKey="delete" />
        )}
      >
        <Pressable onPress={onPress}>
          <CardHeader className="py-3">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription numberOfLines={1}>{`${fDate(date)} ${description}`}</CardDescription>
          </CardHeader>
        </Pressable>
      </ReanimatedSwipeable>
    </Card>
  );
};

type ActionProps = {
  drag: SharedValue<number>;
  titleKey: string;
  onPress: VoidFunction;
  defaultWidth?: number;
  defaultOffset?: number;
};
const RightAction = ({
  drag,
  onPress,
  titleKey,
  defaultWidth = 80,
  defaultOffset = 0,
}: ActionProps) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + defaultWidth - defaultOffset }],
    };
  });

  const { t } = useLocales();

  return (
    <Reanimated.View style={[styleAnimation]} className={'bg-red-600 justify-center rounded-r-2xl'}>
      <Pressable onPress={onPress}>
        {
          <Text style={{ width: defaultWidth }} className={`self-center text-center`}>
            {t(titleKey)}
          </Text>
        }
      </Pressable>
    </Reanimated.View>
  );
};
