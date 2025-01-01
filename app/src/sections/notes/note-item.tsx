import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeleteNoteApiNotesNoteIdDeleteMutation } from '@/services/api';
import { fDate } from '@/utils/format-time';
import { t } from 'i18next';
import React from 'react';
import { useRef } from 'react';
import { Pressable } from 'react-native-gesture-handler';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { FadeOut, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Trash2 } from '@/lib/icons';
import Animated from 'react-native-reanimated';
import {
  ActionConfirmationRef,
  ConfirmationSheet,
} from '@/components/confirmation-sheet/confirmation-sheet';
type Props = {
  id: string;
  title: string;
  description?: string;
  date: string | Date;
  onPress: VoidFunction;
};

export const NoteItem = ({ id, title, date, description, onPress }: Props) => {
  const [deleteNote] = useDeleteNoteApiNotesNoteIdDeleteMutation();

  const actionConfirmationRef = useRef<ActionConfirmationRef>(null);
  const swipeableRef = useRef<SwipeableMethods>(null);

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

  return (
    <Animated.View exiting={FadeOut}>
      <Card className="overflow-hidden">
        <ReanimatedSwipeable
          ref={swipeableRef}
          friction={2}
          enableTrackpadTwoFingerGesture
          rightThreshold={40}
          overshootRight={false}
          renderRightActions={(_prog, drag) => (
            <RightAction
              drag={drag}
              onPress={() => actionConfirmationRef.current?.open()}
              titleKey="delete"
            />
          )}
        >
          <Pressable onPress={onPress}>
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
    </Animated.View>
  );
};

type ActionProps = {
  drag: SharedValue<number>;
  titleKey: string;
  onPress: VoidFunction;
  defaultWidth?: number;
  defaultOffset?: number;
};
const RightAction = ({
  drag,
  onPress,

  defaultWidth = 64,
  defaultOffset = 0,
}: ActionProps) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + defaultWidth - defaultOffset }],
    };
  });

  return (
    <Reanimated.View
      style={[styleAnimation]}
      className="bg-destructive justify-center rounded-r-2xl"
    >
      <Pressable onPress={onPress}>
        <Trash2 width={defaultWidth} height={28} className="text-primary" />
      </Pressable>
    </Reanimated.View>
  );
};
