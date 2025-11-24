/**
 * Creates a debounced function that delays invoking the provided function until after
 * waitMs milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param fn - The function to debounce
 * @param waitMs - The number of milliseconds to delay
 * @returns The debounced function with a cancel method
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * // Usage
 * debouncedSearch('hello'); // Will execute after 300ms
 * debouncedSearch('hello world'); // Previous call is cancelled, this executes after 300ms
 *
 * // Cancel pending execution
 * debouncedSearch.cancel();
 * ```
 */
export function debounce(
  fn: (...args: unknown[]) => void,
  waitMs: number,
): ((...args: unknown[]) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: unknown[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), waitMs);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}
