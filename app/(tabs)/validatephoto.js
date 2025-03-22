import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, Text, View, Pressable, TouchableOpacity } from "react-native";
import { useState } from 'react';
import { useRouter, Stack } from 'expo-router' 
// import Nav from '../../components/Nav'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'

const PhotoValidate = () => {

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
            

            <View style={styles.btn_container}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn}>
                    <FontAwesome name="check" size={35} color="#000"/>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn}>
                    <Entypo name="cross" size={55} color="#000"/>
                    {/* <Text>NO</Text> */}
                    </TouchableOpacity>

            </View>  
        </View>
    )

}

export default PhotoValidate

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
        borderRadius:'50%',
        borderWidth:1,
        padding: 5,
        width:90,
        height:90,
        alignItems:'center',
        justifyContent:'center'
    },
    btn_container: {
        flexDirection:'row',
        marginBottom:30,
        width:'50%',
        justifyContent:'space-between',
        alignItems:'center'
    }

})