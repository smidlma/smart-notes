import { useAuthContext } from '@/auth';
import { useLocales } from '@/locales';
import { useAppTheme } from '@/theme/theme-context';
import { router } from 'expo-router';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
  const { signInGoogle } = useAuthContext();
  const { toggleTheme, theme } = useAppTheme();
  const { t } = useLocales();

  return (
    <SafeAreaView style={{ flex: 1, gap: 32 }}>
      <Text variant="headlineLarge">{t('app_name')}</Text>
      <Button mode="outlined" onPress={toggleTheme}>
        Change theme
      </Button>

      <Button
        buttonColor={theme.colors.primary}
        onPress={async () => {
          await signInGoogle();
          router.replace('/(tabs)');
        }}
        mode="contained"
      >
        Sign with Google
      </Button>
    </SafeAreaView>
  );
}
