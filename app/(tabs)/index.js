import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, Text, View, Pressable, Alert,ActivityIndicator, TouchableOpacity } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router' 

const Main = () => {

    const photo = () => {
        console.log('pressed photo button')
    }
    return(
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.title}>
                Menu Main
            </Text>
            <Pressable onPress={photo}>
                <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn}>
                    <Text style={styles.btn_text}>Take Photo</Text>
                </TouchableOpacity>
            </Pressable>
            
        </View>
    )

}

export default Main

const styles = StyleSheet.create({
    title: {
        color: '#ff5733',
        fontSize: 30,
        fontWeight: 600,
        marginTop: 150
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16, 
    },
    photo_btn: {
        backgroundColor:'#a9a5a5',
        borderRadius:12,
        textAlign:'center',
        paddingHorizontal: 15,
        paddingVertical:12,
        marginBottom: 200
    },
    btn_text: {
        color: '#fff',
        fontSize: 22,
        fontWeight:500
    }
})