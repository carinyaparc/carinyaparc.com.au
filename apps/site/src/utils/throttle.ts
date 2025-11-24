/**
 * Configuration options for throttling behavior
 */
export interface ThrottleOptions {
  /** Time interval in milliseconds between function executions (default: 100) */
  intervalMs?: number;
  /** Execute on the leading edge of the interval (default: true) */
  leading?: boolean;
  /** Execute on the trailing edge of the interval (default: false) */
  trailing?: boolean;
}

/**
 * Result of throttle operation with metadata
 */
export interface ThrottleResult {
  /** The throttled function */
  throttled: (...args: unknown[]) => void;
  /** Cancel any pending trailing execution */
  cancel: () => void;
  /** Immediately execute the function and reset the timer */
  flush: () => void;
  /** Check if there's a pending trailing execution */
  pending: () => boolean;
}

/**
 * Creates a throttled function that only executes once per specified interval
 *
 * @param fn - The function to throttle
 * @param options - Throttle options or interval in milliseconds for backward compatibility
 * @returns Throttled function with control methods
 * @throws {Error} If inputs are invalid
 *
 * @example
 * ```typescript
 * // Basic usage (backward compatible)
 * const throttledScroll = throttle((event) => {
 *   console.log('Scroll event:', event);
 * }, 100);
 *
 * // Advanced options
 * const throttledResize = throttle((width, height) => {
 *   console.log('Window resized:', width, height);
 * }, {
 *   intervalMs: 250,
 *   leading: true,
 *   trailing: false
 * });
 *
 * // With control methods
 * const throttledFn = throttle(handleSearch, {
 *   intervalMs: 300,
 *   trailing: true
 * });
 *
 * // Cancel pending execution
 * throttledFn.cancel();
 *
 * // Force immediate execution
 * throttledFn.flush();
 * ```
 */
export function throttle(
  fn: (...args: unknown[]) => void,
  options: ThrottleOptions | number = {},
): ((...args: unknown[]) => void) & {
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
} {
  // Input validation
  if (typeof fn !== 'function') {
    throw new Error('First argument must be a function');
  }

  // Handle legacy API (intervalMs as second parameter)
  const config: ThrottleOptions = typeof options === 'number' ? { intervalMs: options } : options;

  // Set defaults
  const { intervalMs = 100, leading = true, trailing = false } = config;

  // Validate intervalMs
  if (intervalMs < 0) {
    throw new Error('intervalMs must be non-negative');
  }

  // Throttle state
  let lastArgs: unknown[] | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let timerId: ReturnType<typeof setTimeout> | undefined;

  /**
   * Invoke the original function with the latest arguments
   */
  function invokeFunc(args: unknown[]): void {
    lastInvokeTime = Date.now();
    lastArgs = undefined;
    fn(...args);
  }

  /**
   * Calculate remaining time until next execution is allowed
   */
  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = intervalMs - timeSinceLastCall;
    const timeToWait = intervalMs - timeSinceLastInvoke;

    return Math.min(timeWaiting, timeToWait);
  }

  /**
   * Check if function should be invoked now
   */
  function shouldInvoke(time: number): boolean {
    if (lastCallTime === undefined) {
      return true; // First call
    }

    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return timeSinceLastCall >= intervalMs || timeSinceLastInvoke >= intervalMs;
  }

  /**
   * Handle trailing edge execution
   */
  function trailingEdge(): void {
    timerId = undefined;

    // Only invoke if we have pending arguments and trailing is enabled
    if (trailing && lastArgs) {
      invokeFunc(lastArgs);
    }

    lastArgs = undefined;
  }

  /**
   * Start or restart the timer for trailing edge
   */
  function startTimer(pendingFunc: () => void, wait: number): void {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(pendingFunc, wait);
  }

  /**
   * The main throttled function
   */
  function throttled(...args: unknown[]): void {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        // Leading edge
        if (leading) {
          lastInvokeTime = time;
          invokeFunc(args);
        }

        // Set up trailing edge if needed
        if (trailing && intervalMs > 0) {
          startTimer(trailingEdge, intervalMs);
        }
      } else {
        // Subsequent call during wait period
        invokeFunc(args);
      }
    } else if (trailing && timerId === undefined) {
      // Set up trailing edge
      const remainingTime = remainingWait(time);
      startTimer(trailingEdge, remainingTime);
    }
  }

  /**
   * Cancel any pending trailing execution
   */
  throttled.cancel = (): void => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }
    lastArgs = undefined;
    lastCallTime = undefined;
    lastInvokeTime = 0;
  };

  /**
   * Immediately execute the function and reset throttle state
   */
  throttled.flush = (): void => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }

    if (lastArgs !== undefined) {
      invokeFunc(lastArgs);
    }
  };

  /**
   * Check if there's a pending trailing execution
   */
  throttled.pending = (): boolean => {
    return timerId !== undefined;
  };

  return throttled;
}

/**
 * Creates a throttled function with enhanced control methods (alternative API)
 *
 * @param fn - The function to throttle
 * @param options - Throttle configuration options
 * @returns Object with throttled function and control methods
 *
 * @example
 * ```typescript
 * const { throttled, cancel, flush, pending } = createThrottle(
 *   (data) => updateUI(data),
 *   { intervalMs: 200, trailing: true }
 * );
 *
 * // Use the throttled function
 * throttled(newData);
 *
 * // Check state
 * if (pending()) {
 *   console.log('Execution pending');
 * }
 *
 * // Force execution
 * flush();
 * ```
 */
export function createThrottle(
  fn: (...args: unknown[]) => void,
  options: ThrottleOptions = {},
): ThrottleResult {
  const throttledFn = throttle(fn, options);

  return {
    throttled: throttledFn,
    cancel: throttledFn.cancel,
    flush: throttledFn.flush,
    pending: throttledFn.pending,
  };
}

/**
 * Simple throttle without advanced options (legacy compatibility)
 *
 * @deprecated Use throttle() for better control and options
 * @param fn - The function to throttle
 * @param intervalMs - Interval in milliseconds (default: 100)
 * @returns Simple throttled function
 */
export function throttleLegacy(
  fn: (...args: unknown[]) => void,
  intervalMs: number = 100,
): (...args: unknown[]) => void {
  let lastTime = 0;
  return (...args: unknown[]) => {
    const now = Date.now();
    if (now - lastTime >= intervalMs) {
      fn(...args);
      lastTime = now;
    }
  };
}
