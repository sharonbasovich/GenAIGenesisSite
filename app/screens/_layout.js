import { Stack } from "expo-router"

const ScreenLayout = () => {
  return(
    <Stack >
        <Stack.Screen name="home" options={{headerShown: false}} />
        <Stack.Screen name="camera" options={{headerShown: false}} />
        <Stack.Screen name="settings" options={{headerShown: false}} />

    </Stack>
  )
}

export default ScreenLayout