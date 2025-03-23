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
import * as ImagePicker from 'expo-image-picker';
import { db, app } from "../../firebaseConfig";
import { getAuth } from 'firebase/auth'
import { collection, addDoc, updateDoc, getDocs, doc, query, where } from "firebase/firestore";


const PhotoValidate = () => {
    const [uri, setUri] = useState(null)
    const router = useRouter()
    
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [imagePath, setImagePath] = useState(null)
    const [summary, setSummary] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const cloudName = "denroue1s"
    const apiKey = "823362473226329"
    const api_secret = "txnFvA2ykk49ulrm2eW5Waae_tw"
    const auth = getAuth(app)
    //get the user data needed to be displayed in the profile
    let email = auth.currentUser?.email
    email = email.toLowerCase()

    useEffect(() => {
        if (params.image) {
            console.log(`URI: ${params.image}`)
            // setUri(params.image);
            setUri(params.image)
        }
    }, []);

    const retake =() => {
        setUri(null)
        setImagePath(null)
        router.push('/screens/camera')
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          setSelectedImage(result.assets[0].uri);
          setSummary(null); // Clear previous summary
          uploadImageToCloudinary(result.assets[0].uri);
        }
      };
    

    const uploadImageToCloudinary = async (uri) => {
        console.log('cloudinary')
        console.log(uri)
        const response = await fetch(uri);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", "ml_default");
        formData.append("api_key", apiKey);

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
            setImagePath(data.secure_url)
            //add the url to firestore
            const usersRef = collection(db, "users")
            const emailSnapShot = await getDocs(query(usersRef, where("email", "==", email)))
            if(emailSnapShot.empty){
                        console.log(`An account with this email ${email} does not exist`)
            } else {
                //create the new user in the auth
                const userDoc = emailSnapShot.docs[0];
                const userDocRef = doc(db, "user", userDoc.id);

                await updateDoc(userDocRef, {
                    images: arrayUnion(data.secure_url),
                  });
                  console.log('added image')
            }
            
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            // throw new Error(
            //     "Error uploading image to Cloudinary: " +
            //         (error as Error).message
            // );
        }
    };


    const content =  (
        <View style={styles.camera_area}>
        
            {imagePath ? (
                // <Image 
                //     source={source(imagePath)}
                //     style={{ flex: 1, width: '100%', height: '100%' }}
                //     onError={(error) => console.log('Image loading error:', error)}
                // />
                <Image source={{ uri: imagePath }}style={{ flex: 1, width: '100%', height: '100%' }} />
            ) : (
                <Text style={{fontSize:30}}>Upload an image</Text>
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
                    <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn} onPress={pickImage}>
                    <FontAwesome name="upload" size={35} color="#000"/>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn} onPress={retake}>
                    <Entypo name="camera" size={55} color="#000"/>
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
        height:'50%',
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:'auto'
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
        marginBottom:70,
        width:'70%',
        justifyContent:'space-between',
        alignItems:'center'
    }

})