export const times = <T>(
  count: number,
  callback: (index: number) => T
): T[] => {
  const items: T[] = [];
  for (let index = 0; index < count; index++) {
    items.push(callback(index));
  }
  return items;
};
