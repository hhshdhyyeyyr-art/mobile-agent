// Secure session storage for the account token + user.
import * as SecureStore from "expo-secure-store";
import type { AccountUser } from "./client";

const SESSION_KEY = "mobile-agent-account-session";

export type AccountSession = {
  token: string;
  user: AccountUser;
};

export async function saveSession(session: AccountSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function loadSession(): Promise<AccountSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AccountSession;
    if (typeof parsed.token === "string" && parsed.user) return parsed;
    return null;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
