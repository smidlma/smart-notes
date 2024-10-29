import { BridgeExtension } from '@10play/tentap-editor';
import ReactComponent from './extension';

type CounterEditorState = {};

type CounterEditorInstance = {
  setReact: (title: string) => void;
};

declare module '@10play/tentap-editor' {
  interface BridgeState extends CounterEditorState {}
  interface EditorBridge extends CounterEditorInstance {}
}

export enum AudioEditorActionType {
  SetAudio = 'set-audio',
}

type AudioMessage = {
  type: AudioEditorActionType.SetAudio;
  payload: string;
};

export const CounterBridge = new BridgeExtension<
  CounterEditorState,
  CounterEditorInstance,
  AudioMessage
>({
  tiptapExtension: ReactComponent.configure({}),
  onBridgeMessage: (editor, message) => {
    console.log('REACT', message);
    if (message.type === AudioEditorActionType.SetAudio) {
      editor
        .chain()
        .insertContentAt(editor.state.selection.head, { type: 'reactComponent' })
        .focus()
        .run();
    }

    return false;
  },
  onEditorMessage(message: any, _editorBridge) {
    if (message.type === 'increase') {
      console.log('message', message);
    }

    return true;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setReact: (title) => {
        console.log('title sending', title);

        sendBridgeMessage({
          type: AudioEditorActionType.SetAudio,
          payload: title,
        });
      },
    };
  },
  extendEditorState: () => {
    return {};
  },
});
