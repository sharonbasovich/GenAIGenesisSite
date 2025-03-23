import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Foundation from "react-native-vector-icons/Foundation";
import Nav from "../../../components/Nav";
import * as ImagePicker from "expo-image-picker";

const BACKEND_URL = "YOUR_URL"; 

const SelectFeature = () => {
  const router = useRouter();
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImagePath, setUploadedImagePath] = useState("");

  const getImageFileInfo = (asset) => {
    if (!asset || !asset.uri) {
      throw new Error("선택된 이미지의 정보가 올바르지 않습니다.");
    }
    const { uri } = asset;
    let { fileName } = asset;
    if (!fileName) {
      const uriParts = uri.split("/");
      fileName = uriParts.length > 0 ? uriParts[uriParts.length - 1] : `photo.jpg`;
    }
    const parts = fileName.split(".");
    const ext = parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
    let mimeType = "image/jpeg";
    if (ext === "png") {
      mimeType = "image/png";
    } else if (ext === "jpg" || ext === "jpeg") {
      mimeType = "image/jpeg";
    }
    return { fileName, mimeType };
  };

  const uploadImage = async (asset) => {
    try {
      setLoading(true);
      const { uri } = asset;
      const { fileName, mimeType } = getImageFileInfo(asset);
      const formData = new FormData();

      if (uri.startsWith("data:")) {
        const res = await fetch(uri);
        const blob = await res.blob();
        formData.append("image", blob, fileName);
      } else {
        formData.append("image", {
          uri,
          type: mimeType,
          name: fileName,
        });
      }

      // 이미지 업로드 호출
      const uploadResponse = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadResult = await uploadResponse.json();
      console.log("업로드 응답:", uploadResult);

      if (uploadResult.image_path) {
        setUploadedImagePath(uploadResult.image_path);
      } else {
        setOutputText("Error: Image upload failed.");
      }
    } catch (error) {
      console.error("이미지 업로드 에러:", error);
      setOutputText("Error uploading image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchResult = async (endpoint, globalKey) => {
    if (!uploadedImagePath) {
      alert("No image uploaded. Please upload an image first.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_path: uploadedImagePath }),
      });
      const result = await response.json();
      console.log(`${endpoint} 응답:`, result);
      let resultText = "";
      if (endpoint === "summarize") {
        resultText = result.summary || "No summary available.";
      } else if (endpoint === "simple_menu") {
        resultText = result.simple_menu || "No summary available.";
      } else if (endpoint === "recommendation") {
        resultText = result.recommendation || "No recommendation available.";
      }
      setOutputText(resultText);
      // 전역 변수에 결과 저장 (각 페이지에서 이 값을 읽어 출력)
      global[globalKey] = {
        output: resultText,
        image: selectedImage,
      };
      // 해당 페이지로 이동 (AccessibleMenu, SummaryMenu, RecommendationMenu)
      console.log('globalkey', globalKey)
      router.push({
        pathname: `/screens/home/${globalKey}`,
        params: { timestamp: new Date().getTime() },
      });
    } catch (error) {
      console.error(`${endpoint} 호출 에러:`, error);
      setOutputText(`Error fetching ${endpoint}: ` + error.message);
    } finally {
      setLoading(false);
    }
  };



  // 이미지 선택 함수 (업로드만 수행)
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // data URL 반환
    });
    console.log("picker result:", result);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      console.log("선택된 asset:", asset);
      setSelectedImage(asset.uri);
      await uploadImage(asset);
    } else {
      console.log("이미지 선택이 취소되었습니다.");
    }
  };


  const accesible = () => {
    console.log("ACCESSIBLE MENU 버튼 클릭됨");
    if (!uploadedImagePath) {
      alert("Please upload an image first.");
      return;
    }
    fetchResult("simple_menu", "menuData");
  };

  const summary = () => {
    console.log("SUMMARY 버튼 클릭됨");
    if (!uploadedImagePath) {
      alert("Please upload an image first.");
      return;
    }
    // summary: /simple_menu 엔드포인트 사용, 결과 저장은 global.summaryData
    fetchResult("summarize", "summaryData");
  };

  const recommendation = () => {
    console.log("RECOMMENDATION 버튼 클릭됨");
    if (!uploadedImagePath) {
      alert("Please upload an image first.");
      return;
    }
    // recommendation: /recommendation 엔드포인트 사용, 결과 저장은 global.recommendationData
    fetchResult("recommendation", "recommendationData");
  };

  const backToMenu = () => {
    console.log("back to menu");
    router.push("/screens/home/");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <Nav />
        </View>
        <View style={{ width: "100%", height: 40, paddingHorizontal: 15 }}>
          <Pressable onPress={backToMenu}>
            <Foundation name="arrow-left" size={50} />
          </Pressable>
        </View>
        <View style={styles.menu_display}>
          {/* <View style={styles.menu}></View> */}
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          )}
        </View>
        <View style={styles.button_container}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.photo_btn}
            onPress={pickImage}
          >
            <Text style={styles.btn_text}>UPLOAD IMAGE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.photo_btn}
            onPress={accesible}
          >
            <Text style={styles.btn_text}>ACCESSIBLE{"\n"}MENU</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.photo_btn}
            onPress={summary}
          >
            <Text style={styles.btn_text}>SUMMARY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.photo_btn}
            onPress={recommendation}
          >
            <Text style={styles.btn_text}>RECOMMENDATION</Text>
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size="large" color="#54F2D6" />}
      </View>
    </SafeAreaView>
  );
};

export default SelectFeature;

const styles = StyleSheet.create({
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
  menu_display: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    height: "50%",
    maxHeight: 350,
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    width: "100%",
    height: "100%",
  },
  previewImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 10,
  },
  button_container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "25%",
    marginBottom: 70,
    maxHeight: 200,
    gap: 20,
  },
  photo_btn: {
    backgroundColor: "#54F2D6",
    borderRadius: 50,
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    width: "60%",
  },
  btn_text: {
    color: "#000000",
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
  },
});
