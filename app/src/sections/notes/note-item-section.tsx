import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H3 } from '@/components/ui/typography';
import { NoteSchema } from '@/services/api';
import { router } from 'expo-router';
import { Wand2 } from 'lucide-react-native';
import { View } from 'react-native';

type Props = { section: string; notes: NoteSchema[] };

export const NoteItemSection = ({ section, notes }: Props) => {
  const handleQuickRecap = () => {
    const ids = notes.map(({ id }) => id!);
    console.log('quick', ids);

    router.push({
      pathname: '/(app)/(auth)/recap/[...ids]',
      params: { ids },
    });
  };

  return (
    <View className="flex-row justify-between items-center">
      <H3>{section}</H3>
      <Button
        size="sm"
        variant="ghost"
        className="flex-row items-center"
        onPress={handleQuickRecap}
      >
        <Wand2 size={16} />
        <Text className="pl-2 ">Quick recap</Text>
      </Button>
    </View>
  );
};
