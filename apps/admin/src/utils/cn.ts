/**
 * Conditionally joins classNames into a single string.
 */
export function cn(...classes: Array<string | undefined | null | boolean | Record<string, boolean>>): string {
  const result: string[] = [];

  for (const c of classes) {
    if (!c) continue;

    if (typeof c === 'string') {
      result.push(c);
    } else if (typeof c === 'object') {
      for (const [key, value] of Object.entries(c)) {
        if (value) {
          result.push(key);
        }
      }
    }
  }

  return result.join(' ');
}
