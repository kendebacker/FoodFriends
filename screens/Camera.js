import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import {SEARCH_PROFILE, DELETE_PROFILE, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch, myDB } from "../Data";


export default function CameraScreen(){

    const {navigation, route} = props
    
    const dispatch = useDispatch()
    const profile = useSelector(state => state.profile)
    const friends = useSelector(state => state.friends)


    const [permission, setPermission] = useState(false)
    const [direction, setDirection] = useState(true)
    const [friend, setFriend] = useState(null)


    return(
        <View>
            <View style={styles.content}>
                <View style={styles.inputRow}>
                    <Button title={"Find Friends"} onPress={()=>{      
                        setShowOverlay(true)
                        }}/>
                </View>
                <View style={styles.main}>
                    <FlatList 
                    style={styles.contactStuff}
                    data={friends}
                    renderItem={({item})=>{
                    return(
                        <View>
                            <View style={styles.friend}>
                                <Text>{item.firstName}</Text>
                                <Text>{item.lastName}</Text>
                                <Button title={"remove"} onPress={()=>{
                                updateProfile(profile.friends.filter(el=>el!==item.email))
                                }}/>
                            </View>
                            <View>
                            </View>
                        </View>
                    )}}/>
                </View>
            </View>
        </View>
    )}

const styles = {
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
    }
}