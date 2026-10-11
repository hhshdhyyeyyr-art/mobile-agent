// Thin client for the PHP account backend.
import { ACCOUNT_API_BASE_URL } from "./config";

export type AccountUser = {
  id: number;
  name: string;
  email: string;
  /** -1 means unlimited (premium) */
  tokens: number;
  plan: "free" | "plus" | "premium";
};

type ApiResult = { token: string; user: AccountUser };

async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {},
): Promise<T> {
  const res = await fetch(`${ACCOUNT_API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    ...(options.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // ignore parse errors; handled below
  }
  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export const accountApi = {
  /** True if the backend answers at all (even 401 without token). False on network failure. */
  async ping(): Promise<boolean> {
    try {
      await fetch(`${ACCOUNT_API_BASE_URL}/api/me.php`, { method: "GET" });
      return true;
    } catch {
      return false;
    }
  },
  register(name: string, email: string, password: string): Promise<ApiResult> {
    return api<ApiResult>("/api/register.php", {
      method: "POST",
      body: { name, email, password },
    });
  },
  login(email: string, password: string): Promise<ApiResult> {
    return api<ApiResult>("/api/login.php", {
      method: "POST",
      body: { email, password },
    });
  },
  googleAuth(idToken: string): Promise<ApiResult> {
    return api<ApiResult>("/api/google-auth.php", {
      method: "POST",
      body: { id_token: idToken },
    });
  },
  me(token: string): Promise<{ user: AccountUser }> {
    return api<{ user: AccountUser }>("/api/me.php", { token });
  },
  deduct(
    token: string,
    amount: number,
    reason: string,
  ): Promise<{ tokens: number; plan: AccountUser["plan"] }> {
    return api("/api/tokens.php", {
      method: "POST",
      token,
      body: { action: "deduct", amount, reason },
    });
  },
};
