export function debounce<T extends any[]>(
  fn: (...args: T) => void, 
  ms: number
): (...args: T) => void {
  let timeout: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}