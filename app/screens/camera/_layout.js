import { Stack } from "expo-router"

const CameraLayout = () => {
  return(
    <Stack >
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="upload_image" options={{headerShown: false}} />
    </Stack>
  )
}

export default CameraLayout