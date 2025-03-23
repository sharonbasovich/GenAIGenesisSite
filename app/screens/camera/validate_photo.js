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


const PhotoValidate = () => {
    const [uri, setUri] = useState(null)
    const router = useRouter()
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null)
    const API_URL = "http://166.104.146.34:5000"; // Replace X with your actual IP
    const cloudName = "denroue1s"
    const apiKey = "823362473226329"
    const api_secret = "txnFvA2ykk49ulrm2eW5Waae_tw"

    useEffect(() => {
        if (params.image) {
            console.log(`URI: ${params.image}`)
            // setUri(params.image);
            setUri(params.image)
        }
    }, []);

    const retake =() => {
        setUri(null)
        setImage(null)
        router.push('/screens/camera')
    }

    const postPicture = async (uri) => {
        const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const formData = new FormData();
            formData.append('photo', {
              uri,
              name: `photo.${fileType}`,
              type: `image/${fileType}`,
            });
        const options = {
              method: 'POST',
              body: formData,
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              },
            };
            console.log('ags')
            const result = await fetch(apiUrl, options);
            console.log(result.json())
          }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
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

    const uploadImageToCloudinary = async (uri) => {
        console.log('cloudinary')
        console.log(uri)
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64});
        const blob = await fetch(`data:image/jpeg;base64,${base64}`).then(r => r.blob())
        console.log(blob)
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", "ml_default");
        formData.append("api_key", "823362473226329");

        try {
            const cloudinaryResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await cloudinaryResponse.json();
            if (!data.secure_url) {
                throw new Error(
                    "Cloudinary upload failed: " + JSON.stringify(data)
                );
            }

            //return data.secure_url; // Return the image URL from Cloudinary
            console.log(`cloud url: ${data.secure_url}`)
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            // throw new Error(
            //     "Error uploading image to Cloudinary: " +
            //         (error as Error).message
            // );
        }
    };

    // const storeData = async (value) => {
    //     try {
    //       const jsonValue = JSON.stringify(value);
    //       await AsyncStorage.setItem('uri_list', jsonValue);
    //     } catch (e) {
    //       console.log(`Error storing data: ${e}`)
    //     }
    //   };
    

    // const getData = async (key) => {
    //     try {
    //       const jsonValue = await AsyncStorage.getItem(key);
    //       return jsonValue != null ? JSON.parse(jsonValue) : null;
    //     } catch (e) {
    //       console.log(`Error getting data: ${e}`)
    //     }
    //   };

    // const upload = async (uri) => {
    //     console.log('send image to server')
    //     //store local uris
    //     try{
    //         // const data = await getData('uri_list')
    //         // if (data && data.url_list){
    //         //     console.log(`existing data ${data}`)
    //         //     data.uri_list.push({
    //         //         "uri": uri,
    //         //         "id": uri.split('/').slice(-1)[0]
    //         //     });
    //         //     console.log(`We now have ${data.length} uris`)
    //         //     await storeData({'uri_list':data})
    
    //         // } else {
    //         //     console.log(`Adding new data: ${uri}`)
    //         //     await storeData({
    //         //         'uri_list': [{
    //         //             "uri": uri,
    //         //             "id": uri.split('/').slice(-1)[0]
    //         //         }]
    //         //     });
    //         // }
    //         //send URI to the server
    //         const formData = new FormData()
    //         formData.append('image', {
    //             uri: uri,
    //             name: uri.split('/').pop(),
    //             type: 'image/jpeg'
    //         })

    //         const response = await fetch("http://166.104.146.34:5000/upload", {
    //             method: 'POST',
    //             body: formData,
    //             // Important: Do not set the Content-Type header explicitly
    //             // Let the browser set it with the correct boundary
    //           });
    //         if (!response.ok) {
    //             const errorText = await response.text()
    //             console.log(`Server error: ${errorText}`)
    //         }

    //         const result = await response.json()
    //         if (result.image_path) {
    //             setImagePath(result.image_path);
    //             console.log(`set the image path: ${imagePath}`)
    //         }
    //     } catch(e){
    //         console.log(`Exception: ${e}`)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const handleSummarize = async () => {
        if (!imagePath) return;
        
        setLoading(true);
        try {
          let response = await fetch(`${API_URL}/summarize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image_path: imagePath }),
          });
      
          let result = await response.json();
          console.log(result);  // Print the response to check the format
          setSummary(result.summary);
        } catch (error) {
          console.error("Error fetching summary:", error);
          setSummary("Failed to load summary.");
        } finally {
          setLoading(false);
        }
      };

    const content =  (
        <View style={styles.camera_area}>
        
            {image ? (
                // <Image 
                //     source={source(imagePath)}
                //     style={{ flex: 1, width: '100%', height: '100%' }}
                //     onError={(error) => console.log('Image loading error:', error)}
                // />
                <Image source={{ uri: image }}style={{ flex: 1, width: '100%', height: '100%' }} />
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
                    <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn} onPress={() => uploadImageToCloudinary(uri)}>
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