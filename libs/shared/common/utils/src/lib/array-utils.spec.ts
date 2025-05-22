import { arrayUtils } from './array-utils';

describe('arrayUtils', () => {
  describe('insertAt', () => {
    it('should insert an item at the end of the array if index is not provided', () => {
      const array = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const result = arrayUtils.insertAt(array, { id: '4' });
      expect(result).toEqual([
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
      ]);
    });

    it('should insert an item at the specified index', () => {
      const array = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const result = arrayUtils.insertAt(array, { id: '4' }, 1);
      expect(result).toEqual([
        { id: '1' },
        { id: '4' },
        { id: '2' },
        { id: '3' },
      ]);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the array', () => {
      const array = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const result = arrayUtils.removeItem(array, '2');
      expect(result).toEqual([{ id: '1' }, { id: '3' }]);
      expect(result).not.toBe(array);
    });

    it('should return exactly the same array if item is not found', () => {
      const array = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const result = arrayUtils.removeItem(array, '4');
      expect(result).toBe(array);
    });
  });

  describe('moveItem', () => {
    it('should move an item before the specified index', () => {
      const array = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const result = arrayUtils.moveItem(array, '2', 3);
      expect(result).toEqual([{ id: '1' }, { id: '3' }, { id: '2' }]);
      expect(result).not.toBe(array);
    });

    it('should return exactly the same array if item is not found', () => {
      const array = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const result = arrayUtils.moveItem(array, '4', 1);
      expect(result).toBe(array);
    });
  });

  describe('replaceItem', () => {
    it('should replace an item in the array', () => {
      const array = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const result = arrayUtils.replaceItem(array, { id: '2' });
      expect(result).toEqual([{ id: '1' }, { id: '2' }, { id: '3' }]);
      expect(result).not.toBe(array);
    });

    it('should return exactly the same array if item is not found', () => {
      const array = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const result = arrayUtils.replaceItem(array, { id: '4' });
      expect(result).toBe(array);
    });
  });
});
