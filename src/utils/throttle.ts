export function throttle(func: () => void, interval: number): () => void {
  let canExecute = true;

  return () => {
    if (canExecute) {
      func();
      canExecute = false;
      setTimeout(() => {
        canExecute = true;
      }, interval);
    }
  };
}
