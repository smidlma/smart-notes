import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { EditorView } from '@/sections/editor/editor-view';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

const EditorScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <Button
            onPress={() =>
              router.push({ pathname: '/(app)/(auth)/note/modal', params: { id: id } })
            }
          >
            <Text>modal</Text>
          </Button>
        </View>
      ),
    });
  }, [id, navigation]);

  return <EditorView id={id as string} />;
};

export default EditorScreen;
