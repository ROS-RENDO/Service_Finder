import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth";

export default function Index() {
  // AuthGate in _layout will eventually intercept and route correctly
  // based on the auth state, but we need an index route so Expo doesn't show "Unmatched Route".
  return <Redirect href="/(auth)/login" />;
}
