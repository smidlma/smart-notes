import { H3, H4 } from '@/components/ui/typography';
import { View } from 'react-native';
import { formatRelative } from 'date-fns';

type Props = {
  title?: string;
  date?: Date | string;
};

export const VoiceHeader = ({ title = 'New recording', date = new Date() }: Props) => {
  return (
    <View className="flex-row">
      <View style={{ width: 40 }} />
      <View style={{ gap: 4, alignItems: 'center', flexGrow: 1 }}>
        <H3>{title}</H3>
        <H4 className="font-normal">{formatRelative(date, new Date())}</H4>
      </View>
      <View
        style={{
          width: 40,
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}
      ></View>
    </View>
  );
};
