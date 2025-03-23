import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Nav from "../../../components/Nav";
import Foundation from "react-native-vector-icons/Foundation";
import * as Speech from "expo-speech";


const SummaryMenu = () => {
  const [imagePath, setImagePath] = useState(null);
  if (!imagePath) return;
    
    setLoading(true);
    setSimpleMenu(null);
    setRecommendation(null);
    try {
      let response = fetch(`${API_URL}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image_path: imagePath,
          language: preferences.language,
          dietary_restrictions: preferences.dietary_restrictions,
          allergies: preferences.allergies,
          culture: preferences.culture
        }),
      });
  
      let result = response.json();
      setSummary(result.summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary("Failed to load summary.");
    } finally {
      setLoading(false);
    }

  const textToSpeech = async () => {
    const text = "this is text to speech";
    options = {};
    Speech.speak(text, options);
    console.log("pressed text to speech");
  };

  const backArrow = () => {
    console.log("pressed back arrow");
    router.push("/screens/home/select_feature");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="auto" />

        <View style={styles.header}>
          <Nav />
        </View>

        <View style={{ width: "100%", height: 40, paddingHorizontal: 15 }}>
          <Pressable onPress={backArrow}>
            <Foundation name="arrow-left" size={50} />
          </Pressable>
        </View>

        <Text style={styles.title}>SUMMARY MENU</Text>
        <View style={styles.menu}></View>

        <View style={styles.button_container}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.photo_btn}
            onPress={textToSpeech}
          >
            <MaterialCommunityIcons name="speaker-wireless" size={45} />
            <Text style={styles.btn_text}>
              READ IT
              {"\n"}
              TO ME
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SummaryMenu;

const styles = StyleSheet.create({
  title: {
    color: "#000",
    fontSize: 36,
    fontWeight: 800,
    marginBottom: 20,
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
  menu: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    height: "70%",
    maxHeight: 350,
    alignItems: "center",
    justifyContent: "center",
  },
  button_container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "10%",
    marginBottom: 20,
    minHeight: "fit-content",
  },
  photo_btn: {
    backgroundColor: "#54F2D6",
    borderRadius: 50,
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    width: "60%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  btn_text: {
    color: "#000000",
    fontSize: 19,
    fontWeight: 800,
    textAlign: "center",
  },
});
