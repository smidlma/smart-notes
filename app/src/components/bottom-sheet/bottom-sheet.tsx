import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import { NAV_THEME } from '@/lib/constants';
import { useColorScheme } from '@/lib/useColorScheme';
import { StyleSheet } from 'react-native';

export type BottomSheetRef = {
  open: () => void;
  close: () => void;
};

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetModalProps>(
  ({ children, backgroundStyle, handleIndicatorStyle, ...props }: BottomSheetModalProps, ref) => {
    const { colorScheme } = useColorScheme();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // Expose open/close methods via the ref
    useImperativeHandle(ref, () => ({
      open: () => bottomSheetModalRef.current?.present(),
      close: () => bottomSheetModalRef.current?.dismiss(),
    }));

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        style={[styles.sheetShadow, props.style]}
        backgroundStyle={[{ backgroundColor: NAV_THEME[colorScheme].card }, backgroundStyle]}
        handleIndicatorStyle={[
          { backgroundColor: NAV_THEME[colorScheme].primary },
          handleIndicatorStyle,
        ]}
        {...props}
      >
        {children}
      </BottomSheetModal>
    );
  }
);

// Assign displayName for better debugging
BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  sheetShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
