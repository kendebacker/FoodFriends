import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState , useEffect} from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert } from "react-native";
import {  Button} from "@rneui/themed";
import {firebaseConfig} from "../Secrets"
import { ADD_PROFILE, LOAD_PROFILE, LOAD_POST } from "../Reducer";
import { SaveAndDispatch } from "../Data";
import { useDispatch, useSelector } from "react-redux";






let app
const apps = getApps()
if (apps.length == 0) { 
    app = initializeApp(firebaseConfig);
  } else {
    app = apps[0];
  }
const auth = getAuth(app)


const CreateAccountBox=({navigation})=>{

    const dispatch = useDispatch()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState("")

    const addProfile = (userID)=>{
        const action = {
            type: ADD_PROFILE,
            payload: {
                username: "",
                firstName:"",
                lastName:"",
                image: "",
                reposts: [], 
                posts: [],
                saved: [],
                friends: [1],
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
                    try{
                        const userInfo = await createUserWithEmailAndPassword(auth,email, password)
                        addProfile( userInfo.user.uid)
                        navigation.navigate("FeedScreen")
                    }catch(error){
                        Alert.alert("error occured")
                    }}
                }}/>
            </View>

        </View>
    )
}

const LoginBox=({navigation})=>{
    const dispatch = useDispatch()

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
                 if( password !==""  && email !==""){
                    try{
                        const userInfo = await signInWithEmailAndPassword(auth,email, password)
                        const loadProfile = {type: LOAD_PROFILE , payload:{userID:userInfo.user.uid}}
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

    const dispatch = useDispatch()


    useEffect(()=>{ onAuthStateChanged(auth, user=>{
        if(user){
            console.log("IM FIREING")
            console.log(user.uid)
            const loadProfile = {type: LOAD_PROFILE , payload: {userID:user.uid}}
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