import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useRouter, Stack } from "expo-router";
import Nav from "../../../components/Nav";
import { auth, app, db } from "../../firebaseConfig"
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, addDoc, query, arrayUnion } from 'firebase/firestore';

const Home = () => {
  const col_num = 2;
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageArray, setImageArray] = useState([])

  const auth = getAuth(app)
  const email = auth.currentUser?.email

  useEffect(()=> {
    if(imageArray){
      console.log(`url: ${imageArray}`)
      setLoading(false)
    }
  },[imageArray])
  
  const setImageData = async () => {
    try{
      const userRef = collection(db, "users")
      const userSnapShot = await getDocs(query(userRef, where("email","==",email)))
      const user = []
      if(!userSnapShot.empty){
        user.push({"url array":userSnapShot[0].doc.data().images})
        const url_array = []
        for(i=0;i<user[0]["url array"].length;i++){
          url_array.push(
            {
              id:`${i}`,
              uri:user[0]["url array"][i]
            }
          )
        }
        setImageArray(url_array)
      }
    } catch(e){
      console.log(`Error: ${e}`)
    }
    
  }

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

  const open_selection =(uri) => {
    console.log('open selection')
    router.push({pathname: '/screens/home/select_feature', params: {uri}})
  }

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Nav />
      </View>

      <Text style={styles.title}>YOUR MENUS</Text>
      <View style={styles.menu_container}>
        {loading?
        
          <ActivityIndicator size={"large"}/>      
        
        
        :
        <FlatList
        style={styles.menu_area}
        // data={formatData(MENUS, col_num)}
        data={formatData(() => imageArray, col_num)}
        columnWrapperStyle={styles.row} // Centering and spacing between columns
        contentContainerStyle={styles.list} // Centering list in screen
        renderItem={({ item }) => {
          if (item.empty == true) {
            return <View style={[styles.card, styles.item_invisible]} />;
          }
          console.log(item.id);
          return (
            <View style={styles.card} key={item.id}>
                <Pressable onPress={open_selection(item.uri)} style={{width:'100%', height:'100%',justifyContent:'center',alignItems:'center'}}>
                    <View>
                        {/* <Text style={styles.menu_title}>{item.uri}</Text> */}
                        <Image 
                          source={{uri: item.uri}}
                          style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}/>
                    </View>
              </Pressable>
            </View>
          );
        }}
        numColumns={col_num}
      />
        }
      </View>
      
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
  menu_container: {
    width:'100%',
    height:'90%',
    borderWidth:1,
    justifyContent:'center',
    alignItems:'center'
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
