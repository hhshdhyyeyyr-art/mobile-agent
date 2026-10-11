import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { GoogleSignInButton } from "@/components/account/google-button";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount } from "@/providers/account-auth";

export default function RegisterScreen() {
  const { register, user } = useAccount();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  async function handleRegister() {
    setError(null);
    if (name.trim() === "") {
      setError("Please enter your name.");
      return;
    }
    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container contentClassName="flex-1 justify-center gap-sp-4 !px-6">
      <View className="items-center">
        <Image
          source={require("../../../assets/images/icon.png")}
          style={{ width: 88, height: 88, borderRadius: 44 }}
        />
      </View>
      <View className="gap-sp-1">
        <Text className="font-sans text-3xl font-bold text-foreground dark:text-foreground-dark">
          Create account
        </Text>
        <Text className="font-sans text-base text-muted-foreground dark:text-muted-foreground-dark">
          Get 100 free AI tokens on signup.
        </Text>
      </View>

      <View className="gap-sp-3">
        <Input
          placeholder="Name"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Password (min 6 characters)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? (
        <Text className="font-sans text-sm text-destructive dark:text-destructive-dark">
          {error}
        </Text>
      ) : null}

      <Button loading={busy} onPress={handleRegister}>
        Create account
      </Button>

      <View className="flex-row items-center gap-sp-2">
        <View className="h-px flex-1 bg-border dark:bg-border-dark" />
        <Text className="font-sans text-sm text-muted-foreground dark:text-muted-foreground-dark">
          or
        </Text>
        <View className="h-px flex-1 bg-border dark:bg-border-dark" />
      </View>

      <GoogleSignInButton label="Sign up with Google" />

      <Link href="/auth/login" asChild>
        <Pressable className="items-center py-sp-2">
          <Text className="font-sans text-sm text-muted-foreground dark:text-muted-foreground-dark">
            Already have an account? <Text className="font-semibold text-foreground dark:text-foreground-dark">Login</Text>
          </Text>
        </Pressable>
      </Link>
    </Container>
  );
}
