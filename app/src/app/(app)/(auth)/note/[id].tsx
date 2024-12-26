import { EditorView } from '@/sections/editor/editor-view';
import { Pressable } from '@rn-primitives/slot';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { WandSparkles } from 'lucide-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';

const EditorScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <Pressable
            onPress={() =>
              router.push({ pathname: '/(app)/(auth)/note/summary', params: { id: id } })
            }
          >
            <WandSparkles />
          </Pressable>
        </View>
      ),
    });
  }, [id, navigation]);

  return <EditorView id={id as string} />;
};

export default EditorScreen;
