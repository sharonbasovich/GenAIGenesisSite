import { StyleSheet, Text, View, Pressable, Image, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Foundation from "react-native-vector-icons/Foundation";
import Nav from "../../../components/Nav";
import { useEffect, useState } from "react";

// Simple function to format text with basic markdown-like styling
const formatMarkdown = (text) => {
  if (!text) return [];

  // Split the text into lines
  const lines = text.split('\n');
  
  return lines.map((line, index) => {
    // Check for headers
    if (line.startsWith('# ')) {
      return (
        <Text key={index} style={styles.h1}>
          {line.substring(2)}
        </Text>
      );
    } else if (line.startsWith('## ')) {
      return (
        <Text key={index} style={styles.h2}>
          {line.substring(3)}
        </Text>
      );
    } else if (line.startsWith('### ')) {
      return (
        <Text key={index} style={styles.h3}>
          {line.substring(4)}
        </Text>
      );
    } 
    // Check for bullet points
    else if (line.startsWith('- ')) {
      return (
        <View key={index} style={styles.bulletItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{line.substring(2)}</Text>
        </View>
      );
    }
    // Check for numbered list
    else if (/^\d+\.\s/.test(line)) {
      const number = line.split('.')[0];
      const content = line.substring(number.length + 2);
      return (
        <View key={index} style={styles.bulletItem}>
          <Text style={styles.bullet}>{number}.</Text>
          <Text style={styles.bulletText}>{content}</Text>
        </View>
      );
    }
    // Regular text
    else if (line.trim() !== '') {
      return <Text key={index} style={styles.paragraph}>{line}</Text>;
    }
    // Empty line
    else {
      return <View key={index} style={styles.emptyLine} />;
    }
  });
};

const MenuData = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [accessibleMenuText, setAccessibleMenuText] = useState("Loading accessible menu...");
  const [menuImage, setMenuImage] = useState(null);
  const [hasData, setHasData] = useState(false);

  // Debug info when component mounts
  useEffect(() => {
    console.log("MenuData component rendered");
    console.log("Params:", params);
    console.log("Global object keys:", Object.keys(global));
    
    if (global.menuData) {
      console.log("Found menuData in global:", global.menuData);
      setAccessibleMenuText(global.menuData.output || "No accessible menu data available.");
      setMenuImage(global.menuData.image || null);
      setHasData(true);
    } else {
      console.log("No menuData found in global");
      setAccessibleMenuText("No accessible menu data available. Please go back and try again.");
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
          <Text style={styles.titleText}>Accessible Menu</Text>
          
          {hasData ? (
            <>
              {menuImage && (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: menuImage }} style={styles.menuImage} />
                </View>
              )}
              
              <ScrollView style={styles.menuContainer}>
                {typeof accessibleMenuText === 'string' ? 
                  formatMarkdown(accessibleMenuText) : 
                  <Text style={styles.menuText}>{JSON.stringify(accessibleMenuText)}</Text>}
              </ScrollView>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{accessibleMenuText}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MenuData;

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
  menuContainer: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  // Markdown-style elements
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  h3: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 6,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 5,
  },
  bulletItem: {
    flexDirection: "row",
    marginVertical: 3,
    paddingLeft: 5,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 24,
    marginRight: 8,
    width: 15,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  emptyLine: {
    height: 10,
  },
  menuText: {
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