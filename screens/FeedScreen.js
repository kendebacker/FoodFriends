import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useEffect, useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image, Platform, Linking, ScrollView , Switch} from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import { ADD_POST, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch } from "../Data";
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { Post } from "../components/Post";

const StarRating = ({rating, setRating})=>{
    let start = [0,0,0,0,0]
    start = start.map((el,ind)=> el = ind<rating?1:0)

    return(
        <View style={styles.rating}>
            {start.map((el,ind) => 
            <TouchableOpacity key={ind} onPress={()=>{setRating(ind+1)}}>{el===1?
                <FontAwesome name="star" size={24} color="dodgerblue" />:
                <FontAwesome name="star-o" size={24} color="dodgerblue" />}
            </TouchableOpacity>)}
        </View>
    )
}


export default function FeedScreen(props){

    const {navigation, route} = props

    const dispatch = useDispatch()
    const posts = useSelector(state => state.posts)
    const profile = useSelector(state => state.profile)
    const [showSettings, setShowSettings] = useState(false)
    const [makePostOverlay, setMakePostOverlay] = useState(camera!==undefined)
    const [showOverlay, setShowOverlay] = useState(profile.firstName==="")
    const [firstName, setFirstName] = useState(profile.firstName)
    const [image, setImage] = useState(profile.image)
    const [lastName, setLastName] = useState(profile.lastName)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [rating, setRating] = useState(1)
    const [recipe, setRecipe] = useState("")
    const [location, setLocation] = useState(null)
    const [dayMode, setDayMode] = useState(true)

    const camera = route.params
    const postURL = route.params===undefined?null:route.params.postURL
    const profileURL = route.params===undefined?null:route.params.profileURL


    useEffect(()=>{
        setMakePostOverlay(postURL !== null)
        setShowOverlay(profileURL !== null)
        setImage(profile.image)
        setLastName(profile.lastName)
        setFirstName(profile.firstName)
    }, [postURL, profileURL, profile.lastName, profile.firstName, profile.image])





    const getLocation=async()=>{
        // https://stackoverflow.com/questions/43214062/open-maps-google-maps-in-react-native
        let locationAllowed = await Location.requestForegroundPermissionsAsync().status
        if (locationAllowed !== 'granted') {
            Alert.alert("You have not allowed geo-location")
          }
        const curLocation = await Location.getCurrentPositionAsync({})
        setLocation([curLocation.coords.latitude,curLocation.coords.longitude]);
    }

    const updateProfile = (firstName, lastName, image)=>{
        const action = {
            type: UPDATE_PROFILE,
            payload: {
                ...profile,
                firstName: firstName,
                lastName: lastName,
                image: image
            }
        }
        SaveAndDispatch(action, dispatch)
    }

    const addPost = (profImage,comments, recipe,title, firstName, lastName,foodImage, description, rating, location, likes, poster, reposts, date, friends, id)=>{
        const action = {
            type: ADD_POST,
            payload: {
                profImage, profImage,
                recipe: recipe,
                title: title,
                firstName: firstName,
                lastName: lastName,
                image:foodImage,
                description:description, 
                rating:rating, 
                location:location, 
                likes:likes, 
                poster:poster, 
                reposts:reposts, 
                date:date,
                friends: friends,
                comments: comments,
                id: id
            }
        }
        SaveAndDispatch(action, dispatch)
    }



    return(
        <View style={styles.all}>
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={showSettings}
                onBackdropPress={()=>setShowSettings(false)}>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={dayMode ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={()=>setDayMode(!dayMode)}
                    value={dayMode}
                />
                <TouchableOpacity  onPress={()=>{
                        setShowSettings(false)
                        navigation.navigate("Camera",{prev: "profile"})}}>
                        <AntDesign name="logout" size={50} color="black" />
                </TouchableOpacity>
            </Overlay>
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={makePostOverlay}
                onBackdropPress={()=>setMakePostOverlay(false)}>
                <View>
                    <View style={styles.inputRowOverlay}>
                        <Text style={styles.labelText}>Title</Text>
                        <TextInput
                        style={styles.textInput}
                        placeholder="title"
                        value={title}
                        onChangeText={(text)=>setTitle(text)}/>
                    </View>
                    <View style={styles.inputRowOverlay}>
                        <Text style={styles.labelText}>Rating</Text>
                        <StarRating rating = {rating} setRating = {setRating} />
                    </View>
                    <View style={styles.inputRowOverlay}>
                        <Text style={styles.labelText}>Image</Text>
                        {postURL===null?<Text>No picture selected yet</Text>:<Image
                        style={styles.logo}
                        source={{uri: postURL}}
                        />}
                        <TouchableOpacity  onPress={()=>{
                            setMakePostOverlay(false)
                            navigation.navigate("Camera",{prev:"post"})}}>
                          <AntDesign name="camera" size={50} color="dodgerblue" />  
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputRowOverlay}>
                        <Text style={styles.labelText}>Location</Text>
                        {location===null?<Text>No Location Added</Text>:<Text>Location Added</Text>}
                        <TouchableOpacity title={"loc"} onPress={()=>{
                            getLocation()
                            }}>
                            <Entypo name="location" size={50} color="dodgerblue" />    
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputRowOverlay}>
                        <Text style={styles.labelText}>Description</Text>
                        <TextInput
                        style={styles.textInput}
                        placeholder={"description"}
                        value={description}
                        onChangeText={(text)=>setDescription(text)}/>
                    </View>
                    <View style={styles.inputRowOverlay}>
                        <Text style={styles.labelText}>Recipe</Text>
                        <TextInput
                        style={styles.textInput}
                        placeholder="description"
                        value={recipe}
                        onChangeText={(text)=>setRecipe(text)}/>
                    </View>
                    <View style={styles.submitRow}>
                        <TouchableOpacity
                        title={"Cancel"}
                        onPress={()=>{
                            setImage(profile.image)
                            setShowOverlay(false)
                        }}>
                            <MaterialIcons name="cancel" size={50} color="red" />
                        </TouchableOpacity>

                        <TouchableOpacity
                        title={"Post"}
                        onPress={()=>{
                            addPost(profile.image, [],recipe, title, profile.firstName, profile.lastName,postURL, description, rating, location, [], profile.email, [], new Date().toLocaleDateString(), profile.friends, Date.now())
                            setMakePostOverlay(false)
                        }}
                        >
                           <MaterialIcons name="check-circle" size={50} color="green" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>

            <View style={styles.content}>
                <View style={styles.inputRow}>
                    <TouchableOpacity onPress={()=>{      
                        setShowSettings(true)
                        }}>
                        <MaterialIcons name="settings" size={50} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{      
                        const loadPost = {type: LOAD_POST, payload:{friends: profile.friends}}
                        SaveAndDispatch(loadPost, dispatch)
                        }}>
                        <FontAwesome name="refresh" size={50} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{      
                        setMakePostOverlay(true)
                        }}>
                        <MaterialIcons name="post-add" size={50} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{      
                        setShowOverlay(true)
                        }}>
                        <FontAwesome name="user" size={50} color="black" />
                    </TouchableOpacity>
                </View>
                <FlatList 
                nestedScrollEnabled={true}
                style={styles.feedContainer}
                data={posts}
                renderItem={({item})=>{
                return(
                    <Post userPost={item} navigation={navigation} profile={profile}/>
                )}}/>
                </View>
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={showOverlay}
                onBackdropPress={()=>setShowOverlay(false)}>
                <View>
                    <View style={styles.inputRowOverlay}>
                        <Text style={styles.labelText}>First Name</Text>
                        <TextInput
                        style={styles.textInput}
                        placeholder="title"
                        value={firstName}
                        onChangeText={(text)=>setFirstName(text)}/>
                    </View>
                    <View style={styles.inputRowOverlay}>
                        <Text style={styles.labelText}>Last Name</Text>
                        <TextInput
                        style={styles.textInput}
                        placeholder="title"
                        value={lastName}
                        onChangeText={(text)=>setLastName(text)}/>
                    </View>

                    <View style={styles.inputRowOverlay}>
                        <Text style={styles.labelText}>Image</Text>
                        {profileURL===null?<Image
                        style={styles.logo}
                        source={{uri: profile.image}}
                        />:<Image
                        style={styles.logo}
                        source={{uri: profileURL}}
                        />}
                        <TouchableOpacity  onPress={()=>{
                            setShowOverlay(false)
                            navigation.navigate("Camera",{prev: "profile"})}}>
                          <AntDesign name="camera" size={50} color="dodgerblue" />  
                        </TouchableOpacity>
                    </View>
                    <View style={styles.submitRow}>
                        <TouchableOpacity
                        title={"Cancel"}
                        onPress={()=>{
                            setImage(profile.image)
                            setShowOverlay(false)
                        }}>
                            <MaterialIcons name="cancel" size={50} color="red" />
                        </TouchableOpacity>

                        <TouchableOpacity
                        title={"Post"}
                        onPress={()=>{
                            updateProfile(firstName, lastName, profileURL)
                            setShowOverlay(false)
                        }}
                        >
                           <MaterialIcons name="check-circle" size={50} color="green" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        </View>
    )}

