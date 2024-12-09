import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Basic = () => {
  const { top } = useSafeAreaInsets();
  const keyboardVerticalOffset = 44 + top;

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent,
  });

  return (
    <SafeAreaView style={exampleStyles.fullScreen}>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={exampleStyles.keyboardAvoidingView}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <Toolbar editor={editor} />
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

const initialContent = `<p>This is a basic example!</p>`;
