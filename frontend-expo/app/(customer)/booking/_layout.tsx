import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="list" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="create" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
