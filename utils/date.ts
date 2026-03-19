const calendarBadgeFormatter = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'short',
});

export const formatCalendarBadge = (value: string | Date) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { day: '--', month: '--' };
  }

  const parts = calendarBadgeFormatter.formatToParts(date);
  const day = parts.find((part) => part.type === 'day')?.value ?? '--';
  const month = (parts.find((part) => part.type === 'month')?.value ?? '--').replace('.', '');

  return { day, month };
};
