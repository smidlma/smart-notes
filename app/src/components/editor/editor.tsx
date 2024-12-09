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
  useEditorContent,
} from '@10play/tentap-editor';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { editorHtml } from '@/../editor-web/build/editorHtml';
import { useEffect, useRef, useState } from 'react';
import { useEditorConfig } from './hooks/use-editor-config';
import { CounterBridge } from './tiptap/counter-bridge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EditorToolbar } from './editor-toolbar';

type Props = {
  initialContent?: string;
  onContentChange?: (content: string) => void;
};

export const Editor = ({ initialContent, onContentChange }: Props) => {
  const { editorCSS } = useEditorConfig();

  const { top } = useSafeAreaInsets();
  const keyboardVerticalOffset = 44 + top;

  const editor = useEditorBridge({
    initialContent,
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
  const content = useEditorContent(editor, { type: 'html', debounceInterval: 1000 });

  useEffect(() => {
    if (content) {
      onContentChange?.(content);
    }
  }, [content, onContentChange]);

  return (
    <SafeAreaView style={styles.fullScreen} ref={rootRef}>
      <View style={styles.fullScreen}>
        <RichText editor={editor} />
      </View>
      {/* <View style={{ width: '100%', height: 120, backgroundColor: '#78CD' }}>
        <Button onPress={() => editor.setReact('React component')}>
          <Text>Set react component</Text>
        </Button>
      </View> */}
      <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* <Toolbar editor={editor} /> */}
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
