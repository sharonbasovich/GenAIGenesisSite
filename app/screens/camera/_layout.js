import { Stack } from "expo-router"

const CameraLayout = () => {
  return(
    <Stack >
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="validate_photo" options={{headerShown: false}} />
    </Stack>
  )
}

export default CameraLayout