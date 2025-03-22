import { Stack } from "expo-router"

const HomeLayout = () => {
  return(
    <Stack >
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="select_feature" options={{headerShown: false}} />
        <Stack.Screen name="summary_menu" options={{headerShown: false}} />
        <Stack.Screen name="suggestions_menu" options={{headerShown: false}} />
        <Stack.Screen name="accesible_menu" options={{headerShown: false}} />

    </Stack>
  )
}

export default HomeLayout