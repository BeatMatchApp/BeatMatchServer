export const isValidDateString = (input: string): boolean => {
  const date = new Date(input);

  return !isNaN(date.getTime());
};
