import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

const ProfileScreen = () => {
  return (
    <ParallaxScrollView
      renderHeader={<View className="bg-red-500 w-full h-40"></View>}
      backgroundImage={require('@/../assets/images/background.jpg')}
    >
      {Array.from({ length: 52 }).map((_id, idx) => (
        <Text key={idx}>asdf</Text>
      ))}
    </ParallaxScrollView>
  );
};

export default ProfileScreen;
