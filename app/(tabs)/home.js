import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, Text, View, Pressable,ActivityIndicator, TouchableOpacity } from "react-native";
import { useState } from 'react';
import { useRouter, Stack } from 'expo-router' 
// import Nav from '../../components/Nav'

const Home = () => {
    const menus = ["A","B","C","D","E"]

    return(
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.header}>
                {/* <Stack.Screen options={{ header: () => <Nav /> }} /> */}
            </View>

            <Text style={styles.title}>
                YOUR MENUS
            </Text>
            

            <View style={styles.menu_area}>

            </View>
            
        </View>
    )

}

export default Home

const styles = StyleSheet.create({
    title: {
        color: '#000',
        fontSize: 30,
        fontWeight: 600,
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
    menu_area: {
        width:'100%',
        height:'80%',
        borderWidth:1
    }
})