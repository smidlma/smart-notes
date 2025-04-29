import { BridgeExtension } from '@10play/tentap-editor';

import { router } from 'expo-router';
import {
  MediaEditorActionType,
  MediaMessage,
  MediaNodeProps,
  MediaType,
} from '../../../../editor-web/extensions/voice-node/types';
import { openPdfFile } from '@/utils/pdf';

// Define the editor state and instance interfaces
interface MediaEditorState {}

interface MediaEditorInstance {
  addMediaNode: (props: MediaNodeProps) => void;
}

declare module '@10play/tentap-editor' {
  interface BridgeState extends MediaEditorState {}
  interface EditorBridge extends MediaEditorInstance {}
}

export const MediaBridge = new BridgeExtension<MediaEditorState, MediaEditorInstance, MediaMessage>(
  {
    onEditorMessage(message: MediaMessage, editorBridge) {
      // Handle generic media opening
      if (message.type === MediaEditorActionType.OpenMedia) {
        const { id, noteId, mediaType, title } = message.payload;

        // Route to different screens based on media type
        switch (mediaType) {
          case MediaType.Voice:
            router.push({
              pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
              params: { voiceId: id, noteId },
            });
            break;
          case MediaType.File:
            openPdfFile(title!);
            break;
          default:
        }
        editorBridge.blur();

        return true;
      }

      return false;
    },

    extendEditorInstance: (sendBridgeMessage) => {
      return {
        // Generic method to add any media type
        addMediaNode: (props: MediaNodeProps) => {
          sendBridgeMessage({
            type: MediaEditorActionType.SetMedia,
            payload: props,
          });
        },
      };
    },

    extendEditorState: () => {
      return {};
    },
  }
);
