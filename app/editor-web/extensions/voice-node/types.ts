// Generic media node props that can be reused for different media types
export interface MediaNodeProps {
  id: string;
  noteId: string;
  title: string;
  createdAt: string;
  mediaType: MediaType;
}

export enum MediaType {
  Voice = 'voice',
  File = 'file',
  // More types can be added later as needed
}

// Voice-specific props extending the generic MediaNodeProps
export interface VoiceNodeProps extends MediaNodeProps {
  mediaType: MediaType.Voice;
  duration: string;
  transcript: string;
}

// File-specific props extending the generic MediaNodeProps
export interface FileNodeProps extends MediaNodeProps {
  mediaType: MediaType.File;
  pages?: number;
}

export type VoiceEditorState = {};

export type VoiceEditorInstance = {
  setVoiceNode: (props: VoiceNodeProps) => void;
  // Generic method that could be added later
  // addMediaNode: (props: MediaNodeProps) => void;
};

export enum MediaEditorActionType {
  SetMedia = 'set-media',
  OpenMedia = 'open-media',
  // Keep backward compatibility
  SetVoice = 'set-voice',
  OpenVoice = 'open-voice',
}

export type AudioMessage =
  | {
      type: MediaEditorActionType.SetVoice;
      payload: VoiceNodeProps;
    }
  | {
      type: MediaEditorActionType.OpenVoice;
      payload: { voiceId: string; noteId: string };
    };

// Generic media message type for future use
export type MediaMessage =
  | {
      type: MediaEditorActionType.SetMedia;
      payload: MediaNodeProps;
    }
  | {
      type: MediaEditorActionType.OpenMedia;
      payload: { id: string; noteId: string; mediaType: MediaType; title?: string };
    }
  | AudioMessage; // Include the existing AudioMessage for backward compatibility
