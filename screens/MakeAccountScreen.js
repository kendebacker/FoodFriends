import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState , useEffect} from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert } from "react-native";
import {  Button} from "@rneui/themed";
import {firebaseConfig} from "../Secrets"

let app
const apps = getApps()
if (apps.length == 0) { 
    app = initializeApp(firebaseConfig);
  } else {
    app = apps[0];
  }
const auth = getAuth(app)

export default function MakeAccountScreen(){



    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState("")

    return(
        <View>
            <View style={styles.content}>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Username</Text>
                    <TextInput style={styles.input} onChangeText={(text)=>{setUsername(text)}} value={username}/>
                </View>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Email</Text>
                    <TextInput  style={styles.input} onChangeText={(text)=>{setEmail(text)}} value={email}/>
                </View>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Password</Text>
                    <TextInput style={styles.input} onChangeText={(text)=>{setPassword(text)}} value={password}/>
                </View>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Confirm Password</Text>
                    <TextInput  style={styles.input} onChangeText={(text)=>{setCheckPassword(text)}} value={checkPassword}/>
                </View>
                <Button style={styles.button} title={"submit"} onPress={ async ()=>{
                 if(password===checkPassword && password !==""  && email !==""){
                    try{
                        console.log(email, password)
                        const userInfo = await createUserWithEmailAndPassword(auth,email, password)
                        await updateProfile(userInfo.user, {displayName: username} )
                    }catch(error){
                        Alert.alert("error occured")
                    }
                }
                }}/>
            </View>

        </View>
    )
}

const styles = {
    inputRow:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "left"
    },
    label:{
        alignText:"center",
        width: "50%"
    },
    input:{
        alignText:"center",
        borderWidth: 1,
        width: "50%"
    },
    content:{
        flexDirection: "column",
        paddingTop: 100
    },
    button:{
        width: "50%"
    }
}