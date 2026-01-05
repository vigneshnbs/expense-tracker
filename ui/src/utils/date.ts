export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const toISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayISO = (): string => {
  return toISODate(new Date());
};

export const getFirstDayOfMonth = (): string => {
  const date = new Date();
  return toISODate(new Date(date.getFullYear(), date.getMonth(), 1));
};

export const getLastDayOfMonth = (): string => {
  const date = new Date();
  return toISODate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
};
