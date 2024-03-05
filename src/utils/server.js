/**
 * @param {string} key
 */
export function getEnvVariable(key) {
  const value = process.env[key];
  if (value) return value;
  throw new Error(`Environment variable ${key} must be set!`);
}
