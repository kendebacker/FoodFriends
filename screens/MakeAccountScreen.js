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
    const {backgroundColor, postColor, textColor, iconColor, menuColor, heartColor} = useSelector(state => state.color)
    const styles = getStyles(backgroundColor, postColor, textColor, iconColor, menuColor, heartColor)

    const dispatch = useDispatch()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState("")

    const addProfile = (email)=>{
        const action = {
            type: ADD_PROFILE,
            payload: {
                email:email,
                firstName:"",
                lastName:"",
                image: "https://firebasestorage.googleapis.com/v0/b/ken-homework-5.appspot.com/o/Screen%20Shot%202022-11-29%20at%2010.12.42%20PM.png?alt=media&token=20deda07-8d92-4aac-b957-8f8883d9fc9e",
                reposts: [], 
                posts: [],
                saved: [],
                friends: [email],
                
            }
        }
        SaveAndDispatch(action, dispatch)
    }


    return(
        <View>
            <View style={styles.signContent}>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Email</Text>
                    <TextInput  style={styles.input} onChangeText={(text)=>{setEmail(text)}} value={email}/>
                </View>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Password</Text>
                    <TextInput style={styles.input} onChangeText={(text)=>{setPassword(text)}} value={password}/>
                </View>
                <TouchableOpacity style={styles.button} onPress={ async ()=>{
                 if(password !==""  && email !==""){
                    try{
                        const userInfo = await createUserWithEmailAndPassword(auth,email, password)
                        addProfile( email)
                        navigation.navigate("Feed")
                    }catch(error){
                        Alert.alert("error occured")
                    }}
                }}>
                    <Text style={styles.buttonText}>Sign up</Text> 
                </TouchableOpacity>
            </View>

        </View>
    )
}

const LoginBox=({navigation})=>{
    const dispatch = useDispatch()
    const {backgroundColor, postColor, textColor, iconColor, menuColor, heartColor} = useSelector(state => state.color)
    const styles = getStyles(backgroundColor, postColor, textColor, iconColor, menuColor, heartColor)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return(
        <View>
            <View style={styles.loginContent}>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Email</Text>
                    <TextInput  style={styles.input} onChangeText={(text)=>{setEmail(text)}} value={email}/>
                </View>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Password</Text>
                    <TextInput style={styles.input} onChangeText={(text)=>{setPassword(text)}} value={password}/>
                </View>
                <TouchableOpacity style={styles.button} onPress={ async ()=>{
                 if( password !==""  && email !==""){
                    try{
                        const userInfo = await signInWithEmailAndPassword(auth,email, password)
                        const loadProfile = {type: LOAD_PROFILE , payload:{email:userInfo.user.email}}
                        SaveAndDispatch(loadProfile, dispatch)
                        navigation.navigate("Feed")
                    }catch(error){
                        Alert.alert("error occured")
                    }}
                }}>
                    <Text style={styles.buttonText}>Login</Text> 
                </TouchableOpacity>
        
            </View>
        </View>
    )
}

export default function MakeAccountScreen(props){
    const {backgroundColor, postColor, textColor, iconColor, menuColor, heartColor} = useSelector(state => state.color)
    const styles = getStyles(backgroundColor, postColor, textColor, iconColor, menuColor, heartColor)

    const {navigation, route} = props


    const dispatch = useDispatch()


    useEffect(()=>{ onAuthStateChanged(auth, user=>{
        if(user){
            const loadProfile = {type: LOAD_PROFILE , payload: {email:user.email}}
            SaveAndDispatch(loadProfile, dispatch)
            navigation.navigate("Feed")
        }
    })
    },[])

    const [signIn, setSignIn] = useState(true)


    return(
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{"FoodFriends"}</Text>
                </View>
                <View style={styles.labelRow}>
                    <Text style={styles.labelTitle}>{signIn?"Login":"Sign Up"}</Text>
                </View>
                <View style={styles.contentBox}>
                    {signIn?<LoginBox navigation ={navigation}/>:<CreateAccountBox navigation ={navigation}/>}
                    <View style={styles.switchOption}>
                        <Text style={styles.normalText}>{signIn?"New? ":"Want to login? "}</Text>
                        <TouchableOpacity onPress={()=>{setSignIn(!signIn)}}>
                                <Text style={{color:iconColor}}>Switch</Text>
                        </TouchableOpacity>
                        <Text style={styles.normalText}> to {signIn?"Sign up":"Login"}</Text>
                    </View>
                </View>
            </View>
    )}



const getStyles = (backgroundColor, postColor, textColor, iconColor, menuColor, heartColor) =>{
    const styles = {
        button:{
            marginTop: 10,
            color: backgroundColor,
            backgroundColor: iconColor,
            padding: 12.5,
            borderRadius: 5
        },
        buttonText:{
            color: postColor
        },
        normalText:{
            color: textColor
        },
        switchOption:{
            flex: .33,
            alignItems:"center",
            justifyContent:"start",
            flexDirection:"row"
        },
        labelRow:{
            flex: .1,
            color: textColor
        },
        loginContent:{
            marginTop: 20,
            padding: 10,
             width: "90%",
            flex:.7,
            flexDirection: "column",
            justifyContent:"start",
            alignItems: "center"
        },
        signContent:{
            marginTop: 20,
            padding: 10,
            width: "90%",
            flex:.7,
            flexDirection: "column",
            justifyContent:"start",
            alignItems: "center"
        },
        inputRow:{
            width: "100%",
            flexDirection: "row",
            marginBottom: 10
        },
        titleRow:{
            flex: .35,
            justifyContent: "center"
        },
        title:{
            fontSize : 50,
            color: menuColor
        },
        labelTitle:{
            fontSize : 30,
            color: textColor
        },
        contentBox:{
            flex: .35,
            width: "90%",
            flexDirection: "column",
            alignItems: "center",
            padding: 10,
            backgroundColor: postColor,
            borderRadius: 5,
            backgroundColor: postColor
        },
        label:{
            alignText:"center",
            width: "40%",
            color: textColor
        },
        input:{
            alignText:"center",
            borderWidth: 1,
            width: "50%",
            height: 20,
            color: textColor
        },
        content:{
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            backgroundColor: backgroundColor,
            flex:1
        },
    }
    return(styles)
}
