import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import { ADD_POST, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch } from "../Data";


export default function PostScreen(props){

    const {navigation, route} = props
    const post = route.params.post

    const dispatch = useDispatch()
    const profile = useSelector(state => state.profile)


    const updateProfile = (saved)=>{
        const action = {
            type: UPDATE_PROFILE,
            payload: {
                ...profile,
                saved: saved,
            }
        }
        SaveAndDispatch(action, dispatch)
    }


    return(
        <View>
            <View style={styles.content}>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>{posts.length ===0?"No Posts to See":"Recent Posts"}</Text>
                    <Button title={"Refresh"} onPress={()=>{      
                        const loadGroup = {type: LOAD_POST}
                        SaveAndDispatch(loadGroup, dispatch)
                        }}/>
                </View>
                <View>
                    <View>
                        <Text>{post.firstName}</Text>
                        <Text>{post.lastName}</Text>
                    </View>
                    <View>
                        <Text>{post.date.seconds}</Text>
                    </View>
                    <View>
                        <Image src={post.image}/>
                    </View>
                    <View>
                        <Text>{post.rating}</Text>
                        <Text>{post.likes}</Text>
                    </View>
                    <View>
                        <Text>{post.location}</Text>
                    </View>
                    <View>{post.description}</View>
                    <View>
                        <Button title={"Save"} onPress={()=>{
                            const saved = [...profile.saved,post.key ]
                            updateProfile(saved)
                        }}/>
                    </View>
                </View>
            </View>
        </View>
    )}

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