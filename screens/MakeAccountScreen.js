import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState , useEffect} from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert } from "react-native";
import {  Button} from "@rneui/themed";
import {firebaseConfig} from "../Secrets"
import { ADD_PROFILE, LOAD_PROFILE, LOAD_POST } from "../Reducer";
import { SaveAndDispatch } from "../Data";





let app
const apps = getApps()
if (apps.length == 0) { 
    app = initializeApp(firebaseConfig);
  } else {
    app = apps[0];
  }
const auth = getAuth(app)


const CreateAccountBox=({navigation})=>{

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState("")

    const addProfile = (username, image, reposts, posts, saved, friends, userID)=>{
        const action = {
            type: ADD_PROFILE,
            payload: {
                username: username,
                image: image,
                reposts: reposts, 
                posts: posts,
                saved: saved,
                friends: friends,
                userID: userID
            }
        }
        SaveAndDispatch(action, dispatch)
    }


    return(
        <View>
            <View style={styles.content}>
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
                    console.log(email, password)
                    try{
                        const userInfo = await createUserWithEmailAndPassword(auth,email, password)
                        addProfile("", "", "", "", "", "", userInfo.user)
                        navigation.navigate("FeedScreen")
                    }catch(error){
                        console.log(error)
                        Alert.alert("error occured")
                    }}
                }}/>
            </View>

        </View>
    )
}

const LoginBox=({navigation})=>{

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return(
        <View>
            <View style={styles.content}>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Email</Text>
                    <TextInput  style={styles.input} onChangeText={(text)=>{setEmail(text)}} value={email}/>
                </View>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Password</Text>
                    <TextInput style={styles.input} onChangeText={(text)=>{setPassword(text)}} value={password}/>
                </View>
                <Button style={styles.button} title={"submit"} onPress={ async ()=>{
                 if(password===checkPassword && password !==""  && email !==""){
                    try{
                        const userInfo = await signInWithEmailAndPassword(auth,email, password)
                        const loadProfile = {type: LOAD_PROFILE , userID:userInfo.user}
                        SaveAndDispatch(loadProfile, dispatch)
                        navigation.navigate("FeedScreen")
                    }catch(error){
                        Alert.alert("error occured")
                    }}
                }}/>
            </View>
        </View>
    )
}

export default function MakeAccountScreen(props){


    const {navigation, route} = props


    useEffect(()=>{ onAuthStateChanged(auth, user=>{
        if(user){
            const loadProfile = {type: LOAD_PROFILE , userID:user}
            SaveAndDispatch(loadProfile, dispatch)
            navigation.navigate("FeedScreen")
        }
    })
    },[])

    const [signIn, setSignIn] = useState(true)


    return(
            <View style={styles.content}>
                <Text>{signIn?"Login":"Sign Up"}</Text>
                <View style={styles.inputRow}>
                    {signIn?<LoginBox navigation ={navigation}/>:<CreateAccountBox navigation ={navigation}/>}
                </View>
                <View style={styles.inputRow}>
                   <TouchableOpacity onPress={()=>{setSignIn(!signIn)}}>
                        <Text>Switch</Text>
                   </TouchableOpacity>
                </View>
            </View>
    )}

const styles = {
    inputRow:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        padding: 10
    },
    label:{
        alignText:"center",
        width: "40%"
    },
    input:{
        alignText:"center",
        borderWidth: 1,
        width: "50%"
    },
    content:{
        flexDirection: "column",
        paddingTop: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    button:{
        width: "50%"
    }
}