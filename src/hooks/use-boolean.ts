import { useCallback, useState } from 'react';

export interface ReturnType {
  value: boolean;
  onTrue: VoidFunction;
  onFalse: VoidFunction;
  onToggle: VoidFunction;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useBoolean = (defaultValue?: boolean): ReturnType => {
  const [value, setValue] = useState(!!defaultValue);

  const onTrue = useCallback(() => {
    setValue(true);
  }, []);

  const onFalse = useCallback(() => {
    setValue(false);
  }, []);

  const onToggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return {
    value,
    onTrue,
    onFalse,
    onToggle,
    setValue,
  };
};
