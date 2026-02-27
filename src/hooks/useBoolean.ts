import { useCallback, useMemo, useState } from 'react'

export function useBoolean(initialValue: boolean) {
  const [value, setValue] = useState(initialValue)

  const on = useCallback(() => setValue(true), [])
  const off = useCallback(() => setValue(false), [])
  const toggle = useCallback(() => setValue((v) => !v), [])

  return useMemo(
    () => ({
      value,
      setValue,
      on,
      off,
      toggle,
    }),
    [off, on, toggle, value],
  )
}


