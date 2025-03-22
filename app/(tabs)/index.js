import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, Text, View, Pressable,ActivityIndicator, TouchableOpacity } from "react-native";
import { useState } from 'react';
import { useRouter, Stack } from 'expo-router' 
// import Nav from '../../components/Nav'

const Main = () => {

    const photo = () => {
        console.log('pressed photo button')
    }
    return(
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.header}>
                {/* <Stack.Screen options={{ header: () => <Nav /> }} /> */}
            </View>
            

            <View style={styles.camera_area}>
                <Text>

                    Camera
                </Text>
            </View>
            


                <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn} onPress={photo}>
                    <Text style={styles.btn_text}>TAKE PHOTO</Text>
                </TouchableOpacity>
            
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
    header:{
        top:0,
        width:'100%',
        height:'10%',
        maxHeight:60,
        minHeight:40,
        backgroundColor:'#D9D9D9'
    },
    camera_area: {
        width:'100%',
        backgroundColor: '#D9D9D9',
        height:'70%',
        marginBottom:20,
        alignItems:'center',
        justifyContent:'center'
    },
    photo_btn: {
        backgroundColor:'#54F2D6',
        borderRadius:24,
        textAlign:'center',
        paddingHorizontal: 15,
        paddingVertical:12,
        marginBottom: 60,
        borderWidth:1
    },
    btn_text: {
        color: '#000000',
        fontSize: 22,
        fontWeight:700
    }
})