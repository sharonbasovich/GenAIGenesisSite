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

                <TouchableOpacity activeOpacity={0.8} style={styles.start} onPress={navApp}>
                    <Text style={styles.btn_text}>GET STARTED</Text>
                </TouchableOpacity>
        </View>
    )

}

export default App

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16, 
    },
    start: {
        backgroundColor:'#D9D9D9',
        padding:12,
        alignItems:'center',
        borderRadius:24
    },
    btn_text: {
        fontSize:28,
        fontWeight:700
    }
    
})