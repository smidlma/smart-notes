import React, { type PropsWithChildren, type ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './ui/button';
import { Text } from './ui/text';

const HEADER_HEIGHT = 350;
const TABS_HEIGHT = 100;

type Props = PropsWithChildren<{
  backgroundImage: ReactElement;
  renderHeader: ReactElement;
}>;

export default function ParallaxScrollView({ children, backgroundImage, renderHeader }: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const insets = useSafeAreaInsets();

  const headerContentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [0, HEADER_HEIGHT],
          [0, -HEADER_HEIGHT],
          'clamp'
        ),
      },
    ],
    opacity: interpolate(scrollOffset.value, [0, HEADER_HEIGHT / 2, HEADER_HEIGHT], [1, 0, 0]),
  }));

  const scrollAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [0, HEADER_HEIGHT],
          [0, -HEADER_HEIGHT + insets.top + TABS_HEIGHT],
          { extrapolateRight: Extrapolation.CLAMP }
        ),
      },
    ],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scrollOffset.value, [0, HEADER_HEIGHT], [1.5, 1], {
          extrapolateRight: Extrapolation.CLAMP,
        }),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <View
        style={[{ height: HEADER_HEIGHT, justifyContent: 'center', alignItems: 'center' }]}
        onLayout={(event) => console.log(event.nativeEvent.layout)}
      >
        <Animated.View
          style={[
            { position: 'absolute', top: 0, left: 0, height: HEADER_HEIGHT, width: '100%' },
            imageAnimatedStyle,
          ]}
        >
          <Image
            source={backgroundImage}
            style={[
              {
                flex: 1,
              },
              imageAnimatedStyle,
            ]}
            contentFit="cover"
          />
          {/* <LinearGradient
            colors={['transparent', 'transparent', 'white']}
            style={{ width: '100%', height: 50 }}
          /> */}
        </Animated.View>
        <Animated.View
          style={[
            { paddingTop: insets.top, height: 'auto', width: '100%' },
            headerContentAnimatedStyle,
          ]}
        >
          {renderHeader}
        </Animated.View>
        <Animated.View
          className="flex-row gap-2 absolute left-2 bottom-3"
          style={[scrollAnimatedStyle]}
        >
          <Button>
            <Text>Tab 1</Text>
          </Button>
          <Button>
            <Text>Tab 2</Text>
          </Button>
        </Animated.View>
      </View>

      <Animated.View style={[scrollAnimatedStyle]}>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>{children}</View>
        </Animated.ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    backgroundColor: 'white',
  },
});
