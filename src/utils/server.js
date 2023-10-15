import { headers } from "next/headers";

export function getUserId() {
  return headers().get("x-user-id");
}

/**
 * @param {string} key
 */
export function getEnvVariable(key) {
  const value = process.env[key];
  if (value) return value;
  throw new Error(`Environment variable ${key} must be set!`);
}
