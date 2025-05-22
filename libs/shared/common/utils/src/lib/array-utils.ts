export const arrayUtils = {
  insertAt<T>(array: T[], item: T, index?: number): T[] {
    if (index === undefined) {
      return [...array, item];
    }
    return [...array.slice(0, index), item, ...array.slice(index)];
  },
  removeItem<T extends { id: string }>(array: T[], id: string): T[] {
    const index = array.findIndex((item) => item.id === id);
    if (index === -1) {
      return array;
    }
    return [...array.slice(0, index), ...array.slice(index + 1)];
  },
  moveItem<T extends { id: string }>(
    array: T[],
    id: string,
    beforeIndex: number
  ): T[] {
    const index = array.findIndex((item) => item.id === id);
    const item = array[index];
    if (index === -1) {
      return array;
    }
    if (index < beforeIndex) {
      beforeIndex--;
    }
    const otherItems = [...array.slice(0, index), ...array.slice(index + 1)];
    return [
      ...otherItems.slice(0, beforeIndex),
      item,
      ...otherItems.slice(beforeIndex),
    ];
  },
  replaceItem<T extends { id: string }>(array: T[], item: T): T[] {
    const index = array.findIndex((i) => i.id === item.id);
    if (index === -1) {
      return array;
    }
    return [...array.slice(0, index), item, ...array.slice(index + 1)];
  },
};
