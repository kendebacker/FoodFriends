import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useEffect, useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import { ADD_POST, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch } from "../Data";
import { FontAwesome } from '@expo/vector-icons';


const StarRating = ({rating, setRating})=>{
    let start = [0,0,0,0,0]
    start = start.map((el,ind)=> el = ind<rating?1:0)

    return(
        <View style={styles.rating}>
            {start.map((el,ind) => 
            <TouchableOpacity key={ind} onPress={()=>{setRating(ind+1)}}>{el===1?
                <FontAwesome name="star" size={24} color="black" />:
                <FontAwesome name="star-o" size={24} color="black" />}
            </TouchableOpacity>)}
        </View>
    )
}


export default function FeedScreen(props){

    const {navigation, route} = props
    
    const dispatch = useDispatch()
    const posts = useSelector(state => state.posts)
    const profile = useSelector(state => state.profile)
    const camera = route.params
    const picURL = route.params===undefined?null:route.params.picture
    

    useEffect(()=>{
        setMakePostOverlay(camera!==undefined)
    }, [camera])


    const [makePostOverlay, setMakePostOverlay] = useState(camera!==undefined)
    const [showOverlay, setShowOverlay] = useState(profile.firstName==="")
    const [firstName, setFirstName] = useState(profile.firstName)
    const [lastName, setLastName] = useState(profile.lastName)
    const [image, setImage] = useState(profile.image)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [foodImage, setFoodImage] = useState("")
    const [location, setLocation] = useState("")
    const [rating, setRating] = useState(1)



    const updatePost = (post, profile)=>{
        let newLikes = post.likes.filter(el=> el === profile.email).length === 0?[...post.likes, profile.email]:post.likes.filter(el=> el !== profile.email)
        const action = {
            type: UPDATE_POST,
            payload: {...post, likes: newLikes, friends: profile.friends}
        }
        SaveAndDispatch(action, dispatch)
    }

    const updateProfile = (firstName, lastName, image,)=>{
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


    const addPost = (title, firstName, lastName,foodImage, description, rating, location, likes, poster, reposts, date)=>{
        const action = {
            type: ADD_POST,
            payload: {
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
                date:date
            }
        }
        SaveAndDispatch(action, dispatch)
    }



    return(
        <View>
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={makePostOverlay}
                onBackdropPress={()=>setMakePostOverlay(false)}>
                <Text>Title</Text>
                <TextInput
                style={styles.textInput}
                placeholder="title"
                value={title}
                onChangeText={(text)=>setTitle(text)}/>
                <Text>Rating</Text>
                <StarRating rating = {rating} setRating = {setRating} />
                <Text>Description</Text>
                <TextInput
                style={styles.textInput}
                placeholder="description"
                value={description}
                onChangeText={(text)=>setDescription(text)}/>
                {picURL===null?<Text>No picture selected yet</Text>:<Image
                style={styles.logo}
                source={{uri: picURL}}
                />}
                <Button title={"pic"} onPress={()=>{
                    setMakePostOverlay(false)
                    navigation.navigate("Camera")}}/>
                <View style={styles.submitRow}>
                    <Button
                    title={"Cancel"}
                    onPress={()=>{
                        setImage(profile.image)
                        setShowOverlay(false)
                    }}/>

                    <Button
                    title={"Post"}
                    onPress={()=>{
                        addPost(title, firstName, lastName,foodImage, description, rating, location, [], poster, [], date)
                        setShowOverlay(false)
                    }}
                    />
                </View>
            </Overlay>

            <View style={styles.content}>
                <View style={styles.inputRow}>
                    <Button title={"Refresh"} onPress={()=>{      
                        const loadGroup = {type: LOAD_POST}
                        SaveAndDispatch(loadGroup, dispatch)
                        }}/>
                    <Button title={"Post"} onPress={()=>{      
                        setMakePostOverlay(true)
                        }}/>
                    <Button title={"Settings"} onPress={()=>{      
                        const loadGroup = {type: LOAD_POST}
                        SaveAndDispatch(loadGroup, dispatch)
                        }}/>
                </View>
                <FlatList 
                style={styles.feedContainer}
                data={posts}
                renderItem={({item})=>{
                return(
                    <View style={styles.post}>
                        <View style={styles.postTitle}>
                            <Text>{item.title}</Text>
                        </View>
                        <View style={styles.postTop}>
                            <Text>{item.firstName} {item.lastName}</Text>
                            <Text>{item.date}</Text>
                        </View>
                        <View style={styles.middleContent}>
                        <Image
                                style={styles.logo}
                                source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
                                />
                        </View>
                        <View style={styles.inputRow}>
                            <Button title ={"Details"} onPress={()=>{
                                navigation.navigate("PostScreen",{
                                    post: item,
                                    saved: false
                                })}}/>
                            <View style={styles.thumb}>
                                <Text>{item.likes.length}</Text>
                                <FontAwesome name="thumbs-o-up" size={24} color="black" />
                            </View>
                            <Button title ={item.likes.filter(el=> el === profile.email).length === 0?"Like":"Unlike"} onPress={()=>{
                                    updatePost(item, profile)
                                }}/>
                        </View>
                    </View>
                )}}/>
            </View>
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={showOverlay}
                onBackdropPress={()=>setShowOverlay(false)}>
                <Text>Profile Details</Text>
                <TextInput
                placeholder="first name"
                value={firstName}
                onChangeText={(text)=>setFirstName(text)}/>
                <TextInput
                placeholder="last name"
                value={lastName}
                onChangeText={(text)=>setLastName(text)}/>
                <TextInput
                placeholder="image"
                value={image}
                onChangeText={(text)=>setImage(text)}/>
                <View style={styles.buttonRow}>
                    <Button
                    title={"Cancel"}
                    onPress={()=>{
                        setImage(profile.image)
                        setShowOverlay(false)
                    }}/>

                    <Button
                    title={"Save"}
                    onPress={()=>{
                        updateProfile(firstName, lastName, image)
                        setShowOverlay(false)
                    }}
                    />
                </View>
            </Overlay>

        </View>
    )}

const styles = {
    submitRow:{
        flexDirection: "row"
    },
    thumb:{flexDirection: "row"},
    rating:{
        flexDirection: "row",
        width: "100%",
        justifyContent: "center"
    },
middleContent:{
    justifyContent: "center",
    width: "100%",
    flexDirection: "row"
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
    postTop:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    inputRow:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingTop: 20
    },
    feedContainer:{
        width: "100%",
        backgroundColor:"blue",
        height: "80%",
    },
    post:{
        width: "90%",
        backgroundColor: "red",
        marginLeft: "5%",
        marginTop: "5%",
        padding: 10,
        borderRadius: 5,
    },
    textInput:{
        borderWidth: 1,
        padding: 2
    },

    content:{
        flexDirection: "column"
    }
}