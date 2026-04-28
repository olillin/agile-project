// Mostly copied from https://nextjs.org/docs/app/guides/authentication

import "server-only";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export interface SessionPayload extends JWTPayload {
  given_name: string;
  family_name: string;
  exp: number;
}

// Mock authentication does not require a secure secret
const secretKey = "my-secret";
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Encrypt a session as a JWT.
 * @param payload The JWT payload and expiration timestamp.
 * @returns The signed JWT string.
 */
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.exp)
    .sign(encodedKey);
}

/**
 * Verify and decrypt a JWT session.
 * @param session The JWT string.
 * @returns The decrypted session.
 */
export async function decrypt(
  session: string | undefined = ""
): Promise<SessionPayload | undefined> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    console.log("Failed to verify session");
  }
}

export async function createSession(firstName: string, lastName: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const expiresAtSeconds = expiresAt.getTime() / 1000;
  console.log("encrypting");
  const session = await encrypt({
    given_name: firstName,
    family_name: lastName,
    exp: expiresAtSeconds,
  });
  console.log("getting store");
  const cookieStore = await cookies();

  console.log("setting session");
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

/**
 * Verify that the session stored in the cookie is valid and redirect to
 * the login page if not.
 *
 * Protected server actions should call this function before processing
 * requests.
 *
 * @return The session if it exists and is valid.
 */
export const verifySession = cache(
  async (): Promise<SessionPayload | never> => {
    const cookie = (await cookies()).get("session")?.value;
    const session = (await decrypt(cookie)) as SessionPayload | undefined;

    // Check if session does not exist or has expired
    const currentTimeSeconds = Date.now() / 1000;
    if (session?.exp == undefined || session.exp <= currentTimeSeconds) {
      // Mock redirect to homepage instead of login
      redirect("/");
    }

    return session;
  }
);
