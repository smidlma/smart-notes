import { useLocales } from '@/locales';
import { router, Stack } from 'expo-router';
import { MoonStar, Sun } from '@/lib/icons';
import { useColorScheme } from '@/lib/useColorScheme';
import { Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCreateNoteApiNotesPostMutation } from '@/services/api';

export default function StackLayout() {
  const { t } = useLocales();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  const [createNote] = useCreateNoteApiNotesPostMutation();

  const handleCreatePress = async () => {
    try {
      const { data } = await createNote({ noteCreate: { title: 'New Note' } });
      router.push(`./${data?.id}`);
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
              <Ionicons name="create-outline" size={24} />
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
    </Stack>
  );
}
