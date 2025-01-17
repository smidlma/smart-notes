import {
  ColorKeyboard,
  CoreBridge,
  CustomKeyboard,
  darkEditorTheme,
  defaultEditorTheme,
  HeadingBridge,
  ImageBridge,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  useEditorBridge,
  useEditorContent,
} from '@10play/tentap-editor';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useEditorConfig } from './hooks/use-editor-config';
import { CounterBridge } from './tiptap/counter-bridge';
import { EditorToolbar } from './editor-toolbar';
import { NAV_THEME } from '@/lib/constants';
import { useColorScheme } from '@/lib/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  initialContent?: string;
  onContentChange?: (content: string) => void;
};

export const Editor = ({ initialContent, onContentChange }: Props) => {
  const { top } = useSafeAreaInsets();
  const headerHeight = 38;
  const keyboardVerticalOffset = headerHeight + top;

  const { colorScheme } = useColorScheme();
  const { editorCSS } = useEditorConfig();

  const editor = useEditorBridge({
    initialContent,
    // customSource: editorHtml,
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
    theme: {
      ...(colorScheme === 'dark' ? { ...darkEditorTheme } : { ...defaultEditorTheme }),
      webview: {
        backgroundColor: NAV_THEME[colorScheme].background,
      },
    },
    avoidIosKeyboard: true,
  });

  const rootRef = useRef(null);

  const [activeKeyboard, setActiveKeyboard] = useState<string>();
  const content = useEditorContent(editor, { type: 'html', debounceInterval: 100 });

  useEffect(() => {
    if (content) {
      // console.log(JSON.stringify(content));

      onContentChange?.(content);
    }
  }, [content]);

  return (
    <SafeAreaView style={styles.fullScreen} ref={rootRef}>
      <View style={styles.fullScreen}>
        <RichText editor={editor} showsVerticalScrollIndicator={false} />
      </View>
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
    paddingHorizontal: 16,
  },
  keyboardAvoidingView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});
