import { ColorKeyboard, CustomKeyboard, RichText } from '@10play/tentap-editor';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { useRef, useState } from 'react';
import { EditorToolbar } from './editor-toolbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEditor } from './hooks/use-editor';

type Props = {
  initialContent?: string;
  onContentChange?: (content: string) => void;
};

export const Editor = ({ initialContent, onContentChange }: Props) => {
  const { top } = useSafeAreaInsets();
  const headerHeight = 38;
  const keyboardVerticalOffset = headerHeight + top;

  const { editor } = useEditor({ initialContent, onContentChange });

  const rootRef = useRef(null);

  const [activeKeyboard, setActiveKeyboard] = useState<string>();

  return (
    <SafeAreaView style={styles.fullScreen} ref={rootRef}>
      {/* <Button
          onPress={() =>
            editor.setVoiceNode({
              title: 'Voice message',
              duration: '00:20:00',
              createdAt: 'today',
              transcript: 'Hello from React Native',
            })
          }
        >
          <Text>Click</Text>
        </Button> */}
      <RichText
        editor={editor}
        showsVerticalScrollIndicator={false}
        containerStyle={{ paddingLeft: 16, paddingRight: 16 }}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <EditorToolbar
          editor={editor}
          activeKeyboard={activeKeyboard}
          setActiveKeyboard={setActiveKeyboard}
        />
        <CustomKeyboard
          rootRef={rootRef}
          activeKeyboardID={activeKeyboard}
          setActiveKeyboardID={setActiveKeyboard}
          keyboards={[ColorKeyboard]}
          editor={editor}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    paddingHorizontal: 12,
  },
  keyboardAvoidingView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});
