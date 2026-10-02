import { useState, useCallback, useMemo, ChangeEvent } from 'react';

export interface UseStringNumberInputOptions {
  allowDecimal?: boolean;
  allowNegative?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface UseStringNumberInputReturn {
  value: string;
  numericValue: number;
  setValue: (val: string | number) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
  inputProps: {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type: 'text';
    inputMode: 'decimal' | 'numeric';
    placeholder?: string;
    autoComplete: 'off';
  };
}

/**
 * Custom hook to permanently resolve the '0' deletion trapping bug in numeric inputs.
 * - Stores state as a clean string so backspacing to empty ("") is fully supported.
 * - Automatically sanitizes decimals (allows only one decimal point, prevents invalid chars).
 * - Exposes both raw string `value` and computed `numericValue`.
 * - Provides drop-in `inputProps` for easy spreading onto `<input {...inputProps} />`.
 */
export function useStringNumberInput(
  initialValue: string | number = '',
  options: UseStringNumberInputOptions = {}
): UseStringNumberInputReturn {
  const {
    allowDecimal = true,
    allowNegative = false,
    min,
    max,
    placeholder
  } = options;

  const sanitize = useCallback(
    (input: string): string => {
      let val = input.trim();

      // Convert Bengali digits to English digits if user enters Bengali numerals
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      for (let i = 0; i < 10; i++) {
        val = val.replaceAll(bnDigits[i], String(i));
      }

      if (val === '') return '';

      // Handle negative signs
      let isNeg = false;
      if (allowNegative && val.startsWith('-')) {
        isNeg = true;
        val = val.slice(1);
      }

      // Filter characters
      if (allowDecimal) {
        // Keep digits and only the first decimal point
        val = val.replace(/[^0-9.]/g, '');
        const parts = val.split('.');
        if (parts.length > 2) {
          val = `${parts[0]}.${parts.slice(1).join('')}`;
        }
      } else {
        val = val.replace(/[^0-9]/g, '');
      }

      return isNeg ? `-${val}` : val;
    },
    [allowDecimal, allowNegative]
  );

  const initialString = useMemo(() => {
    if (initialValue === '' || initialValue === null || initialValue === undefined) {
      return '';
    }
    return String(initialValue);
  }, [initialValue]);

  const [value, setRawValue] = useState<string>(sanitize(initialString));

  const setValue = useCallback(
    (val: string | number) => {
      const str = val === '' || val === null || val === undefined ? '' : String(val);
      setRawValue(sanitize(str));
    },
    [sanitize]
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitize(e.target.value);
      
      // Optional range validation (only applied if not currently typing a partial decimal or sign)
      if (sanitized !== '' && sanitized !== '-' && sanitized !== '.') {
        const num = parseFloat(sanitized);
        if (!isNaN(num)) {
          if (max !== undefined && num > max) {
            setRawValue(String(max));
            return;
          }
          if (min !== undefined && num < min && sanitized.length >= String(min).length) {
            setRawValue(String(min));
            return;
          }
        }
      }

      setRawValue(sanitized);
    },
    [sanitize, min, max]
  );

  const reset = useCallback(() => {
    setRawValue(sanitize(initialString));
  }, [sanitize, initialString]);

  const numericValue = useMemo(() => {
    if (!value || value === '-' || value === '.') return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }, [value]);

  const inputProps = useMemo(() => ({
    value,
    onChange,
    type: 'text' as const,
    inputMode: allowDecimal ? ('decimal' as const) : ('numeric' as const),
    placeholder,
    autoComplete: 'off' as const
  }), [value, onChange, allowDecimal, placeholder]);

  return {
    value,
    numericValue,
    setValue,
    onChange,
    reset,
    inputProps
  };
}
