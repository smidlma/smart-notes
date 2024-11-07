import {
  ColorKeyboard,
  DEFAULT_TOOLBAR_ITEMS,
  EditorBridge,
  Images,
  Toolbar,
  useBridgeState,
  useKeyboard,
} from '@10play/tentap-editor';

type Props = {
  editor: EditorBridge;
  activeKeyboard: string | undefined;
  setActiveKeyboard: (id: string | undefined) => void;
};

export const EditorToolbar = ({ activeKeyboard, editor, setActiveKeyboard }: Props) => {
  // Get updates of editor state
  const editorState = useBridgeState(editor);

  const { isKeyboardUp: isNativeKeyboardUp } = useKeyboard();
  const customKeyboardOpen = activeKeyboard !== undefined;
  const isKeyboardUp = isNativeKeyboardUp || customKeyboardOpen;

  // Here we make sure not to hide the keyboard if our custom keyboard is visible
  const hideToolbar = !isKeyboardUp || (!editorState.isFocused && !customKeyboardOpen);

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
          onPress: () => () => {
            const isActive = activeKeyboard === ColorKeyboard.id;
            if (isActive) editor.focus();
            setActiveKeyboard(isActive ? undefined : ColorKeyboard.id);
          },
          active: () => activeKeyboard === ColorKeyboard.id,
          disabled: () => false,
          image: () => Images.palette,
        },
        ...DEFAULT_TOOLBAR_ITEMS,
      ]}
    />
  );
};
