import { useAuthContext } from '@/auth';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H1, H4 } from '@/components/ui/typography';
import { useLocales } from '@/locales';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SignInView = () => {
  const { signInGoogle, loading } = useAuthContext();
  const { t } = useLocales();

  return (
    <ImageBackground
      source={require('@/../assets/images/signin_bg.webp')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={[
          'transparent',
          'rgba(26, 26, 46,0.8)',
          'rgba(26, 26, 46,0.9)',
          'rgba(26, 26, 46,0.98)',
          'rgba(26, 26, 46,1)',
        ]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View className="absolute top-56 left-0 right-0 bottom-0 justify-start items-center">
        <Image
          source={require('@/../assets/images/splash-icon.png')}
          style={{
            width: 150,
            height: 150,
          }}
        />
      </View>
      <SafeAreaView className="justify-center">
        <View className="flex-grow justify-center items-center">
          <H1 className="text-5xl text-gray-50">Smart Notes</H1>
          <H4 className="text-gray-200 text-center px-2">{t('sign_in_description')}</H4>
        </View>
        <View>
          <Button
            variant="outline"
            className="w-full mb-12 bg-transparent border-white"
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
                <Text className="text-white">{t('sign_in_google')}</Text>
              </View>
            )}
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
