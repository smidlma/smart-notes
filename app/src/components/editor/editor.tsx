import { ColorKeyboard, CustomKeyboard, EditorBridge, RichText } from '@10play/tentap-editor';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { useRef, useState } from 'react';
import { EditorToolbar } from './editor-toolbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  editor: EditorBridge;
  noteId: string;
};

export const Editor = ({ editor, noteId }: Props) => {
  const { top } = useSafeAreaInsets();
  const headerHeight = 38;
  const keyboardVerticalOffset = headerHeight + top;

  const rootRef = useRef(null);

  const [activeKeyboard, setActiveKeyboard] = useState<string>();

  return (
    <SafeAreaView style={styles.fullScreen} ref={rootRef}>
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
          noteId={noteId}
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

      {/* <View className="gap-2 justify-end" style={{ ...StyleSheet.absoluteFillObject }}>
        <BlurView intensity={50} className="pb-8 pt-4 px-12">
          <Button>
            <Text>regenerate</Text>
          </Button>
        </BlurView>
      </View> */}
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
