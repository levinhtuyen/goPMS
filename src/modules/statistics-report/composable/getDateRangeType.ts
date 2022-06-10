export const getHours = () => {
  const hours = Array.from(
    {
      length: 24,
    },
    (_, hour) => ` ${hour !== 23 ? hour + 1 : '00'}:00`,
  );
  return hours;
};
