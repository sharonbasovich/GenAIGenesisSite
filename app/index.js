import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, Text, View, Pressable, Alert,ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router' 

const App = () => {
    const router = useRouter()

    const navApp = () => {
        router.push('/(tabs)')
    }

    return(
        <View style={styles.container}>
            <StatusBar style="auto" />
                <Image
                    source={require('../assets/MENU_MATE_2.png')}
                    style={{width:'80%',marginHorizontal:'auto'}}
                />

                <TouchableOpacity activeOpacity={0.8} style={styles.start}>
                    <Text style={styles.btn_text}>GET STARTED</Text>
                </TouchableOpacity>
            
            
                
            
        </View>
    )

}

export default App

const styles = StyleSheet.create({
    // image: {
    //     color: '#ff5733',
    //     fontSize: 30,
    //     fontWeight: 600,
    //     marginTop: 150
    // },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16, 
    },
    
})