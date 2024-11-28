import {
  ColorKeyboard,
  CoreBridge,
  CustomKeyboard,
  darkEditorTheme,
  HeadingBridge,
  ImageBridge,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  useEditorBridge,
} from '@10play/tentap-editor';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { editorHtml } from '@/../editor-web/build/editorHtml';
import { useRef, useState } from 'react';
import { EditorToolbar } from './editor-toolbar';
import { useEditorConfig } from './hooks/use-editor-config';
import { CounterBridge } from './tiptap/counter-bridge';

export const Editor = () => {
  const { editorCSS } = useEditorConfig();

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



    <SafeAreaView style={styles.fullScreen} ref={rootRef}>
      <RichText editor={editor} />
      <View style={{ width: '100%', height: 120, backgroundColor: '#78CD' }}>
        <Button onPress={() => editor.setReact('React component')}>Set react component</Button>
      </View>
      <KeyboardAvoidingView
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
  },
  keyboardAvoidingView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});
