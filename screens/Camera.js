import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { useEffect, useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import { SAVE_PICTURE, SEARCH_PROFILE, DELETE_PROFILE, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch, myDB } from "../Data"
import { Camera, CameraType } from "expo-camera";
import { AntDesign } from '@expo/vector-icons'; 


export default function CameraScreen(props){

    const {navigation, route} = props
    
    const dispatch = useDispatch()
    const profile = useSelector(state => state.profile)


    const [permission, setPermission] = useState(false)
    const [cameraView, setCameraView] = useState(true)

    const savePicture = (picture)=>{
        const action = {
            type: SAVE_PICTURE,
            payload: {profile: profile, picture: picture}
        }
        SaveAndDispatch(action, dispatch)
    }

    const getPermission = async ()=>{
        const {status} = await Camera.requestCameraPermissionsAsync()
        setPermission(status==="granted")
    }


    useEffect( ()=>{
        getPermission()
    },[])

    let theCamera = undefined;
    return(
        <View>
            <View style={styles.content}>
                <View style={styles.backRow}>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate("FeedScreen",{camera: true})
                    }}>
                        <AntDesign name="arrowleft" size={36} color="dodgerblue" />
                    </TouchableOpacity>
                </View>
                <View style={styles.cameraRow}>
                    {permission?<Camera
                    style={styles.camera}
                    ratio="4:3"
                    pictureSize="Medium"
                    type={cameraView?CameraType.back:CameraType.front}
                    ref={ref=>theCamera = ref}/>:<Text>Camera access not given</Text>}

                </View>
                <View style={styles.buttonRow}>
                    <Button title={"Take Picture"} onPress={async()=>{      
                            let picture = await theCamera.takePictureAsync({quality: 0.1})
                            savePicture(picture)
                            navigation.navigate("FeedScreen",{camera: true})
                            }}/>
                    <Button title={"Switch"} onPress={async()=>{      
                            setCameraView(!cameraView)
                            }}/>
                </View>
            </View>
        </View>
    )}

const styles = {
    cameraRow:{
        width: "50%",
        height: "50%"
    },
    camera:{
        width: "100%",
        height: "100%"
    },
    contactStuff:{
        height: "80%",
        width: "100%",
    },main:{
        marginTop: 20
    },

    friend:{
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "red",
        width: "90%",
        marginLeft: "5%",
        padding: 10,
        borderRadius: 5

    },
    emailInput:{
        borderWidth: 1
    },
    overlay:{
        column: "row",
        width: "50%",
        height: "50%"
    },
    inputRow:{
        marginTop: 30,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center"
    },
    label:{
        alignText:"center"
    },
    input:{
        alignText:"center"
    },
    content:{
        flexDirection: "column",
    },

}