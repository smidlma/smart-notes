import { useAuthContext } from '@/auth';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { Image, Text, View } from 'react-native';

export default function SignIn() {
  const { signInGoogle } = useAuthContext();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image source={require('@/../assets/images/partial-react-logo.png')} />}
    >
      <View>
        <Text style={{ color: '#fff' }}>Welcome!</Text>

        <GoogleSigninButton
          onPress={async () => {
            await signInGoogle();
            router.replace('/(tabs)');
          }}
        />
      </View>
    </ParallaxScrollView>
  );
}
