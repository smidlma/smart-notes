import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeleteNoteApiNotesNoteIdDeleteMutation } from '@/services/api';
import { fDate } from '@/utils/format-time';
import { t } from 'i18next';
import React, { useCallback } from 'react';
import { useRef } from 'react';
import { Pressable } from 'react-native-gesture-handler';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { FadeOut, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Share, Trash2 } from '@/lib/icons';
import {
  ActionConfirmationRef,
  ConfirmationSheet,
} from '@/components/confirmation-sheet/confirmation-sheet';
import { View } from 'react-native';
import { sharePdfFile } from '@/utils/share';
type Props = {
  id: string;
  title: string;
  description?: string;
  date: string | Date;
  content: string;
  onPress: (id: string) => void;
};

export const NoteItem = ({ id, title, date, description, content, onPress }: Props) => {
  const [deleteNote] = useDeleteNoteApiNotesNoteIdDeleteMutation();

  const actionConfirmationRef = useRef<ActionConfirmationRef>(null);
  const swipeableRef = useRef<SwipeableMethods>(null);

  const handleOpenNote = () => {
    onPress(id);
  };

  const handleDeleteNote = () => {
    try {
      deleteNote({ noteId: id }).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    actionConfirmationRef.current?.close();
    swipeableRef.current?.close();
  };

  const handleSharePdf = useCallback(async () => {
    await sharePdfFile(content, title);
    swipeableRef.current?.close();
  }, [content, title]);

  const renderSwipeableAction = useCallback(
    (progressAnimatedValue: SharedValue<number>, dragAnimatedValue: SharedValue<number>) => {
      return (
        <Reanimated.View className="flex-row">
          <RightAction
            drag={dragAnimatedValue}
            onDelete={actionConfirmationRef.current?.open}
            onShare={handleSharePdf}
            titleKey="delete"
          />
        </Reanimated.View>
      );
    },
    [handleSharePdf]
  );

  return (
    <Reanimated.View exiting={FadeOut}>
      <Card className="overflow-hidden">
        <ReanimatedSwipeable
          ref={swipeableRef}
          friction={2}
          enableTrackpadTwoFingerGesture
          rightThreshold={40}
          overshootRight={false}
          renderRightActions={renderSwipeableAction}
        >
          <Pressable onPress={handleOpenNote}>
            <CardHeader className="py-3">
              <CardTitle className="text-lg" numberOfLines={1}>
                {title}
              </CardTitle>
              <CardDescription
                numberOfLines={1}
                className="max-w-64"
              >{`${fDate(date)} ${description}`}</CardDescription>
            </CardHeader>
          </Pressable>
        </ReanimatedSwipeable>
      </Card>
      <ConfirmationSheet
        ref={actionConfirmationRef}
        title={t('delete_note', { name: title })}
        description={t('delete_note_description')}
        onConfirm={handleDeleteNote}
        onCancel={handleCancel}
      />
    </Reanimated.View>
  );
};

type ActionProps = {
  drag: SharedValue<number>;
  titleKey: string;
  onDelete?: VoidFunction;
  onShare: VoidFunction;
  defaultWidth?: number;
  defaultOffset?: number;
};
const RightAction = ({
  drag,
  onDelete,
  onShare,
  defaultWidth = 64,
  defaultOffset = 0,
}: ActionProps) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + defaultWidth * 2 - defaultOffset }],
    };
  });

  return (
    <Reanimated.View
      style={[styleAnimation]}
      className="justify-center items-center rounded-r-2xl flex-row"
    >
      <View className="bg-background h-full items-center justify-center">
        <Pressable onPress={onShare}>
          <Share width={defaultWidth} height={28} className="text-primary" />
        </Pressable>
      </View>
      <View className="bg-destructive h-full items-center justify-center">
        <Pressable onPress={onDelete}>
          <Trash2 width={defaultWidth} height={28} className="text-primary " />
        </Pressable>
      </View>
    </Reanimated.View>
  );
};
