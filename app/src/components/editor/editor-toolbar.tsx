import { uploadHandler } from '@/utils/upload';
import {
  DEFAULT_TOOLBAR_ITEMS,
  EditorBridge,
  Images,
  Toolbar,
  useBridgeState,
  useKeyboard,
} from '@10play/tentap-editor';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../../../config-global';
import { ImageSchema } from '@/services/api';

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
        // {
        //   onPress: () => () => {
        //     const isActive = activeKeyboard === ColorKeyboard.id;
        //     if (isActive) editor.focus();
        //     setActiveKeyboard(isActive ? undefined : ColorKeyboard.id);
        //   },
        //   active: () => activeKeyboard === ColorKeyboard.id,
        //   disabled: () => false,
        //   image: () => Images.palette,
        // },
        ...DEFAULT_TOOLBAR_ITEMS,
      ]}
    />
  );
};
