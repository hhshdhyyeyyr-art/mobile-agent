import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { accountApi, type AccountUser } from "@/modules/account/client";
import { isAccountEnabled } from "@/modules/account/config";
import {
  clearSession,
  loadSession,
  saveSession,
} from "@/modules/account/session";

type AccountContextValue = {
  /** false when ACCOUNT_API_BASE_URL is empty (auth disabled, app works as before) */
  enabled: boolean;
  loading: boolean;
  user: AccountUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  deductTokens: (amount: number, reason: string) => Promise<number | null>;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const enabled = isAccountEnabled();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AccountUser | null>(null);

  // Restore session on start; drop it if the backend rejects the token.
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const session = await loadSession();
        if (!session) return;
        try {
          const { user: fresh } = await accountApi.me(session.token);
          if (!cancelled) {
            setToken(session.token);
            setUser(fresh);
            await saveSession({ token: session.token, user: fresh });
          }
        } catch {
          await clearSession();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const applyResult = useCallback(async (result: {
    token: string;
    user: AccountUser;
  }) => {
    setToken(result.token);
    setUser(result.user);
    await saveSession(result);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await accountApi.login(email, password);
      await applyResult(result);
    },
    [applyResult],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await accountApi.register(name, email, password);
      await applyResult(result);
    },
    [applyResult],
  );

  const signInWithGoogle = useCallback(
    async (idToken: string) => {
      const result = await accountApi.googleAuth(idToken);
      await applyResult(result);
    },
    [applyResult],
  );

  const logout = useCallback(async () => {
    await clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const { user: fresh } = await accountApi.me(token);
    setUser(fresh);
    await saveSession({ token, user: fresh });
  }, [token]);

  const deductTokens = useCallback(
    async (amount: number, reason: string): Promise<number | null> => {
      if (!token || !user) return null;
      // Premium (-1) = unlimited, nothing to deduct.
      if (user.tokens < 0) return -1;
      const res = await accountApi.deduct(token, amount, reason);
      setUser({ ...user, tokens: res.tokens });
      return res.tokens;
    },
    [token, user],
  );

  const value = useMemo<AccountContextValue>(
    () => ({
      enabled,
      loading,
      user,
      token,
      login,
      register,
      signInWithGoogle,
      logout,
      refreshUser,
      deductTokens,
    }),
    [
      enabled,
      loading,
      user,
      token,
      login,
      register,
      signInWithGoogle,
      logout,
      refreshUser,
      deductTokens,
    ],
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside AuthProvider");
  return ctx;
}
