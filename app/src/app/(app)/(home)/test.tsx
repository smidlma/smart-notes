import { useAuthContext } from '@/auth';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { StyleSheet, View, Button, ScrollView } from 'react-native';

export default function TestScreen() {
  const { signOut } = useAuthContext();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.titleContainer}>
        <Text>Welcome!</Text>
        <Button title="Sign out" onPress={signOut} />
        <Link href="/modal">
          <Text>Open Modal</Text>
        </Link>
        <Link href={'/profile'}>
          <Text>Go to Profile</Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
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
