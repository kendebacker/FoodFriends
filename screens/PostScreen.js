import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image } from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import { ADD_POST, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch } from "../Data";
import { FontAwesome } from '@expo/vector-icons';



const StarRating = ({rating})=>{
    let start = [0,0,0,0,0]
    start = start.map((el,ind)=> el = ind<rating?1:0)
    console.log(rating)

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

export default function PostScreen(props){

    const {navigation, route} = props
    const item = route.params.post

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
        <View style={styles.post}>
            <View style={styles.postTitle}>
                <Text>{item.title}</Text>
            </View>
            <View style={styles.middleContent}>
            <Image
                    style={styles.logo}
                    source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
                    />
            </View>
            <View style={styles.middleContent}>
                <Text style={styles.subtitle}>Location: </Text>
                <Text style={styles.content}></Text>
            </View>
            <View style={styles.middleContent}>
                <Text style={styles.subtitle}>Recipe: </Text>
                <Text style={styles.content}></Text>
            </View>
            <View style={styles.middleContent}>
                <Text style={styles.subtitle}>Rating: </Text>
                <StarRating rating={item.rating}/>
            </View>
            <View style={styles.middleContent}>
                <Text style={styles.subtitle}>Description: </Text>
                <Text style={styles.content}>{item.description}</Text>
            </View>
            <View style={styles.inputRow}>
                <Button title ={"Save"} onPress={()=>{
                    navigation.navigate("PostScreen",{
                        post: item
                    })}}/>
            </View>
        </View>
    )}

    const styles = {
        content:{
            marginTop: 10
        },
        subtitle:{
            fontSize: 25,
            marginTop:10
        },
        thumb:{flexDirection: "row"},
        rating:{
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
            marginTop: 10
        },
    middleContent:{
        justifyContent: "center",
        width: "100%",
        flexDirection: "column",
        alignItems: "center"
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
            width: "100%",
            backgroundColor: "red",
            marginTop: "5%",
            padding: 10,
            borderRadius: 5,
        },
    
        content:{
            flexDirection: "column"
        }
    }