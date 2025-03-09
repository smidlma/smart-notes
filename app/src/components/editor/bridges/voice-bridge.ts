import { BridgeExtension } from '@10play/tentap-editor';
import {
  MediaEditorActionType,
  AudioMessage,
  VoiceEditorInstance,
  VoiceEditorState,
  VoiceNodeProps,
} from '@/../editor-web/extensions/voice-node/types';
import { router } from 'expo-router';

// This bridge is kept for backward compatibility
// New code should use the MediaBridge instead

declare module '@10play/tentap-editor' {
  interface BridgeState extends VoiceEditorState {}
  interface EditorBridge extends VoiceEditorInstance {}
}

export const VoiceBridge = new BridgeExtension<VoiceEditorState, VoiceEditorInstance, AudioMessage>(
  {
    onEditorMessage(message: AudioMessage, _editorBridge) {
      // Handle legacy voice messages
      if (message.type === MediaEditorActionType.OpenVoice) {
        router.push({
          pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
          params: { voiceId: message.payload.voiceId, noteId: message.payload.noteId },
        });

        return true;
      }

      return false;
    },
    extendEditorInstance: (sendBridgeMessage) => {
      return {
        setVoiceNode: (props: VoiceNodeProps) => {
          sendBridgeMessage({
            type: MediaEditorActionType.SetVoice,
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
