





import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert } from "react-native";
import {  Button} from "@rneui/themed";


export default function FriendsScreen(){


    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState("")


    const submit = async()=>{
        if(password===checkPassword){
            try{
                const userInfo = await createUserWithEmailAndPassword(auth,email, password)
                await updateProfile(userInfo.user, {displayName: username} )
            }catch(error){
                Alert.alert("error occured")
            }
        }
    }

    return(
        <View>
            <View style={styles.content}>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Username</Text>
                    <TextInput style={styles.input} onChange={(text)=>{setUsername(text)}} value={username}/>
                </View>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Email</Text>
                    <TextInput style={styles.input} onChange={(text)=>{setEmail(text)}} value={email}/>
                </View>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Password</Text>
                    <TextInput style={styles.input} onChange={(text)=>{setPassword(text)}} value={password}/>
                </View>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Confirm Password</Text>
                    <TextInput style={styles.input} onChange={(text)=>{setCheckPassword(text)}} value={checkPassword}/>
                </View>
                <Button/>
            </View>

        </View>
    )

}

const styles = {
    inputRow:{
        width: "100%",
        flexDirection: "row"
    },
    label:{
        alignText:"center"
    },
    input:{
        alignText:"center"
    },
    content:{
        flexDirection: "column"
    }
}



























