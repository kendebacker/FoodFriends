import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import { DELETE_PROFILE, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch } from "../Data";


export default function FriendsScreen(props){

    const {navigation, route} = props
    
    const dispatch = useDispatch()
    const profile = useSelector(state => state.profile)
    const friends = useSelector(state => state.friends)

    const [email, setEmail] = useState("")
    const [showOverlay, setShowOverlay] = useState(false)



    const deleteProfile = (userID)=>{
        const action = {
            type: DELETE_PROFILE,
            payload: {userID: userID}
        }
        SaveAndDispatch(action, dispatch)
    }

    const updateProfile = (friends)=>{
        const action = {
            type: UPDATE_PROFILE,
            payload: {
                ...profile,
                friends: friends,
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
                placeholder="email"
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
                    title={"Add Friend"}
                    onPress={async ()=>{
                        const q = await getDocs(query(collection(db, profile), where("email", "==", email)))
                        const items = q.map(el =>el.data())
                        if(items.length > 0){
                            updateProfile([...profile.friends,items[0].userID])
                            setEmail("")
                            setShowOverlay(false)
                        }
                    }}
                    />
                </View>
            </Overlay>

            <View style={styles.content}>
                <View style={styles.inputRow}>
                    <Text style = {styles.label}>Friends</Text>
                    <Button title={"Find Friends"} onPress={()=>{      
                        setShowOverlay(true)
                        }}/>
                </View>
                <View style={styles.inputRow}>
                    <FlatList 
                    style={styles.contactStuff}
                    data={friends}
                    renderItem={({item})=>{
                    return(
                        <View>
                            <View>
                                <Text>{item.firstName}</Text>
                                <Text>{item.lastName}</Text>
                            </View>
                            <Button title={"remove"} onPress={()=>{
                                deleteProfile(item.userID)
                            }}/>
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