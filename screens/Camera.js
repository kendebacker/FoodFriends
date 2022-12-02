import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { useEffect, useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import { SAVE_PICTURE, SEARCH_PROFILE, DELETE_PROFILE, LOAD_POST, UPDATE_POST, UPDATE_PROFILE, PROFILE_OVERLAY, POST_OVERLAY } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch, myDB, savePicture } from "../Data"
import { Camera, CameraType } from "expo-camera";
import { AntDesign } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 



export default function CameraScreen(props){

    const {navigation, route} = props
    const {backgroundColor, postColor, textColor, iconColor, menuColor, heartColor} = useSelector(state => state.color)
    const styles = getStyles(backgroundColor, postColor, textColor, iconColor, menuColor, heartColor)
    
    const profile = useSelector(state => state.profile)
    const dispatch = useDispatch()


    const [permission, setPermission] = useState(false)
    const [cameraView, setCameraView] = useState(true)
    const [taken, setTaken] = useState(false)
    const [showOverlay, setShowOverlay] = useState(false)


    const getPermission = async ()=>{
        const {status} = await Camera.requestCameraPermissionsAsync()
        setPermission(status==="granted")
    }

    const postOverlay = (imgUrl) =>{
        dispatch({
            type: POST_OVERLAY,
            payload:{
                status: true,
                postURL: imgUrl
            }
        })
    }

    const profileOverlay = (imgUrl) =>{
        dispatch({
            type: PROFILE_OVERLAY,
            payload:{
                status: true,
                profileURL: imgUrl
            }
        })
    }

    useEffect( ()=>{
        getPermission()
    },[])

    let theCamera = undefined;
    return(
            <View style={styles.content}>
                <Overlay
                overlayStyle={styles.overlay}
                isVisible={showOverlay}
                onBackdropPress={()=>setShowOverlay(false)}>
                    <Text style={styles.titleText}>Processing Image...</Text>
                </Overlay>
                <View style={styles.backRow}>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate("FeedScreen")
                    }}>
                        <AntDesign name="arrowleft" size={36} color={iconColor} />
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
                {!taken?
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cameraSwitch} onPress={async()=>{      
                            setCameraView(!cameraView)
                            }}>
                        <Ionicons name="ios-camera-reverse" size={40} color={postColor} />
                    </TouchableOpacity>
                     <TouchableOpacity style={styles.cameraButton} onPress={async()=>{  
                            setTaken(true) 
                            setShowOverlay(true)   
                            let picture = await theCamera.takePictureAsync({quality: 0.1})
                            const action = {
                                type: SAVE_PICTURE,
                                payload: {profile: profile, picture: picture}
                            }
                            const imgUrl = await savePicture(action)
                            setTaken(false)
                            setShowOverlay(false)
                            route.params.prev ==="profile"?profileOverlay(imgUrl):postOverlay(imgUrl)
                            navigation.navigate("FeedScreen")
                            }}>
                        <Ionicons name="camera" size={60} color={postColor} />
                    </TouchableOpacity>
                </View>:""}
            </View>
    )}

    const getStyles =(backgroundColor, postColor, textColor, iconColor, menuColor, heartColor)=>{
        const styles = {
            titleText:{
                fontSize: 20,
                color: textColor
            },
            overlay:{
                padding: 20,
                width: "90%",
                justifyContent: "center",
                alignItems: "center"
            },
            buttonRow:{
                position: "absolute",
                bottom: 20,
                left: 0,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
            },
            cameraButton:{
                width: 100,
                height: 100,
                borderRadius: "50%",
                backgroundColor: iconColor,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: textColor
            },
            cameraSwitch:{
                width: 75,
                height: 75,
                borderRadius: "50%",
                backgroundColor: iconColor,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: textColor,
                position: "absolute",
                right: 25
            },
            backRow:{
                position: "absolute",
                left: 25,
                top: 25,
                zIndex: 10
            },
            cameraRow:{
                flex: 1
            },
            camera:{
                flex: 1,
                width: "100%",
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
                flex: 1,
            },
        
        }
        return(styles)
    }