import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/modules/account/config";
import { useAccount } from "@/providers/account-auth";
import { cn } from "@/core/utils";

export default function PaywallScreen() {
  const router = useRouter();
  const { user, logout } = useAccount();

  return (
    <Container contentClassName="flex-1 !px-6">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-sp-4 py-sp-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-sp-1">
          <Text className="font-sans text-3xl font-bold text-foreground dark:text-foreground-dark">
            Choose your plan
          </Text>
          <Text className="font-sans text-base text-muted-foreground dark:text-muted-foreground-dark">
            {user
              ? `Current plan: ${user.plan} • ${user.tokens < 0 ? "Unlimited" : `${user.tokens} tokens left`}`
              : "Upgrade for more AI tokens."}
          </Text>
        </View>

        {PLANS.map((plan) => (
          <View
            key={plan.id}
            className={cn(
              "gap-sp-2 rounded-ui border p-sp-4",
              plan.highlight
                ? "border-foreground bg-secondary dark:border-foreground-dark dark:bg-secondary-dark"
                : "border-border dark:border-border-dark",
            )}
          >
            <View className="flex-row items-baseline justify-between">
              <Text className="font-sans text-xl font-bold text-foreground dark:text-foreground-dark">
                {plan.name}
              </Text>
              <Text className="font-sans text-lg font-semibold text-foreground dark:text-foreground-dark">
                {plan.price}
              </Text>
            </View>
            <Text className="font-sans text-sm font-medium text-muted-foreground dark:text-muted-foreground-dark">
              {plan.tokens}
            </Text>
            {plan.features.map((f) => (
              <Text
                key={f}
                className="font-sans text-sm text-foreground dark:text-foreground-dark"
              >
                • {f}
              </Text>
            ))}
            {user?.plan === plan.id ? (
              <Button variant="secondary" disabled>
                Current plan
              </Button>
            ) : plan.id === "free" ? (
              <Button variant="outline" onPress={() => router.back()}>
                Stay on Free
              </Button>
            ) : (
              <Button
                onPress={() => {
                  // Subscriptions via Google Play (RevenueCat) land here once
                  // the app is on the Play Store. Until then, upgrades are
                  // done from the PHP admin panel.
                  router.back();
                }}
              >
                Choose {plan.name}
              </Button>
            )}
          </View>
        ))}

        <Text className="text-center font-sans text-xs text-muted-foreground dark:text-muted-foreground-dark">
          Paid subscriptions activate on Google Play after the store release.
          {"\n"}Need tokens now? Contact support from Settings.
        </Text>

        {user ? (
          <Pressable
            className="items-center py-sp-2"
            onPress={() => {
              logout().catch(() => {});
            }}
          >
            <Text className="font-sans text-sm text-destructive dark:text-destructive-dark">
              Logout ({user.email})
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </Container>
  );
}