const styles = {
    all:{
        flex:1
    },
    mainBody:{
        flex:7
    },
    commentLine:{
        flexDirection: "column"
    },

    commentsList:{
        width: "100%",
        backgroundColor:"purple",
        height: "20%",
        flex: .2,
    },
    labelText:{
        fontSize: 20
    },
    inputRowOverlay:{
        width: "100%",
        flexDirection: "column",
        paddingTop: 20,
        alignItems: "center"
    },
    inputRow:{
        flex:.2,
        width: "100%",
        padding: 20,
        flexDirection: "col",
        alignItems: "center"
    },
    submitRow:{
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 15
    },
    thumb:{flexDirection: "row"},
    rating:{
        flexDirection: "row",
        width: "100%",
        justifyContent: "center"
    },
middleContent:{
    flex:.5,
    justifyContent: "center",
    width: "100%",
    flexDirection: "row"
},
profImg:{
    width: 50,
    height: 50,
    marginRight: 5,
    borderRadius: "50%"
},
logo: {
    width: 100,
    height: 100,
  },
  postTitle:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "center"
  },
    postTopSub:{
        flexDirection: "row",
        justifyContent: "start",
        height: 50,
        alignItems: "center"
    },
    postTop:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },inputRow:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingTop: 20
    },
    feedContainer:{
        width: "100%",
        backgroundColor:"blue",
        height: "90%",
    },
    post:{
        width: "90%",
        backgroundColor: "red",
        marginLeft: "5%",
        marginTop: "5%",
        padding: 10,
        borderRadius: 5,
        flex:1
    },
    textInput:{
        borderWidth: 1,
        padding: 2,
        width: "75%"
    },

    content:{
        flexDirection: "column",
        flex:1
    }
}