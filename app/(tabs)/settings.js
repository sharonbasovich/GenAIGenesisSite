import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import Nav from "../../components/Nav";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

const data = [
  { label: "Afrikaans", value: "Afrikaans" },
  { label: "Albanian", value: "Albanian" },
  { label: "Amharic", value: "Amharic" },
  { label: "Arabic", value: "Arabic" },
  { label: "Armenian", value: "Armenian" },
  { label: "Azerbaijani", value: "Azerbaijani" },
  { label: "Basque", value: "Basque" },
  { label: "Belarusian", value: "Belarusian" },
  { label: "Bengali", value: "Bengali" },
  { label: "Bosnian", value: "Bosnian" },
  { label: "Bulgarian", value: "Bulgarian" },
  { label: "Catalan", value: "Catalan" },
  { label: "Cebuano", value: "Cebuano" },
  { label: "Chichewa", value: "Chichewa" },
  { label: "Chinese", value: "Chinese" },
  { label: "Corsican", value: "Corsican" },
  { label: "Croatian", value: "Croatian" },
  { label: "Czech", value: "Czech" },
  { label: "Danish", value: "Danish" },
  { label: "Dutch", value: "Dutch" },
  { label: "English", value: "English" },
  { label: "Esperanto", value: "Esperanto" },
  { label: "Estonian", value: "Estonian" },
  { label: "Filipino", value: "Filipino" },
  { label: "Finnish", value: "Finnish" },
  { label: "French", value: "French" },
  { label: "Galician", value: "Galician" },
  { label: "Georgian", value: "Georgian" },
  { label: "German", value: "German" },
  { label: "Greek", value: "Greek" },
  { label: "Gujarati", value: "Gujarati" },
  { label: "Haitian Creole", value: "Haitian Creole" },
  { label: "Hausa", value: "Hausa" },
  { label: "Hebrew", value: "Hebrew" },
  { label: "Hindi", value: "Hindi" },
  { label: "Hmong", value: "Hmong" },
  { label: "Hungarian", value: "Hungarian" },
  { label: "Icelandic", value: "Icelandic" },
  { label: "Igbo", value: "Igbo" },
  { label: "Indonesian", value: "Indonesian" },
  { label: "Irish", value: "Irish" },
  { label: "Italian", value: "Italian" },
  { label: "Japanese", value: "Japanese" },
  { label: "Javanese", value: "Javanese" },
  { label: "Kannada", value: "Kannada" },
  { label: "Kazakh", value: "Kazakh" },
  { label: "Khmer", value: "Khmer" },
  { label: "Korean", value: "Korean" },
  { label: "Kurdish", value: "Kurdish" },
  { label: "Kyrgyz", value: "Kyrgyz" },
  { label: "Lao", value: "Lao" },
  { label: "Latin", value: "Latin" },
  { label: "Latvian", value: "Latvian" },
  { label: "Lithuanian", value: "Lithuanian" },
  { label: "Luxembourgish", value: "Luxembourgish" },
  { label: "Macedonian", value: "Macedonian" },
  { label: "Malagasy", value: "Malagasy" },
  { label: "Malay", value: "Malay" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Maltese", value: "Maltese" },
  { label: "Maori", value: "Maori" },
  { label: "Marathi", value: "Marathi" },
  { label: "Mongolian", value: "Mongolian" },
  { label: "Myanmar", value: "Myanmar" },
  { label: "Nepali", value: "Nepali" },
  { label: "Norwegian", value: "Norwegian" },
  { label: "Pashto", value: "Pashto" },
  { label: "Persian", value: "Persian" },
  { label: "Polish", value: "Polish" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Punjabi", value: "Punjabi" },
  { label: "Romanian", value: "Romanian" },
  { label: "Russian", value: "Russian" },
  { label: "Serbian", value: "Serbian" },
  { label: "Sesotho", value: "Sesotho" },
  { label: "Shona", value: "Shona" },
  { label: "Sindhi", value: "Sindhi" },
  { label: "Sinhala", value: "Sinhala" },
  { label: "Slovak", value: "Slovak" },
  { label: "Slovenian", value: "Slovenian" },
  { label: "Somali", value: "Somali" },
  { label: "Spanish", value: "Spanish" },
  { label: "Sundanese", value: "Sundanese" },
  { label: "Swahili", value: "Swahili" },
  { label: "Swedish", value: "Swedish" },
  { label: "Tagalog", value: "Tagalog" },
  { label: "Tamil", value: "Tamil" },
  { label: "Telugu", value: "Telugu" },
  { label: "Thai", value: "Thai" },
  { label: "Turkish", value: "Turkish" },
  { label: "Ukrainian", value: "Ukrainian" },
  { label: "Urdu", value: "Urdu" },
  { label: "Uzbek", value: "Uzbek" },
  { label: "Vietnamese", value: "Vietnamese" },
  { label: "Welsh", value: "Welsh" },
  { label: "Xhosa", value: "Xhosa" },
  { label: "Yiddish", value: "Yiddish" },
  { label: "Yoruba", value: "Yoruba" },
  { label: "Zulu", value: "Zulu" },
];

const PhotoValidate = () => {
  const [uri, setUri] = useState(null);
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.image) {
      console.log(`URI: ${params.image}`);
      setUri(params.image);
    }
  }, []);
  const retake = () => {
    router.push("/");
  };

  console.log(`URIIIIII: ${uri}`);
  const content = (
    <View style={styles.camera_area}>
      {uri ? (
        <Image
          source={{ uri: uri }} // Ensure correct object format
          style={{ flex: 1, width: "100%", height: "100%" }}
        />
      ) : (
        <Text>No Photo Taken</Text>
      )}
    </View>
  );

  //dropdown code
  const [value, setValue] = useState(null);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };

  //text box
  const [text1, onChangeText1] = React.useState("");
  const [text2, onChangeText2] = React.useState("");
  const [text3, onChangeText3] = React.useState("");

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Nav></Nav>
      </View>

      <View style={styles.settings_area}>
        <Text style={styles.title}>SETTINGS</Text>
        <Text style={styles.title2}>Language</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={value}
          onChange={(item) => {
            setValue(item.value);
          }}
          renderLeftIcon={() => (
            <Entypo
              style={styles.icon}
              color="black"
              name="language"
              size={20}
            />
          )}
          renderItem={renderItem}
        />
        <Text style={styles.title2}>Allergies</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText1}
          value={text1}
          placeholder="What are your allergies?"
          multiline={true}
          textAlignVertical="top"
        />
        <Text style={styles.title2}>Food Preferences</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText2}
          value={text2}
          placeholder="What foods can you eat and which ones do you avoid?"
          multiline={true}
          textAlignVertical="top"
        />
        <Text style={styles.title2}>Allergies</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText3}
          value={text3}
          placeholder="Describe your culture"
          multiline={true}
          textAlignVertical="top"
        />
        <Text style={styles.title2}>Priorities</Text>
      </View>
    </View>
  );
};

export default PhotoValidate;

const styles = StyleSheet.create({
  title: {
    color: "#000",
    fontSize: 36,
    fontWeight: 800,
    // marginBottom: -20,
  },
  title2: {
    color: "#000",
    fontSize: 24,
    fontWeight: 800,
    marginTop: 16,
  },
  input: {
    height: 80,
    width: 300,
    borderWidth: 2,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    // justifyContent: "space-between",
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
  settings_area: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    marginBottom: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 10,
  },
  image: {
    width: null,
    height: null,
    flex: 1,
    resizeMode: "cover",
  },
  photo_btn: {
    backgroundColor: "#54F2D6",
    borderRadius: "50%",
    borderWidth: 1,
    padding: 5,
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  btn_container: {
    flexDirection: "row",
    marginBottom: 30,
    width: "50%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdown: {
    marginTop: 16,
    height: 50,
    width: 300,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "black",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    width: 250,
    // left: -5,
    fontSize: 16,
  },
});
