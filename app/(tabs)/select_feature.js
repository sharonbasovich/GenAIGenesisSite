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
import { useState } from "react";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Nav from "../../components/Nav";

const SelectFeature = () => {
  const summary = () => {
    console.log("pressed summary button");
  };
  const suggestion = () => {
    console.log("pressed suggestion button");
  };
  const accesible = () => {
    console.log("pressed accesible button");
  };
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Nav />
      </View>

      <View style={styles.menu_display}>
        <View style={styles.menu}></View>
      </View>

      <View style={styles.button_container}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.photo_btn}
          onPress={accesible}
        >
          <Text style={styles.btn_text}>
            ACCESSIBLE
            {"\n"}
            MENU
          </Text>
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
          onPress={suggestion}
        >
          <Text style={styles.btn_text}>SUGGESTION</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

export default SelectFeature;

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
  menu_display: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    height: "50%",
    maxHeight: 350,
    alignItems: "center",
    justifyContent: "center",
  },
  button_container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "25%",
    // borderWidth:1,
    marginBottom: 40,
    maxHeight: 200,
    gap:20
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
    fontWeight: 800,
    textAlign: "center",
  },
});
