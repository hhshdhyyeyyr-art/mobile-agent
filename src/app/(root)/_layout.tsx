import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAccount } from "@/providers/account-auth";

export default function Layout() {
  const { enabled, loading, backendUp, user } = useAccount();

  // While the account backend URL is not configured, the app works as before.
  if (enabled && loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Login is required only when the backend is reachable.
  // If the backend is down, the app keeps working (graceful fallback).
  if (enabled && backendUp && !user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <Slot />
    </SidebarProvider>
  );
}
