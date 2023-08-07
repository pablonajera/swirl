import { LocalCache } from "../classes/cache.class";

export const cache = new LocalCache({
  maxSize: 100,
  useLocalStorage: true,
});
