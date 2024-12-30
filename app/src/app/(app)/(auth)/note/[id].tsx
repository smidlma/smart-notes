import { EditorView } from '@/sections/editor/editor-view';
import { Pressable } from '@rn-primitives/slot';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { AudioLines, WandSparkles } from 'lucide-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';

const EditorScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row gap-4">
          <Pressable
            onPress={() =>
              router.push({ pathname: '/(app)/(auth)/note/summary', params: { id: id } })
            }
          >
            <WandSparkles />
          </Pressable>
          <Pressable
            onPress={() =>
              router.push({ pathname: '/(app)/(auth)/note/voice', params: { id: id } })
            }
          >
            <AudioLines />
          </Pressable>
        </View>
      ),
    });
  }, [id, navigation]);

  return <EditorView id={id as string} />;
};

export default EditorScreen;
