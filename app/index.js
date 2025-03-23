import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, Text, View, Pressable, Alert,ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router' 
import { app } from './firebaseConfig'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const App = () => {
    const router = useRouter()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading, setLoading] = useState(false)


    const handleEmail = (enteredText) => {
      setEmail(enteredText)

    }
    const handlePassword = (enteredText) => {
      setPassword(enteredText)

    }

    const navApp = async () => {
      setLoading(true)
      try {
        const auth = getAuth(app)
        const response = await signInWithEmailAndPassword(auth,email,password)
        if('FirebaseError' in response){
          Alert.alert('Oops','Authentication Error')
        } else {
          router.push('/screens')
        } 
      } catch(e){
        console.log(`Error: ${e}`)
      }
        
    }
    const navRegister = () => {
      router.push('/register')
    }

    return(
        <View style={styles.container}>
            <StatusBar style="auto" />
                <Image
                    source={require('../assets/MENU_MATE_2.png')}
                    style={{width:'80%',marginHorizontal:'auto', marginTop:50}}
                />

                {/* <TouchableOpacity activeOpacity={0.8} style={styles.start} onPress={navApp}>
                    <Text style={styles.btn_text}>GET STARTED</Text>
                </TouchableOpacity> */}
                <View style={styles.input_container}>
                <TextInput onChangeText={handleEmail} style={styles.input} placeholder='Email'/>
                <TextInput onChangeText={handlePassword} style={styles.input} placeholder='Password' secureTextEntry/>
                <Pressable style={styles.action_btn} onPress={navApp}>  
                    {loading ? (
                        <ActivityIndicator size={'small'} color={'white'} animating={loading} />
                    ) : (
                        <Text style={styles.action_btn_text}> Login </Text>
                    )} 
                </Pressable>
                <Pressable onPress={navRegister}>
                    <Text style={styles.small_text}>Register</Text>
                </Pressable>
       
             </View>
        </View>
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
        borderRadius: 8
      },
      input_container: {
        marginBottom: 200,
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      },
      small_text: {
        color: '#black',
        marginTop: 20,
        fontWeight:600,
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
      }
    
})