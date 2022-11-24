import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import { LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch } from "../Data";


export default function FeedScreen(props){

    const {navigation, route} = props
    
    const dispatch = useDispatch()
    const posts = useSelector(state => state.posts)
    const profile = useSelector(state => state.profile)
    const state = useSelector(state => state)
    console.log(state)


    const [showOverlay, setShowOverlay] = useState(profile.username==="")
    const [username, setUsername] = useState(profile.username)
    const [image, setImage] = useState(profile.image)


    const refresh=()=>[

    ]

    const updatePost = (post)=>{
        const action = {
            type: UPDATE_POST,
            payload: {...post, likes: post.likes+1}
        }
        SaveAndDispatch(action, dispatch)
    }

    const updateProfile = (username, image, reposts, posts, saved, friends, userID)=>{
        const action = {
            type: UPDATE_PROFILE,
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
                    <Text style = {styles.label}>{posts.length ===0?"No Posts to See":"Recent Posts"}</Text>
                    <Button title={"Refresh"} onPress={()=>{      
                        const loadGroup = {type: LOAD_POST}
                        SaveAndDispatch(loadGroup, dispatch)
                        }}/>
                </View>
                <View style={styles.inputRow}>
                    <FlatList 
                    style={styles.contactStuff}
                    data={posts}
                    renderItem={({item})=>{
                        console.log(item)
                    return(
                        <View>
                            <View>
                                <Text>{item.author}</Text>
                                <Text>{item.date.seconds}</Text>
                            </View>
                            <View>
                                <Image src={item.image}/>
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
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={showOverlay}
                onBackdropPress={()=>setShowOverlay(false)}>
                <Text>Profile Details</Text>
                <TextInput
                placeholder="username"
                value={username}
                onChangeText={(text)=>setUsername(text)}/>
                <TextInput
                placeholder="image"
                value={image}
                onChangeText={(text)=>setImage(text)}/>
                <View style={styles.buttonRow}>
                    <Button
                    title={"Cancel"}
                    onPress={()=>{
                        setUsername(profile.username)
                        setImage(profile.image)
                        setShowOverlay(false)
                    }}/>

                    <Button
                    title={"Save"}
                    onPress={()=>{
                        updateProfile(username, image, profile.reposts, profile.posts, profile.saved, profile.friends, profile.userID)
                        setShowOverlay(false)
                    }}
                    />
                </View>
            </Overlay>

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