import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import {SEARCH_PROFILE, DELETE_POST, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch, SearchProfileData } from "../Data";
import { MaterialIcons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 


export default function RecipeListScreen(props){

    const {backgroundColor, postColor, textColor, iconColor, menuColor, heartColor} = useSelector(state => state.color)
    const styles = getStyles(backgroundColor, postColor, textColor, iconColor, menuColor, heartColor)

    const {navigation, route} = props
    
    const dispatch = useDispatch()
    const profile = useSelector(state => state.profile)
    const saved = useSelector(state => state.saved).slice().sort((a,b)=>a.title.localeCompare(b.title))

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
            <View style={styles.content}>
                <View style={styles.main}>
                    <FlatList 
                    style={styles.contactStuff}
                    data={saved}
                    renderItem={({item})=>{
                    return(
                        <View style={styles.friend}>
                            <View style={styles.topRow}>
                                <TouchableOpacity
                                title={"Cancel"}
                                onPress={()=>{
                                    updateProfile(profile.saved.filter(el => el!==item.id))
                                }}>
                                    <MaterialIcons name="cancel" size={45} color={heartColor} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.regionLeft}>
                                <Image
                                    style={styles.profImg2}
                                    source={{uri: item.image}}
                                    />
                            </View>
                            <View style={styles.regionRight}>
                                    <View style={styles.nameRow}>
                                        <Text style={styles.standard2Title}>{item.title} </Text>
                                        <Text style={styles.standard2}>{item.firstName} {item.lastName}</Text>
                                    </View>
                                    <View style={{flexDirection: "row", justifyContent: "center"}}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={()=>{
                                            navigation.navigate("SavedPost",{
                                                post: item,
                                            })
                                        }}>
                                            <Text style={styles.buttonText}>Details </Text>
                                            <Entypo name="magnifying-glass" size={25} color={postColor} />
                                    </TouchableOpacity>
                                    </View>
                            </View>
                        </View>
                    )}}/>
                </View>
            </View>
    )}

    const getStyles = (backgroundColor, postColor, textColor, iconColor, menuColor, heartColor) =>{
        const styles = {
            regionRight:{
                flexDirection: "column"
            },
            button:{

                color: backgroundColor,
                backgroundColor: iconColor,
                padding: 12.5,
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                margin: 10
            },
            buttonText:{
                color: postColor,
                fontSize: 20,
            },
            nameRow:{
                flexDirection: "column",
                padding: 10,
                alignItems: "center"
            },
            friend:{
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                backgroundColor: postColor,
                width: "90%",
                marginLeft: "5%",
                padding: 10,
                borderRadius: 5,
                marginBottom: 20
        
            },
            topRow:{
                flex:.2,
                flexDirection: "row",
                justifyContent: "start",
            },
            row:{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                backgroundColor: postColor,
                width: "90%",
                marginLeft: "5%",
                padding: 10,
                borderRadius: 5
            },
            contactStuff:{
                height: "100%",
                width: "100%",
            },main:{
                marginTop: 20
            },
        
            left:{
              width: "100%" ,
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center"
        
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
                flex: 1,
                backgroundColor: backgroundColor
            },
            title:{
                fontSize: 40,
                color: textColor,
                fontFamily: 'Helvetica Neue'

            },
            standard:{
                color: textColor,
                fontFamily: 'Helvetica Neue'

            },
            standard2:{
                color: textColor,
                fontSize: 20,
                fontFamily: 'Helvetica Neue'

            },
            standard2Title:{
                color: textColor,
                fontSize: 20,
                fontWeight: "bold",
                fontFamily: 'Helvetica Neue'

            },
            profile:{
                alignItems: "center",
            },
            profImg2:{
                width: "75%",
                aspectRatio: 1,
                marginTop: 25,
                borderColor: iconColor,
                borderRadius: 5
            },
            topRow:{
                position: "absolute",
                left:5,
                top:5,
                width:"100%",
                flexDirection: "row",
                justifyContent: "start"
            },
        }
        return(styles)
    }
