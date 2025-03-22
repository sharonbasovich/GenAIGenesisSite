import { Tabs } from "expo-router"
import { StatusBar } from "expo-status-bar";

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const TabsLayout = () => {
    return(
        <Tabs screenOptions={{headerShown: false}}>
            <Tabs.Screen name="index"  />
            <Tabs.Screen name="validate_photo" />
            <Tabs.Screen name="home" />
            <Tabs.Screen name="select_feature" />
            <Tabs.Screen name="accesible_menu" />
            <Tabs.Screen name="summary_menu" />
            <Tabs.Screen name="suggestions_menu" />

        </Tabs>
    )
}

export default TabsLayout

{/* <Tabs.Screen name="account" options={{ tabBarIcon: () => <MaterialCommunityIcons name="account-outline" size={35} color={PRIMARY} />}} /> */}
