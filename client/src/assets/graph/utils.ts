export const valToTime = (val: number) => {
  const date = new Date(val);
  const time = date.toLocaleTimeString();
  return time.slice(0, -3);
};
