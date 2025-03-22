import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, Text, View, Pressable, Alert,ActivityIndicator, TouchableOpacity, Image } from "react-native";

const Nav = () => {
    return(
        <View style={styles.container}>
            <Image 
            source={require('../assets/MENU_MATE.png')}
            style={{width:20,height:20,paddingHorizontal:10}}
        />
        </View>
    )
}
export default Nav

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        maxHeight: 60,
        flexDirection:'row',
        justifyContent:'start',
    }
})