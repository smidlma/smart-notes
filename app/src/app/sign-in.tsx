import { useAuthContext } from '@/auth';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { useColorScheme } from '@/lib/useColorScheme';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native';

const SignInScreen = () => {
  const { signInGoogle } = useAuthContext();
  const { toggleColorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1, gap: 32 }} className="bg-background">
      <H1>Dashboard</H1>
      <H1 className="text-red-700">{isDarkColorScheme ? 'Dark' : 'Light'}</H1>
      <Button
        className="w-1/2 self-center"
        onPress={async () => {
          await signInGoogle();
          router.replace('/(app)/(auth)');
        }}
      >
        <Text>Sign in google</Text>
      </Button>

      <Button className="w-1/2 self-center" onPress={toggleColorScheme}>
        <Text>Toggle color scheme</Text>
      </Button>
    </SafeAreaView>
  );
};

export default SignInScreen;
