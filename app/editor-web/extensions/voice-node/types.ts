export type VoiceNodeProps = {
  title: string;
  duration: string;
  createdAt: string;
  transcript: string;
};

export type VoiceEditorState = {};

export type VoiceEditorInstance = {
  setVoiceNode: (title: VoiceNodeProps) => void;
};

export enum AudioEditorActionType {
  SetVoice = 'set-voice',
  OpenVoice = 'open-voice',
}

export type AudioMessage =
  | {
      type: AudioEditorActionType.SetVoice;
      payload: VoiceNodeProps;
    }
  | {
      type: AudioEditorActionType.OpenVoice;
      payload: {};
    };
