import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { Camera, CameraType, CameraView } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import Nav from "../../../components/Nav";
import ImageCompress from "../../../components/ImageCompress";
import ReadFile from "../../../components/ReadFile";

const Main = () => {
  const [hasCameraPermissions, setHasCameraPermissions] = useState(false);
  const [hasMediaPermissions, setHasMediaPermissions] = useState(false);

  const [uri,setUri] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageType,setImageType] = useState(null)
  const [imageName,setImageName] = useState(null)

  const [type, setType] = useState("back");
  const [loading, setLoading] = useState(false)
  const [flash, setFlash] = useState("off");
  const cameraRef = useRef(null);
  const router = useRouter();
  const cloudName = "denroue1s"
  const apiKey = "823362473226329"

  useEffect(() => {
    (async () => {
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermissions(cameraStatus.status === "granted")
      setHasMediaPermissions(mediaStatus.status === "granted");
    })();
  }, []);

  useEffect(()=> {
    console.log(`url: ${imageUrl}`)
    setLoading(false)
  },[imageUrl])

  const retake =() => {
    setImageUrl(null)
    router.push('/screens/camera')
  }

  const confirm = () => {
    router.push('/screens/home/')
  }


  const takePhoto = async () => {
    console.log("pressed photo button");
    if (cameraRef.current) {
      try {
        
        const data = await cameraRef.current?.takePictureAsync();
        console.log(data);
        setUri(data.uri)
        setType("image/jpg")
        setImageName(data.uri.split('/').slice(-1)[0])
        setLoading(true)

        if(data && data.uri){
            await MediaLibrary.saveToLibraryAsync(data.uri); // Save to device's media library
            Alert.alert("Photo Saved", "Photo saved to your device."); // Notify user
            // const compressed_uri = await ImageCompress(data.uri, { width:420, height:420 })
           
            //send pic to cloudinary
            console.log(data.uri)
            console.log("image/jpg")
            console.log(data.uri.split('/').slice(-1)[0])
            const formData = new FormData();
            formData.append("file", {
                "uri":data.uri,
                "type": "image/jpg",
                "name": data.uri.split('/').slice(-1)[0]
            });
            formData.append("upload_preset", "ml_default");
            formData.append("api_key", apiKey);

          
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
            setImageUrl(result.secure_url)
        

            //router.push({ pathname: `screens/camera/validate_photo`, query: { uri: image, type: "image/jpg", name: image.split('/').slice(-1)[0]}});
            // let bfile = await ReadFile(image)
            // console.log(`bfile: ${bfile}`)
        }
                
        }catch(e){
            console.log(`Exception: ${e}`)
            Alert.alert("Camera Error", "An error occurred taking the photo.");
            setUri(null)
            setImageUrl(null)
  
        }   
    }
  }
    const flip = () => {
        setType(type == "front"? "back": "front" );
      };

  if (hasCameraPermissions === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Nav />
      </View>

      <View style={styles.camera_area}>
        {loading ?  
        // <Text>Loading...</Text>
        <ActivityIndicator size="large" />
        :  !imageUrl ?
        <CameraView
          style={styles.camera}
          type={type}
          facing={type}
          ref={cameraRef}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.flip_btn}
            onPress={flip}
          >
            <MaterialCommunityIcons name="camera-flip" size={40} color="#000" />
          </TouchableOpacity>


        </CameraView>
        :
        <Image source={{uri: imageUrl}} styles={styles.image}/>
        
      }
      </View>
      {!imageUrl ?
      <View style={styles.btn_container2}>
          <TouchableOpacity
          activeOpacity={0.8}
          style={styles.photo_btn}
          onPress={takePhoto}
        >
          <Text style={styles.btn_text}>TAKE PHOTO</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.photo_btn} onPress={() => router.push('/screens/camera/upload_image')}>
                            <Text style={styles.btn_text}>UPLOAD A PICTURE</Text>
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
  );
};

export default Main;

const styles = StyleSheet.create({
  title: {
    color: "#ff5733",
    fontSize: 30,
    fontWeight: 600,
    marginTop: 150,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  header: {
    top: 0,
    width: "100%",
    height: "10%",
    maxHeight: 60,
    minHeight: 40,
    backgroundColor: "transparent",
  },
  camera_area: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    height: "70%",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // alignItems:'center',
    // justifyContent:'center'
  },
  camera: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  image: {
    maxHeight: '100%',
    maxWidth: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  photo_btn: {
    backgroundColor: "#54F2D6",
    borderRadius: 24,
    textAlign: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom:20,
    borderWidth: 1,
  },
  validate_btn: {
    backgroundColor:'#54F2D6',
    borderRadius:'50%',
    borderWidth:1,
    padding: 5,
    width:80,
    height:80,
    alignItems:'center',
    justifyContent:'center'
  },
  btn_text: {
    color: "#000000",
    fontSize: 20,
    fontWeight: 800,
    textAlign:'center'
  },
  flip_btn: {
    paddingHorizontal: 8,
  },
  btn_container: {
    flexDirection:'row',
    marginBottom:40,
    width:'70%',
    justifyContent:'space-between',
    alignItems:'center'
  },
  btn_container2: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:40,
    width: '70%',
}
});
