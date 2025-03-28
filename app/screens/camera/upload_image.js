import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, Text, View, Pressable, TouchableOpacity, Platform } from "react-native";
import { Image } from 'expo-image'
import { useState,useEffect } from 'react';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router' 
import Nav from '../../../components/Nav'
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import * as FileSystem from 'expo-file-system';
import { collection, addDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { setLogLevel } from "firebase/app";


const UploadImage = () => {

    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null)
    const [cloudImage, setCloudImage] = useState(null)
    const cloudName = "denroue1s"
    const apiKey = "823362473226329"


    const retake =() => {
        setImage(null)
        setCloudImage(null)
        setLoading(false)
    }
    const confirm = () => {
        router.push('/screens/home/')
      }
    useEffect(()=> {
        if(image != null){
        console.log(`image uri: ${image}`)
        uploadImageToCloudinary()
        }
      },[image])

    useEffect(()=> {
        console.log(`url: ${cloudImage}`)
        setLoading(false)
      },[cloudImage])

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          base64:true,
          aspect: [4, 3],
          quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            console.log(`Picked Image ${result.assets[0].uri}`)
        }
    }

    const uploadImageToCloudinary = async () => {
        setLoading(true)
        console.log('cloudinary')
        console.log(`uri: ${image}`)
        console.log(`type: image/jpeg`)
        console.log(`image name: ${image.split('/')[-1][0]}`)
        // const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64});
        // const blob = await fetch(`data:image/jpeg;base64,${base64}`).then(r => r.blob())
        // console.log(blob)
        const formData = new FormData();
        formData.append("file", {
            "uri":image,
            "type": "image/jpg",
            "name": image.split('/')[-1][0]
        });
        formData.append("upload_preset", "ml_default");
        formData.append("api_key", apiKey);

        try {
            const cloudinaryResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const result = await cloudinaryResponse.json();
            if (!result.secure_url) {
                throw new Error(
                    "Cloudinary upload failed: " + JSON.stringify(result)
                );
            }

            //return data.secure_url; // Return the image URL from Cloudinary
            console.log(`cloud url: ${result.secure_url}`)
            setCloudImage(result.secure_url)
            
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            setLoading(false)
            // throw new Error(
            //     "Error uploading image to Cloudinary: " +
            //         (error as Error).message
            // );
        }
    };


    return(
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.header}>
                <Nav></Nav>
            </View>
            
            <View style={styles.camera_area}>
                {loading ?
                <ActivityIndicator size={"large"}/>
                : !cloudImage ? 
                    <Text>Upload Image Here</Text>
                :
                    <Image source={{uri: cloudImage}} style={styles.image}/>

                }
            </View>
            
            {!image ?
                <View style={styles.btn_container2}>

                <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn} onPress={pickImage}>
                    <Text style={styles.btn_text}>UPLOAD A PICTURE</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn} onPress={()=> router.push('/screens/camera/')}>
                <Text style={styles.btn_text}>CAMERA</Text>
                </TouchableOpacity>
                </View>
            :
            <View style={styles.btn_container}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.validate_btn} onPress={confirm}>
                    <FontAwesome name="check" size={35} color="#000"/>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} style={styles.validate_btn} onPress={retake}>
                    <Entypo name="cross" size={55} color="#000"/>
                    {/* <Text>NO</Text> */}
                    </TouchableOpacity>

            </View>  
            }
        </View>
        </SafeAreaView>
    )

}

export default UploadImage

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
        maxHeight: '100%',
        maxWidth: '100%',
        height: '100%',
        objectFit: 'contain'
      },
      btn_text: {
        color: "#000000",
        fontSize: 20,
        fontWeight: 800,
        textAlign:'center'
      },
    photo_btn: {
        backgroundColor: "#54F2D6",
        borderRadius: 24,
        textAlign: "center",
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 1,
      },
    validate_btn: {
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
        width:'70%',
        justifyContent:'space-between',
        alignItems:'center'
    },
    btn_container2: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom:15,
        width: '70%'
    }

})