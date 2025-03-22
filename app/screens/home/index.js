import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Nav from "../../../components/Nav";

const Home = () => {
  const col_num = 2;
  const router = useRouter()
  const MENUS = [
    {
      id: "1",
      uri: "Menu 1",
    },
    {
      id: "2",
      uri: "Menu 2",
    },
    {
      id: "3",
      uri: "Menu 3",
    },
    {
      id: "4",
      uri: "Menu 4",
    },
    {
      id: "5",
      uri: "Menu 5",
    },
    {
      id: "6",
      uri: "Menu 6",
    },
    {
      id: "7",
      uri: "Menu 7",
    },
    {
      id: "8",
      uri: "Menu 8",
    },
  ];
  
  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      // error reading value
    }
  };

  const formatData = (data, numColumns) => {
    const num_full_rows = Math.floor(data.length / numColumns);

    let num_elements_in_last_row = data.length - num_full_rows * numColumns;
    while (
      num_elements_in_last_row != numColumns &&
      num_elements_in_last_row != 0
    ) {
      data.push({ key: `blank=${num_elements_in_last_row}`, empty: true });
      num_elements_in_last_row = num_elements_in_last_row + 1;
    }
    return data;
  };

  const open_selection =() => {
    console.log('open selection')
    router.push('/screens/home/select_feature')
  }

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Nav />
      </View>

      <Text style={styles.title}>YOUR MENUS</Text>

      <FlatList
        style={styles.menu_area}
        // data={formatData(MENUS, col_num)}
        data={formatData(() => getData('uri_list'), col_num)}
        columnWrapperStyle={styles.row} // Centering and spacing between columns
        contentContainerStyle={styles.list} // Centering list in screen
        renderItem={({ item }) => {
          if (item.empty == true) {
            return <View style={[styles.card, styles.item_invisible]} />;
          }
          console.log(item.id);
          return (
            <View style={styles.card} key={item.id}>
                <Pressable onPress={open_selection} style={{width:'100%', height:'100%',justifyContent:'center',alignItems:'center'}}>
                    <View>
                        {/* <Text style={styles.menu_title}>{item.uri}</Text> */}
                        <Image 
                          source={{uri: item.uri}}
                          style={{ flex: 1, width: '100%', height: '100%' }}/>
                    </View>
              </Pressable>
            </View>
          );
        }}
        numColumns={col_num}
      />
    </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  list: {
    flexGrow: 1, // Ensures content can expand
    // alignItems: "center", // Centers horizontally
    paddingVertical: 10,
    gap: 10,
  },
  row: {
    justifyContent: "space-between", // Ensures equal spacing between columns
    gap: 10, // Adds space between columns (supported in React Native 0.71+),
  },
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
    marginBottom: 20,
  },
  menu_area: {
    width: "100%",
    height: "60%",
    marginBottom: 20,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9D9D9",
    width: "50%",
    height: 200,
  },
  item_invisible: {
    backgroundColor: "transparent",
  },
  menu_title: {
    fontSize: 25,
  },
});
