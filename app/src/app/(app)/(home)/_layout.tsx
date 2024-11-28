import { useLocales } from '@/locales';
import { Stack } from 'expo-router';
import { MoonStar, Sun } from '@/lib/icons';
import { useColorScheme } from '@/lib/useColorScheme';
import { Pressable } from 'react-native';

export default function StackLayout() {
  const { t } = useLocales();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t('app_name'),
          headerRight: () => (
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
        name="test"
        options={{
          title: 'Welcome!',
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: 'grey',
          },
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
