export const getEnvironmentVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`The environment variable "${key}" is not defined.`);
  }
  return value;
};
