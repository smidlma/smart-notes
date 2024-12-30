import { useLocales } from '@/locales';
import { router, Stack } from 'expo-router';
import { useColorScheme } from '@/lib/useColorScheme';
import { Pressable, View } from 'react-native';
import { useCreateNoteApiNotesPostMutation } from '@/services/api';
import { NotebookPen, Sun, MoonStar, LogOut } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useAuthContext } from '@/auth';

export default function StackLayout() {
  const { signOut } = useAuthContext();
  const { t } = useLocales();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  const [createNote] = useCreateNoteApiNotesPostMutation();

  const handleCreatePress = async () => {
    try {
      const { data } = await createNote({ noteCreate: { title: t('new_note') } });
      router.push({ pathname: '/(app)/(auth)/note/[id]', params: { id: data?.id ?? '' } });
    } catch {
      Toast.show({ type: 'error', text1: t('create_note_error') });
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Pressable onPress={signOut}>
                <LogOut />
              </Pressable>
              <Pressable onPress={toggleColorScheme}>
                {isDarkColorScheme ? <Sun /> : <MoonStar />}
              </Pressable>
            </View>
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
        name="note/summary"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
