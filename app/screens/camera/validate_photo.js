import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, Text, View, Pressable, TouchableOpacity } from "react-native";
import { Image } from 'expo-image'
import { useState,useEffect } from 'react';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router' 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Nav from '../../../components/Nav'
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'

const PhotoValidate = () => {
    const [uri, setUri] = useState(null)
    const router = useRouter()
    const params = useLocalSearchParams();

    useEffect(() => {
        if (params.image) {
            console.log(`URI: ${params.image}`)
            // setUri(params.image);
            setUri(params.image)
        }
    }, []);

    const retake =() => {
        setUri(null)
        router.push('/screens/camera')
    }

    const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem('uri_list', jsonValue);
        } catch (e) {
          console.log(`Error storing data: ${e}`)
        }
      };
    

    const getData = async (key) => {
        try {
          const jsonValue = await AsyncStorage.getItem(key);
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
          console.log(`Error getting data: ${e}`)
        }
      };

    const upload = async (uri) => {
        console.log('send image to server')
        //check if we already have uri stored
        const data = await getData('uri_list')
        if (data && data.url_list){
            console.log(`existing data ${data}`)
            data.uri_list.push({
                "uri": uri,
                "id": uri.split('/').slice(-1)[0]
            });
            console.log(`We now have ${data.length} uris`)
            await storeData({'uri_list':data})
        } else {
            console.log(`Adding new data: ${uri}`)
            await storeData({
                'uri_list': [{
                    "uri": uri,
                    "id": uri.split('/').slice(-1)[0]
                }]
            });
        }

        // let formData = new FormData();
        // formData.append('image', {
        //     uri: uri,
        //     name: 'test_image.jpg',
        //     type: 'jpeg'
        // });
        // try {
        //     let response = await fetch("http://127.0.0.1:5000/upload", {
        //         method: "POST",
        //         body: formData,
        //         headers: { 'Content-Type': 'multipart/form-data' }})

        //         let result = response.json()
        //         console.log(`status: ${result["status"]}`)
        // } catch(e){

        // }
    }
    // console.log(`URIIIIII: ${uri}`)
    const content =  (
        <View style={styles.camera_area}>
            {params.image ? (
                <Image 
                    source={{uri: params.image}}
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    onError={(error) => console.log('Image loading error:', error)}
                />
                // <Text>{params.image.split('/').slice(-1)[0]}</Text>
            ) : (
                <Text>No Photo Taken</Text>
            )}
        </View>
    )

    return(
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.header}>
                <Nav></Nav>
            </View>
            

            <View style={styles.camera_area}>
                {/* <Image 
                    source={{uri: uri}}
                    style={{flex:1,width:'100%','height':'100%'}}
                /> */}
                {content}
            </View>
            

            <View style={styles.btn_container}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn} onPress={() => upload(uri)}>
                    <FontAwesome name="check" size={35} color="#000"/>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn} onPress={retake}>
                    <Entypo name="cross" size={55} color="#000"/>
                    {/* <Text>NO</Text> */}
                    </TouchableOpacity>

            </View>  
        </View>
        </SafeAreaView>
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
        backgroundColor:'transparent'
    },
    camera_area: {
        width:'100%',
        backgroundColor: '#D9D9D9',
        height:'70%',
        marginBottom:20,
        alignItems:'center',
        justifyContent:'center'
    },
    image: {
        width:null,
        height:null,
        flex:1,
        resizeMode:'cover'
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