import { useAuthContext } from '@/auth';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Link } from 'expo-router';
import { Image, StyleSheet, View, Button } from 'react-native';
import { Text } from 'react-native-paper';

export default function HomeScreen() {
  const { signOut } = useAuthContext();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/../assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.titleContainer}>
        <Text variant="headlineLarge">Welcome!</Text>
        <Button title="Sign out" onPress={signOut} />
        <Link href="/modal">
          <Text>Open Modal</Text>
        </Link>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    // flexDirection: 'colk',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
