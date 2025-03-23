import React, { useState, createContext, useContext } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, TextInput, Picker } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MenuReviewScreen from './src/screens/MenuReviewScreen'; // Import MenuReviewScreen
import { Platform } from 'react-native';
import Markdown from 'react-native-markdown-display';

// Create a context for user preferences
const PreferencesContext = createContext();

// Create a preferences provider component
function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState({
    language: 'English',
    dietary_restrictions: '',
    allergies: '',
    culture: ''
  });

  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

// Create a Settings screen
function SettingsScreen() {
  const { preferences, updatePreferences } = useContext(PreferencesContext);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      
      <View style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Language</Text>
        <Picker
          selectedValue={preferences.language}
          style={styles.picker}
          onValueChange={(value) => updatePreferences({ language: value })}
        >
          <Picker.Item label="English" value="English" />
          <Picker.Item label="Korean" value="Korean" />
          <Picker.Item label="Chinese" value="Chinese" />
          <Picker.Item label="French" value="French" />
        </Picker>
      </View>

      <View style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Dietary Restrictions</Text>
        <TextInput
          style={styles.input}
          value={preferences.dietary_restrictions}
          onChangeText={(text) => updatePreferences({ dietary_restrictions: text })}
          placeholder="e.g., Vegetarian, Vegan"
        />
      </View>

      <View style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Allergies</Text>
        <TextInput
          style={styles.input}
          value={preferences.allergies}
          onChangeText={(text) => updatePreferences({ allergies: text })}
          placeholder="e.g., Nuts, Shellfish"
        />
      </View>

      <View style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Cultural Preferences</Text>
        <TextInput
          style={styles.input}
          value={preferences.culture}
          onChangeText={(text) => updatePreferences({ culture: text })}
          placeholder="e.g., Asian, Mediterranean"
        />
      </View>
    </ScrollView>
  );
}

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const { preferences } = useContext(PreferencesContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [summary, setSummary] = useState(null);
  const [simpleMenu, setSimpleMenu] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Replace with your computer's actual IP address
  // You can find it by running 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux)
  const API_URL = "http://100.65.10.200:5000/"; // Replace X with your actual IP

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setSummary(null); // Clear previous summary
      setSimpleMenu(null); // Clear previous simple menu
      setRecommendation(null); // Clear previous recommendation
      uploadImage(result.assets[0].uri);
    }
  };
  const uploadImage = async (uri) => {
    setLoading(true);
    
    try {
      // Create a FormData object
      const formData = new FormData();
      
      // For web, we need to handle this differently
      if (Platform.OS === 'web') {
        // For web, we need to fetch the image as a blob
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Get the filename
        const filename = uri.split('/').pop();
        
        // Append the blob to FormData with the correct filename
        formData.append('image', blob, filename);
      } else {
        // For mobile, use the original approach
        formData.append('image', {
          uri: uri,
          name: uri.split('/').pop(),
          type: 'image/jpeg',
        });
      }
  
      // Send the request to your actual IP address, not localhost
      const response = await fetch("http://100.65.10.200:5000/upload", {
        method: 'POST',
        body: formData,
        // Important: Do not set the Content-Type header explicitly
        // Let the browser set it with the correct boundary
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      if (result.image_path) {
        setImagePath(result.image_path);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSummarize = async () => {
    if (!imagePath) return;
    
    setLoading(true);
    setSimpleMenu(null);
    setRecommendation(null);
    try {
      let response = await fetch(`${API_URL}/summarize`, {
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
  
      let result = await response.json();
      setSummary(result.summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary("Failed to load summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimpleMenu = async () => {
    if (!imagePath) return;
    
    setLoading(true);
    setSummary(null);
    setRecommendation(null);
    try {
      let response = await fetch(`${API_URL}/simple_menu`, {
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
  
      let result = await response.json();
      setSimpleMenu(result.simple_menu);
    } catch (error) {
      console.error("Error fetching simple menu:", error);
      setSimpleMenu("Failed to load simple menu.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendation = async () => {
    if (!imagePath) return;
    
    setLoading(true);
    setSummary(null);
    setSimpleMenu(null);
    try {
      let response = await fetch(`${API_URL}/recommendation`, {
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
  
      let result = await response.json();
      setRecommendation(result.recommendation);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      setRecommendation("Failed to load recommendation.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Menu Review</Text>
      <View style={styles.buttonContainer}>
        <Button title="Upload Menu Image" onPress={pickImage} />
        <View style={styles.buttonSpacing} />
        <Button 
          title="Settings" 
          onPress={() => navigation.navigate('Settings')}
          color="#666"
        />
      </View>
      
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
        </View>
      )}

      {/* Only show buttons when an image has been uploaded */}
      {imagePath && !loading && (
        <View style={styles.buttonContainer}>
          <Button
            title="Summarize"
            onPress={handleSummarize}
            color="#4CAF50"
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="Simple Menu"
            onPress={handleSimpleMenu}
            color="#2196F3"
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="Recommendation"
            onPress={handleRecommendation}
            color="#FF9800"
          />
        </View>
      )}

      {loading && (
        <Text style={styles.loadingText}>Processing...</Text>
      )}

      {summary && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>🍽️ Menu Summary:</Text>
          <Markdown style={styles.markdownText}>
            {summary}
          </Markdown>
        </View>
      )}

      {simpleMenu && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>🍽️ Simple Menu:</Text>
          <Markdown style={styles.markdownText}>
            {simpleMenu}
          </Markdown>
        </View>
      )}

      {recommendation && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>🍽️ Recommendation:</Text>
          <Markdown style={styles.markdownText}>
            {recommendation}
          </Markdown>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="MenuReview" component={MenuReviewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PreferencesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5fcff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonSpacing: {
    height: 10,
  },
  resultContainer: {
    width: '100%',
    backgroundColor: '#e6f7ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  markdownText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333", // Dark gray for readability
  },
  loadingText: {
    marginVertical: 20,
    fontSize: 16,
    color: '#666',
  },
  settingContainer: {
    width: '100%',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    width: '100%',
    height: 50,
  },
});

