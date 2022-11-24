import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import { LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch } from "../Data";


export default function FriendsScreen(props){

    const {navigation, route} = props
    
    const dispatch = useDispatch()
    const posts = useSelector(state => state.posts)
    const profile = useSelector(state => state.profile)
    const state = useSelector(state => state)
    console.log(state)

    const [email, setEmail] = useState("")
    const [showOverlay, setShowOverlay] = useState(false)



    const updatePost = (post)=>{
        const action = {
            type: UPDATE_POST,
            payload: {...post, likes: post.likes+1}
        }
        SaveAndDispatch(action, dispatch)
    }

    const updateProfile = (firstName, lastName, image, reposts, posts, saved, friends, userID)=>{
        const action = {
            type: UPDATE_PROFILE,
            payload: {
                firstName: firstName,
                lastName: lastName,
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
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={showOverlay}
                onBackdropPress={()=>setMakePostOverlay(false)}>
                <Text>Search Email</Text>
                <TextInput
                placeholder="title"
                value={email}
                onChangeText={(text)=>setEmail(text)}/>

                <View style={styles.buttonRow}>
                    <Button
                    title={"Cancel"}
                    onPress={()=>{
                        setEmail("")
                        setShowOverlay(false)
                    }}/>

                    <Button
                    title={"Post"}
                    onPress={async ()=>{
                        const q = await getDocs(query(collection(db, profile), where("userID", "==", userID)))
                        const items = q.map(el =>el.data())
                        if(items.length > 0){
                            updateProfile(profile.firstName, profile.lastName, profile.reposts, profile.posts, profile.saved, [...profile.friends,items[0].userID ], profile.userID)
                            setEmail("")
                            setShowOverlay(false)
                        }
                    }}
                    />
                </View>
            </Overlay>

            <View style={styles.content}>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>{posts.length ===0?"No Posts to See":"Recent Posts"}</Text>
                    <Button title={"Refresh"} onPress={()=>{      
                        const loadGroup = {type: LOAD_POST}
                        SaveAndDispatch(loadGroup, dispatch)
                        }}/>
                    <Button title={"Refresh"} onPress={()=>{      
                        const loadGroup = {type: LOAD_POST}
                        SaveAndDispatch(loadGroup, dispatch)
                    }}/>
                </View>
                <View style={styles.inputRow}>
                    <FlatList 
                    style={styles.contactStuff}
                    data={friends}
                    renderItem={({item})=>{
                        console.log(item)
                    return(
                        <View>
                            <View>
                                <Text>{item.author}</Text>
                            </View>
                            <View>
                                <Button/>
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