import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H3 } from '@/components/ui/typography';
import { NoteSchema } from '@/services/api';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Wand2 } from '@/lib/icons';

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
        <Wand2 size={16} className="text-primary" />
        <Text className="pl-2 text-primary">Quick recap</Text>
      </Button>
    </View>
  );
};
