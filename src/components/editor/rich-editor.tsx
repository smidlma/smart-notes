import {
  ColorKeyboard,
  CoreBridge,
  CustomKeyboard,
  darkEditorCss,
  darkEditorTheme,
  DEFAULT_TOOLBAR_ITEMS,
  EditorBridge,
  Images,
  RichText,
  TenTapStartKit,
  Toolbar,
  useBridgeState,
  useEditorBridge,
  useKeyboard,
} from '@10play/tentap-editor';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { CounterBridge } from '../../tiptap/counter-bridge';
import { editorHtml } from '@/../editor-web/build/editorHtml';
import { useRef, useState } from 'react';

const Counter = ({ editor }: { editor: EditorBridge }) => {
  const state = useBridgeState(editor);

  return (
    <View>
      <Text>
        {state.wordCount} || {state.characterCount}
      </Text>
    </View>
  );
};

const baseEditorCSS = `
 * {
    font-family: sans-serif;
  }
   body {
    background-color: '#fff';
  }
  img {
    max-width: 80%;
    height: auto;
    padding: 0 10%;
  }
`;

const editorCSS = `${baseEditorCSS} ${darkEditorCss}`;

export const Advanced = () => {
  const editor = useEditorBridge({
    customSource: editorHtml,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(editorCSS).extendExtension({ content: 'heading block+' }),
      CounterBridge,
    ],
    theme: darkEditorTheme,
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: '<p>Advanced Editor</p> <react-component></react-component> <p>Story</p>',
  });

  const rootRef = useRef(null);

  const [activeKeyboard, setActiveKeyboard] = useState<string>();

  return (
    <SafeAreaView style={exampleStyles.fullScreen} ref={rootRef}>
      <Button onPress={() => editor.setImage('https://picsum.photos/200')}>Set Image</Button>
      <Button onPress={() => editor.blur()}>Blur/ Hide keyboard</Button>
      <Counter editor={editor} />
      <RichText editor={editor} containerStyle={{ paddingLeft: 24 }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={exampleStyles.keyboardAvoidingView}
      >
        <ToolbarWithColor
          editor={editor}
          activeKeyboard={activeKeyboard}
          setActiveKeyboard={setActiveKeyboard}
        />
        <CustomKeyboard
          rootRef={rootRef}
          activeKeyboardID={activeKeyboard}
          setActiveKeyboardID={setActiveKeyboard}
          keyboards={[ColorKeyboard]} // <-- here we add the color keyboard
          editor={editor}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const exampleStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  keyboardAvoidingView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});

interface ToolbarWithColorProps {
  editor: EditorBridge;
  activeKeyboard: string | undefined;
  setActiveKeyboard: (id: string | undefined) => void;
}
const ToolbarWithColor = ({ editor, activeKeyboard, setActiveKeyboard }: ToolbarWithColorProps) => {
  // Get updates of editor state
  const editorState = useBridgeState(editor);

  const { isKeyboardUp: isNativeKeyboardUp } = useKeyboard();
  const customKeyboardOpen = activeKeyboard !== undefined;
  const isKeyboardUp = isNativeKeyboardUp || customKeyboardOpen;

  // Here we make sure not to hide the keyboard if our custom keyboard is visible
  const hideToolbar = !isKeyboardUp || (!editorState.isFocused && !customKeyboardOpen);

  return (
    <Toolbar
      editor={editor}
      hidden={hideToolbar}
      items={[
        {
          onPress: () => () => {
            const isActive = activeKeyboard === ColorKeyboard.id;
            if (isActive) editor.focus();
            setActiveKeyboard(isActive ? undefined : ColorKeyboard.id);
          },
          active: () => activeKeyboard === ColorKeyboard.id,
          disabled: () => false,
          image: () => Images.palette,
        },
        ...DEFAULT_TOOLBAR_ITEMS,
      ]}
    />
  );
};
