import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/account/google-icon";
import { GOOGLE_WEB_CLIENT_ID } from "@/modules/account/config";
import { useAccount } from "@/providers/account-auth";

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

/** Native "Continue with Google" button (no browser). Sends the ID token to the PHP backend. */
export function GoogleSignInButton({ label }: { label: string }) {
  const { signInWithGoogle } = useAccount();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePress() {
    setError(null);
    setBusy(true);
    try {
      const playOk = await GoogleSignin.hasPlayServices();
      if (!playOk) {
        setError("Google Play Services not available.");
        return;
      }
      const response = await GoogleSignin.signIn({});
      if (response.type === "cancelled") {
        return; // user dismissed the account picker; not an error
      }
      const idToken = response.data.idToken;
      if (!idToken) {
        setError("Google did not return an ID token.");
        return;
      }
      await signInWithGoogle(idToken);
    } catch (e) {
      if (isErrorWithCode(e)) {
        switch (e.code) {
          case statusCodes.IN_PROGRESS:
            setError("Sign-in already in progress.");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setError("Google Play Services not available.");
            break;
          default:
            setError("Google sign-in failed. Please try again.");
        }
      } else {
        setError(e instanceof Error ? e.message : "Google sign-in failed.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        loading={busy}
        leftIcon={<GoogleIcon />}
        onPress={handlePress}
      >
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
