import { StatusBar } from "expo-status-bar";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Alert
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { Camera, CameraType, CameraView } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRouter, Stack, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Nav from "../../../components/Nav";

const Main = () => {
  const [hasCameraPermissions, setHasCameraPermissions] = useState(false);
  const [hasMediaPermissions, setHasMediaPermissions] = useState(false);

  const [image, setImage] = useState(null);
  const [type, setType] = useState("back");
  const [flash, setFlash] = useState("off");
  const cameraRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermissions(cameraStatus.status === "granted")
      setHasMediaPermissions(mediaStatus.status === "granted");
    })();
  }, []);

  
  const takePhoto = async () => {
    console.log("pressed photo button");
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current?.takePictureAsync();
        console.log(data);

        if(data && data.uri){
          try {
            // Save the original image to the device's media library
            await MediaLibrary.saveToLibraryAsync(data.uri);
        
            // Resize and compress the image
            const manipResult = await ImageManipulator.manipulateAsync(
              data.uri,
              [{ resize: { width: 420, height: 420 } }], // Resize to 420x420
              { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Compress to 50% quality
            );
        
            console.log('Manipulated Image:', manipResult);
        
            // Convert the manipulated image to a base64 string
            const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
        
            console.log('Base64 String:', base64);
            console.log(base64)
            // router.push({ pathname: `screens/camera/validate_photo`, params: { image: data.uri } });

          } catch (saveError) {
            console.error("Error saving photo:", saveError);
            Alert.alert("Save Failed", "Failed to save the photo."); // Inform user of failure
          }
        }
                
        }catch(e){
            console.log(`Exception: ${e}`)
            Alert.alert("Camera Error", "An error occurred taking the photo.");
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
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.photo_btn}
        onPress={takePhoto}
      >
        <Text style={styles.btn_text}>TAKE PHOTO</Text>
      </TouchableOpacity>
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
    height: "60%",
    marginBottom: 20,
    // alignItems:'center',
    // justifyContent:'center'
  },
  camera: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  photo_btn: {
    backgroundColor: "#54F2D6",
    borderRadius: 24,
    textAlign: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 60,
    borderWidth: 1,
  },
  btn_text: {
    color: "#000000",
    fontSize: 22,
    fontWeight: 800,
  },
  flip_btn: {
    paddingHorizontal: 8,
  },
});
