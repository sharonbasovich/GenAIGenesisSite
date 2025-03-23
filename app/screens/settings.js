import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import Nav from "../../components/Nav";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Checkbox from "expo-checkbox";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { Platform } from "react-native";


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

const Settings = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [audioUri, setAudioUri] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [durationTimer, setDurationTimer] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [summary, setSummary] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://100.65.10.200:5000";

  // const getData = async (key) => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem(key);
  //     return jsonValue != null ? JSON.parse(jsonValue) : [];
  //   } catch (e) {
  //     // error reading value
  //   }
  // };

  // Request permissions for audio recording
  useEffect(() => {
    const getPermissions = async () => {
      try {
        const audioPermission = await Audio.requestPermissionsAsync();
        if (audioPermission.status !== "granted") {
          setError("Permission to access microphone is required!");
        }
      } catch (err) {
        console.error("Failed to get permissions:", err);
        setError("Failed to get microphone permissions");
      }
    };

    getPermissions();

    // Clean up recording when component unmounts
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  //DIFFERENT

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("uri_list", jsonValue);
    } catch (e) {
      console.log(`Error storing data: ${e}`);
    }
  };

  //dropdown code
  const [value, setValue] = useState(null);
  const [isChecked1, setChecked1] = useState(false);
  const [isChecked2, setChecked2] = useState(false);

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

  /////

  //text box
  const [text1, onChangeText1] = React.useState("");
  const [text2, onChangeText2] = React.useState("");
  const [text3, onChangeText3] = React.useState("");

  const confirmSettings = async () => {
    const settings = {
      settings: {
        language: value ? value : "None",
        allergies: text1 ? text1 : "None",
        food_preferences: text2 ? text2 : "None",
        culture: text3 ? text3 : "None",
        prioritize_value_per_dollar: isChecked1 ? "Yes" : "No",
        prioritize_sustainable_ingredients: isChecked2 ? "Yes" : "No",
      },
    };

    await storeData(settings);
    console.log("settings confirmed");
  };

  const [isRecording, setIsRecording] = React.useState(false); // Track recording state
  const [activeMic, setActiveMic] = React.useState(null); // Track which mic started recording

  // Start recording function
  const startRecording = async () => {
    try {
      setError(null);
      setTranscription(null); // Clear previous transcription
      setAudioUri(null); // Clear previous audio URI

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      setRecording(recording);
      setRecordingStatus("recording");

      // Start timer to track recording duration
      const timer = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      setDurationTimer(timer);

      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
      setError("Failed to start recording: " + err.message);
    }
    // setIsRecording(true); // Set recording state to true
    // setActiveMic(mic); // Set the active mic
  };

  // Stop recording function
  const stopRecording = async () => {
    console.log("Stopping recording...");

    if (!recording) {
      return;
    }

    try {
      // Stop the recording
      await recording.stopAndUnloadAsync();

      // Stop the duration timer
      if (durationTimer) {
        clearInterval(durationTimer);
        setDurationTimer(null);
      }

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      // Get the recorded file's URI
      const uri = recording.getURI();
      console.log("this is the ", uri);
      setAudioUri(uri);
      console.log("after usestate", audioUri);
      setRecording(null);
      setRecordingStatus("idle");

      console.log("Recording stopped and stored at", uri);

      // Here you would typically send the URI to your backend
      // handleSendAudioToBackend(uri);
    } catch (err) {
      console.error("Failed to stop recording", err);
      setError("Failed to stop recording: " + err.message);

      // Reset state even on error
      setRecording(null);
      setRecordingStatus("idle");
    }
    // setIsRecording(false);
    // setActiveMic(null); // Reset active mic
    // handleTranscribe();
    console.log("transcribing");
  };

  const handlePress = (mic) => {
    if (!isRecording) {
      startRecording(mic);
    } else if (activeMic === mic) {
      stopRecording();
    }
  };

  const handlePressTest = () => {
    if (!isRecording) {
      setIsRecording(true);
      startRecording();
    } else {
      setIsRecording(false);

      stopRecording();
    }
  };

  const handleTranscribe = async () => {
    console.log(audioUri);
    if (!audioUri) {
      setError("No audio recording available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let formData = new FormData();
      if (Platform.OS === "web") {
        const response = await fetch(audioUri);
        const blob = await response.blob();
        formData.append("audio", blob, "recording.wav");
      } else {
        formData.append("audio", {
          uri: audioUri,
          name: audioUri.split("/").pop(),
          type: "audio/wav",
        });
      }

      console.log("Sending audio file to backend for transcription:", audioUri);

      let response = await fetch(`${API_URL}/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let result = await response.json();
      console.log("Transcription result:", result);

      setTranscription(result.transcript);
    } catch (error) {
      console.error("Error fetching transcription:", error);
      setError("Failed to load transcription: " + error.message);
      setTranscription(null);
    } finally {
      setLoading(false);
    }
  };

  // Button press handlers
  const handlePress1 = () => handlePress(1);
  const handlePress2 = () => handlePress(2);
  const handlePress3 = () => handlePress(3);

  // Disable all other buttons when recording starts
  const isDisabled = (mic) => isRecording && activeMic !== mic;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
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
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.mic_btn1}
              onPress={handlePress1}
              disabled={isDisabled(1)}
            >
              <FontAwesome name="microphone" size={40} />
            </TouchableOpacity>
            <Text style={styles.title2}>Food Preferences</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText2}
              value={text2}
              placeholder="What foods can you eat and which ones do you avoid?"
              multiline={true}
              textAlignVertical="top"
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.mic_btn2}
              // style={[styles.mic_btn2, disabledStyle2]}
              onPress={handlePress2}
              disabled={isDisabled(2)}
            >
              <FontAwesome name="microphone" size={40} />
            </TouchableOpacity>
            <Text style={styles.title2}>Describe Your Culture</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText3}
              value={text3}
              placeholder="Describe your culture"
              multiline={true}
              textAlignVertical="top"
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.mic_btn3}
              // style={[styles.mic_btn3, disabledStyle3]}
              onPress={handlePress3}
              disabled={isDisabled(3)}
            >
              <FontAwesome name="microphone" size={40} />
            </TouchableOpacity>
            <Text style={styles.title3}>Priorities</Text>

            <View style={styles.bottom_container}>
              <View style={styles.checkboxbox}>
                <View style={styles.section}>
                  <Checkbox
                    style={{ marginRight: 5 }}
                    value={isChecked1}
                    onValueChange={setChecked1}
                  />
                  <Text>Sustainable Ingredients</Text>
                </View>
                <View style={styles.section}>
                  <Checkbox
                    style={{ marginRight: 5 }}
                    value={isChecked2}
                    onValueChange={setChecked2}
                  />
                  <Text>Value per dollar</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.8}
                onPress={confirmSettings}
              >
                <Text style={{ fontSize: 15, color: "#000", fontWeight: 800 }}>
                  CONFIRM
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  section: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  inlineSTT: {
    width: "100%",
    right: 50,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
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
  title3: {
    color: "#000",
    fontSize: 24,
    fontWeight: 800,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 80,
    width: 250,
    borderWidth: 2,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "transparent",
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
  btn: {
    backgroundColor: "#54F2D6",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  bottom_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
  mic_btn1: {
    backgroundColor: "#54F2D6",
    borderRadius: "50%",
    borderWidth: 1,
    // padding: 5,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 290,
    top: 245,
  },
  mic_btn2: {
    backgroundColor: "#54F2D6",
    borderRadius: "50%",
    borderWidth: 1,
    // padding: 5,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 290,
    top: 385,
  },
  mic_btn3: {
    backgroundColor: "#54F2D6",
    borderRadius: "50%",
    borderWidth: 1,
    // padding: 5,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 290,
    top: 523,
  },
});
