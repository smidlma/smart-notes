import { uploadHandler } from '@/utils/upload';
import { EditorBridge, Images, Toolbar, useBridgeState, useKeyboard } from '@10play/tentap-editor';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../../../config-global';
import { ImageSchema } from '@/services/api';

enum ToolbarContext {
  Main,
  Link,
  Heading,
}

type Props = {
  editor: EditorBridge;
  activeKeyboard: string | undefined;
  setActiveKeyboard: (id: string | undefined) => void;
  noteId: string;
};

export const EditorToolbar = ({ activeKeyboard, editor, setActiveKeyboard: _, noteId }: Props) => {
  // Get updates of editor state
  const editorState = useBridgeState(editor);

  const { isKeyboardUp: isNativeKeyboardUp } = useKeyboard();
  const customKeyboardOpen = activeKeyboard !== undefined;
  const isKeyboardUp = isNativeKeyboardUp || customKeyboardOpen;

  // Here we make sure not to hide the keyboard if our custom keyboard is visible
  const hideToolbar = !isKeyboardUp || (!editorState.isFocused && !customKeyboardOpen);

  const handlePickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      try {
        const image = result.assets[0];
        const resp = await uploadHandler<ImageSchema>({
          fileUri: image.uri,
          type: 'image',
          pathParam: noteId,
        });

        const uri = `${API_BASE_URL}/storage/image/${resp?.file_name}`;

        editor.setImage(uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Toolbar
      editor={editor}
      hidden={hideToolbar}
      items={[
        {
          onPress:
            ({ editor }) =>
            () => {
              editor.blur();
            },
          image: () => Images.close,
          active: () => false,
          disabled: () => false,
        },
        {
          onPress:
            ({ editor }) =>
            async () => {
              editor.blur();
              await handlePickImage();
            },
          image: () => require('@/../assets/images/image-plus.png'),
          active: () => false,
          disabled: () => false,
        },
        {
          onPress:
            ({ setToolbarContext }) =>
            () =>
              setToolbarContext(ToolbarContext.Heading),
          active: () => false,
          disabled: ({ editorState }) => !editorState.canToggleHeading,
          image: () => Images.Aa,
        },
        {
          onPress:
            ({ editor }) =>
            () =>
              editor.toggleBold(),
          active: ({ editorState }) => editorState.isBoldActive,
          disabled: ({ editorState }) => !editorState.canToggleBold,
          image: () => Images.bold,
        },

        {
          onPress:
            ({ editor }) =>
            () =>
              editor.toggleBulletList(),
          active: ({ editorState }) => editorState.isBulletListActive,
          disabled: ({ editorState }) => !editorState.canToggleBulletList,
          image: () => Images.bulletList,
        },
        {
          onPress:
            ({ editor }) =>
            () =>
              editor.toggleTaskList(),
          active: ({ editorState }) => editorState.isTaskListActive,
          disabled: ({ editorState }) => !editorState.canToggleTaskList,
          image: () => Images.checkList,
        },

        {
          onPress:
            ({ editor }) =>
            () =>
              editor.toggleCode(),
          active: ({ editorState }) => editorState.isCodeActive,
          disabled: ({ editorState }) => !editorState.canToggleCode,
          image: () => Images.code,
        },

        {
          onPress:
            ({ editor }) =>
            () =>
              editor.toggleOrderedList(),
          active: ({ editorState }) => editorState.isOrderedListActive,
          disabled: ({ editorState }) => !editorState.canToggleOrderedList,
          image: () => Images.orderedList,
        },

        {
          // Regular list items (li) and task list items both use the
          // same sink command and button just with a different parameter, so we check both states here
          onPress:
            ({ editor, editorState }) =>
            () =>
              editorState.canSink ? editor.sink() : editor.sinkTaskListItem(),
          active: () => false,
          disabled: ({ editorState }) => !editorState.canSink && !editorState.canSinkTaskListItem,
          image: () => Images.indent,
        },
        {
          // Regular list items (li) and task list items both use the
          // same lift command and button just with a different parameter, so we check both states here
          onPress:
            ({ editor, editorState }) =>
            () =>
              editorState.canLift ? editor.lift() : editor.liftTaskListItem(),
          active: () => false,
          disabled: ({ editorState }) => !editorState.canLift && !editorState.canLiftTaskListItem,
          image: () => Images.outdent,
        },
        {
          onPress:
            ({ editor }) =>
            () =>
              editor.toggleStrike(),
          active: ({ editorState }) => editorState.isStrikeActive,
          disabled: ({ editorState }) => !editorState.canToggleStrike,
          image: () => Images.strikethrough,
        },
        {
          onPress:
            ({ editor }) =>
            () =>
              editor.toggleBlockquote(),
          active: ({ editorState }) => editorState.isBlockquoteActive,
          disabled: ({ editorState }) => !editorState.canToggleBlockquote,
          image: () => Images.quote,
        },
        {
          onPress:
            ({ editor }) =>
            () =>
              editor.toggleUnderline(),
          active: ({ editorState }) => editorState.isUnderlineActive,
          disabled: ({ editorState }) => !editorState.canToggleUnderline,
          image: () => Images.underline,
        },

        // ...DEFAULT_TOOLBAR_ITEMS,
      ]}
    />
  );
};
