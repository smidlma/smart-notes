import { useAuthContext } from '@/auth';
import { useLocales } from '@/locales';
import { router } from 'expo-router';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignInScreen = () => {
  const { signInGoogle } = useAuthContext();
  const { t } = useLocales();

  return (
    <SafeAreaView style={{ flex: 1, gap: 32 }}>
      <Text className="text-white">{t('app_name')}</Text>

      <Button
        title="asd"
        onPress={async () => {
          await signInGoogle();
          router.replace('/(app)/(home)');
        }}
      />
    </SafeAreaView>
  );
};

export default SignInScreen;
