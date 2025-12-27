/**
 * Debounce function - delays the execution of a function until after
 * a specified amount of time has passed since it was last invoked.
 *
 * @param originalFn - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the function
 */
export const debounce = <T extends (...args: any[]) => any>(
  originalFn: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    // Clear the previous timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      originalFn(...args);
    }, wait);
  };
};

/**
 * Throttle function - limits the execution of a function to at most
 * once per specified time period.
 *
 * @param func - The function to throttle
 * @param limit - The number of milliseconds between allowed executions
 * @returns A throttled version of the function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// ========== USE CASES ==========

// Example 1: Debounce search input
console.log('=== Debounce Example: Search Input ===');
const searchFunction = (query: string) => {
  console.log(`Searching for: ${query}`);
};

const debouncedSearch = debounce(searchFunction, 300);

console.log('Typing "h"...');
debouncedSearch('h');
console.log('Typing "e"...');
debouncedSearch('he');
console.log('Typing "l"...');
debouncedSearch('hel');
console.log('Typing "l"...');
debouncedSearch('hell');
console.log('Typing "o"...');
debouncedSearch('hello');

// Wait for debounce to execute
setTimeout(() => {
  console.log('(After 300ms delay, search executes once with "hello")\n');
}, 350);

// Example 2: Throttle scroll events
console.log('=== Throttle Example: Scroll Events ===');
let scrollCount = 0;
const handleScroll = () => {
  scrollCount++;
  console.log(`Scroll event #${scrollCount} - Window scrolled`);
};

const throttledScroll = throttle(handleScroll, 200);

console.log('Simulating rapid scroll events...');
throttledScroll(); // Executes immediately
throttledScroll(); // Ignored
throttledScroll(); // Ignored
throttledScroll(); // Ignored

setTimeout(() => {
  throttledScroll(); // Executes (200ms passed)
  throttledScroll(); // Ignored
  console.log('(Throttle allows execution every 200ms)\n');
}, 250);

// Example 3: Debounce window resize
console.log('=== Debounce Example: Window Resize ===');
const handleResize = (width: number, height: number) => {
  console.log(`Window resized to: ${width}x${height}`);
};

const debouncedResize = debounce(handleResize, 500);

console.log('Simulating multiple resize events...');
debouncedResize(1920, 1080);
debouncedResize(1600, 900);
debouncedResize(1280, 720);

setTimeout(() => {
  console.log('(After 500ms delay, resize executes once with final dimensions)\n');
}, 550);

// Example 4: Throttle button clicks
console.log('=== Throttle Example: Button Clicks ===');
let clickCount = 0;
const handleClick = (buttonName: string) => {
  clickCount++;
  console.log(`${buttonName} clicked! Total clicks: ${clickCount}`);
};

const throttledClick = throttle(handleClick, 1000);

console.log('Simulating rapid button clicks...');
throttledClick('Submit');
throttledClick('Submit');
throttledClick('Submit');
throttledClick('Submit');

setTimeout(() => {
  throttledClick('Submit');
  console.log('(Throttle prevents spam clicking - max once per second)\n');
}, 1100);