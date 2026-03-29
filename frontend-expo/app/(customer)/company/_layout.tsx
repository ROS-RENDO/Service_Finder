import { Stack } from 'expo-router';

export default function CompanyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="service" />
    </Stack>
  );
}
