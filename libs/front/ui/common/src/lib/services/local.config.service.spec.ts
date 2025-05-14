import { beforeEach, describe, expect, it } from 'vitest';

import { LocalConfigService } from './local.config.service';

describe('LocalConfigService', () => {
  let service: LocalConfigService;

  // Mock localStorage
  beforeEach(() => {
    service = new LocalConfigService();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUpdates', () => {
    it('should return a signal with empty object when key does not exist in localStorage', () => {
      const result = service.getUpdates<{ test?: string }>('nonExistentKey');
      expect(result()).toEqual({});
      expect(localStorage.getItem('nonExistentKey')).toBeNull();
    });

    it('should return a signal with parsed value when key exists in localStorage', () => {
      const testData = { test: 'value' };
      localStorage.setItem('existingKey', JSON.stringify(testData));

      const result = service.getUpdates<{ test: string }>('existingKey');
      expect(result()).toEqual(testData);
    });

    it('should create the signal only once for the same key', () => {
      const testData = { test: 'value' };
      localStorage.setItem('key', JSON.stringify(testData));

      const result1 = service.getUpdates<{ test: string }>('key');

      const result2 = service.getUpdates<{ test: string }>('key');

      expect(result1).toBe(result2); // Should be the same signal instance
    });
  });

  describe('update', () => {
    it('should update localStorage with stringified value', () => {
      const testData = { test: 'updated' };
      service.update('updateKey', testData);

      expect(localStorage.getItem('updateKey')).toEqual(
        JSON.stringify(testData)
      );
    });

    it('should update the signal if it exists', () => {
      // First get the signal to create it
      const initialData = { test: 'initial' };
      localStorage.setItem('updateSignalKey', JSON.stringify(initialData));

      const signal = service.getUpdates<{ test: string }>('updateSignalKey');
      expect(signal()).toEqual(initialData);

      // Then update it
      const updatedData = { test: 'updated' };
      service.update('updateSignalKey', updatedData);

      // Signal should be updated
      expect(signal()).toEqual(updatedData);
    });
  });

  describe('integration', () => {
    it('should handle a full cycle of getting and updating values', () => {
      const initialData = { count: 0, name: 'test' };
      const key = 'cycleKey';
      localStorage.setItem(key, JSON.stringify(initialData));

      // Get the signal
      const updates = service.getUpdates<{ count: number; name: string }>(key);
      expect(updates()).toEqual(initialData);

      // Update the value
      const updatedData = { count: 1, name: 'updated' };
      service.update(key, updatedData);

      // Signal should be updated
      expect(updates()).toEqual(updatedData);

      // localStorage should be updated
      expect(localStorage.getItem(key)).toEqual(JSON.stringify(updatedData));

      // Getting the signal again should return the updated value
      const updatesAgain = service.getUpdates<{ count: number; name: string }>(
        key
      );
      expect(updatesAgain()).toEqual(updatedData);
      expect(updatesAgain).toBe(updates); // Should be the same signal instance
    });
  });
});
