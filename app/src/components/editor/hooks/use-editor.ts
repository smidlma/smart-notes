import {
  CoreBridge,
  darkEditorTheme,
  defaultEditorTheme,
  HeadingBridge,
  ImageBridge,
  PlaceholderBridge,
  TenTapStartKit,
  useEditorBridge,
  useEditorContent,
} from '@10play/tentap-editor';
import { useEditorConfig } from './use-editor-config';
import { editorHtml } from '../../../../editor-web/build/editorHtml';
import { VoiceBridge } from '../bridges/voice-bridge';
import { NAV_THEME } from '@/lib/constants';
import { useColorScheme } from '@/lib/useColorScheme';
import { useEffect } from 'react';

type Props = {
  initialContent?: string;
  onContentChange?: (content: string) => void;
};

export const useEditor = ({ initialContent, onContentChange }: Props) => {
  const { editorCSS } = useEditorConfig();
  const { colorScheme } = useColorScheme();

  const editor = useEditorBridge({
    initialContent,
    customSource: editorHtml,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(editorCSS).extendExtension({ content: 'heading block+' }),
      VoiceBridge,
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
              outline: 1px solid ${NAV_THEME[colorScheme].primary} !important;
              }`),
    ],

    theme: {
      ...(colorScheme === 'dark' ? { ...darkEditorTheme } : { ...defaultEditorTheme }),
      webview: {
        backgroundColor: NAV_THEME[colorScheme].background,
      },

      toolbar: {
        ...(colorScheme === 'dark'
          ? {
              ...darkEditorTheme.toolbar,
              toolbarBody: {
                // @ts-ignore
                ...darkEditorTheme.toolbar.toolbarBody,
                backgroundColor: NAV_THEME[colorScheme].background,
              },
              toolbarButton: {
                // @ts-ignore
                ...darkEditorTheme.toolbar.iconWrapper,
                backgroundColor: NAV_THEME[colorScheme].background,
              },
              icon: {
                // @ts-ignore
                ...darkEditorTheme.toolbar.icon,
                color: NAV_THEME[colorScheme].text,
              },
              iconWrapper: {
                // @ts-ignore
                ...darkEditorTheme.toolbar.iconWrapper,
                backgroundColor: NAV_THEME[colorScheme].background,
              },
              iconWrapperActive: {
                // @ts-ignore
                ...darkEditorTheme.toolbar.iconWrapperActive,
                backgroundColor: NAV_THEME[colorScheme].border,
              },
            }
          : { ...defaultEditorTheme.toolbar }),
      },
    },
    avoidIosKeyboard: true,
  });

  const content = useEditorContent(editor, { type: 'html', debounceInterval: 100 });

  useEffect(() => {
    if (content) {
      onContentChange?.(content);
    }
  }, [content]);

  return { editor };
};
