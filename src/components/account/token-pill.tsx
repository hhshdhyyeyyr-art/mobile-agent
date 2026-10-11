import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

import { useAccount } from "@/providers/account-auth";

/** Small token balance pill for the chat header. Tapping opens the paywall. */
export function TokenPill() {
  const router = useRouter();
  const { enabled, user } = useAccount();

  if (!enabled || !user) return null;

  const label = user.tokens < 0 ? "∞" : String(user.tokens);

  return (
    <Pressable
      accessibilityLabel="Token balance, open plans"
      onPress={() => router.push("/paywall")}
      className="flex-row items-center rounded-full border border-border px-sp-3 py-1 dark:border-border-dark"
    >
      <Text className="font-sans text-sm font-semibold text-foreground dark:text-foreground-dark">
        🪙 {label}
      </Text>
    </Pressable>
  );
}
