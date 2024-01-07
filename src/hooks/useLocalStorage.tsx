import React, { useState } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (val: T) => void] {
  const readValue = React.useCallback((): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? (parseJSON(item) as T) : initialValue;
    } catch (e) {
      console.warn(`Unable to read ${key} from local storage`, e);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = React.useCallback(
    (val: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(val));
        setStoredValue(val);
      } catch (e) {
        console.warn(
          `An error occurred while saving ${val} to ${key} local storage`,
          e,
        );
      }
    },
    [initialValue, key],
  );

  return [storedValue, setValue];
}

function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value ?? '');
  } catch {
    console.log('parsing error on', { value });
    return undefined;
  }
}

export default useLocalStorage;
