import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert } from "react-native";
import {  Button} from "@rneui/themed";
import { UPDATE_POST } from "../Reducer";


export default function FeedScreen(){

    const {navigation, route} = props
    const dispatch = useDispatch()
    const posts = useSelector(state => state.posts)
    const profile = useSelector(state => state.profile)

  

    const updatePost = (post)=>{
        const action = {
            type: UPDATE_POST,
            payload: {...post, likes: post.likes+1}
        }
        SaveAndDispatch(action, dispatch)
    }


    return(
        <View>
            <View style={styles.content}>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Username</Text>
                    <TextInput style={styles.input} onChange={(text)=>{setUsername(text)}} value={username}/>
                </View>
                <View style={styles.inputRow}>
                    <FlatList 
                    style={styles.contactStuff}
                    data={posts}
                    renderItem={({item})=>{
                    return(
                        <View>
                            <View>
                                <Text>{item.poster}</Text>
                                <Text>{item.date}</Text>
                            </View>
                            <View>
                                <Img src={item.imgSRC}/>
                            </View>
                            <View>
                                <TouchableOpacity onPress={()=>{
                                    navigation.navigate("PostScreen",{
                                        post: item
                                    })
                                }}>
                                    <Text>Details</Text>
                                </TouchableOpacity>
                                <View>
                                    <Text>{item.likes}</Text>
                                </View>
                                <TouchableOpacity onPress={()=>{updatePost(item)}}>
                                    <Text>Thumb Icon</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}}/>
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