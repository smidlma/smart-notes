import { useAuthContext } from '@/auth';
import { ParallaxScrollView } from '@/components/parallax-scroll-view';
import { Button } from '@/components/ui/button';
import { H1, H4 } from '@/components/ui/typography';
import { useLocales } from '@/locales';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

export const SignInView = () => {
  const { signInGoogle, loading } = useAuthContext();
  const { t } = useLocales();

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={require('@/../assets/images/signin_bg.webp')}
          style={{ height: '100%', width: '100%', bottom: 0, left: 0, position: 'absolute' }}
        />
      }
    >
      <View className="bg-background flex-grow">
        <View className="items-center pt-10 gap-4 flex-grow">
          <H1>SmartNotes</H1>
          <H4 className="text-muted-foreground text-center px-2 ">{t('sign_in_description')}</H4>
        </View>
        <View className="pb-20">
          <Button
            className="self-center w-10/12"
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
      </View>
    </ParallaxScrollView>
  );
};
