import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import {SEARCH_PROFILE, DELETE_POST, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch, SearchProfileData } from "../Data";


export default function RecipeListScreen(props){

    const {navigation, route} = props
    
    const dispatch = useDispatch()
    const profile = useSelector(state => state.profile)
    const saved = useSelector(state => state.saved)

    const updateProfile = (saved)=>{
        const action = {
            type: UPDATE_PROFILE,
            payload: {
                ...profile,
                saved: saved
            }
        }
        SaveAndDispatch(action, dispatch)
    }


    return(
        <View>
            <View style={styles.content}>
                <View style={styles.inputRow}>
                    <Text>Recipes</Text>
                </View>
                <View style={styles.main}>
                    <FlatList 
                    style={styles.contactStuff}
                    data={saved}
                    renderItem={({item})=>{
                    return(
                        <View style={styles.row}>
                            <View style={styles.left}>
                                <Text>{item.firstName} {item.lastName}</Text>
                                <Text>{item.title}</Text>
                            </View>
                            <View style={styles.right}>
                                <Button title={"View"} onPress={()=>{
                                     navigation.navigate("SavedPost",{
                                        post: item,
                                     })
                                }}/>
                                <Button title={"remove"} onPress={()=>{
                                    updateProfile(profile.saved.filter(el => el!==item.id))
                                }}/>
                            </View>
                        </View>
                    )}}/>
                </View>
            </View>
        </View>
    )}

const styles = {
    row:{
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "red",
        width: "90%",
        marginLeft: "5%",
        padding: 10,
        borderRadius: 5
    },
    contactStuff:{
        height: "80%",
        width: "100%",
    },main:{
        marginTop: 20
    },

    left:{
      width: "50%" ,
      flexDirection: "row",
      justifyContent: "space-evenly"

    },
    right:{
        width: "50%" ,
        flexDirection: "row",
        justifyContent: "space-evenly"
  
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