import { useAuthContext } from '@/auth';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image, StyleSheet, View, Text, Button } from 'react-native';

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
        <Text>Welcome!</Text>
        <Button title="Sign out" onPress={signOut} />
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
