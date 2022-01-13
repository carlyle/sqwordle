import { useCallback, useEffect, useState } from 'react';

type StoredValue<T> = {
  value: T;
} & (
  | {
      status: 'initial' | 'loading';
    }
  | {
      status: 'loaded';
      update: (updates: Partial<T>) => Promise<void>;
    }
);

export const readFromStorage = async <T>({
  deserialize,
  key,
}: {
  deserialize: (serializedValue: string) => T;
  key: string;
}): Promise<T> => {
  let serializedValue: string | null;
  try {
    serializedValue = window.localStorage.getItem(key);
  } catch (error) {
    console.error(error);
    serializedValue = null;
  }

  if (typeof serializedValue !== 'string') {
    throw new Error(`Could not find ${key} in storage`);
  }

  return deserialize(serializedValue);
};

export const usePersistentStorage = <T>(
  key: string,
  defaultValue: T,
  {
    deserialize = (serializedValue: string): T =>
      <T>JSON.parse(serializedValue),
    serialize = (value: T): string => JSON.stringify(value),
  }: {
    deserialize?: (serializedValue: string) => T;
    serialize?: (value: T) => string;
  } = {}
): StoredValue<T> => {
  const [state, setState] = useState<
    | {
        status: 'initial' | 'loading';
        value: T;
      }
    | {
        status: 'loaded';
        value: T;
      }
  >({ status: 'initial', value: defaultValue });

  useEffect(() => {
    if (state.status === 'initial') {
      setState((state) => ({ ...state, status: 'loading' }));

      readFromStorage({ deserialize, key })
        .then((existingValue) => {
          setState((state) => ({
            ...state,
            status: 'loaded',
            value: existingValue,
          }));
        })
        .catch(() => {
          setState((state) => ({
            ...state,
            status: 'loaded',
            value: defaultValue,
          }));
        });
    }
  }, [defaultValue, deserialize, key, setState, state]);

  const onUpdate = useCallback(
    async (updates: Partial<T> | ((currentValue: T) => Partial<T>)) => {
      if (state.status !== 'loaded') {
        throw new Error(`Cannot update a value in storage before it is loaded`);
      }

      const newValue: T = {
        ...(<T>state.value),
        ...(typeof updates === 'function' ? updates(<T>state.value) : updates),
      };

      await writeToStorage({ key, serialize, value: newValue });

      setState((state) => ({ ...state, status: 'loaded', value: newValue }));
    },
    [key, serialize, setState, state]
  );

  switch (state.status) {
    case 'initial':
    case 'loading':
      return {
        status: state.status,
        value: defaultValue,
      };

    case 'loaded':
      return {
        ...state,
        update: onUpdate,
      };

    default:
      throw new Error(
        `${JSON.stringify(state)} has an unsupported status value`
      );
  }
};

const writeToStorage = async <T>({
  key,
  serialize,
  value,
}: {
  key: string;
  serialize: (value: T) => string;
  value: T;
}): Promise<void> => {
  try {
    window.localStorage.setItem(key, serialize(value));
  } catch (error) {
    console.error(error);
  }
};
