import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

const Nav = () => {
  const router = useRouter();

  const home = async () => {
    // console.log("home");
    router.push('screens/home');
  };

  const settings = async () => {
    // console.log("settings");
    router.push("screens/settings");
  };

  const camera = async () => {
    console.log("camera");
    router.push('screens/camera');
  };
  //home should send the user to the dashboard
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/MENU_MATE.png")}
        style={{ width: 60, height: 30, marginRight: 210 }}
      />

      {/* <div
        style={{
          backgroundColor: "transparent",
          width: 5,
          height: 40,
          marginRight: 40,
          marginLeft:40,
        }}
      /> */}

      <TouchableOpacity
        style={{ marginHorizontal: 4 }}
        activeOpacity={0.8}
        // style={styles.photo_btn}
        onPress={home}
      >
        <Image
          source={require("../assets/home.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginHorizontal: 4 }}
        activeOpacity={0.8}
        // style={styles.photo_btn}
        onPress={settings}
      >
        <Image
          source={require("../assets/settings.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginLeft: 4 }}
        activeOpacity={0.8}
        // style={styles.photo_btn}
        onPress={camera}
      >
        <Image
          source={require("../assets/camera.png")}
          style={{ width: 40, height: 34 }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default Nav;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    maxHeight: 60,
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    alignItems: "center",
  },
});
