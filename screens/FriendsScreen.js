import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import {SEARCH_PROFILE, DELETE_PROFILE, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch, myDB } from "../Data";
import { Entypo } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 


const backgroundColor = "#C2EFB3"
const postColor = "#FFFCF2"
const textColor = "#023C40"
const iconColor = "#119DA4"
const menuColor = "#412234"
const heartColor = "#e6848d"

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
        setFriend(items.length ===0?0:items[0])
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
        <View style={styles.allContent}>
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={showOverlay}
                onBackdropPress={()=>setShowOverlay(false)}>
                <View style={styles.topRow}>
                    <TouchableOpacity
                    title={"Cancel"}
                    onPress={()=>{
                        setEmail("")
                        setShowOverlay(false)
                    }}>
                        <MaterialIcons name="cancel" size={45} color={heartColor} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.inputLabel}>Search Email</Text>
                <TextInput
                style={styles.emailInput}
                placeholder="email"
                value={email}
                onChangeText={(text)=>setEmail(text)}/>

                <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={()=>{
                            searchProfile()
                        }}>
                            <Text style={styles.buttonText}>{"Search"} </Text>
                            <Entypo name="magnifying-glass" size={25} color={postColor} />
                        </TouchableOpacity>
                </View>
                <View>
                    {friend===null?"":
                    <View>
                        {friend===0?<Text>Friend Not Found</Text>:
                        <View style={styles.sucess}>
                            <View style={styles.profile}>
                                <Image
                                style={styles.profImg}
                                source={{uri: friend.image}}
                                />
                                <Text style={styles.standard}>{friend.firstName} {friend.lastName}</Text>
                            </View>
                        <TouchableOpacity style={styles.button} onPress={()=>{
                            updateProfile(profile.friends.filter(el => el ===friend.email).length==0?[...profile.friends,friend.email]:profile.friends)
                            setEmail("")
                            setShowOverlay(false)
                        }}>
                            <Text style={styles.buttonText}>{"Add Friend"}</Text>
                        </TouchableOpacity>
                        </View>}
                    </View>}
                </View>
            </Overlay>

            <View style={styles.content}>
                <View style={styles.main}>
                    <FlatList 
                    style={styles.contactStuff}
                    data={friends}
                    renderItem={({item})=>{
                        if(item.email !== profile.email){
                    return(
                        <View style={styles.friend}>
                            <View style={styles.topRow}>
                                <TouchableOpacity
                                title={"Cancel"}
                                onPress={()=>{
                                    updateProfile(profile.friends.filter(el=>el!==item.email))
                                }}>
                                    <MaterialIcons name="cancel" size={45} color={heartColor} />
                                </TouchableOpacity>
                            </View>
                            <Image
                                style={styles.profImg2}
                                source={{uri: item.image}}
                                />

                            <View style={styles.nameRow}>
                                <Text style={styles.standard2}>{item.firstName}</Text>
                                <Text style={styles.standard2}>{item.lastName}</Text>
                            </View>
                        </View>
                    )}}}/>
                </View>
                <View style={styles.inputRow}>
                    <TouchableOpacity style={styles.button} onPress={()=>{
                            setShowOverlay(true)
                        }}>
                        <Text style={styles.buttonText}>{"Find Friends"} </Text>
                        <Entypo name="magnifying-glass" size={25} color={postColor} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )}

const styles = {
    nameRow:{
        flexDirection: "row",
        padding: 10,
    },
    standard:{
        color: textColor
    },
    standard2:{
        color: textColor,
        fontSize: 20
    },
    profile:{
        alignItems: "center",
    },
    profImg:{
        width: 50,
        height: 50,
        borderRadius: "50%",
        borderColor: iconColor,
        borderWidth: 3,
        
    },
    profImg2:{
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: "50%",
        borderColor: iconColor,
        borderWidth: 3,
    },
    overlay:{
        width: "75%",
        backgroundColor: postColor,
        alignItems: "center"
    },
    allContent:{
        flex: 1,
        backgroundColor: backgroundColor
    },
    topRow:{
        position: "absolute",
        left:5,
        top:5,
        width:"100%",
        flexDirection: "row",
        justifyContent: "start"
    },
    button:{
        color: backgroundColor,
        backgroundColor: iconColor,
        padding: 12.5,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        margin: 10
    },
    buttonText:{
        color: postColor,
        fontSize: 16
    },
    contactStuff:{
        height: "80%",
        width: "100%",
    },
    buttonRow:{
        flexDirection: "row",
        justifyContent: "space-evenly"
    },

    friend:{
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: postColor,
        width: "90%",
        marginLeft: "5%",
        padding: 10,
        borderRadius: 5

    },
    inputLabel:{
        padding: 10, 
        color: textColor,
        fontSize: 20
    },
    emailInput:{
        borderWidth: 1,
        margin:10,
        width: "75%"
    },
    inputRow:{
        marginTop: 30,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center"
    },
    label:{
        alignText:"center",
        
    },
    input:{
        alignText:"center"
    },
    content:{
        flexDirection: "column",
        marginTop: 35
    }
}