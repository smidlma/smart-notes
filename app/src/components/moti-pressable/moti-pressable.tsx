import { MotiPressable as Pressable, MotiPressableProps } from 'moti/interactions';
import { useMemo } from 'react';

export const MotiPressable = ({ onPress, ...props }: MotiPressableProps) => {
  return (
    <Pressable
      {...props}
      // style={[{ ...(props.disabled && { opacity: 0.5 }) }, props.style]}
      onPress={onPress}
      animate={useMemo(
        () =>
          ({ hovered, pressed }) => {
            'worklet';

            return {
              opacity: hovered || pressed ? 0.5 : 1,
            };
          },
        []
      )}
    />
  );
};
