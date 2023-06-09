export const logger = (name: string): typeof console => {
  return Proxy.revocable(console, {
    get: (target, prop: keyof typeof console) => {
      const value = target[prop];
      if (typeof value === 'function') {
        return (...args: unknown[]) => {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
          return (value as (...args: unknown[]) => void).apply(target, [
            `${formattedDate} [${name}] ${prop.toUpperCase()}`,
            ...args,
          ]);
        };
      } else {
        return value;
      }
    },
  }).proxy as typeof console;
};
