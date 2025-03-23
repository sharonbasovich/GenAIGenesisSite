import { StyleSheet, Text, View, Pressable, Image, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Foundation from "react-native-vector-icons/Foundation";
import Nav from "../../../components/Nav";
import { useEffect, useState } from "react";

const RecommendationData = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [recommendationText, setRecommendationText] = useState("Loading recommendations...");
  const [menuImage, setMenuImage] = useState(null);
  const [hasData, setHasData] = useState(false);

  // Debug info when component mounts
  useEffect(() => {
    console.log("RecommendationData component rendered");
    console.log("Params:", params);
    console.log("Global object keys:", Object.keys(global));
    
    if (global.recommendationData) {
      console.log("Found recommendationData in global:", global.recommendationData);
      setRecommendationText(global.recommendationData.output || "No recommendations available.");
      setMenuImage(global.recommendationData.image || null);
      setHasData(true);
    } else {
      console.log("No recommendationData found in global");
      setRecommendationText("No recommendation data available. Please go back and try again.");
      setHasData(false);
    }
  }, [params.timestamp]);

  const backToFeatureSelect = () => {
    console.log("Going back to feature selection");
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
          <Pressable onPress={backToFeatureSelect}>
            <Foundation name="arrow-left" size={50} />
          </Pressable>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>Menu Recommendations</Text>
          
          {hasData ? (
            <>
              {menuImage && (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: menuImage }} style={styles.menuImage} />
                </View>
              )}
              
              <ScrollView style={styles.recommendationContainer}>
                <Text style={styles.recommendationText}>{recommendationText}</Text>
              </ScrollView>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{recommendationText}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RecommendationData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
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
  contentContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  menuImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  recommendationContainer: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  recommendationText: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  }
});