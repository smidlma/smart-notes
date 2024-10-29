import {
  ColorKeyboard,
  CoreBridge,
  CustomKeyboard,
  darkEditorCss,
  darkEditorTheme,
  DEFAULT_TOOLBAR_ITEMS,
  EditorBridge,
  HeadingBridge,
  ImageBridge,
  Images,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useBridgeState,
  useEditorBridge,
  useKeyboard,
} from '@10play/tentap-editor';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { CounterBridge } from '../../tiptap/counter-bridge';
import { editorHtml } from '@/../editor-web/build/editorHtml';
import { useRef, useState } from 'react';

const baseEditorCSS = `
   * {
      font-family: sans-serif;
    }
     body {
      background-color: '#fff';
      padding-right: 80px !important;
      padding-left: 24px !important;
  
    }
    img {
      margin-left: auto;
      margin-right: auto;
      height: auto;
      padding: 0 10%;
      display: block;
    }
    react-component .ProseMirror-selectednode {
      outline: 3px solid #45FF !important;
    }
  
    img .ProseMirror-selectednode  {
      outline: 3px solid red !important;
      background-color: red;
    }
  `;

const editorCSS = `${baseEditorCSS} ${darkEditorCss}`;

export const MultiEditor = () => {
  const editor = useEditorBridge({
    customSource: editorHtml,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(editorCSS).extendExtension({ content: 'heading block+' }),
      CounterBridge,
      PlaceholderBridge.configureExtension({
        showOnlyCurrent: false,
        placeholder: 'Enter a Title',
      }),
      HeadingBridge.configureCSS(`
          .ProseMirror h1.is-empty::before {
            content: attr(data-placeholder);
            float: left;
            color: #ced4da;
            pointer-events: none;
            height: 0;
          }
          `),
      ImageBridge.configureCSS(`.ProseMirror-selectednode {
            outline: 1px solid red !important;
            }`),
    ],
    theme: darkEditorTheme,

    avoidIosKeyboard: true,
  });

  const rootRef = useRef(null);

  const [activeKeyboard, setActiveKeyboard] = useState<string>();

  return (
    <SafeAreaView style={exampleStyles.fullScreen} ref={rootRef}>
      {/* <ScrollView keyboardDismissMode="interactive" style={exampleStyles.fullScreen} ref={rootRef}> */}
      <RichText editor={editor} />
      <View style={{ width: '100%', height: 120, backgroundColor: '#78CD' }}>
        <Button onPress={() => editor.setReact('React component')}>Set react component</Button>
      </View>
      {/* <RichText editor={editor} /> */}
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
        // {
        //   onPress:
        //     ({ editor }) =>
        //     () => {
        //       editor.blur();
        //     },
        //   image: () => Images.close,
        //   active: () => false,
        //   disabled: () => false,
        // },
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
