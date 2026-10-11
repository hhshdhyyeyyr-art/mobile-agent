import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import { Button } from "@/components/ui/button";
import { GOOGLE_WEB_CLIENT_ID } from "@/modules/account/config";
import { useAccount } from "@/providers/account-auth";

WebBrowser.maybeCompleteAuthSession();

/** "Continue with Google" button. Exchanges the Google ID token with the PHP backend. */
export function GoogleSignInButton({ label }: { label: string }) {
  const { signInWithGoogle } = useAccount();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type !== "success") {
      if (response?.type === "error") {
        setError("Google sign-in failed. Please try again.");
        setBusy(false);
      }
      return;
    }
    const idToken = response.params.id_token;
    if (!idToken) {
      setError("Google did not return an ID token.");
      setBusy(false);
      return;
    }
    (async () => {
      try {
        await signInWithGoogle(idToken);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Google sign-in failed.");
      } finally {
        setBusy(false);
      }
    })();
  }, [response, signInWithGoogle]);

  return (
    <>
      <Button
        variant="outline"
        disabled={!request || busy}
        onPress={() => {
          setError(null);
          setBusy(true);
          promptAsync().catch(() => {
            setError("Could not open Google sign-in.");
            setBusy(false);
          });
        }}
      >
        {busy ? <ActivityIndicator size="small" /> : null}
        {label}
      </Button>
      {error ? (
        <Button variant="ghost" size="sm" disabled>
          {error}
        </Button>
      ) : null}
    </>
  );
}
