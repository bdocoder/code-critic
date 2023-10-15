import { SignJWT, jwtVerify } from "jose";
import { getEnvVariable } from "./server";

const key = new TextEncoder().encode(getEnvVariable("APP_SECRET"));

/**
 * @param {string} token
 */
export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, key);
  return payload.sub;
}

/**
 * @param {import("jose").JWTPayload} payload
 */
export async function signJWT(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(key);
  return token;
}
