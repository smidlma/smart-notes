import { NoteSchema } from '@/services/api';
import { isAfter, isBefore, startOfToday, subDays } from 'date-fns';
import i18next from 'i18next';

export const getSectionsByDate = (notes?: NoteSchema[]) => {
  if (!notes) return [];

  const today = startOfToday();
  const sevenDaysAgo = subDays(today, 7);
  const thirtyDaysAgo = subDays(today, 30);

  const todayNotes = notes.filter((note) => isAfter(new Date(note?.updated_at ?? ''), today));
  const last7DaysNotes = notes.filter(
    (note) =>
      isAfter(new Date(note?.updated_at ?? ''), sevenDaysAgo) &&
      isBefore(new Date(note?.updated_at ?? ''), today)
  );
  const last30DaysNotes = notes.filter(
    (note) =>
      isAfter(new Date(note?.updated_at ?? ''), thirtyDaysAgo) &&
      isBefore(new Date(note?.updated_at ?? ''), sevenDaysAgo)
  );
  const olderNotes = notes.filter((note) =>
    isBefore(new Date(note?.updated_at ?? ''), thirtyDaysAgo)
  );

  return [
    { title: i18next.t('today'), data: todayNotes },
    { title: i18next.t('previous_7_days'), data: last7DaysNotes },
    { title: i18next.t('previous_30_days'), data: last30DaysNotes },
    { title: i18next.t('older'), data: olderNotes },
  ].filter((section) => !!section.data.length);
};
