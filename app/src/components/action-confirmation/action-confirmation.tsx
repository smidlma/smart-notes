import React, { forwardRef, useImperativeHandle, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { useLocales } from '@/locales';
import { H3 } from '../ui/typography';
import { NAV_THEME } from '@/lib/constants';
import { useColorScheme } from '@/lib/useColorScheme';

type Props = {
  title: string;
  description?: string;
  onConfirm: VoidFunction;
  onCancel: VoidFunction;
};

export type ActionConfirmationRef = {
  open: () => void;
  close: () => void;
};

export const ActionConfirmation = forwardRef<ActionConfirmationRef, Props>(
  ({ title, description, onConfirm, onCancel }: Props, ref) => {
    const { t } = useLocales();
    const { colorScheme } = useColorScheme();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // Expose open/close methods via the ref
    useImperativeHandle(ref, () => ({
      open: () => bottomSheetModalRef.current?.present(),
      close: () => bottomSheetModalRef.current?.dismiss(),
    }));

    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) {
        onCancel();
      }
    }, []);

    return (
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: NAV_THEME[colorScheme].card }}
          handleIndicatorStyle={{ backgroundColor: NAV_THEME[colorScheme].primary }}
        >
          <BottomSheetView className="min-h-72 px-4 bg-card">
            <H3>{title}</H3>
            <Text>{description}</Text>
            <View className="flex-grow" />
            <View className="gap-4 pb-14">
              <Button variant="destructive" onPress={onConfirm}>
                <Text>{t('confirm')}</Text>
              </Button>
              {onCancel && (
                <Button onPress={onCancel}>
                  <Text>{t('cancel')}</Text>
                </Button>
              )}
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    );
  }
);

// Assign displayName for better debugging
ActionConfirmation.displayName = 'ActionConfirmation';
