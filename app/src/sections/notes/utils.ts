import {
  DocumentSearchResponse,
  NoteSchema,
  NoteSearchResponse,
  VoiceSearchResponse,
} from '@/services/api';
import { isAfter, isBefore, startOfToday, subDays } from 'date-fns';
import i18next from 'i18next';

export const getTodayNotes = (notes?: NoteSchema[]) => {
  if (!notes) return [];

  const today = startOfToday();

  return notes.filter((note) => isAfter(new Date(note?.updated_at ?? ''), today));
};

export const getLast7DaysNotes = (notes?: NoteSchema[]) => {
  if (!notes) return [];

  const today = startOfToday();
  const sevenDaysAgo = subDays(today, 7);

  return notes.filter(
    (note) =>
      isAfter(new Date(note?.updated_at ?? ''), sevenDaysAgo) &&
      isBefore(new Date(note?.updated_at ?? ''), today)
  );
};

export const getLast30DaysNotes = (notes?: NoteSchema[]) => {
  if (!notes) return [];

  const today = startOfToday();
  const sevenDaysAgo = subDays(today, 7);
  const thirtyDaysAgo = subDays(today, 30);

  return notes.filter(
    (note) =>
      isAfter(new Date(note?.updated_at ?? ''), thirtyDaysAgo) &&
      isBefore(new Date(note?.updated_at ?? ''), sevenDaysAgo)
  );
};

export const getOlderNotes = (notes?: NoteSchema[]) => {
  if (!notes) return [];

  const thirtyDaysAgo = subDays(startOfToday(), 30);

  return notes.filter((note) => isBefore(new Date(note?.updated_at ?? ''), thirtyDaysAgo));
};

type Section = {
  section: string;
  notes: NoteSchema[];
};

export const getSectionsByDate = (notes?: NoteSchema[]): (NoteSchema | Section)[] => {
  if (!notes) return [];

  const todayNotes = getTodayNotes(notes);
  const last7DaysNotes = getLast7DaysNotes(notes);
  const last30DaysNotes = getLast30DaysNotes(notes);
  const olderNotes = getOlderNotes(notes);

  return [
    ...(todayNotes.length ? [{ section: i18next.t('today'), notes: todayNotes }] : []),
    ...todayNotes,
    ...(last7DaysNotes.length
      ? [{ section: i18next.t('previous_7_days'), notes: last7DaysNotes }]
      : []),
    ...last7DaysNotes,
    ...(last30DaysNotes.length
      ? [{ section: i18next.t('previous_30_days'), notes: last30DaysNotes }]
      : []),
    ...last30DaysNotes,
    ...(olderNotes.length ? [{ section: i18next.t('older'), notes: olderNotes }] : []),
    ...olderNotes,
  ];
};

export const getSectionByItemType = (
  items?: NoteSearchResponse[] | VoiceSearchResponse[] | DocumentSearchResponse[]
) => {
  if (!items) return [];

  const sections = items.reduce(
    (acc, item) => {
      if (item.type === 'note') {
        acc.notes.push(item);
      } else if (item.type === 'voice') {
        acc.voice.push(item);
      } else if (item.type === 'document') {
        acc.document.push(item);
      }

      return acc;
    },
    {
      notes: [] as NoteSearchResponse[],
      voice: [] as VoiceSearchResponse[],
      document: [] as DocumentSearchResponse[],
    }
  );

  return [
    ...(sections.notes.length ? [{ section: i18next.t('notes') }] : []),
    ...sections.notes,
    ...(sections.voice.length ? [{ section: i18next.t('audio_recordings') }] : []),
    ...sections.voice,
    ...(sections.document.length ? [{ section: i18next.t('documents') }] : []),
    ...sections.document,
  ];
};
