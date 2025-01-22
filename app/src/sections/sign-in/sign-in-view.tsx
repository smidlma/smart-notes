import { useAuthContext } from '@/auth';
import { Button } from '@/components/ui/button';
import { H1 } from '@/components/ui/typography';
import { useLocales } from '@/locales';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SignInView = () => {
  const { signInGoogle, loading } = useAuthContext();
  const { t } = useLocales();

  return (
    <SafeAreaView style={{ flex: 1, gap: 32 }} className="bg-background">
      <View className="flex-grow items-center justify-center">
        <H1>Welcome</H1>
      </View>

      <View className="pb-12">
        <Button
          className="w-2/3 self-center"
          onPress={async () => {
            await signInGoogle();
            router.replace('/(app)/(auth)');
          }}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <View className="flex-row items-center gap-3">
              <Image
                source={require('@/../assets/images/google-icon.png')}
                style={{ width: 24, height: 24 }}
              />
              <Text>{t('sign_in_google')}</Text>
            </View>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};
