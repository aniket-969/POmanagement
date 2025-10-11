import { useRef, useEffect, useCallback } from "react";

export function useDebouncedCallback(callback, delay) {
  const callbackRef = useRef(callback);
  const timer = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const debounced = useCallback(
    (...args) => {
      cancel();
      timer.current = setTimeout(() => {
        callbackRef.current(...args);
        timer.current = null;
      }, delay);
    },
    [delay, cancel]
  );

  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  return Object.assign(debounced, { cancel });
}