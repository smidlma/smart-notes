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
import { useCallback, useEffect } from 'react';
import {
  useReadNoteApiNotesNoteIdGetQuery,
  useUpdateNoteApiNotesNoteIdPatchMutation,
} from '@/services/api';
import { VoiceNodeProps } from '../../../../editor-web/extensions/voice-node/types';

type Props = {
  noteId: string;
};

export const useEditor = ({ noteId }: Props) => {
  const { data, status, isLoading } = useReadNoteApiNotesNoteIdGetQuery({ noteId });
  const [updateNote] = useUpdateNoteApiNotesNoteIdPatchMutation();

  const { editorCSS } = useEditorConfig();
  const { colorScheme } = useColorScheme();

  const editor = useEditorBridge({
    initialContent: data?.content,
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
      ImageBridge.configureCSS(
        `.ProseMirror-selectednode {
              outline: 1px solid ${NAV_THEME[colorScheme].primary} !important;
              }
              img{
                width: 280px;
                display: block;
                margin-left: auto;
                margin-right: auto;
              }`
      ),
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
    const updateNoteContent = async () => {
      if (content) {
        await updateNote({ noteId, noteUpdate: { content } }).unwrap();
      }
    };

    updateNoteContent();
  }, [content, noteId, updateNote]);

  const handleAttachVoice = useCallback(
    ({
      voiceId,
      createdAt,
      duration,
      title,
      transcript = '',
      noteId,
    }: Omit<VoiceNodeProps, 'transcript'> & { transcript?: string }) => {
      editor.setVoiceNode({ voiceId, createdAt, duration, title, transcript, noteId });
      editor.blur();
    },
    [editor]
  );

  return { editor, status, isLoading, handleAttachVoice };
};
