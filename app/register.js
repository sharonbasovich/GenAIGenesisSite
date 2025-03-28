import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, Text, View, Pressable, Alert,ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router' 
import { app, db } from './firebaseConfig'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";


const App = () => {
    const router = useRouter()
    const [enteredEmail, setEmail] = useState('')
    // const [enteredUsername, setUsername] = useState('')
    const [enteredPassword, setPassword] = useState('')
    // const [enteredConfirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
  
    const handleEmail = (enteredText) => {
      setEmail(enteredText)
    }
    const handleUsername = (enteredText) => {
      setUsername(enteredText)
    }
    const handlePassword = (enteredText) => {
      setPassword(enteredText)
    }
    const handleConfirmPassword = (enteredText) => {
      setConfirmPassword(enteredText)
    }
    const navLogin = () => {
      router.push("/")
    }

    const register = async () => {
        setLoading(true)
        try {
            const auth = getAuth(app)

            setEmail(enteredEmail.toLowerCase())
          console.log(`The normalized email is now ${enteredEmail}`)

          const usersRef = collection(db, "users")
          const user = []
          const emailSnapShot = await getDocs(query(usersRef, where("email", "==", enteredEmail)))
          if(!emailSnapShot.empty){
            console.log("An account with this email already exist")
          } else {
              //create the new user in the auth
              const response = await createUserWithEmailAndPassword(auth,enteredEmail,enteredPassword)
              if('FirebaseError' in response){
                Alert.alert("Oops",'Registration Error')
              } else {
                //create the new user in the firestore
                const newDocRef = await addDoc(usersRef, {
                  username: enteredUsername,
                  email: enteredEmail,
                  password: enteredPassword,
                  avatar: ""
                })
                router.push('/')
              }  
            }
          }
             catch(e){
            console.log(`Error: ${e}`)
        }
    }


    return(
      <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <StatusBar style="auto" />
                <View style={styles.imagecontainer}>
                  <Image
                          source={require('../assets/MENU_MATE_2.png')}
                          style={{maxHeight:'100%',maxWidth:'100%',objectFit:'contain'}}
                      />
                  </View>

                {/* <TouchableOpacity activeOpacity={0.8} style={styles.start} onPress={navApp}>
                    <Text style={styles.btn_text}>GET STARTED</Text>
                </TouchableOpacity> */}
                <View style={styles.input_container}>
                <TextInput onChangeText={handleEmail} style={styles.input} placeholder='Email'/>
                {/* <TextInput onChangeText={handleUsername} style={styles.input} placeholder='Username'/> */}
                <TextInput onChangeText={handlePassword} style={styles.input} placeholder='Password'/>
                {/* <TextInput onChangeText={handleConfirmPassword} style={styles.input} placeholder='Confirm Password'/> */}
                <Pressable style={styles.action_btn} onPress={register}>
                  {loading ? (
                    <ActivityIndicator size={'small'} color={'white'} animating={loading} />
                  ) : (
                    <Text style={styles.action_btn_text}> Sign up </Text>
                  )} 
                </Pressable>
                <Pressable onPress={navLogin}>
                  <Text style={styles.small_text}>Login</Text>
                </Pressable>
              </View>
        </View>
        </SafeAreaView>
    )

}

export default App

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16, 
    },
    imagecontainer: {
      width:'70%',
      marginTop:200,
      maxHeight:'40%'
    },
    start: {
        backgroundColor:'#D9D9D9',
        padding:12,
        alignItems:'center',
        borderRadius:24
    },
    btn_text: {
        fontSize:28,
        fontWeight:800
    },
    txt: {
        color: '#4C6DEF',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 150,
        marginBottom: 50
      },
      input: {
        borderWidth: 1,
        borderColor: '#e6e3e2',
        width: '80%',
        height: 45,
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 6,
        paddingBottom: 6,
        marginBottom: 15,
        borderRadius: 6,
        maxWidth:400,
      },
      input_container: {
        marginBottom: 200,
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      },
      small_text: {
        color: 'black',
        fontWeight:600,
        marginTop: 20,
        alignSelf: 'center'
      },
      action_btn_text: {
        backgroundColor: '#54F2D6',
        color: 'black',
        fontWeight:600,
        padding: 10,
        borderRadius: 6,
        textAlign: 'center'
      },
      action_btn: {
        width: '80%',
        height: 45,
        maxWidth:400
      }
    
})