import { useLocales } from '@/locales';
import { router, Stack } from 'expo-router';
import { useColorScheme } from '@/lib/useColorScheme';
import { Alert, Pressable, View } from 'react-native';
import { useCreateNoteApiNotesPostMutation } from '@/services/api';
import { NotebookPen, Sun, MoonStar } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function StackLayout() {
  const { t } = useLocales();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  const [createNote] = useCreateNoteApiNotesPostMutation();

  const handleCreatePress = async () => {
    try {
      const { data } = await createNote({ noteCreate: { title: 'New Note' } });
      router.push({ pathname: '/(app)/(auth)/note/[id]', params: { id: data?.id ?? '' } });
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to create note');
    }
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t('app_name'),
          headerRight: () => (
            <Pressable onPress={handleCreatePress}>
              <NotebookPen size={24} />
            </Pressable>
          ),
          headerLeft: () => (
            <Pressable onPress={toggleColorScheme}>
              {isDarkColorScheme ? <Sun /> : <MoonStar />}
            </Pressable>
          ),
          headerLargeTitle: true,
          headerBlurEffect: 'regular',
          headerTransparent: true,
          headerSearchBarOptions: {
            placeholder: 'Search..',
          },
        }}
      />
      <Stack.Screen
        name="note/[id]"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: 'Note',
          headerBackTitle: 'Back',
          headerRight: () => (
            <View>
              <Button onPress={() => router.push('/(app)/(auth)/note/modal')}>
                <Text>modal</Text>
              </Button>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="note/modal"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
