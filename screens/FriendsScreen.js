import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import {SEARCH_PROFILE, DELETE_PROFILE, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch, myDB } from "../Data";


export default function FriendsScreen(props){

    const {navigation, route} = props
    
    const dispatch = useDispatch()
    const profile = useSelector(state => state.profile)
    const friends = useSelector(state => state.friends)


    const [email, setEmail] = useState("")
    const [showOverlay, setShowOverlay] = useState(false)
    const [friend, setFriend] = useState(null)

    const searchProfile = async ()=>{
        const db = myDB()
        const q = await getDocs(query(collection(db, "profiles"), where("email", "==", email)))
        let items = []
        q.forEach(el=> items=[...items, el.data()])
        setFriend(items.length ===0?0:items[0].email)
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
                onBackdropPress={()=>setShowOverlay(false)}>
                <Text>Search Email</Text>
                <TextInput
                style={styles.emailInput}
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
                    title={"Search"}
                    onPress={()=>{searchProfile() }}/>
                </View>
                <View>
                    {friend===null?"":<View>
                        <Text>{friend===0?"Friend Not Found":"Friend Found"}</Text>
                        <Button onPress={()=>{
                            updateProfile(profile.friends.filter(el => el ===friend).length==0?[...profile.friends,friend]:profile.friends)
                            setEmail("")
                            setShowOverlay(false)
                        }} title={"Add Friend"}/>
                        </View>}
                </View>
            </Overlay>

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
                        if(item.email !== profile.email){
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
                    )}}}/>
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