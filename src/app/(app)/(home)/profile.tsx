import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Text } from '@/components/ui/text';
import { Image, StyleSheet, View } from 'react-native';

const ProfileScreen = () => {
  return (
    <ParallaxScrollView
      renderHeader={<View className="bg-red-500 w-full h-60"></View>}
      backgroundImage={
        <Image
          source={require('@/../assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      {Array.from({ length: 52 }).map((_id, idx) => (
        <Text key={idx}>asdf</Text>
      ))}
    </ParallaxScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
