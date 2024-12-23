import { useLocales } from '@/locales';
import { router, Stack } from 'expo-router';
import { useColorScheme } from '@/lib/useColorScheme';
import { Pressable } from 'react-native';
import { useCreateNoteApiNotesPostMutation } from '@/services/api';
import { NotebookPen, Sun, MoonStar } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function StackLayout() {
  const { t } = useLocales();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  const [createNote] = useCreateNoteApiNotesPostMutation();

  const handleCreatePress = async () => {
    try {
      const { data } = await createNote({ noteCreate: { title: t('new_note') } });
      router.push({ pathname: '/(app)/(auth)/note/[id]', params: { id: data?.id ?? '' } });
      Toast.show({
        type: 'success',
        text1: t('success'),
        autoHide: false,
        text2: 'asdfff asd aa s',
      });
    } catch {
      Toast.show({ type: 'error', text1: t('error') });
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
